import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LockKeyhole, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { useAuthStore } from '../features/auth/store/auth.store.ts';

const schema = z.object({
  email: z.email('Enter a valid email address.'),
  password: z.string().min(1, 'Enter your password.'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const authError = useAuthStore((state) => state.error);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const from = (location.state as { from?: string } | null)?.from ?? '/';
  const googleUrl = `${import.meta.env.VITE_BASE_V2_URL as string}/auth/google?redirectTo=${encodeURIComponent(from)}`;

  return (
    <Card className="w-full max-w-md p-7 sm:p-9">
      <p className="text-sm font-extrabold tracking-widest text-brand-700 dark:text-brand-400">
        WELCOME BACK
      </p>
      <h1 className="mt-2 text-3xl font-black">Sign in to PlainB</h1>
      <form
        className="mt-7 space-y-5"
        onSubmit={handleSubmit(async ({ email, password }) => {
          await login(email, password);
          navigate(from, { replace: true });
        })}
      >
        <label className="block" htmlFor="email">
          <span className="text-sm font-bold">Email address</span>
          <span className="relative mt-2 block">
            <Mail className="absolute left-3 top-3.5 size-5 text-navy-400" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="h-12 w-full rounded-xl border bg-white pl-11 pr-4 dark:bg-navy-800"
              {...register('email')}
            />
          </span>
          {errors.email && <span className="mt-2 block text-xs text-red-600">{errors.email.message}</span>}
        </label>
        <label className="block" htmlFor="password">
          <span className="text-sm font-bold">Password</span>
          <span className="relative mt-2 block">
            <LockKeyhole className="absolute left-3 top-3.5 size-5 text-navy-400" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="h-12 w-full rounded-xl border bg-white pl-11 pr-4 dark:bg-navy-800"
              {...register('password')}
            />
          </span>
          {errors.password && <span className="mt-2 block text-xs text-red-600">{errors.password.message}</span>}
        </label>
        {authError && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">
            {authError}
          </p>
        )}
        <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in…' : <>Sign in <ArrowRight className="size-5" /></>}
        </Button>
      </form>
      <a
        href={googleUrl}
        className="mt-3 flex items-center justify-center gap-3 rounded-xl border px-4 py-3 text-center text-sm font-bold hover:bg-navy-50 dark:hover:bg-navy-800"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
          <path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.6h3.3c1.9-1.8 2.9-4.4 2.9-7.5Z" />
          <path fill="#34A853" d="M12 22c2.7 0 5-.9 6.7-2.3l-3.3-2.6c-.9.6-2.1 1-3.4 1a5.9 5.9 0 0 1-5.5-4.1H3.1v2.6A10 10 0 0 0 12 22Z" />
          <path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-3.9V7.4H3.1a10 10 0 0 0 0 9.2L6.5 14Z" />
          <path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.9 1.5l2.9-2.9A9.8 9.8 0 0 0 3.1 7.4l3.4 2.7A5.9 5.9 0 0 1 12 5.9Z" />
        </svg>
        Continue with Google
      </a>
      <p className="mt-5 text-center text-sm text-navy-500">
        New to PlainB?{' '}
        <Link to="/register" state={{ from }} className="font-bold text-brand-700 dark:text-brand-400">
          Create an account
        </Link>
      </p>
    </Card>
  );
}
