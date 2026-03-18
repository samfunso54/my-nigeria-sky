import { supabase } from "@/integrations/supabase/client";

export interface GeoResult {
  name: string;
  state: string;
  lat: number;
  lon: number;
}

export async function searchPlaces(query: string): Promise<GeoResult[]> {
  if (!query || query.length < 2) return [];

  const { data, error } = await supabase.functions.invoke("get-weather", {
    body: { action: "geocode", query },
  });

  if (error) {
    console.error("Geocoding error:", error);
    return [];
  }

  return data?.results || [];
}
