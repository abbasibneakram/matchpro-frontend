'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import ProfileForm, { ProfileFormValues } from '@/components/ProfileForm';
import PhotoUploader from '@/components/PhotoUploader';
import PaymentTracker from '@/components/PaymentTracker';

export default function ProfileDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [profile, setProfile] = useState<any | null>(null);
  const [error, setError] = useState('');
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    api.get(`/profiles/${id}`).then(setProfile).catch((err) => setError(err.message));
  }, [id]);

  async function handleSubmit(values: ProfileFormValues) {
    const updated = await api.patch(`/profiles/${id}`, values);
    setProfile(updated);
  }

  async function toggleStatus() {
    if (!profile) return;
    setStatusSaving(true);
    const nextStatus = profile.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      const updated = await api.patch(`/profiles/${id}`, { status: nextStatus });
      setProfile(updated);
    } finally {
      setStatusSaving(false);
    }
  }

  if (error) return <p className="text-red-600 text-sm">{error}</p>;
  if (!profile) return <p className="text-gray-500">Loading…</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => router.push('/dashboard')} className="text-sm text-gray-500 underline mb-1">
            ← Back
          </button>
          <h1 className="text-xl font-medium">{profile.name}</h1>
        </div>
        <button
          onClick={toggleStatus}
          disabled={statusSaving}
          className="text-sm border rounded px-3 py-1.5"
        >
          {profile.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        </button>
      </div>

      {profile.status === 'ACTIVE' && (
        <Link
          href={`/dashboard/${profile.id}/matches`}
          className="inline-block mb-6 text-sm bg-black text-white rounded px-4 py-2"
        >
          Find matches
        </Link>
      )}

      <ProfileForm initial={profile} onSubmit={handleSubmit} submitLabel="Save changes" />

      <div className="mt-8 pt-6 border-t">
        <PhotoUploader profileId={profile.id} />
      </div>

      <div className="mt-8 pt-6 border-t">
        <PaymentTracker
          profileId={profile.id}
          feeAgreed={Number(profile.feeAgreed ?? 0)}
          amountPaid={Number(profile.amountPaid ?? 0)}
          onUpdated={(updated) => setProfile((prev: any) => ({ ...prev, ...updated }))}
        />
      </div>
    </div>
  );
}
