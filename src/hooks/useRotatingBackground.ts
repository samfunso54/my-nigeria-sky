import { useState, useCallback } from 'react';
import bg1 from '@/assets/bg-1.jpg';
import bg2 from '@/assets/bg-2.jpg';
import bg3 from '@/assets/bg-3.jpg';
import bg4 from '@/assets/bg-4.jpg';
import bg5 from '@/assets/bg-5.jpg';

const backgrounds = [bg1, bg2, bg3, bg4, bg5];

export function useRotatingBackground() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((prev) => (prev + 1) % backgrounds.length);
  }, []);

  return { bg: backgrounds[index], next };
}
