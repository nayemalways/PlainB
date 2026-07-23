import mongoose from 'mongoose';
import Stripe from 'stripe';
import { StatusCodes } from 'http-status-codes';
import {
  FRONTEND_URL,
  STRIPE_CURRENCY,
  STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET,
} from '../../config/config.ts';
import AppError from '../../errorHelpers/appError.ts';
import CartModel from '../cart/cart.model.ts';
import User from '../user/user.model.ts';
import InvoiceModel from '../invoice/invoice.model.ts';
import InvoiceProductModel from '../invoice/invoice-product.model.ts';
import type {
  ICheckoutCartProduct,
  ICheckoutResponse,
  IPaymentStatusResponse,
} from './payment.interface.ts';

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

const getStripe = (): Stripe => {
  if (!stripe) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Stripe is not configured. Set STRIPE_SECRET_KEY.',
    );
  }
  return stripe;
};

const createCheckoutSession = async (
  userId: string,
  userEmail: string,
): Promise<ICheckoutResponse> => {
  const objectUserId = new mongoose.Types.ObjectId(userId);
  const cartProducts = await CartModel.aggregate<ICheckoutCartProduct>([
    { $match: { userId: objectUserId } },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
  ]);

  if (!cartProducts.length) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Your cart is empty.');
  }

  const profile = await User.findById(objectUserId).lean();
  if (!profile) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User profile not found.');
  }

  const total = cartProducts.reduce((sum, item) => {
    const price = Number(item.product.discount ? item.product.discountPrice : item.product.price);
    if (!Number.isFinite(price) || price < 0 || !Number.isFinite(Number(item.qty))) {
      throw new AppError(StatusCodes.BAD_REQUEST, 'A cart item has an invalid price or quantity.');
    }
    return sum + price * Number(item.qty);
  }, 0);
  const vat = total * 0.05;
  const payable = total + vat;
  const transactionId = crypto.randomUUID();

  const invoice = await InvoiceModel.create({
    userID: objectUserId,
    payable: payable.toFixed(2),
    cus_details: `Name: ${profile.cus_address?.cus_name}, Email: ${userEmail}, Address: ${profile.cus_address?.cus_address}, Phone: ${profile.cus_address?.cus_phone}, City: ${profile.cus_address?.cus_city}, Country: ${profile.cus_address?.cus_country}`,
    ship_details: `Name: ${profile.ship_address?.ship_name}, Address: ${profile.ship_address?.ship_address}, Phone: ${profile.ship_address?.ship_phone}, City: ${profile.ship_address?.ship_city}, Country: ${profile.ship_address?.ship_country}`,
    tran_id: transactionId,
    val_id: '0',
    delivery_status: 'pending',
    payment_status: 'pending',
    total: total.toFixed(2),
    vat: vat.toFixed(2),
  });

  try {
    await InvoiceProductModel.insertMany(
      cartProducts.map((item) => ({
        userID: objectUserId,
        productID: item.productId,
        invoiceID: invoice._id,
        qty: item.qty,
        price: item.product.discount ? item.product.discountPrice : item.product.price,
        color: item.color,
        size: item.size,
      })),
    );

    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      customer_email: userEmail,
      client_reference_id: invoice.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: STRIPE_CURRENCY,
            unit_amount: Math.round(payable * 100),
            product_data: {
              name: `PlainB order ${transactionId}`,
              description: `${cartProducts.length} cart item(s), including 5% VAT`,
            },
          },
        },
      ],
      metadata: {
        invoiceId: invoice.id,
        transactionId,
        userId,
      },
      success_url: `${FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/payment/cancel?invoice_id=${invoice.id}`,
    });

    if (!session.url) {
      throw new Error('Stripe did not return a checkout URL.');
    }

    invoice.stripe_session_id = session.id;
    await invoice.save();

    return { checkoutUrl: session.url, sessionId: session.id, invoiceId: invoice.id };
  } catch (error) {
    await Promise.all([
      InvoiceProductModel.deleteMany({ invoiceID: invoice._id }),
      InvoiceModel.deleteOne({ _id: invoice._id }),
    ]);
    throw error;
  }
};

const handleStripeWebhook = async (
  rawBody: Buffer,
  signature: string | string[] | undefined,
): Promise<void> => {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      'Stripe is not configured. Set STRIPE_WEBHOOK_SECRET.',
    );
  }
  if (!signature || Array.isArray(signature)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Missing Stripe signature.');
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, STRIPE_WEBHOOK_SECRET);
  } catch {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid Stripe webhook signature.');
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const invoiceId = session.metadata?.invoiceId ?? session.client_reference_id;

  if (!invoiceId) return;

  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    if (session.payment_status !== 'paid') return;
    await InvoiceModel.updateOne(
      { _id: invoiceId, payment_status: { $ne: 'paid' } },
      {
        payment_status: 'paid',
        stripe_payment_intent_id:
          typeof session.payment_intent === 'string' ? session.payment_intent : null,
      },
    );
    if (session.metadata?.userId) {
      await CartModel.deleteMany({ userId: session.metadata.userId });
    }
  } else if (event.type === 'checkout.session.async_payment_failed') {
    await InvoiceModel.updateOne({ _id: invoiceId }, { payment_status: 'failed' });
  } else if (event.type === 'checkout.session.expired') {
    await InvoiceModel.updateOne(
      { _id: invoiceId, payment_status: 'pending' },
      { payment_status: 'cancelled' },
    );
  }
};

const getPaymentStatus = async (
  sessionId: string,
  userId: string,
): Promise<IPaymentStatusResponse> => {
  const invoice = await InvoiceModel.findOne({
    stripe_session_id: sessionId,
    userID: userId,
  }).lean();

  if (!invoice) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Payment not found.');
  }

  let status: IPaymentStatusResponse['status'] = 'pending';
  if (invoice.payment_status === 'paid' || invoice.payment_status === 'success') status = 'paid';
  if (invoice.payment_status === 'failed') status = 'failed';
  if (invoice.payment_status === 'cancelled' || invoice.payment_status === 'cancel') {
    status = 'cancelled';
  }

  return {
    invoiceId: invoice._id.toString(),
    transactionId: invoice.tran_id,
    status,
    amount: Number(invoice.payable),
    currency: STRIPE_CURRENCY.toUpperCase(),
  };
};

const cancelPayment = async (invoiceId: string, userId: string): Promise<void> => {
  const result = await InvoiceModel.updateOne(
    { _id: invoiceId, userID: userId, payment_status: 'pending' },
    { payment_status: 'cancelled' },
  );

  if (!result.matchedCount) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Pending payment not found.');
  }
};


export const paymentServices = {
  createCheckoutSession,
  handleStripeWebhook,
  getPaymentStatus,
  cancelPayment
}

