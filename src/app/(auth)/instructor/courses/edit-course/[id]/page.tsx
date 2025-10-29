"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useGetCourseByIdQuery } from "@/lib/redux/features/course/courseApi";
import { Course } from "@/types/course";
import CourseCreationForm from "../../create-course/_components/step1/CourseCreationForm";
import Loading from "@/components/common/Loading";
import { useSelector } from "react-redux";

export default function EditCoursePage() {
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
            router.replace('/'); // send non-instructor to home
        }
    }, [ready, role, router]);


    const params = useParams();
    const id =
        typeof params?.id === "string"
            ? params.id
            : Array.isArray(params?.id)
                ? params.id[0]
                : undefined;

    const [formData, setFormData] = useState<Partial<Course>>({});
    const [courseId, setCourseId] = useState<string | null>(id || null);
    const [isReady, setIsReady] = useState(false); // ✅ Flag để đảm bảo render sau khi set xong formData

    const {
        data: response,
        isLoading: loading,
        error,
    } = useGetCourseByIdQuery(id as string);

    const course = response?.courses;

    useEffect(() => {
        if (course) {
            setFormData({
                ...course,
                tags: course.tags || [],
                benefits: Array.isArray(course.benefits) ? course.benefits : [],
                prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites : [],
                duration: course.duration || 1,
            });
            setCourseId(course._id);
            setIsReady(true); // ✅ Chỉ cho render sau khi dữ liệu được xử lý xong
        }
    }, [course]);

    if (loading && id) {
        return (
            <div className="w-full">
                <Loading message="Loading..." />
            </div>
        );
    }
    // While checking/redirecting, render nothing (or your <Loading/>)
    if (!ready || role !== 'instructor') return <Loading message="Redirecting..." className="min-h-screen" />;
    if (error) return <div className="text-red-500">Error loading course</div>;

    if (course?.isPublished == true) {
        return (
            <div className="w-full text-center py-10">
                <p className="text-lg font-semibold text-gray-700">
                    This course has already been published and cannot be edited.
                </p>    
            </div>
        );
    }
    return (
        isReady && (
            <CourseCreationForm
                isEdit={true}
                formData={formData}
                setFormData={setFormData}
                courseId={courseId}
            />
        )
    );
}
