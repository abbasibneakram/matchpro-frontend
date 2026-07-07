import Link from 'next/link';

function scoreColor(score: number) {
  if (score >= 70) return 'bg-green-100 text-green-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-gray-100 text-gray-600';
}

export default function MatchCard({ match }: { match: { profile: any; score: number } }) {
  const { profile, score } = match;
  return (
    <Link
      href={`/dashboard/${profile.id}`}
      className="flex items-center justify-between border rounded p-4 bg-white hover:shadow transition-shadow"
    >
      <div>
        <p className="font-medium">{profile.name}</p>
        <p className="text-sm text-gray-500">
          {profile.age} yrs{profile.city ? ` · ${profile.city}` : ''}
          {profile.education ? ` · ${profile.education}` : ''}
        </p>
      </div>
      <span className={`text-sm font-medium px-2.5 py-1 rounded ${scoreColor(score)}`}>
        {score}% match
      </span>
    </Link>
  );
}
