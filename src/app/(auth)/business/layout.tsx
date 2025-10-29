'use client';

import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/Loading';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
    const role = user?.businessInfo?.role;
    const [ready, setReady] = useState(false);
  
    // Mark as client-ready to avoid hydration flicker
    useEffect(() => setReady(true), []);
  
    // Redirect when not business
    useEffect(() => {
      if (!ready) return;
      if (role === undefined) return;
      if (role !== 'employee' && role !== 'manager' && role !== 'admin') {
        router.replace('/');
      }
    }, [ready, role, router]);
  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || (role !== 'employee' && role !== 'manager' && role !== 'admin')) return <Loading message="Redirecting..." className="min-h-screen" />;
  return (
    <div className="flex justify-center min-h-screen">
      <div className="flex min-h-screen w-full max-w-7xl">
        {/* Sidebar chiếm 1/6 */}
        <div className="w-1/6 mt-6">
          <Sidebar />
        </div>
        {/* Nội dung chiếm 5/6 */}
        <div className="w-5/6 p-6">{children}</div>
      </div>
    </div>
  );
}
