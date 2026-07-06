import Link from 'next/link';

const statusColor: Record<string, string> = {
  PENDING_REVIEW: 'bg-yellow-100 text-yellow-800',
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-600',
};

export default function ProfileCard({ profile }: { profile: any }) {
  return (
    <Link
      href={`/dashboard/${profile.id}`}
      className="block border rounded p-4 bg-white hover:shadow transition-shadow"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{profile.name}</p>
          <p className="text-sm text-gray-500">
            {profile.age} yrs · {profile.gender === 'MALE' ? 'Male' : 'Female'}
            {profile.city ? ` · ${profile.city}` : ''}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${statusColor[profile.status]}`}>
          {profile.status.replace('_', ' ')}
        </span>
      </div>
    </Link>
  );
}
