import { motion } from 'framer-motion';
import type { DayHistory } from '@/lib/weatherService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Droplets, Wind, Thermometer } from 'lucide-react';

interface WeatherHistoryProps {
  history: DayHistory[];
  delay?: number;
}

const chartConfig: ChartConfig = {
  temp: { label: 'Temp (°C)', color: 'hsl(var(--secondary))' },
  humidity: { label: 'Humidity (%)', color: 'hsl(var(--primary))' },
  windSpeed: { label: 'Wind (km/h)', color: 'hsl(var(--accent))' },
};

export function WeatherHistory({ history, delay = 0 }: WeatherHistoryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-panel rounded-lg p-5"
    >
      <h3 className="font-display text-lg font-bold text-primary-foreground mb-4">
        5-Day Forecast
      </h3>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="mb-4 bg-background/30">
          <TabsTrigger value="chart" className="text-xs">Chart</TabsTrigger>
          <TabsTrigger value="table" className="text-xs">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="chart">
          <ChartContainer config={chartConfig} className="h-[220px] w-full">
            <AreaChart data={history} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="hsl(var(--secondary))"
                fill="hsl(var(--secondary) / 0.2)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="humidity"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.15)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="table">
          <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
            {history.map((day) => (
              <div
                key={day.date}
                className="flex items-center justify-between rounded-md bg-background/20 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2 min-w-[80px]">
                  <span className="text-lg">{day.icon}</span>
                  <div>
                    <p className="font-medium text-primary-foreground">{day.day}</p>
                    <p className="text-xs text-primary-foreground/60">{day.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-primary-foreground/80">
                  <span className="flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-secondary" />
                    {day.temp}°C
                  </span>
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3.5 h-3.5 text-primary" />
                    {day.humidity}%
                  </span>
                  <span className="hidden sm:flex items-center gap-1">
                    <Wind className="w-3.5 h-3.5 text-accent" />
                    {day.windSpeed} km/h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
