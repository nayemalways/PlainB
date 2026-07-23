import { CheckCircle2, CircleX, Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { api } from '../lib/api/client.ts';
import { formatPrice } from '../lib/utils/format.ts';
import type { ApiResponse } from '../types/api.ts';

interface PaymentStatus { status: 'pending' | 'paid' | 'failed' | 'cancelled'; transactionId: string; amount: number; currency: string }

export default function PaymentPage() {
  const { pathname, search } = useLocation();
  const params = new URLSearchParams(search);
  const sessionId = params.get('session_id');
  const invoiceId = params.get('invoice_id');
  const cancelled = pathname.endsWith('/cancel');
  const [payment, setPayment] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let timer: number | undefined;
    if (cancelled && invoiceId) { void api.patch(`/payment/cancel/${invoiceId}`).catch(() => setError('The order status could not be updated.')); return; }
    if (!sessionId) { setError('Payment session information is missing.'); return; }
    let attempts = 0;
    const check = async () => { try { const { data } = await api.get<ApiResponse<PaymentStatus>>(`/payment/status/${sessionId}`); setPayment(data.data); attempts += 1; if (data.data.status === 'pending' && attempts < 10) timer = window.setTimeout(() => void check(), 1500); } catch { setError('We could not verify this payment. Check your orders for the latest status.'); } };
    void check();
    return () => window.clearTimeout(timer);
  }, [cancelled, invoiceId, sessionId]);
  const status = cancelled ? 'cancelled' : payment?.status;
  const success = status === 'paid';
  const pending = !cancelled && !error && (!payment || status === 'pending');
  const Icon = success ? CheckCircle2 : pending ? Clock3 : CircleX;
  return <PageContainer className="py-16"><Card className="mx-auto max-w-2xl p-8 text-center"><Icon className={`mx-auto size-16 ${success ? 'text-brand-600' : pending ? 'text-amber-500' : 'text-red-600'}`} /><h1 className="mt-5 text-3xl font-black">{success ? 'Payment successful' : pending ? 'Confirming your payment' : 'Payment not completed'}</h1><p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-navy-500 dark:text-navy-300">{error || (success ? 'Stripe confirmed your payment and your order is ready for processing.' : pending ? 'Stripe is processing the payment. This page updates automatically.' : 'Your checkout was cancelled. You can return to your cart and try again.')}</p>{payment && <dl className="mx-auto mt-7 max-w-sm rounded-xl bg-navy-50 p-4 text-left text-sm dark:bg-navy-800"><div className="flex justify-between"><dt>Transaction</dt><dd className="font-bold">{payment.transactionId}</dd></div><div className="mt-3 flex justify-between"><dt>Amount</dt><dd className="font-bold">{formatPrice(payment.amount)}</dd></div></dl>}<div className="mt-7 flex flex-wrap justify-center gap-3"><Button asChild variant="secondary"><Link to="/account/orders">View orders</Link></Button><Button asChild variant="outline"><Link to={success ? '/' : '/cart'}>{success ? 'Continue shopping' : 'Return to cart'}</Link></Button></div></Card></PageContainer>;
}
