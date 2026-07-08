'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import ProfileForm, { ProfileFormValues } from '@/components/ProfileForm';

type Status = 'checking' | 'valid' | 'invalid' | 'submitted';

export default function InvitePage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<Status>('checking');
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/public/invite/${token}`)
      .then((res) => setStatus(res.valid ? 'valid' : 'invalid'))
      .catch(() => setStatus('invalid'));
  }, [token]);

  async function handleSubmit(values: ProfileFormValues) {
    try {
      await api.post(`/public/invite/${token}`, values);
      setStatus('submitted');
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  }

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <p className="font-display italic text-2xl mb-1">MatchPro</p>
        <h1 className="text-lg font-medium mb-1">Fill in your profile</h1>
        <p className="text-sm text-ink/60 mb-6">
          Your matchmaker sent you this link so you can fill in your own details.
        </p>

        {status === 'checking' && <p className="text-ink/50">Checking link…</p>}

        {status === 'invalid' && (
          <div className="index-card p-6">
            <p className="text-rose">
              This link is invalid or has already been used. Please ask your matchmaker for a new one.
            </p>
          </div>
        )}

        {status === 'valid' && (
          <div className="index-card p-6">
            {error && <p className="text-rose text-sm mb-3">{error}</p>}
            <ProfileForm onSubmit={handleSubmit} submitLabel="Submit my profile" />
          </div>
        )}

        {status === 'submitted' && (
          <div className="index-card p-6">
            <p className="text-teal-dark">
              Thanks — your profile has been submitted. Your matchmaker will review it shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
