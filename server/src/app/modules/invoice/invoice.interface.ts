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

export interface IInvoicePdfUser {
  email: string;
  cus_address?: {
    cus_name?: string;
    cus_phone?: string;
    cus_address?: string;
    cus_city?: string;
    cus_state?: string;
    cus_postcode?: string;
    cus_country?: string;
  };
  ship_address?: {
    ship_name?: string;
    ship_phone?: string;
    ship_address?: string;
    ship_city?: string;
    ship_state?: string;
    ship_postcode?: string;
    ship_country?: string;
  };
}
