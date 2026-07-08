'use client';
import { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
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
    setPhotos((prev) => prev?.filter((p) => p.id !== photoId) ?? null);
    try {
      await api.delete(`/profiles/${profileId}/photos/${photoId}`);
    } catch (err: any) {
      setError(err.message);
      loadPhotos();
    }
  }

  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink/50 mb-1">
        <Camera size={13} strokeWidth={2} /> Photos
      </p>
      <p className="text-xs text-ink/50 mb-3">Private — only visible to you, never public.</p>

      {error && <p className="text-rose text-sm mb-2">{error}</p>}

      <div className="grid grid-cols-4 gap-3 mb-3">
        {photos?.map((photo) => (
          <div key={photo.id} className="relative group">
            <img src={photo.url} alt="" className="w-full aspect-square object-cover rounded-sm border border-line" />
            <button
              onClick={() => handleDelete(photo.id)}
              className="absolute top-1 right-1 bg-ink/80 text-paper text-xs rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100"
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
      {uploading && <p className="text-sm text-ink/50 mt-1">Uploading…</p>}
    </div>
  );
}
