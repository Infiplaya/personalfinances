import { TransactionsTable } from '@/components/transactions/transactions-table';
import { db } from '@/db';
import { getCurrentProfile } from '@/db/queries/auth';
import { calculateTotalForCategory } from '@/db/queries/transactions';

async function getCategory(slug: string) {
  const currentProfile = await getCurrentProfile();
  return await db.query.categories.findFirst({
    where: (categories, { eq }) => eq(categories.slug, slug),
    with: {
      transactions: {
        where: (transactions, { eq }) =>
          eq(transactions.profileId, currentProfile.id),
      },
    },
  });
}

export default async function CategoriesPage({
  params,
}: {
  params: { slug: string };
}) {
  const category = await getCategory(params.slug);

  if (!category) {
    return <p>No such category transactions.</p>;
  }

  const totalAmount = await calculateTotalForCategory(category.name);

  const totalAmountThisMonth = await calculateTotalForCategory(
    category.name,
    true
  );

  return (
    <main>
      <div className="mb-10">
        <h1 className="mb-2 text-xl font-semibold lg:text-2xl">
          {category.name}
        </h1>
        <p>Total: {totalAmount.totalAmount}</p>
        <p>This Month: {totalAmountThisMonth.totalAmount}</p>
      </div>
      <TransactionsTable
        transactions={category.transactions}
        caption={`A list of transactions in ${category.name}`}
      />
    </main>
  );
}
