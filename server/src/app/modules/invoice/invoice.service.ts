import mongoose from 'mongoose';
import PDFDocument from 'pdfkit';
import { StatusCodes } from 'http-status-codes';
import AppError from '../../errorHelpers/appError.ts';
import InvoiceModel from './invoice.model.ts';
import InvoiceProductModel from './invoice-product.model.ts';
import User from '../user/user.model.ts';
import type {
  IInvoiceDetails,
  IInvoicePdfUser,
  IInvoiceProductDetails,
} from './invoice.interface.ts';

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

const text = (value: unknown): string => String(value ?? '').trim();
const money = (value: unknown): string =>
  `BDT ${Number(value || 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const generateInvoicePdf = async (invoiceId: string, userId: string): Promise<Uint8Array> => {
  const [details, user] = await Promise.all([
    getInvoiceDetails(invoiceId, userId),
    User.findById(userId).lean<IInvoicePdfUser>(),
  ]);

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, 'User not found.');
  }

  const { invoice, products } = details;
  const customer = user.cus_address;
  const shipping = user.ship_address;
  const issuedAt = invoice.createdAt ? new Date(invoice.createdAt) : new Date();

  return new Promise<Uint8Array>((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 40, right: 40, bottom: 48, left: 40 },
      bufferPages: true,
      info: {
        Title: `Invoice ${invoice._id}`,
        Author: 'PlainB',
        Subject: `Invoice for transaction ${invoice.tran_id}`,
      },
    });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('error', reject);
    doc.on('end', () => resolve(new Uint8Array(Buffer.concat(chunks))));

    const green = '#1f9d68';
    const navy = '#172033';
    const muted = '#667085';
    const pale = '#f6f8fb';
    const line = '#e1e6ee';
    const left = 40;
    const pageWidth = 515;

    const drawHeader = () => {
      doc.font('Helvetica-Bold').fontSize(29).fillColor(navy).text('Plain', left, 40, {
        continued: true,
      });
      doc.fillColor(green).text('B');
      doc.font('Helvetica').fontSize(9).fillColor(muted).text(
        'Quality products, delivered simply.',
        left,
        74,
      );
      doc.font('Helvetica-Bold').fontSize(23).fillColor(navy).text('INVOICE', 390, 40, {
        width: 165,
        align: 'right',
      });
      doc.roundedRect(457, 70, 98, 20, 10).fill('#e8f7f0');
      doc.fontSize(8).fillColor('#137a50').text(text(invoice.payment_status).toUpperCase(), 462, 77, {
        width: 88,
        align: 'center',
      });
      doc.moveTo(left, 102).lineTo(555, 102).lineWidth(3).strokeColor(green).stroke();
    };

    const drawTableHeader = (y: number): number => {
      doc.rect(left, y, pageWidth, 27).fill(navy);
      doc.font('Helvetica-Bold').fontSize(8).fillColor('#ffffff');
      doc.text('#', 48, y + 9, { width: 22 });
      doc.text('ITEM', 75, y + 9, { width: 220 });
      doc.text('QTY', 305, y + 9, { width: 40, align: 'right' });
      doc.text('UNIT PRICE', 355, y + 9, { width: 80, align: 'right' });
      doc.text('AMOUNT', 445, y + 9, { width: 100, align: 'right' });
      return y + 27;
    };

    const addContinuationPage = (): number => {
      doc.addPage();
      doc.font('Helvetica-Bold').fontSize(16).fillColor(navy).text('Plain', left, 40, {
        continued: true,
      });
      doc.fillColor(green).text('B');
      doc.font('Helvetica').fontSize(9).fillColor(muted).text(
        `Invoice ${invoice._id} - continued`,
        280,
        45,
        { width: 275, align: 'right' },
      );
      doc.moveTo(left, 70).lineTo(555, 70).lineWidth(2).strokeColor(green).stroke();
      return drawTableHeader(88);
    };

    drawHeader();

    const meta = [
      ['INVOICE NUMBER', text(invoice._id)],
      ['TRANSACTION ID', text(invoice.tran_id)],
      ['ISSUED', issuedAt.toLocaleDateString('en-GB')],
    ];
    meta.forEach(([label, value], index) => {
      const x = left + index * 175;
      doc.roundedRect(x, 122, 165, 55, 6).fillAndStroke(pale, line);
      doc.font('Helvetica-Bold').fontSize(7).fillColor(muted).text(label, x + 10, 134);
      doc.fontSize(9).fillColor(navy).text(value, x + 10, 150, {
        width: 145,
        ellipsis: true,
      });
    });

    const billingLines = [
      text(customer?.cus_name),
      text(user.email),
      text(customer?.cus_phone),
      text(customer?.cus_address),
      text([customer?.cus_city, customer?.cus_state, customer?.cus_postcode].filter(Boolean).join(', ')),
      text(customer?.cus_country),
    ].filter(Boolean);
    const shippingLines = [
      text(shipping?.ship_name),
      text(shipping?.ship_phone),
      text(shipping?.ship_address),
      text([shipping?.ship_city, shipping?.ship_state, shipping?.ship_postcode].filter(Boolean).join(', ')),
      text(shipping?.ship_country),
    ].filter(Boolean);

    const drawAddress = (title: string, lines: string[], x: number) => {
      doc.font('Helvetica-Bold').fontSize(9).fillColor(green).text(title, x, 201);
      lines.forEach((value, index) => {
        doc
          .font(index === 0 ? 'Helvetica-Bold' : 'Helvetica')
          .fontSize(index === 0 ? 10 : 9)
          .fillColor(index === 0 ? navy : muted)
          .text(value, x, 220 + index * 14, { width: 235, ellipsis: true });
      });
    };
    drawAddress('BILL TO', billingLines, left);
    drawAddress('SHIP TO', shippingLines, 320);

    let y = drawTableHeader(318);
    products.forEach((item, index) => {
      const detail = [text(item.color), text(item.size)].filter(Boolean).join(' / ');
      doc.font('Helvetica-Bold').fontSize(9);
      const titleHeight = doc.heightOfString(text(item.product.title), { width: 215 });
      const rowHeight = Math.max(39, titleHeight + (detail ? 15 : 0) + 14);
      if (y + rowHeight > 735) y = addContinuationPage();

      doc.font('Helvetica').fontSize(9).fillColor(navy).text(String(index + 1), 48, y + 11, {
        width: 22,
      });
      doc.font('Helvetica-Bold').text(text(item.product.title), 75, y + 9, { width: 215 });
      if (detail) {
        doc.font('Helvetica').fontSize(8).fillColor(muted).text(
          detail,
          75,
          y + 11 + titleHeight,
          { width: 215 },
        );
      }
      doc.font('Helvetica').fontSize(9).fillColor(navy);
      doc.text(text(item.qty), 305, y + 11, { width: 40, align: 'right' });
      doc.text(money(item.price), 350, y + 11, { width: 85, align: 'right' });
      doc.text(money(Number(item.price) * Number(item.qty)), 440, y + 11, {
        width: 105,
        align: 'right',
      });
      doc.moveTo(left, y + rowHeight).lineTo(555, y + rowHeight).lineWidth(0.7).strokeColor(line).stroke();
      y += rowHeight;
    });

    if (y + 150 > 735) {
      doc.addPage();
      y = 65;
    } else {
      y += 18;
    }

    const summaryX = 330;
    const summaryRow = (label: string, value: string, top: number, bold = false) => {
      doc.font(bold ? 'Helvetica-Bold' : 'Helvetica').fontSize(bold ? 12 : 9).fillColor(navy);
      doc.text(label, summaryX, top, { width: 90 });
      doc.text(value, 420, top, { width: 135, align: 'right' });
    };
    summaryRow('Subtotal', money(invoice.total), y);
    summaryRow('VAT (5%)', money(invoice.vat), y + 21);
    doc.moveTo(summaryX, y + 43).lineTo(555, y + 43).lineWidth(1.5).strokeColor(navy).stroke();
    summaryRow('Total', money(invoice.payable), y + 54, true);

    const footerY = Math.max(y + 105, 700);
    doc.moveTo(left, footerY).lineTo(555, footerY).lineWidth(0.7).strokeColor(line).stroke();
    doc.font('Helvetica-Bold').fontSize(10).fillColor(green).text(
      'Thank you for shopping with PlainB.',
      left,
      footerY + 12,
    );
    doc.font('Helvetica').fontSize(8).fillColor(muted).text(
      'This invoice was generated electronically and requires no signature.',
      left,
      footerY + 28,
    );
    doc.text(
      `Payment: ${text(invoice.payment_status)}\nDelivery: ${text(invoice.delivery_status)}`,
      365,
      footerY + 12,
      { width: 190, align: 'right' },
    );

    const pageRange = doc.bufferedPageRange();
    for (let pageIndex = 0; pageIndex < pageRange.count; pageIndex += 1) {
      doc.switchToPage(pageIndex);
      doc.font('Helvetica').fontSize(7).fillColor(muted).text(
        `Page ${pageIndex + 1} of ${pageRange.count}`,
        40,
        810,
        { width: 515, align: 'center', lineBreak: false },
      );
    }
    doc.end();
  });
};

export const invoiceServices = {
  getInvoiceList,
  getInvoiceDetails,
  generateInvoicePdf,
};
