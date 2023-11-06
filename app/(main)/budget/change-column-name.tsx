import { changeBudgetColumnName } from '@/db/actions/budgets';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { BudgetStatus } from '@/db/schema/finances';
import { SubmitButton } from '../settings/submit-button';

export function ChangeColumnName({ column }: { column: BudgetStatus }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="text-xl">
          {column.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <form
          action={changeBudgetColumnName}
          className="flex items-center justify-between space-x-6"
        >
          <Input type="text" name="name" defaultValue={column.name} />
          <Input type="hidden" name="columnId" value={column.id} />
          <SubmitButton>Change</SubmitButton>
        </form>
      </PopoverContent>
    </Popover>
  );
}
