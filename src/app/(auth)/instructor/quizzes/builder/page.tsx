// app/(auth)/dashboard/create-quiz/builder/page.tsx
'use client';

import QuizBuilderPage from '@/app/(auth)/instructor/quizzes/_components/QuizBuilderPage'; // Điều chỉnh đường dẫn
import Loading from '@/components/common/Loading';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function NewQuizPage() {
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
  // QuizBuilderPage sẽ tự động ở chế độ tạo mới vì không có params.quizId
  return <QuizBuilderPage />;
}
