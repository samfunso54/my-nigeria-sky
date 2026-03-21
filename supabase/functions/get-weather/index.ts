import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const API_KEY = Deno.env.get("OPENWEATHERMAP_API_KEY");
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { action } = body;

    // Geocoding action: search for places in Nigeria using GeoNames
    if (action === "geocode") {
      const { query } = body;
      if (!query || query.length < 2) {
        return new Response(JSON.stringify({ results: [] }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const nomRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&countrycodes=NG&format=json&limit=15&addressdetails=1`,
        { headers: { "User-Agent": "WeatherNG/1.0 (lovable.app)" } }
      );

      if (!nomRes.ok) {
        const err = await nomRes.text();
        console.error(`Nominatim failed [${nomRes.status}]: ${err}`);
        return new Response(JSON.stringify({ results: [] }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const nomData = await nomRes.json();

      const seen = new Set<string>();
      const results = (nomData || [])
        .filter((r: any) => {
          const key = `${r.display_name}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        })
        .map((r: any) => ({
          name: r.display_name?.split(",")[0]?.trim() || r.name || "Unknown",
          state: r.address?.state || "",
          lat: parseFloat(r.lat),
          lon: parseFloat(r.lon),
        }));

      return new Response(JSON.stringify({ results }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Reverse geocoding: lat/lon → place name
    if (action === "reverse_geocode") {
      const { lat, lon } = body;
      if (!lat || !lon) {
        return new Response(JSON.stringify({ error: "lat and lon required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const revRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );

      if (!revRes.ok) {
        const err = await revRes.text();
        throw new Error(`Reverse geocode failed [${revRes.status}]: ${err}`);
      }

      const revData = await revRes.json();
      const place = revData[0];

      return new Response(
        JSON.stringify({
          name: place?.name || "Unknown",
          state: place?.state || "",
          lat: place?.lat || lat,
          lon: place?.lon || lon,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Default: fetch weather by lat/lon
    const { lat, lon } = body;

    if (!lat || !lon) {
      return new Response(JSON.stringify({ error: "lat and lon are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const [currentRes, forecastRes] = await Promise.all([
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      ),
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      ),
    ]);

    if (!currentRes.ok) {
      const err = await currentRes.text();
      throw new Error(`Current weather API failed [${currentRes.status}]: ${err}`);
    }
    if (!forecastRes.ok) {
      const err = await forecastRes.text();
      throw new Error(`Forecast API failed [${forecastRes.status}]: ${err}`);
    }

    const current = await currentRes.json();
    const forecast = await forecastRes.json();

    return new Response(JSON.stringify({ current, forecast }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Weather fetch error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
