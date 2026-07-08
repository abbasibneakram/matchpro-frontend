'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Sparkles } from 'lucide-react';
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
      <button onClick={() => router.push(`/dashboard/${id}`)} className="btn-text mb-4 inline-flex items-center gap-1">
        <ArrowLeft size={14} /> Back to profile
      </button>
      <h1 className="text-2xl font-display italic mb-1">Matches</h1>
      <p className="text-sm text-ink/60 mb-6">
        Ranked by mutual fit — both sides' preferences are weighed, not just one.
      </p>

      {error && <p className="text-rose text-sm mb-3">{error}</p>}

      {matches === null && !error && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="index-card p-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="h-3.5 w-32 bg-line/60 rounded" />
                  <div className="h-3 w-44 bg-line/40 rounded" />
                </div>
                <div className="h-6 w-20 bg-line/40 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {matches?.length === 0 && (
        <div className="index-card p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-marigold-soft text-marigold flex items-center justify-center mx-auto mb-3">
            <Sparkles size={20} strokeWidth={2} />
          </div>
          <p className="font-display italic text-lg mb-1">No matches yet</p>
          <p className="text-sm text-ink/60 max-w-sm mx-auto">
            This can mean there's no fit in the active pool right now, or that preference
            fields aren't filled in on one or both sides.
          </p>
        </div>
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
