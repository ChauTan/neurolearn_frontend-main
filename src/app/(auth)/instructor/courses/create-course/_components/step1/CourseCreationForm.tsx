"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Course } from "@/types/course";
import {
    useCreateCourseMutation,
    useGetCourseByDetailQuery,
    useUpdateCourseMutation,
} from "@/lib/redux/features/course/courseApi";
import { useCreateCourseApprovalRequestMutation } from "@/lib/redux/features/request/requestApi";
import { useGetAllSectionsQuery, useCreateSectionMutation } from "@/lib/redux/features/course/section/sectionApi";
import { useCreateLessonMutation } from "@/lib/redux/features/course/section/lesson/lessonApi";
import HeaderStepControls from "./HeaderStepControls";
import { CourseInformationForm } from "./CourseInformationForm";
import { FileUploadArea } from "./FileUploadArea";
import CourseSectionList from "../step2/CourseSectionList";
import { ToastProvider, ToastViewport } from "@/components/common/ui/Toast";
import { useToast } from "@/hooks/use-toast";

// =========================
// Types
// =========================
export type CoursePackageItem = {
    package: string;
    quantity: number;
    price: number;
};

interface Props {
    formData: Partial<Course> & { coursePackage?: CoursePackageItem[] };
    setFormData: React.Dispatch<
        React.SetStateAction<Partial<Course> & { coursePackage?: CoursePackageItem[] }>
    >;
    courseId?: string | null;
    isEdit: boolean;
}
// =========================
// Small header (benefit-like)
// =========================
function SectionHeader({
    title,
    hint,
    required,
}: {
    title: string;
    hint?: string;
    required?: boolean;
}) {
    return (
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">{title}</h3>
                {required && (
                    <span className="text-xs text-red-500">*</span>
                )}
            </div>
            {hint && <span className="text-xs text-gray-500">{hint}</span>}
        </div>
    );
}

// =========================
// Course Packages Editor (benefit-like UI)
// =========================
function CoursePackageEditor({
    items,
    onChange,
    error,
}: {
    items: CoursePackageItem[];
    onChange: (next: CoursePackageItem[]) => void;
    error?: string;
}) {
    const addRow = () =>
        onChange([...(items || []), { package: "", quantity: 1, price: 0 }]);

    const updateRow = (idx: number, patch: Partial<CoursePackageItem>) => {
        const next = [...items];
        next[idx] = { ...next[idx], ...patch } as CoursePackageItem;
        onChange(next);
    };

    const removeRow = (idx: number) => {
        const next = items.filter((_, i) => i !== idx);
        onChange(next);
    };

    const toInt = (v: string) => {
        if (v === "") return 0;
        const n = parseInt(v, 10);
        return Number.isFinite(n) ? n : 0;
    };

    return (
        <div
            className={`w-full bg-white rounded-3xl p-6 shadow-sm ${error ? "ring-1 ring-red-500" : ""
                }`}
        >
            <SectionHeader title="Course packages" hint={`${items?.length || 0} item(s)`} />

            <p className="text-xs text-gray-500 mb-3">
                Add tiers like <strong>Basic</strong> / <strong>Pro</strong> / <strong>Team</strong>, each with its own quantity and price.
            </p>

            {error && <div className="mb-3 text-sm text-red-600">{error}</div>}

            {/* Header row (fixed columns, no scroll) */}
            <div className="grid grid-cols-[5fr_3fr_3fr_1fr] items-center text-xs text-gray-500 mb-2">
                <div>Package name</div>
                <div>Quantity</div>
                <div>Price</div>
                <div className="text-right">Remove</div>
            </div>

            {/* Data rows */}
            <div className="space-y-2">
                {items?.length ? (
                    items.map((pkg, idx) => (
                        <div
                            key={idx}
                            className="grid grid-cols-4 gap-3 overflow-x-auto items-center"
                        >
                            <input
                                type="text"
                                value={pkg.package}
                                onChange={(e) => updateRow(idx, { package: e.target.value })}
                                placeholder="e.g., Basic / Pro / Team"
                                className="h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2"
                                aria-label={`Package name #${idx + 1}`}
                            />

                            <input
                                type="number"
                                min={1}
                                step={1}
                                value={Number.isFinite(pkg.quantity) ? pkg.quantity : ("" as any)}
                                onChange={(e) => updateRow(idx, { quantity: toInt(e.target.value) })}
                                placeholder="1"
                                className="h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2"
                                aria-label={`Quantity #${idx + 1}`}
                            />

                            <input
                                type="number"
                                min={0}
                                step={1}
                                value={Number.isFinite(pkg.price) ? pkg.price : ("" as any)}
                                onChange={(e) => updateRow(idx, { price: toInt(e.target.value) })}
                                placeholder="0"
                                className="h-10 rounded-lg border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2"
                                aria-label={`Price #${idx + 1}`}
                            />

                            <div className="justify-self-end">
                                <button
                                    type="button"
                                    onClick={() => removeRow(idx)}
                                    className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                                    aria-label={`Remove package row ${idx + 1}`}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-500">
                        No packages yet. Click <span className="font-medium">“Add package”</span> to create one.
                    </div>
                )}
            </div>

            <div className="mt-4">
                <button
                    type="button"
                    onClick={addRow}
                    className="px-3 py-2 rounded-xl bg-blue-600 text-white text-sm hover:bg-blue-700"
                >
                    + Add package
                </button>
            </div>
        </div>
    );
}


// =========================
// Main form
// =========================
export default function CourseCreationForm({ formData, setFormData, courseId: propCourseId }: Props) {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState<1 | 2>(1);
    const [courseId, setCourseId] = useState<string | null>(propCourseId || null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSavingDraft, setIsSavingDraft] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [isContinuing, setIsContinuing] = useState(false);
    const [isContinuingAI, setIsContinuingAI] = useState(false);
    const [draftSaved, setDraftSaved] = useState(false);
    // Optional document to guide AI curriculum generation
    const [curriculumDoc, setCurriculumDoc] = useState<File | null>(null);
    const docInputRef = useRef<HTMLInputElement | null>(null);
    const [isDocDragOver, setIsDocDragOver] = useState(false);
    const handleDocDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDocDragOver(true);
    };
    const handleDocDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDocDragOver(false);
    };
    const handleDocDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDocDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) setCurriculumDoc(file);
    };
    const handleDocClick = () => {
        docInputRef.current?.click();
    };    
    const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        setCurriculumDoc(f || null);
    };

    const { data: courseData, isSuccess } = useGetCourseByDetailQuery(courseId as string, {
        skip: !courseId,
    });
    const { refetch: refetchAllSections } = useGetAllSectionsQuery(courseId!, { skip: !courseId });
    const [createCourse] = useCreateCourseMutation();
    const [updateCourse] = useUpdateCourseMutation();
    const [createCourseApprovalRequest] = useCreateCourseApprovalRequestMutation();
    const [createSection] = useCreateSectionMutation();
    const [createLesson] = useCreateLessonMutation();
    // Normalize API errors and show toast
    const showApiError = (err: any, fallback = "Request failed") => {
        let message = fallback;
        let details: string[] = [];

        const toArray = (val: any): string[] => {
            if (!val) return [];
            if (Array.isArray(val)) {
                return val
                    .map((x) => (typeof x === "string" ? x : x?.msg || x?.message || x?.error || ""))
                    .filter(Boolean);
            }
            if (typeof val === "object") {
                const out: string[] = [];
                for (const [k, v] of Object.entries(val)) {
                    if (Array.isArray(v)) (v as any[]).forEach((s) => out.push(`${k}: ${s}`));
                    else if (typeof v === "string") out.push(`${k}: ${v}`);
                }
                return out;
            }
            if (typeof val === "string") return [val];
            return [];
        };

        if (err && typeof err === "object" && "status" in err) {
            const data = (err as any).data;
            if (typeof data === "string") {
                message = data;
            } else {
                message = data?.message || data?.error || err?.error || fallback;
                details = toArray(data?.errors);
            }
        } else if (err instanceof Error) {
            message = err.message || fallback;
        } else if (typeof err === "string") {
            message = err;
        } else if (err && typeof err === "object") {
            const data = (err as any).data ?? err;
            if (typeof data === "string") {
                message = data;
            } else {
                message = data?.message || data?.error || fallback;
                details = toArray(data?.errors);
            }
        }

        toast({
            title: "Error",
            description:
                details.length > 0 ? (
                    <ul className="list-disc pl-4">{details.map((d, i) => (
                        <li key={i}>{d}</li>
                    ))}</ul>
                ) : (
                    <span>{message}</span>
                ),
            variant: "destructive",
            duration: 6000,
        });
    };

    // Prefill when editing
    useEffect(() => {
        if (isSuccess && (courseData as any)?.courses) {
            const course = (courseData as any).courses;
            setFormData({
                ...course,
                benefits: Array.isArray(course.benefits) ? course.benefits : [],
                prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites : [],
                coursePackage: Array.isArray(course.coursePackage)
                    ? (course.coursePackage as CoursePackageItem[])
                    : [],
            });
        }
    }, [isSuccess, courseData, setFormData]);

    // Prop -> state sync
    useEffect(() => {
        if (propCourseId && propCourseId !== courseId) setCourseId(propCourseId);
    }, [propCourseId, courseId]);

    // Seed one empty package row initially
    useEffect(() => {
        setFormData((prev) => {
            if (!prev?.coursePackage || prev.coursePackage.length === 0) {
                return {
                    ...prev,
                    coursePackage: [{ package: "", quantity: 1, price: 0 }],
                } as any;
            }
            return prev;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getPayload = () => {
        const data: any = formData;
        if (!data.name) throw new Error("Course title is required.");

        const extractId = (v: any) => (typeof v === "object" && v ? v._id : v);
        return {
            name: data.name,
            subTitle: data.subTitle || "",
            description: data.description || "",
            overview: data.overview || "",
            level: extractId(data.level),
            category: extractId(data.category),
            subCategory: extractId(data.subCategory),
            price: data.price || 0,
            estimatedPrice: data.estimatedPrice || 0,
            thumbnail: typeof data.thumbnail === "object" ? data.thumbnail : undefined,
            demoUrl: data.demoUrl || undefined,
            duration: data.duration || 0,
            topics: Array.isArray(data.tags) ? data.tags : [],
            benefits: Array.isArray(data.benefits) ? data.benefits : [],
            prerequisites: Array.isArray(data.prerequisites) ? data.prerequisites : [],
            isFree: data.isFree || false,
            isDraft: data.isDraft ?? true,
            isPublished: data.isPublished ?? false,
            coursePackage: Array.isArray(data.coursePackage)
                ? data.coursePackage.map((p: any) => ({
                    package: String(p.package || ""),
                    quantity: Number(p.quantity || 0),
                    price: Number(p.price || 0),
                }))
                : [],
        };
    };

    const validateForm = (): Record<string, string> => {
        const data: any = formData;
        const getId = (v: any) => (typeof v === "object" && v !== null ? v._id : v);
        const errs: Record<string, string> = {};

        if (!data.name?.trim()) errs.name = "Title is required";
        if (!getId(data.category)) errs.category = "Category is required";
        if (!getId(data.level)) errs.level = "Skill level is required";
        if (!data.description?.trim()) errs.description = "Description is required";
        if (data.price == null || data.price < 0) errs.price = "Price is required and must be >= 0";
        if (!data.duration || data.duration <= 0) errs.duration = "Duration must be greater than 0";

        const thumbnailUrl =
            typeof data.thumbnail === "string" ? data.thumbnail : data.thumbnail?.url;
        if (!thumbnailUrl?.trim()) errs.thumbnail = "Thumbnail is required";

        // Packages validation
        const pkgs: CoursePackageItem[] = Array.isArray(data.coursePackage)
            ? data.coursePackage
            : [];
        if (!pkgs.length) {
            errs.coursePackage = "At least one package is required";
        } else {
            pkgs.forEach((p, i) => {
                if (!p.package?.trim())
                    errs[`coursePackage_${i}_package`] = `Package name #${i + 1} is required`;
                if (!(Number(p.quantity) > 0))
                    errs[`coursePackage_${i}_quantity`] = `Quantity #${i + 1} must be > 0`;
                if (!(Number(p.price) >= 0))
                    errs[`coursePackage_${i}_price`] = `Price #${i + 1} must be >= 0`;
            });
            const detailErrors = Object.keys(errs).filter(
                (k) => k.startsWith("coursePackage_") && k !== "coursePackage"
            );
            if (detailErrors.length)
                errs.coursePackage = "Please review package fields.";
        }
        setErrors(errs);
        return errs;
    };

    const showValidationToast = (errs: Record<string, string>) => {
        const msgs = Object.values(errs);
        if (msgs.length > 0) {
            toast({
                title: "Validation Error",
                description: (
                    <ul className="list-disc pl-4">{msgs.map((m, i) => (
                        <li key={i}>{m}</li>
                    ))}</ul>
                ),
                variant: "destructive",
                duration: 5000,
            });
        }
    };

    const handleSaveDraft = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) return showValidationToast(errs);

        setIsSavingDraft(true);
        try {
            const payload = { ...getPayload(), isDraft: true } as any;
            if (courseId) {
                await (updateCourse as any)({ id: courseId, course: payload }).unwrap();
                toast({
                    title: "Draft updated",
                    description: "Successfully updated.",
                    variant: "success",
                });
            } else {
                const res = await (createCourse as any)(payload).unwrap();
                const newId = res?.courses?._id;
                if (!newId) throw new Error("No course ID returned.");
                setFormData((prev) => ({ ...prev, _id: newId }));
                setCourseId(newId);
                toast({
                    title: "Draft created",
                    description: "Successfully created.",
                    variant: "success",
                });
            }
            setDraftSaved(true);
        } catch (err) {
            showApiError(err, "Failed to save draft.");
        } finally {
            setIsSavingDraft(false);
        }
    };

    const handlePublishCourse = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) return showValidationToast(errs);
        if (!courseId) {
            await handleSaveDraft();
            if (!courseId) return;
        }

        setIsPublishing(true);
        try {
            // Fetch sections + lessons
            const fetch = await refetchAllSections();
            const sections = "data" in fetch ? ((fetch as any).data?.data || []) : [];

            if (!sections.length || !sections.some((s: any) => s.lessons?.length)) {
                    toast({
                        title: "Error",
                        description: "Course needs at least 1 section & lesson.",
                        variant: "destructive",
                    });
                    return;
                }

            // Update course before sending request
            const basePayload = { ...getPayload(), isDraft: false } as any;
            await (updateCourse as any)({ id: courseId, course: basePayload }).unwrap();

            // Snapshots
            const courseSnapshot = { _id: courseId, ...basePayload };
            const sectionsSnapshot = sections.map((sec: any) => ({
                _id: sec._id,
                title: sec.title,
                order: sec.order,
                isPublished: !!sec.isPublished,
                lessons: Array.isArray(sec.lessons)
                    ? sec.lessons.map((l: any) => ({
                        _id: l._id,
                        title: l.title,
                        order: l.order,
                        videoLength: l.videoLength,
                        videoUrl: l.videoUrl,
                    }))
                    : [],
            }));

            await (createCourseApprovalRequest as any)({
                courseId,
                message: "Requesting course approval",
                courseSnapshot,
                sectionsSnapshot,
            }).unwrap();

            toast({ title: "Success", description: "Submitted!", variant: "success" });
            router.push(`/instructor/courses/${courseId}`);
        } catch (err) {
            showApiError(err, "Failed to publish.");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleContinue = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) return showValidationToast(errs);
        setIsContinuing(true);
        try {
            if (!courseId) {
                const res = await (createCourse as any)({ ...getPayload(), isDraft: true }).unwrap();
                const newId = res?.courses?._id;
                if (!newId) throw new Error("No course ID returned.");
                setFormData((prev) => ({ ...prev, _id: newId }));
                setCourseId(newId);
                toast({ title: "Draft created", description: "Draft saved.", variant: "success" });
            }
            setStep(2);
        } catch (err) {
            showApiError(err, "Failed to continue.");
        } finally {
            setIsContinuing(false);
        }
    };
    const handleContinueAI = async () => {
        const errs = validateForm();
        if (Object.keys(errs).length > 0) return showValidationToast(errs);
        setIsContinuingAI(true);
        try {
            let id = courseId;
            if (!id) {
                const res = await (createCourse as any)({ ...getPayload(), isDraft: true }).unwrap();
                const newId = res?.courses?._id;
                if (!newId) throw new Error("No course ID returned.");
                setFormData((prev) => ({ ...prev, _id: newId }));
                setCourseId(newId);
                id = newId;
            }
            if (!id) throw new Error("Missing course id");

            const d: any = formData;
            const levelName =
                typeof d.level === "object"
                    ? d.level?.name || d.level?._id || ""
                    : String(d.level || "");

            const fd = new FormData();
            fd.append("mode", "curriculum");
            fd.append("prompt", "Generate a course curriculum.");
            fd.append("title", d.name || "");
            fd.append("subtitle", d.subTitle || "");
            fd.append("description", d.description || "");
            fd.append("overview", d.overview || "");
            fd.append("level", levelName);
            fd.append("duration", String(d.duration || ""));
            if (curriculumDoc) fd.append("file", curriculumDoc);

            const res = await fetch("/api/ai/summarize", { method: "POST", body: fd });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "AI generation failed");

            const curriculum = json?.curriculum;
            if (!curriculum || !Array.isArray(curriculum.sections))
                throw new Error("Invalid AI curriculum response");

            for (const section of curriculum.sections as Array<{
                title: string;
                description?: string;
                lessons?: Array<{ title: string; isFree?: boolean }>;
            }>) {
                const sectionPayload: any = {
                    title: section.title || "Section",
                    description: section.description || "",
                };
                const createdSec = await (createSection as any)({
                    courseId: id,
                    data: sectionPayload,
                }).unwrap();
                const secId = createdSec?.data?._id || createdSec?._id;
                if (!secId) continue;
                if (Array.isArray(section.lessons)) {
                    for (const lesson of section.lessons) {
                            await (createLesson as any)({
                                courseId: id,
                                sectionId: secId,
                                data: {
                                    title: lesson.title || "Lesson",
                                    isFree: lesson.isFree ?? false,
                                    isPublished: false,
                                },
                            }).unwrap();
                        }
                    }
                }

            toast({
                title: "AI Curriculum generated",
                description: "Sections and lessons created.",
                variant: "success",
            });
            setStep(2);
        } catch (e: any) {
            toast({
                title: "AI Error",
                description: e?.message || "Failed to generate curriculum.",
                variant: "destructive",
            });
        } finally {
            setIsContinuingAI(false);
        }
    };

    return (
        <ToastProvider>
            <main className="w-full h-full">
                <div className="flex flex-col gap-6 w-full">
                    <HeaderStepControls
                        step={step}
                        onContinue={handleContinue}
                        onContinueAI={handleContinueAI}
                        onBack={() => setStep(1)}
                        onSaveDraft={handleSaveDraft}
                        onPublish={handlePublishCourse}
                        draftSaved={draftSaved}
                        loading={{ continue: isContinuing, draft: isSavingDraft, publish: isPublishing, ai: isContinuingAI }}
                    />

                    {step === 1 && (
                        <section className="flex flex-row gap-6 items-start w-full max-w-[1120px] h-full">
                            <div className="w-4/5">
                                <CourseInformationForm
                                    key={courseId ?? "new-course"}
                                    formData={formData}
                                    setFormData={setFormData}
                                    courseId={courseId}
                                    errors={errors}
                                    setErrors={setErrors}
                                    onDraftSaved={(id) => {
                                        setFormData((prev) => ({ ...prev, _id: id }));
                                        setCourseId(id);
                                    }}
                                />
                            </div>
                            <div className="flex flex-col gap-6 w-2/5 ">
                                <FileUploadArea
                                    thumbnail={typeof formData.thumbnail === "object" ? formData.thumbnail : null}
                                    setThumbnail={(val) =>
                                        setFormData((prev) => ({ ...prev, thumbnail: typeof val === "string" ? { url: val } : val }))
                                    }
                                />
                                {/* Optional curriculum source document for AI */}
                                <div className="w-full bg-white rounded-3xl p-6 shadow-sm">
                                    <div className="font-medium mb-2">Curriculum source document (optional)</div>
                                    <p className="text-xs text-gray-500 mb-2">Provide a TXT / PDF / DOCX to guide AI when generating the course curriculum.</p>
                                    <button
                                        type="button"
                                        className={`flex flex-col justify-center items-center rounded-xl border-2 border-blue-600 border-dashed w-full h-64 cursor-pointer text-left p-0 ${isDocDragOver ? 'bg-blue-50' : ''}`}
                                        onDragOver={handleDocDragOver}
                                        onDragLeave={handleDocDragLeave}
                                        onDrop={handleDocDrop}
                                        onClick={handleDocClick}
                                        aria-label="Upload curriculum document"
                                    >
                                        <input
                                            ref={docInputRef}
                                            id="curriculum-doc-input"
                                            type="file"
                                            accept=".txt,.pdf,.docx"
                                            onChange={handleDocChange}
                                            className="hidden"
                                            aria-hidden="true"
                                            tabIndex={-1}
                                        />
                                        <div className="flex flex-col gap-2 items-center text-center pointer-events-none px-4">
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z" stroke="#2563eb" strokeWidth="1.5" />
                                                <path d="M14 2V8H20" stroke="#2563eb" strokeWidth="1.5" />
                                                <path d="M8 13H16" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M8 17H12" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                            <p className="text-sm leading-5 text-neutral-500">
                                                Drag and drop or <span className="font-bold text-blue-600">Choose File</span> (max 10MB)
                                            </p>
                                            {curriculumDoc && (
                                                <div className="text-xs text-gray-600 truncate w-full">Selected: {curriculumDoc.name}</div>
                                            )}
                                        </div>
                                    </button>
                                </div>

                                {/* Course packages (same width as cards above) */}
                                <CoursePackageEditor
                                    items={(formData as any).coursePackage || []}
                                    onChange={(next) =>
                                        setFormData((prev) => ({ ...(prev as any), coursePackage: next }))
                                    }
                                    error={errors.coursePackage}
                                />
                            </div>
                        </section>
                    )}


                    {step === 2 && courseId && (
                        <section className="w-full max-w-4xl mx-auto mt-8">
                            <CourseSectionList courseId={courseId} />
                        </section>
                    )}
                </div>
                <ToastViewport />
            </main>
        </ToastProvider>
    );
}