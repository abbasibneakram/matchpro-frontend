'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import ProfileCard from '@/components/ProfileCard';

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<any[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/profiles').then(setProfiles).catch((err) => setError(err.message));
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-medium">Profiles</h1>
        <Link href="/dashboard/new" className="bg-black text-white rounded px-4 py-2 text-sm">
          + Add profile
        </Link>
      </div>

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
