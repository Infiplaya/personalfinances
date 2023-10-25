import { getAllBudgetStatuses } from '@/db/queries/budgets';
import { Board } from './board';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubmitButton } from '../settings/submit-button';
import { createBudgetColumn } from '@/app/actions';

export default async function Page() {
  const data = await getAllBudgetStatuses();

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <Button>
            New Column
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <form
            action={createBudgetColumn}
            className="flex items-center justify-between space-x-6"
          >
            <Input type="text" name="name" />
            <SubmitButton />
          </form>
        </PopoverContent>
      </Popover>
      <Board data={data} />
    </div>
  );
}
