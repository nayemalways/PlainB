import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SendResponse } from '../../utility/sendResponse.ts';
import { invoiceServices } from './invoice.service.ts';
import { JwtPayload } from 'jsonwebtoken';

const getInvoiceList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user as JwtPayload;
    const result = await invoiceServices.getInvoiceList(userId);
    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Invoices retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getInvoiceDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user as JwtPayload;
    const result = await invoiceServices.getInvoiceDetails(
      req.params.invoiceId as string,
      userId,
    );
    SendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Invoice details retrieved successfully.',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const downloadInvoicePdf = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.user as JwtPayload;
    const invoiceId = req.params.invoiceId as string;
    const pdf = await invoiceServices.generateInvoicePdf(invoiceId, userId);
    res
      .status(StatusCodes.OK)
      .set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceId}.pdf"`,
        'Content-Length': pdf.byteLength.toString(),
      })
      .send(Buffer.from(pdf));
  } catch (error) {
    next(error);
  }
};

export const invoiceControllers = {
  getInvoiceList,
  getInvoiceDetails,
  downloadInvoicePdf,
};
