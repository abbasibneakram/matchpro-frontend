'use client';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export type ProfileFormValues = {
  gender: 'MALE' | 'FEMALE';
  name: string;
  age: number | '';
  education?: string;
  profession?: string;
  city?: string;
  religion?: string;
  sect?: string;
  caste?: string;
  familyDetails?: string;
  prefAgeMin?: number | '';
  prefAgeMax?: number | '';
  prefEducation?: string;
  prefCity?: string;
  prefReligion?: string;
  prefSect?: string;
  prefCaste?: string;
  rawPastedText?: string; // set when this profile came from Module 3's AI extraction
};

const emptyValues: ProfileFormValues = {
  gender: 'MALE',
  name: '',
  age: '',
};

export default function ProfileForm({
  initial,
  onSubmit,
  submitLabel = 'Save profile',
}: {
  initial?: Partial<ProfileFormValues>;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<ProfileFormValues>({ ...emptyValues, ...initial });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function field(key: keyof ProfileFormValues) {
    return {
      value: (values[key] as string | number) ?? '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setValues((v) => ({ ...v, [key]: e.target.value })),
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await onSubmit({
        ...values,
        age: Number(values.age),
        prefAgeMin: values.prefAgeMin ? Number(values.prefAgeMin) : undefined,
        prefAgeMax: values.prefAgeMax ? Number(values.prefAgeMax) : undefined,
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-ink/50">Profile details</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select className="field" {...field('gender')}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <input className="field" placeholder="Name" required {...field('name')} />
          <input className="field" type="number" placeholder="Age" required {...field('age')} />
          <input className="field" placeholder="City" {...field('city')} />
          <input className="field" placeholder="Education" {...field('education')} />
          <input className="field" placeholder="Profession" {...field('profession')} />
          <input className="field" placeholder="Religion" {...field('religion')} />
          <input className="field" placeholder="Sect" {...field('sect')} />
          <input className="field" placeholder="Caste" {...field('caste')} />
        </div>
        <textarea
          className="field w-full"
          placeholder="Family details"
          {...field('familyDetails')}
        />
      </section>

      <section className="space-y-3">
        <p className="text-xs uppercase tracking-wide text-ink/50">Looking for</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input className="field" type="number" placeholder="Min age" {...field('prefAgeMin')} />
          <input className="field" type="number" placeholder="Max age" {...field('prefAgeMax')} />
          <input className="field" placeholder="Preferred city" {...field('prefCity')} />
          <input className="field" placeholder="Preferred education" {...field('prefEducation')} />
          <input className="field" placeholder="Preferred religion" {...field('prefReligion')} />
          <input className="field" placeholder="Preferred sect" {...field('prefSect')} />
          <input className="field" placeholder="Preferred caste" {...field('prefCaste')} />
        </div>
      </section>

      {error && <p className="text-rose text-sm">{error}</p>}
      <button disabled={saving} className="btn-primary gap-1.5">
        {saving && <Loader2 size={15} className="animate-spin" />}
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
