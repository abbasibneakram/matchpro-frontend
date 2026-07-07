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
      throw err; // lets ProfileForm show the error inline and re-enable the button
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 mt-12">
      <h1 className="text-xl font-medium mb-1">Fill in your profile</h1>
      <p className="text-sm text-gray-500 mb-6">
        Your matchmaker sent you this link so you can fill in your own details.
      </p>

      {status === 'checking' && <p className="text-gray-500">Checking link…</p>}

      {status === 'invalid' && (
        <p className="text-red-600">
          This link is invalid or has already been used. Please ask your matchmaker for a new one.
        </p>
      )}

      {status === 'valid' && (
        <>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <ProfileForm onSubmit={handleSubmit} submitLabel="Submit my profile" />
        </>
      )}

      {status === 'submitted' && (
        <p className="text-green-700">
          Thanks — your profile has been submitted. Your matchmaker will review it shortly.
        </p>
      )}
    </div>
  );
}
