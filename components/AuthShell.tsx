import { Sparkles, ShieldCheck, MessageCircle } from 'lucide-react';

// A subtle tiled "linked rings" motif — two overlapping circles, echoing the
// idea of a match — kept faint enough to read as texture, not decoration.
function RingsPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <pattern id="rings" width="64" height="64" patternUnits="userSpaceOnUse">
          <circle cx="22" cy="22" r="11" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.16" />
          <circle cx="36" cy="22" r="11" fill="none" stroke="currentColor" strokeWidth="1.25" opacity="0.16" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rings)" />
    </svg>
  );
}

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      {/* Branding panel — hidden below lg, since the form is what matters on mobile */}
      <div className="hidden lg:flex lg:w-[42%] relative bg-teal-dark text-paper flex-col justify-between p-10 overflow-hidden">
        <div className="absolute inset-0 text-paper"><RingsPattern /></div>

        <p className="relative font-display italic text-3xl">MatchPro</p>

        <div className="relative space-y-7 max-w-sm">
          <h2 className="font-display italic text-3xl leading-snug">
            Software built for professional matchmakers.
          </h2>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Sparkles size={18} className="mt-0.5 shrink-0" strokeWidth={2} />
              <span className="text-sm text-paper/85">AI reads a pasted bio-data and fills the profile for you.</span>
            </li>
            <li className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0" strokeWidth={2} />
              <span className="text-sm text-paper/85">Photos stay private — signed links only, never public.</span>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle size={18} className="mt-0.5 shrink-0" strokeWidth={2} />
              <span className="text-sm text-paper/85">Share a match straight to WhatsApp in one tap.</span>
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-paper/50">Built for the way matchmaking bureaus actually work.</p>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12 bg-paper">
        <div className="w-full max-w-sm">
          <p className="font-display italic text-2xl text-center mb-8 lg:hidden">MatchPro</p>
          {children}
        </div>
      </div>
    </div>
  );
}
