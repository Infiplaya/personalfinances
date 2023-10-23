import { getAllBudgetStatuses } from '@/db/queries/budgets';
import { Board } from './board';

export default async function Page() {
  const data = await getAllBudgetStatuses();

  return (
    <div>
      <Board data={data} />
    </div>
  );
}
