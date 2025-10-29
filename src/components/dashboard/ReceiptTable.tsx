'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Loading from '@/components/common/Loading';
import { CommonPagination } from '@/components/common/ui';

interface Course {
  name: string;
  price: number;
}

interface Order {
  _id: string;
  orderCode: string;
  courseIds: Course[];
  payment_info: string;
  createdAt: string;
  price: number;
}

interface ReceiptTableProps {
  userType: 'user' | 'business';
  searchTerm?: string;
}

const ITEMS_PER_PAGE = 6;

export default function ReceiptTable({ userType, searchTerm = '' }: ReceiptTableProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/orders/user-orders`,
          { userType },
          { withCredentials: true }
        );

        if (response.data.success) {
          setOrders(response.data.orders);
        }
      } catch (error) {
        console.error('Failed to fetch user orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [userType]);

  // Filter by search term
  const normalizedQuery = searchTerm.trim().toLowerCase();
  const stringIncludes = (value: unknown) =>
    String(value ?? '')
      .toLowerCase()
      .includes(normalizedQuery);
  const filteredOrders = normalizedQuery
    ? orders.filter(order => {
        const inCode = stringIncludes(order.orderCode);
        const inPayment = stringIncludes(order.payment_info);
        const inDate = stringIncludes(new Date(order.createdAt).toLocaleDateString('en-GB'));
        const inCourses = order.courseIds?.some(course => stringIncludes(course.name));
        return inCode || inPayment || inDate || inCourses;
      })
    : orders;

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [normalizedQuery]);

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleReceiptClick = (orderId: string) => {
    if (userType === 'business') {
      router.push(`/business/purchase-history/${orderId}`);
    } else {
      router.push(`/dashboard/purchase-history/${orderId}`);
    }
  };

  if (isLoading) {
    return <Loading message="Loading purchase history..." />;
  }

  return (
    <div className="bg-white pt-6 px-6 rounded-2xl shadow-sm">
      <table className="w-full table-auto text-left">
        <thead>
          <tr className="text-sm text-gray-500 border-b">
            <th className="pb-6">Code</th>
            <th className="pb-6">Name</th>
            <th className="pb-6">Payment type</th>
            <th className="pb-6">Total Price</th>
            <th className="pb-6">Date</th>
            <th className="pb-6 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length === 0 && (
            <tr>
              <td className="py-6 text-center text-sm text-gray-500" colSpan={6}>
                No receipts found.
              </td>
            </tr>
          )}
          {currentOrders.map((order, idx) => {
            const totalPrice = order?.price;
            const formattedDate = new Date(order.createdAt).toLocaleDateString('en-GB');

            return (
              <tr
                key={order._id}
                className={`text-sm text-black ${idx !== currentOrders.length - 1 ? 'border-b border-gray-200' : ''}`}
              >
                <td className="py-6">{order.orderCode}</td>
                <td className="py-6">
                  {(() => {
                    const result = [];
                    let totalLength = 0;
                    for (let i = 0; i < order.courseIds.length; i++) {
                      const name = order.courseIds[i].name;
                      if (totalLength + name.length > 25) {
                        // Nếu ngay từ khóa đầu đã vượt 25 thì cắt bớt
                        if (result.length === 0) {
                          result.push(name.slice(0, 25) + '…');
                        } else {
                          result.push('…');
                        }
                        break;
                      }
                      result.push(name);
                      totalLength += name.length + 2;
                    }
                    return result.join(', ');
                  })()}
                </td>
                <td className="py-6">{order.payment_info || 'N/A'}</td>
                <td className="py-6">{totalPrice.toLocaleString()} VNĐ</td>
                <td className="py-6 font-medium">{formattedDate}</td>
                <td className="py-6 text-center">
                  <button
                    onClick={() => handleReceiptClick(order?.orderCode)}
                    className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white text-sm px-4 py-1.5 rounded-full"
                  >
                    Receipt
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {filteredOrders.length > 0 && (
        <CommonPagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
