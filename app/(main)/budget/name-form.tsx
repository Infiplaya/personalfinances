import { Button } from '@/components/ui/button';
import { Card, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BudgetStatus } from '@/db/schema/finances';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React, { Ref } from 'react';
import { SubmitButton } from '../settings/submit-button';

interface Props {
  newPlanAction: () => void;
  resetForm: () => void;
  nameInputRef: null | Ref<HTMLInputElement>;
  column: BudgetStatus;
}

export function NameForm({
  newPlanAction,
  resetForm,
  nameInputRef,
  column,
}: Props) {
  return (
    <Card
      className={cn(
        'mb-5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-950'
      )}
    >
      <CardHeader>
        <form action={newPlanAction}>
          <Button
            size="icon"
            variant="outline"
            className="hover:dark mb-4 h-6 w-6"
          >
            <X onClick={resetForm} className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              placeholder="Type name of plan..."
              id="name"
              name="name"
              ref={nameInputRef}
              autoFocus
            />
            <Input
              type="hidden"
              name="columnId"
              id="columnId"
              value={column.id}
            />
            <SubmitButton>Add</SubmitButton>
          </div>
        </form>
      </CardHeader>
    </Card>
  );
}
