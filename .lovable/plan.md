

## Plan: Switch to Free Nominatim (OpenStreetMap) Geocoding

**Problem**: GeoNames API returns 401 because the account isn't enabled for free web services, causing a blank screen.

**Solution**: Replace GeoNames with **Nominatim** (OpenStreetMap's free geocoding API). It has comprehensive coverage of Nigerian towns/villages, requires no API key, and is completely free.

---

### Changes

**1. Update Edge Function** (`supabase/functions/get-weather/index.ts`)
- Replace the GeoNames `geocode` action with a call to Nominatim:
  `https://nominatim.openstreetmap.org/search?q=${query}&countrycodes=NG&format=json&limit=15&addressdetails=1`
- Remove the `GEONAMES_USERNAME` dependency
- Add a `User-Agent` header (required by Nominatim's usage policy)
- Map Nominatim response fields (`display_name`, `lat`, `lon`, `address.state`) to the existing `GeoResult` shape
- Add graceful error handling so search failures don't crash the app

**2. No frontend changes needed** — the response shape (`{ results: [{ name, state, lat, lon }] }`) stays identical, so `StateSearch` and `geocode.ts` work as-is.

### Technical Notes
- Nominatim usage policy: max 1 request/second, must include a `User-Agent` — the 400ms debounce in the frontend already satisfies the rate limit
- Nominatim has extensive Nigerian coverage including villages, towns, LGAs, and landmarks
- No API key or account registration required

