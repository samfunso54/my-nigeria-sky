import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import heroImg from '@/assets/hero-postlogin.jpg';
import { Navbar } from '@/components/Navbar';
import { WeatherCard } from '@/components/WeatherCard';
import { WeatherHistory } from '@/components/WeatherHistory';
import { StateSearch } from '@/components/StateSearch';
import { fetchWeather, type WeatherData, type DayHistory } from '@/lib/weatherService';
import { getStateByName } from '@/lib/nigerianStates';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState('Lagos');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<DayHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const stateData = getStateByName(selectedState);
  const capital = stateData?.capital || selectedState;

  useEffect(() => {
    if (!stateData) return;
    setLoading(true);
    setError(null);
    fetchWeather(stateData.lat, stateData.lon, capital, selectedState)
      .then(({ weather, forecast }) => {
        setWeather(weather);
        setForecast(forecast);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedState, stateData, capital]);

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
            <p className="text-primary-foreground/70 font-body">Search any state to view current weather conditions</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <StateSearch value={selectedState} onChange={setSelectedState} />
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
              <motion.div key={selectedState} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-md mx-auto mb-8">
                <WeatherCard weather={weather} showTime />
              </motion.div>

              {forecast.length > 0 && (
                <motion.div key={selectedState + '-forecast'} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                  <WeatherHistory history={forecast} delay={0.2} />
                </motion.div>
              )}

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 glass-panel rounded-lg p-4 text-center">
                <p className="text-sm text-primary-foreground/70">
                  📍 Capital: <span className="font-semibold text-primary-foreground">{stateData?.capital}</span>
                  {' • '}
                  Coordinates: {stateData?.lat.toFixed(2)}°N, {stateData?.lon.toFixed(2)}°E
                </p>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
