'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ProfileForm, { ProfileFormValues } from '@/components/ProfileForm';

export default function NewProfilePage() {
  const router = useRouter();
  const [rawText, setRawText] = useState('');
  const [extracted, setExtracted] = useState<Partial<ProfileFormValues> | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'choose' | 'paste' | 'form'>('choose');

  async function handleExtract() {
    setError('');
    setExtracting(true);
    try {
      const data = await api.post('/profiles/extract', { rawText });
      setExtracted(data);
      setMode('form');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setExtracting(false);
    }
  }

  async function handleSubmit(values: ProfileFormValues) {
    await api.post('/profiles', values);
    router.push('/dashboard');
  }

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">Add profile</h1>

      {mode === 'choose' && (
        <div className="flex gap-3">
          <button
            onClick={() => setMode('paste')}
            className="border rounded p-4 flex-1 text-left hover:shadow"
          >
            <p className="font-medium">Paste profile text</p>
            <p className="text-sm text-gray-500">AI fills the form for you to review</p>
          </button>
          <button
            onClick={() => { setExtracted(null); setMode('form'); }}
            className="border rounded p-4 flex-1 text-left hover:shadow"
          >
            <p className="font-medium">Enter manually</p>
            <p className="text-sm text-gray-500">Fill every field yourself</p>
          </button>
        </div>
      )}

      {mode === 'paste' && (
        <div>
          <textarea
            className="w-full border rounded p-3 h-48"
            placeholder="Paste the profile text here (e.g. from a WhatsApp message or bio-data)..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleExtract}
              disabled={extracting || rawText.trim().length < 20}
              className="bg-black text-white rounded px-4 py-2"
            >
              {extracting ? 'Extracting…' : 'Extract with AI'}
            </button>
            <button onClick={() => setMode('choose')} className="text-sm text-gray-500 underline">
              Back
            </button>
          </div>
        </div>
      )}

      {mode === 'form' && (
        <div>
          {extracted && (
            <p className="text-sm text-gray-500 mb-4">
              Review what the AI found below — fix anything that's wrong or missing before saving.
            </p>
          )}
          <ProfileForm
            initial={extracted ?? undefined}
            onSubmit={handleSubmit}
            submitLabel="Add profile"
          />
        </div>
      )}
    </div>
  );
}
