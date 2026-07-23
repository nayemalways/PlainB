import mongoose from 'mongoose';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import InvoiceModel from './invoice.model.ts';
import InvoiceProductModel from './invoice-product.model.ts';
import type { IInvoiceDetails, IInvoiceProductDetails } from './invoice.interface.ts';

const getInvoiceList = async (userId: string) => {
  return InvoiceModel.find({ userID: userId }).sort({ createdAt: -1 }).lean();
};

const getInvoiceDetails = async (
  invoiceId: string,
  userId: string,
): Promise<IInvoiceDetails> => {
  if (!mongoose.isValidObjectId(invoiceId)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Invalid invoice ID.');
  }

  const invoice = await InvoiceModel.findOne({ _id: invoiceId, userID: userId }).lean();
  if (!invoice) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Invoice not found.');
  }

  const products = await InvoiceProductModel.aggregate<IInvoiceProductDetails>([
    {
      $match: {
        userID: new mongoose.Types.ObjectId(userId),
        invoiceID: new mongoose.Types.ObjectId(invoiceId),
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productID',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $project: {
        productID: 1,
        qty: 1,
        price: 1,
        color: 1,
        size: 1,
        'product.title': 1,
        'product.images': 1,
        'product.des': 1,
      },
    },
  ]);

  return {
    invoice: {
      _id: invoice._id,
      tran_id: invoice.tran_id,
      payment_status: invoice.payment_status,
      delivery_status: invoice.delivery_status,
      total: invoice.total,
      vat: invoice.vat,
      payable: invoice.payable,
      createdAt: invoice.createdAt,
    },
    products,
  };
};

export const invoiceServices = {
  getInvoiceList,
  getInvoiceDetails,
};
