export interface Country {
  code: string; // ISO 2-letter code, e.g., 'FR', 'IT'
  name: string;
  status: 'visited' | 'current' | 'planned' | 'not_visited';
  favorite_memory?: string;
  created_at?: string;
}

export interface Trip {
  id: string;
  name: string;
  start_date: string;
  end_date?: string;
  description?: string;
  created_at?: string;
}

export interface City {
  id: string;
  name: string;
  country_code: string;
  latitude: number;
  longitude: number;
  visited_date?: string;
  created_at?: string;
}

export interface JournalEntry {
  id: string;
  trip_id: string;
  city_id?: string;
  title: string;
  content: string;
  date: string;
  is_favorite: boolean;
  created_at?: string;
  
  // Joins
  trips?: Trip;
  cities?: City;
}

export interface Expense {
  id: string;
  trip_id: string;
  city_id?: string;
  amount: number;
  currency: string;
  category: 'accommodation' | 'food' | 'transport' | 'activities' | 'other';
  description?: string;
  date: string;
  created_at?: string;

  // Joins
  trips?: Trip;
  cities?: City;
}

export interface Transport {
  id: string;
  trip_id: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'walking' | 'other';
  departure_city_id?: string;
  arrival_city_id?: string;
  distance_km: number;
  date: string;
  cost?: number;
  created_at?: string;

  // Joins
  trips?: Trip;
  departure_city?: City;
  arrival_city?: City;
}

export interface Photo {
  id: string;
  trip_id: string;
  city_id?: string;
  country_code?: string;
  url: string;
  caption?: string;
  storage_path?: string;
  taken_at: string;
  is_favorite: boolean;
  category?: 'food' | 'architecture' | 'nature' | 'other';
  created_at?: string;

  // Joins
  trips?: Trip;
  cities?: City;
  countries?: Country;
}

export interface Location {
  id: string;
  trip_id: string;
  city_id?: string;
  latitude: number;
  longitude: number;
  name: string;
  description?: string;
  category?: 'restaurant' | 'accommodation' | 'sight' | 'other';
  is_favorite: boolean;
  created_at?: string;

  // Joins
  trips?: Trip;
  cities?: City;
}

export interface FavoritePlace {
  id: string;
  city_id: string;
  name: string;
  latitude: number;
  longitude: number;
  description?: string;
  category?: 'restaurant' | 'accommodation' | 'sight' | 'other';
  created_at?: string;

  // Joins
  cities?: City;
}

export interface Statistic {
  id: string;
  key: string;
  value: number;
  label: string;
  category: string;
  created_at?: string;
}

// Map filter types
export interface MapFilters {
  photos: boolean;
  walking: boolean;
  trains: boolean;
  flights: boolean;
  journals: boolean;
}
