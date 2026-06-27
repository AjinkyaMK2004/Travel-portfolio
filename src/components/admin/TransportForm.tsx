import React, { useState, useEffect } from 'react';
import { useSaveTransport, useTrips, useCities } from '../../hooks/useSupabase';
import { Transport } from '../../types';

interface TransportFormProps {
  initialData?: Transport | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TransportForm: React.FC<TransportFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const saveTransMutation = useSaveTransport();
  const { data: trips } = useTrips();
  const { data: cities } = useCities();

  const [formData, setFormData] = useState({
    trip_id: '',
    type: 'train' as Transport['type'],
    departure_city_id: '',
    arrival_city_id: '',
    distance_km: '',
    date: '',
    cost: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        trip_id: initialData.trip_id,
        type: initialData.type,
        departure_city_id: initialData.departure_city_id || '',
        arrival_city_id: initialData.arrival_city_id || '',
        distance_km: initialData.distance_km.toString(),
        date: initialData.date,
        cost: initialData.cost?.toString() || ''
      });
    } else {
      setFormData({
        trip_id: trips && trips.length > 0 ? trips[0].id : '',
        type: 'train',
        departure_city_id: '',
        arrival_city_id: '',
        distance_km: '',
        date: new Date().toISOString().split('T')[0],
        cost: ''
      });
    }
  }, [initialData, trips]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trip_id || !formData.distance_km) return;

    const payload = {
      trip_id: formData.trip_id,
      type: formData.type,
      departure_city_id: formData.departure_city_id || undefined,
      arrival_city_id: formData.arrival_city_id || undefined,
      distance_km: parseFloat(formData.distance_km),
      date: formData.date,
      cost: formData.cost ? parseFloat(formData.cost) : undefined,
      ...(initialData?.id ? { id: initialData.id } : {})
    };

    saveTransMutation.mutate(payload, {
      onSuccess: () => onSuccess()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-outline-variant/30 dark:border-outline/10">
      <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-4">
        {initialData ? 'Modify Transport Record' : 'Log Transport Leg'}
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
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Transit Mode</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as Transport['type'] })}
            required
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="train">Train</option>
            <option value="flight">Flight</option>
            <option value="bus">Bus / Coach</option>
            <option value="car">Car / Ride</option>
            <option value="walking">Walking</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Departure City</label>
          <select
            value={formData.departure_city_id}
            onChange={(e) => setFormData({ ...formData, departure_city_id: e.target.value })}
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="">Select Departure City (Optional)</option>
            {cities?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Arrival City</label>
          <select
            value={formData.arrival_city_id}
            onChange={(e) => setFormData({ ...formData, arrival_city_id: e.target.value })}
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="">Select Arrival City (Optional)</option>
            {cities?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col col-span-2">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Distance (Kilometers)</label>
          <input
            type="number"
            step="0.1"
            required
            value={formData.distance_km}
            onChange={(e) => setFormData({ ...formData, distance_km: e.target.value })}
            placeholder="e.g. 450"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Leg Cost (EUR)</label>
          <input
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            placeholder="Optional"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Leg Date</label>
        <input
          type="date"
          required
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
          disabled={saveTransMutation.isPending}
          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-label-caps tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saveTransMutation.isPending ? 'Saving...' : 'Save Record'}
        </button>
      </div>
    </form>
  );
};
