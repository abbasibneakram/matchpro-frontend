'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';
import ProfileForm, { ProfileFormValues } from '@/components/ProfileForm';
import PhotoUploader from '@/components/PhotoUploader';
import PaymentTracker from '@/components/PaymentTracker';

const statusStyles: Record<string, string> = {
  PENDING_REVIEW: 'bg-marigold-soft text-marigold',
  ACTIVE: 'bg-teal-soft text-teal-dark',
  INACTIVE: 'bg-line/50 text-ink/50',
};

const statusLabels: Record<string, string> = {
  PENDING_REVIEW: 'Pending review',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

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

  if (error) return <p className="text-rose text-sm">{error}</p>;

  if (!profile) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-4 w-16 bg-line/50 rounded" />
        <div className="h-7 w-56 bg-line/60 rounded" />
        <div className="index-card p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-10 bg-line/40 rounded" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button onClick={() => router.push('/dashboard')} className="btn-text mb-4 inline-flex items-center gap-1">
        <ArrowLeft size={14} /> Back to profiles
      </button>

      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-display italic">{profile.name}</h1>
            <span className={`badge ${statusStyles[profile.status]}`}>{statusLabels[profile.status]}</span>
          </div>
          <p className="text-sm text-ink/60">
            <span className="num">{profile.age}</span> yrs · {profile.gender === 'MALE' ? 'Male' : 'Female'}
            {profile.city ? ` · ${profile.city}` : ''}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={toggleStatus} disabled={statusSaving} className="btn-secondary">
            {profile.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
          </button>
          {profile.status === 'ACTIVE' && (
            <Link href={`/dashboard/${profile.id}/matches`} className="btn-primary gap-1.5">
              <Sparkles size={16} strokeWidth={2} />
              Find matches
            </Link>
          )}
        </div>
      </div>

      <div className="index-card p-6">
        <ProfileForm initial={profile} onSubmit={handleSubmit} submitLabel="Save changes" />
      </div>

      <div className="index-card p-6 mt-5">
        <PhotoUploader profileId={profile.id} />
      </div>

      <div className="index-card p-6 mt-5">
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
