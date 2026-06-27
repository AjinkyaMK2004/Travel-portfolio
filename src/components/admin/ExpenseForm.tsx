import React, { useState, useEffect } from 'react';
import { useSaveExpense, useTrips, useCities } from '../../hooks/useSupabase';
import { Expense } from '../../types';

interface ExpenseFormProps {
  initialData?: Expense | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const saveExpenseMutation = useSaveExpense();
  const { data: trips } = useTrips();
  const { data: cities } = useCities();

  const [formData, setFormData] = useState({
    trip_id: '',
    city_id: '',
    amount: '',
    currency: 'EUR',
    category: 'food' as Expense['category'],
    description: '',
    date: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        trip_id: initialData.trip_id,
        city_id: initialData.city_id || '',
        amount: initialData.amount.toString(),
        currency: initialData.currency,
        category: initialData.category,
        description: initialData.description || '',
        date: initialData.date
      });
    } else {
      setFormData({
        trip_id: trips && trips.length > 0 ? trips[0].id : '',
        city_id: '',
        amount: '',
        currency: 'EUR',
        category: 'food',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [initialData, trips]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trip_id || !formData.amount) return;

    const payload = {
      trip_id: formData.trip_id,
      city_id: formData.city_id || undefined,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      category: formData.category,
      description: formData.description.trim() || undefined,
      date: formData.date,
      ...(initialData?.id ? { id: initialData.id } : {})
    };

    saveExpenseMutation.mutate(payload, {
      onSuccess: () => onSuccess()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-outline-variant/30 dark:border-outline/10">
      <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-4">
        {initialData ? 'Modify Expense Item' : 'Add Expense Record'}
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
            <option value="">General / Transit</option>
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
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Amount</label>
          <div className="relative">
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g. 45.50"
              className="w-full bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl pl-4 pr-16 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
            />
            <span className="absolute right-4 top-2 text-xs font-semibold text-secondary font-label-caps uppercase">{formData.currency}</span>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Currency</label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            required
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="EUR">EUR (€)</option>
            <option value="CHF">CHF (Fr)</option>
            <option value="GBP">GBP (£)</option>
            <option value="SEK">SEK (kr)</option>
            <option value="USD">USD ($)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Expense['category'] })}
            required
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="accommodation">Accommodation</option>
            <option value="food">Food & Dining</option>
            <option value="transport">Transport</option>
            <option value="activities">Activities & Sights</option>
            <option value="other">Other / General</option>
          </select>
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Transaction Date</label>
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
        <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Description</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="e.g. Hostels booking or dinner details..."
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
          disabled={saveExpenseMutation.isPending}
          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-label-caps tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all"
        >
          {saveExpenseMutation.isPending ? 'Saving...' : 'Save Expense'}
        </button>
      </div>
    </form>
  );
};
