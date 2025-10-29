'use client';

import { useEffect, useState } from 'react';
import { CartItemList } from './_components/CartItemsList';
import { CartSummary } from './_components/CartSummary';
import Loading from '@/components/common/Loading';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URI}/cart/cart-items`, {
          withCredentials: true,
        });

        const rawItems = res.data.cart.items;

        const formattedItems: any[] = rawItems.map((item: any) => {
          const isBusinessUser = user?.businessInfo?.role === 'admin';
          const showPackageSelector = isBusinessUser;

          return {
            ...item.courseId,
            quantity: item.quantity,
            selectedPackageIndex: 0, // default chọn gói đầu tiên
            showPackageSelector,
          };
        });

        setCartItems(formattedItems);
      } catch (error) {
        console.error('Failed to load cart:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCartItems();
    }
  }, [user?.businessInfo?.role, user?._id]); // Thêm user._id để đảm bảo user đã load

  const handleRemoveItem = async (courseId: string) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URI}/cart/remove-item`, {
        data: { courseId },
        withCredentials: true,
      });

      setCartItems(prev => prev.filter(item => item._id !== courseId));
      toast({ title: 'Item removed successfully', variant: 'success' });
    } catch (error) {
      console.error('Failed to remove item:', error);
      toast({ title: 'Failed to remove item', variant: 'destructive' });
    }
  };

  // Cập nhật package được chọn
  const handlePackageChange = (courseId: string, newIndex: number) => {
    setCartItems(prev => {
      const updated = prev.map(item =>
        item._id === courseId ? { ...item, selectedPackageIndex: newIndex } : item
      );
      return updated;
    });
  };

  if (loading) return <Loading message="Loading cart..." />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-baseline justify-between border-b border-gray-200 pb-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Shopping Cart</h1>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <CartItemList
            courses={cartItems}
            onRemoveItem={handleRemoveItem}
            role={user?.businessInfo?.role}
            onPackageChange={handlePackageChange}
          />
        </section>

        <aside className="lg:col-span-1">
          <CartSummary courses={cartItems} />
        </aside>
      </div>
    </main>
  );
}
