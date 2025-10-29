'use client';

import Image from 'next/image';
import { Dialog } from '@headlessui/react';

interface ReceiptItem {
  id: string;
  name: string;
  payment: string;
  price: string;
  date: string;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  data,
}: {
  isOpen: boolean;
  onClose: () => void;
  data: ReceiptItem | null;
}) {
  if (!isOpen || !data) return null;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl p-6 w-[700px]">
          <h2 className="text-xl font-bold text-black mb-2">Receipts</h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Left Side */}
            <div>
              <div className="relative mb-3">
                <Image
                  src="/assets/images/receipt-example.png"
                  alt="Course"
                  width={300}
                  height={180}
                  quality={100}
                  className="rounded-lg object-cover"
                  onError={e => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/300x180?text=No+Image';
                  }}
                />
              </div>
              <div className="text-base font-semibold text-black">Academix</div>
              <div className="text-sm text-gray-600">
                321 Street, Dong Da, Quy Nhon, Bình Định, Việt Nam
              </div>
              <a
                className="text-blue-500 text-sm"
                href="https://academix.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Academix.com
              </a>
              <div className="text-base mt-2 text-black font-semibold">
                Translates to: Dao Tuan Kiet
              </div>
              <div className="text-sm text-gray-600">Date: {data.date}</div>
              <div className="text-sm break-all text-gray-600">
                OrderNo: DP–66D4772584AB4866B366D455A673D3D
              </div>
            </div>

            {/* Right Side */}
            <div className="text-sm">
              <div className="mb-6">
                <span className="font-semibold text-black">Item:</span>
                <span className="text-base block mt-1 text-black font-semibold">{data.name}</span>
              </div>
              <div className="border-t border-gray-300 my-6"></div>
              <div className="my-2 text-black">Ordered Date: {data.date}</div>
              <div className="my-2 text-black">Coupon Code: ST3MT200225A</div>
              <div className="border-t border-gray-300 my-6"></div>

              <div className="my-2 flex justify-between text-black">
                <span>Quantity:</span>
                <span>1</span>
              </div>
              <div className="my-2 flex justify-between text-black">
                <span>Price:</span>
                <span>{data.price}</span>
              </div>
              <div className="my-2 flex justify-between text-black">
                <span>Tax:</span>
                <span>12.000 VNĐ</span>
              </div>

              <div className="mt-4 flex justify-between">
                <span className="text-black text-xl">Total Paid:</span>
                <span className="text-blue-600 text-xl font-semibold">{data.price}</span>
              </div>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
