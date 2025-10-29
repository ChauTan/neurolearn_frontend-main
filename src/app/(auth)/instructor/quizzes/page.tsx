// app/(auth)/dashboard/create-quiz/page.tsx
'use client';

import QuizListPage from '@/app/(auth)/instructor/quizzes/_components/QuizListPage'; // Điều chỉnh đường dẫn nếu cần
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ListQuizzesPage() {
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);
  const role = user?.role;
  const [ready, setReady] = useState(false);

  // Mark as client-ready to avoid hydration flicker
  useEffect(() => setReady(true), []);

  // Redirect when not instructor
  useEffect(() => {
    if (!ready) return;
    if (role !== 'instructor') {
      // router.replace('/'); // send non-instructor to home
    }
  }, [ready, role, router]);

  // While checking/redirecting, render nothing (or your <Loading/>)
  if (!ready || role !== 'instructor') return <Loading message="Redirecting..." className="min-h-screen" />;
  return (
    <div className="min-h-screen">
      <QuizListPage />
    </div>
  );
}
