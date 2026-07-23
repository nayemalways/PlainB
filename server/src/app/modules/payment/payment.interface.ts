import type { Types } from 'mongoose';

export interface ICheckoutCartProduct {
  productId: Types.ObjectId;
  qty: string;
  color: string;
  size: string;
  product: {
    title: string;
    price: string;
    discount: boolean;
    discountPrice: string;
  };
}

export interface ICheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  invoiceId: string;
}

export interface IPaymentStatusResponse {
  invoiceId: string;
  transactionId: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
}
