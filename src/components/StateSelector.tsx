import { nigerianStates } from '@/lib/nigerianStates';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin } from 'lucide-react';

interface StateSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function StateSelector({ value, onChange }: StateSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <MapPin className="w-5 h-5 text-secondary" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[220px] bg-card border-border font-body">
          <SelectValue placeholder="Select a state" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {nigerianStates.map((state) => (
            <SelectItem key={state.name} value={state.name}>
              {state.name} — {state.capital}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
