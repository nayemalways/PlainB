import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SendResponse } from '../../utility/sendResponse.ts';
import { paymentServices } from './payment.service.ts';

// STRIPE CHECKOUT
const checkout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paymentServices.createCheckoutSession(req.user.userId, req.user.email);
    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Stripe Checkout session created.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// WEBHOOK
const webhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await paymentServices.handleStripeWebhook(req.body as Buffer, req.headers['stripe-signature']);
    res.status(StatusCodes.OK).json({ received: true });
  } catch (error) {
    next(error);
  }
};

// PAYMENT STATUS
const status = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await paymentServices.getPaymentStatus(req.params.sessionId as string, req.user.userId);
    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Payment status retrieved.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// PAYMENT CANCEL
const cancel = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await paymentServices.cancelPayment(req.params.invoiceId as string, req.user.userId);
    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Payment cancelled.',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

export const paymentControllers = {
  checkout,
  webhook,
  status,
  cancel
}
