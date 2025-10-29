// app/(auth)/dashboard/instructors/page.tsx
'use client';
import React, { useEffect, useState } from 'react';
import InstructorListPage from './_components/InstructorListPage';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Loading from '@/components/common/Loading';

export default function InstructorsPage() {
  const router = useRouter();
      const { user } = useSelector((state: any) => state.auth);
      const role = user?.role;
      const [ready, setReady] = useState(false);
    
      // Mark as client-ready to avoid hydration flicker
      useEffect(() => setReady(true), []);
    
    // Redirect when not admin
      useEffect(() => {
        if (!ready) return;
        if (role === undefined) return;
        if (role !== 'admin') {
          router.replace('/'); // send non-admin to home
        }
      }, [ready, role, router]);
  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'admin') return <Loading message="Redirecting..." className="min-h-screen" />;
  return (
    <div className=" ">
      <InstructorListPage />;
    </div>
  );
}
