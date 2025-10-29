import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getOrCreateBusinessGroupChat } from '@/lib/firestore/chat';
import { useFirebaseAuth } from './useFirebaseAuth';
import axios from 'axios';

export const useBusinessGroupChat = (businessId: string) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useSelector((state: any) => state.auth);
  const { user: firebaseUser, signInAnonymouslyIfNeeded } = useFirebaseAuth();

  const initializeBusinessGroupChat = async () => {
    if (!businessId || !user?._id || isInitialized) {
      console.log('Skipping initialization:', { businessId, userId: user?._id, isInitialized });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Starting business group chat initialization for businessId:', businessId);
      
      // Ensure mock user is created for Firestore
      await signInAnonymouslyIfNeeded();

      // Lấy thông tin business
      const businessResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/business/me`,
        { withCredentials: true }
      );

      const businessName = businessResponse.data.business?.businessName || 'Business';
      console.log('Business name:', businessName);

      // Lấy danh sách employees hiện tại
      const employeesResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/business/${businessId}/visible-employees`,
        { withCredentials: true }
      );

      const currentEmployees = employeesResponse.data.employees || [];
      const employeeIds = currentEmployees
        .filter((emp: any) => emp.user && emp.user._id !== user._id)
        .map((emp: any) => emp.user._id);

      const employeeNames: Record<string, string> = {};
      currentEmployees.forEach((emp: any) => {
        if (emp.user) {
          employeeNames[emp.user._id] = emp.user.name;
        }
      });

      console.log('Current employees (excluding admin):', employeeIds);
      console.log('Employee names:', employeeNames);

      // Tạo hoặc lấy business group chat
      await getOrCreateBusinessGroupChat(
        businessId,
        businessName,
        user._id,
        employeeIds,
        employeeNames
      );

      console.log('Business group chat initialized successfully');
      setIsInitialized(true);
    } catch (err) {
      console.error('Error initializing business group chat:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize group chat');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (businessId && user && !isInitialized) {
      initializeBusinessGroupChat();
    }
  }, [businessId, user, isInitialized]); // Removed firebaseUser from dependencies

  return {
    isInitialized,
    isLoading,
    error,
    initializeBusinessGroupChat,
    firebaseUser
  };
}; 