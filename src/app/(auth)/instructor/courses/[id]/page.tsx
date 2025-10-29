'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import CourseInformationSection from './_components/CourseInformationSection';
import CourseCurriculumSection from './_components/CourseCurriculumSection';
import { useGetCategoryQuery } from '@/lib/redux/features/course/category/categoryApi';
import Loading from '@/components/common/Loading';
import { useSelector } from 'react-redux';

interface Lesson {
    id: string;
    type: 'video' | 'document' | 'quiz';
    title: string;
    url?: string;
    thumbnail?: string;
}

interface Section {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface CourseInfoModel {
    title: string;
    subTitle?: string;
    category: string;
    skillLevel: string;
    originalPrice: number; // == price
    salePrice?: number;    // == estimatedPrice
    duration?: number;     // minutes
    description: string;
    overview?: string;
    thumbnail: string;
    prerequisites: string[];
    benefits: string[];
    curriculum: Section[];
}

const ReviewCoursePage: React.FC = () => {
    const { id: courseId } = useParams();
    const [course, setCourse] = React.useState<any>(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const router = useRouter();
    const { user } = useSelector((state: any) => state.auth);
    const role = user?.role;
    const [ready, setReady] = useState(false);
    const didFetch = React.useRef(false);

    // Mark as client-ready to avoid hydration flicker
    useEffect(() => setReady(true), []);

    // Redirect when not instructor
    useEffect(() => {
        if (!ready) return;
        if (role === undefined) return;
        if (role !== 'instructor') {
            router.replace('/'); // send non-instructor to home
        }
    }, [ready, role, router]);


    // Fetch via the same API used by CoursePage
    React.useEffect(() => {
        if (!courseId || didFetch.current) return; // ✅ chặn lần 2 ở StrictMode
        didFetch.current = true;

        (async () => {
            setLoading(true);
            setError(null);
            try {
                const url = `${process.env.NEXT_PUBLIC_SERVER_URI}/courses/review/${encodeURIComponent(String(courseId))}`;
                const res = await fetch(url, { credentials: 'include', cache: 'no-store' });
                const json = await res.json();

                const payload =
                    json?.course ??
                    json?.courses ??
                    json?.data?.course ??
                    (typeof json?.data === 'object' ? json.data : null);

                if (res.ok && payload) setCourse(payload);
                else setError(json?.message || json?.error || `HTTP ${res.status}`);
            } catch (e: any) {
                setError(e?.message || 'Không thể tải dữ liệu khóa học.');
            } finally {
                setLoading(false);
            }
        })();
    }, [courseId]);

    // --- Category name (API returns ID) ---
    const categoryId = React.useMemo(() => {
        const cat = course?.category;
        if (!cat) return '';
        if (typeof cat === 'string') return cat;
        if (typeof cat === 'object') return cat?._id ?? '';
        return '';
    }, [course]);

    const { data: categoryRes } = useGetCategoryQuery(categoryId, { skip: !categoryId });
    // Be tolerant to different shapes
    const categoryTitle =
        (typeof course?.category === 'object' && course?.category?.title) ||
        (categoryRes as any)?.data?.title ||
        (categoryRes as any)?.category?.title ||
        (categoryRes as any)?.title ||
        'N/A';

    // --- Build curriculum (supports new `items[]` and legacy `lessons[]`) ---
    const curriculum: Section[] = React.useMemo(() => {
        if (!course?.sections) return [];
        const out: Section[] = [];

        for (const sec of course.sections) {
            const sectionId = String(sec._id ?? sec.id ?? crypto.randomUUID());
            const sectionTitle = String(sec.title ?? sec.name ?? 'Untitled Section');

            const lessons: Lesson[] = [];

            if (Array.isArray(sec.items) && sec.items.length) {
                for (const it of sec.items) {
                    const kind = String(it?.kind ?? '').toLowerCase();
                    const baseTitle = it?.title ?? it?.payload?.title ?? 'Untitled';
                    const id = String(it?._id ?? crypto.randomUUID());

                    if (kind === 'lesson') {
                        lessons.push({
                            id,
                            type: 'video',
                            title: String(baseTitle),
                            url: it?.payload?.videoUrl?.url || undefined,
                            thumbnail: it?.payload?.thumbnail?.url || undefined,
                        });
                    } else if (kind === 'quiz') {
                        lessons.push({ id, type: 'quiz', title: String(baseTitle) });
                    } else if (kind === 'document') {
                        lessons.push({
                            id,
                            type: 'document',
                            title: String(baseTitle),
                            url: it?.payload?.url || undefined,
                            thumbnail: it?.payload?.thumbnail?.url || undefined,
                        });
                    }
                }
            } else if (Array.isArray(sec.lessons)) {
                for (const l of sec.lessons) {
                    lessons.push({
                        id: String(l?._id ?? crypto.randomUUID()),
                        type: 'video',
                        title: String(l?.title ?? 'Untitled'),
                        url: l?.videoUrl?.url || undefined,
                        thumbnail: l?.thumbnail?.url || undefined,
                    });
                }
            }

            out.push({ id: sectionId, title: sectionTitle, lessons });
        }

        return out;
    }, [course]);

    if (loading) {
        return <div className="w-full"><Loading /></div>;
    }

    if (error || !course) {
        return (
            <div className="p-10 text-center text-gray-500">
                {error || 'Unable to load course data.'}
            </div>
        );
    }

    const prerequisites: string[] = Array.isArray(course.prerequisites)
        ? course.prerequisites.map((p: any) => String(p?.title ?? p)).filter(Boolean)
        : [];

    const benefits: string[] = Array.isArray(course.benefits)
        ? course.benefits.map((b: any) => String(b?.title ?? b)).filter(Boolean)
        : [];

    const skillLevel =
        typeof course.level === 'object' && course.level !== null
            ? (course.level.name ?? 'N/A')
            : (course.level ?? 'N/A');

    // IMPORTANT: Match "Create Course" semantics
    // - Original Price = price
    // - Sale Price     = estimatedPrice
    const courseInfo: CourseInfoModel = {
        title: course.name ?? '',
        subTitle: course.subTitle ?? '',
        category: categoryTitle,
        skillLevel,
        originalPrice: Number(course.price ?? 0),
        salePrice: course.estimatedPrice ?? undefined,
        duration: course.durationText ?? undefined,
        description: course.description ?? '',
        overview: course.overview ?? '',
        thumbnail: course.thumbnail?.url || '',
        prerequisites,
        benefits,
        curriculum,
    };
    // While checking/redirecting, render nothing (or your <Loading/>)
    if (!ready || role !== 'instructor') return <Loading message="Redirecting..." className="min-h-screen" />;
    return (
        <div className="min-h-screen bg-white font-sans rounded-xl">
            <div className="mx-auto max-w-6xl shadow-lg">
                <div className="p-8">
                    <CourseInformationSection course={courseInfo} />
                    <div className="my-8 h-px bg-gray-200" />
                    <CourseCurriculumSection curriculum={curriculum} />
                </div>
            </div>
        </div>
    );
};

export default ReviewCoursePage;
