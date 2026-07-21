import express from 'express';
import { UserAuthentication } from '../../middlewares/AuthMiddleware.ts';
import * as invoiceController from './invoice.controller.ts';

const router = express.Router();

router.get('/CreateInvoice', UserAuthentication, invoiceController.CreateInvoice);
router.get('/InvoiceList', UserAuthentication, invoiceController.InvoiceList);
router.get(
  '/InvoiceProductList/:invoice_id',
  UserAuthentication,
  invoiceController.InvoiceProductList,
);
router.post('/PaymentSuccess/:trxID', invoiceController.PaymentSuccess);
router.post('/PaymentCancel/:trxID', invoiceController.PaymentCancel);
router.post('/PaymentFail/:trxID', invoiceController.PaymentFail);
router.post('/PaymentIPN/:trxID', invoiceController.PaymentIPN);

export const invoiceRouter = router;
