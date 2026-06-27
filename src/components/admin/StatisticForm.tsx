import React, { useState, useEffect } from 'react';
import { useSaveStatistic } from '../../hooks/useSupabase';
import { Statistic } from '../../types';

interface StatisticFormProps {
  initialData?: Statistic | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const StatisticForm: React.FC<StatisticFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const saveStatMutation = useSaveStatistic();
  const [formData, setFormData] = useState({
    key: '',
    value: '',
    label: '',
    category: 'general'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        key: initialData.key,
        value: initialData.value.toString(),
        label: initialData.label,
        category: initialData.category
      });
    } else {
      setFormData({ key: '', value: '', label: '', category: 'general' });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.key || !formData.value) return;

    const payload = {
      key: formData.key.trim().toLowerCase(),
      value: parseFloat(formData.value),
      label: formData.label.trim(),
      category: formData.category,
      ...(initialData?.id ? { id: initialData.id } : {})
    };

    saveStatMutation.mutate(payload, {
      onSuccess: () => onSuccess()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-outline-variant/30 dark:border-outline/10">
      <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-4">
        {initialData ? 'Modify Travel Statistic' : 'Create Custom Statistic'}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Unique Key</label>
          <input
            type="text"
            required
            disabled={!!initialData}
            value={formData.key}
            onChange={(e) => setFormData({ ...formData, key: e.target.value })}
            placeholder="e.g. flights_taken"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary disabled:opacity-50"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Label Title</label>
          <input
            type="text"
            required
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="e.g. Flights Taken"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Value (Numeric)</label>
          <input
            type="number"
            step="0.01"
            required
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder="e.g. 5"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="general">General</option>
            <option value="transport">Transport</option>
            <option value="budget">Budget</option>
          </select>
        </div>
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
          disabled={saveStatMutation.isPending}
          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-label-caps tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saveStatMutation.isPending ? 'Saving...' : 'Save Statistic'}
        </button>
      </div>
    </form>
  );
};
