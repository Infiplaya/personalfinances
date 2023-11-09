'use client';
import { LogOut, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '../ui/button';

export function SidebarBottomPanel() {
  return (
    <div className="space-x-3 pb-8">
      <Link href="/settings">
        <Button size="icon" variant="outline">
          <Settings className="h-5 w-5 dark:text-neutral-300" />
        </Button>
      </Link>
      <Button
        variant="outline"
        size="icon"
        onClick={() => {
          signOut({ callbackUrl: '/?signedOut=true' });
        }}
      >
        <LogOut className="h-5 w-5 dark:text-neutral-300" />
      </Button>
    </div>
  );
}
