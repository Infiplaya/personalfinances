"use client"
 
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Currency } from "@/db/schema/finances"
import { changePrefferedCurrency } from "@/app/actions"
import { useState, useTransition } from "react"
import { toast } from "sonner"
 
 
export function CurrencyDropdown({currencies, currentCurrency}: {currencies: Currency[], currentCurrency: string}) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition();
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {currentCurrency
            ? currencies.find((currency) => currency.code === currentCurrency.toUpperCase())?.code
            : "Select currency..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup>
            {currencies.map((currency) => (
              <CommandItem
              disabled={isPending}
              key={currency.code}
                onSelect={(currentcurrentCurrency) => startTransition(() => {
                  changePrefferedCurrency(currentcurrentCurrency === currentCurrency ? currentcurrentCurrency : currentcurrentCurrency)
                  setOpen(false)
                  toast.success(`Your preffered currency changed to ${currency.code} successfully!`)
                })
              }
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentCurrency.toUpperCase() === currency.code ? "opacity-100" : "opacity-0"
                  )}
                />
                {currency.code}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

{
  
}