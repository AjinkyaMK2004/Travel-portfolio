import React, { useState, useEffect } from 'react';
import { useSaveTrip } from '../../hooks/useSupabase';
import { Trip } from '../../types';

interface TripFormProps {
  initialData?: Trip | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const TripForm: React.FC<TripFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const saveTripMutation = useSaveTrip();
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    description: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        start_date: initialData.start_date,
        end_date: initialData.end_date || '',
        description: initialData.description || ''
      });
    } else {
      setFormData({ name: '', start_date: '', end_date: '', description: '' });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      ...(initialData?.id ? { id: initialData.id } : {}),
      end_date: formData.end_date || undefined,
      description: formData.description || undefined
    };

    saveTripMutation.mutate(payload, {
      onSuccess: () => {
        onSuccess();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-outline-variant/30 dark:border-outline/10">
      <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-4">
        {initialData ? 'Modify Trip Record' : 'Log New Trip'}
      </h4>
      
      <div className="flex flex-col">
        <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Trip Name</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g. Summer Mediterranean Tour"
          className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Start Date</label>
          <input
            type="date"
            required
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">End Date (Optional)</label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Description</label>
        <textarea
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Trip scope and general planning logs..."
          className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary resize-none"
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
          disabled={saveTripMutation.isPending}
          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-label-caps tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saveTripMutation.isPending ? 'Saving...' : 'Save Record'}
        </button>
      </div>
    </form>
  );
};
