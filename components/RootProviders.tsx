"use client"
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
export function RootProviders({ children, ...props }: ThemeProviderProps) {
  const [queryClient] = React.useState(() => new QueryClient({}))
  return <QueryClientProvider client={queryClient}>
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
}
