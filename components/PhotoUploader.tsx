'use client';
import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

type Photo = { id: string; url: string };

export default function PhotoUploader({ profileId }: { profileId: string }) {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, [profileId]);

  function loadPhotos() {
    api.get(`/profiles/${profileId}/photos`).then(setPhotos).catch((err) => setError(err.message));
  }

  async function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      await api.upload(`/profiles/${profileId}/photos`, file);
      loadPhotos();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleDelete(photoId: string) {
    setPhotos((prev) => prev?.filter((p) => p.id !== photoId) ?? null); // optimistic
    try {
      await api.delete(`/profiles/${profileId}/photos/${photoId}`);
    } catch (err: any) {
      setError(err.message);
      loadPhotos(); // revert on failure
    }
  }

  return (
    <div>
      <h2 className="font-medium text-gray-700 mb-2">Photos</h2>
      <p className="text-xs text-gray-500 mb-3">
        Private — only visible to you, never public.
      </p>

      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

      <div className="grid grid-cols-4 gap-3 mb-3">
        {photos?.map((photo) => (
          <div key={photo.id} className="relative group">
            <img src={photo.url} alt="" className="w-full aspect-square object-cover rounded border" />
            <button
              onClick={() => handleDelete(photo.id)}
              className="absolute top-1 right-1 bg-black/70 text-white text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelected}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && <p className="text-sm text-gray-500 mt-1">Uploading…</p>}
    </div>
  );
}
