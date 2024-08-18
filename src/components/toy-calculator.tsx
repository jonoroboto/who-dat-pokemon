"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface BarchartChartProps {
  data: { initialCost: number; finalPrice: number }[];
  className?: string;
}

export function ToyCalculator() {
  const [basePrice, setBasePrice] = useState(0);
  const [priceReduction, setPriceReduction] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [chartData, setChartData] = useState([
    { initialCost: 0, finalPrice: 0 },
  ]);

  useEffect(() => {
    const calculateFinalPrice = () => {
      const profitMargin = 0.5;
      const finalPrice =
        (basePrice - (basePrice * priceReduction) / 100 + shippingCost) /
        (1 - profitMargin);
      setFinalPrice(finalPrice);
    };
    calculateFinalPrice();
  }, [basePrice, priceReduction, shippingCost]);

  useEffect(() => {
    const newChartData = chartData.map(() => ({
      initialCost: basePrice + shippingCost,
      finalPrice: finalPrice,
    }));
    setChartData(newChartData);
  }, [finalPrice, basePrice, shippingCost]);

  return (
    <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto py-12 px-4 md:px-0">
      <div className="grid gap-6">
        <h1 className="text-3xl font-bold">Plastic Toys Calculator</h1>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="basePrice">Base Price</Label>
            <div className="relative">
              <Input
                id="basePrice"
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(parseFloat(e.target.value))}
                className="pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="priceReduction">Price Reduction</Label>
            <div className="relative">
              <Input
                id="priceReduction"
                type="number"
                value={priceReduction}
                onChange={(e) => setPriceReduction(parseFloat(e.target.value))}
                className="pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                %
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="shippingCost">Shipping Cost</Label>
            <div className="relative">
              <Input
                id="shippingCost"
                type="number"
                value={shippingCost}
                onChange={(e) => setShippingCost(parseFloat(e.target.value))}
                className="pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <Label htmlFor="finalPrice">Final Price</Label>
            <div className="relative">
              <Input
                id="finalPrice"
                type="number"
                value={finalPrice.toFixed(2)}
                readOnly
                className="pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Profit Margin Visualization</CardTitle>
            <CardDescription>
              This graph shows the initial cost and the final price needed for
              the toy.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BarchartChart data={chartData} className="aspect-[4/3]" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function BarchartChart({ data, className }: BarchartChartProps) {
  return (
    <div className={className}>
      <ChartContainer
        config={{
          initialCost: {
            label: "Initial Cost",
            color: "hsl(var(--chart-1))",
          },
          finalPrice: {
            label: "Final Price",
            color: "hsl(var(--chart-2))",
          },
        }}
      >
        <BarChart accessibilityLayer data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="initialCost"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent indicator="dashed" />}
          />
          <Bar dataKey="initialCost" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="finalPrice" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
