'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Trash2, ChevronDown, ChevronUp, MapPin, Building, Users } from 'lucide-react';
import { StatusBadge } from '@/components/review-common';

interface BusinessRequestCardProps {
  business: any;
  onPreview: (business: any) => void;
  onReject: (id: string) => void;
  index: number;
}

export default function BusinessRequestCard({ business, onPreview, onReject, index }: BusinessRequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle the new API structure
  const businessData = business.data || {};
  const userData = business.userId || {};
  const representativeData = businessData.representative || {};

  // Debug log to check data structure
  console.log('Business Request Data:', {
    business,
    businessData,
    userData,
    representativeData,
    businessName: businessData.businessName,
    userEmail: userData.email,
    businessEmail: businessData.email,
    sector: businessData.businessSector
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
      {/* Main Row */}
      <div className="grid grid-cols-12 gap-8 px-8 py-8 items-start hover:bg-gray-50 transition-colors">
        {/* Business Info */}
        <div className="col-span-3 flex items-center gap-4">
          {userData.avatar?.url ? (
            <Image
              src={userData.avatar.url}
              alt="business avatar"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
              {(businessData.businessName || userData.name || 'B').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <div className="font-semibold text-gray-900 text-base leading-6">
              {businessData.businessName || userData.name || `DEBUG: ${JSON.stringify(Object.keys(businessData))}`}
            </div>
            <div className="text-xs text-gray-500 leading-5 max-w-[220px] truncate">
              {businessData.email || userData.email || `DEBUG: ${JSON.stringify(Object.keys(userData))}`}
            </div>
            <div className="text-xs text-blue-600 font-medium leading-5">
              {businessData.businessSector || `DEBUG: ${JSON.stringify(businessData)}`}
            </div>
          </div>
        </div>

        {/* Business Details */}
        <div className="col-span-4 flex items-start pl-2 md:pl-4">
          <div className="space-y-2">
            <div className="font-semibold text-gray-900 text-base leading-6 line-clamp-2">
              {representativeData.name || userData.name || 'N/A'}
            </div>
            <div className="text-sm text-gray-500 leading-5 line-clamp-1">
              {businessData.description || 'No description provided'}
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2 font-medium"
            >
              {isExpanded ? 'Show less' : 'Show more'}
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Created Date */}
        <div className="col-span-2 flex items-center">
          <span className="text-gray-700 font-medium text-sm">
            {business.createdAt ? formatDate(business.createdAt) : 'N/A'}
          </span>
        </div>

        {/* Status */}
        <div className="col-span-1 flex items-center justify-center">
          <StatusBadge status={business.status || 'pending'} />
        </div>

        {/* Action */}
        <div className="col-span-2 flex items-center justify-center gap-3">
          <button
            className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors shadow-sm"
            onClick={() => onPreview(business)}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors shadow-sm"
            onClick={() => onReject(business._id || business.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-8 pb-8 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {/* Business Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Business Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Building className="w-4 h-4 text-blue-600" />
                  <span>Name: {businessData.businessName || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Sector:</span>
                  <span className="capitalize">{businessData.businessSector || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Email:</span>
                  <span>{businessData.email || 'N/A'}</span>
                </div>
                {businessData.taxCode && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Tax Code:</span>
                    <span>{businessData.taxCode}</span>
                  </div>
                )}
                {businessData.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>Address: {businessData.address}</span>
                  </div>
                )}
                {business.businessId && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Business ID:</span>
                    <span className="font-mono text-xs">{business.businessId}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Representative Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Representative Details</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Name:</span>
                  <span>{representativeData.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Email:</span>
                  <span>{representativeData.email || 'N/A'}</span>
                </div>
                {representativeData.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Phone:</span>
                    <span>{representativeData.phone}</span>
                  </div>
                )}
                {representativeData.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>Address: {representativeData.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h5 className="font-medium text-gray-800 text-sm mb-2">Account Owner</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Name:</span>
                    <span>{userData.name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Email:</span>
                    <span>{userData.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Role:</span>
                    <span className="capitalize">{userData.role || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Verified:</span>
                    <span className={userData.isVerified ? 'text-green-600' : 'text-orange-600'}>
                      {userData.isVerified ? 'Yes' : 'No'}
                    </span>
                  </div>
                  {userData.businessInfo?.role && (
                    <div className="flex items-center gap-3">
                      <Users className="w-4 h-4 text-orange-600" />
                      <span>Business Role: {userData.businessInfo.role}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description & Documents */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Description & Documents</h4>
              <div className="text-sm text-gray-600 leading-relaxed mb-4">
                {businessData.description || 'No description provided.'}
              </div>

              {/* Business Logo */}
              {businessData.logo && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">Business Logo:</div>
                  <div className="relative w-24 h-24">
                    <Image
                      src={businessData.logo}
                      alt="Business Logo"
                      width={96}
                      height={96}
                      className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                    />
                  </div>
                </div>
              )}

              {/* Document Images */}
              {businessData.docImages && businessData.docImages.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">Business Documents:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {businessData.docImages.map((doc: string, index: number) => (
                      <div key={index} className="relative">
                        <Image
                          src={doc}
                          alt={`Document ${index + 1}`}
                          width={150}
                          height={100}
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="absolute bottom-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                          Doc {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Request Meta Information */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4 text-base">Business Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Request Type</div>
                <div className="font-semibold text-lg">{business.type?.replace('_', ' ') || 'Business'}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Status</div>
                <div className={`font-semibold text-lg ${
                  business.status === 'approved' ? 'text-green-600' :
                  business.status === 'rejected' ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {business.status || 'Pending'}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Business Sector</div>
                <div className="font-semibold text-lg capitalize">{businessData.businessSector || 'N/A'}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Created</div>
                <div className="font-semibold text-lg">{business.createdAt ? formatDate(business.createdAt) : 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
