'use client';
import { useEffect, useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';

type Photo = { id: string; url: string };

export default function PhotoUploader({ profileId }: { profileId: string }) {
  const toast = useToast();
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, [profileId]);

  function loadPhotos() {
    api.get(`/profiles/${profileId}/photos`).then(setPhotos).catch((err) => toast.error(err.message));
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await api.upload(`/profiles/${profileId}/photos`, file);
      loadPhotos();
      toast.success('Photo uploaded');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(photoId: string) {
    setPhotos((prev) => prev?.filter((p) => p.id !== photoId) ?? null);
    try {
      await api.delete(`/profiles/${profileId}/photos/${photoId}`);
    } catch (err: any) {
      toast.error(err.message);
      loadPhotos();
    }
  }

  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink/50 mb-1">
        <Camera size={13} strokeWidth={2} /> Photos
      </p>
      <p className="text-xs text-ink/50 mb-3">Private — only visible to you, never public.</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {photos?.map((photo) => (
          <div key={photo.id} className="relative group">
            <img src={photo.url} alt="" className="w-full aspect-square object-cover rounded-sm border border-line" />
            <button
              onClick={() => handleDelete(photo.id)}
              className="absolute top-1 right-1 bg-ink/80 text-paper text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <label className="inline-flex items-center gap-2 text-sm border border-line rounded px-3 py-1.5 cursor-pointer hover:border-teal transition-colors">
        {uploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
        {uploading ? 'Uploading…' : 'Add photo'}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelected}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}
