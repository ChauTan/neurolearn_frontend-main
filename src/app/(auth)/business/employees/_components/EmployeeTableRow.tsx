'use client';

import Image from 'next/image';
import React from 'react';
// ICON IMPORTS: Thêm các icon cần thiết từ heroicons
import { TrashIcon, ArrowUpCircleIcon } from '@heroicons/react/24/outline';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'employee' | 'manager' | 'admin';
  avatar?: { url?: string | null };
  phoneNumber?: string;
  createdAt?: string;
}

interface EmployeeTableRowProps {
  employee: User;
  onUpgrade: (id: string) => void;
  onDelete: (id: string) => void;
}

const RoleBadge = ({ role }: { role: User['role'] }) => {
  const roleStyles = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-yellow-100 text-yellow-800',
    employee: 'bg-green-100 text-green-800',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${roleStyles[role]}`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
};

const EmployeeTableRow = ({ employee, onUpgrade, onDelete }: EmployeeTableRowProps) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <tr key={employee._id}>
      {/* Các cột Name, Role, Phone Number, Joined Date giữ nguyên */}
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
        <div className="flex items-center">
          <div className="h-11 w-11 flex-shrink-0">
            <Image
              className="h-11 w-11 rounded-full object-cover"
              src={employee.avatar?.url || '/assets/images/default-avatar.png'}
              alt={employee.name}
              width={44}
              height={44}
            />
          </div>
          <div className="ml-4">
            <div className="font-medium text-gray-900">{employee.name}</div>
            <div className="mt-1 text-gray-500">{employee.email}</div>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        <RoleBadge role={employee.role} />
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {employee.phoneNumber || 'Not updated'}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {formatDate(employee.createdAt)}
      </td>

      {/* ===== CHANGED: Cột Actions được cập nhật để hiển thị icon ===== */}
      <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
        <div className="flex items-center justify-center space-x-4">
          {employee.role === 'employee' && (
            <button
              onClick={() => onUpgrade(employee._id)}
              className="text-indigo-600 hover:text-indigo-900 hover:cursor-pointer"
              title="Upgrade to Manager"
            >
              <ArrowUpCircleIcon className="w-6 h-6" />
            </button>
          )}
          <button
            onClick={() => onDelete(employee._id)}
            className="text-red-600 hover:text-red-900 hover:cursor-pointer"
            title="Delete Employee"
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        </div>
      </td>
      {/* ===== END OF CHANGES ===== */}
    </tr>
  );
};

export default EmployeeTableRow;
