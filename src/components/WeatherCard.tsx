import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { WeatherData } from '@/lib/weatherService';
import { Droplets, Wind, Gauge, Clock } from 'lucide-react';

interface WeatherCardProps {
  weather: WeatherData;
  variant?: 'default' | 'hero';
  delay?: number;
  showTime?: boolean;
}

function useCurrentTime() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export function WeatherCard({ weather, variant = 'default', delay = 0, showTime = false }: WeatherCardProps) {
  const now = useCurrentTime();

  const formattedTime = now.toLocaleTimeString('en-NG', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
  const formattedDate = now.toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`weather-card rounded-lg p-6 ${variant === 'hero' ? 'glass-panel' : ''}`}
    >
      {showTime && (
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <Clock className="w-4 h-4 text-secondary" />
          <span className="text-sm font-medium text-foreground">{formattedTime}</span>
          <span className="text-xs text-muted-foreground ml-auto">{formattedDate}</span>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-display text-xl font-bold text-foreground">{weather.city}</h3>
          {weather.state && (
            <p className="text-sm text-muted-foreground font-body">{weather.state} State</p>
          )}
        </div>
        <span className="text-4xl">{weather.icon}</span>
      </div>

      <div className="mb-4">
        <span className="text-5xl font-display font-bold text-foreground">{weather.temp}°</span>
        <span className="text-lg text-muted-foreground ml-1">C</span>
      </div>

      <p className="text-sm font-medium text-secondary mb-4">{weather.description}</p>

      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
        <div className="flex flex-col items-center gap-1">
          <Droplets className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Humidity</span>
          <span className="text-sm font-semibold text-foreground">{weather.humidity}%</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Wind className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Wind</span>
          <span className="text-sm font-semibold text-foreground">{weather.windSpeed} km/h</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <Gauge className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Pressure</span>
          <span className="text-sm font-semibold text-foreground">{weather.pressure} hPa</span>
        </div>
      </div>
    </motion.div>
  );
}
