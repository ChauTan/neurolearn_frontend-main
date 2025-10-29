'use client';

import { Button } from '@/components/common/ui/Button2';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useState, Fragment, ChangeEvent } from 'react';
import { Dialog } from '@headlessui/react';

interface CartSummaryProps {
  courses: {
    _id: string;
    price?: number;
    coursePackage?: { package: string; quantity: number; price: number }[];
    selectedPackageIndex?: number;
    showPackageSelector?: boolean; // thêm để xác định logic
  }[];
}

const formatVND = (amount: number): string => {
  return `${amount.toLocaleString('en-US')} VND`;
};

export function CartSummary({ courses }: CartSummaryProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  // --- Tính subtotal ---
  const subtotal = courses.reduce((sum, course) => {
    if (course.showPackageSelector && course.coursePackage?.length) {
      const selectedIndex = typeof course.selectedPackageIndex === 'number'
        ? course.selectedPackageIndex
        : 0;

      const pkg = selectedIndex >= 0 && selectedIndex < course.coursePackage.length
        ? course.coursePackage[selectedIndex]
        : null;

      return sum + (pkg?.price || 0);
    } else {
      return sum + (course.price || 0);
    }
  }, 0);

  const totalCost = subtotal - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) {
      toast({ variant: 'destructive', title: 'Please enter a discount code' });
      return;
    }

    try {
      setApplying(true);

      const courseIds = courses.map(c => c._id);
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/discount/validate`,
        {
          code: discountCode.trim(),
          courseIds,
          orderAmount: subtotal,
        },
        { withCredentials: true }
      );

      if (res.data?.success && res.data?.data?.discountAmount > 0) {
        setDiscountAmount(res.data.data.discountAmount || 0);
        setAppliedDiscount(discountCode.trim());
        toast({
          variant: 'success',
          title: 'Discount applied!',
          description: `You saved ${formatVND(res.data.data.discountAmount)}`,
        });
      } else {
        setDiscountAmount(0);
        setAppliedDiscount(null);
        toast({ variant: 'destructive', title: 'Invalid discount code' });
      }
    } catch (error) {
      console.error('Apply discount error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to apply discount',
      });
    } finally {
      setApplying(false);
    }
  };

  const handleCheckout = async () => {
    if (courses.length === 0) return;

    try {
      setLoading(true);

      const courseIds = courses.map(course => course._id);
      const licenseQuantities: Record<string, number> = {};

      courses.forEach(course => {
        if (course.showPackageSelector && course.coursePackage?.length) {
          const pkg = course.coursePackage[course.selectedPackageIndex || 0];
          licenseQuantities[course._id] = pkg?.quantity || 1;
        } else {
          licenseQuantities[course._id] = 1;
        }
      });

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/payment/create-payment-link`,
        {
          amount: totalCost,
          description: 'Buy courses from Academix',
          courseIds,
          licenseQuantities,
          discountCode: appliedDiscount || null,
        },
        { withCredentials: true }
      );

      if (res.data?.checkoutUrl) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/cart/clear-cart`,
          {},
          { withCredentials: true }
        );
        window.location.href = res.data.checkoutUrl;
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to create payment link',
        });
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
        description: 'Unable to create payment link',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Items (
            {courses.reduce((sum, course) => {
              if (course.showPackageSelector && course.coursePackage?.length) {
                const pkg = course.coursePackage[course.selectedPackageIndex || 0];
                return sum + (pkg?.quantity || 0);
              } else {
                return sum + 1;
              }
            }, 0)}
            )
          </p>
          <p className="font-semibold text-gray-900">{formatVND(subtotal)}</p>
        </div>
        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <p>Discount</p>
            <p>-{formatVND(discountAmount)}</p>
          </div>
        )}
      </div>

      <div className="mt-6 space-y-2">
        <label htmlFor="promo-code" className="font-semibold text-gray-900">
          Discount Code
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            id="promo-code"
            placeholder="Enter your code"
            value={discountCode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setDiscountCode(e.target.value)}
            className="w-full rounded-md text-gray-700 border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:ring-primary"
          />
          <Button
            variant="outline"
            className="flex-shrink-0"
            disabled={applying}
            onClick={handleApplyDiscount}
          >
            {applying ? 'Applying...' : 'Apply'}
          </Button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <p className="text-lg font-bold text-gray-900">Total Cost</p>
        <p className="text-xl font-bold text-gray-900">{formatVND(totalCost)}</p>
      </div>

      <Button
        disabled={courses.length === 0 || loading}
        variant="default"
        size="lg"
        className="mt-6 w-full"
        onClick={() => setIsOpen(true)}
      >
        {loading ? 'Processing...' : 'Proceed to Checkout'}
      </Button>

      <Dialog as={Fragment} open={isOpen} onClose={() => setIsOpen(false)}>
        <div className="fixed inset-0 z-50 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
          <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <Dialog.Title className="text-xl font-bold text-gray-800 mb-4">
              Do you want to buy course?
            </Dialog.Title>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleCheckout();
                }}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
