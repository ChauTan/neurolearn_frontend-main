'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Eye, Trash2, ChevronDown, ChevronUp, Clock, Users, BookOpen, DollarSign } from 'lucide-react';
import { StatusBadge } from '@/components/review-common';
import { CourseApprovalRequest } from '@/lib/redux/features/request/requestApi';

interface CourseRequestCardProps {
  request: CourseApprovalRequest;
  onPreview: (request: CourseApprovalRequest) => void;
  onReject: (id: string) => void;
  index: number;
}

export default function CourseRequestCard({ request, onPreview, onReject, index }: CourseRequestCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const courseData = request.data?.course || request.courseId || {};
  const sectionsData = request.data?.sections || [];
  const userData = request.userId || {};

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
      {/* Main Row */}
      <div className="grid grid-cols-12 gap-8 px-8 py-8 items-start hover:bg-gray-50 transition-colors">
        {/* Instructor */}
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
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md ring-2 ring-white">
              {(userData.name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-1">
            <div className="font-semibold text-gray-900 text-base leading-6">{userData.name || 'N/A'}</div>
            <div className="text-xs text-gray-500 leading-5 max-w-[220px] truncate">{userData.email || 'N/A'}</div>
            <div className="text-xs text-blue-600 font-medium leading-5">{userData.profession || 'Instructor'}</div>
          </div>
        </div>

        {/* Course Title */}
        <div className="col-span-4 flex items-start pl-2 md:pl-4">
          <div className="space-y-2">
            <div className="font-semibold text-gray-900 text-base leading-6 line-clamp-2">{courseData.name || 'N/A'}</div>
            <div className="text-sm text-gray-500 leading-5 line-clamp-1">{courseData.subTitle || ''}</div>
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
            {request.createdAt ? new Date(request.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
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
            onClick={() => onReject((request as any)._id)}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-8 pb-8 border-t border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {/* Course Thumbnail */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Course Preview</h4>
              <Image
                src={courseData.thumbnail?.url || '/assets/business/book.svg'}
                alt={courseData.name || 'Course thumbnail'}
                width={300}
                height={200}
                className="w-full h-36 object-cover rounded-xl shadow-sm"
              />
            </div>

            {/* Course Details */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Course Information</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span>Price: {courseData.price ? formatPrice(courseData.price) : 'Free'}</span>
                </div>
                {courseData.estimatedPrice && (
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span className="line-through text-gray-500">
                      Original: {formatPrice(courseData.estimatedPrice)}
                    </span>
                  </div>
                )}
                {courseData.duration && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <span>Duration: {formatDuration(courseData.duration)}</span>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>Sections: {sectionsData.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>
                    Lessons: {sectionsData.reduce((total: number, section: any) => total + (section.lessons?.length || 0), 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Description */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 text-base">Description</h4>
              <p className="text-sm text-gray-600 line-clamp-4 leading-relaxed">
                {courseData.description || courseData.overview || 'No description provided.'}
              </p>
              {courseData.benefits && courseData.benefits.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-gray-800 text-sm mb-2">Benefits:</h5>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {courseData.benefits.slice(0, 3).map((benefit: any, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 font-bold">•</span>
                        {benefit.title}
                      </li>
                    ))}
                    {courseData.benefits.length > 3 && (
                      <li className="text-gray-400 text-xs">+{courseData.benefits.length - 3} more...</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Request Meta Information */}
          {request.data?.meta && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4 text-base">Request Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-gray-500 mb-1">Sections</div>
                  <div className="font-semibold text-lg">{sectionsData.length}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-gray-500 mb-1">Lessons</div>
                  <div className="font-semibold text-lg">{sectionsData.reduce((total: number, section: any) => total + (section.lessons?.length || 0), 0)}</div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-gray-500 mb-1">Draft Changes</div>
                  <div className={`font-semibold text-lg ${request.data.meta.summary.hasDraftChanges ? 'text-orange-600' : 'text-green-600'}`}>
                    {request.data.meta.summary.hasDraftChanges ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="text-gray-500 mb-1">Request Type</div>
                  <div className="font-semibold text-lg capitalize">{request.type.replace('_', ' ')}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
