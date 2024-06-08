import { GetCategoryStatsResponseType } from '@/app/api/stats/categories/route'
import { SkeletonWrapper } from '@/components/SkeletonWrapper'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers'
import { TransactionTypes } from '@/lib/types'
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

type Props = {
  userSettings: UserSettings
  from: Date
  to: Date
}

export function CategoryStats({ userSettings, from, to }: Props) {

  const statsQuery = useQuery<GetCategoryStatsResponseType>({
    queryKey: ["categories", "overview", "stats", from, to],
    queryFn: () => fetch(`api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(res => res.json())
  })

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])

  return (
    <div className="flex w-full flex-wrap gap-2 md:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="income"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isFetching}>
        <CategoriesCard
          formatter={formatter}
          type="expense"
          data={statsQuery.data || []}
        />
      </SkeletonWrapper>
    </div>
  )
}

function CategoriesCard({ type, data, formatter }: { type: TransactionTypes, data: GetCategoryStatsResponseType, formatter: Intl.NumberFormat }) {

  const filteredData = data.filter(d => d.type === type)
  const total = filteredData.reduce((acc, el) => acc + (el?._sum?.amount || 0), 0)
  return (
    <Card className='h-80 w-full'>
      <CardHeader>
        <CardTitle className='grid grid-flow-row text-muted-foreground gap-2 md:grid-flow-col justify-between'>
          {type === "income" ? "Incomes" : "Expenses"} By Category
        </CardTitle>
      </CardHeader>
      <div className='flex items-center justify-between gap-2'>
        {filteredData.length === 0 && (
          <div className='flex h-60 w-full flex-col items-center justify-center'>
            No data for this period
            <p className='text-sm text-muted-foreground'>Try selecting a different period or try adding new {type === "income" ? "incomes" : "expenses"}</p>
          </div>
        )}

        {filteredData.length > 0 && (
          <ScrollArea className='h-60 w-full px-4'>
            <div className='flex w-full flex-col gap-4 p-4'>
              {filteredData.map((item) => {
                const amount = item._sum.amount || 0
                const percentage = (amount * 100) / (total || amount);
                return (
                  <div key={item.category} className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                      <span className="flex items-center text-gray-400">
                        {item.categoryIcon} {item.category}
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>
                      <span className="text-sm text-gray-400">
                        {formatter.format(amount)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      indicator={
                        type === "income" ? "bg-emerald-500" : "bg-red-500"
                      }
                    />
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  )
}
