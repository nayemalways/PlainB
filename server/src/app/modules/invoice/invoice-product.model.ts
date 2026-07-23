import mongoose from 'mongoose';
import type { IInvoiceProduct } from './invoice.interface.ts';

const DataSchema = new mongoose.Schema<IInvoiceProduct>(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    productID: { type: mongoose.Schema.Types.ObjectId, required: true },
    invoiceID: { type: mongoose.Schema.Types.ObjectId, required: true },
    qty: { type: String, required: true },
    price: { type: String, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

const InvoiceProductsModel = mongoose.model<IInvoiceProduct>('invoiceproducts', DataSchema);

// Export Data Model
export default InvoiceProductsModel;
