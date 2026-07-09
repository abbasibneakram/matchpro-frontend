'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, PenLine } from 'lucide-react';
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
      <h1 className="text-2xl font-display italic mb-6">Add profile</h1>

      {mode === 'choose' && (
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setMode('paste')}
            className="index-card p-5 flex-1 text-left hover:-translate-y-0.5 transition-transform"
          >
            <div className="w-9 h-9 rounded-full bg-teal-soft text-teal-dark flex items-center justify-center mb-3">
              <FileText size={17} strokeWidth={2} />
            </div>
            <p className="font-medium">Paste profile text</p>
            <p className="text-sm text-ink/60 mt-0.5">AI fills the form for you to review</p>
          </button>
          <button
            onClick={() => { setExtracted(null); setMode('form'); }}
            className="index-card p-5 flex-1 text-left hover:-translate-y-0.5 transition-transform"
          >
            <div className="w-9 h-9 rounded-full bg-marigold-soft text-marigold flex items-center justify-center mb-3">
              <PenLine size={17} strokeWidth={2} />
            </div>
            <p className="font-medium">Enter manually</p>
            <p className="text-sm text-ink/60 mt-0.5">Fill every field yourself</p>
          </button>
        </div>
      )}

      {mode === 'paste' && (
        <div className="index-card p-6">
          <textarea
            className="field w-full h-48"
            placeholder="Paste the profile text here (e.g. from a WhatsApp message or bio-data)..."
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
          />
          {error && <p className="text-rose text-sm mt-2">{error}</p>}
          <div className="flex gap-3 mt-3">
            <button
              onClick={handleExtract}
              disabled={extracting || rawText.trim().length < 20}
              className="btn-primary"
            >
              {extracting ? 'Extracting…' : 'Extract with AI'}
            </button>
            <button onClick={() => setMode('choose')} className="btn-text">Back</button>
          </div>
        </div>
      )}

      {mode === 'form' && (
        <div className="index-card p-6">
          {extracted && (
            <p className="text-sm text-ink/60 mb-4">
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
