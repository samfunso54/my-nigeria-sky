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
