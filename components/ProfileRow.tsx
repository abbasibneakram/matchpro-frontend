import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const statusStyles: Record<string, string> = {
  PENDING_REVIEW: 'bg-marigold-soft text-marigold',
  ACTIVE: 'bg-teal-soft text-teal-dark',
  INACTIVE: 'bg-line/50 text-ink/50',
};

const statusLabels: Record<string, string> = {
  PENDING_REVIEW: 'Pending review',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
};

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

// Genders get distinct avatar tints — a quick visual sort cue when scanning
// a long list, without needing a column header to explain it.
const genderTint: Record<string, string> = {
  MALE: 'bg-teal-soft text-teal-dark',
  FEMALE: 'bg-rose-soft text-rose',
};

export default function ProfileRow({ profile }: { profile: any }) {
  return (
    <Link
      href={`/dashboard/${profile.id}`}
      className="flex items-center gap-3 px-4 py-3.5 hover:bg-paper transition-colors group"
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${genderTint[profile.gender]}`}>
        {initials(profile.name)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{profile.name}</p>
        <p className="text-sm text-ink/60 truncate">
          <span className="num">{profile.age}</span> yrs · {profile.gender === 'MALE' ? 'Male' : 'Female'}
          {profile.city ? ` · ${profile.city}` : ''}
        </p>
      </div>

      <span className={`badge shrink-0 ${statusStyles[profile.status]}`}>
        {statusLabels[profile.status]}
      </span>

      <ChevronRight size={16} className="text-ink/25 shrink-0 group-hover:text-ink/50 transition-colors" />
    </Link>
  );
}
