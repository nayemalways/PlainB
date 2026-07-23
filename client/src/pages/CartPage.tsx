import { ShoppingBag, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { EmptyState, ErrorState } from '../components/feedback/AsyncState.tsx';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { useCartStore } from '../features/cart/store/cart.store.ts';
import { formatPrice } from '../lib/utils/format.ts';

export default function CartPage() {
  const { items, status, checkoutStatus, error, load, remove, checkout } = useCartStore();
  useEffect(() => { void load(); }, [load]);
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.discount ? item.product.discountPrice : item.product.price) * Number(item.qty), 0);
  const vat = subtotal * 0.05;

  return (
    <PageContainer className="py-10">
      <div className="flex items-center gap-3"><ShoppingBag className="size-8 text-brand-600" /><div><p className="text-sm font-bold text-brand-700 dark:text-brand-400">YOUR BAG</p><h1 className="text-3xl font-black">Shopping cart</h1></div></div>
      {status === 'error' ? <div className="mt-8"><ErrorState message={error ?? 'Unable to load cart.'} retry={() => void load()} /></div> : !items.length && status !== 'loading' ? <div className="mt-8"><EmptyState title="Your cart is empty" message="Explore the marketplace and add something you like." /></div> : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <Card className="divide-y overflow-hidden">
            {items.map((item) => {
              const price = Number(item.product.discount ? item.product.discountPrice : item.product.price);
              return <article key={item._id} className="grid grid-cols-[92px_1fr_auto] gap-4 p-4 sm:p-6"><img src={item.product.images[0]} alt={item.product.title} className="aspect-square size-[92px] rounded-xl object-cover" /><div><h2 className="font-extrabold">{item.product.title}</h2><p className="mt-2 text-xs text-navy-500">Color: {item.color} • Size: {item.size} • Qty: {item.qty}</p><p className="mt-3 font-black">{formatPrice(price * Number(item.qty))}</p></div><Button variant="ghost" size="icon" aria-label={`Remove ${item.product.title}`} onClick={() => void remove(item.productId).then(() => toast.success('Removed from cart'))}><Trash2 className="size-5 text-red-600" /></Button></article>;
            })}
          </Card>
          <Card className="h-fit p-6">
            <h2 className="text-xl font-black">Order summary</h2>
            <dl className="mt-6 space-y-4 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd className="font-bold">{formatPrice(subtotal)}</dd></div><div className="flex justify-between"><dt>VAT (5%)</dt><dd className="font-bold">{formatPrice(vat)}</dd></div><div className="flex justify-between border-t pt-4 text-base"><dt className="font-black">Payable</dt><dd className="font-black">{formatPrice(subtotal + vat)}</dd></div></dl>
            {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}
            <Button className="mt-6 w-full" size="lg" disabled={checkoutStatus === 'loading'} onClick={() => void checkout()}>{checkoutStatus === 'loading' ? 'Opening secure checkout…' : 'Continue to checkout'}</Button>
            <p className="mt-3 text-center text-xs text-navy-500">You will continue through the configured Stripe Checkout page.</p>
          </Card>
        </div>
      )}
    </PageContainer>
  );
}
