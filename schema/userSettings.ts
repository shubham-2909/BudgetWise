
import { Currencies } from "@/lib/currencies"
import { z } from "zod"
export const UpdateUserCurrencySchema = z.custom((value) => {
  const found = Currencies.some(currency => currency.value === value)
  if (!found) {
    throw new Error(`Invalid currency ${value}`)
  }
  return value
})

