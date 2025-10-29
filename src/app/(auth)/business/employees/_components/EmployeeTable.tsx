import React from 'react';
import EmployeeTableHeader from './EmployeeTableHeader';
import EmployeeTableRow from './EmployeeTableRow';

interface EmployeeTableProps {
  employees: any[];
  onUpgrade: (id: string) => void;
  onDelete: (id: string) => void;
}

const EmployeeTable = ({ employees, onUpgrade, onDelete }: EmployeeTableProps) => {
  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="overflow-hidden shadow  sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <EmployeeTableHeader />
              <tbody className="divide-y divide-gray-200 bg-white">
                {employees.map(employee => (
                  <EmployeeTableRow
                    key={employee._id}
                    employee={employee}
                    onUpgrade={onUpgrade}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTable;
