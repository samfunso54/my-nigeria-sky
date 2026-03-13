import { useState, useRef, useEffect } from 'react';
import { nigerianStates } from '@/lib/nigerianStates';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StateSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export function StateSearch({ value, onChange }: StateSearchProps) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = nigerianStates.filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.capital.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search any Nigerian state or capital…"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          className="pl-10 bg-card border-border font-body h-11 text-sm"
        />
      </div>

      {open && query.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md bg-popover border border-border shadow-lg max-h-60 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-4 py-3 text-sm text-muted-foreground">No states found</p>
          ) : (
            filtered.map((state) => (
              <button
                key={state.name}
                onClick={() => {
                  onChange(state.name);
                  setQuery('');
                  setOpen(false);
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span className="font-medium text-foreground">{state.name}</span>
                <span className="text-muted-foreground">— {state.capital}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
