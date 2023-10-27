import { columns } from '@/components/data-table/columns';
import { DataTable } from '@/components/data-table/data-table';
import { getTransactions } from '@/db/queries/transactions';
import { Category, Transaction } from '@/db/schema/finances';

export async function Transactions({
  categories,
  limit,
  page,
  name,
  column,
  order,
  categoriesFilter,
  typesFilter,
}: {
  categories: Category[];
  limit: number;
  page: number;
  name: string;
  column: keyof Transaction | undefined;
  order: 'asc' | 'desc' | undefined;
  categoriesFilter: Transaction['categoryName'][];
  typesFilter: Transaction['type'][];
}) {
  const transactions = await getTransactions(
    limit,
    page,
    name,
    column,
    order,
    categoriesFilter,
    typesFilter
  );

  return (
    <DataTable categories={categories} columns={columns} data={transactions} />
  );
}
