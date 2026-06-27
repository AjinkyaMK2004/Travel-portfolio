import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Camera, Globe, ArrowRight, BookOpen, BarChart3, Image as ImageIcon, Map as MapIcon, User } from 'lucide-react';
import { useStatistics, useJournalEntries, useCountries } from '../../hooks/useSupabase';
import { Skeleton } from '../../components/common/Skeleton';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { data: stats, isLoading: statsLoading } = useStatistics();
  const { data: journals, isLoading: journalsLoading } = useJournalEntries();
  const { data: countries } = useCountries();

  // Find latest journal entry
  const latestJournal = journals && journals.length > 0 ? journals[0] : null;

  // Filter general stats
  const findStat = (key: string, fallback: number) => {
    if (!stats) return fallback;
    const item = stats.find((s) => s.key === key);
    return item ? Math.round(item.value) : fallback;
  };

  const countriesCount = countries ? countries.filter(c => c.status === 'visited').length : findStat('countries_visited', 14);
  const citiesCount = findStat('cities_explored', 42);
  const totalDays = findStat('total_days', 128);
  const memoriesCount = findStat('memories_captured', 2480);

  // Cards configuration
  const navCards = [
    {
      to: '/journey',
      title: 'Journey',
      description: 'A chronological timeline of the semester\'s narrative arc and adventure logs.',
      icon: BookOpen,
      color: 'from-amber-500/10 to-amber-600/5',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      to: '/explore',
      title: 'Explore',
      description: 'Full-screen interactive Europe map highlighting visited, current, and planned places.',
      icon: MapIcon,
      color: 'from-blue-500/10 to-blue-600/5',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      to: '/gallery',
      title: 'Gallery',
      description: 'A masonry archive of high-fidelity photography capturing European cities and food.',
      icon: ImageIcon,
      color: 'from-purple-500/10 to-purple-600/5',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
      to: '/analytics',
      title: 'Analytics',
      description: 'Detailed insights into travel metrics, distance covered, transport modes, and budgets.',
      icon: BarChart3,
      color: 'from-emerald-500/10 to-emerald-600/5',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      to: '/about',
      title: 'About',
      description: 'Behind the portfolio - exchange details, photography gear, and personal contact.',
      icon: User,
      color: 'from-rose-500/10 to-rose-600/5',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background text-on-background transition-colors duration-300">
      {/* Hero Section */}
      <section className="px-margin-desktop max-w-container-max mx-auto pt-16 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="font-display-lg text-display-lg text-primary dark:text-primary-fixed mb-6 leading-tight">
              EuroVenture
            </h1>
            <p className="font-body-lg text-body-lg text-secondary dark:text-secondary-fixed-dim max-w-2xl leading-relaxed">
              A curated digital chronicle of a transformative exchange semester across the European continent. 
              Documenting the architectural marvels, hidden cobblestone paths, and the cultural tapestry of {countriesCount} nations.
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        {statsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter border border-outline-variant/30 dark:border-outline/20 p-8 rounded-2xl bg-surface-container-lowest dark:bg-surface-container-low/10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-gutter border border-outline-variant/30 dark:border-outline/20 p-8 rounded-2xl bg-surface-container-lowest dark:bg-surface-container-low/5 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed-dim mb-2 uppercase flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> Countries Visited
              </span>
              <span className="font-stat-value text-4xl font-bold text-primary dark:text-primary-fixed">
                {countriesCount}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed-dim mb-2 uppercase flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Cities Explored
              </span>
              <span className="font-stat-value text-4xl font-bold text-primary dark:text-primary-fixed">
                {citiesCount}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed-dim mb-2 uppercase flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Total Days
              </span>
              <span className="font-stat-value text-4xl font-bold text-primary dark:text-primary-fixed">
                {totalDays}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed-dim mb-2 uppercase flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5" /> Memories Captured
              </span>
              <span className="font-stat-value text-4xl font-bold text-primary dark:text-primary-fixed">
                {memoriesCount.toLocaleString()}
              </span>
            </div>
          </motion.div>
        )}
      </section>

      {/* Main Navigation Grid */}
      <section className="px-margin-desktop max-w-container-max mx-auto mb-section-gap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {navCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  to={card.to}
                  className={`group relative flex flex-col justify-between p-8 aspect-[4/5] overflow-hidden rounded-2xl border border-outline-variant/30 dark:border-outline/20 bg-surface-container-lowest dark:bg-surface-container-low/5 hover:border-primary/20 dark:hover:border-primary-fixed-dim/30 transition-all duration-500 hover:shadow-[0px_12px_32px_rgba(0,0,0,0.03)] hover:-translate-y-1 h-full`}
                >
                  <div className={`w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br ${card.color}`}>
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-primary dark:text-primary-fixed mb-2 group-hover:text-primary/85 dark:group-hover:text-primary-fixed/90 transition-colors">
                      {card.title}
                    </h3>
                    <p className="font-body-md text-body-md text-secondary dark:text-secondary-fixed-dim leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Europe Snapshot Map Banner */}
      <section className="px-margin-desktop max-w-container-max mx-auto mb-section-gap">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-surface-container-low dark:bg-surface-container-high/10 rounded-2xl p-12 overflow-hidden flex flex-col lg:flex-row items-center gap-12"
        >
          <div className="lg:w-1/3">
            <span className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed-dim mb-4 block uppercase tracking-widest">
              Interactive Footprint
            </span>
            <h2 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed mb-6">
              Europe Snapshot
            </h2>
            <p className="font-body-md text-body-md text-secondary dark:text-secondary-fixed-dim mb-8 leading-relaxed">
              The footprint of a semester. From the Scandinavian fjords to Mediterranean shores, every country highlights a narrative of discovery. Click to explore the fully custom interactive map.
            </p>
            <button
              onClick={() => navigate('/explore')}
              className="flex items-center gap-2 text-primary dark:text-primary-fixed font-bold group border-b-2 border-primary/20 dark:border-primary-fixed/20 pb-1 hover:border-primary dark:hover:border-primary-fixed transition-all"
            >
              View Full Map
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div
            onClick={() => navigate('/explore')}
            className="lg:w-2/3 w-full h-[380px] relative rounded-xl overflow-hidden bg-surface-container-lowest dark:bg-slate-900 border border-outline-variant/30 dark:border-outline/10 shadow-sm cursor-pointer group"
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
              style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuD_SJazRTXsWi7BAsClDmmRA0QvHKWXxq7eHScTQf7R4SEdW64vVi9GeiabxGZgOwru8aogzBMDqvvXDUq35qOeSU_q-wfWS4VZfaEabAecneGXDG2--HPjO-NibJLg7CVjGTDhh-Sdl0lewEGxNtcYUqaKAnwwLzP18aiWbT-OI4ppw5pT0IXPHfqQtFi8tutlzsl0V4Qd4YxbwvkGELL4wj8VONl_P_zsmttwCkKoklcUW-3-_J3gNpZnpaiS4oFQhgw7XalPzOxH')` }}
            />
            <div className="absolute inset-0 bg-primary/5 dark:bg-primary-fixed/5 group-hover:bg-primary/0 transition-colors duration-500" />
            <div className="absolute top-4 right-4 bg-white/80 dark:bg-primary/80 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-2 border border-outline-variant/30 dark:border-outline/20">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-label-caps uppercase tracking-wider text-primary dark:text-primary-fixed">Interactive View</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Latest Memory / Highlight Section */}
      <section className="px-margin-desktop max-w-container-max mx-auto mb-16">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <span className="font-label-caps text-label-caps text-secondary dark:text-secondary-fixed-dim mb-2 block uppercase tracking-widest">
              Current Chapter
            </span>
            <h2 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed">
              Latest Memory
            </h2>
          </div>
          <Link
            to="/journey"
            className="text-secondary dark:text-secondary-fixed-dim hover:text-primary dark:hover:text-primary-fixed transition-colors font-label-caps text-label-caps border-b border-transparent hover:border-primary"
          >
            View All Memories
          </Link>
        </div>

        {journalsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch">
            <Skeleton className="lg:col-span-7 h-96 w-full rounded-2xl" />
            <div className="lg:col-span-5 p-8 border border-outline-variant/30 rounded-2xl flex flex-col space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ) : latestJournal ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-gutter items-stretch"
          >
            {/* Image Box */}
            <div className="lg:col-span-7 overflow-hidden rounded-2xl aspect-video lg:aspect-auto border border-outline-variant/30 dark:border-outline/20 relative group">
              <img
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={
                  latestJournal.city_id === 'city-7'
                    ? 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaAj2FcHOJsugZ6AZQ9tl2HlMaDqWmd1JWH_B2a0esF4GOS7qi6F29-UTxx3BtZooaSWBj-FYPSFmBlkcMVsScW3MGPWt3VPDqSizX9NarABgZV1XNIk36v4EPWqq-IaAhA0eQG58TkOmoTOiINVlpw_PxnYJMUr6J4P9FgCo1lxo2suP86UdhZoEWmJIqc7l260OstaCgt1FcdSjQcs0sSN8EQ8P3Q_tsAr4GIcMjcpbvWpIsf7QNfN9ku1Q9ZXJ7qCsmBz6Sh61F'
                    : 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpv5FYw7_H1HhygLFxz0VmkQGi4ceqoAK3RGwjyJ54XeqShByFigKx8mOhWbzJizggnkbvh80JDbctnZPn-4ckwNvHnbwTSfwCKj4E_mHEwz2NXczEhfEnmKSZRE6zojuhYWlpD3k8jEorI-ukue9M31HjNV7BP-KJ0STKaIF4GdZYM-NmkJBWQ-qINBMq730-_M3uMQPf2plpLoGU99efJ05jDvj-0EG4h08GkCowNrk_oVRdOeOGSpGZsiLhlkps-1c9AWQIc1va'
                }
                alt={latestJournal.title}
              />
              <div className="absolute inset-0 bg-primary/10 dark:bg-black/20 mix-blend-multiply" />
            </div>

            {/* Content Box */}
            <div className="lg:col-span-5 p-8 md:p-12 border border-outline-variant/30 dark:border-outline/20 rounded-2xl flex flex-col justify-center bg-white dark:bg-surface-container-low/5 shadow-sm">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="font-label-caps text-xs text-primary dark:text-primary-fixed py-1 px-3 bg-surface-container dark:bg-surface-container-high/30 rounded-full">
                  {latestJournal.cities?.name || 'Europe'}
                </span>
                <span className="font-label-caps text-xs text-secondary dark:text-secondary-fixed-dim">
                  {new Date(latestJournal.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary dark:text-primary-fixed mb-4 leading-tight">
                {latestJournal.title}
              </h3>
              <p className="font-body-md text-body-md text-secondary dark:text-secondary-fixed-dim mb-8 leading-relaxed line-clamp-4">
                {latestJournal.content}
              </p>
              <Link
                to="/journey"
                className="group flex items-center gap-3 font-label-caps text-label-caps text-primary dark:text-primary-fixed hover:opacity-80 transition-opacity"
              >
                Read Journey Updates
                <div className="w-8 h-[1px] bg-primary dark:bg-primary-fixed group-hover:w-12 transition-all duration-300" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="text-center py-12 border border-dashed border-outline-variant/40 rounded-2xl">
            <p className="text-secondary dark:text-secondary-fixed-dim">No travel updates loaded yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};
