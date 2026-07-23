import { Heart, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { EmptyState, ErrorState, LoadingGrid } from '../components/feedback/AsyncState.tsx';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { ProductPrice } from '../features/products/components/ProductPrice.tsx';
import { Rating } from '../features/products/components/Rating.tsx';
import { useWishlistStore } from '../features/wishlist/store/wishlist.store.ts';

export default function WishlistPage() {
  const { items, status, error, load, remove } = useWishlistStore();
  useEffect(() => { void load(); }, [load]);
  return <PageContainer className="py-10"><div className="flex items-center gap-3"><Heart className="size-8 text-brand-600" /><div><p className="text-sm font-bold text-brand-700 dark:text-brand-400">SAVED FOR LATER</p><h1 className="text-3xl font-black">Your wishlist</h1></div></div><div className="mt-8">{status === 'loading' || status === 'idle' ? <LoadingGrid /> : status === 'error' ? <ErrorState message={error ?? 'Unable to load wishlist.'} retry={() => void load()} /> : !items.length ? <EmptyState title="Your wishlist is empty" message="Use the heart action to save products here." /> : <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{items.map((item) => <Card key={item._id} className="overflow-hidden"><Link to={`/products/${item.products._id}`}><div className="aspect-square"><img src={item.products.images[0]} alt={item.products.title} className="size-full object-cover" /></div><div className="space-y-2 p-4"><h2 className="line-clamp-2 min-h-10 text-sm font-extrabold">{item.products.title}</h2><Rating value={item.products.star} /><ProductPrice product={item.products} /></div></Link><div className="p-4 pt-0"><Button variant="destructive" size="sm" className="w-full" onClick={() => void remove(item.products._id)}><Trash2 className="size-4" />Remove</Button></div></Card>)}</div>}</div></PageContainer>;
}
