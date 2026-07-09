'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { saveSession } from '@/lib/auth';
import AuthShell from '@/components/AuthShell';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/signup', { name, email, password });
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
        <h1 className="text-lg font-medium mb-1">Create your account</h1>
        <p className="text-sm text-ink/60 mb-5">Set up your matchmaker workspace.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            placeholder="Full name"
            className="field"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
            placeholder="Password (min 8 characters)"
            className="field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          {error && <p className="text-rose text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full gap-1.5">
            {loading && <Loader2 size={15} className="animate-spin" />}
            {loading ? 'Creating account…' : 'Sign up'}
          </button>
        </form>
      </div>
      <p className="text-sm text-center mt-5 text-ink/70">
        Already have an account? <Link href="/login" className="btn-text">Log in</Link>
      </p>
    </AuthShell>
  );
}
