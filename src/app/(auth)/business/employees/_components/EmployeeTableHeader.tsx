import React from 'react';

const EmployeeTableHeader = () => {
  return (
    <thead className="bg-gray-50">
      <tr>
        <th
          scope="col"
          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
        >
          Employee
        </th>
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
          Role
        </th>
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
          Phone Number
        </th>
        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
          Joined Date
        </th>
        <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
          Actions
        </th>
      </tr>
    </thead>
  );
};

export default EmployeeTableHeader;
