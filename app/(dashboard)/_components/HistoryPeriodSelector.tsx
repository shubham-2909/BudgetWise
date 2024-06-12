"use client"
import { GetHistoryPeriodsResponseType } from "@/app/api/history-periods/route"
import { SkeletonWrapper } from "@/components/SkeletonWrapper"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Period, TimeFrame } from "@/lib/types"
import { useQuery } from "@tanstack/react-query"
import { Dispatch, SetStateAction } from "react"


type Props = { period: Period, timeFrame: TimeFrame, setPeriod: Dispatch<SetStateAction<Period>>, setTimeFrame: Dispatch<SetStateAction<TimeFrame>> }

export function HistoryPeriodSelector({ period, setPeriod, timeFrame, setTimeFrame }: Props) {
  const historyPeriod = useQuery<GetHistoryPeriodsResponseType>({
    queryKey: ["overview", "periods", "history"],
    queryFn: () => fetch("/api/history-periods").then(response => response.json()),
  })

  return (
    <div className="flex flex-wrap items-center gap-4">
      <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
        <Tabs value={timeFrame} onValueChange={(value) => setTimeFrame(value as TimeFrame)}>
          <TabsList>
            <TabsTrigger value="year">Year</TabsTrigger>
            <TabsTrigger value="month">Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </SkeletonWrapper>
      <div className="flex flex-wrap items-center gap-2">
        <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
          <YearSelector period={period} setPeriod={setPeriod} years={historyPeriod.data || []} />
        </SkeletonWrapper>
        {timeFrame === "month" && (
          <SkeletonWrapper isLoading={historyPeriod.isFetching} fullWidth={false}>
            <MonthSelector period={period} setPeriod={setPeriod} />
          </SkeletonWrapper>
        )}
      </div>
    </div>
  )
}


function YearSelector({ period, setPeriod, years }: { period: Period, setPeriod: Dispatch<SetStateAction<Period>>, years: GetHistoryPeriodsResponseType }) {
  return (
    <Select value={period.year.toString()} onValueChange={value => {
      setPeriod({ month: period.month, year: parseInt(value) })
    }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {years.map(year => (
          <SelectItem key={year} value={year.toString()}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}



function MonthSelector({ period, setPeriod }: { period: Period, setPeriod: Dispatch<SetStateAction<Period>> }) {
  return (
    <Select value={period.month.toString()} onValueChange={value => {
      setPeriod({ year: period.year, month: parseInt(value) })
    }}>
      <SelectTrigger className="w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(month => {
          const monthString = new Date(period.year, month, 1).toLocaleString("default", { month: "long" })
          return (
            <SelectItem key={month} value={month.toString()}>
              {monthString}
            </SelectItem>
          )
        })}
      </SelectContent>
    </Select>
  )
}
