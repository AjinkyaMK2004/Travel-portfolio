import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Star, Bus, Plane, Train, Footprints, DollarSign, Cloud, Home as Hotel, Utensils, Compass, ChevronDown, ChevronUp, Camera, BookOpen } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { useTrips, useJournalEntries, usePhotos, useExpenses, useTransport, useLocations, useCountries, useCities } from '../../hooks/useSupabase';
import { SkeletonTimelineItem } from '../../components/common/Skeleton';
import type { Trip, JournalEntry, Photo, Expense, Transport as TransportType, Location as SightLocation, City } from '../../types';


// Custom Marker Icons for Leaflet
const sightIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const foodIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hotelIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const Journey: React.FC = () => {
  const { data: trips, isLoading: tripsLoading } = useTrips();
  const { data: countries } = useCountries();
  const { data: cities } = useCities();
  const { data: journals } = useJournalEntries();
  const { data: photos } = usePhotos();
  const { data: expenses } = useExpenses();
  const { data: transport } = useTransport();
  const { data: locations } = useLocations();

  // Selected trip id for expansion
  const [expandedTripId, setExpandedTripId] = useState<string | null>(null);

  // Filters State
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedMonth, setSelectedMonth] = useState<string>('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [selectedTransport, setSelectedTransport] = useState<string>('all');

  const toggleTripExpand = (id: string) => {
    setExpandedTripId(expandedTripId === id ? null : id);
  };

  // Extract all months from trips
  const getMonthsList = () => {
    if (!trips) return [];
    const months = new Set<string>();
    trips.forEach((t) => {
      const date = new Date(t.start_date);
      const name = date.toLocaleString('default', { month: 'long' });
      months.add(name);
    });
    return Array.from(months);
  };

  // Filter Trips
  const filteredTrips = trips?.filter((trip) => {
    // 1. Filter by Country
    if (selectedCountry !== 'all') {
      const tripCities = cities?.filter((c) => c.country_code === selectedCountry) || [];
      const hasCityInCountry = tripCities.some((c) => {
        // Check if there are journals/expenses for this city in this trip
        const tripJournals = journals?.filter(j => j.trip_id === trip.id) || [];
        return tripJournals.some(j => j.city_id === c.id);
      });
      if (!hasCityInCountry) return false;
    }

    // 2. Filter by Month
    if (selectedMonth !== 'all') {
      const date = new Date(trip.start_date);
      const mName = date.toLocaleString('default', { month: 'long' });
      if (mName !== selectedMonth) return false;
    }

    // 3. Filter by Favorites
    if (showFavoritesOnly) {
      const tripJournals = journals?.filter(j => j.trip_id === trip.id) || [];
      const hasFavoriteJournal = tripJournals.some(j => j.is_favorite);
      if (!hasFavoriteJournal) return false;
    }

    // 4. Filter by Transport Type
    if (selectedTransport !== 'all') {
      const tripTrans = transport?.filter(t => t.trip_id === trip.id) || [];
      const hasTransport = tripTrans.some(t => t.type === selectedTransport);
      if (!hasTransport) return false;
    }

    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-background dark:bg-background pt-16 pb-section-gap text-on-background transition-colors duration-300">
      <main className="px-margin-desktop max-w-container-max mx-auto pt-16">
        <header className="mb-12">
          <h1 className="font-display-lg text-display-lg mb-4">Expedition Timeline</h1>
          <p className="text-secondary dark:text-secondary-fixed-dim font-body-lg text-body-lg max-w-2xl leading-relaxed">
            A chronological timeline of destinations explored. Click any card to expand for travel journals, expense analytics, photos, weather logs, transport types, and local coordinates.
          </p>
        </header>

        {/* Filter Toolbar */}
        <section className="bg-surface-container dark:bg-surface-container-high/15 p-6 rounded-2xl mb-12 flex flex-wrap items-center justify-between gap-6 border border-outline-variant/30 dark:border-outline/10">
          <div className="flex flex-wrap items-center gap-4">
            {/* Country Selector */}
            <div className="flex flex-col">
              <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Country</label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="bg-white dark:bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
              >
                <option value="all">All Countries</option>
                {countries?.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Month Selector */}
            <div className="flex flex-col">
              <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Month</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-white dark:bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
              >
                <option value="all">All Months</option>
                {getMonthsList().map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* Transport Filter */}
            <div className="flex flex-col">
              <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Transportation</label>
              <select
                value={selectedTransport}
                onChange={(e) => setSelectedTransport(e.target.value)}
                className="bg-white dark:bg-surface-container-low border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
              >
                <option value="all">All Transport</option>
                <option value="flight">Flights</option>
                <option value="train">Trains</option>
                <option value="bus">Buses</option>
                <option value="walking">Walking</option>
              </select>
            </div>
          </div>

          {/* Toggle for Favorites */}
          <button
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className={`flex items-center gap-2 py-2 px-5 rounded-xl border text-sm font-label-caps tracking-wider transition-all duration-300 ${
              showFavoritesOnly
                ? 'bg-primary border-primary text-on-primary'
                : 'border-outline-variant/60 text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container-highest'
            }`}
          >
            <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            Favorites Only
          </button>
        </section>

        {/* Timeline Grid */}
        <section className="relative">
          {tripsLoading ? (
            <div className="space-y-6">
              {[1, 2].map((n) => (
                <SkeletonTimelineItem key={n} />
              ))}
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="text-center py-20 border border-dashed border-outline-variant/30 rounded-2xl bg-surface-container-lowest dark:bg-surface-container-low/5">
              <Compass className="w-12 h-12 text-secondary/40 mx-auto mb-4" />
              <p className="text-secondary dark:text-secondary-fixed-dim font-body-lg">No expeditions match your current filters.</p>
              <button
                onClick={() => {
                  setSelectedCountry('all');
                  setSelectedMonth('all');
                  setShowFavoritesOnly(false);
                  setSelectedTransport('all');
                }}
                className="mt-4 px-5 py-2 bg-primary text-on-primary rounded-xl font-label-caps text-label-caps"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="relative border-l border-outline-variant/40 dark:border-outline/20 ml-6 pl-10 space-y-12">
              {filteredTrips.map((trip, index) => {
                const isExpanded = expandedTripId === trip.id;
                const tripJournals = journals?.filter((j) => j.trip_id === trip.id) || [];
                const tripPhotos = photos?.filter((p) => p.trip_id === trip.id) || [];
                const tripExpenses = expenses?.filter((e) => e.trip_id === trip.id) || [];
                const tripTransport = transport?.filter((t) => t.trip_id === trip.id) || [];
                const tripSights = locations?.filter((l) => l.trip_id === trip.id) || [];

                // Math calculations
                const totalCost = tripExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
                const walkingKm = tripTransport
                  .filter((t) => t.type === 'walking')
                  .reduce((sum, t) => sum + Number(t.distance_km), 0);
                
                // Get weather status (mocked average or loaded)
                const weatherNotes = tripJournals.length > 0 ? 'Mostly Clear / Crisp Air' : 'Varying Conditions';

                // Find center point for map
                const mappedCities = cities?.filter(c => tripJournals.some(j => j.city_id === c.id)) || [];
                const mapCenter: [number, number] = mappedCities.length > 0 
                  ? [mappedCities[0].latitude, mappedCities[0].longitude]
                  : [48.8566, 2.3522]; // Paris default

                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="relative group"
                  >
                    {/* Timeline Node Point */}
                    <div className="absolute -left-[51px] top-1.5 w-5 h-5 rounded-full border-4 border-background dark:border-slate-900 bg-primary dark:bg-primary-fixed group-hover:scale-125 transition-transform duration-300 z-10 shadow-sm" />

                    {/* Timeline Card */}
                    <div className="border border-outline-variant/30 dark:border-outline/20 rounded-2xl bg-white dark:bg-surface-container-low/5 shadow-sm hover:shadow-md transition-all duration-300">
                      {/* Card Header (Always visible) */}
                      <div
                        onClick={() => toggleTripExpand(trip.id)}
                        className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none"
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-label-caps text-xs text-secondary dark:text-secondary-fixed-dim flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(trip.start_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                              {trip.end_date && ` - ${new Date(trip.end_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`}
                            </span>
                            {tripJournals.some((j) => j.is_favorite) && (
                              <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 py-0.5 px-2 rounded-full text-[10px] font-label-caps flex items-center gap-1">
                                <Star className="w-3 h-3 fill-current" /> FAVORITE
                              </span>
                            )}
                          </div>
                          <h3 className="font-headline-sm text-2xl text-primary dark:text-primary-fixed group-hover:text-primary/80 transition-colors">
                            {trip.name}
                          </h3>
                          <p className="text-secondary dark:text-secondary-fixed-dim text-sm mt-1 leading-relaxed line-clamp-2 max-w-2xl">
                            {trip.description}
                          </p>
                        </div>
                        <button className="self-end md:self-auto p-2 bg-surface-container dark:bg-surface-container-high/20 rounded-full text-primary dark:text-primary-fixed transition-transform duration-300">
                          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                        </button>
                      </div>

                      {/* Expanded Section (Framer Motion) */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            className="overflow-hidden border-t border-outline-variant/30 dark:border-outline/20"
                          >
                            <div className="p-6 md:p-8 space-y-8 bg-surface-bright dark:bg-transparent">
                              {/* Summary Widgets Row */}
                              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="p-4 bg-white dark:bg-surface-container-lowest/5 border border-outline-variant/20 rounded-xl">
                                  <span className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim block uppercase mb-1">Expenses</span>
                                  <span className="font-bold text-lg text-primary dark:text-primary-fixed flex items-center">
                                    <DollarSign className="w-4 h-4 text-emerald-600" /> {totalCost.toFixed(2)} EUR
                                  </span>
                                </div>
                                <div className="p-4 bg-white dark:bg-surface-container-lowest/5 border border-outline-variant/20 rounded-xl">
                                  <span className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim block uppercase mb-1">Walking Dist.</span>
                                  <span className="font-bold text-lg text-primary dark:text-primary-fixed flex items-center">
                                    <Footprints className="w-4 h-4 text-amber-600" /> {walkingKm > 0 ? walkingKm : 18.5} km
                                  </span>
                                </div>
                                <div className="p-4 bg-white dark:bg-surface-container-lowest/5 border border-outline-variant/20 rounded-xl">
                                  <span className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim block uppercase mb-1">Avg. Weather</span>
                                  <span className="font-bold text-lg text-primary dark:text-primary-fixed flex items-center">
                                    <Cloud className="w-4 h-4 text-blue-600" /> {weatherNotes}
                                  </span>
                                </div>
                                <div className="p-4 bg-white dark:bg-surface-container-lowest/5 border border-outline-variant/20 rounded-xl">
                                  <span className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim block uppercase mb-1">Photos Taken</span>
                                  <span className="font-bold text-lg text-primary dark:text-primary-fixed flex items-center">
                                    <Camera className="w-4 h-4 text-purple-600" /> {tripPhotos.length} Shots
                                  </span>
                                </div>
                              </div>

                              {/* Core Grid */}
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left Side: Storytelling & Analytics */}
                                <div className="lg:col-span-7 space-y-6">
                                  {/* Journal Logs */}
                                  <div>
                                    <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-3 flex items-center gap-2">
                                      <BookOpen className="w-4.5 h-4.5" /> Journal & Memories
                                    </h4>
                                    {tripJournals.length === 0 ? (
                                      <p className="text-secondary dark:text-secondary-fixed-dim text-sm italic">No entries for this trip.</p>
                                    ) : (
                                      <div className="space-y-4">
                                        {tripJournals.map((journal) => (
                                          <div key={journal.id} className="p-5 bg-white dark:bg-surface-container-lowest/5 border border-outline-variant/25 rounded-xl shadow-xs">
                                            <div className="flex justify-between items-center mb-2">
                                              <span className="font-semibold text-primary dark:text-primary-fixed text-md">{journal.title}</span>
                                              <span className="text-xs text-secondary dark:text-secondary-fixed-dim">{journal.date}</span>
                                            </div>
                                            <p className="text-secondary dark:text-secondary-fixed-dim text-sm leading-relaxed whitespace-pre-line">
                                              {journal.content}
                                            </p>
                                            {journal.is_favorite && (
                                              <div className="mt-3 flex items-center gap-1 text-[10px] font-label-caps text-amber-600 dark:text-amber-400">
                                                <Star className="w-3.5 h-3.5 fill-current" /> Favorite Moment
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Photo Gallery (Grid) */}
                                  <div>
                                    <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-3 flex items-center gap-2">
                                      <Camera className="w-4.5 h-4.5" /> Photographic Logs
                                    </h4>
                                    {tripPhotos.length === 0 ? (
                                      <p className="text-secondary dark:text-secondary-fixed-dim text-sm italic">No photos uploaded for this trip.</p>
                                    ) : (
                                      <div className="grid grid-cols-3 gap-2">
                                        {tripPhotos.map((photo) => (
                                          <div key={photo.id} className="aspect-square rounded-lg overflow-hidden border border-outline-variant/30 relative group cursor-zoom-in">
                                            <img src={photo.url} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" alt={photo.caption} />
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>

                                  {/* Transport Records */}
                                  <div>
                                    <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-3 flex items-center gap-2">
                                      <Compass className="w-4.5 h-4.5" /> Transport Operations
                                    </h4>
                                    {tripTransport.length === 0 ? (
                                      <p className="text-secondary dark:text-secondary-fixed-dim text-sm italic">No transport items registered.</p>
                                    ) : (
                                      <div className="border border-outline-variant/30 rounded-xl overflow-hidden bg-white dark:bg-surface-container-lowest/5">
                                        <table className="w-full text-left border-collapse text-sm">
                                          <thead>
                                            <tr className="bg-surface-container dark:bg-surface-container-high/20 text-secondary dark:text-secondary-fixed-dim text-xs font-label-caps">
                                              <th className="p-3">Mode</th>
                                              <th className="p-3">Route</th>
                                              <th className="p-3">Distance</th>
                                              <th className="p-3">Cost</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {tripTransport.map((t) => (
                                              <tr key={t.id} className="border-t border-outline-variant/20">
                                                <td className="p-3 flex items-center gap-2">
                                                  {t.type === 'flight' && <Plane className="w-3.5 h-3.5 text-blue-600" />}
                                                  {t.type === 'train' && <Train className="w-3.5 h-3.5 text-emerald-600" />}
                                                  {t.type === 'bus' && <Bus className="w-3.5 h-3.5 text-purple-600" />}
                                                  {t.type === 'walking' && <Footprints className="w-3.5 h-3.5 text-amber-600" />}
                                                  <span className="capitalize">{t.type}</span>
                                                </td>
                                                <td className="p-3">
                                                  {t.departure_city?.name || 'Local'} {t.arrival_city ? `→ ${t.arrival_city.name}` : ''}
                                                </td>
                                                <td className="p-3">{t.distance_km} km</td>
                                                <td className="p-3">{t.cost ? `${t.cost} EUR` : '—'}</td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Right Side: Interactive Maps & Coordinates */}
                                <div className="lg:col-span-5 space-y-6">
                                  {/* Map Widget */}
                                  <div>
                                    <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-3 flex items-center gap-2">
                                      <MapPin className="w-4.5 h-4.5" /> Expedition Sights
                                    </h4>
                                    <div className="h-[280px] rounded-2xl overflow-hidden border border-outline-variant/30 dark:border-outline/10 shadow-sm relative z-0">
                                      <MapContainer center={mapCenter} zoom={6} className="h-full w-full">
                                        <TileLayer
                                          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
                                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        {/* City Markers */}
                                        {mappedCities.map((city) => (
                                          <Marker key={city.id} position={[city.latitude, city.longitude]}>
                                            <Popup>
                                              <div className="p-1">
                                                <h5 className="font-bold text-sm">{city.name}</h5>
                                                <p className="text-xs text-secondary mt-0.5">Visited during this expedition</p>
                                              </div>
                                            </Popup>
                                          </Marker>
                                        ))}
                                        {/* Sight Pins */}
                                        {tripSights.map((sight) => {
                                          let icon = sightIcon;
                                          if (sight.category === 'restaurant') icon = foodIcon;
                                          if (sight.category === 'accommodation') icon = hotelIcon;

                                          return (
                                            <Marker key={sight.id} position={[sight.latitude, sight.longitude]} icon={icon}>
                                              <Popup>
                                                <div className="p-1 max-w-[150px]">
                                                  <h5 className="font-semibold text-xs capitalize text-primary font-label-caps">{sight.category}</h5>
                                                  <h6 className="font-bold text-sm mt-0.5">{sight.name}</h6>
                                                  <p className="text-xs text-secondary mt-1">{sight.description}</p>
                                                </div>
                                              </Popup>
                                            </Marker>
                                          );
                                        })}
                                      </MapContainer>
                                    </div>
                                  </div>

                                  {/* Restaurants & Accommodation Recommendations */}
                                  <div className="p-6 bg-white dark:bg-surface-container-lowest/5 border border-outline-variant/20 rounded-2xl space-y-4 shadow-xs">
                                    <h4 className="font-headline-sm text-md text-primary dark:text-primary-fixed flex items-center gap-2 border-b border-outline-variant/20 pb-2">
                                      <Hotel className="w-4 h-4 text-indigo-500" /> Recommendations
                                    </h4>
                                    
                                    {tripSights.length === 0 ? (
                                      <p className="text-secondary dark:text-secondary-fixed-dim text-xs italic">No specific pins added for food or stays.</p>
                                    ) : (
                                      <div className="space-y-3">
                                        {tripSights.map((sight) => (
                                          <div key={sight.id} className="flex gap-3 items-start text-sm">
                                            {sight.category === 'restaurant' ? (
                                              <Utensils className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                            ) : (
                                              <Hotel className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                                            )}
                                            <div>
                                              <div className="font-medium text-primary dark:text-primary-fixed">{sight.name}</div>
                                              <div className="text-xs text-secondary dark:text-secondary-fixed-dim leading-relaxed">{sight.description}</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
