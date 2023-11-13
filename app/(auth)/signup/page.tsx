'use client';

import { ProvidersOptions } from '@/components/auth/providers-options';
import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';

export default function SignUpPage() {
  return (
    <>
      <p className="w-full max-w-sm md:text-xl">
        Already have account?{' '}
        <Link
          href="/signin"
          className="ml-2 underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
      <div className="w-full mt-12 max-w-sm space-y-6 md:space-y-10">
        <h1 className="text-lg font-semibold md:text-xl">Create new account</h1>
        <RegisterForm />
        <ProvidersOptions />
      </div>
    </>
  );
}
