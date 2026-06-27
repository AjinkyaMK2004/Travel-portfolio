import type { Country, Trip, City, JournalEntry, Expense, Transport, Photo, Location, FavoritePlace, Statistic } from '../types';

export const INITIAL_COUNTRIES: Country[] = [
  { code: 'FR', name: 'France', status: 'visited', favorite_memory: 'Wandering Paris streets in twilight rain.' },
  { code: 'IT', name: 'Italy', status: 'visited', favorite_memory: 'Enjoying traditional orecchiette pasta in Puglia.' },
  { code: 'CH', name: 'Switzerland', status: 'visited', favorite_memory: 'Riding the train through Jungfraujoch Pass.' },
  { code: 'SE', name: 'Sweden', status: 'visited', favorite_memory: 'Cozy fika moments in Stockholm.' },
  { code: 'GB', name: 'United Kingdom', status: 'visited', favorite_memory: 'Moody sunset walk near Big Ben.' },
  { code: 'DE', name: 'Germany', status: 'planned', favorite_memory: '' },
  { code: 'ES', name: 'Spain', status: 'planned', favorite_memory: '' },
  { code: 'AT', name: 'Austria', status: 'visited', favorite_memory: 'Sipping coffee in Vienna cafés.' },
  { code: 'NL', name: 'Netherlands', status: 'visited', favorite_memory: 'Cycling along the canals in Amsterdam.' },
  { code: 'NO', name: 'Norway', status: 'planned', favorite_memory: '' },
  { code: 'DK', name: 'Denmark', status: 'visited', favorite_memory: 'Strolling through Nyhavn.' },
  { code: 'BE', name: 'Belgium', status: 'visited', favorite_memory: 'Tasting authentic waffles in Brussels.' },
  { code: 'GR', name: 'Greece', status: 'planned', favorite_memory: '' },
  { code: 'PT', name: 'Portugal', status: 'current', favorite_memory: 'Sunsets in Lisbon.' }
];

export const INITIAL_TRIPS: Trip[] = [
  { id: 'trip-1', name: 'Autumn Exchange Semester', start_date: '2023-09-01', end_date: '2023-12-20', description: 'Exchange semester based in Europe exploring central and northern regions.' },
  { id: 'trip-2', name: 'Mediterranean Winter Escapes', start_date: '2024-01-10', end_date: '2024-03-05', description: 'Winter tour looking for warm coastal scenery and historical exploration.' },
  { id: 'trip-3', name: 'Alpine & Spring Expedition', start_date: '2024-04-15', end_date: '2024-05-30', description: 'Spring travel highlighting Swiss mountain passes and Italian canals.' }
];

export const INITIAL_CITIES: City[] = [
  { id: 'city-1', name: 'Paris', country_code: 'FR', latitude: 48.8566, longitude: 2.3522, visited_date: '2023-10-15' },
  { id: 'city-2', name: 'Bari (Puglia)', country_code: 'IT', latitude: 41.1171, longitude: 16.8719, visited_date: '2023-09-18' },
  { id: 'city-3', name: 'Lauterbrunnen', country_code: 'CH', latitude: 46.5935, longitude: 7.9090, visited_date: '2023-12-05' },
  { id: 'city-4', name: 'Stockholm', country_code: 'SE', latitude: 59.3293, longitude: 18.0686, visited_date: '2023-11-12' },
  { id: 'city-5', name: 'Positano (Amalfi)', country_code: 'IT', latitude: 40.6281, longitude: 14.4850, visited_date: '2023-08-28' },
  { id: 'city-6', name: 'London', country_code: 'GB', latitude: 51.5074, longitude: -0.1278, visited_date: '2024-01-20' },
  { id: 'city-7', name: 'Venice', country_code: 'IT', latitude: 45.4408, longitude: 12.3155, visited_date: '2024-05-14' }
];

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'journal-1',
    trip_id: 'trip-1',
    city_id: 'city-1',
    title: 'The 7th Arrondissement, Paris',
    content: 'A cinematic low-angle view of a Haussmann-style building in Paris during the golden hour. The sunlight hit the limestone facades with a warm glowing orange. Spent the evening drinking espresso on the corner and walking along the Seine.',
    date: '2023-10-15',
    is_favorite: true
  },
  {
    id: 'journal-2',
    trip_id: 'trip-1',
    city_id: 'city-2',
    title: 'Traditional Orecchiette, Puglia',
    content: 'Had a top-down editorial food experience of authentic Italian pasta served on a rustic ceramic plate. We met an old lady in the alleys of Bari Vecchia making fresh orecchiette on wooden tables right outside her doorway. The simple sauce of cherry tomatoes, olive oil, and fresh basil was mindblowing.',
    date: '2023-09-18',
    is_favorite: true
  },
  {
    id: 'journal-3',
    trip_id: 'trip-1',
    city_id: 'city-3',
    title: 'Jungfraujoch Pass, Lauterbrunnen',
    content: 'A breathtaking wide landscape of the Swiss Alps during dawn. Snow-covered peaks piercing the clouds. Riding the cogwheel train up to the highest station in Europe at 3,454 meters felt like climbing into another dimension.',
    date: '2023-12-05',
    is_favorite: true
  },
  {
    id: 'journal-4',
    trip_id: 'trip-1',
    city_id: 'city-4',
    title: 'Södermalm District, Stockholm',
    content: 'A minimalist interior look into a contemporary Scandinavian coffee shop in Stockholm. Clean birch wood, soft yellow lighting, and the scent of freshly baked cardamom buns. Locals call this fika - a dedicated time to slow down and chat.',
    date: '2023-11-12',
    is_favorite: false
  },
  {
    id: 'journal-5',
    trip_id: 'trip-1',
    city_id: 'city-5',
    title: 'Positano Shoreline, Italy',
    content: 'Stunning aerial view of the Amalfi Coast\'s turquoise waters. Houses cascading down the cliffs in shades of terracotta, pink, and peach. We climbed down 400 stone steps to reach the beach and swam in the cool Tyrrhenian Sea.',
    date: '2023-08-28',
    is_favorite: true
  },
  {
    id: 'journal-6',
    trip_id: 'trip-2',
    city_id: 'city-6',
    title: 'Regent Street Twilight, London',
    content: 'A moody, atmospheric street scene in London during a light rain. Red double-decker buses illuminating the wet asphalt, reflecting the golden streetlights. Walking through Mayfair with an umbrella felt uniquely peaceful.',
    date: '2024-01-20',
    is_favorite: false
  },
  {
    id: 'journal-7',
    trip_id: 'trip-3',
    city_id: 'city-7',
    title: 'The Quiet Dawn at Piazza San Marco',
    content: 'Waking before the crowds revealed a version of Venice that felt untouched by time. The morning mist clung to the Basilica\'s golden mosaics, while the only sound was the soft lap of water against the limestone quays.',
    date: '2024-05-14',
    is_favorite: true
  }
];

export const INITIAL_PHOTOS: Photo[] = [
  {
    id: 'photo-1',
    trip_id: 'trip-1',
    city_id: 'city-1',
    country_code: 'FR',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpv5FYw7_H1HhygLFxz0VmkQGi4ceqoAK3RGwjyJ54XeqShByFigKx8mOhWbzJizggnkbvh80JDbctnZPn-4ckwNvHnbwTSfwCKj4E_mHEwz2NXczEhfEnmKSZRE6zojuhYWlpD3k8jEorI-ukue9M31HjNV7BP-KJ0STKaIF4GdZYM-NmkJBWQ-qINBMq730-_M3uMQPf2plpLoGU99efJ05jDvj-0EG4h08GkCowNrk_oVRdOeOGSpGZsiLhlkps-1c9AWQIc1va',
    caption: 'Cinematic low-angle Haussmann building facade in Paris.',
    taken_at: '2023-10-15',
    is_favorite: true,
    category: 'architecture'
  },
  {
    id: 'photo-2',
    trip_id: 'trip-1',
    city_id: 'city-2',
    country_code: 'IT',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnp_QIxSVJYAK8Xeymja29oYRMBNNTgFHo-4LMDxwhzBv_mc6IUHjehQe9jnjmT9fDSTrTV5KTdvIJdx417Hea5Q0aKr_dRnFdGJ-LuRjsXS8I4L95Aot6cVoo9zSKol4bxrY2fR70kCYs-NeuTLj28ssmcdMPh-Jl5CtEJgkiWzXwgGY0QhuJzt47xwNazTeyDK4QYyghlisVRhQ4eKhYX2NgMy88iZbX9QjHbOYdNGS9eFT9555vjdv85h4VCp6cRvvWlrcWwO9e',
    caption: 'Traditional handmade orecchiette pasta served on rustic ceramics, Puglia.',
    taken_at: '2023-09-18',
    is_favorite: true,
    category: 'food'
  },
  {
    id: 'photo-3',
    trip_id: 'trip-1',
    city_id: 'city-3',
    country_code: 'CH',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq3vdSYUn_jsoO7CllW6-gVkBQChgV7SY3IOmTKcVik2Y0TtIG6HukK51BAyzcRJYSuK35-kMYf4Pn-HgDeZphnHtjfC7lZVvMPu0tu99s1j6DsJ2JT_6t4mZ-J0qj0BcEuuE3aSfRydJqphTOX8vldm34mw5FG5EtXvJ8EPAshPePFBzGupt76ra8JVsoasliULyyT3uXfOCBBzCTr8zX2XEBtkUNAz48s2r_JK1B45wFmC5ZEAMXni7TImmsAXzTgt0pqIduWvJY',
    caption: 'Breathtaking alpine sunrise over the snowy peaks near Lauterbrunnen.',
    taken_at: '2023-12-05',
    is_favorite: true,
    category: 'nature'
  },
  {
    id: 'photo-4',
    trip_id: 'trip-1',
    city_id: 'city-4',
    country_code: 'SE',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxzK8be2NpDcSMNg12Ve9RVltIWtQ3ArYOkvCzwMVbeWGqW5RxTAvnADPyAuXYb5B43gQvwyoWw3BYEzZX1B2HFy4lPYzceB6DnhxMHI20lj7MjFMe_kjdJjctK56BRY5AtyOMY7YoegvUJyjQr1ND0KeYxuyzVEgb0czjoxATGtrCcAC9RjjNyZ4YmPrI5RxHjp_MlD9vjbtwW6q9ZpnVETxf0V9dIzKFneB0pHkMMR9Ci-rVFsn7R1hRbzTaKqDPZVrMEyHyPVYl',
    caption: 'Minimalist Stockholm café interior, Södermalm.',
    taken_at: '2023-11-12',
    is_favorite: false,
    category: 'architecture'
  },
  {
    id: 'photo-5',
    trip_id: 'trip-1',
    city_id: 'city-5',
    country_code: 'IT',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuATOA49iMgVM36hsGJzqnLPNUZMt1UAXBwQGtSSx29pJU7fCUCcmEicaG_vzOJE1EC1Y0Rbr9l972Uh6hoOhqI-Yl1VTMyjCJvNPxykAtLEJ270GUEf0wPetLFVuGSN0bNywqgHpxVkYYduWsPIlY_y1PDrw2ZTrJ7fPUzEF8YTXsaATXoq6bu_pW1mVX-XuIVZOBIu9u0hZ4tE4sdBHk8aYw1fbbjvUcPhIdOiBrm4-H4TcQHmqIuhyYuZm-rsCpUQ6JgzHMhMLpwy',
    caption: 'Stunning aerial view of the Amalfi coastline cliffs and deep turquoise waters.',
    taken_at: '2023-08-28',
    is_favorite: true,
    category: 'nature'
  },
  {
    id: 'photo-6',
    trip_id: 'trip-2',
    city_id: 'city-6',
    country_code: 'GB',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAIh-9Tp3UpXXu4xLLf-fq_vgZvF1Bruqc6UhmC3O-EorhUX82dVMOty7SWD85dfWiwhifmKs3ImK8wd8mYYLxpCLpq3j2IEbfqBqjBtE8nu65zw_HZ5mR66evSwnCA9P0ooaA408s9HWwPP3EFFadHLQc7XbKlrCBi3Ei2zZ5XNqKvsE8rnj64BAlU5euBjpXLSj1pgA5AVidjc6jPfuICmvncxe85DJZt5uLqri8Q_7jB-9lhdBS16IQv8psnw3l6qSvXvyXP2pQl',
    caption: 'Moody, rainy evening reflecting double-decker lights on Regent Street, London.',
    taken_at: '2024-01-20',
    is_favorite: false,
    category: 'architecture'
  },
  {
    id: 'photo-7',
    trip_id: 'trip-3',
    city_id: 'city-7',
    country_code: 'IT',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaAj2FcHOJsugZ6AZQ9tl2HlMaDqWmd1JWH_B2a0esF4GOS7qi6F29-UTxx3BtZooaSWBj-FYPSFmBlkcMVsScW3MGPWt3VPDqSizX9NarABgZV1XNIk36v4EPWqq-IaAhA0eQG58TkOmoTOiINVlpw_PxnYJMUr6J4P9FgCo1lxo2suP86UdhZoEWmJIqc7l260OstaCgt1FcdSjQcs0sSN8EQ8P3Q_tsAr4GIcMjcpbvWpIsf7QNfN9ku1Q9ZXJ7qCsmBz6Sh61F',
    caption: 'Canals of Venice at dawn under a soft morning mist.',
    taken_at: '2024-05-14',
    is_favorite: true,
    category: 'nature'
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  // Trip 1
  { id: 'exp-1', trip_id: 'trip-1', city_id: 'city-1', amount: 340.00, currency: 'EUR', category: 'accommodation', description: 'AirBnb Le Marais', date: '2023-10-14' },
  { id: 'exp-2', trip_id: 'trip-1', city_id: 'city-1', amount: 85.50, currency: 'EUR', category: 'food', description: 'Dinner at French Bistro', date: '2023-10-15' },
  { id: 'exp-3', trip_id: 'trip-1', city_id: 'city-1', amount: 36.00, currency: 'EUR', category: 'activities', description: 'Louvre Tickets', date: '2023-10-16' },
  { id: 'exp-4', trip_id: 'trip-1', city_id: 'city-2', amount: 120.00, currency: 'EUR', category: 'accommodation', description: 'B&B Bari Vecchia', date: '2023-09-17' },
  { id: 'exp-5', trip_id: 'trip-1', city_id: 'city-2', amount: 45.00, currency: 'EUR', category: 'food', description: 'Fresh seafood & wine Puglia', date: '2023-09-18' },
  { id: 'exp-6', trip_id: 'trip-1', city_id: 'city-3', amount: 220.00, currency: 'CHF', category: 'accommodation', description: 'Valley Hostel Lauterbrunnen', date: '2023-12-04' },
  { id: 'exp-7', trip_id: 'trip-1', city_id: 'city-3', amount: 154.00, currency: 'CHF', category: 'transport', description: 'Jungfraujoch Train Ticket', date: '2023-12-05' },
  { id: 'exp-8', trip_id: 'trip-1', city_id: 'city-4', amount: 190.00, currency: 'SEK', category: 'food', description: 'Café fika + lunch Stockholm', date: '2023-11-12' },
  // Trip 2
  { id: 'exp-9', trip_id: 'trip-2', city_id: 'city-6', amount: 110.00, currency: 'GBP', category: 'accommodation', description: 'Hostel London City', date: '2024-01-19' },
  { id: 'exp-10', trip_id: 'trip-2', city_id: 'city-6', amount: 42.00, currency: 'GBP', category: 'food', description: 'Fish & Chips + pub night', date: '2024-01-20' },
  // Trip 3
  { id: 'exp-11', trip_id: 'trip-3', city_id: 'city-7', amount: 280.00, currency: 'EUR', category: 'accommodation', description: 'Canal Hotel Venice', date: '2024-05-13' },
  { id: 'exp-12', trip_id: 'trip-3', city_id: 'city-7', amount: 60.00, currency: 'EUR', category: 'activities', description: 'Gondola Ride', date: '2024-05-14' }
];

export const INITIAL_TRANSPORT: Transport[] = [
  { id: 'trans-1', trip_id: 'trip-1', type: 'flight', departure_city_id: 'city-2', arrival_city_id: 'city-1', distance_km: 1450, date: '2023-10-13', cost: 112.00 },
  { id: 'trans-2', trip_id: 'trip-1', type: 'train', departure_city_id: 'city-1', arrival_city_id: 'city-3', distance_km: 650, date: '2023-12-03', cost: 89.00 },
  { id: 'trans-3', trip_id: 'trip-1', type: 'flight', departure_city_id: 'city-3', arrival_city_id: 'city-4', distance_km: 1620, date: '2023-11-10', cost: 145.00 },
  { id: 'trans-4', trip_id: 'trip-2', type: 'train', departure_city_id: 'city-1', arrival_city_id: 'city-6', distance_km: 495, date: '2024-01-18', cost: 75.00 },
  { id: 'trans-5', trip_id: 'trip-3', type: 'flight', departure_city_id: 'city-6', arrival_city_id: 'city-7', distance_km: 1130, date: '2024-05-12', cost: 95.00 },
  { id: 'trans-6', trip_id: 'trip-1', type: 'walking', departure_city_id: 'city-1', arrival_city_id: 'city-1', distance_km: 18.5, date: '2023-10-15', cost: 0 },
  { id: 'trans-7', trip_id: 'trip-1', type: 'walking', departure_city_id: 'city-2', arrival_city_id: 'city-2', distance_km: 12.0, date: '2023-09-18', cost: 0 },
  { id: 'trans-8', trip_id: 'trip-1', type: 'walking', departure_city_id: 'city-4', arrival_city_id: 'city-4', distance_km: 14.2, date: '2023-11-12', cost: 0 },
  { id: 'trans-9', trip_id: 'trip-3', type: 'walking', departure_city_id: 'city-7', arrival_city_id: 'city-7', distance_km: 10.5, date: '2024-05-14', cost: 0 }
];

export const INITIAL_LOCATIONS: Location[] = [
  { id: 'loc-1', trip_id: 'trip-1', city_id: 'city-1', latitude: 48.8556, longitude: 2.3622, name: 'L\'As du Fallafel', description: 'Legendary pita falafel sandwiches in the Marais district.', category: 'restaurant', is_favorite: true },
  { id: 'loc-2', trip_id: 'trip-1', city_id: 'city-1', latitude: 48.8584, longitude: 2.2945, name: 'Eiffel Tower Viewpoint', description: 'Perfect viewpoint from Place du Trocadéro.', category: 'sight', is_favorite: false },
  { id: 'loc-3', trip_id: 'trip-1', city_id: 'city-2', latitude: 41.1278, longitude: 16.8720, name: 'Bari Vecchia Alleys', description: 'Where pasta grandmas make orecchiette fresh daily.', category: 'sight', is_favorite: true },
  { id: 'loc-4', trip_id: 'trip-1', city_id: 'city-3', latitude: 46.5910, longitude: 7.9075, name: 'Staubbach Falls', description: 'Spectacular waterfall cascading 300m behind the village houses.', category: 'sight', is_favorite: true },
  { id: 'loc-5', trip_id: 'trip-1', city_id: 'city-4', latitude: 59.3248, longitude: 18.0697, name: 'Chokladkoppen Gamla Stan', description: 'Cozy basement cafe in old town serving hot chocolate in bowls.', category: 'restaurant', is_favorite: true }
];

export const INITIAL_FAVORITE_PLACES: FavoritePlace[] = [
  { id: 'fav-1', city_id: 'city-1', name: 'Le Marais Alleys', latitude: 48.8576, longitude: 2.3601, description: 'Lovely historic streets packed with boutiques, falafel shops, and galleries.', category: 'sight' },
  { id: 'fav-2', city_id: 'city-2', name: 'Polignano a Mare cliffs', latitude: 40.9959, longitude: 17.2199, description: 'Breathtaking white stone town perched right on the edge of the blue Adriatic Sea.', category: 'sight' },
  { id: 'fav-3', city_id: 'city-7', name: 'Libreria Acqua Alta', latitude: 45.4389, longitude: 12.3421, description: 'Fascinating bookstore where books are piled in bathtubs and gondolas to protect from high water.', category: 'sight' }
];

export const INITIAL_STATISTICS: Statistic[] = [
  { id: 'stat-1', key: 'countries_visited', value: 14, label: 'Countries Visited', category: 'general' },
  { id: 'stat-2', key: 'cities_explored', value: 42, label: 'Cities Explored', category: 'general' },
  { id: 'stat-3', key: 'total_days', value: 128, label: 'Total Days', category: 'general' },
  { id: 'stat-4', key: 'memories_captured', value: 2480, label: 'Memories Captured', category: 'general' },
  { id: 'stat-5', key: 'kilometers_traveled', value: 7250, label: 'Kilometers Traveled', category: 'transport' },
  { id: 'stat-6', key: 'flights_taken', value: 5, label: 'Flights Taken', category: 'transport' },
  { id: 'stat-7', key: 'train_rides', value: 18, label: 'Train Rides', category: 'transport' },
  { id: 'stat-8', key: 'walking_distance', value: 412, label: 'Walking Distance (km)', category: 'transport' }
];

// Helper to manage localStorage Mock DB
class MockDatabase {
  private get<T>(key: string, initial: T[]): T[] {
    const raw = localStorage.getItem(`mock_db_${key}`);
    if (!raw) {
      localStorage.setItem(`mock_db_${key}`, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  }

  private set<T>(key: string, data: T[]): void {
    localStorage.setItem(`mock_db_${key}`, JSON.stringify(data));
  }

  getCountries() { return this.get('countries', INITIAL_COUNTRIES); }
  setCountries(data: Country[]) { this.set('countries', data); }

  getTrips() { return this.get('trips', INITIAL_TRIPS); }
  setTrips(data: Trip[]) { this.set('trips', data); }

  getCities() { return this.get('cities', INITIAL_CITIES); }
  setCities(data: City[]) { this.set('cities', data); }

  getJournalEntries() { return this.get('journal_entries', INITIAL_JOURNAL_ENTRIES); }
  setJournalEntries(data: JournalEntry[]) { this.set('journal_entries', data); }

  getExpenses() { return this.get('expenses', INITIAL_EXPENSES); }
  setExpenses(data: Expense[]) { this.set('expenses', data); }

  getTransport() { return this.get('transport', INITIAL_TRANSPORT); }
  setTransport(data: Transport[]) { this.set('transport', data); }

  getPhotos() { return this.get('photos', INITIAL_PHOTOS); }
  setPhotos(data: Photo[]) { this.set('photos', data); }

  getLocations() { return this.get('locations', INITIAL_LOCATIONS); }
  setLocations(data: Location[]) { this.set('locations', data); }

  getFavoritePlaces() { return this.get('favorite_places', INITIAL_FAVORITE_PLACES); }
  setFavoritePlaces(data: FavoritePlace[]) { this.set('favorite_places', data); }

  getStatistics() { return this.get('statistics', INITIAL_STATISTICS); }
  setStatistics(data: Statistic[]) { this.set('statistics', data); }

  // Generic CRUD
  addItem<T extends { id?: string; code?: string }>(table: string, item: T, initial: any[]): T {
    const items = this.get(table, initial);
    const idKey = table === 'countries' ? 'code' : 'id';
    const finalItem = {
      ...item,
      [idKey]: item[idKey as keyof T] || Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString()
    };
    items.push(finalItem);
    this.set(table, items);
    return finalItem as unknown as T;
  }

  updateItem<T extends { id?: string; code?: string }>(table: string, idVal: string, item: Partial<T>, initial: any[]): T {
    const items = this.get(table, initial);
    const idKey = table === 'countries' ? 'code' : 'id';
    const index = items.findIndex((i: any) => i[idKey] === idVal);
    if (index === -1) throw new Error(`Item not found with key: ${idVal}`);
    items[index] = { ...items[index], ...item };
    this.set(table, items);
    return items[index] as unknown as T;
  }

  deleteItem(table: string, idVal: string, initial: any[]): void {
    const items = this.get(table, initial);
    const idKey = table === 'countries' ? 'code' : 'id';
    const filtered = items.filter((i: any) => i[idKey] !== idVal);
    this.set(table, filtered);
  }
}

export const mockDb = new MockDatabase();
