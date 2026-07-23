import type { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { SendResponse } from '../../utility/sendResponse.ts';
import { invoiceServices } from './invoice.service.ts';

const getInvoiceList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await invoiceServices.getInvoiceList(req.user.userId);
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
    const result = await invoiceServices.getInvoiceDetails(
      req.params.invoiceId as string,
      req.user.userId,
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

export const invoiceControllers = {
  getInvoiceList,
  getInvoiceDetails,
};
