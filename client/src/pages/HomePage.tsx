import * as Accordion from '@radix-ui/react-accordion';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowRight, ChevronDown, Headphones, RefreshCcw, ShieldCheck, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { A11y, Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import heroImage from '../assets/generated/plainb-marketplace-hero.webp';
import promoImage from '../assets/generated/plainb-promo-banner.webp';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { ProductGrid } from '../features/products/components/ProductGrid.tsx';
import { useProductStore } from '../features/products/store/product.store.ts';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';

const remarks = [['new', 'New arrivals'], ['trending', 'Trending'], ['popular', 'Popular'], ['top', 'Top rated'], ['special', 'Special']] as const;
const benefits = [
  [ShieldCheck, 'Secure checkout', 'Payments stay inside the configured Stripe Checkout flow.'],
  [Truck, 'Order visibility', 'Review payment and delivery status from your account.'],
  [RefreshCcw, 'Clear policies', 'Read refund and purchase guidance before ordering.'],
  [Headphones, 'Support hub', 'Find FAQs and approved support channels in one place.'],
] as const;
const faqs = [
  ['How do I place an order?', 'Choose a product, select its available options, add it to your cart, and continue to Stripe Checkout.'],
  ['Where can I see payment status?', 'Sign in and open Orders. Each order shows its current payment and delivery state.'],
  ['Can I save products for later?', 'Yes. Signed-in customers can add products to their wishlist.'],
] as const;

export default function HomePage() {
  const { loadHome, loadByRemark, products, categories, sliders, status, error, activeRemark } = useProductStore();
  useEffect(() => { void loadHome(); }, [loadHome]);

  return (
    <>
      <section className="bg-navy-950 text-white">
        <Swiper modules={[Autoplay, Pagination, A11y]} autoplay={{ delay: 6500, disableOnInteraction: true }} pagination={{ clickable: true }} loop={sliders.length > 1} aria-label="Featured products">
          <SwiperSlide>
            <div className="relative min-h-140 overflow-hidden">
              <img src={heroImage} alt="" className="absolute inset-0 size-full object-cover object-center" />
              <div className="absolute inset-0 bg-linear-to-r from-navy-950 via-navy-950/75 to-transparent" />
              <PageContainer className="relative flex min-h-140 items-center py-20">
                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
                  <p className="font-extrabold tracking-[0.18em] text-brand-400">THE PLAINB MARKETPLACE</p>
                  <h1 className="mt-5 text-4xl font-black leading-[1.05] sm:text-6xl">Bold choices.<br />Simple shopping.</h1>
                  <p className="mt-6 max-w-xl text-base leading-7 text-navy-200 sm:text-lg">Discover current products, compare clear prices, and move securely from cart to checkout.</p>
                  <div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link to="/search">Shop products <ArrowRight className="size-5" /></Link></Button><Button asChild size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:text-white"><Link to="/how-to-buy">How to buy</Link></Button></div>
                </motion.div>
              </PageContainer>
            </div>
          </SwiperSlide>
          {sliders.map((slider) => (
            <SwiperSlide key={slider._id}>
              <div className="relative min-h-140 overflow-hidden">
                <img src={slider.image} alt={slider.title} className="absolute inset-0 size-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-r from-navy-950/95 via-navy-950/65 to-transparent" />
                <PageContainer className="relative flex min-h-140 items-center py-20"><div className="max-w-xl"><p className="font-bold text-brand-400">FEATURED</p><h2 className="mt-4 text-4xl font-black sm:text-6xl">{slider.title}</h2><p className="mt-5 text-navy-100">{slider.des}</p><Button asChild className="mt-8" size="lg"><Link to={`/products/${slider.productId}`}>View product <ArrowRight className="size-5" /></Link></Button></div></PageContainer>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      <PageContainer className="py-16">
        <div className="flex items-end justify-between gap-4"><div><p className="text-sm font-extrabold tracking-widest text-brand-700 dark:text-brand-400">BROWSE FAST</p><h2 className="mt-2 text-3xl font-black">Shop by category</h2></div><Link className="text-sm font-bold text-brand-700 dark:text-brand-400" to="/search">See all</Link></div>
        <div className="mt-8 flex snap-x gap-5 overflow-x-auto pb-4">
          {categories.map((category) => <Link key={category._id} to={`/categories/${category._id}`} className="group w-28 shrink-0 snap-start text-center"><div className="mx-auto grid aspect-square place-items-center overflow-hidden rounded-full border-4 border-white bg-brand-50 shadow-lg transition group-hover:-translate-y-1 group-hover:border-brand-400 dark:border-navy-800 dark:bg-navy-800">{category.categoryImg ? <img src={category.categoryImg} alt="" className="size-full object-cover" /> : <span className="text-2xl font-black text-brand-700">{category.categoryName.slice(0, 1)}</span>}</div><span className="mt-3 block text-sm font-bold">{category.categoryName}</span></Link>)}
        </div>
      </PageContainer>

      <section className="border-y bg-white py-16 dark:bg-navy-900/45">
        <PageContainer>
          <div className="text-center"><p className="text-sm font-extrabold tracking-widest text-brand-700 dark:text-brand-400">FRESH PICKS</p><h2 className="mt-2 text-3xl font-black">Our products</h2><p className="mt-3 text-navy-500 dark:text-navy-300">Load only the collection you want to see.</p></div>
          <Tabs.Root value={activeRemark} onValueChange={(value) => void loadByRemark(value)}>
            <Tabs.List aria-label="Product collections" className="mx-auto my-8 flex w-fit max-w-full gap-1 overflow-x-auto rounded-xl bg-navy-100 p-1 dark:bg-navy-800">
              {remarks.map(([value, label]) => <Tabs.Trigger key={value} value={value} className="whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-bold data-[state=active]:bg-white data-[state=active]:shadow dark:data-[state=active]:bg-navy-950">{label}</Tabs.Trigger>)}
            </Tabs.List>
            <Tabs.Content value={activeRemark}><ProductGrid products={products} status={status} error={error} retry={() => void loadByRemark(activeRemark)} /></Tabs.Content>
          </Tabs.Root>
        </PageContainer>
      </section>

      <PageContainer className="py-16">
        <div className="relative overflow-hidden rounded-4xl bg-brand-500 text-navy-950">
          <img src={promoImage} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-r from-brand-400/95 via-brand-400/80 to-transparent" />
          <div className="relative max-w-xl px-7 py-16 sm:px-12"><p className="font-extrabold tracking-widest">MAKE YOUR SHORTLIST</p><h2 className="mt-3 text-4xl font-black">Save the products that catch your eye.</h2><p className="mt-4 font-semibold">Sign in to keep a wishlist and return when you are ready.</p><Button asChild variant="secondary" className="mt-7"><Link to="/account/wishlist">Open wishlist</Link></Button></div>
        </div>
      </PageContainer>

      <PageContainer className="grid gap-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        {benefits.map(([Icon, title, description]) => <Card key={title} className="p-5"><Icon className="size-8 text-brand-600 dark:text-brand-400" /><h3 className="mt-4 font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-navy-500 dark:text-navy-300">{description}</p></Card>)}
      </PageContainer>

      <PageContainer className="grid gap-10 py-16 lg:grid-cols-2">
        <div><p className="text-sm font-extrabold tracking-widest text-brand-700 dark:text-brand-400">QUESTIONS, ANSWERED</p><h2 className="mt-2 text-3xl font-black">Start with the essentials</h2><p className="mt-4 text-navy-500 dark:text-navy-300">Clear guidance before you add anything to your cart.</p><Button asChild variant="outline" className="mt-6"><Link to="/faq">View all FAQs</Link></Button></div>
        <Accordion.Root type="single" collapsible className="space-y-3">{faqs.map(([question, answer]) => <Accordion.Item key={question} value={question} className="rounded-xl border bg-white px-5 dark:bg-navy-900"><Accordion.Header><Accordion.Trigger className="flex w-full items-center justify-between py-5 text-left font-bold">{question}<ChevronDown className="size-4 transition [[data-state=open]>&]:rotate-180" /></Accordion.Trigger></Accordion.Header><Accordion.Content className="pb-5 text-sm leading-6 text-navy-500 dark:text-navy-300">{answer}</Accordion.Content></Accordion.Item>)}</Accordion.Root>
      </PageContainer>
    </>
  );
}
