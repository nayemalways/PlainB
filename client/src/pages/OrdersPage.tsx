import { ArrowRight, Package } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { EmptyState, ErrorState } from '../components/feedback/AsyncState.tsx';
import { Card } from '../components/ui/card.tsx';
import { useOrderStore } from '../features/orders/store/order.store.ts';
import { formatPrice } from '../lib/utils/format.ts';

export default function OrdersPage() {
  const { orders, status, error, load } = useOrderStore();
  useEffect(() => { void load(); }, [load]);
  return <PageContainer className="py-10"><div className="flex items-center gap-3"><Package className="size-8 text-brand-600" /><div><p className="text-sm font-bold text-brand-700 dark:text-brand-400">ACCOUNT</p><h1 className="text-3xl font-black">Your orders</h1></div></div><div className="mt-8 space-y-4">{status === 'error' ? <ErrorState message={error ?? 'Unable to load orders.'} retry={() => void load()} /> : !orders.length && status !== 'loading' ? <EmptyState title="No orders yet" message="Completed checkouts will appear here." /> : orders.map((order) => <Card key={order._id} className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center"><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-100 text-brand-800"><Package /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-extrabold">Order {order._id}</p><p className="mt-1 text-xs text-navy-500">{new Date(order.createdAt).toLocaleDateString('en-BD')} • Transaction {order.tran_id}</p></div><div className="flex items-center gap-3"><div className="text-right"><p className="font-black">{formatPrice(order.payable)}</p><p className="text-xs capitalize text-navy-500">{order.payment_status} • {order.delivery_status}</p></div><Link aria-label="View order" className="grid size-10 place-items-center rounded-lg bg-navy-950 text-white dark:bg-brand-500 dark:text-navy-950" to={`/account/orders/${order._id}`}><ArrowRight className="size-4" /></Link></div></Card>)}</div></PageContainer>;
}
