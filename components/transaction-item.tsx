import Link from 'next/link';
import { cn, dateFormat, moneyFormat } from '@/lib/utils';
import { Transaction } from '@/db/schema/finances';

export function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <Link
      href={`/transactions/${transaction.id}`}
      className="block rounded-md px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-900"
    >
        <div className="flex w-full justify-between">
          <span
            className={cn(
              'text-base font-medium',
              transaction.type === 'expense'
                ? 'text-red-500 dark:text-red-400'
                : 'text-green-500 dark:text-green-400'
            )}
          >
            {moneyFormat(Number(transaction.amount))}
          </span>
          <span>{dateFormat(transaction.timestamp as Date)}</span>
        </div>
    </Link>
  );
}
