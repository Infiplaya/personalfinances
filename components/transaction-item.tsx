import Link from 'next/link';
import { TransactionWithCategory } from '@/db/queries/transactions';
import { cn, moneyFormat } from '@/lib/utils';

export function TransactionItem({
  transaction,
}: {
  transaction: TransactionWithCategory;
}) {
  return (
    <Link
      href={`/transactions/${transaction.slug}`}
      className="flex justify-between rounded-md px-2 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
    >
      <span>{transaction.name}</span>
      <span
        className={cn(
          'font-medium',
          transaction.type == 'income'
            ? 'text-green-500 dark:text-green-400'
            : 'text-red-500 dark:text-red-400'
        )}
      >
        {moneyFormat(Number(transaction.amount), transaction.currencyCode)}
      </span>
    </Link>
  );
}
