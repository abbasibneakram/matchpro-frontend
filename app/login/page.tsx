'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import AuthShell from '@/components/AuthShell';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/login', { email, password });
      saveSession(data.accessToken, data.matchmaker);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell>
      <div className="index-card p-6">
        <h1 className="text-lg font-medium mb-1">Welcome back</h1>
        <p className="text-sm text-ink/60 mb-5">Log in to your matchmaker account.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-rose text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full gap-1.5">
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>
      </div>
      <p className="text-sm text-center mt-5 text-ink/70">
        No account? <Link href="/signup" className="btn-text">Sign up</Link>
      </p>
    </AuthShell>
  );
}
