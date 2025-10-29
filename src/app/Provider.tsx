'use client';

import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/lib/redux/store';
import { SessionProvider } from 'next-auth/react';

interface ProviderProps {
  children: React.ReactNode;
}

// const clientId = process.env.AUTH_GOOGLE_ID!;

export function Providers({ children }: ProviderProps) {
  return (
    <ReduxProvider store={store}>
      <SessionProvider refetchOnWindowFocus={false} refetchInterval={0}>
        {children}
      </SessionProvider>
    </ReduxProvider>
  );
}
