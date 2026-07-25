import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/ui/button.tsx';
import { Card } from '../components/ui/card.tsx';
import { useAuthStore } from '../features/auth/store/auth.store.ts';

const schema = z
  .object({
    name: z.string().trim().min(1, 'Enter your name.').max(100),
    email: z.email('Enter a valid email address.'),
    password: z.string().min(8, 'Use at least 8 characters.').max(72),
    confirmPassword: z.string(),
    file: z.instanceof(FileList).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const registerAccount = useAuthStore((state) => state.registerAccount);
  const status = useAuthStore((state) => state.status);
  const authError = useAuthStore((state) => state.error);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  return (
    <Card className="w-full max-w-md p-7 sm:p-9">
      <p className="text-sm font-extrabold tracking-widest text-brand-700 dark:text-brand-400">
        JOIN PLAINB
      </p>
      <h1 className="mt-2 text-3xl font-black">Create your account</h1>
      <form
        className="mt-7 space-y-4"
        onSubmit={handleSubmit(async ({ name, email, password, file }) => {
          await registerAccount({ name, email, password, file: file?.[0] });
          navigate('/verify-email', { state: { from } });
        })}
      >
        <label className="block">
          <span className="text-sm font-bold">Name</span>
          <input className="mt-2 h-12 w-full rounded-xl border bg-white px-4 dark:bg-navy-800" autoComplete="name" {...register('name')} />
          {errors.name && <span className="mt-1 block text-xs text-red-600">{errors.name.message}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-bold">Email address</span>
          <input type="email" className="mt-2 h-12 w-full rounded-xl border bg-white px-4 dark:bg-navy-800" autoComplete="email" {...register('email')} />
          {errors.email && <span className="mt-1 block text-xs text-red-600">{errors.email.message}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-bold">Password</span>
          <input type="password" className="mt-2 h-12 w-full rounded-xl border bg-white px-4 dark:bg-navy-800" autoComplete="new-password" {...register('password')} />
          {errors.password && <span className="mt-1 block text-xs text-red-600">{errors.password.message}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-bold">Confirm password</span>
          <input type="password" className="mt-2 h-12 w-full rounded-xl border bg-white px-4 dark:bg-navy-800" autoComplete="new-password" {...register('confirmPassword')} />
          {errors.confirmPassword && <span className="mt-1 block text-xs text-red-600">{errors.confirmPassword.message}</span>}
        </label>
        <label className="block">
          <span className="text-sm font-bold">Profile photo <span className="font-normal">(optional)</span></span>
          <span className="mt-2 flex h-12 items-center gap-2 rounded-xl border bg-white px-4 dark:bg-navy-800">
            <ImagePlus className="size-5 text-navy-400" />
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" {...register('file')} />
          </span>
        </label>
        {authError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-200">{authError}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
      <p className="mt-5 text-center text-sm text-navy-500">
        Already registered? <Link to="/login" className="font-bold text-brand-700 dark:text-brand-400">Sign in</Link>
      </p>
    </Card>
  );
}
