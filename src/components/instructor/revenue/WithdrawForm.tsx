'use client'

import React, { useState } from 'react';
import { TotalRevenueIcon } from '@/components/instructor/revenue/RevenueIcons';   
import { FiUpload } from "react-icons/fi";
import { useWithDrawApiMutation } from '@/lib/redux/features/bank/bankApi';
import { useToast } from '@/hooks/use-toast';

interface WithdrawFormProps {
  totalRevenue: string;
  maxWithdrawAmount: number;
  onSuccess?: () => void;
}

export const WithdrawForm: React.FC<WithdrawFormProps> = ({ totalRevenue, maxWithdrawAmount, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [withdraw, { isLoading }] = useWithDrawApiMutation();
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!amount) {
      toast({ title: 'Missing amount', description: 'Please enter an amount.', variant: 'destructive' });
      return;
    }

    const withdrawAmount = Number(amount);

    // Validation rules
    if (withdrawAmount <= 0) {
      toast({ title: 'Invalid amount', description: 'Amount must be greater than 0.', variant: 'destructive' });
      return;
    }

    if (withdrawAmount > maxWithdrawAmount) {
      toast({ title: 'Amount too large', description: `Cannot withdraw more than ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(maxWithdrawAmount)}`, variant: 'destructive' });
      return;
    }

    try {
      const result = await withdraw({ amount: withdrawAmount, reason: reason || undefined }).unwrap();
      if (result.success) {
        toast({ title: 'Withdrawal requested', description: 'Your withdrawal request has been sent.', variant: 'success' });
        setAmount('');
        setReason('');
        try {
          onSuccess?.();
        } catch { }
      } else {
        toast({ title: 'Withdrawal failed', description: result.message || 'Withdrawal failed.', variant: 'destructive' });
      }
    } catch (error: unknown) {
      const description = typeof error === 'object' && error && 'data' in error
        ? ((error as { data?: string }).data || 'Withdrawal failed.')
        : 'Withdrawal failed.';
      toast({ title: 'Withdrawal failed', description, variant: 'destructive' });
    }
  };

  return (
    <article className="bg-white rounded-2xl p-4">
      <div className="w-full">
        <header className="flex flex-wrap gap-4 items-end w-full">
          <div className="flex-1 min-w-[200px]">
            <div className="flex gap-2 items-center w-full text-xl font-medium leading-none text-stone-950">
              <TotalRevenueIcon />
              <h1 className="text-2xl font-semibold leading-none text-stone-950">Total Revenue</h1>
            </div>
            <p className="mt-3 text-2xl font-semibold leading-tight text-blue-600">{totalRevenue}</p>
          </div>
          <button
            onClick={handleSubmit}
            className="flex justify-center items-center py-2 px-8 text-lg leading-none bg-slate-50 min-h-[40px] rounded-[30px] text-stone-950 hover:bg-slate-100 transition-colors"
            disabled={isLoading}
          >
            <div className="flex gap-2 items-center">
              <FiUpload className="w-5 h-5" />
              <span>Withdraw</span>
            </div>
          </button>
        </header>

        <div className="mt-4 space-y-4">
          <div className="w-full">
            <label className="text-sm font-semibold leading-none text-stone-950" htmlFor="amount">
              Amount (VND)
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              max={maxWithdrawAmount}
              className="w-full min-h-[60px] py-2 px-3 mt-1 text-base font-medium leading-none rounded-lg bg-slate-50 text-zinc-500 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              Maximum withdrawal: {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(maxWithdrawAmount)}
            </p>
          </div>
          <div className="w-full">
            <label className="text-sm font-semibold leading-none text-stone-950" htmlFor="reason">
              Reason (Optional)
            </label>
            <input
              type="text"
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
              className="w-full min-h-[60px] py-2 px-3 mt-1 text-base font-medium leading-none rounded-lg bg-slate-50 text-zinc-500 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </article>
  );
};