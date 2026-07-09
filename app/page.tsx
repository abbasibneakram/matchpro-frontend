'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles, ShieldCheck, MessageCircle, Link2, Wallet, UserPlus, Heart,
} from 'lucide-react';
import { isLoggedIn } from '@/lib/auth';

const features = [
  { icon: Sparkles, title: 'AI profile extraction', body: "Paste a bio-data message and AI fills in the profile for you to review — nothing gets saved without your check." },
  { icon: Heart, title: 'Two-way matching', body: "Every match weighs both sides' stated preferences, not just one — a real fit, not a one-way wishlist." },
  { icon: ShieldCheck, title: 'Private by default', body: 'Photos are never public. Every view is a short-lived signed link, shown only to you.' },
  { icon: MessageCircle, title: 'Share to WhatsApp', body: 'Send a match straight to WhatsApp in one tap — no photos in the share, full details stay in MatchPro.' },
  { icon: Link2, title: 'Client self-fill links', body: 'Send a one-time link so a client fills their own profile — no account needed on their end.' },
  { icon: Wallet, title: 'Payment tracking', body: 'Track fee agreed, amount paid, and balance per profile, right alongside the match itself.' },
];

const steps = [
  { icon: UserPlus, title: 'Add a profile', body: 'Paste a bio-data message or fill it manually — or send a client a link to fill their own.' },
  { icon: Sparkles, title: 'Find matches', body: 'MatchPro ranks candidates by mutual fit across age, city, education, and family preferences.' },
  { icon: MessageCircle, title: 'Share & track', body: 'Send a match to WhatsApp and track its status from Interested through to Married.' },
];

export default function LandingPage() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <div>
      <nav className="sticky top-0 z-30 bg-paper/90 backdrop-blur border-b border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          <p className="font-display italic text-xl">MatchPro</p>
          <div className="flex items-center gap-2">
            {loggedIn ? (
              <Link href="/dashboard" className="btn-primary">Go to dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="btn-text px-2">Sign in</Link>
                <Link href="/signup" className="btn-primary">Get started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 pt-16 pb-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display italic text-4xl sm:text-5xl leading-tight mb-5">
            Run your matchmaking practice like software, not spreadsheets.
          </h1>
          <p className="text-ink/70 text-lg mb-7">
            MatchPro helps professional matchmakers manage profiles, find two-way matches, and
            share them — without juggling WhatsApp, Excel, and paper files separately.
          </p>
          <div className="flex items-center gap-4">
            <Link href={loggedIn ? '/dashboard' : '/signup'} className="btn-primary text-base px-5 py-2.5">
              {loggedIn ? 'Go to dashboard' : 'Get started free'}
            </Link>
            {!loggedIn && <Link href="/login" className="btn-text">Sign in</Link>}
          </div>
        </div>

        {/* In-product mockup, built from the app's own components — not stock photography */}
        <div className="index-card p-5 rotate-1">
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-line">
            <div className="w-10 h-10 rounded-full bg-rose-soft text-rose flex items-center justify-center text-sm font-medium">AK</div>
            <div>
              <p className="font-medium">Aisha Khan</p>
              <p className="text-xs text-ink/60"><span className="num">27</span> yrs · Lahore · MBA</p>
            </div>
            <span className="badge bg-teal-soft text-teal-dark ml-auto">Active</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-soft text-teal-dark flex items-center justify-center text-sm font-medium">HR</div>
              <div>
                <p className="font-medium">Hamza Raza</p>
                <p className="text-xs text-ink/60"><span className="num">29</span> yrs · Lahore · Engineer</p>
              </div>
            </div>
            <span className="badge bg-teal-soft text-teal-dark">88% match</span>
          </div>
          <div className="flex gap-2 pt-3 border-t border-line">
            <span className="btn-secondary py-1.5 text-xs gap-1.5 pointer-events-none">
              <MessageCircle size={13} /> Shared on WhatsApp
            </span>
            <span className="badge bg-marigold-soft text-marigold">Meeting scheduled</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16 border-t border-line">
        <h2 className="font-display italic text-2xl sm:text-3xl mb-10 text-center">How it works</h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <div key={s.title} className="text-center">
              <div className="w-11 h-11 rounded-full bg-teal-soft text-teal-dark flex items-center justify-center mx-auto mb-3">
                <s.icon size={20} strokeWidth={2} />
              </div>
              <p className="text-xs text-ink/40 mb-1 num">Step {i + 1}</p>
              <p className="font-medium mb-1">{s.title}</p>
              <p className="text-sm text-ink/60">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-16 border-t border-line">
        <h2 className="font-display italic text-2xl sm:text-3xl mb-10 text-center">
          Everything a matchmaker needs, in one place
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div key={f.title} className="index-card p-5">
              <div className="w-9 h-9 rounded-full bg-marigold-soft text-marigold flex items-center justify-center mb-3">
                <f.icon size={17} strokeWidth={2} />
              </div>
              <p className="font-medium mb-1">{f.title}</p>
              <p className="text-sm text-ink/60">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy / trust */}
      <section className="bg-teal-dark text-paper">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-display italic text-3xl mb-4">Privacy isn't a setting. It's how photos work.</h2>
            <p className="text-paper/75">
              Every photo lives in private storage. There's no public URL to leak, share, or
              accidentally expose — just short-lived signed links, generated fresh each time,
              only for the matchmaker who owns that profile.
            </p>
          </div>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <ShieldCheck size={19} strokeWidth={2} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Private by default</p>
                <p className="text-sm text-paper/70">No public bucket, no public URL — ever.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck size={19} strokeWidth={2} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Links expire in minutes</p>
                <p className="text-sm text-paper/70">A leaked link goes stale fast, on its own.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck size={19} strokeWidth={2} className="mt-0.5 shrink-0" />
              <div>
                <p className="font-medium">Ownership checked, every time</p>
                <p className="text-sm text-paper/70">No shortcuts — every request is verified.</p>
              </div>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA band */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 py-20 text-center">
        <h2 className="font-display italic text-3xl mb-4">Ready to run your practice on MatchPro?</h2>
        <p className="text-ink/60 mb-7">Free to start. No credit card required.</p>
        <Link href={loggedIn ? '/dashboard' : '/signup'} className="btn-primary text-base px-6 py-3">
          {loggedIn ? 'Go to dashboard' : 'Get started free'}
        </Link>
      </section>

      <footer className="border-t border-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-display italic text-lg">MatchPro</p>
          <p className="text-xs text-ink/50">© 2026 MatchPro. Built for professional matchmakers.</p>
        </div>
      </footer>
    </div>
  );
}
