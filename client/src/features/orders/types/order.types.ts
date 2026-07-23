export interface Invoice {
  _id: string;
  tran_id: string;
  payment_status: string;
  delivery_status: string;
  total: string;
  vat: string;
  payable: string;
  createdAt: string;
}
export interface InvoiceProduct {
  _id: string;
  productID: string;
  qty: string;
  price: string;
  color: string;
  size: string;
  product: { title: string; images: string[]; des: string };
}
export interface InvoiceDetails { invoice: Invoice; products: InvoiceProduct[] }
