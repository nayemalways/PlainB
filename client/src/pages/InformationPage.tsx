import * as Accordion from '@radix-ui/react-accordion';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowUp, Check, ChevronDown, CircleHelp, Mail, MapPin, Search, ShoppingCart, Truck } from 'lucide-react';
import parse from 'html-react-parser';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import { z } from 'zod';
import supportImage from '../assets/generated/plainb-support-placeholder.webp';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { ErrorState } from '../components/feedback/AsyncState.tsx';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { getLegalDocuments } from '../features/legal/api/legal.api.ts';

const faqs = [
  ['Ordering', 'Choose a product, select its available variants, add it to the cart, and continue to checkout.'],
  ['Payments', 'Payments are handled through the configured Stripe Checkout flow.'],
  ['Delivery', 'Approved delivery estimates and fees are not currently published. Checkout and order status remain the source of truth.'],
  ['Returns and refunds', 'Eligibility and processing rules depend on the approved refund policy shown on this site.'],
  ['Account access', 'PlainB uses a one-time code sent to your email address.'],
  ['Product availability', 'The stock label on each product shows the latest status provided by the catalog.'],
  ['Support', 'Verified support contact details are pending business approval.'],
] as const;
const steps = [
  [Search, 'Find a product', 'Search the catalog or browse a category.'],
  [CircleHelp, 'Review the details', 'Check images, variants, stock, price, and policy summaries.'],
  [ShoppingCart, 'Add it to cart', 'Choose required options and the quantity you need.'],
  [Check, 'Review your cart', 'Confirm products, quantities, VAT, and payable total.'],
  [MapPin, 'Check your address', 'Keep billing and shipping information current in your profile.'],
  [Mail, 'Continue to Stripe', 'Use the secure checkout page configured for PlainB.'],
  [Check, 'Confirm the order', 'Return to PlainB after payment confirmation.'],
  [Truck, 'Track the order', 'Open Orders to see payment and delivery status.'],
] as const;

function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <section className="bg-navy-950 py-16 text-white"><PageContainer><p className="font-extrabold tracking-widest text-brand-400">{eyebrow}</p><h1 className="mt-3 text-4xl font-black sm:text-5xl">{title}</h1><p className="mt-4 max-w-2xl leading-7 text-navy-200">{description}</p></PageContainer></section>;
}

function FaqContent() {
  return <Accordion.Root type="single" collapsible className="space-y-3">{faqs.map(([question, answer]) => <Accordion.Item key={question} value={question} className="rounded-xl border bg-white px-5 dark:bg-navy-900"><Accordion.Header><Accordion.Trigger className="flex w-full items-center justify-between py-5 text-left font-extrabold">{question}<ChevronDown className="size-4" /></Accordion.Trigger></Accordion.Header><Accordion.Content className="pb-5 text-sm leading-6 text-navy-500 dark:text-navy-300">{answer}</Accordion.Content></Accordion.Item>)}</Accordion.Root>;
}

const contactSchema = z.object({
  fullName: z.string().min(2, 'Enter your full name.'),
  email: z.email('Enter a valid email.'),
  phone: z.string().optional(),
  subject: z.string().min(3, 'Enter a subject.'),
  orderNumber: z.string().optional(),
  complaintCategory: z.string().optional(),
  preferredResolution: z.string().optional(),
  message: z.string().min(10, 'Please provide at least 10 characters.'),
});
type ContactData = z.infer<typeof contactSchema>;

function PlaceholderForm({ complaint = false }: { complaint?: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<ContactData>({ resolver: zodResolver(contactSchema) });
  const [notice, setNotice] = useState(false);
  const fields: Array<[keyof ContactData, string]> = [['fullName', 'Full name'], ['email', 'Email'], ['phone', 'Phone (optional)'], ['subject', complaint ? 'Complaint subject' : 'Subject'], ['orderNumber', 'Order number (optional)'], ...(complaint ? [['complaintCategory', 'Complaint category'], ['preferredResolution', 'Preferred resolution']] as Array<[keyof ContactData, string]> : [])];
  return <Card className="p-6 sm:p-8"><h2 className="text-2xl font-black">{complaint ? 'Complaint details' : 'Contact form'}</h2><p className="mt-2 text-sm text-navy-500 dark:text-navy-300">Fields are validated locally. Online submission is not configured.</p><form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit(() => setNotice(true))}>{fields.map(([name, label]) => <label key={name}><span className="text-sm font-bold">{label}</span><input className="mt-2 h-11 w-full rounded-xl border bg-white px-3 dark:bg-navy-800" {...register(name)} />{errors[name] && <span className="mt-1 block text-xs text-red-600">{errors[name]?.message}</span>}</label>)}<label className="sm:col-span-2"><span className="text-sm font-bold">{complaint ? 'Description' : 'Message'}</span><textarea rows={5} className="mt-2 w-full rounded-xl border bg-white p-3 dark:bg-navy-800" {...register('message')} />{errors.message && <span className="mt-1 block text-xs text-red-600">{errors.message.message}</span>}</label>{notice && <p role="status" className="sm:col-span-2 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">Online submission is not configured. No information was sent or stored. Verified support contact details are pending approval.</p>}<div className="sm:col-span-2"><Button type="submit">{complaint ? 'Validate complaint' : 'Validate message'}</Button></div></form></Card>;
}

function TermsContent() {
  const sections = [
    ['1. Introduction', <>Welcome to <strong>PlainB</strong>, your trusted electronics e-commerce platform. By using our website and services, you agree to comply with and be bound by these Terms & Conditions. If you do not agree with any part of these terms, please refrain from using our services.</>],
    ['2. Use of Website', <ul><li>You must be at least 18 years old to purchase products from PlainB.</li><li>All content provided on the website is for informational purposes only and may be updated without notice.</li><li>You agree not to misuse the website or interfere with its normal operation.</li></ul>],
    ['3. Orders & Payments', <ul><li>All orders are subject to product availability and acceptance.</li><li>Prices and promotions are subject to change without prior notice.</li><li>We accept secure online payments and all transactions must be completed before shipment.</li></ul>],
    ['4. Shipping & Delivery', <ul><li>PlainB strives to deliver products within the estimated timeframes, but delays may occur.</li><li>Customers are responsible for providing accurate shipping information.</li><li>Shipping fees may vary based on location and selected delivery method.</li></ul>],
    ['5. Returns & Refunds', <ul><li>Products can be returned within 14 days of delivery, subject to our return policy.</li><li>Refunds will be processed after verification of the returned items.</li><li>Certain products (like opened software or perishable items) may not be eligible for return.</li></ul>],
    ['6. Intellectual Property', <>All content on PlainB, including images, text, logos, and product descriptions, is the property of PlainB or its partners. Unauthorized use is strictly prohibited.</>],
    ['7. Limitation of Liability', <>PlainB will not be liable for any direct, indirect, incidental, or consequential damages arising from the use of our website or products. Use our services at your own risk.</>],
    ['8. Privacy', <>Your personal information is handled in accordance with our <Link className="text-brand-700 underline dark:text-brand-400" to="/privacy">Privacy Policy</Link>. By using PlainB, you consent to the collection and use of your data as outlined in our policy.</>],
    ['9. Changes to Terms', <>PlainB reserves the right to update or modify these Terms & Conditions at any time. Updated terms will be posted on this page and are effective immediately upon publication.</>],
    ['10. Contact Us', <>If you have any questions regarding these Terms & Conditions, please contact us at <strong> support@plainb.com</strong>.</>],
  ];
  return <><div className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 dark:bg-amber-950/30 dark:text-amber-100">Existing legal copy preserved from the previous site. Business review and a verified last-updated date are pending.</div><nav aria-label="Terms table of contents" className="mb-10 rounded-xl border bg-white p-5 dark:bg-navy-900"><h2 className="font-black">On this page</h2><ol className="mt-3 grid gap-2 text-sm sm:grid-cols-2">{sections.map(([title], index) => <li key={String(title)}><a className="hover:text-brand-600" href={`#terms-${index + 1}`}>{title}</a></li>)}</ol></nav><div className="space-y-10">{sections.map(([title, content], index) => <section id={`terms-${index + 1}`} key={String(title)} className="scroll-mt-28"><h2 className="text-2xl font-black">{title}</h2><div className="mt-3 space-y-2 leading-7 text-navy-600 [&_li]:ml-5 [&_li]:list-disc dark:text-navy-300">{content}</div></section>)}</div></>;
}

function LegalApiContent({ type }: { type: string }) {
  const [documents, setDocuments] = useState<Array<{ _id: string; description: string }>>([]);
  const [error, setError] = useState('');
  useEffect(() => { void getLegalDocuments(type).then(setDocuments).catch(() => setError('Approved policy content is not currently available.')); }, [type]);
  if (error) return <ErrorState message={error} />;
  if (!documents.length) return <p className="py-10 text-navy-500">Loading policy content…</p>;
  return <div className="space-y-8">{documents.map((document) => <article key={document._id} className="prose prose-navy max-w-none dark:prose-invert">{parse(document.description)}</article>)}</div>;
}

export default function InformationPage() {
  const { pathname } = useLocation();
  const slug = pathname.slice(1);
  let hero = { eyebrow: 'PLAINB', title: 'Information', description: 'Helpful information for shopping with PlainB.' };
  let content: React.ReactNode;
  if (slug === 'about') {
    hero = { eyebrow: 'ABOUT PLAINB', title: 'A simpler way to shop online', description: 'PlainB brings product discovery, secure checkout, and order visibility into one focused experience.' };
    content = <div className="grid gap-6 md:grid-cols-3">{['What we provide', 'How we operate', 'Business details'].map((title, index) => <Card key={title} className="p-6"><span className="text-4xl font-black text-brand-500">0{index + 1}</span><h2 className="mt-5 text-xl font-black">{title}</h2><p className="mt-3 text-sm leading-6 text-navy-500 dark:text-navy-300">{index === 0 ? 'A browsable catalog, customer account tools, and the configured Stripe payment flow.' : index === 1 ? 'Product and order information comes directly from the PlainB backend.' : 'Founding story, leadership, address, and verified company claims are pending approval.'}</p></Card>)}</div>;
  } else if (slug === 'how-to-buy') {
    hero = { eyebrow: 'SHOP WITH CONFIDENCE', title: 'How to buy', description: 'Eight clear steps from product discovery to order tracking.' };
    content = <ol className="grid gap-5 md:grid-cols-2">{steps.map(([Icon, title, description], index) => <li key={title}><Card className="flex h-full gap-5 p-6"><span className="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-100 font-black text-brand-800">{index + 1}</span><div><Icon className="size-5 text-brand-600" /><h2 className="mt-2 font-black">{title}</h2><p className="mt-2 text-sm text-navy-500 dark:text-navy-300">{description}</p></div></Card></li>)}</ol>;
  } else if (slug === 'faq') {
    hero = { eyebrow: 'HELP CENTER', title: 'Frequently asked questions', description: 'Quick answers about accounts, products, payments, and orders.' }; content = <FaqContent />;
  } else if (slug === 'support') {
    hero = { eyebrow: 'SUPPORT HUB', title: 'How can we help?', description: 'Use the guidance below while verified direct support channels are pending approval.' };
    content = <div className="grid gap-8 lg:grid-cols-[360px_1fr]"><Card className="overflow-hidden"><img src={supportImage} alt="Generic customer support representative placeholder" className="aspect-[4/5] w-full object-cover" /><div className="p-5"><p className="font-black">Support manager placeholder</p><p className="mt-2 text-sm text-navy-500">No individual identity or availability is claimed.</p></div></Card><div><FaqContent /><Button asChild className="mt-6"><Link to="/contact">Open contact form</Link></Button></div></div>;
  } else if (slug === 'contact' || slug === 'complaints') {
    const complaint = slug === 'complaints'; hero = { eyebrow: complaint ? 'CUSTOMER CARE' : 'GET IN TOUCH', title: complaint ? 'Submit a complaint' : 'Contact PlainB', description: 'Online submission is not yet connected. You can validate the form without sending personal information.' }; content = <div className="space-y-6"><PlaceholderForm complaint={complaint} />{!complaint && <div className="grid gap-4 sm:grid-cols-3">{['Email and phone', 'Business hours', 'Expected response'].map((title) => <Card key={title} className="p-5"><h2 className="font-black">{title}</h2><p className="mt-2 text-sm text-navy-500 dark:text-navy-300">Pending business approval.</p></Card>)}</div>}</div>;
  } else if (slug === 'terms') {
    hero = { eyebrow: 'LEGAL', title: 'Terms & Conditions', description: 'Please read these terms carefully before using PlainB.' }; content = <TermsContent />;
  } else if (slug === 'privacy' || slug === 'refund') {
    hero = { eyebrow: 'POLICY', title: slug === 'privacy' ? 'Privacy Policy' : 'Refund Policy', description: 'Approved policy content provided by the PlainB backend.' }; content = <LegalApiContent type={slug} />;
  } else {
    content = <FaqContent />;
  }
  return <><PageHero {...hero} /><PageContainer className="py-12"><div className="mx-auto max-w-5xl">{content}</div><a href="#top" className="mt-12 ml-auto flex w-fit items-center gap-2 text-sm font-bold text-brand-700 dark:text-brand-400"><ArrowUp className="size-4" />Back to top</a></PageContainer></>;
}
