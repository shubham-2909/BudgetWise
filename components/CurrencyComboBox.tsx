"use client"
import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { Currencies, Currency } from "@/lib/currencies"
import { useMutation, useQuery } from "@tanstack/react-query"
import { SkeletonWrapper } from "./SkeletonWrapper"
import { UserSettings } from "@prisma/client"
import { updateCurrency } from "@/app/wizard/_actions/userSettings"
import { toast } from "sonner"


export function CurrencyComboBox() {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const [selectedCurrency, setSelectedCurrency] = React.useState<Currency | null>(
    null
  )
  let { isFetching, data } = useQuery<UserSettings>({
    queryKey: ["userSettings"],
    queryFn: () => fetch("/api/user-settings").then(res => res.json())
  })

  React.useEffect(() => {
    if (!data) return
    const currency = Currencies.find(currency => currency.value = data.currency)
    if (currency) setSelectedCurrency(currency)
  }, [data])

  const mutation = useMutation({
    mutationFn: updateCurrency,
    onSuccess: (data) => {
      toast.success("Currency Updated successfully 💯", {
        id: "update-currency"
      })
      setSelectedCurrency(
        Currencies.find((c) => c.value === data.currency) || null
      );
    },
    onError: (error) => {
      console.error(error);
      toast.error(`${error.message}`, {
        id: "update-currency",
      })
    }
  })

  const selectedOptions = React.useCallback((currency: Currency | null) => {
    if (!currency) {
      toast.error("Please select a currency")
      return
    }

    toast.loading("Updating currency...", {
      id: "update-currency",
    });
    mutation.mutate(currency.value)
  }, [mutation])

  if (isDesktop) {
    return (
      <SkeletonWrapper isLoading={isFetching}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[200px] justify-start">
              {selectedCurrency ? <>{selectedCurrency.label}</> : <>Set currency</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <CurrencyList setOpen={setOpen} setSelectedCurrency={selectedOptions} />
          </PopoverContent>
        </Popover>
      </SkeletonWrapper>
    )
  }

  return (
    <SkeletonWrapper isLoading={isFetching}>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="outline" className="w-[150px] justify-start">
            {selectedCurrency ? <>{selectedCurrency.label}</> : <>Set Currency</>}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <div className="mt-4 border-t">
            <CurrencyList setOpen={setOpen} setSelectedCurrency={selectedOptions} />
          </div>
        </DrawerContent>
      </Drawer>
    </SkeletonWrapper>
  )
}

function CurrencyList({
  setOpen,
  setSelectedCurrency,
}: {
  setOpen: (open: boolean) => void
  setSelectedCurrency: (currency: Currency | null) => void
}) {
  return (
    <Command>
      <CommandInput placeholder="Filter currency..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          {Currencies.map((currency: Currency) => (
            <CommandItem
              key={currency.value}
              value={currency.value}
              onSelect={(value) => {
                setSelectedCurrency(
                  Currencies.find((priority) => priority.value === value) || null
                )
                setOpen(false)
              }}
            >
              {currency.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
