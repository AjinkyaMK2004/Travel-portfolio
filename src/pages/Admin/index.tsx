import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useTrips, useCities, useCountries, useJournalEntries, useExpenses, useTransport, usePhotos, useLocations, useStatistics, useDeleteTrip, useDeleteCity, useDeleteCountry, useDeleteJournalEntry, useDeleteExpense, useDeleteTransport, useDeletePhoto, useDeleteLocation, useDeleteStatistic } from '../../hooks/useSupabase';
import { TripForm } from '../../components/admin/TripForm';
import { CityForm, CountryForm } from '../../components/admin/CityCountryForm';
import { JournalForm } from '../../components/admin/JournalForm';
import { ExpenseForm } from '../../components/admin/ExpenseForm';
import { TransportForm } from '../../components/admin/TransportForm';
import { PhotoForm } from '../../components/admin/PhotoForm';
import { LocationForm } from '../../components/admin/LocationForm';
import { StatisticForm } from '../../components/admin/StatisticForm';
import { Lock, Unlock, Key, Plus, Edit2, Trash2, Database, AlertCircle, List, LogOut } from 'lucide-react';

type Tab = 'trips' | 'cities' | 'countries' | 'journals' | 'expenses' | 'transport' | 'photos' | 'locations' | 'statistics';

export const Admin: React.FC = () => {
  const { isAdmin, login, logout, isMock } = useAuth();

  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<Tab>('trips');

  // Form Editing States
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // Data Queries
  const { data: trips } = useTrips();
  const { data: cities } = useCities();
  const { data: countries } = useCountries();
  const { data: journals } = useJournalEntries();
  const { data: expenses } = useExpenses();
  const { data: transport } = useTransport();
  const { data: photos } = usePhotos();
  const { data: locations } = useLocations();
  const { data: stats } = useStatistics();

  // Delete Mutations
  const deleteTrip = useDeleteTrip();
  const deleteCity = useDeleteCity();
  const deleteCountry = useDeleteCountry();
  const deleteJournal = useDeleteJournalEntry();
  const deleteExpense = useDeleteExpense();
  const deleteTransport = useDeleteTransport();
  const deletePhoto = useDeletePhoto();
  const deleteLocation = useDeleteLocation();
  const deleteStat = useDeleteStatistic();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleCreateNew = () => {
    setEditData(null);
    setIsEditing(true);
  };

  const handleEditClick = (item: any) => {
    setEditData(item);
    setIsEditing(true);
  };

  const handleFormSuccess = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleDeleteItem = (id: string) => {
    if (!window.confirm('Confirm deletion of this record? This action is irreversible.')) return;
    
    switch (activeTab) {
      case 'trips': deleteTrip.mutate(id); break;
      case 'cities': deleteCity.mutate(id); break;
      case 'countries': deleteCountry.mutate(id); break;
      case 'journals': deleteJournal.mutate(id); break;
      case 'expenses': deleteExpense.mutate(id); break;
      case 'transport': deleteTransport.mutate(id); break;
      case 'photos': deletePhoto.mutate(id); break;
      case 'locations': deleteLocation.mutate(id); break;
      case 'statistics': deleteStat.mutate(id); break;
    }
  };

  const tabOptions: { key: Tab; label: string }[] = [
    { key: 'trips', label: 'Trips' },
    { key: 'countries', label: 'Countries' },
    { key: 'cities', label: 'Cities' },
    { key: 'journals', label: 'Journal Logs' },
    { key: 'photos', label: 'Photographs' },
    { key: 'expenses', label: 'Expenses' },
    { key: 'transport', label: 'Transport Legs' },
    { key: 'locations', label: 'Sights (Map)' },
    { key: 'statistics', label: 'Stats Metrics' }
  ];

  // 1. Render Login panel if visitor is not Admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background dark:bg-background pt-16 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-white dark:bg-slate-900 border border-outline-variant/30 dark:border-outline/20 p-8 rounded-3xl shadow-xl space-y-6"
        >
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 dark:bg-primary-fixed/10 flex items-center justify-center rounded-full mx-auto text-primary">
              <Lock className="w-6 h-6 text-primary dark:text-primary-fixed" />
            </div>
            <h2 className="font-headline-sm text-2xl text-primary dark:text-primary-fixed">Admin Portal</h2>
            <p className="text-xs text-secondary dark:text-secondary-fixed-dim leading-relaxed">
              Login to edit, create, or delete destinations, write journals, upload photo files, and modify expenses.
            </p>
          </div>

          {loginError && (
            <div className="p-3.5 bg-error-container text-on-error-container text-xs rounded-xl flex gap-2 items-center">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Testing credentials banner */}
          <div className="p-3.5 bg-surface-container-low dark:bg-surface-container-high/15 rounded-xl border border-outline-variant/30 text-left space-y-1">
            <span className="text-[10px] font-label-caps uppercase text-secondary tracking-widest block font-bold">Mock Preview Mode Credentials</span>
            <p className="text-xs text-primary dark:text-primary-fixed flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Email: <code>admin@euroventure.com</code></p>
            <p className="text-xs text-primary dark:text-primary-fixed flex items-center gap-1.5"><Key className="w-3.5 h-3.5" /> Password: <code>password123</code></p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary placeholder:text-secondary/40"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2.5 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary placeholder:text-secondary/40"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full flex items-center justify-center gap-2 bg-primary dark:bg-primary-fixed text-on-primary dark:text-on-primary-fixed py-3 rounded-xl font-label-caps text-label-caps hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // 2. Render Admin Dashboard if Authenticated
  return (
    <div className="min-h-screen bg-background dark:bg-background pt-24 pb-section-gap text-on-background transition-colors duration-300">
      <main className="px-margin-desktop max-w-container-max mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 border-b border-outline-variant/30 dark:border-outline/15 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Unlock className="w-5 h-5 text-emerald-600" />
              <span className="font-label-caps text-xs text-emerald-600 uppercase tracking-widest font-bold">
                Logged In {isMock ? '(Mock Preview)' : '(Live Supabase)'}
              </span>
            </div>
            <h1 className="font-display-lg text-3xl">Content Management Dashboard</h1>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 px-5 py-2.5 border border-error/40 hover:border-error text-error rounded-xl font-label-caps text-xs tracking-wider hover:bg-error-container/10 transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Tab Menu */}
          <div className="lg:col-span-3 bg-white dark:bg-slate-900/60 p-4 border border-outline-variant/30 dark:border-outline/10 rounded-2xl space-y-1">
            <h3 className="font-label-caps text-xs text-secondary dark:text-secondary-fixed-dim uppercase tracking-widest px-3 mb-3 block font-bold">
              Database Tables
            </h3>
            {tabOptions.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  setActiveTab(opt.key);
                  setIsEditing(false);
                }}
                className={`w-full text-left px-4 py-2.5 rounded-xl font-label-caps text-xs tracking-wider transition-all flex items-center justify-between ${
                  activeTab === opt.key
                    ? 'bg-primary text-on-primary font-bold shadow-sm'
                    : 'text-secondary hover:bg-surface-container dark:hover:bg-surface-container-high/10'
                }`}
              >
                {opt.label}
                <Database className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>

          {/* Main Editing / Listing Table Panel */}
          <div className="lg:col-span-9 space-y-6">
            {isEditing ? (
              <div className="space-y-4 animate-fadeIn">
                {activeTab === 'trips' && (
                  <TripForm initialData={editData} onSuccess={handleFormSuccess} onCancel={() => setIsEditing(false)} />
                )}
                {activeTab === 'countries' && (
                  <CountryForm initialData={editData} onSuccess={handleFormSuccess} onCancel={() => setIsEditing(false)} />
                )}
                {activeTab === 'cities' && (
                  <CityForm initialData={editData} onSuccess={handleFormSuccess} onCancel={() => setIsEditing(false)} />
                )}
                {activeTab === 'journals' && (
                  <JournalForm initialData={editData} onSuccess={handleFormSuccess} onCancel={() => setIsEditing(false)} />
                )}
                {activeTab === 'expenses' && (
                  <ExpenseForm initialData={editData} onSuccess={handleFormSuccess} onCancel={() => setIsEditing(false)} />
                )}
                {activeTab === 'transport' && (
                  <TransportForm initialData={editData} onSuccess={handleFormSuccess} onCancel={() => setIsEditing(false)} />
                )}
                {activeTab === 'photos' && (
                  <PhotoForm initialData={editData} onSuccess={handleFormSuccess} onCancel={() => setIsEditing(false)} />
                )}
                {activeTab === 'locations' && (
                  <LocationForm initialData={editData} onSuccess={handleFormSuccess} onCancel={() => setIsEditing(false)} />
                )}
                {activeTab === 'statistics' && (
                  <StatisticForm initialData={editData} onSuccess={handleFormSuccess} onCancel={() => setIsEditing(false)} />
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900/60 border border-outline-variant/30 dark:border-outline/10 rounded-3xl p-6 md:p-8 space-y-6">
                {/* List Table Header */}
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-4">
                  <h3 className="font-headline-sm text-xl capitalize flex items-center gap-2">
                    <List className="w-5 h-5 text-primary" />
                    Current {activeTab}
                  </h3>
                  <button
                    onClick={handleCreateNew}
                    className="flex items-center gap-1.5 px-4 py-2 bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed rounded-xl text-xs font-label-caps tracking-wider hover:opacity-90 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Record
                  </button>
                </div>

                {/* List Views */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-surface-container dark:bg-surface-container-high/25 text-secondary dark:text-secondary-fixed-dim text-xs font-label-caps">
                        <th className="p-3">Summary</th>
                        <th className="p-3">Details</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {/* Trips List */}
                      {activeTab === 'trips' && trips?.map((t) => (
                        <tr key={t.id}>
                          <td className="p-3 font-semibold text-primary dark:text-primary-fixed">{t.name}</td>
                          <td className="p-3 text-secondary text-xs">{t.start_date} {t.end_date ? `to ${t.end_date}` : ''}</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => handleEditClick(t)} className="p-2 text-blue-600 hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteItem(t.id)} className="p-2 text-error hover:bg-error-container/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}

                      {/* Countries List */}
                      {activeTab === 'countries' && countries?.map((c) => (
                        <tr key={c.code}>
                          <td className="p-3 font-semibold text-primary dark:text-primary-fixed">{c.name} ({c.code})</td>
                          <td className="p-3 text-secondary text-xs capitalize">Status: {c.status}</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => handleEditClick(c)} className="p-2 text-blue-600 hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteItem(c.code)} className="p-2 text-error hover:bg-error-container/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}

                      {/* Cities List */}
                      {activeTab === 'cities' && cities?.map((c) => (
                        <tr key={c.id}>
                          <td className="p-3 font-semibold text-primary dark:text-primary-fixed">{c.name}</td>
                          <td className="p-3 text-secondary text-xs">Lat: {c.latitude}, Lng: {c.longitude}</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => handleEditClick(c)} className="p-2 text-blue-600 hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteItem(c.id)} className="p-2 text-error hover:bg-error-container/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}

                      {/* Journal Logs List */}
                      {activeTab === 'journals' && journals?.map((j) => (
                        <tr key={j.id}>
                          <td className="p-3 font-semibold text-primary dark:text-primary-fixed max-w-[200px] truncate">{j.title}</td>
                          <td className="p-3 text-secondary text-xs">{j.date} • {j.cities?.name || 'General'}</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => handleEditClick(j)} className="p-2 text-blue-600 hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteItem(j.id)} className="p-2 text-error hover:bg-error-container/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}

                      {/* Photo Logs List */}
                      {activeTab === 'photos' && photos?.map((p) => (
                        <tr key={p.id}>
                          <td className="p-3 flex items-center gap-3">
                            <img src={p.url} className="w-10 h-10 object-cover rounded-lg border" alt="Thumbnail" />
                            <span className="font-semibold text-primary dark:text-primary-fixed max-w-[150px] truncate">{p.caption}</span>
                          </td>
                          <td className="p-3 text-secondary text-xs capitalize">{p.category} • {p.taken_at}</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => handleEditClick(p)} className="p-2 text-blue-600 hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteItem(p.id)} className="p-2 text-error hover:bg-error-container/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}

                      {/* Expenses List */}
                      {activeTab === 'expenses' && expenses?.map((e) => (
                        <tr key={e.id}>
                          <td className="p-3 font-semibold text-primary dark:text-primary-fixed">{e.amount} {e.currency}</td>
                          <td className="p-3 text-secondary text-xs capitalize">{e.category} • {e.date}</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => handleEditClick(e)} className="p-2 text-blue-600 hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteItem(e.id)} className="p-2 text-error hover:bg-error-container/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}

                      {/* Transport Logs List */}
                      {activeTab === 'transport' && transport?.map((t) => (
                        <tr key={t.id}>
                          <td className="p-3 font-semibold text-primary dark:text-primary-fixed capitalize">{t.type}</td>
                          <td className="p-3 text-secondary text-xs">{t.distance_km} km ({t.departure_city?.name} → {t.arrival_city?.name})</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => handleEditClick(t)} className="p-2 text-blue-600 hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteItem(t.id)} className="p-2 text-error hover:bg-error-container/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}

                      {/* Sights (Locations) List */}
                      {activeTab === 'locations' && locations?.map((l) => (
                        <tr key={l.id}>
                          <td className="p-3 font-semibold text-primary dark:text-primary-fixed">{l.name}</td>
                          <td className="p-3 text-secondary text-xs capitalize">{l.category} • {l.cities?.name || 'General'}</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => handleEditClick(l)} className="p-2 text-blue-600 hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteItem(l.id)} className="p-2 text-error hover:bg-error-container/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}

                      {/* Statistics Metrics List */}
                      {activeTab === 'statistics' && stats?.map((s) => (
                        <tr key={s.id}>
                          <td className="p-3 font-semibold text-primary dark:text-primary-fixed">{s.label}</td>
                          <td className="p-3 text-secondary text-xs">Value: {s.value} ({s.key})</td>
                          <td className="p-3 text-right flex justify-end gap-2">
                            <button onClick={() => handleEditClick(s)} className="p-2 text-blue-600 hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => handleDeleteItem(s.id)} className="p-2 text-error hover:bg-error-container/10 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
