"use client";

import { OverviewData } from "@/app/page";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export function Overview({ data }: { data: OverviewData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview - Last 7 days</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          <div className="flex-1">
            <p>Incomes</p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.incomes}>
                <XAxis
                  dataKey="day_of_week"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar
                  dataKey="quantitySum"
                  fill="#adfa1d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex-1">
            <p>Spendings</p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={data.spendings}>
                <XAxis
                  dataKey="day_of_week"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Bar
                  dataKey="quantitySum"
                  fill="#adfa1d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
