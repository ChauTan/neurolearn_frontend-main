'use client';

import axios from 'axios';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function ReceiptModal() {
  const { id } = useParams();
  const [order, setOrder] = useState<any | null>(null);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/orders/${id}`,
          {
            withCredentials: true,
          }
        );
        setOrder(response.data.order);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);
  const formattedDate = new Date(order?.createdAt).toLocaleDateString('en-GB');
  return (
    <>
      <div className="flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-6 w-[700px] shadow-lg">
          <h2 className="text-xl font-bold text-black mb-2">Receipts</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Side */}
            <div>
              <div className="relative mb-3">
                <Image
                  src={order?.courseIds[0]?.thumbnail?.url || "/assets/images/receipt-example.png"
                  }
                  alt="Course"
                  width={300}
                  height={180}
                  quality={100}
                  className="rounded-lg object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x180?text=No+Image';
                  }}
                />
              </div>
              <div className="text-base font-semibold text-black">Academix</div>
              <a className="text-blue-500 text-sm" href="https://academix.com" target="_blank" rel="noopener noreferrer">Academix.com</a>
              <div className="text-base mt-2 text-black font-semibold">Buyer: {order?.userId?.name}</div>
              <div className="text-sm text-gray-600"></div>
              <div className="text-sm break-all text-gray-600">OrderNo: {order?.orderCode}</div>
            </div>

            {/* Right Side */}
            <div className="text-sm">
              <div className="mb-6">
                <span className="font-semibold text-black">Item:</span>
                <ul className="list-disc list-inside mt-1 text-black text-sm">
                  {order?.courseIds?.map((course: any) => (
                    <li key={course._id}>{course.name.length > 40 ? course.name.slice(0, 40) + '...' : course.name}</li>
                  ))}
                </ul>
                <span className="text-base block mt-1 text-black font-semibold"></span>
              </div>
              <div className="border-t border-gray-300 my-6"></div>
              <div className="my-2 text-black">Ordered Date:{formattedDate} </div>
              <div className="my-2 text-black">Coupon Code: ST3MT200225A</div>
              <div className="border-t border-gray-300 my-6"></div>

              <div className="my-2 flex justify-between text-black">
                <span>Price: {order?.price.toLocaleString()} VNĐ</span>
                <span></span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-black text-xl">Total Paid: {order?.price.toLocaleString()} VNĐ</span>
                <span className="text-blue-600 text-xl font-semibold"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
