'use client';

import React from 'react';
import { useBusinessGroupChat } from '@/hooks/useBusinessGroupChat';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface BusinessGroupChatStatusProps {
  businessId: string;
}

const BusinessGroupChatStatus: React.FC<BusinessGroupChatStatusProps> = ({ businessId }) => {
  const { isInitialized, isLoading, error } = useBusinessGroupChat(businessId);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-blue-600">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Initializing group chat...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-sm text-red-600">
        <AlertCircle className="h-4 w-4" />
        <span>Group chat error: {error}</span>
      </div>
    );
  }

  if (isInitialized) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckCircle className="h-4 w-4" />
        <span>Group chat ready</span>
      </div>
    );
  }

  return null;
};

export default BusinessGroupChatStatus; 