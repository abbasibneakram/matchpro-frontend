'use client';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import ProfileForm, { ProfileFormValues } from '@/components/ProfileForm';

export default function NewProfilePage() {
  const router = useRouter();

  async function handleSubmit(values: ProfileFormValues) {
    await api.post('/profiles', values);
    router.push('/dashboard');
  }

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">Add profile</h1>
      {/* Manual entry only for now — pasting text and letting AI fill this
          form in is Module 3, wired into this same ProfileForm component. */}
      <ProfileForm onSubmit={handleSubmit} submitLabel="Add profile" />
    </div>
  );
}
