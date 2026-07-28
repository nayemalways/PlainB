import { ArrowRight, Package } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { EmptyState, ErrorState } from '../components/feedback/AsyncState.tsx';
import { Card } from '../components/ui/card.tsx';
import { useOrderStore } from '../features/orders/store/order.store.ts';
import { formatPrice } from '../lib/utils/format.ts';

const statusClass = (status: string) => {
  if (['paid', 'success', 'delivered'].includes(status)) {
    return 'border-green-200 bg-green-50 text-green-700';
  }
  if (['pending', 'processing'].includes(status)) {
    return 'border-amber-200 bg-amber-50 text-amber-700';
  }
  if (['failed', 'cancelled', 'canceled'].includes(status)) {
    return 'border-red-200 bg-red-50 text-red-700';
  }
  return 'border-navy-200 bg-navy-50 text-navy-600';
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${statusClass(status)}`}
    >
      {status}
    </span>
  );
}

export default function OrdersPage() {
  const { orders, status, error, load } = useOrderStore();
  useEffect(() => {
    void load();
  }, [load]);
  return (
    <PageContainer className="py-10">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-brand-700">Account</p>
        <h1 className="mt-1 text-3xl font-black">Order history</h1>
        <p className="mt-2 text-sm text-navy-500">
          Review your purchases, payment status, and delivery progress.
        </p>
      </div>
      <div className="mt-8">
        {status === 'error' ? (
          <ErrorState message={error ?? 'Unable to load orders.'} retry={() => void load()} />
        ) : !orders.length && status !== 'loading' ? (
          <EmptyState title="No orders yet" message="Completed checkouts will appear here." />
        ) : (
          <Card className="overflow-hidden">
            <div className="hidden grid-cols-[minmax(0,1fr)_130px_130px_120px_120px] gap-4 border-b bg-navy-50 px-6 py-3 text-xs font-bold uppercase tracking-wide text-navy-500 md:grid">
              <span>Order</span>
              <span>Date</span>
              <span>Payment</span>
              <span>Delivery</span>
              <span className="text-right">Total</span>
            </div>
            <div className="divide-y divide-navy-100">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="group px-5 py-5 transition-colors hover:bg-navy-50/70 md:px-6"
                >
                  <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_130px_130px_120px_120px] md:items-center">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg border bg-white text-navy-600">
                        <Package className="size-4" />
                      </div>
                      <div className="min-w-0">
                        <Link
                          className="block truncate text-sm font-extrabold text-navy-900 hover:text-brand-700"
                          to={`/account/orders/${order._id}`}
                        >
                          Order #{order._id.slice(-8).toUpperCase()}
                        </Link>
                        <p className="mt-1 truncate text-xs text-navy-500" title={order.tran_id}>
                          Transaction {order.tran_id}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-bold uppercase text-navy-400 md:hidden">Date</p>
                      <time className="text-sm text-navy-600" dateTime={order.createdAt}>
                        {new Date(order.createdAt).toLocaleDateString('en-BD', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </time>
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-bold uppercase text-navy-400 md:hidden">
                        Payment
                      </p>
                      <StatusBadge status={order.payment_status} />
                    </div>

                    <div>
                      <p className="mb-1 text-xs font-bold uppercase text-navy-400 md:hidden">
                        Delivery
                      </p>
                      <StatusBadge status={order.delivery_status} />
                    </div>

                    <div className="flex items-center justify-between gap-3 md:block md:text-right">
                      <div>
                        <p className="mb-1 text-left text-xs font-bold uppercase text-navy-400 md:hidden">
                          Total
                        </p>
                        <p className="font-black text-navy-950">{formatPrice(order.payable)}</p>
                      </div>
                      <Link
                        aria-label={`View order ${order._id}`}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 hover:text-brand-600 md:mt-2"
                        to={`/account/orders/${order._id}`}
                      >
                        Details
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}
