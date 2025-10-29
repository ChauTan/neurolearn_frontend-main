'use client';

import React from 'react';
import { createPortal } from 'react-dom';
import { Business } from '@/types/business';

interface BusinessDetailsModalProps {
  business: Business | null;
  isOpen: boolean;
  onClose: () => void;
}

const BusinessDetailsModal: React.FC<BusinessDetailsModalProps> = ({ business, isOpen, onClose }) => {
  if (!business || !isOpen) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Business Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Business Header */}
          <div className="flex items-start gap-6 mb-8">
            <div className="relative">
              <img 
                src={business.createdBy?.avatar || '/assets/images/avatar-default.png'} 
                alt={business.businessName}
                className="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
              />
              {business.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{business.businessName}</h1>
                {business.isVerified && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                    Verified
                  </span>
                )}
              </div>
              <p className="text-lg text-gray-600 mb-2">{business.businessSector}</p>
              <p className="text-gray-500">Created on {formatDate(business.createdAt)}</p>
            </div>
          </div>

          {/* Business Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700">{business.email}</span>
                </div>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-gray-700">{business.address}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Statistics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{business.employees?.length || 0}</div>
                  <div className="text-sm text-gray-600">Employees</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{business.courses?.length || 0}</div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {business.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{business.description}</p>
            </div>
          )}

          {/* Created By */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Created By</h3>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <img 
                src={business.createdBy?.avatar || '/assets/images/avatar-default.png'}
                alt={business.createdBy?.name || 'Unknown'}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-medium text-gray-900">{business.createdBy?.name || 'Unknown'}</div>
                <div className="text-sm text-gray-500">{business.createdBy?.email || 'No email'}</div>
              </div>
            </div>
          </div>

          {/* Employees */}
          {business.employees && business.employees.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Employees ({business.employees.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {business.employees.slice(0, 6).map((employee) => (
                  <div key={employee._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <img 
                      src={employee.avatar || '/assets/images/avatar-default.png'} 
                      alt={employee.name || 'Employee'}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-sm text-gray-900">{employee.name || 'Unknown Employee'}</div>
                      <div className="text-xs text-gray-500">{employee.role || 'No Role'}</div>
                    </div>
                  </div>
                ))}
                {business.employees.length > 6 && (
                  <div className="flex items-center justify-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">
                      +{business.employees.length - 6} more employees
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Courses */}
          {business.courses && business.courses.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Courses ({business.courses.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {business.courses.slice(0, 6).map((course) => (
                  <div key={course._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <img 
                      src={course.thumbnail?.url || '/assets/images/avatar-default.png'}
                      alt={course.name || 'Course'}
                      className="w-full h-24 object-cover"
                    />
                    <div className="p-3">
                      <h4 className="font-medium text-sm text-gray-900 line-clamp-2">{course.name || 'Unnamed Course'}</h4>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-medium text-green-600">${course.price || 0}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          course.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {business.courses.length > 6 && (
                  <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-500">
                      +{business.courses.length - 6} more courses
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal outside the parent layout
  return createPortal(modalContent, document.body);
};

export default BusinessDetailsModal; 