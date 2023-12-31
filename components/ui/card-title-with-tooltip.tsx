import { ChevronRight, Info } from 'lucide-react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { CardTitle } from './card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';

export function CardTitleWithTooltip({
  children,
  message,
  link,
}: {
  children: ReactNode;
  message: string;
  link?: string;
}) {
  return (
    <div className="inline-flex items-center justify-between">
      <div className="inline-flex items-center space-x-4">
        <CardTitle>{children}</CardTitle>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger className="hidden lg:block">
              <Info className="h-4 w-4 text-neutral-700 dark:text-neutral-300" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{message}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {link ? (
        <Link
          href={link}
          className="group inline-flex items-center space-x-[1px]  text-xs"
        >
          <span className="transition-color hidden group-hover:text-violet-500 dark:group-hover:text-violet-400 xl:block ">
            More{' '}
          </span>
          <ChevronRight className="transition-color h-4 w-4 text-neutral-700 group-hover:text-violet-500 dark:text-neutral-300 dark:group-hover:text-violet-400" />{' '}
        </Link>
      ) : null}
    </div>
  );
}
