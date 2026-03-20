import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { WeatherCard } from '@/components/WeatherCard';
import { WeatherHistory } from '@/components/WeatherHistory';
import { StateSearch, type PlaceSelection } from '@/components/StateSearch';
import { useRotatingBackground } from '@/hooks/useRotatingBackground';
import { fetchWeather, type WeatherData, type DayHistory } from '@/lib/weatherService';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const DEFAULT_PLACE: PlaceSelection = {
  name: 'Lagos',
  state: 'Lagos',
  lat: 6.524,
  lon: 3.379,
};

export default function Dashboard() {
  const [selectedPlace, setSelectedPlace] = useState<PlaceSelection>(DEFAULT_PLACE);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<DayHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { bg, next } = useRotatingBackground();


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

  const handlePlaceSelect = (place: PlaceSelection) => {
    setSelectedPlace(place);
    next();
  };

  return (
    <div className="min-h-screen relative" onClick={next}>
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.img
            key={bg}
            src={bg}
            alt="Nigerian landscape"
            className="w-full h-full object-cover absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          />
        </AnimatePresence>
        <div className="hero-overlay absolute inset-0" />
      </div>

      <Navbar />

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">Your Dashboard</h1>
            <p className="text-primary-foreground/70 font-body">Search any town or village in Nigeria</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8" onClick={(e) => e.stopPropagation()}>
            <StateSearch onSelect={handlePlaceSelect} />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div key={selectedPlace.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                  <WeatherCard weather={weather} showTime />
                </motion.div>

                <motion.div key={selectedPlace.name + '-map'} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="rounded-lg overflow-hidden border border-border shadow-md min-h-[280px]">
                  <iframe
                    title="Location map"
                    width="100%"
                    height="100%"
                    style={{ minHeight: 280, border: 0 }}
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${selectedPlace.lon - 0.05}%2C${selectedPlace.lat - 0.05}%2C${selectedPlace.lon + 0.05}%2C${selectedPlace.lat + 0.05}&layer=mapnik&marker=${selectedPlace.lat}%2C${selectedPlace.lon}`}
                  />
                </motion.div>
              </div>

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
