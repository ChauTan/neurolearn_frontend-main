'use client';

import ReceiptTable from '@/components/dashboard/ReceiptTable';
import SearchBar from '@/components/dashboard/SearchBar';
import React, { useState } from 'react';

export default function Page() {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className="flex h-screen w-full rounded-2xl">
      <div className="w-full overflow-y-auto ">
        <div className="flex items-center gap-10 w-full">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} searchPlaceholder="Search receipts..." />
        </div>
        <div className="mt-10 w-full">
          <ReceiptTable userType='business' searchTerm={searchTerm} />
        </div>
      </div>
    </div>
  );
}
