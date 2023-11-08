import { LoginForm } from '@/components/auth/login-form';
import { ProvidersOptions } from '@/components/auth/providers-options';
import { SuccessToast } from '@/components/ui/success-toast';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <>
      <SuccessToast message="Created account! Sign In with your credentials" />
      <p className="w-full max-w-sm text-lg md:text-xl">
        Don&apos;t have account?{' '}
        <Link
          href="/signup"
          className="ml-2 underline-offset-2 hover:underline"
        >
          Sign up
        </Link>
      </p>
      <div className="mt-12 w-full max-w-sm space-y-6 md:mt-0 md:space-y-10">
        <h1 className="text-lg font-semibold md:text-xl">
          Sign in to your account
        </h1>
        <LoginForm />
        <ProvidersOptions />
      </div>
    </>
  );
}
