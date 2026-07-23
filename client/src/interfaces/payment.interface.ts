export interface ICheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
  invoiceId: string;
}

export interface IPaymentStatus {
  invoiceId: string;
  transactionId: string;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
}

export interface IApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
