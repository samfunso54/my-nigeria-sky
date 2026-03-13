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

// Mock weather data for demo - will be replaced with real API
const weatherConditions = [
  { description: "Partly Cloudy", icon: "⛅" },
  { description: "Sunny", icon: "☀️" },
  { description: "Light Rain", icon: "🌦️" },
  { description: "Thunderstorm", icon: "⛈️" },
  { description: "Overcast", icon: "☁️" },
  { description: "Clear Sky", icon: "🌤️" },
];

function seededRandom(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  // Use date to make it change daily
  const day = new Date().toISOString().split('T')[0];
  for (let i = 0; i < day.length; i++) {
    hash = ((hash << 5) - hash) + day.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 100) / 100;
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

function seededRandomWithOffset(seed: string, offset: number): number {
  let hash = 0;
  const s = seed + String(offset);
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 100) / 100;
}

export function getMockWeather(city: string, state?: string): WeatherData {
  const seed = city + (state || '');
  const r = seededRandom(seed);
  const condition = weatherConditions[Math.floor(r * weatherConditions.length)];
  
  return {
    city,
    state,
    temp: Math.round(24 + r * 14),
    feelsLike: Math.round(25 + r * 13),
    humidity: Math.round(40 + r * 50),
    description: condition.description,
    icon: condition.icon,
    windSpeed: Math.round(5 + r * 20),
    pressure: Math.round(1005 + r * 20),
  };
}

export function get7DayHistory(city: string, state?: string): DayHistory[] {
  const seed = city + (state || '');
  const today = new Date();
  const days: DayHistory[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const r = seededRandomWithOffset(seed, d.toISOString().split('T')[0].hashCode ?? i);
    const r2 = seededRandomWithOffset(seed + d.toISOString().split('T')[0], i);
    const condition = weatherConditions[Math.floor(r2 * weatherConditions.length)];

    days.push({
      date: d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }),
      day: d.toLocaleDateString('en-NG', { weekday: 'short' }),
      temp: Math.round(22 + r2 * 16),
      humidity: Math.round(35 + r2 * 55),
      windSpeed: Math.round(4 + r2 * 22),
      description: condition.description,
      icon: condition.icon,
    });
  }

  return days;
}
