export type EmailTemplate = 'otp' | 'payment-success';

export interface IEmailTemplateData {
  name?: string;
  otp?: number;
  transactionId?: string;
  invoiceId?: string;
  amount?: string;
  currency?: string;
  paymentDate?: string;
  orderUrl?: string;
}

export interface IEmailPayload {
  to: string;
  subject: string;
  text: string;
  template: EmailTemplate;
  data: IEmailTemplateData;
}
