import { useState } from 'react';
import { motion } from 'framer-motion';
import heroImg from '@/assets/hero-postlogin.jpg';
import { Navbar } from '@/components/Navbar';
import { WeatherCard } from '@/components/WeatherCard';
import { StateSelector } from '@/components/StateSelector';
import { getMockWeather } from '@/lib/weatherService';
import { getStateByName } from '@/lib/nigerianStates';

export default function Dashboard() {
  const [selectedState, setSelectedState] = useState('Lagos');
  const stateData = getStateByName(selectedState);
  const weather = getMockWeather(
    stateData?.capital || selectedState,
    selectedState
  );

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <img
          src={heroImg}
          alt="Abuja landscape"
          className="w-full h-full object-cover transition-opacity duration-700"
        />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <Navbar />

      {/* Content */}
      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-2">
              Your Dashboard
            </h1>
            <p className="text-primary-foreground/70 font-body">
              Select a state to view current weather conditions
            </p>
          </motion.div>

          {/* State Selector */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="weather-card rounded-lg px-5 py-3">
              <StateSelector value={selectedState} onChange={setSelectedState} />
            </div>
          </motion.div>

          {/* Weather Display */}
          <motion.div
            key={selectedState}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-md mx-auto"
          >
            <WeatherCard weather={weather} />
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 glass-panel rounded-lg p-4 text-center"
          >
            <p className="text-sm text-primary-foreground/70">
              📍 Capital: <span className="font-semibold text-primary-foreground">{stateData?.capital}</span>
              {' • '}
              Coordinates: {stateData?.lat.toFixed(2)}°N, {stateData?.lon.toFixed(2)}°E
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
