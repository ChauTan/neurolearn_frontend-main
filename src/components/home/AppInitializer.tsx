'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/redux/hooks';
import { apiSlice } from '@/lib/redux/features/api/apiSlice';

const AppInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(apiSlice.endpoints.loadUser.initiate({}, { forceRefetch: true }));
  }, [dispatch]);

  return null; // Không render gì cả
};

export default AppInitializer;
