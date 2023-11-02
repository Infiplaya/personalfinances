import { ChevronLeftCircle } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function Back({ link }: { link: string }) {
  return (
    <Link href={link} className="group">
      <ChevronLeftCircle className="h-7 w-7 rounded-full text-neutral-700 transition-colors group-hover:bg-neutral-200 dark:text-neutral-300 dark:group-hover:bg-neutral-800" />
    </Link>
  );
}
