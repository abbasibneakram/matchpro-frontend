'use client';
import { useState } from 'react';
import { Wallet, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/components/Toast';

export default function PaymentTracker({
  profileId,
  feeAgreed,
  amountPaid,
  onUpdated,
}: {
  profileId: string;
  feeAgreed: number;
  amountPaid: number;
  onUpdated: (updated: { feeAgreed: number; amountPaid: number }) => void;
}) {
  const toast = useToast();
  const [fee, setFee] = useState(String(feeAgreed ?? 0));
  const [paid, setPaid] = useState(String(amountPaid ?? 0));
  const [saving, setSaving] = useState(false);

  const balance = Number(fee || 0) - Number(paid || 0);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await api.patch(`/profiles/${profileId}/payment`, {
        feeAgreed: Number(fee),
        amountPaid: Number(paid),
      });
      onUpdated(updated);
      toast.success('Payment updated');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-ink/50 mb-3">
        <Wallet size={13} strokeWidth={2} /> Payment
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:items-end">
        <div>
          <label className="text-xs text-ink/50 block mb-1">Fee agreed</label>
          <input
            type="number"
            min="0"
            className="field num"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-ink/50 block mb-1">Amount paid</label>
          <input
            type="number"
            min="0"
            className="field num"
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-ink/50 block mb-1">Balance</label>
          <div className={`num p-2 rounded-sm border font-medium ${balance > 0 ? 'text-marigold border-marigold-soft bg-marigold-soft/40' : 'text-teal-dark border-teal-soft bg-teal-soft'}`}>
            {balance.toFixed(2)}
          </div>
        </div>
      </div>

      <button onClick={handleSave} disabled={saving} className="btn-secondary mt-3 gap-1.5">
        {saving && <Loader2 size={14} className="animate-spin" />}
        {saving ? 'Saving…' : 'Save payment'}
      </button>
    </div>
  );
}
