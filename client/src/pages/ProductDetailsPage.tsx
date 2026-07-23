import * as Tabs from '@radix-ui/react-tabs';
import { ChevronRight, Heart, Minus, Plus, ShoppingBag, Truck } from 'lucide-react';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { ErrorState, LoadingGrid } from '../components/feedback/AsyncState.tsx';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { useAuthStore } from '../features/auth/store/auth.store.ts';
import { useCartStore } from '../features/cart/store/cart.store.ts';
import { ProductPrice } from '../features/products/components/ProductPrice.tsx';
import { ProductGrid } from '../features/products/components/ProductGrid.tsx';
import { Rating } from '../features/products/components/Rating.tsx';
import { useProductStore } from '../features/products/store/product.store.ts';
import { productsApi } from '../features/products/api/products.api.ts';
import type { Product } from '../features/products/types/product.types.ts';
import { useReviewStore } from '../features/reviews/store/review.store.ts';
import { useWishlistStore } from '../features/wishlist/store/wishlist.store.ts';

export default function ProductDetailsPage() {
  const { productId = '' } = useParams();
  const { product, detailStatus, error, loadProduct } = useProductStore();
  const reviews = useReviewStore((state) => state.reviews);
  const loadReviews = useReviewStore((state) => state.load);
  const addCart = useCartStore((state) => state.add);
  const addWish = useWishlistStore((state) => state.add);
  const user = useAuthStore((state) => state.user);
  const [thumbs, setThumbs] = useState<SwiperInstance | null>(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [related, setRelated] = useState<Product[]>([]);

  useEffect(() => { if (productId) void Promise.all([loadProduct(productId), loadReviews(productId)]); }, [loadProduct, loadReviews, productId]);
  useEffect(() => { setSize(''); setColor(''); setQuantity(1); }, [productId]);
  useEffect(() => {
    const categoryId = product?.category?._id ?? product?.categoryId;
    if (!categoryId) return;
    void productsApi
      .byCategory(categoryId, { limit: 4, sort: 'rating' })
      .then((page) => setRelated(page.items.filter((item) => item._id !== productId).slice(0, 4)));
  }, [product, productId]);

  if (detailStatus === 'loading' || detailStatus === 'idle') return <PageContainer className="py-12"><LoadingGrid count={2} /></PageContainer>;
  if (detailStatus === 'error' || !product) return <PageContainer className="py-12"><ErrorState message={error ?? 'Product not found.'} retry={() => void loadProduct(productId)} /></PageContainer>;

  const sizes = product.size.split(',').map((value) => value.trim()).filter(Boolean);
  const colors = product.color.split(',').map((value) => value.trim()).filter(Boolean);
  const addToCart = async () => {
    if (!user) { toast.error('Sign in to add products to your cart.'); return; }
    if (!size || !color) { toast.error('Choose a size and color first.'); return; }
    try { await addCart({ productId: product._id, qty: quantity, size, color }); toast.success('Added to cart'); }
    catch { toast.error('Could not add this product.'); }
  };

  return (
    <PageContainer className="py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-sm text-navy-500"><Link to="/">Home</Link><ChevronRight className="size-4" /><Link to="/search">Products</Link><ChevronRight className="size-4" /><span className="truncate font-bold text-navy-900 dark:text-white">{product.title}</span></nav>
      <div className="grid gap-9 lg:grid-cols-2">
        <div>
          <Swiper modules={[FreeMode, Navigation, Thumbs]} navigation thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }} className="overflow-hidden rounded-[2rem] bg-white dark:bg-navy-900">
            {product.images.map((image) => <SwiperSlide key={image}><div className="aspect-square"><img src={image} alt={product.title} className="size-full object-contain" /></div></SwiperSlide>)}
          </Swiper>
          <Swiper onSwiper={setThumbs} modules={[FreeMode, Thumbs]} slidesPerView={5} spaceBetween={10} freeMode watchSlidesProgress className="mt-3">{product.images.map((image, index) => <SwiperSlide key={image}><button aria-label={`View image ${index + 1}`} className="aspect-square overflow-hidden rounded-xl border bg-white dark:bg-navy-900"><img src={image} alt="" className="size-full object-cover" /></button></SwiperSlide>)}</Swiper>
        </div>
        <div className="py-2">
          <div className="flex flex-wrap gap-2"><span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-extrabold text-brand-800">{product.remark}</span><span className={`rounded-full px-3 py-1 text-xs font-extrabold ${product.stock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>{product.stock ? 'In stock' : 'Out of stock'}</span></div>
          <h1 className="mt-5 text-3xl font-black leading-tight sm:text-5xl">{product.title}</h1>
          <div className="mt-4 flex items-center gap-3"><Rating value={product.star} showValue /><span className="text-sm text-navy-500">{reviews.length} reviews</span></div>
          <div className="mt-6"><ProductPrice product={product} large /></div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <fieldset><legend className="mb-3 text-sm font-extrabold">Choose size</legend><div className="flex flex-wrap gap-2">{sizes.map((value) => <button key={value} onClick={() => setSize(value)} className={`min-h-11 rounded-xl border px-4 text-sm font-bold ${size === value ? 'border-brand-500 bg-brand-50 text-brand-800 dark:bg-brand-900/30' : 'bg-white dark:bg-navy-900'}`}>{value}</button>)}</div></fieldset>
            <fieldset><legend className="mb-3 text-sm font-extrabold">Choose color</legend><div className="flex flex-wrap gap-2">{colors.map((value) => <button key={value} onClick={() => setColor(value)} className={`min-h-11 rounded-xl border px-4 text-sm font-bold ${color === value ? 'border-brand-500 bg-brand-50 text-brand-800 dark:bg-brand-900/30' : 'bg-white dark:bg-navy-900'}`}>{value}</button>)}</div></fieldset>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="flex h-12 items-center rounded-xl border bg-white dark:bg-navy-900"><button aria-label="Decrease quantity" disabled={quantity <= 1} onClick={() => setQuantity((value) => value - 1)} className="grid size-12 place-items-center disabled:opacity-30"><Minus className="size-4" /></button><output className="w-10 text-center font-black">{quantity}</output><button aria-label="Increase quantity" onClick={() => setQuantity((value) => value + 1)} className="grid size-12 place-items-center"><Plus className="size-4" /></button></div>
            <Button size="lg" disabled={!product.stock} onClick={() => void addToCart()}><ShoppingBag className="size-5" />Add to cart</Button>
            <Button size="lg" variant="outline" aria-label="Add to wishlist" onClick={() => user ? void addWish(product._id).then(() => toast.success('Saved to wishlist')).catch(() => toast.error('Already saved or unavailable')) : toast.error('Sign in to use your wishlist')}><Heart className="size-5" /></Button>
          </div>
          <Card className="mt-8 flex gap-4 p-5"><Truck className="size-7 shrink-0 text-brand-600" /><div><h2 className="font-extrabold">Shipping information pending</h2><p className="mt-1 text-sm text-navy-500 dark:text-navy-300">Delivery timing and charges will be shown by the approved checkout configuration.</p></div></Card>
        </div>
      </div>
      <Tabs.Root defaultValue="description" className="mt-14">
        <Tabs.List className="flex gap-1 border-b"><Tabs.Trigger value="description" className="border-b-2 border-transparent px-5 py-4 font-bold data-[state=active]:border-brand-500">Description</Tabs.Trigger><Tabs.Trigger value="reviews" className="border-b-2 border-transparent px-5 py-4 font-bold data-[state=active]:border-brand-500">Reviews ({reviews.length})</Tabs.Trigger><Tabs.Trigger value="policy" className="border-b-2 border-transparent px-5 py-4 font-bold data-[state=active]:border-brand-500">Refund summary</Tabs.Trigger></Tabs.List>
        <Tabs.Content value="description" className="prose prose-navy max-w-none py-8 dark:prose-invert">{parse(product.des)}</Tabs.Content>
        <Tabs.Content value="reviews" className="grid gap-3 py-8">{reviews.length ? reviews.map((review) => <Card key={review._id} className="p-5"><div className="flex items-center justify-between"><strong>{review.profile?.cus_name || 'Customer'}</strong><Rating value={review.rating} /></div><p className="mt-3 text-sm text-navy-500 dark:text-navy-300">{review.des}</p></Card>) : <p className="text-navy-500">No reviews yet.</p>}</Tabs.Content>
        <Tabs.Content value="policy" className="py-8"><p className="max-w-3xl leading-7 text-navy-600 dark:text-navy-300">Refund eligibility and processing details depend on the approved business policy. Read the current <Link className="font-bold text-brand-700 underline dark:text-brand-400" to="/refund">refund policy</Link> before ordering.</p></Tabs.Content>
      </Tabs.Root>
      {related.length > 0 && (
        <section className="mt-16">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div><p className="text-sm font-extrabold tracking-widest text-brand-700 dark:text-brand-400">KEEP EXPLORING</p><h2 className="mt-2 text-3xl font-black">Related products</h2></div>
            <Link className="text-sm font-bold text-brand-700 dark:text-brand-400" to={`/categories/${product.category?._id ?? product.categoryId}`}>View category</Link>
          </div>
          <ProductGrid products={related} status="success" />
        </section>
      )}
    </PageContainer>
  );
}
