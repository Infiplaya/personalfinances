import { getStatuses, getStatusesWithPlans } from '@/db/queries/budgets';
import { Board } from './board';
import { NewColumn } from './new-column';

export async function getBoardData() {
  const withPlansPromise = getStatusesWithPlans();
  const statusesPromise = getStatuses();
  const [data, statuses] = await Promise.all([
    withPlansPromise,
    statusesPromise,
  ]);
  return { data, statuses };
}

export default async function Page() {
  const { data, statuses } = await getBoardData();
  return (
    <div className="min-h-screen">
      <NewColumn />
      <Board data={data} statuses={statuses} />
    </div>
  );
}
