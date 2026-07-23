export interface IInvoice {
  _id: string;
  tran_id: string;
  payment_status: string;
  delivery_status: string;
  total: string;
  vat: string;
  payable: string;
  createdAt: string;
}

export interface IInvoiceProduct {
  _id: string;
  productID: string;
  qty: string;
  price: string;
  color: string;
  size: string;
  product: {
    title: string;
    images: string[];
    des: string;
  };
}

export interface IInvoiceDetails {
  invoice: IInvoice;
  products: IInvoiceProduct[];
}

export interface IInvoiceApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IInvoiceState {
  invoiceList: IInvoice[];
  invoiceDetails: IInvoiceDetails | null;
  isLoading: boolean;
  isPdfDownloading: boolean;
  invoiceListRequest: () => Promise<void>;
  invoiceDetailsRequest: (invoiceId: string) => Promise<void>;
  downloadInvoicePdf: (invoiceId: string) => Promise<void>;
}
