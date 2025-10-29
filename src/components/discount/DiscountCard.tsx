import React from 'react';
import { Discount } from '@/types/discount';
import { 
  Globe, Lock, Percent, DollarSign, BookOpen, ShoppingCart, 
  BarChart2, Calendar, Eye, Edit2, Trash2, CheckCircle2, XCircle, Clock
} from 'lucide-react';

interface DiscountCardProps {
  discount: Discount;
  onViewDetails?: (discount: Discount) => void;
  onEdit?: (discount: Discount) => void;
  onDelete?: (discount: Discount) => void;
}

const DiscountCard: React.FC<DiscountCardProps> = ({ discount, onViewDetails, onEdit, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = new Date(discount.endDate) < new Date();
  const isActive = discount.isActive && !isExpired;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow max-w-xs mx-auto">
      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
              {discount.name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <div className="bg-gray-100 rounded-lg px-3 py-1.5">
                <code className="text-sm font-mono text-gray-800">{discount.code}</code>
              </div>
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                discount.accessType === 'public' 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'bg-purple-50 text-purple-700'
              }`}>
                {discount.accessType === 'public' ? (
                  <Globe className="h-3 w-3" />
                ) : (
                  <Lock className="h-3 w-3" />
                )}
                {discount.accessType === 'public' ? 'Public' : 'Private'}
              </span>
            </div>
          </div>
          
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? 'bg-green-50 text-green-700' 
              : isExpired 
                ? 'bg-red-50 text-red-700' 
                : 'bg-gray-100 text-gray-700'
          }`}>
            {isActive ? (
              <CheckCircle2 className="h-3 w-3" />
            ) : isExpired ? (
              <XCircle className="h-3 w-3" />
            ) : (
              <Clock className="h-3 w-3" />
            )}
            {isActive ? 'Active' : isExpired ? 'Expired' : 'Inactive'}
          </span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 text-gray-700">
              {discount.discountType === 'percentage' ? (
                <Percent className="h-5 w-5 text-green-600" />
              ) : (
                <DollarSign className="h-5 w-5 text-green-600" />
              )}
              <span className="text-xl font-semibold">
                {discount.discountType === 'percentage' 
                  ? `${discount.amount}%` 
                  : `$${discount.amount}`}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 text-center">Discount</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <BarChart2 className="h-5 w-5" />
              <span className="text-xl font-semibold">{discount.usageLimit}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500 text-center">Usage Limit</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 text-purple-600">
              <BookOpen className="h-5 w-5" />
              <span className="text-xl font-semibold">{discount.courseIds.length}</span>
            </div>
            <p className="mt-1 text-xs text-gray-500 text-center">Courses</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <ShoppingCart className="h-5 w-5" />
              <span className="text-xl font-semibold">
                {discount.minOrderAmount ? `$${discount.minOrderAmount}` : 'None'}
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500 text-center">Min Order</p>
          </div>
        </div>

        {/* Valid Period */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="font-medium">Valid Period:</span>
          </div>
          <div className="mt-1 text-sm text-gray-600 ml-6">
            {formatDate(discount.startDate)} → {formatDate(discount.endDate)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails?.(discount)}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Eye className="h-4 w-4" />
            View
          </button>
          <button
            onClick={() => onEdit?.(discount)}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
          >
            <Edit2 className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete?.(discount)}
            className="flex-1 flex items-center justify-center gap-1 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountCard;