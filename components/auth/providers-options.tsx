'use client';

import { signIn } from 'next-auth/react';
import { GithubIcon } from '../icons/github';
import { GoogleIcon } from '../icons/google';
import { Button } from '../ui/button';

export function ProvidersOptions() {
  return (
    <div >
      <p>Or continue with </p>
      <div className="grid mt-2 grid-cols-2 gap-4">
        <Button
          onClick={() => signIn('google')}
          className="inline-flex items-center gap-3"
        >
          <GoogleIcon />
          <span className="text-sm font-semibold leading-6">Google</span>
        </Button>

        <Button className="inline-flex items-center gap-3">
          <GithubIcon />
          <span className="text-sm font-semibold leading-6">GitHub</span>
        </Button>
      </div>
    </div>
  );
}
