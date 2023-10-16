import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction } from '@/db/schema/finances';
import { dateFormat, moneyFormat } from '@/lib/utils';
import Link from 'next/link';

export function TransactionsTable({
  transactions,
  caption,
}: {
  transactions: Transaction[];
  caption: string;
}) {
  return (
    <Table>
      <TableCaption>{caption}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              {' '}
              <Link
                href={`/transactions/${transaction.slug}`}
                className="block"
                key={transaction.id}
              >
                {' '}
                {transaction.name}{' '}
              </Link>
            </TableCell>

            <TableCell>{transaction.categoryName}</TableCell>
            <TableCell className="text-right font-medium">
              {transaction.amount
                ? moneyFormat(
                    Number(transaction.amount),
                    transaction.currencyCode
                  )
                : null}
            </TableCell>
            <TableCell className="text-right">
              {transaction.timestamp ? dateFormat(transaction.timestamp) : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
