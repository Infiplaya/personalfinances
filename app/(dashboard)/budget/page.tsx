import { getAllBudgetStatuses } from '@/db/queries/budgets';
import { Board } from './board';
import { NewColumn } from './new-column';

export default async function Page() {
  const data = await getAllBudgetStatuses();

  return (
    <div>
      <NewColumn />
      <Board data={data} />
    </div>
  );
}