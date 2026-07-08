const toneStyles: Record<string, string> = {
  default: 'text-ink',
  teal: 'text-teal-dark',
  marigold: 'text-marigold',
  muted: 'text-ink/40',
};

export default function StatCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number;
  tone?: 'default' | 'teal' | 'marigold' | 'muted';
}) {
  return (
    <div className="index-card p-4">
      <p className="text-xs uppercase tracking-wide text-ink/50 mb-1">{label}</p>
      <p className={`num text-2xl font-medium ${toneStyles[tone]}`}>{value}</p>
    </div>
  );
}
