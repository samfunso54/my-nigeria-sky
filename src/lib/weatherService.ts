import { supabase } from "@/integrations/supabase/client";

export interface WeatherData {
  city: string;
  state?: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
  windSpeed: number;
  pressure: number;
}

export interface DayHistory {
  date: string;
  day: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

// Map OWM icon codes to emoji
function owmIconToEmoji(iconCode: string): string {
  const map: Record<string, string> = {
    "01d": "☀️", "01n": "🌙",
    "02d": "⛅", "02n": "☁️",
    "03d": "☁️", "03n": "☁️",
    "04d": "☁️", "04n": "☁️",
    "09d": "🌧️", "09n": "🌧️",
    "10d": "🌦️", "10n": "🌧️",
    "11d": "⛈️", "11n": "⛈️",
    "13d": "❄️", "13n": "❄️",
    "50d": "🌫️", "50n": "🌫️",
  };
  return map[iconCode] || "🌤️";
}

export interface WeatherResult {
  weather: WeatherData;
  forecast: DayHistory[];
}

export async function fetchWeather(lat: number, lon: number, city: string, state?: string): Promise<WeatherResult> {
  const { data, error } = await supabase.functions.invoke("get-weather", {
    body: { lat, lon },
  });

  if (error) throw new Error(error.message);
  if (data?.error) throw new Error(data.error);

  const current = data.current;
  const forecastList = data.forecast?.list || [];

  const weather: WeatherData = {
    city,
    state,
    temp: Math.round(current.main.temp),
    feelsLike: Math.round(current.main.feels_like),
    humidity: current.main.humidity,
    description: current.weather[0]?.description || "N/A",
    icon: owmIconToEmoji(current.weather[0]?.icon || "01d"),
    windSpeed: Math.round(current.wind.speed * 3.6), // m/s to km/h
    pressure: current.main.pressure,
  };

  // Group forecast by day, pick midday entry per day
  const dayMap = new Map<string, typeof forecastList[0]>();
  for (const entry of forecastList) {
    const dateStr = entry.dt_txt.split(" ")[0];
    const hour = parseInt(entry.dt_txt.split(" ")[1].split(":")[0]);
    const existing = dayMap.get(dateStr);
    if (!existing || Math.abs(hour - 12) < Math.abs(parseInt(existing.dt_txt.split(" ")[1].split(":")[0]) - 12)) {
      dayMap.set(dateStr, entry);
    }
  }

  const forecast: DayHistory[] = Array.from(dayMap.values()).slice(0, 5).map((entry) => {
    const d = new Date(entry.dt * 1000);
    return {
      date: d.toLocaleDateString("en-NG", { day: "numeric", month: "short" }),
      day: d.toLocaleDateString("en-NG", { weekday: "short" }),
      temp: Math.round(entry.main.temp),
      humidity: entry.main.humidity,
      windSpeed: Math.round(entry.wind.speed * 3.6),
      description: entry.weather[0]?.description || "",
      icon: owmIconToEmoji(entry.weather[0]?.icon || "01d"),
    };
  });

  return { weather, forecast };
}
