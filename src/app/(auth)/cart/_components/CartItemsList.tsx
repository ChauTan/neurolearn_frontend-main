import { CartItem } from './CartItem';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface CartItemListProps {
  courses: any[];
  onRemoveItem: (courseId: string) => void;
  onPackageChange: (courseId: string, newIndex: number) => void; // thêm prop mới
  role: string | undefined;
}

export function CartItemList({ courses, onRemoveItem, onPackageChange, role }: CartItemListProps) {
  const isBusinessRole = role === 'admin';

  if (courses.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border-2 border-dashed bg-secondary p-12 text-center">
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="mt-2 text-gray-900">Add some courses to get started!</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Row */}
      <div className="hidden rounded-t-lg border-b border-gray-200 bg-gray-50 px-6 py-3 text-sm font-medium text-gray-600 md:grid md:grid-cols-6 md:gap-4">
        <h3 className="col-span-3">Product Details</h3>
        {isBusinessRole && <h3 className="text-center">Package</h3>}
        <h3 className="text-center">Price</h3>
        <h3 className="text-center">Total</h3>
      </div>

      {/* Items List */}
      <div className="divide-y divide-gray-200 rounded-lg border border-gray-200 bg-background md:rounded-none md:border-x md:border-b md:border-t-0">
        {courses.map((course, index) => (
          <CartItem
            key={course._id || `course-${index}`}
            course={course}
            onRemove={onRemoveItem}
            showPackageSelector={isBusinessRole}
            onPackageChange={onPackageChange} // truyền xuống
          />
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 transition-colors hover:font-bold "
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
