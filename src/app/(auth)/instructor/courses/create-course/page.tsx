'use client';
import { useEffect, useState } from "react";
import CourseCreationForm from "./_components/step1/CourseCreationForm";
import { Course } from "@/types/course";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Loading from "@/components/common/Loading";

export default function CreateCoursePage() {
    const [formData, setFormData] = useState<Partial<Course>>({});
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
        <CourseCreationForm
            isEdit={false} 
            formData={formData}
            setFormData={setFormData}
        />
    );
}
