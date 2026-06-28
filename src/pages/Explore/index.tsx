import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { Play, Pause, RotateCcw, X, MapPin, DollarSign, BookOpen, Layers } from 'lucide-react';
import { useCountries, useCities, usePhotos, useJournalEntries, useExpenses, useTransport } from '../../hooks/useSupabase';
import { SkeletonMapPanel } from '../../components/common/Skeleton';
import type { Country, City, Photo, JournalEntry, Expense, Transport as TransportType } from '../../types';


// Custom Map Marker Icons
const cameraIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/1042/1042336.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

const bookMarkerIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/3429/3429159.png',
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

export const Explore: React.FC = () => {
  const { data: dbCountries } = useCountries();
  const { data: dbCities } = useCities();
  const { data: dbPhotos } = usePhotos();
  const { data: dbJournals } = useJournalEntries();
  const { data: dbExpenses } = useExpenses();
  const { data: dbTransport } = useTransport();

  // Selected Country for Drawer
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null);

  // Layers Visibility
  const [layers, setLayers] = useState({
    photos: true,
    walking: true,
    trains: true,
    flights: true,
    journals: true
  });

  // Replay System States
  const [isPlaying, setIsPlaying] = useState(false);
  const [replayIndex, setReplayIndex] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // Sorted timeline of travels (based on cities visited dates or transport dates)
  const [travelTimeline, setTravelTimeline] = useState<{ date: string; city: City }[]>([]);

  // GeoJSON data state
  const [geoJsonData, setGeoJsonData] = useState<any>(null);

  // Load geojson for Europe borders
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/leakyMirror/map-of-europe/master/GeoJSON/europe.geojson')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load Europe boundaries');
        return res.json();
      })
      .then((data) => setGeoJsonData(data))
      .catch((err) => console.error(err));
  }, []);

  // Compile sorted timeline of cities
  useEffect(() => {
    if (dbCities && dbCities.length > 0) {
      const sorted = [...dbCities]
        .filter((c) => c.visited_date)
        .map((c) => ({ date: c.visited_date!, city: c }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setTravelTimeline(sorted);
      // Set slider to max by default
      setReplayIndex(sorted.length > 0 ? sorted.length - 1 : 0);
    }
  }, [dbCities]);

  // Replay Animation Tick
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setReplayIndex((prev) => {
          if (prev >= travelTimeline.length - 1) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, travelTimeline]);

  // Active Date Threshold based on Replay Slider
  const activeDate = travelTimeline.length > 0 && travelTimeline[replayIndex]
    ? travelTimeline[replayIndex].date
    : new Date().toISOString().split('T')[0];

  // Helper to map country borders styling based on database values
  const getCountryStyle = (feature: any) => {
    const iso2 = feature.properties?.ISO2 || feature.properties?.ISO_A2 || '';
    const dbCountry = dbCountries?.find(
      (c) => c.code === iso2 || c.name.toLowerCase() === feature.properties?.NAME?.toLowerCase()
    );

    const status = dbCountry ? dbCountry.status : 'not_visited';

    let fillColor = '#f1f5f9'; // Soft slate-gray for not visited
    let fillOpacity = 0.5;
    let dashArray = '';
    let weight = 1;
    let color = '#cbd5e1'; // Light grey outline for cleaner boundaries

    if (status === 'visited') {
      fillColor = '#3b82f6'; // Premium vibrant royal blue
      fillOpacity = 0.25;    // Semi-transparent overlay to reveal geographical map details
      color = '#2563eb';     // Solid blue border
      weight = 1.5;
    } else if (status === 'current') {
      fillColor = '#10b981'; // Vibrant emerald green
      fillOpacity = 0.35;
      color = '#059669';     // Solid emerald border
      weight = 2;
    } else if (status === 'planned') {
      fillColor = '#f59e0b'; // Soft amber orange
      fillOpacity = 0.18;
      color = '#d97706';     // Solid orange border
      dashArray = '3, 5';
      weight = 1.5;
    }

    return {
      fillColor,
      fillOpacity,
      color,
      weight,
      dashArray
    };
  };

  // Filter components chronologically up to the active date slider
  const visibleCities = dbCities?.filter((c) => !c.visited_date || c.visited_date <= activeDate) || [];
  const visiblePhotos = dbPhotos?.filter((p) => p.taken_at <= activeDate) || [];
  const visibleJournals = dbJournals?.filter((j) => j.date <= activeDate) || [];

  // Filter transport modes
  const visibleTransport = dbTransport?.filter((t) => t.date <= activeDate) || [];

  // Compile Selected Country Info for Panel
  const selectedCountry = dbCountries?.find((c) => c.code === selectedCountryCode);
  const countryCities = dbCities?.filter((c) => c.country_code === selectedCountryCode) || [];
  const countryPhotos = dbPhotos?.filter((p) => p.country_code === selectedCountryCode) || [];
  const countryJournals = dbJournals?.filter((j) => countryCities.some((c) => c.id === j.city_id)) || [];
  const countryExpenses = dbExpenses?.filter((e) => countryCities.some((c) => c.id === e.city_id)) || [];
  const countryTotalExpense = countryExpenses.reduce((sum, e) => sum + Number(e.amount), 0);

  return (
    <div className="h-[calc(100vh-73px)] w-full relative z-0 overflow-hidden flex pt-[73px]">
      {/* Map Zone */}
      <div className="flex-1 h-full w-full relative">
        <MapContainer center={[50, 10]} zoom={4.2} minZoom={3.5} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Europe Country Polygons */}
          {geoJsonData && (
            <GeoJSON
              data={geoJsonData}
              style={getCountryStyle}
              onEachFeature={(feature, layer) => {
                const code = feature.properties?.ISO2 || feature.properties?.ISO_A2 || '';
                const name = feature.properties?.NAME || '';
                layer.bindTooltip(name, { sticky: true, className: 'text-xs font-label-caps p-1 rounded bg-white/90 shadow' });
                layer.on('click', () => {
                  if (code) setSelectedCountryCode(code);
                });
              }}
            />
          )}

          {/* Chronological City Markers */}
          {visibleCities.map((city) => (
            <Marker key={city.id} position={[city.latitude, city.longitude]}>
              <Popup>
                <div className="p-1">
                  <span className="text-[10px] font-label-caps text-secondary block">CITY</span>
                  <h4 className="font-bold text-sm text-primary">{city.name}</h4>
                  {city.visited_date && <p className="text-xs text-secondary">Visited: {city.visited_date}</p>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Optional Layer: Photo Markers */}
          {layers.photos && visiblePhotos.map((photo) => {
            const city = dbCities?.find((c) => c.id === photo.city_id);
            if (!city) return null;
            return (
              <Marker key={photo.id} position={[city.latitude + 0.012, city.longitude - 0.015]} icon={cameraIcon}>
                <Popup className="photo-popup">
                  <div className="p-1 max-w-[200px]">
                    <img src={photo.url} className="w-full h-24 object-cover rounded-lg mb-2" alt={photo.caption} />
                    <p className="text-xs text-primary font-medium leading-normal">{photo.caption}</p>
                    <span className="text-[9px] font-label-caps text-secondary block mt-1">{photo.taken_at}</span>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Optional Layer: Journal Pins */}
          {layers.journals && visibleJournals.map((j) => {
            const city = dbCities?.find((c) => c.id === j.city_id);
            if (!city) return null;
            return (
              <Marker key={j.id} position={[city.latitude - 0.015, city.longitude + 0.015]} icon={bookMarkerIcon}>
                <Popup>
                  <div className="p-2 max-w-[220px]">
                    <span className="text-[10px] font-label-caps text-amber-600 block flex items-center gap-1">
                      <BookOpen className="w-3 h-3 fill-current" /> MEMORY PINS
                    </span>
                    <h4 className="font-bold text-sm mt-1">{j.title}</h4>
                    <p className="text-xs text-secondary leading-relaxed mt-1 line-clamp-3">{j.content}</p>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          {/* Route Layers (Flights / Trains / Walking) */}
          {visibleTransport.map((trans) => {
            const depCity = dbCities?.find((c) => c.id === trans.departure_city_id);
            const arrCity = dbCities?.find((c) => c.id === trans.arrival_city_id);
            if (!depCity || !arrCity) return null;

            const path: [number, number][] = [
              [depCity.latitude, depCity.longitude],
              [arrCity.latitude, arrCity.longitude]
            ];

            if (trans.type === 'flight' && layers.flights) {
              return (
                <Polyline
                  key={trans.id}
                  positions={path}
                  color="#3b82f6" // blue flight line
                  weight={2.5}
                  dashArray="5, 8"
                />
              );
            }
            if (trans.type === 'train' && layers.trains) {
              return (
                <Polyline
                  key={trans.id}
                  positions={path}
                  color="#10b981" // green train line
                  weight={2}
                />
              );
            }
            if (trans.type === 'walking' && layers.walking) {
              return (
                <Polyline
                  key={trans.id}
                  positions={path}
                  color="#f59e0b" // orange walking line
                  weight={1.5}
                  dashArray="2, 4"
                />
              );
            }
            return null;
          })}
        </MapContainer>

        {/* Floating Layer Selection Panel */}
        <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur px-5 py-4 rounded-2xl shadow-md border border-outline-variant/30 dark:border-outline/10 z-10 space-y-3 max-w-[200px]">
          <h5 className="font-label-caps text-xs text-primary dark:text-primary-fixed flex items-center gap-2 border-b border-outline-variant/30 dark:border-outline/15 pb-2">
            <Layers className="w-4 h-4 text-primary" /> Map Layers
          </h5>
          <div className="space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-secondary dark:text-secondary-fixed-dim cursor-pointer">
              <input
                type="checkbox"
                checked={layers.photos}
                onChange={(e) => setLayers({ ...layers, photos: e.target.checked })}
                className="rounded border-outline-variant text-primary focus:ring-0 w-3.5 h-3.5"
              />
              Photos Pins
            </label>
            <label className="flex items-center gap-2.5 text-xs text-secondary dark:text-secondary-fixed-dim cursor-pointer">
              <input
                type="checkbox"
                checked={layers.journals}
                onChange={(e) => setLayers({ ...layers, journals: e.target.checked })}
                className="rounded border-outline-variant text-primary focus:ring-0 w-3.5 h-3.5"
              />
              Memory Pins
            </label>
            <label className="flex items-center gap-2.5 text-xs text-secondary dark:text-secondary-fixed-dim cursor-pointer">
              <input
                type="checkbox"
                checked={layers.flights}
                onChange={(e) => setLayers({ ...layers, flights: e.target.checked })}
                className="rounded border-outline-variant text-primary focus:ring-0 w-3.5 h-3.5"
              />
              Flight Paths
            </label>
            <label className="flex items-center gap-2.5 text-xs text-secondary dark:text-secondary-fixed-dim cursor-pointer">
              <input
                type="checkbox"
                checked={layers.trains}
                onChange={(e) => setLayers({ ...layers, trains: e.target.checked })}
                className="rounded border-outline-variant text-primary focus:ring-0 w-3.5 h-3.5"
              />
              Train Routes
            </label>
            <label className="flex items-center gap-2.5 text-xs text-secondary dark:text-secondary-fixed-dim cursor-pointer">
              <input
                type="checkbox"
                checked={layers.walking}
                onChange={(e) => setLayers({ ...layers, walking: e.target.checked })}
                className="rounded border-outline-variant text-primary focus:ring-0 w-3.5 h-3.5"
              />
              Walking Lines
            </label>
          </div>
        </div>

        {/* Timeline Slider / Replay Bar */}
        {travelTimeline.length > 0 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-lg border border-outline-variant/30 dark:border-outline/10 z-10 w-[90%] max-w-2xl">
            <div className="flex items-center justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 bg-primary text-on-primary rounded-full hover:bg-primary/95 transition-all active:scale-90"
                  title={isPlaying ? 'Pause Replay' : 'Play Replay'}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setReplayIndex(0);
                  }}
                  className="p-2 text-secondary hover:bg-surface-container rounded-full"
                  title="Reset Replay"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
              <div className="text-right">
                <span className="font-label-caps text-xs text-primary dark:text-primary-fixed block font-bold">
                  {travelTimeline[replayIndex]?.city.name || 'Expedition'}
                </span>
                <span className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim">
                  Date: {activeDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-label-caps text-secondary">Start</span>
              <input
                type="range"
                min="0"
                max={travelTimeline.length - 1}
                value={replayIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setReplayIndex(Number(e.target.value));
                }}
                className="flex-1 accent-primary h-1 bg-surface-container rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-[10px] font-label-caps text-secondary">End</span>
            </div>
          </div>
        )}
      </div>

      {/* Side Detail Panel (Drawer) */}
      <AnimatePresence>
        {selectedCountryCode && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full md:w-[420px] bg-white dark:bg-slate-900 shadow-xl border-l border-outline-variant/30 dark:border-outline/20 h-full overflow-y-auto flex flex-col relative z-20"
          >
            {/* Drawer Header */}
            <div className="p-6 border-b border-outline-variant/30 dark:border-outline/20 flex justify-between items-center bg-surface-bright dark:bg-slate-900/60 backdrop-blur sticky top-0 z-10">
              <div>
                <span className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider block mb-1">
                  Country Profile
                </span>
                <h3 className="font-headline-sm text-2xl text-primary dark:text-primary-fixed">
                  {selectedCountry ? selectedCountry.name : 'Unknown Country'}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCountryCode(null)}
                className="p-2 text-secondary hover:text-primary hover:bg-surface-container dark:hover:bg-surface-container-high/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Content */}
            <div className="p-6 space-y-6 flex-1">
              {!selectedCountry ? (
                <SkeletonMapPanel />
              ) : (
                <>
                  {/* Status Banner */}
                  <div className={`p-4 rounded-xl flex items-center justify-between text-sm font-label-caps uppercase ${
                    selectedCountry.status === 'visited'
                      ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : selectedCountry.status === 'current'
                      ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      : 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                  }`}>
                    <span>Expedition Status</span>
                    <span className="font-bold">{selectedCountry.status}</span>
                  </div>

                  {/* General Statistics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-surface-container-low dark:bg-surface-container-high/10 rounded-xl border border-outline-variant/20">
                      <span className="text-[10px] font-label-caps text-secondary uppercase block mb-1">Cities Explored</span>
                      <span className="font-bold text-lg text-primary dark:text-primary-fixed flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" /> {countryCities.length} Locations
                      </span>
                    </div>
                    <div className="p-4 bg-surface-container-low dark:bg-surface-container-high/10 rounded-xl border border-outline-variant/20">
                      <span className="text-[10px] font-label-caps text-secondary uppercase block mb-1">Budget Expended</span>
                      <span className="font-bold text-lg text-primary dark:text-primary-fixed flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-emerald-600" /> {countryTotalExpense.toFixed(2)} EUR
                      </span>
                    </div>
                  </div>

                  {/* Favorite Memory */}
                  {selectedCountry.favorite_memory && (
                    <div className="p-5 bg-amber-500/5 border border-amber-500/20 rounded-xl space-y-2">
                      <span className="text-[10px] font-label-caps text-amber-600 dark:text-amber-400 uppercase tracking-widest block font-bold">
                        Favorite Memory
                      </span>
                      <p className="text-secondary dark:text-secondary-fixed-dim text-sm italic leading-relaxed">
                        "{selectedCountry.favorite_memory}"
                      </p>
                    </div>
                  )}

                  {/* Visited Cities List */}
                  <div className="space-y-3">
                    <h4 className="font-headline-sm text-md text-primary dark:text-primary-fixed border-b border-outline-variant/30 pb-2">
                      Cities List
                    </h4>
                    {countryCities.length === 0 ? (
                      <p className="text-xs text-secondary italic">No cities marked in this country.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {countryCities.map((c) => (
                          <span key={c.id} className="py-1 px-3 bg-surface-container dark:bg-surface-container-high/20 rounded-full text-xs text-primary dark:text-primary-fixed font-label-caps">
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Journal logs in this Country */}
                  <div className="space-y-3">
                    <h4 className="font-headline-sm text-md text-primary dark:text-primary-fixed border-b border-outline-variant/30 pb-2">
                      Journal Notes
                    </h4>
                    {countryJournals.length === 0 ? (
                      <p className="text-xs text-secondary italic">No journals logs registered for this country.</p>
                    ) : (
                      <div className="space-y-3">
                        {countryJournals.map((journal) => (
                          <div key={journal.id} className="p-4 border border-outline-variant/20 rounded-xl bg-white dark:bg-slate-900/60 shadow-xs">
                            <h5 className="font-bold text-sm text-primary dark:text-primary-fixed mb-1">{journal.title}</h5>
                            <span className="text-[9px] text-secondary font-label-caps block mb-2">{journal.date}</span>
                            <p className="text-xs text-secondary dark:text-secondary-fixed-dim leading-relaxed line-clamp-3">
                              {journal.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Country Gallery Photos */}
                  <div className="space-y-3">
                    <h4 className="font-headline-sm text-md text-primary dark:text-primary-fixed border-b border-outline-variant/30 pb-2">
                      Captured Media
                    </h4>
                    {countryPhotos.length === 0 ? (
                      <p className="text-xs text-secondary italic">No photos uploaded for this country.</p>
                    ) : (
                      <div className="grid grid-cols-3 gap-2">
                        {countryPhotos.map((photo) => (
                          <div key={photo.id} className="aspect-square rounded-lg overflow-hidden border border-outline-variant/20 bg-surface-container">
                            <img src={photo.url} className="w-full h-full object-cover" alt={photo.caption} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
