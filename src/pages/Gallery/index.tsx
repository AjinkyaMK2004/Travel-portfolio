import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar, Star, X, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { usePhotos } from '../../hooks/useSupabase';
import { Skeleton } from '../../components/common/Skeleton';
import type { Photo } from '../../types';

export const Gallery: React.FC = () => {
  const { data: photos, isLoading } = usePhotos();
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  // Filter Photos
  const filteredPhotos = photos?.filter((photo) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'favorites') return photo.is_favorite;
    return photo.category === activeFilter;
  }) || [];

  const handleOpenLightbox = (photoId: string) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photoId);
    if (idx !== -1) setSelectedPhotoIndex(idx);
  };

  const handleCloseLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! === 0 ? filteredPhotos.length - 1 : prev! - 1));
  };

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPhotoIndex === null) return;
    setSelectedPhotoIndex((prev) => (prev! === filteredPhotos.length - 1 ? 0 : prev! + 1));
  };

  const activePhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  // Map center coordinates for photo lightbox
  const photoCoordinates: [number, number] = activePhoto?.cities
    ? [activePhoto.cities.latitude, activePhoto.cities.longitude]
    : [48.8566, 2.3522]; // fallback to Paris

  const filterTabs = [
    { key: 'all', label: 'All Archives' },
    { key: 'food', label: 'Food' },
    { key: 'architecture', label: 'Architecture' },
    { key: 'nature', label: 'Nature' },
    { key: 'favorites', label: 'Favorites' }
  ];

  return (
    <div className="min-h-screen bg-background dark:bg-background pt-16 pb-section-gap text-on-background transition-colors duration-300">
      <main className="px-margin-desktop max-w-container-max mx-auto pt-16">
        {/* Header */}
        <header className="mb-12">
          <h1 className="font-display-lg text-display-lg mb-4">The Archives</h1>
          <p className="text-secondary dark:text-secondary-fixed-dim font-body-lg text-body-lg max-w-2xl leading-relaxed">
            A curated visual chronicle of European expeditions, capturing the intersection of historical grandeur and contemporary lifestyle.
          </p>
        </header>

        {/* Filters Sticky Panel */}
        <div className="flex flex-wrap items-center gap-3 mb-12 sticky top-[73px] z-40 bg-background/90 py-4 backdrop-blur-sm transition-colors">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveFilter(tab.key);
                setSelectedPhotoIndex(null); // Reset lightbox active state
              }}
              className={`px-5 py-2 rounded-full font-label-caps text-xs tracking-wider transition-all duration-300 border ${
                activeFilter === tab.key
                  ? 'bg-primary border-primary text-on-primary shadow-sm'
                  : 'border-outline-variant/60 text-secondary dark:text-secondary-fixed-dim hover:bg-surface-container'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Masonry Image Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <Skeleton key={n} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-outline-variant/30 rounded-2xl">
            <Compass className="w-12 h-12 text-secondary/40 mx-auto mb-4" />
            <p className="text-secondary dark:text-secondary-fixed-dim font-body-lg">No photos found in this category.</p>
          </div>
        ) : (
          <div className="masonry-grid">
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                layoutId={`photo-card-${photo.id}`}
                onClick={() => handleOpenLightbox(photo.id)}
                className="masonry-item relative group overflow-hidden rounded-2xl border border-outline-variant/20 dark:border-outline/10 bg-surface-container shadow-xs cursor-zoom-in"
              >
                <img
                  src={photo.url}
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  alt={photo.caption}
                  loading="lazy"
                />
                
                {/* Image Overlay */}
                <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 backdrop-blur-[1px]">
                  <span className="text-white font-label-caps text-[10px] uppercase tracking-widest mb-1.5 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    {new Date(photo.taken_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <h3 className="text-white font-headline-sm text-lg opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-150">
                    {photo.cities?.name || 'Europe'}, {photo.countries?.name || ''}
                  </h3>
                  {photo.is_favorite && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-1.5 rounded-full text-amber-400">
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox Slider Modal */}
      <AnimatePresence>
        {activePhoto && (
          <div
            className="fixed inset-0 bg-primary/95 dark:bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-10 select-none"
            onClick={handleCloseLightbox}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseLightbox}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
              title="Close Viewer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Previous Photo Button */}
            <button
              onClick={handlePrevPhoto}
              className="absolute left-4 md:left-8 p-3 bg-white/5 hover:bg-white/15 text-white rounded-full transition-colors z-10"
              title="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Next Photo Button */}
            <button
              onClick={handleNextPhoto}
              className="absolute right-4 md:right-8 p-3 bg-white/5 hover:bg-white/15 text-white rounded-full transition-colors z-10"
              title="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Lightbox Main Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[85vh] md:max-h-[80vh] border border-white/10"
            >
              {/* Photo Area */}
              <div className="flex-1 bg-neutral-950 flex items-center justify-center relative overflow-hidden h-[40vh] md:h-auto">
                <img
                  src={activePhoto.url}
                  className="max-w-full max-h-full object-contain"
                  alt={activePhoto.caption}
                />
              </div>

              {/* Sidebar Info Area */}
              <div className="w-full md:w-[350px] p-6 md:p-8 flex flex-col justify-between overflow-y-auto space-y-6 bg-white dark:bg-slate-900 border-t md:border-t-0 md:border-l border-outline-variant/30 dark:border-outline/10 text-on-background">
                <div className="space-y-6">
                  {/* Category Chip */}
                  <div className="flex justify-between items-center">
                    <span className="py-1 px-3 bg-surface-container dark:bg-surface-container-high/30 text-primary dark:text-primary-fixed rounded-full text-[10px] font-label-caps uppercase tracking-wider">
                      {activePhoto.category || 'Archive'}
                    </span>
                    {activePhoto.is_favorite && (
                      <span className="text-amber-500 flex items-center gap-1 text-[10px] font-label-caps">
                        <Star className="w-4.5 h-4.5 fill-current" /> FAVORITE
                      </span>
                    )}
                  </div>

                  {/* Location Title */}
                  <div>
                    <h3 className="font-headline-sm text-xl text-primary dark:text-primary-fixed flex items-center gap-1.5">
                      <MapPin className="w-5 h-5 text-primary" />
                      {activePhoto.cities?.name || 'Unknown Location'}, {activePhoto.countries?.name || ''}
                    </h3>
                    <span className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider block mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Taken at: {new Date(activePhoto.taken_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Caption Paragraph */}
                  {activePhoto.caption && (
                    <p className="text-sm text-secondary dark:text-secondary-fixed-dim leading-relaxed">
                      {activePhoto.caption}
                    </p>
                  )}
                </div>

                {/* Lightbox Mini Leaflet Map */}
                <div className="space-y-3 pt-6 border-t border-outline-variant/30 dark:border-outline/15">
                  <span className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider block">
                    Geographic Coordinates
                  </span>
                  <div className="h-[150px] rounded-xl overflow-hidden border border-outline-variant/30 dark:border-outline/10 relative z-0">
                    <MapContainer center={photoCoordinates} zoom={8} zoomControl={false} dragging={false} scrollWheelZoom={false} className="h-full w-full">
                      <TileLayer
                        attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={photoCoordinates} />
                    </MapContainer>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
