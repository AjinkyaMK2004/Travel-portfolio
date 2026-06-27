import React, { useState, useEffect, useRef } from 'react';
import { useSavePhoto, useUploadPhotoFile, useTrips, useCities, useCountries } from '../../hooks/useSupabase';
import { Photo } from '../../types';
import { Star, Upload, Link as LinkIcon } from 'lucide-react';

interface PhotoFormProps {
  initialData?: Photo | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PhotoForm: React.FC<PhotoFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const savePhotoMutation = useSavePhoto();
  const uploadPhotoMutation = useUploadPhotoFile();
  const { data: trips } = useTrips();
  const { data: cities } = useCities();
  const { data: countries } = useCountries();

  const [formData, setFormData] = useState({
    trip_id: '',
    city_id: '',
    country_code: '',
    url: '',
    caption: '',
    category: 'architecture' as Photo['category'],
    taken_at: '',
    is_favorite: false
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMode, setUploadMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        trip_id: initialData.trip_id,
        city_id: initialData.city_id || '',
        country_code: initialData.country_code || '',
        url: initialData.url,
        caption: initialData.caption || '',
        category: initialData.category || 'architecture',
        taken_at: initialData.taken_at,
        is_favorite: initialData.is_favorite
      });
      setUploadMode('url');
    } else {
      setFormData({
        trip_id: trips && trips.length > 0 ? trips[0].id : '',
        city_id: '',
        country_code: '',
        url: '',
        caption: '',
        category: 'architecture',
        taken_at: new Date().toISOString().split('T')[0],
        is_favorite: false
      });
      setUploadMode('upload');
    }
  }, [initialData, trips]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.trip_id) return;

    let finalUrl = formData.url;

    // Trigger Upload if a local file is chosen in upload mode
    if (uploadMode === 'upload' && selectedFile) {
      try {
        finalUrl = await uploadPhotoMutation.mutateAsync(selectedFile);
      } catch (err) {
        console.error('Upload failed:', err);
        alert('File upload failed. Please try again.');
        return;
      }
    }

    if (!finalUrl) {
      alert('Please select an image file to upload or enter a Direct Image URL.');
      return;
    }

    const payload = {
      trip_id: formData.trip_id,
      city_id: formData.city_id || undefined,
      country_code: formData.country_code || undefined,
      url: finalUrl,
      caption: formData.caption.trim() || undefined,
      category: formData.category,
      taken_at: formData.taken_at,
      is_favorite: formData.is_favorite,
      ...(initialData?.id ? { id: initialData.id } : {})
    };

    savePhotoMutation.mutate(payload, {
      onSuccess: () => onSuccess()
    });
  };

  const isPending = savePhotoMutation.isPending || uploadPhotoMutation.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-slate-900/60 p-6 rounded-2xl border border-outline-variant/30 dark:border-outline/10">
      <h4 className="font-headline-sm text-lg text-primary dark:text-primary-fixed mb-4">
        {initialData ? 'Modify Photo Logs' : 'Log Travel Photograph'}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Country Code (Optional)</label>
          <select
            value={formData.country_code}
            onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="">No Country</option>
            {countries?.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.code})
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
            <option value="">No City</option>
            {cities?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Switch Input Mode */}
      {!initialData && (
        <div className="flex border border-outline-variant/30 rounded-xl overflow-hidden text-xs font-label-caps uppercase tracking-wider w-fit">
          <button
            type="button"
            onClick={() => setUploadMode('upload')}
            className={`px-4 py-2 flex items-center gap-1.5 ${
              uploadMode === 'upload' ? 'bg-primary text-on-primary' : 'bg-surface hover:bg-surface-container text-secondary'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> Upload Photo
          </button>
          <button
            type="button"
            onClick={() => setUploadMode('url')}
            className={`px-4 py-2 flex items-center gap-1.5 ${
              uploadMode === 'url' ? 'bg-primary text-on-primary' : 'bg-surface hover:bg-surface-container text-secondary'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" /> External URL
          </button>
        </div>
      )}

      {/* Image File Selector */}
      {uploadMode === 'upload' ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-outline-variant/60 dark:border-outline/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-surface-container-low dark:hover:bg-surface-container-high/10 transition-colors"
        >
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="w-8 h-8 mx-auto text-secondary mb-2" />
          <span className="text-xs text-primary dark:text-primary-fixed block font-semibold font-label-caps uppercase">
            {selectedFile ? selectedFile.name : 'Select or Drag Image'}
          </span>
          <span className="text-[10px] text-secondary block mt-1">PNG, JPG or WEBP up to 5MB</span>
        </div>
      ) : (
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Direct Image URL</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            placeholder="https://example.com/your-image.jpg"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col col-span-2">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Caption Details</label>
          <input
            type="text"
            required
            value={formData.caption}
            onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
            placeholder="e.g. Scenic views from the peak"
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Category</label>
          <select
            value={formData.category || 'architecture'}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as Photo['category'] })}
            required
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          >
            <option value="architecture">Architecture</option>
            <option value="food">Food</option>
            <option value="nature">Nature / Scenery</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-[10px] font-label-caps text-secondary dark:text-secondary-fixed-dim uppercase tracking-wider mb-1.5">Taken Date</label>
          <input
            type="date"
            required
            value={formData.taken_at}
            onChange={(e) => setFormData({ ...formData, taken_at: e.target.value })}
            className="bg-background dark:bg-surface-container border border-outline-variant/50 rounded-xl px-4 py-2 text-sm text-primary dark:text-primary-fixed focus:outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, is_favorite: !formData.is_favorite })}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-label-caps tracking-wider transition-colors w-full justify-center ${
              formData.is_favorite
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600'
                : 'border-outline-variant/60 text-secondary'
            }`}
          >
            <Star className={`w-4 h-4 ${formData.is_favorite ? 'fill-current' : ''}`} />
            Favorite Photo
          </button>
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
          disabled={isPending}
          className="px-5 py-2 bg-primary text-on-primary rounded-xl text-xs font-label-caps tracking-wider hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isPending ? 'Processing...' : 'Save Photo'}
        </button>
      </div>
    </form>
  );
};
