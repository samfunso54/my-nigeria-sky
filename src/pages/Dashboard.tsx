import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import heroImg from '@/assets/hero-postlogin.jpg';
import { Navbar } from '@/components/Navbar';
import { WeatherCard } from '@/components/WeatherCard';
import { WeatherHistory } from '@/components/WeatherHistory';
import { StateSearch, type PlaceSelection } from '@/components/StateSearch';
import { fetchWeather, type WeatherData, type DayHistory } from '@/lib/weatherService';
import { getStateByName } from '@/lib/nigerianStates';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceSelection>({
    name: 'Lagos',
    state: 'Lagos',
    lat: 6.524,
    lon: 3.379,
  });
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<DayHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchWeather(selectedPlace.lat, selectedPlace.lon, selectedPlace.name, selectedPlace.state)
      .then(({ weather, forecast }) => {
        setWeather(weather);
        setForecast(forecast);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedPlace]);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <img src={heroImg} alt="Abuja landscape" className="w-full h-full object-cover transition-opacity duration-700" />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <Navbar />

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">Your Dashboard</h1>
            <p className="text-primary-foreground/70 font-body">Search any place in Nigeria to view current weather</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <StateSearch onSelect={setSelectedPlace} />
          </motion.div>

          {loading && (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary-foreground/60" />
            </div>
          )}

          {error && (
            <div className="glass-panel rounded-lg p-4 text-center text-red-400 mb-8">
              Failed to load weather: {error}
            </div>
          )}

          {!loading && weather && (
            <>
              <motion.div key={selectedPlace.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-md mx-auto mb-8">
                <WeatherCard weather={weather} showTime />
              </motion.div>

              {forecast.length > 0 && (
                <motion.div key={selectedPlace.name + '-forecast'} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                  <WeatherHistory history={forecast} delay={0.2} />
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 glass-panel rounded-lg p-4 text-center">
                <p className="text-sm text-primary-foreground/70">
                  📍 {selectedPlace.name}
                  {selectedPlace.state && selectedPlace.state !== selectedPlace.name && ` • ${selectedPlace.state}`}
                  {' • '}
                  Coordinates: {selectedPlace.lat.toFixed(2)}°N, {selectedPlace.lon.toFixed(2)}°E
                </p>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
