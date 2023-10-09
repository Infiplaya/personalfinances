'use client';

import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { Button } from '../ui/button';

export function AuthPage({
  children,
  type,
}: {
  children?: ReactNode;
  type: 'signin' | 'signup';
}) {
  return (
    <>
      {' '}
      <div className="flex min-h-full flex-1">
        <div className="relative hidden w-0 flex-1 items-center justify-center bg-gray-50 text-lg dark:bg-gray-950 lg:flex lg:flex-row">
          {type === 'signin' ? (
            <>
              <h3 className="leading-6 text-gray-900 dark:text-gray-50">
                Do not have account?
              </h3>
              <Link href="/signup">
                <Button
                  variant="link"
                  className="text-lg text-gray-900 dark:text-gray-50"
                >
                  Sign Up
                </Button>
              </Link>{' '}
            </>
          ) : (
            <>
              <h3 className="leading-6 text-gray-900 dark:text-gray-50">
                Already have an account?
              </h3>
              <Link href="/signin">
                <Button
                  variant="link"
                  className="text-lg text-gray-900 dark:text-gray-50"
                >
                  Sign In
                </Button>
              </Link>{' '}
            </>
          )}
        </div>
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              {type === 'signin' ? (
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
                  Sign In
                </h2>
              ) : (
                <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100">
                  Create New Account
                </h2>
              )}
            </div>

            <div className="mt-10">
              {children}

              <div className="mt-10">
                <div className="relative">
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium leading-6">
                    <span className="bg-gray-50 px-6 text-gray-900 dark:bg-gray-950 dark:text-gray-100">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => signIn('google')}
                    className="inline-flex items-center gap-3"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="1em"
                      viewBox="0 0 488 512"
                      fill="currentColor"
                      className="h-4 w-4"
                    >
                      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      Google
                    </span>
                  </Button>

                  <Button className="inline-flex items-center gap-3">
                    <svg
                      className="h-5 w-5"
                      aria-hidden="true"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-semibold leading-6">
                      GitHub
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
