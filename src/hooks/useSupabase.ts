import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import { mockDb, INITIAL_COUNTRIES, INITIAL_TRIPS, INITIAL_CITIES, INITIAL_JOURNAL_ENTRIES, INITIAL_EXPENSES, INITIAL_TRANSPORT, INITIAL_PHOTOS, INITIAL_LOCATIONS, INITIAL_FAVORITE_PLACES, INITIAL_STATISTICS } from '../utils/mockData';
import type { Country, Trip, City, JournalEntry, Expense, Transport, Photo, Location, FavoritePlace, Statistic } from '../types';

// Helper to determine if we should use mock data
const useMock = !isSupabaseConfigured;

// 1. Countries Hooks
export const useCountries = () => {
  return useQuery<Country[]>({
    queryKey: ['countries'],
    queryFn: async () => {
      if (useMock) return mockDb.getCountries();
      const { data, error } = await supabase.from('countries').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
  });
};

export const useSaveCountry = () => {
  const queryClient = useQueryClient();
  return useMutation<Country, Error, Country>({
    mutationFn: async (country) => {
      if (useMock) {
        // Check if exists
        const exists = mockDb.getCountries().some(c => c.code === country.code);
        if (exists) {
          return mockDb.updateItem<Country>('countries', country.code, country, INITIAL_COUNTRIES);
        } else {
          return mockDb.addItem<Country>('countries', country, INITIAL_COUNTRIES);
        }
      }
      const { data, error } = await supabase.from('countries').upsert(country).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    }
  });
};

export const useDeleteCountry = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (code) => {
      if (useMock) {
        mockDb.deleteItem('countries', code, INITIAL_COUNTRIES);
        return;
      }
      const { error } = await supabase.from('countries').delete().eq('code', code);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['countries'] });
    }
  });
};

// 2. Trips Hooks
export const useTrips = () => {
  return useQuery<Trip[]>({
    queryKey: ['trips'],
    queryFn: async () => {
      if (useMock) return mockDb.getTrips();
      const { data, error } = await supabase.from('trips').select('*').order('start_date', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });
};

export const useSaveTrip = () => {
  const queryClient = useQueryClient();
  return useMutation<Trip, Error, Partial<Trip> & { id?: string }>({
    mutationFn: async (trip) => {
      if (useMock) {
        if (trip.id) {
          return mockDb.updateItem<Trip>('trips', trip.id, trip, INITIAL_TRIPS);
        } else {
          return mockDb.addItem<Trip>('trips', trip as Trip, INITIAL_TRIPS);
        }
      }
      const { data, error } = await supabase.from('trips').upsert(trip).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }
  });
};

export const useDeleteTrip = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (useMock) {
        mockDb.deleteItem('trips', id, INITIAL_TRIPS);
        return;
      }
      const { error } = await supabase.from('trips').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    }
  });
};

// 3. Cities Hooks
export const useCities = () => {
  return useQuery<City[]>({
    queryKey: ['cities'],
    queryFn: async () => {
      if (useMock) return mockDb.getCities();
      const { data, error } = await supabase.from('cities').select('*').order('name');
      if (error) throw error;
      return data || [];
    }
  });
};

export const useSaveCity = () => {
  const queryClient = useQueryClient();
  return useMutation<City, Error, Partial<City> & { id?: string }>({
    mutationFn: async (city) => {
      if (useMock) {
        if (city.id) {
          return mockDb.updateItem<City>('cities', city.id, city, INITIAL_CITIES);
        } else {
          return mockDb.addItem<City>('cities', city as City, INITIAL_CITIES);
        }
      }
      const { data, error } = await supabase.from('cities').upsert(city).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    }
  });
};

export const useDeleteCity = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (useMock) {
        mockDb.deleteItem('cities', id, INITIAL_CITIES);
        return;
      }
      const { error } = await supabase.from('cities').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cities'] });
    }
  });
};

// 4. Journal Entries Hooks
export const useJournalEntries = () => {
  return useQuery<JournalEntry[]>({
    queryKey: ['journal_entries'],
    queryFn: async () => {
      if (useMock) {
        const journals = mockDb.getJournalEntries();
        const trips = mockDb.getTrips();
        const cities = mockDb.getCities();
        return journals.map(j => ({
          ...j,
          trips: trips.find(t => t.id === j.trip_id),
          cities: cities.find(c => c.id === j.city_id)
        })).sort((a, b) => b.date.localeCompare(a.date));
      }
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*, trips(*), cities(*)')
        .order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });
};

export const useSaveJournalEntry = () => {
  const queryClient = useQueryClient();
  return useMutation<JournalEntry, Error, Partial<JournalEntry> & { id?: string }>({
    mutationFn: async (entry) => {
      if (useMock) {
        if (entry.id) {
          return mockDb.updateItem<JournalEntry>('journal_entries', entry.id, entry, INITIAL_JOURNAL_ENTRIES);
        } else {
          return mockDb.addItem<JournalEntry>('journal_entries', entry as JournalEntry, INITIAL_JOURNAL_ENTRIES);
        }
      }
      const { data, error } = await supabase.from('journal_entries').upsert(entry).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal_entries'] });
    }
  });
};

export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (useMock) {
        mockDb.deleteItem('journal_entries', id, INITIAL_JOURNAL_ENTRIES);
        return;
      }
      const { error } = await supabase.from('journal_entries').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal_entries'] });
    }
  });
};

// 5. Expenses Hooks
export const useExpenses = () => {
  return useQuery<Expense[]>({
    queryKey: ['expenses'],
    queryFn: async () => {
      if (useMock) {
        const expenses = mockDb.getExpenses();
        const trips = mockDb.getTrips();
        const cities = mockDb.getCities();
        return expenses.map(e => ({
          ...e,
          trips: trips.find(t => t.id === e.trip_id),
          cities: cities.find(c => c.id === e.city_id)
        })).sort((a, b) => b.date.localeCompare(a.date));
      }
      const { data, error } = await supabase
        .from('expenses')
        .select('*, trips(*), cities(*)')
        .order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });
};

export const useSaveExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<Expense, Error, Partial<Expense> & { id?: string }>({
    mutationFn: async (expense) => {
      if (useMock) {
        if (expense.id) {
          return mockDb.updateItem<Expense>('expenses', expense.id, expense, INITIAL_EXPENSES);
        } else {
          return mockDb.addItem<Expense>('expenses', expense as Expense, INITIAL_EXPENSES);
        }
      }
      const { data, error } = await supabase.from('expenses').upsert(expense).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    }
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (useMock) {
        mockDb.deleteItem('expenses', id, INITIAL_EXPENSES);
        return;
      }
      const { error } = await supabase.from('expenses').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    }
  });
};

// 6. Transport Hooks
export const useTransport = () => {
  return useQuery<Transport[]>({
    queryKey: ['transport'],
    queryFn: async () => {
      if (useMock) {
        const trans = mockDb.getTransport();
        const trips = mockDb.getTrips();
        const cities = mockDb.getCities();
        return trans.map(t => ({
          ...t,
          trips: trips.find(tr => tr.id === t.trip_id),
          departure_city: cities.find(c => c.id === t.departure_city_id),
          arrival_city: cities.find(c => c.id === t.arrival_city_id)
        })).sort((a, b) => b.date.localeCompare(a.date));
      }
      const { data, error } = await supabase
        .from('transport')
        .select('*, trips(*), departure_city:cities!departure_city_id(*), arrival_city:cities!arrival_city_id(*)')
        .order('date', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });
};

export const useSaveTransport = () => {
  const queryClient = useQueryClient();
  return useMutation<Transport, Error, Partial<Transport> & { id?: string }>({
    mutationFn: async (record) => {
      if (useMock) {
        if (record.id) {
          return mockDb.updateItem<Transport>('transport', record.id, record, INITIAL_TRANSPORT);
        } else {
          return mockDb.addItem<Transport>('transport', record as Transport, INITIAL_TRANSPORT);
        }
      }
      const { data, error } = await supabase.from('transport').upsert(record).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport'] });
    }
  });
};

export const useDeleteTransport = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (useMock) {
        mockDb.deleteItem('transport', id, INITIAL_TRANSPORT);
        return;
      }
      const { error } = await supabase.from('transport').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transport'] });
    }
  });
};

// 7. Photos Hooks
export const usePhotos = () => {
  return useQuery<Photo[]>({
    queryKey: ['photos'],
    queryFn: async () => {
      if (useMock) {
        const photos = mockDb.getPhotos();
        const trips = mockDb.getTrips();
        const cities = mockDb.getCities();
        const countries = mockDb.getCountries();
        return photos.map(p => ({
          ...p,
          trips: trips.find(t => t.id === p.trip_id),
          cities: cities.find(c => c.id === p.city_id),
          countries: countries.find(c => c.code === p.country_code)
        })).sort((a, b) => b.taken_at.localeCompare(a.taken_at));
      }
      const { data, error } = await supabase
        .from('photos')
        .select('*, trips(*), cities(*), countries(*)')
        .order('taken_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
  });
};

export const useSavePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation<Photo, Error, Partial<Photo> & { id?: string }>({
    mutationFn: async (photo) => {
      if (useMock) {
        if (photo.id) {
          return mockDb.updateItem<Photo>('photos', photo.id, photo, INITIAL_PHOTOS);
        } else {
          return mockDb.addItem<Photo>('photos', photo as Photo, INITIAL_PHOTOS);
        }
      }
      const { data, error } = await supabase.from('photos').upsert(photo).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    }
  });
};

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (useMock) {
        mockDb.deleteItem('photos', id, INITIAL_PHOTOS);
        return;
      }
      const { error } = await supabase.from('photos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['photos'] });
    }
  });
};

// Storage Image Upload Hook
export const useUploadPhotoFile = () => {
  return useMutation<string, Error, File>({
    mutationFn: async (file) => {
      if (useMock) {
        // Return a Promise resolving to Base64 data url for simulation
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // Live Supabase Storage File Upload
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    }
  });
};

// 8. Locations Hooks
export const useLocations = () => {
  return useQuery<Location[]>({
    queryKey: ['locations'],
    queryFn: async () => {
      if (useMock) {
        const locations = mockDb.getLocations();
        const trips = mockDb.getTrips();
        const cities = mockDb.getCities();
        return locations.map(l => ({
          ...l,
          trips: trips.find(t => t.id === l.trip_id),
          cities: cities.find(c => c.id === l.city_id)
        }));
      }
      const { data, error } = await supabase
        .from('locations')
        .select('*, trips(*), cities(*)');
      if (error) throw error;
      return data || [];
    }
  });
};

export const useSaveLocation = () => {
  const queryClient = useQueryClient();
  return useMutation<Location, Error, Partial<Location> & { id?: string }>({
    mutationFn: async (location) => {
      if (useMock) {
        if (location.id) {
          return mockDb.updateItem<Location>('locations', location.id, location, INITIAL_LOCATIONS);
        } else {
          return mockDb.addItem<Location>('locations', location as Location, INITIAL_LOCATIONS);
        }
      }
      const { data, error } = await supabase.from('locations').upsert(location).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });
};

export const useDeleteLocation = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (useMock) {
        mockDb.deleteItem('locations', id, INITIAL_LOCATIONS);
        return;
      }
      const { error } = await supabase.from('locations').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] });
    }
  });
};

// 9. Favorite Places Hooks
export const useFavoritePlaces = () => {
  return useQuery<FavoritePlace[]>({
    queryKey: ['favorite_places'],
    queryFn: async () => {
      if (useMock) {
        const favorites = mockDb.getFavoritePlaces();
        const cities = mockDb.getCities();
        return favorites.map(f => ({
          ...f,
          cities: cities.find(c => c.id === f.city_id)
        }));
      }
      const { data, error } = await supabase
        .from('favorite_places')
        .select('*, cities(*)');
      if (error) throw error;
      return data || [];
    }
  });
};

export const useSaveFavoritePlace = () => {
  const queryClient = useQueryClient();
  return useMutation<FavoritePlace, Error, Partial<FavoritePlace> & { id?: string }>({
    mutationFn: async (place) => {
      if (useMock) {
        if (place.id) {
          return mockDb.updateItem<FavoritePlace>('favorite_places', place.id, place, INITIAL_FAVORITE_PLACES);
        } else {
          return mockDb.addItem<FavoritePlace>('favorite_places', place as FavoritePlace, INITIAL_FAVORITE_PLACES);
        }
      }
      const { data, error } = await supabase.from('favorite_places').upsert(place).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite_places'] });
    }
  });
};

export const useDeleteFavoritePlace = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (useMock) {
        mockDb.deleteItem('favorite_places', id, INITIAL_FAVORITE_PLACES);
        return;
      }
      const { error } = await supabase.from('favorite_places').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite_places'] });
    }
  });
};

// 10. Statistics Hooks
export const useStatistics = () => {
  return useQuery<Statistic[]>({
    queryKey: ['statistics'],
    queryFn: async () => {
      if (useMock) return mockDb.getStatistics();
      const { data, error } = await supabase.from('statistics').select('*').order('category');
      if (error) throw error;
      return data || [];
    }
  });
};

export const useSaveStatistic = () => {
  const queryClient = useQueryClient();
  return useMutation<Statistic, Error, Partial<Statistic> & { id?: string }>({
    mutationFn: async (stat) => {
      if (useMock) {
        if (stat.id) {
          return mockDb.updateItem<Statistic>('statistics', stat.id, stat, INITIAL_STATISTICS);
        } else {
          return mockDb.addItem<Statistic>('statistics', stat as Statistic, INITIAL_STATISTICS);
        }
      }
      const { data, error } = await supabase.from('statistics').upsert(stat).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    }
  });
};

export const useDeleteStatistic = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, string>({
    mutationFn: async (id) => {
      if (useMock) {
        mockDb.deleteItem('statistics', id, INITIAL_STATISTICS);
        return;
      }
      const { error } = await supabase.from('statistics').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['statistics'] });
    }
  });
};
