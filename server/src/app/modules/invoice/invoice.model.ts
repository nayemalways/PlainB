import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema(
  {
    userID: { type: mongoose.Schema.Types.ObjectId, required: true },
    payable: { type: String, required: true },
    cus_details: { type: String, required: true },
    ship_details: { type: String, required: true },
    tran_id: { type: String, required: true },
    val_id: { type: String, required: true },
    delivery_status: { type: String, required: true },
    payment_status: { type: String, required: true },
    stripe_session_id: { type: String, default: null, index: true },
    stripe_payment_intent_id: { type: String, default: null },
    total: { type: String, required: true },
    vat: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

const InvoiceModel = mongoose.model('invoices', DataSchema);

// Export Data Model
export default InvoiceModel;
