import { useState, useRef, useEffect, useCallback } from 'react';
import { nigerianStates } from '@/lib/nigerianStates';
import { searchPlaces, type GeoResult } from '@/lib/geocode';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export interface PlaceSelection {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

interface StateSearchProps {
  onSelect: (place: PlaceSelection) => void;
}

export function StateSearch({ onSelect }: StateSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [apiResults, setApiResults] = useState<GeoResult[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const localMatches = query.length > 0
    ? nigerianStates.filter(
        (s) =>
          s.name.toLowerCase().includes(query.toLowerCase()) ||
          s.capital.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const searchApi = useCallback((q: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) {
      setApiResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const results = await searchPlaces(q);
      setApiResults(results);
      setLoading(false);
    }, 400);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLocateMe = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lon } = position.coords;
          const { data, error } = await supabase.functions.invoke('get-weather', {
            body: { action: 'reverse_geocode', lat, lon },
          });

          if (error) throw error;

          onSelect({
            name: data.name || 'Your Location',
            state: data.state || '',
            lat: data.lat || lat,
            lon: data.lon || lon,
          });
          setQuery('');
          setOpen(false);
          toast.success(`📍 Detected: ${data.name || 'Your Location'}`);
        } catch (err) {
          console.error('Reverse geocode error:', err);
          toast.error('Could not determine your location name');
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          toast.error('Location access denied. Please allow location in your browser settings.');
        } else {
          toast.error('Could not get your location');
        }
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, [onSelect]);

  const seen = new Set<string>();
  const combinedResults: PlaceSelection[] = [];

  for (const s of localMatches) {
    const key = s.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      combinedResults.push({ name: s.name, state: s.name, lat: s.lat, lon: s.lon });
    }
  }

  for (const r of apiResults) {
    const key = r.name.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      combinedResults.push(r);
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search any place in Nigeria…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              searchApi(e.target.value);
            }}
            onFocus={() => query.length > 0 && setOpen(true)}
            className="pl-10 bg-card border-border font-body h-11 text-sm"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleLocateMe}
          disabled={locating}
          className="h-11 w-11 shrink-0 bg-card border-border hover:bg-accent hover:text-accent-foreground"
          title="Use my current location"
        >
          {locating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LocateFixed className="w-4 h-4" />
          )}
        </Button>
      </div>

      {open && query.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-popover border border-border shadow-lg max-h-60 overflow-y-auto">
          {combinedResults.length === 0 && !loading ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">No places found</p>
          ) : (
            <>
              {combinedResults.map((place, i) => (
                <button
                  key={`${place.name}-${place.lat}-${i}`}
                  onClick={() => {
                    onSelect(place);
                    setQuery('');
                    setOpen(false);
                    setApiResults([]);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span className="font-medium text-foreground">{place.name}</span>
                  {place.state && place.state !== place.name && (
                    <span className="text-muted-foreground">— {place.state}</span>
                  )}
                </button>
              ))}
              {loading && (
                <div className="flex items-center gap-2 px-4 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Searching more places…
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}