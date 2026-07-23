import mongoose from 'mongoose';
import puppeteer from 'puppeteer';
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

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

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
  const productRows = products
    .map((item, index) => {
      const lineTotal = Number(item.price) * Number(item.qty);
      return `
        <tr>
          <td>${index + 1}</td>
          <td>
            <strong>${escapeHtml(item.product.title)}</strong>
            <div class="muted">${escapeHtml(item.color)} · ${escapeHtml(item.size)}</div>
          </td>
          <td class="number">${escapeHtml(item.qty)}</td>
          <td class="number">৳${Number(item.price).toFixed(2)}</td>
          <td class="number">৳${lineTotal.toFixed(2)}</td>
        </tr>`;
    })
    .join('');

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; }
        body { margin: 0; color: #172033; font-family: Arial, Helvetica, sans-serif; font-size: 12px; }
        .page { padding: 34px 40px 28px; }
        .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #1f9d68; padding-bottom: 20px; }
        .brand { font-size: 31px; font-weight: 800; letter-spacing: -1px; color: #172033; }
        .brand span { color: #1f9d68; }
        .tagline { color: #667085; margin-top: 4px; }
        .invoice-title { text-align: right; }
        .invoice-title h1 { margin: 0 0 7px; font-size: 25px; letter-spacing: 1.5px; }
        .status { display: inline-block; padding: 6px 11px; border-radius: 20px; background: #e8f7f0; color: #137a50; font-size: 10px; font-weight: 700; text-transform: uppercase; }
        .meta { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 18px; margin: 24px 0; }
        .meta-card { background: #f6f8fb; border: 1px solid #e7eaf0; border-radius: 8px; padding: 13px; }
        .label { color: #667085; font-size: 9px; font-weight: 700; letter-spacing: .7px; text-transform: uppercase; }
        .value { font-weight: 700; margin-top: 5px; word-break: break-word; }
        .addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 25px; }
        .address h3 { margin: 0 0 10px; color: #1f9d68; font-size: 11px; letter-spacing: .8px; text-transform: uppercase; }
        .address p { margin: 3px 0; line-height: 1.45; }
        table { width: 100%; border-collapse: collapse; }
        thead { background: #172033; color: white; }
        th { padding: 11px 9px; font-size: 9px; letter-spacing: .5px; text-align: left; text-transform: uppercase; }
        td { border-bottom: 1px solid #e7eaf0; padding: 12px 9px; vertical-align: top; }
        .number { text-align: right; white-space: nowrap; }
        .muted { color: #667085; font-size: 10px; margin-top: 4px; }
        .summary { width: 280px; margin: 20px 0 25px auto; }
        .summary-row { display: flex; justify-content: space-between; padding: 7px 4px; }
        .summary-row.total { border-top: 2px solid #172033; margin-top: 5px; padding-top: 11px; font-size: 15px; font-weight: 800; }
        .footer { border-top: 1px solid #d9dee8; margin-top: 25px; padding-top: 16px; display: flex; justify-content: space-between; color: #667085; font-size: 10px; line-height: 1.5; }
        .thanks { color: #1f9d68; font-weight: 700; font-size: 12px; }
      </style>
    </head>
    <body>
      <main class="page">
        <header class="header">
          <div>
            <div class="brand">Plain<span>B</span></div>
            <div class="tagline">Quality products, delivered simply.</div>
          </div>
          <div class="invoice-title">
            <h1>INVOICE</h1>
            <span class="status">${escapeHtml(invoice.payment_status)}</span>
          </div>
        </header>

        <section class="meta">
          <div class="meta-card"><div class="label">Invoice number</div><div class="value">${escapeHtml(invoice._id)}</div></div>
          <div class="meta-card"><div class="label">Transaction ID</div><div class="value">${escapeHtml(invoice.tran_id)}</div></div>
          <div class="meta-card"><div class="label">Issued</div><div class="value">${issuedAt.toLocaleDateString('en-GB')}</div></div>
        </section>

        <section class="addresses">
          <div class="address">
            <h3>Bill to</h3>
            <p><strong>${escapeHtml(customer?.cus_name)}</strong></p>
            <p>${escapeHtml(user.email)}</p>
            <p>${escapeHtml(customer?.cus_phone)}</p>
            <p>${escapeHtml(customer?.cus_address)}</p>
            <p>${escapeHtml([customer?.cus_city, customer?.cus_state, customer?.cus_postcode].filter(Boolean).join(', '))}</p>
            <p>${escapeHtml(customer?.cus_country)}</p>
          </div>
          <div class="address">
            <h3>Ship to</h3>
            <p><strong>${escapeHtml(shipping?.ship_name)}</strong></p>
            <p>${escapeHtml(shipping?.ship_phone)}</p>
            <p>${escapeHtml(shipping?.ship_address)}</p>
            <p>${escapeHtml([shipping?.ship_city, shipping?.ship_state, shipping?.ship_postcode].filter(Boolean).join(', '))}</p>
            <p>${escapeHtml(shipping?.ship_country)}</p>
          </div>
        </section>

        <table>
          <thead><tr><th>#</th><th>Item</th><th class="number">Qty</th><th class="number">Unit price</th><th class="number">Amount</th></tr></thead>
          <tbody>${productRows}</tbody>
        </table>

        <section class="summary">
          <div class="summary-row"><span>Subtotal</span><strong>৳${Number(invoice.total).toFixed(2)}</strong></div>
          <div class="summary-row"><span>VAT (5%)</span><strong>৳${Number(invoice.vat).toFixed(2)}</strong></div>
          <div class="summary-row total"><span>Total</span><span>৳${Number(invoice.payable).toFixed(2)}</span></div>
        </section>

        <footer class="footer">
          <div><div class="thanks">Thank you for shopping with PlainB.</div><div>This invoice was generated electronically and requires no signature.</div></div>
          <div style="text-align:right">Payment: ${escapeHtml(invoice.payment_status)}<br/>Delivery: ${escapeHtml(invoice.delivery_status)}</div>
        </footer>
      </main>
    </body>
  </html>`;

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    return await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '12mm', right: '10mm', bottom: '12mm', left: '10mm' },
    });
  } finally {
    await browser.close();
  }
};

export const invoiceServices = {
  getInvoiceList,
  getInvoiceDetails,
  generateInvoicePdf,
};
