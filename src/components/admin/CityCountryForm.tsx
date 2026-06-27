import React, { useState, useEffect } from 'react';
import { useSaveCountry, useSaveCity, useCountries } from '../../hooks/useSupabase';
import { Country, City } from '../../types';

interface CountryFormProps {
  initialData?: Country | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CountryForm: React.FC<CountryFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const saveCountryMutation = useSaveCountry();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    status: 'visited' as Country['status'],
    favorite_memory: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        name: initialData.name,
        status: initialData.status,
        favorite_memory: initialData.favorite_memory || ''
      });
    } else {
      setFormData({ code: '', name: '', status: 'visited', favorite_memory: '' });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Country = {
      code: formData.code.toUpperCase().trim(),
      name: formData.name.trim(),
      status: formData.status,
      favorite_memory: formData.favorite_memory.trim() || undefined
    };

    saveCountryMutation.mutate(payload, {
      onSuccess: () => onSuccess()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-outline-variant/30 dark:border-outline/10">
      <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-4">
        {initialData ? 'Modify Country Record' : 'Add New Country'}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Country ISO Code</label>
          <input
            type="text"
            required
            maxLength={2}
            disabled={!!initialData}
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="e.g. FR"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary disabled:opacity-50 uppercase"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Country Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. France"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Status</label>
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value as Country['status'] })}
          className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
        >
          <option value="visited">Visited</option>
          <option value="current">Current Location</option>
          <option value="planned">Planned (Upcoming)</option>
          <option value="not_visited">Not Visited</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Favorite Memory</label>
        <input
          type="text"
          value={formData.favorite_memory}
          onChange={(e) => setFormData({ ...formData, favorite_memory: e.target.value })}
          placeholder="e.g. Strolling along the Seine in a light drizzle."
          className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-outline-variant/50 text-secondary rounded-xl text-xs font-label-caps tracking-wider hover:bg-surface-container transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saveCountryMutation.isPending}
          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-label-caps tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saveCountryMutation.isPending ? 'Saving...' : 'Save Country'}
        </button>
      </div>
    </form>
  );
};

interface CityFormProps {
  initialData?: City | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const CityForm: React.FC<CityFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const saveCityMutation = useSaveCity();
  const { data: countries } = useCountries();
  const [formData, setFormData] = useState({
    name: '',
    country_code: '',
    latitude: '',
    longitude: '',
    visited_date: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        country_code: initialData.country_code,
        latitude: initialData.latitude.toString(),
        longitude: initialData.longitude.toString(),
        visited_date: initialData.visited_date || ''
      });
    } else {
      setFormData({
        name: '',
        country_code: countries && countries.length > 0 ? countries[0].code : '',
        latitude: '',
        longitude: '',
        visited_date: ''
      });
    }
  }, [initialData, countries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.country_code) return;

    const payload = {
      name: formData.name.trim(),
      country_code: formData.country_code,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      visited_date: formData.visited_date || undefined,
      ...(initialData?.id ? { id: initialData.id } : {})
    };

    saveCityMutation.mutate(payload, {
      onSuccess: () => onSuccess()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-outline-variant/30 dark:border-outline/10">
      <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-4">
        {initialData ? 'Modify City Record' : 'Add New City'}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">City Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Marseille"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Country</label>
          <select
            value={formData.country_code}
            onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
            required
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="" disabled>Select Country</option>
            {countries?.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Latitude</label>
          <input
            type="number"
            step="0.0001"
            required
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
            placeholder="e.g. 43.2965"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Longitude</label>
          <input
            type="number"
            step="0.0001"
            required
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
            placeholder="e.g. 5.3698"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Visited Date</label>
        <input
          type="date"
          value={formData.visited_date}
          onChange={(e) => setFormData({ ...formData, visited_date: e.target.value })}
          className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
        />
      </div>

      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-outline-variant/50 text-secondary rounded-xl text-xs font-label-caps tracking-wider hover:bg-surface-container transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saveCityMutation.isPending}
          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-label-caps tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saveCityMutation.isPending ? 'Saving...' : 'Save City'}
        </button>
      </div>
    </form>
  );
};
