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
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <Link
              href={`/transactions/${transaction.slug}`}
              className="block"
              key={transaction.id}
            >
              <TableCell className="font-medium">{transaction.name}</TableCell>
            </Link>
            <TableCell>{transaction.categoryName}</TableCell>
            <TableCell>
              {transaction.timestamp ? dateFormat(transaction.timestamp) : null}
            </TableCell>
            <TableCell className="text-right">
              {transaction.amount
                ? moneyFormat(
                    Number(transaction.amount),
                    transaction.currencyCode
                  )
                : null}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
