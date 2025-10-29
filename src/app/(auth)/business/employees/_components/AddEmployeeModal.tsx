'use client';

import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import { useToast } from '@/hooks/use-toast';
import { useSelector } from 'react-redux';
import { getOrCreateBusinessGroupChat, addEmployeeToBusinessGroupChat } from '@/lib/firestore/chat';
import EmployeeAddedNotification from '@/components/business/EmployeeAddedNotification';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';

interface AddEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

const AddEmployeeModal = ({ isOpen, onClose, onRefresh }: AddEmployeeModalProps) => {
  const [activeTab, setActiveTab] = useState<'email' | 'file'>('email');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const { user } = useSelector((state: any) => state.auth);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [notification, setNotification] = useState<{ isVisible: boolean; employeeName: string }>({
    isVisible: false,
    employeeName: ''
  });
  const { signInAnonymouslyIfNeeded } = useFirebaseAuth();

  if (!isOpen) return null;

  // Hàm tạo hoặc cập nhật business group chat
  const handleBusinessGroupChat = async (newEmployeeId: string, newEmployeeName: string) => {
    try {
      const businessId = user?.businessInfo?.businessId;
      const adminId = user?._id;

      if (!businessId || !adminId) {
        console.error('Missing business info or admin ID');
        return;
      }

      console.log('Starting business group chat update for employee:', newEmployeeName);

      // Ensure mock user is created for Firestore
      await signInAnonymouslyIfNeeded();

      // Lấy thông tin business để có business name
      const businessResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/business/me`,
        { withCredentials: true }
      );

      const businessName = businessResponse.data.business?.businessName || 'Business';
      console.log('Business name:', businessName);

      // Lấy danh sách employees hiện tại để tạo group chat
      const employeesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/business/${businessId}/visible-employees`,
        { withCredentials: true }
      );

      const currentEmployees = employeesResponse.data.employees || [];
      const employeeIds = currentEmployees
        .filter((emp: any) => emp.user && emp.user._id !== adminId)
        .map((emp: any) => emp.user._id);

      const employeeNames: Record<string, string> = {};
      currentEmployees.forEach((emp: any) => {
        if (emp.user) {
          employeeNames[emp.user._id] = emp.user.name;
        }
      });

      console.log('Current employees (excluding admin):', employeeIds);
      console.log('Employee names:', employeeNames);

      // Luôn tạo hoặc cập nhật business group chat trước
      console.log('Creating/updating business group chat...');
      await getOrCreateBusinessGroupChat(
        businessId,
        businessName,
        adminId,
        employeeIds,
        employeeNames
      );

      // Sau đó thêm employee mới vào group chat
      console.log('Adding new employee to group chat...');
      await addEmployeeToBusinessGroupChat(
        businessId,
        newEmployeeId,
        newEmployeeName
      );

      console.log('Business group chat updated successfully');

      // Hiển thị thông báo thành công
      setNotification({
        isVisible: true,
        employeeName: newEmployeeName
      });

      // Tự động ẩn notification sau 5 giây
      setTimeout(() => {
        setNotification(prev => ({ ...prev, isVisible: false }));
      }, 5000);

      toast({
        title: 'Group Chat Updated',
        description: `${newEmployeeName} đã được thêm vào business group chat`,
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating business group chat:', error);
      // Hiển thị cảnh báo nhưng không block việc thêm employee
      toast({
        title: 'Warning',
        description: 'Employee added but group chat update failed. You can manually add them later.',
        variant: 'destructive',
      });
    }
  };

  const handleAddByEmail = async () => {
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter an email address.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/business/${user?.businessInfo?.businessId}/add-employee`,
        { email, role: 'employee' },
        { withCredentials: true }
      );

      // Tự động tạo hoặc cập nhật business group chat
      if (res.data.success && res.data.employee) {
        await handleBusinessGroupChat(
          res.data.employee._id || res.data.employee.userId,
          res.data.employee.name || res.data.employee.email
        );
      }

      toast({
        title: 'Success',
        description: res.data.message,
        variant: 'success',
      });
      onRefresh();
      setEmail('');
      onClose();
    } catch (err: any) {
      toast({
        title: 'Failed',
        description: err?.response?.data?.message || 'Failed to add employee.',
        variant: 'destructive',
      });
    }
  };

  const handleImportFile = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to import.',
        variant: 'destructive',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/business/${user?.businessInfo?.businessId}/employees/import`,
        formData,
        { withCredentials: true }
      );

      // Tự động cập nhật business group chat cho tất cả employees mới
      if (res.data.success && res.data.employees) {
        for (const employee of res.data.employees) {
          if (employee.user) {
            await handleBusinessGroupChat(
              employee.user._id,
              employee.user.name || employee.user.email
            );
          }
        }
      }

      toast({
        title: 'Success',
        description: res.data.message,
        variant: 'success',
      });
      onRefresh();
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      onClose();
    } catch (err: any) {
      toast({
        title: 'Failed',
        description: err?.response?.data?.message || 'Failed to import employees.',
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center" onClick={onClose}>
          <div className="absolute inset-0 bg-black opacity-50"></div>

          <div
            className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Add New Employee</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 hover:cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Tab Buttons */}
            <div className="flex mb-4 border-b">
              <button
                onClick={() => setActiveTab('email')}
                className={`py-2 px-4 hover:cursor-pointer ${activeTab === 'email'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500'
                  }`}
              >
                Add by Email
              </button>
              <button
                onClick={() => setActiveTab('file')}
                className={`py-2 px-4 hover:cursor-pointer ${activeTab === 'file'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-500'
                  }`}
              >
                Add by File (.xlsx)
              </button>
            </div>

            {/* Tab Content */}
            <div>
              {activeTab === 'email' && (
                <div className="space-y-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Employee Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="e.g., employee@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full rounded-md border text-black border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={handleAddByEmail}
                    className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700 hover:cursor-pointer"
                  >
                    Add Employee
                  </button>
                </div>
              )}

              {activeTab === 'file' && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">Upload XLSX File</label>

                  <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                    <div className="space-y-1 text-center">
                      <p className="text-xs text-gray-500">XLSX up to 10MB</p>
                      <div className="flex flex-col items-center">
                        <label
                          htmlFor="file-upload"
                          className="cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                        >
                          <span>Choose File</span>
                          <input
                            ref={fileInputRef}
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".xlsx"
                            onChange={e => {
                              if (e.target.files && e.target.files.length > 0) {
                                setFile(e.target.files[0]);
                              }
                            }}
                          />
                        </label>

                        {file && (
                          <div className="mt-2 text-sm text-gray-600 flex items-center justify-between gap-2">
                            <span className="truncate max-w-[200px]">Selected: {file.name}</span>
                            <button
                              onClick={() => {
                                setFile(null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = '';
                                }
                              }}
                              className="text-red-600 text-xs hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleImportFile}
                    className="w-full rounded-md bg-indigo-600 py-2 px-4 text-white hover:bg-indigo-700"
                  >
                    Import Employees
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Employee Added Notification */}
      <EmployeeAddedNotification
        employeeName={notification.employeeName}
        isVisible={notification.isVisible}
        onClose={() => setNotification(prev => ({ ...prev, isVisible: false }))}
      />
    </>
  );
};

export default AddEmployeeModal;
