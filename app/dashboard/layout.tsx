'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { isLoggedIn, clearSession } from '@/lib/auth';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace('/login');
    } else {
      setReady(true);
    }
  }, [router]);

  function handleLogout() {
    clearSession();
    router.replace('/login');
  }

  if (!ready) return null; // avoid a flash of protected content before the redirect check runs

  return (
    <div>
      <header className="border-b bg-white px-6 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="font-medium">MatchPro</Link>
        <button onClick={handleLogout} className="text-sm text-gray-600 underline">
          Log out
        </button>
      </header>
      <main className="max-w-3xl mx-auto p-6">{children}</main>
    </div>
  );
}
