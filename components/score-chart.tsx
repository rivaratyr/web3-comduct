"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ContributorScore } from "@/types/contributor";

interface ScoreChartProps {
  score: ContributorScore;
}

export function ScoreChart({ score }: ScoreChartProps) {
  // Generate chart data based on the score
  const chartData = [
    {
      category: "GitHub",
      score: score.githubScore,
      max: 40,
    },
    {
      category: "Twitter",
      score: score.twitterScore,
      max: 30,
    },
    {
      category: "Wallet",
      score: score.walletScore, 
      max: 30,
    },
    {
      category: "POAP",
      score: score.poapScore,
      max: 20,
    },
    {
      category: "Transactions",
      score: score.transactionScore,
      max: 20,
    },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Score Breakdown</CardTitle>
        <CardDescription>
          Visual representation of your contributor score
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 5,
                right: 5,
                left: 5,
                bottom: 5,
              }}
            >
              <XAxis 
                dataKey="category"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                domain={[0, 40]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-md">
                        <div className="font-medium">{payload[0].payload.category}</div>
                        <div className="text-sm text-muted-foreground">
                          Score: {payload[0].payload.score}/{payload[0].payload.max}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--chart-1))"
                fill="hsl(var(--chart-1) / 0.2)"
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}