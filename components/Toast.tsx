'use client';
import { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

type ToastKind = 'success' | 'error';
type ToastItem = { id: number; kind: ToastKind; message: string };

const ToastContext = createContext<{
  success: (message: string) => void;
  error: (message: string) => void;
} | null>(null);

let nextId = 1;
const AUTO_DISMISS_MS = 3500;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, kind, message }]);
    setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ success: (m) => push('success', m), error: (m) => push('error', m) }}>
      {children}

      <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-50 flex flex-col gap-2 sm:w-full sm:max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`index-card flex items-start gap-2.5 p-3.5 pr-2.5 animate-toast-in border ${
              t.kind === 'error' ? 'border-rose/30' : 'border-teal/25'
            }`}
          >
            {t.kind === 'success' ? (
              <CheckCircle2 size={18} className="text-teal-dark shrink-0 mt-0.5" />
            ) : (
              <XCircle size={18} className="text-rose shrink-0 mt-0.5" />
            )}
            <p className="text-sm flex-1 pt-0.5">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-ink/30 hover:text-ink/60 shrink-0 p-1 transition-colors"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
