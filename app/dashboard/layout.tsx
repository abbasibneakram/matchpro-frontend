'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Users, CreditCard, Settings, LogOut } from 'lucide-react';
import { isLoggedIn, clearSession, getMatchmaker } from '@/lib/auth';

function initials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [matchmaker, setMatchmaker] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
    } else {
      setMatchmaker(getMatchmaker());
      setReady(true);
    }
  }, [router]);

  function handleLogout() {
    clearSession();
    router.replace('/login');
  }

  if (!ready) return null;

  const isProfilesSection = pathname?.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="w-60 shrink-0 border-r border-line bg-white flex flex-col justify-between h-screen sticky top-0">
        <div>
          <div className="px-5 py-5 border-b border-line">
            <p className="font-display italic text-xl text-ink">MatchPro</p>
          </div>

          <nav className="p-3 space-y-1">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isProfilesSection ? 'bg-teal-soft text-teal-dark' : 'text-ink/70 hover:bg-paper'
              }`}
            >
              <Users size={17} strokeWidth={2} />
              Profiles
            </Link>

            {/* Not built yet — shown as a roadmap signal, not a dead end. */}
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-ink/30 cursor-not-allowed">
              <CreditCard size={17} strokeWidth={2} />
              Billing
              <span className="ml-auto text-[10px] uppercase tracking-wide bg-line/60 text-ink/40 px-1.5 py-0.5 rounded">
                Soon
              </span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-ink/30 cursor-not-allowed">
              <Settings size={17} strokeWidth={2} />
              Settings
              <span className="ml-auto text-[10px] uppercase tracking-wide bg-line/60 text-ink/40 px-1.5 py-0.5 rounded">
                Soon
              </span>
            </div>
          </nav>
        </div>

        <div className="p-3 border-t border-line">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-teal text-paper flex items-center justify-center text-xs font-medium shrink-0 num">
              {matchmaker ? initials(matchmaker.name) : '—'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{matchmaker?.name ?? 'Matchmaker'}</p>
              <p className="text-xs text-ink/50 truncate">{matchmaker?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 mt-1 rounded-md text-sm text-ink/60 hover:bg-paper hover:text-ink transition-colors"
          >
            <LogOut size={16} strokeWidth={2} />
            Log out
          </button>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
