import { getAllBudgetStatuses } from '@/db/queries/budgets';
import { useMemo } from 'react';
import { Board } from './board';

export default async function Page() {
  const data = await getAllBudgetStatuses();

  return (
    <div>
      <Board data={data} />
    </div>
  );
}
