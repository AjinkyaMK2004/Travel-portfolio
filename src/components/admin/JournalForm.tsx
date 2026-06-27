import React, { useState, useEffect } from 'react';
import { useSaveJournalEntry, useTrips, useCities } from '../../hooks/useSupabase';
import { JournalEntry } from '../../types';
import { Star } from 'lucide-react';

interface JournalFormProps {
  initialData?: JournalEntry | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const JournalForm: React.FC<JournalFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const saveJournalMutation = useSaveJournalEntry();
  const { data: trips } = useTrips();
  const { data: cities } = useCities();

  const [formData, setFormData] = useState({
    trip_id: '',
    city_id: '',
    title: '',
    content: '',
    date: '',
    is_favorite: false
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        trip_id: initialData.trip_id,
        city_id: initialData.city_id || '',
        title: initialData.title,
        content: initialData.content,
        date: initialData.date,
        is_favorite: initialData.is_favorite
      });
    } else {
      setFormData({
        trip_id: trips && trips.length > 0 ? trips[0].id : '',
        city_id: '',
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        is_favorite: false
      });
    }
  }, [initialData, trips]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trip_id) return;

    const payload = {
      ...formData,
      city_id: formData.city_id || undefined,
      ...(initialData?.id ? { id: initialData.id } : {})
    };

    saveJournalMutation.mutate(payload, {
      onSuccess: () => onSuccess()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-outline-variant/30 dark:border-outline/10">
      <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-4">
        {initialData ? 'Edit Journal Entry' : 'Write Journal Entry'}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Expedition Trip</label>
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
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Location City (Optional)</label>
          <select
            value={formData.city_id}
            onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="">General (No City)</option>
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
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Journal Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Quiet Dawn at Piazza San Marco"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Entry Date</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          />
        </div>
      </div>

      <div className="flex flex-col">
        <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Journal Content</label>
        <textarea
          rows={5}
          required
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          placeholder="Document the sights, smells, street views, and experiences..."
          className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary resize-none"
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
          Star as Favorite Moment
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
          disabled={saveJournalMutation.isPending}
          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-label-caps tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saveJournalMutation.isPending ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
};
