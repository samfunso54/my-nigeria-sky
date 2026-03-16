import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import heroImg from '@/assets/hero-prelogin.jpg';
import { WeatherCard } from '@/components/WeatherCard';
import { AuthForm } from '@/components/AuthForm';
import { Navbar } from '@/components/Navbar';
import { fetchWeather, type WeatherData } from '@/lib/weatherService';
import { CloudSun, Shield, Bell, Globe, Loader2 } from 'lucide-react';

export default function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [lagosWeather, setLagosWeather] = useState<WeatherData | null>(null);
  const [abujaWeather, setAbujaWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    fetchWeather(6.45, 3.39, 'Lagos', 'Lagos').then(r => setLagosWeather(r.weather)).catch(() => {});
    fetchWeather(9.06, 7.49, 'Abuja', 'FCT').then(r => setAbujaWeather(r.weather)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 z-0">
        <img src={heroImg} alt="Lagos skyline at sunset" className="w-full h-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
      </div>

      <Navbar onAuthClick={() => setShowAuth(true)} />

      <div className="relative z-10 pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-center mb-12">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              Nigeria's Weather,{' '}
              <span className="text-secondary">Beautifully</span>
            </h1>
            <p className="text-lg sm:text-xl text-primary-foreground/80 font-body max-w-2xl mx-auto">
              Real-time forecasts for all 36 states and FCT. Stay informed, stay prepared.
            </p>
          </motion.div>

          {showAuth ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12">
              <AuthForm onSuccess={() => setShowAuth(false)} />
              <button onClick={() => setShowAuth(false)} className="block mx-auto mt-4 text-sm text-primary-foreground/60 hover:text-primary-foreground">
                ← Back to weather
              </button>
            </motion.div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
                {lagosWeather ? (
                  <WeatherCard weather={lagosWeather} delay={0.2} />
                ) : (
                  <div className="glass-panel rounded-lg p-6 flex items-center justify-center min-h-[200px]">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-foreground/60" />
                  </div>
                )}
                {abujaWeather ? (
                  <WeatherCard weather={abujaWeather} delay={0.4} />
                ) : (
                  <div className="glass-panel rounded-lg p-6 flex items-center justify-center min-h-[200px]">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-foreground/60" />
                  </div>
                )}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: CloudSun, label: '37 States', desc: 'Full coverage' },
                  { icon: Shield, label: 'Secure', desc: 'Your data, safe' },
                  { icon: Bell, label: 'Alerts', desc: 'Stay updated' },
                  { icon: Globe, label: 'Global', desc: 'Worldwide lookup' },
                ].map((feat) => (
                  <div key={feat.label} className="glass-panel rounded-lg p-4 text-center">
                    <feat.icon className="w-6 h-6 text-secondary mx-auto mb-2" />
                    <p className="font-semibold text-primary-foreground text-sm">{feat.label}</p>
                    <p className="text-xs text-primary-foreground/60">{feat.desc}</p>
                  </div>
                ))}
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
