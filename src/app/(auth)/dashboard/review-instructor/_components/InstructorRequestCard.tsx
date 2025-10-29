'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Trash2, ChevronDown, ChevronUp, MapPin, Briefcase, Calendar, Star } from 'lucide-react';
import { StatusBadge } from '@/components/review-common';

interface InstructorRequestCardProps {
  request: any;
  onPreview: (request: any) => void;
  onReject: (id: string) => void;
  index: number;
}

export default function InstructorRequestCard({ request, onPreview, onReject, index }: InstructorRequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const instructorData = request.data || {};
  const userData = request.userId || {};

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
      {/* Main Row */}
      <div className="grid grid-cols-12 gap-8 px-8 py-8 items-start hover:bg-gray-50 transition-colors">
        {/* Instructor Info */}
        <div className="col-span-3 flex items-center gap-4">
          {userData.avatar?.url ? (
            <Image
              src={userData.avatar.url}
              alt="avatar"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-white shadow-md"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
              {(instructorData.fullName || userData.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <div className="font-semibold text-gray-900 text-base leading-6">{instructorData.fullName || userData.name || 'N/A'}</div>
            <div className="text-xs text-gray-500 leading-5 max-w-[220px] truncate">{instructorData.email || userData.email || 'N/A'}</div>
            <div className="text-xs text-blue-600 font-medium leading-5">{instructorData.role || 'Instructor'}</div>
          </div>
        </div>

        {/* Company & Experience */}
        <div className="col-span-4 flex items-start pl-2 md:pl-4">
          <div className="space-y-2">
            <div className="font-semibold text-gray-900 text-base line-clamp-1">{instructorData.company || 'N/A'}</div>
            <div className="text-sm text-gray-500 line-clamp-1">{instructorData.experience ? `${instructorData.experience} years experience` : 'No experience provided'}</div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-2 font-medium"
            >
              {isExpanded ? 'Show less' : 'Show more'}
              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Request Date */}
        <div className="col-span-2 flex items-center">
          <span className="text-gray-700 font-medium text-sm">
            {request.createdAt ? formatDate(request.createdAt) : 'N/A'}
          </span>
        </div>

        {/* Status */}
        <div className="col-span-1 flex items-center justify-center">
          <StatusBadge status={request.status || 'pending'} />
        </div>

        {/* Action */}
        <div className="col-span-2 flex items-center justify-center gap-3">
          <button
            className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors shadow-sm"
            onClick={() => onPreview(request)}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors shadow-sm"
            onClick={() => onReject(request._id || request.id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-8 pb-8 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Personal Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Full Name:</span>
                  <span>{instructorData.fullName || userData.name || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">Email:</span>
                  <span>{instructorData.email || userData.email || 'N/A'}</span>
                </div>
                {instructorData.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Phone:</span>
                    <span>{instructorData.phoneNumber}</span>
                  </div>
                )}
                {instructorData.dob && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>DOB: {formatDate(instructorData.dob)}</span>
                  </div>
                )}
                {instructorData.address && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-green-600" />
                    <span>Address: {instructorData.address}</span>
                  </div>
                )}
                {userData.age && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Age:</span>
                    <span>{userData.age} years old</span>
                  </div>
                )}
              </div>
            </div>

            {/* Professional Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Professional Details</h4>
              <div className="space-y-3 text-sm">
                {instructorData.company && (
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-purple-600" />
                    <span>Company: {instructorData.company}</span>
                  </div>
                )}
                {instructorData.category && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Category:</span>
                    <span className="capitalize">{instructorData.category}</span>
                  </div>
                )}
                {instructorData.experience && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Experience:</span>
                    <span>{instructorData.experience} years</span>
                  </div>
                )}
                {userData.rating && (
                  <div className="flex items-center gap-3">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Rating: {userData.rating}/5</span>
                  </div>
                )}
                {userData.student && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500">Students:</span>
                    <span>{userData.student}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description & Documents */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Description & Documents</h4>
              <div className="text-sm text-gray-600 leading-relaxed mb-4">
                {instructorData.description || userData.introduce || 'No description provided.'}
              </div>
              {instructorData.documents && instructorData.documents.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-700">Uploaded Documents:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {instructorData.documents.map((doc: string, index: number) => (
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
            <h4 className="font-semibold text-gray-900 mb-4 text-base">Request Summary</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Request Type</div>
                <div className="font-semibold text-lg">{request.type?.replace('_', ' ') || 'Instructor'}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Status</div>
                <div className={`font-semibold text-lg capitalize ${
                  request.status === 'approved' ? 'text-green-600' :
                  request.status === 'rejected' ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {request.status || 'Pending'}
                </div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Category</div>
                <div className="font-semibold text-lg capitalize">{instructorData.category || 'N/A'}</div>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="text-gray-500 mb-1">Role</div>
                <div className="font-semibold text-lg capitalize">{instructorData.role || userData.role || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
