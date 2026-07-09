'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { UserPlus, Plus, Link2, Copy, Check, Users, Search, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';
import ProfileRow from '@/components/ProfileRow';
import StatCard from '@/components/StatCard';

type StatusFilter = 'ALL' | 'ACTIVE' | 'PENDING_REVIEW' | 'INACTIVE';

export default function DashboardPage() {
  const toast = useToast();
  const [profiles, setProfiles] = useState<any[] | null>(null);
  const [loadError, setLoadError] = useState('');
  const [inviteUrl, setInviteUrl] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  useEffect(() => {
    api.get('/profiles').then(setProfiles).catch((err) => setLoadError(err.message));
  }, []);

  async function handleGenerateInvite() {
    setInviteLoading(true);
    setCopied(false);
    try {
      const { token } = await api.post('/profiles/invite', {});
      setInviteUrl(`${window.location.origin}/invite/${token}`);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setInviteLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success('Link copied to clipboard');
  }

  const counts = {
    total: profiles?.length ?? 0,
    active: profiles?.filter((p) => p.status === 'ACTIVE').length ?? 0,
    pending: profiles?.filter((p) => p.status === 'PENDING_REVIEW').length ?? 0,
    inactive: profiles?.filter((p) => p.status === 'INACTIVE').length ?? 0,
  };

  const filteredProfiles = useMemo(() => {
    if (!profiles) return null;
    const q = query.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
      const matchesQuery = !q || p.name.toLowerCase().includes(q) || (p.city ?? '').toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [profiles, query, statusFilter]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-7">
        <div>
          <h1 className="text-2xl font-display italic">Profiles</h1>
          <p className="text-sm text-ink/60 mt-0.5">Every person you're matching, in one place.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={handleGenerateInvite} disabled={inviteLoading} className="btn-secondary gap-1.5 flex-1 sm:flex-none justify-center">
            {inviteLoading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} strokeWidth={2} />}
            <span className="sm:inline">{inviteLoading ? 'Generating…' : 'Invite a client'}</span>
          </button>
          <Link href="/dashboard/new" className="btn-primary gap-1.5 flex-1 sm:flex-none justify-center">
            <Plus size={16} strokeWidth={2} />
            Add profile
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total" value={counts.total} active={statusFilter === 'ALL'} onClick={() => setStatusFilter('ALL')} />
        <StatCard label="Active" value={counts.active} tone="teal" active={statusFilter === 'ACTIVE'} onClick={() => setStatusFilter('ACTIVE')} />
        <StatCard label="Pending review" value={counts.pending} tone="marigold" active={statusFilter === 'PENDING_REVIEW'} onClick={() => setStatusFilter('PENDING_REVIEW')} />
        <StatCard label="Inactive" value={counts.inactive} tone="muted" active={statusFilter === 'INACTIVE'} onClick={() => setStatusFilter('INACTIVE')} />
      </div>

      {inviteUrl && (
        <div className="mb-6 index-card p-4 flex items-center gap-3 animate-fade-in">
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

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or city…"
          className="field pl-9"
        />
      </div>

      {loadError && <p className="text-rose text-sm mb-3">{loadError}</p>}

      {profiles === null && !loadError && (
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

      {profiles && profiles.length > 0 && filteredProfiles?.length === 0 && (
        <div className="index-card p-10 text-center">
          <p className="font-display italic text-lg mb-1">No matches for this filter</p>
          <p className="text-sm text-ink/60">Try a different search term or status.</p>
        </div>
      )}

      {filteredProfiles && filteredProfiles.length > 0 && (
        <div className="index-card divide-y divide-line overflow-hidden animate-fade-in">
          {filteredProfiles.map((p) => <ProfileRow key={p.id} profile={p} />)}
        </div>
      )}
    </div>
  );
}
