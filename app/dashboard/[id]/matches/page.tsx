'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import MatchCard from '@/components/MatchCard';

export default function MatchesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [matches, setMatches] = useState<any[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/profiles/${id}/matches`).then(setMatches).catch((err) => setError(err.message));
  }, [id]);

  return (
    <div>
      <button onClick={() => router.push(`/dashboard/${id}`)} className="text-sm text-gray-500 underline mb-4">
        ← Back to profile
      </button>
      <h1 className="text-xl font-medium mb-1">Matches</h1>
      <p className="text-sm text-gray-500 mb-6">
        Ranked by mutual fit — both sides' preferences are weighed, not just one.
      </p>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      {matches === null && !error && <p className="text-gray-500">Finding matches…</p>}
      {matches?.length === 0 && (
        <p className="text-gray-500">
          No matches yet. This can mean there's no fit in the active pool right now, or that
          preference fields aren't filled in on one or both sides.
        </p>
      )}

      <div className="space-y-3">
        {matches?.map((m) => <MatchCard key={m.profile.id} match={m} />)}
      </div>
    </div>
  );
}
