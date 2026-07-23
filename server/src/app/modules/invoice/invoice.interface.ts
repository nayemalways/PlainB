import type { Types } from 'mongoose';

export interface IInvoiceProductDetails {
  _id: Types.ObjectId;
  productID: Types.ObjectId;
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
  invoice: {
    _id: Types.ObjectId;
    tran_id: string;
    payment_status: string;
    delivery_status: string;
    total: string;
    vat: string;
    payable: string;
    createdAt?: Date;
  };
  products: IInvoiceProductDetails[];
}
