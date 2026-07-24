/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SendResponse } from '../../utility/sendResponse.ts';
import { paymentServices } from './payment.service.ts';
import { JwtPayload } from 'jsonwebtoken';
import { CatchAsync } from '../../utility/CatchAsync.ts';

// STRIPE CHECKOUT
const checkout = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;
    const result = await paymentServices.createCheckoutSession(userId, req.user.email);

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: 'Stripe Checkout session created.',
      data: result,
    });
})

// WEBHOOK
const webhook = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await paymentServices.handleStripeWebhook(req.body as Buffer, req.headers['stripe-signature']);
    res.status(StatusCodes.OK).json({ received: true });
}) ;

// PAYMENT STATUS
const status = CatchAsync( async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;

    const result = await paymentServices.getPaymentStatus(req.params.sessionId as string, userId);
    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Payment status retrieved.',
      data: result,
    });
});

// PAYMENT CANCEL
const cancel = CatchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.user as JwtPayload;
    await paymentServices.cancelPayment(req.params.invoiceId as string, userId);

    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Payment cancelled.',
      data: null,
    });
});

export const paymentControllers = {
  checkout,
  webhook,
  status,
  cancel
}
