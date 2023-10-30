import { getStatuses, getStatusesWithPlans } from '@/db/queries/budgets';
import { Board } from './board';
import { NewColumn } from './new-column';

export default async function Page() {
  const data = await getStatusesWithPlans();
  const statuses= await getStatuses();
  return (
    <div>
      <NewColumn />
      <Board data={data} statuses={statuses} />
    </div>
  );
}
