"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Period, TimeFrame } from "@/lib/types"
import { UserSettings } from "@prisma/client"
import { useCallback, useMemo, useState } from "react"
import { HistoryPeriodSelector } from "./HistoryPeriodSelector"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { GetFormatterForCurrency } from "@/lib/helpers"
import { GetHistoryDataResponseType } from "@/app/api/history-data/route"
import { Bar, CartesianGrid, ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip } from "recharts"
import { cn } from "@/lib/utils"
import CountUp from "react-countup"

type Props = {
  userSettings: UserSettings
}

export function History({ userSettings }: Props) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("month")
  const [period, setPeriod] = useState<Period>({
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  })
  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency)
  }, [userSettings.currency])
  const historyPeriodData = useQuery<GetHistoryDataResponseType>({
    queryKey: ["overview", "history", timeFrame, period],
    queryFn: () => fetch(`/api/history-data?timeframe=${timeFrame}&month=${period.month}&year=${period.year}`).then(res => res.json())
  })
  const dataAvailable = historyPeriodData.data && historyPeriodData.data.length > 0
  return (
    <div className="container">
      <h2 className="mt-12 font-bold text-3xl">History</h2>
      <Card className="col-span-2 mt-2 w-full">
        <CardHeader className="gap-2">
          <CardTitle className="grid grid-flow-row justify-between gap-2 md:grid-flow-col items-center">
            <HistoryPeriodSelector timeFrame={timeFrame} setTimeFrame={setTimeFrame} period={period} setPeriod={setPeriod} />

            <div className="flex h-10 gap-2">
              <Badge variant={`outline`} className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-emerald-500"></div>
                Income
              </Badge>
              <Badge variant={`outline`} className="flex items-center gap-2 text-sm">
                <div className="h-4 w-4 rounded-full bg-rose-500"></div>
                Expense
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dataAvailable && (
            <ResponsiveContainer width={"100%"} height={300}>
              <BarChart data={historyPeriodData.data} height={200} barCategoryGap={5} >
                <defs>
                  <linearGradient id="incomeBar" x1={`0`} y1={`0`} x2={`0`} y2={`1`}>
                    <stop offset={`0`} stopColor="#10b981" stopOpacity={`1`} />
                    <stop offset={`0`} stopColor="#10b981" stopOpacity={`1`} />
                  </linearGradient>
                  <linearGradient id="expenseBar" x1={`0`} y1={`0`} x2={`0`} y2={`1`}>
                    <stop offset={`0`} stopColor="#ef4444" stopOpacity={`1`} />
                    <stop offset={`0`} stopColor="#ef4444" stopOpacity={`1`} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray={`5 5`} strokeOpacity={`0.2`} vertical={false} />
                <XAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  padding={{ left: 5, right: 5 }}
                  dataKey={(data) => {
                    const { month, year, day } = data
                    const date = new Date(year, month, day || 1)
                    if (timeFrame === "year") {
                      return date.toLocaleString("default", {
                        month: "long"
                      })
                    }
                    return date.toLocaleString("default", {
                      day: "2-digit"
                    })
                  }}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Bar dataKey={`income`} label="income" fill="url(#incomeBar)" radius={4} className="cursor-pointer" />
                <Bar dataKey={`expense`} label="expense" fill="url(#expenseBar)" radius={4} className="cursor-pointer" />
                <Tooltip cursor={{ opacity: 0.1 }} content={props => (
                  <CustomTooltip formatter={formatter} {...props} />
                )} />
              </BarChart>
            </ResponsiveContainer>
          )}
          {!dataAvailable && (
            <Card className="flex h-[300px] flex-col items-center justify-center bg-background">
              No Data for the selected Period
              <p className="text-sm text-muted-foreground">
                Try selecting a different period or try adding new transactions
              </p>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function CustomTooltip({ active, payload, formatter }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;
  const { expense, income } = data;

  return (
    <div className="min-w-[300px] rounded border bg-background p-4">
      <TooltipRow
        formatter={formatter}
        label="Expense"
        value={expense}
        bgColor="bg-rose-500"
        textColor="text-rose-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Income"
        value={income}
        bgColor="bg-emerald-500"
        textColor="text-emerald-500"
      />
      <TooltipRow
        formatter={formatter}
        label="Balance"
        value={income - expense}
        bgColor="bg-gray-100"
        textColor="text-foreground"
      />
    </div>
  );
}

function TooltipRow({
  label,
  value,
  bgColor,
  textColor,
  formatter,
}: {
  label: string;
  textColor: string;
  bgColor: string;
  value: number;
  formatter: Intl.NumberFormat;
}) {
  const formattingFn = useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-4 w-4 rounded-full", bgColor)} />
      <div className="flex w-full justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={cn("text-sm font-bold", textColor)}>
          <CountUp
            duration={0.5}
            preserveValue
            end={value}
            decimals={0}
            formattingFn={formattingFn}
            className="text-sm"
          />
        </div>
      </div>
    </div>
  );
}
