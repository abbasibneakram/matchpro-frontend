const toneStyles: Record<string, string> = {
  default: 'text-ink',
  teal: 'text-teal-dark',
  marigold: 'text-marigold',
  muted: 'text-ink/40',
};

const activeRing: Record<string, string> = {
  default: 'ring-2 ring-ink/20',
  teal: 'ring-2 ring-teal/40',
  marigold: 'ring-2 ring-marigold/40',
  muted: 'ring-2 ring-ink/15',
};

export default function StatCard({
  label,
  value,
  tone = 'default',
  active = false,
  onClick,
}: {
  label: string;
  value: number;
  tone?: 'default' | 'teal' | 'marigold' | 'muted';
  active?: boolean;
  onClick?: () => void;
}) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`index-card p-4 text-left w-full transition-all ${onClick ? 'hover:-translate-y-0.5 cursor-pointer' : ''} ${active ? activeRing[tone] : ''}`}
    >
      <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">{label}</p>
      <p className={`num text-2xl font-medium ${toneStyles[tone]}`}>{value}</p>
    </Tag>
  );
}
