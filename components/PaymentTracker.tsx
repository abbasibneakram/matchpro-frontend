'use client';
import { useState } from 'react';
import { api } from '@/lib/api';

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
  const [fee, setFee] = useState(String(feeAgreed ?? 0));
  const [paid, setPaid] = useState(String(amountPaid ?? 0));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const balance = Number(fee || 0) - Number(paid || 0);

  async function handleSave() {
    setError('');
    setSaving(true);
    try {
      const updated = await api.patch(`/profiles/${profileId}/payment`, {
        feeAgreed: Number(fee),
        amountPaid: Number(paid),
      });
      onUpdated(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="font-medium text-gray-700 mb-3">Payment</h2>
      <div className="grid grid-cols-3 gap-3 items-end">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Fee agreed</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded p-2"
            value={fee}
            onChange={(e) => setFee(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Amount paid</label>
          <input
            type="number"
            min="0"
            className="w-full border rounded p-2"
            value={paid}
            onChange={(e) => setPaid(e.target.value)}
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Balance</label>
          <div className={`p-2 rounded border font-medium ${balance > 0 ? 'text-orange-700 bg-orange-50' : 'text-green-700 bg-green-50'}`}>
            {balance.toFixed(2)}
          </div>
        </div>
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-3 text-sm border rounded px-4 py-2"
      >
        {saving ? 'Saving…' : 'Save payment'}
      </button>
    </div>
  );
}
