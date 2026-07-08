'use client';
import Link from 'next/link';
import { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  SUGGESTED: 'Shared',
  INTERESTED: 'Interested',
  MEETING_SCHEDULED: 'Meeting scheduled',
  REJECTED: 'Rejected',
  MARRIED: 'Married',
};

const STATUS_OPTIONS = ['INTERESTED', 'MEETING_SCHEDULED', 'REJECTED', 'MARRIED'];

function scoreStyle(score: number) {
  if (score >= 70) return 'bg-teal-soft text-teal-dark';
  if (score >= 40) return 'bg-marigold-soft text-marigold';
  return 'bg-line/50 text-ink/50';
}

export type MatchData = {
  profile: any;
  score: number;
  matchId: string | null;
  status: string | null;
};

export default function MatchCard({
  match,
  onShare,
  onStatusChange,
}: {
  match: MatchData;
  onShare: (targetId: string) => Promise<void>;
  onStatusChange: (matchId: string, status: string) => Promise<void>;
}) {
  const { profile, score, matchId, status } = match;
  const [sharing, setSharing] = useState(false);

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    setSharing(true);
    try {
      await onShare(profile.id);
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="index-card p-4">
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/${profile.id}`} className="min-w-0 hover:underline">
          <p className="font-medium">{profile.name}</p>
          <p className="text-sm text-ink/60">
            <span className="num">{profile.age}</span> yrs{profile.city ? ` · ${profile.city}` : ''}
            {profile.education ? ` · ${profile.education}` : ''}
          </p>
        </Link>
        <span className={`badge num shrink-0 ml-3 ${scoreStyle(score)}`}>
          {score}% match
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-line">
        <button onClick={handleShare} disabled={sharing} className="btn-secondary py-1.5 gap-1.5">
          <MessageCircle size={15} strokeWidth={2} />
          {sharing ? 'Sharing…' : matchId ? 'Share again' : 'Share on WhatsApp'}
        </button>

        {matchId && (
          <select
            value={status ?? 'SUGGESTED'}
            onChange={(e) => onStatusChange(matchId, e.target.value)}
            className="field w-auto py-1.5"
          >
            <option value="SUGGESTED" disabled>{STATUS_LABELS.SUGGESTED}</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}
