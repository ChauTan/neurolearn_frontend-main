import React from "react";

interface UserTableRowProps {
  avatar: string;
  name: string;
  email: string;
  category: string;
  requestDate: string;
}

const UserTableRow: React.FC<UserTableRowProps> = ({
  avatar,
  name,
  email,
  category,
  requestDate,
}) => {
  return (
    <tr className="border-b hover:bg-gray-50 transition">
      <td className="py-3 px-2 flex items-center gap-3 min-w-[220px]">
        <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
        <div>
          <div className="font-semibold text-sm">{name}</div>
          <div className="text-xs text-gray-500">{email}</div>
        </div>
      </td>
      <td className="py-3 px-2 text-center">{category}</td>
      <td className="py-3 px-2 text-center">{requestDate}</td>
      <td className="py-3 px-2 text-center">
        <button className="hover:bg-gray-100 rounded-full p-2">
          <span role="img" aria-label="view">👁️</span>
        </button>
      </td>
      <td className="py-3 px-2 text-center">
        <button className="hover:bg-red-100 rounded-full p-2">
          <span role="img" aria-label="delete">🗑️</span>
        </button>
      </td>
    </tr>
  );
};

export default UserTableRow; 