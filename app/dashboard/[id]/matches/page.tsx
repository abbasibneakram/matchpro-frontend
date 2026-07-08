'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import MatchCard, { MatchData } from '@/components/MatchCard';

export default function MatchesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [matches, setMatches] = useState<MatchData[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
  }, [id]);

  function loadMatches() {
    api.get(`/profiles/${id}/matches`).then(setMatches).catch((err) => setError(err.message));
  }

  async function handleShare(targetId: string) {
    setError('');
    try {
      const { shareUrl, matchId, status } = await api.post(`/profiles/${id}/matches/${targetId}/share`, {});
      window.open(shareUrl, '_blank');
      // Update local state so the button flips to "Share again" and the
      // status dropdown appears, without a full reload.
      setMatches((prev) =>
        prev?.map((m) => (m.profile.id === targetId ? { ...m, matchId, status } : m)) ?? null,
      );
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleStatusChange(matchId: string, status: string) {
    setError('');
    try {
      await api.patch(`/matches/${matchId}/status`, { status });
      setMatches((prev) =>
        prev?.map((m) => (m.matchId === matchId ? { ...m, status } : m)) ?? null,
      );
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div>
      <button onClick={() => router.push(`/dashboard/${id}`)} className="text-sm text-gray-500 underline mb-4">
        ← Back to profile
      </button>
      <h1 className="text-xl font-medium mb-1">Matches</h1>
      <p className="text-sm text-gray-500 mb-6">
        Ranked by mutual fit — both sides' preferences are weighed, not just one.
      </p>

      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      {matches === null && !error && <p className="text-gray-500">Finding matches…</p>}
      {matches?.length === 0 && (
        <p className="text-gray-500">
          No matches yet. This can mean there's no fit in the active pool right now, or that
          preference fields aren't filled in on one or both sides.
        </p>
      )}

      <div className="space-y-3">
        {matches?.map((m) => (
          <MatchCard
            key={m.profile.id}
            match={m}
            onShare={handleShare}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>
    </div>
  );
}
