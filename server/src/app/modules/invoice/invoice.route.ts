import express from 'express';
import { checkAuth } from '../../middlewares/AuthMiddleware.ts';
import { Role } from '../user/user.interface.ts';
import { invoiceControllers } from './invoice.controller.ts';

const router = express.Router();

router.get('/', checkAuth(Role.USER), invoiceControllers.getInvoiceList);
router.get('/:invoiceId/pdf', checkAuth(Role.USER), invoiceControllers.downloadInvoicePdf);
router.get('/:invoiceId', checkAuth(Role.USER), invoiceControllers.getInvoiceDetails);

export const invoiceRouter = router;
