import type { PaymentStatus } from '../invoice/invoice.interface.ts';

export interface TransactionHistoryQuery {
  status?: string;
  page?: string;
  limit?: string;
}

export interface TransactionHistoryItem {
  id: string;
  transaction: string;
  customer: string;
  email: string;
  amount: number;
  status: PaymentStatus;
  date: Date;
}

export interface TransactionHistoryResult {
  items: TransactionHistoryItem[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
