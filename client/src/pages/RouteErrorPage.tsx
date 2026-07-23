import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Button } from '../components/ui/button.tsx';

export default function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? error.statusText : error instanceof Error ? error.message : 'An unexpected error occurred.';
  return <main className="grid min-h-screen place-items-center bg-navy-950 p-6 text-center text-white"><div><p className="text-sm font-extrabold tracking-widest text-brand-400">PLAINB ERROR</p><h1 className="mt-3 text-4xl font-black">We hit a snag</h1><p className="mt-4 max-w-lg text-navy-200">{message}</p><Button asChild className="mt-7"><Link to="/">Return home</Link></Button></div></main>;
}
