'use client';
import { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-3">
        <h2 className="font-medium text-gray-700">Profile details</h2>
        <div className="grid grid-cols-2 gap-3">
          <select className="border rounded p-2" {...field('gender')}>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <input className="border rounded p-2" placeholder="Name" required {...field('name')} />
          <input className="border rounded p-2" type="number" placeholder="Age" required {...field('age')} />
          <input className="border rounded p-2" placeholder="City" {...field('city')} />
          <input className="border rounded p-2" placeholder="Education" {...field('education')} />
          <input className="border rounded p-2" placeholder="Profession" {...field('profession')} />
          <input className="border rounded p-2" placeholder="Religion" {...field('religion')} />
          <input className="border rounded p-2" placeholder="Sect" {...field('sect')} />
          <input className="border rounded p-2" placeholder="Caste" {...field('caste')} />
        </div>
        <textarea
          className="w-full border rounded p-2"
          placeholder="Family details"
          {...field('familyDetails')}
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-medium text-gray-700">Looking for (used by matching later)</h2>
        <div className="grid grid-cols-2 gap-3">
          <input className="border rounded p-2" type="number" placeholder="Min age" {...field('prefAgeMin')} />
          <input className="border rounded p-2" type="number" placeholder="Max age" {...field('prefAgeMax')} />
          <input className="border rounded p-2" placeholder="Preferred city" {...field('prefCity')} />
          <input className="border rounded p-2" placeholder="Preferred education" {...field('prefEducation')} />
          <input className="border rounded p-2" placeholder="Preferred religion" {...field('prefReligion')} />
          <input className="border rounded p-2" placeholder="Preferred sect" {...field('prefSect')} />
          <input className="border rounded p-2" placeholder="Preferred caste" {...field('prefCaste')} />
        </div>
      </section>

      {error && <p className="text-red-600 text-sm">{error}</p>}
      <button disabled={saving} className="bg-black text-white rounded px-4 py-2">
        {saving ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
