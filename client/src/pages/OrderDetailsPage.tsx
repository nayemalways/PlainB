import { ArrowLeft, Download } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { ErrorState } from '../components/feedback/AsyncState.tsx';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { useOrderStore } from '../features/orders/store/order.store.ts';
import { formatPrice } from '../lib/utils/format.ts';

export default function OrderDetailsPage() {
  const { invoiceId = '' } = useParams();
  const { details, status, error, downloading, loadDetails, downloadPdf } = useOrderStore();
  useEffect(() => { if (invoiceId) void loadDetails(invoiceId); }, [invoiceId, loadDetails]);
  if (status === 'error') return <PageContainer className="py-10"><ErrorState message={error ?? 'Order not found.'} /></PageContainer>;
  if (!details) return <PageContainer className="py-20 text-center font-bold">Loading order…</PageContainer>;
  const { invoice, products } = details;
  return <PageContainer className="py-10"><Link className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-400" to="/account/orders"><ArrowLeft className="size-4" />Back to orders</Link><div className="mt-5 flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-bold text-brand-700 dark:text-brand-400">ORDER DETAILS</p><h1 className="mt-1 text-3xl font-black">{invoice._id}</h1><p className="mt-2 text-sm text-navy-500">Transaction {invoice.tran_id}</p></div><Button variant="outline" disabled={downloading} onClick={() => void downloadPdf(invoice._id)}><Download className="size-4" />{downloading ? 'Generating…' : 'Download PDF'}</Button></div><div className="mt-8 grid gap-8 lg:grid-cols-[1fr_340px]"><Card className="divide-y">{products.map((item) => <article key={item._id} className="flex gap-4 p-5"><img src={item.product.images[0]} alt={item.product.title} className="size-20 rounded-xl object-cover" /><div className="flex-1"><h2 className="font-extrabold">{item.product.title}</h2><p className="mt-1 text-xs text-navy-500">{item.color} • {item.size} • Qty {item.qty}</p><p className="mt-2 font-black">{formatPrice(Number(item.price) * Number(item.qty))}</p></div></article>)}</Card><Card className="h-fit p-6"><h2 className="font-black">Summary</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(invoice.total)}</dd></div><div className="flex justify-between"><dt>VAT</dt><dd>{formatPrice(invoice.vat)}</dd></div><div className="flex justify-between border-t pt-3 text-base font-black"><dt>Paid total</dt><dd>{formatPrice(invoice.payable)}</dd></div><div className="flex justify-between"><dt>Payment</dt><dd className="capitalize">{invoice.payment_status}</dd></div><div className="flex justify-between"><dt>Delivery</dt><dd className="capitalize">{invoice.delivery_status}</dd></div></dl></Card></div></PageContainer>;
}
