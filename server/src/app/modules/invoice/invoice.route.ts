import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import * as invoiceController from './invoice.controller.ts';
import { Role } from '../user/user.interface.ts';

const router = express.Router();

router.get('/CreateInvoice', checkAuth(Role.USER), invoiceController.CreateInvoice);
router.get('/InvoiceList', checkAuth(Role.USER), invoiceController.InvoiceList);
router.get(
  '/InvoiceProductList/:invoice_id',
  checkAuth(Role.USER),
  invoiceController.InvoiceProductList,
);
router.post('/PaymentSuccess/:trxID', invoiceController.PaymentSuccess);
router.post('/PaymentCancel/:trxID', invoiceController.PaymentCancel);
router.post('/PaymentFail/:trxID', invoiceController.PaymentFail);
router.post('/PaymentIPN/:trxID', invoiceController.PaymentIPN);

export const invoiceRouter = router;
