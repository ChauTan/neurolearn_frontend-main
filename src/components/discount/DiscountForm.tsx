import React, { useState } from 'react';
import { Discount, CreateDiscountRequest } from '@/types/discount';

interface DiscountFormProps {
  discount?: Discount;
  onSubmit: (data: CreateDiscountRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const defaultForm: CreateDiscountRequest = {
  code: '',
  name: '',
  description: '',
  discountType: 'percentage',
  amount: 0,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  usageLimit: 0,
  startDate: '',
  endDate: '',
  accessType: 'public',
  isActive: true,
};

const DiscountForm: React.FC<DiscountFormProps> = ({ discount, onSubmit, onCancel, isLoading }) => {
  const [form, setForm] = useState<CreateDiscountRequest>(discount ? {
    code: discount.code || '',
    name: discount.name || '',
    description: discount.description || '',
    discountType: discount.discountType || 'percentage',
    amount: discount.amount || 0,
    minOrderAmount: discount.minOrderAmount || 0,
    maxDiscountAmount: discount.maxDiscountAmount || 0,
    usageLimit: discount.usageLimit || 0,
    startDate: discount.startDate ? discount.startDate.slice(0, 10) : '',
    endDate: discount.endDate ? discount.endDate.slice(0, 10) : '',
    accessType: discount.accessType || 'public',
    isActive: discount.isActive ?? true,
  } : defaultForm);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate required fields
    if (!form.code || !form.name || !form.discountType || !form.amount || !form.startDate || !form.endDate) {
      setError('Please fill in all required fields.');
      return;
    }
    setError(null);
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
          <input name="code" value={form.code} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows={2} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type *</label>
          <select name="discountType" value={form.discountType} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
          <input name="amount" type="number" value={form.amount} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Amount</label>
          <input name="minOrderAmount" type="number" value={form.minOrderAmount} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Discount Amount</label>
          <input name="maxDiscountAmount" type="number" value={form.maxDiscountAmount} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit</label>
          <input name="usageLimit" type="number" value={form.usageLimit} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" min={0} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Access Type</label>
          <select name="accessType" value={form.accessType} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} id="isActive" />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
        </div>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" disabled={isLoading} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50">
          {isLoading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default DiscountForm;