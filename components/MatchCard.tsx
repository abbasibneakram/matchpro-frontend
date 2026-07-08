'use client';
import Link from 'next/link';
import { useState } from 'react';

const STATUS_LABELS: Record<string, string> = {
  SUGGESTED: 'Shared',
  INTERESTED: 'Interested',
  MEETING_SCHEDULED: 'Meeting scheduled',
  REJECTED: 'Rejected',
  MARRIED: 'Married',
};

const STATUS_OPTIONS = ['INTERESTED', 'MEETING_SCHEDULED', 'REJECTED', 'MARRIED'];

function scoreColor(score: number) {
  if (score >= 70) return 'bg-green-100 text-green-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-600';
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
    <div className="border rounded p-4 bg-white">
      <div className="flex items-center justify-between">
        <Link href={`/dashboard/${profile.id}`} className="min-w-0">
          <p className="font-medium">{profile.name}</p>
          <p className="text-sm text-gray-500">
            {profile.age} yrs{profile.city ? ` · ${profile.city}` : ''}
            {profile.education ? ` · ${profile.education}` : ''}
          </p>
        </Link>
        <span className={`text-sm font-medium px-2.5 py-1 rounded shrink-0 ml-3 ${scoreColor(score)}`}>
          {score}% match
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t">
        <button
          onClick={handleShare}
          disabled={sharing}
          className="text-sm border rounded px-3 py-1.5"
        >
          {sharing ? 'Sharing…' : matchId ? 'Share again' : 'Share on WhatsApp'}
        </button>

        {matchId && (
          <select
            value={status ?? 'SUGGESTED'}
            onChange={(e) => onStatusChange(matchId, e.target.value)}
            className="text-sm border rounded px-2 py-1.5"
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
