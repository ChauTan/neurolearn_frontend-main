import { useState, useCallback } from 'react';

export const useFirebaseAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error,] = useState<string | null>(null);

  // Tạo một mock user để sử dụng với Firestore
  const createMockUser = useCallback(() => {
    return {
      uid: `user_${Date.now()}`,
      isAnonymous: true,
      displayName: 'Anonymous User'
    };
  }, []);

  const signInAnonymouslyIfNeeded = useCallback(async () => {
    try {
      setLoading(true);
      // Tạo mock user thay vì sử dụng Firebase Auth
      const mockUser = createMockUser();
      setUser(mockUser);
      return mockUser;
    } catch (error) {
      console.error('Mock sign-in failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [createMockUser]);

  return {
    user,
    loading,
    error,
    signInAnonymouslyIfNeeded
  };
}; 