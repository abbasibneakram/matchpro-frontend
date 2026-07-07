'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import ProfileCard from '@/components/ProfileCard';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">Profiles</h1>
        <div className="flex gap-2">
          <button
            onClick={handleGenerateInvite}
            disabled={inviteLoading}
            className="border rounded px-4 py-2 text-sm"
          >
            {inviteLoading ? 'Generating…' : 'Invite a client'}
          </button>
          <Link href="/dashboard/new" className="bg-black text-white rounded px-4 py-2 text-sm">
            + Add profile
          </Link>
        </div>
      </div>

      {inviteUrl && (
        <div className="mb-6 border rounded p-3 bg-white flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Share this link — it can be used once</p>
            <p className="text-sm truncate">{inviteUrl}</p>
          </div>
          <button onClick={handleCopy} className="text-sm border rounded px-3 py-1.5 shrink-0">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {profiles === null && !error && <p className="text-gray-500">Loading…</p>}
      {profiles?.length === 0 && (
        <p className="text-gray-500">No profiles yet — add your first one.</p>
      )}

      <div className="space-y-3">
        {profiles?.map((p) => <ProfileCard key={p.id} profile={p} />)}
      </div>
    </div>
  );
}
