import React, { useState, useEffect } from 'react';
import { useSaveLocation, useTrips, useCities } from '../../hooks/useSupabase';
import { Location } from '../../types';
import { Star } from 'lucide-react';

interface LocationFormProps {
  initialData?: Location | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const LocationForm: React.FC<LocationFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const saveLocationMutation = useSaveLocation();
  const { data: trips } = useTrips();
  const { data: cities } = useCities();

  const [formData, setFormData] = useState({
    trip_id: '',
    city_id: '',
    latitude: '',
    longitude: '',
    name: '',
    description: '',
    category: 'sight' as Location['category'],
    is_favorite: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        trip_id: initialData.trip_id,
        city_id: initialData.city_id || '',
        latitude: initialData.latitude.toString(),
        longitude: initialData.longitude.toString(),
        name: initialData.name,
        description: initialData.description || '',
        category: initialData.category || 'sight',
        is_favorite: initialData.is_favorite
      });
    } else {
      setFormData({
        trip_id: trips && trips.length > 0 ? trips[0].id : '',
        city_id: '',
        latitude: '',
        longitude: '',
        name: '',
        description: '',
        category: 'sight',
        is_favorite: false
      });
    }
  }, [initialData, trips]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trip_id || !formData.latitude || !formData.longitude || !formData.name) return;

    const payload = {
      trip_id: formData.trip_id,
      city_id: formData.city_id || undefined,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      category: formData.category,
      is_favorite: formData.is_favorite,
      ...(initialData?.id ? { id: initialData.id } : {})
    };

    saveLocationMutation.mutate(payload, {
      onSuccess: () => onSuccess()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-outline-variant/30 dark:border-outline/10">
      <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-4">
        {initialData ? 'Modify Location Point' : 'Register Location / Sight'}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Trip Expedition</label>
          <select
            value={formData.trip_id}
            onChange={(e) => setFormData({ ...formData, trip_id: e.target.value })}
            required
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="" disabled>Select Trip</option>
            {trips?.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">City (Optional)</label>
          <select
            value={formData.city_id}
            onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="">No City (General Coordinate)</option>
            {cities?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
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
            placeholder="e.g. 48.8584"
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
            placeholder="e.g. 2.2945"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Sight Name</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Eiffel Tower Viewpoint"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Category</label>
          <select
            value={formData.category || 'sight'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Location['category'] })}
            required
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="sight">Sight / Place of Interest</option>
            <option value="restaurant">Restaurant / Dining</option>
            <option value="accommodation">Accommodation</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g. Best panorama views or local dish recommendations..."
          className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
        />
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, is_favorite: !formData.is_favorite })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-label-caps tracking-wider transition-colors ${
            formData.is_favorite
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
              : 'border-outline-variant/60 text-secondary'
          }`}
        >
          <Star className={`w-4 h-4 ${formData.is_favorite ? 'fill-current' : ''}`} />
          Star as Favorite Place
        </button>
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
          disabled={saveLocationMutation.isPending}
          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-label-caps tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saveLocationMutation.isPending ? 'Saving...' : 'Save Location'}
        </button>
      </div>
    </form>
  );
};
