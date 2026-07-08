'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { UserPlus, Plus, Link2, Copy, Check, Users } from 'lucide-react';
import { api } from '@/lib/api';
import ProfileRow from '@/components/ProfileRow';
import StatCard from '@/components/StatCard';

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<any[] | null>(null);
  const [error, setError] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/profiles').then(setProfiles).catch((err) => setError(err.message));
  }, []);

  async function handleGenerateInvite() {
    setInviteLoading(true);
    setCopied(false);
    try {
      const { token } = await api.post('/profiles/invite', {});
      setInviteUrl(`${window.location.origin}/invite/${token}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setInviteLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
  }

  const counts = {
    total: profiles?.length ?? 0,
    active: profiles?.filter((p) => p.status === 'ACTIVE').length ?? 0,
    pending: profiles?.filter((p) => p.status === 'PENDING_REVIEW').length ?? 0,
    inactive: profiles?.filter((p) => p.status === 'INACTIVE').length ?? 0,
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-7">
        <div>
          <h1 className="text-2xl font-display italic">Profiles</h1>
          <p className="text-sm text-ink/60 mt-0.5">Every person you're matching, in one place.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={handleGenerateInvite} disabled={inviteLoading} className="btn-secondary gap-1.5">
            <UserPlus size={16} strokeWidth={2} />
            {inviteLoading ? 'Generating…' : 'Invite a client'}
          </button>
          <Link href="/dashboard/new" className="btn-primary gap-1.5">
            <Plus size={16} strokeWidth={2} />
            Add profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={counts.total} />
        <StatCard label="Active" value={counts.active} tone="teal" />
        <StatCard label="Pending review" value={counts.pending} tone="marigold" />
        <StatCard label="Inactive" value={counts.inactive} tone="muted" />
      </div>

      {inviteUrl && (
        <div className="mb-6 index-card p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-teal-soft text-teal-dark flex items-center justify-center shrink-0">
            <Link2 size={16} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink/50">Share this link — it can be used once</p>
            <p className="text-sm truncate num">{inviteUrl}</p>
          </div>
          <button onClick={handleCopy} className="btn-secondary shrink-0 py-1.5 gap-1.5">
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}

      {error && <p className="text-rose text-sm mb-3">{error}</p>}

      {profiles === null && !error && (
        <div className="index-card divide-y divide-line overflow-hidden">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
              <div className="w-9 h-9 rounded-full bg-line/60" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 bg-line/60 rounded" />
                <div className="h-3 w-48 bg-line/40 rounded" />
              </div>
              <div className="h-5 w-20 bg-line/40 rounded" />
            </div>
          ))}
        </div>
      )}

      {profiles?.length === 0 && (
        <div className="index-card p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-teal-soft text-teal-dark flex items-center justify-center mx-auto mb-3">
            <Users size={20} strokeWidth={2} />
          </div>
          <p className="font-display italic text-lg mb-1">No profiles yet</p>
          <p className="text-sm text-ink/60">Add your first profile, or invite a client to fill in their own.</p>
        </div>
      )}

      {profiles && profiles.length > 0 && (
        <div className="index-card divide-y divide-line overflow-hidden">
          {profiles.map((p) => <ProfileRow key={p.id} profile={p} />)}
        </div>
      )}
    </div>
  );
}
