"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { date: "2025-06-01", visitors: 178 },
  { date: "2025-06-02", visitors: 470 },
  { date: "2025-06-03", visitors: 103 },
  { date: "2025-06-04", visitors: 439 },
  { date: "2025-06-05", visitors: 88 },
  { date: "2025-06-06", visitors: 294 },
  { date: "2025-06-07", visitors: 323 },
  { date: "2025-06-08", visitors: 385 },
  { date: "2025-06-09", visitors: 438 },
  { date: "2025-06-10", visitors: 155 },
  { date: "2025-06-11", visitors: 92 },
  { date: "2025-06-12", visitors: 492 },
  { date: "2025-06-13", visitors: 81 },
  { date: "2025-06-14", visitors: 426 },
  { date: "2025-06-15", visitors: 307 },
  { date: "2025-06-16", visitors: 371 },
  { date: "2025-06-17", visitors: 475 },
  { date: "2025-06-18", visitors: 107 },
  { date: "2025-06-19", visitors: 341 },
  { date: "2025-06-20", visitors: 408 },
  { date: "2025-06-21", visitors: 169 },
  { date: "2025-06-22", visitors: 317 },
  { date: "2025-06-23", visitors: 480 },
  { date: "2025-06-24", visitors: 132 },
  { date: "2025-06-25", visitors: 141 },
  { date: "2025-06-26", visitors: 434 },
  { date: "2025-06-27", visitors: 448 },
  { date: "2025-06-28", visitors: 149 },
  { date: "2025-06-29", visitors: 103 },
  { date: "2025-06-30", visitors: 446 },
]

const total = chartData.reduce((acc, curr) => acc + curr.visitors, 0)

const chartConfig = {
  visitors: {
    label: "Visitors",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig

export function DashboardChart() {
  const [activeTab, setActiveTab] = React.useState('30d')
  
  const tabs = [
    { id: '7d', label: '7d' },
    { id: '30d', label: '30d' },
    { id: '90d', label: '90d' },
    { id: '1y', label: '1a' },
  ]

  const filteredData = React.useMemo(() => {
    // Simular filtrado por periodo
    const now = new Date()
    let startDate = new Date()
    
    switch (activeTab) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }
    
    return chartData.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate
    })
  }, [activeTab])

  return (
    <div 
      className="w-full rounded-xl border border-white/10 text-white bg-black/20 backdrop-blur-xl flex flex-col"
      style={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="border-0 pb-2 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white/70 text-sm font-medium tracking-wide uppercase">
              Analytics de Visitantes
            </h3>
            <p className="text-white/60 text-sm mt-1">
              Total de visitantes por periodo.
            </p>
          </div>
          <div className="flex bg-white/5 backdrop-blur-xl rounded-lg p-1 border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "text-white/60 hover:text-white/80 hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="px-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={filteredData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 12 }}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("es-ES", {
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px] bg-gray-900/95 border-white/20 text-white"
                  nameKey="visitors"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-ES", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Bar dataKey="visitors" fill="rgba(255,255,255,0.8)" stroke="rgba(255,255,255,0.2)" strokeWidth={1} radius={6} />
          </BarChart>
        </ChartContainer>
      </div>
      <div className="border-t border-white/10 px-6 pb-6 pt-4">
        <div className="text-sm text-white/80">
          Tuviste{" "}
          <span className="font-semibold text-white">{filteredData.reduce((acc, curr) => acc + curr.visitors, 0).toLocaleString()}</span>{" "}
          visitantes en el periodo seleccionado.
        </div>
      </div>
    </div>
  )
}