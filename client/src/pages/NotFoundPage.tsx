import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer.tsx';
import { Button } from '../components/ui/button.tsx';

export default function NotFoundPage() {
  return <PageContainer className="grid min-h-[65vh] place-items-center py-16 text-center"><div><p className="text-8xl font-black text-brand-500">404</p><Compass className="mx-auto mt-5 size-10" /><h1 className="mt-4 text-3xl font-black">This page wandered off</h1><p className="mt-3 text-navy-500 dark:text-navy-300">The address may be outdated or the page may have moved.</p><Button asChild className="mt-7"><Link to="/">Return home</Link></Button></div></PageContainer>;
}
