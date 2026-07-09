'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Users, CreditCard, Settings, LogOut, Menu, X } from 'lucide-react';
import { isLoggedIn, clearSession, getMatchmaker } from '@/lib/auth';

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);
  const [matchmaker, setMatchmaker] = useState<{ name: string; email: string } | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
    } else {
      setMatchmaker(getMatchmaker());
      setReady(true);
    }
  }, [router]);

  // Close the mobile drawer automatically whenever the route changes, so it
  // never stays open after tapping a link.
  useEffect(() => {
    setMobileNavOpen(false);
  }, [pathname]);

  function handleLogout() {
    clearSession();
    router.replace('/login');
  }

  if (!ready) return null;

  const navContent = (
    <>
      <div>
        <div className="px-5 py-5 border-b border-line flex items-center justify-between">
          <p className="font-display italic text-xl text-ink">MatchPro</p>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden text-ink/50 hover:text-ink p-1"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          <Link
            href="/dashboard"
            className="relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors bg-teal-soft text-teal-dark"
          >
            <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 bg-teal rounded-full" />
            <Users size={17} strokeWidth={2} />
            Profiles
          </Link>

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
    </>
  );

  return (
    <div className="min-h-screen flex bg-paper">
      {/* Desktop: persistent sidebar */}
      <aside className="hidden md:flex w-60 shrink-0 border-r border-line bg-white flex-col justify-between h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile: top bar with hamburger */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 flex items-center justify-between px-4 py-3 border-b border-line bg-white">
        <p className="font-display italic text-lg text-ink">MatchPro</p>
        <button onClick={() => setMobileNavOpen(true)} className="text-ink/60 p-1" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile: slide-in drawer + backdrop */}
      <div
        className={`md:hidden fixed inset-0 bg-ink/30 z-40 transition-opacity ${
          mobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileNavOpen(false)}
      />
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col justify-between shadow-xl transition-transform duration-200 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent}
      </aside>

      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div key={pathname} className="max-w-4xl mx-auto px-4 py-6 md:px-8 md:py-8 animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
