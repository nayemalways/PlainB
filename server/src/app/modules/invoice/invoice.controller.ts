import { FRONTEND_URL } from '../../config/config.ts';
import {
  CreateInvoiceService,
  PaymentFailService,
  PaymentCancelService,
  PaymentIPNService,
  PaymentSuccessService,
  InvoiceListService,
  InvoiceProductListService,
} from './invoice.service.ts';
import { SendResponse } from '../../utility/SendResponse.ts';

// INVOICE CONTROLLER FUNCTION
export const CreateInvoice = async (req, res, next) => {
  try {
    const result = await CreateInvoiceService(req);
    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Invoice created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const InvoiceList = async (req, res, next) => {
  try {
    const result = await InvoiceListService(req);
    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Invoices retrieved successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const InvoiceProductList = async (req, res) => {
  const result = await InvoiceProductListService(req);
  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Invoice products retrieved successfully',
    data: result,
  });
};

// PAYMENT CONTROLLER FUNCTION

export const PaymentSuccess = async (req, res) => {
  const result = await PaymentSuccessService(req);
  if (result.payment_status === 'success') {
    res.redirect(`${FRONTEND_URL}/payment/${result.payment_status}/${result.tran_id}`);
  } else {
    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Payment verification failed',
      data: result,
    });
  }
};

export const PaymentFail = async (req, res) => {
  const result = await PaymentFailService(req);
  if (result.payment_status === 'fail') {
    res.redirect(`${FRONTEND_URL}/payment/${result.payment_status}/${result.tran_id}`);
  } else {
    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Payment verification failed',
      data: result,
    });
  }
};

export const PaymentCancel = async (req, res) => {
  const result = await PaymentCancelService(req);
  if (result.payment_status === 'cancel') {
    res.redirect(`${FRONTEND_URL}/payment/${result.payment_status}/${result.tran_id}`);
  } else {
    SendResponse(res, {
      success: true,
      statusCode: 200,
      message: 'Payment verification failed',
      data: result,
    });
  }
};

export const PaymentIPN = async (req, res) => {
  const result = await PaymentIPNService(req);
  if (result.status === 'Success') {
    res.redirect('/payment');
    return;
  }

  SendResponse(res, {
    success: true,
    statusCode: 200,
    message: 'Payment notification failed',
    data: result,
  });
};
