// components/CourseStatus.tsx
import Image from "next/image";
import React from "react";

type InstructorCourse = {
  _id: string;
  name: string;
  thumbnail?: string;
  status: string;             // "draft" | "published" | ...
  stepsCompleted: number;
  stepsTotal: number;
};

type UserCourse = {
  _id: string;
  name: string;
  thumbnail?: string;
  status: string;             // "published" | "completed" | ...
  progressPercentage: number; // 0..100
  nextLesson?: { _id: string; title?: string } | null;
};

type Role = "instructor" | "user";

interface CourseStatusProps {
  isLoading: boolean;
  course?: InstructorCourse | UserCourse;
  /** Nếu không truyền, component sẽ tự suy ra dựa vào shape dữ liệu */
  role?: Role;
  /**
   * Callback khi bấm Continue/Resume
   * - Với role "user": trả thêm nextLessonId (nếu có)
   */
  onContinue?: (args: {
    courseId: string;
    role: Role;
    status: string;
    nextLessonId?: string | null;
  }) => void;
  className?: string;
}

export default function CourseStatus({
  isLoading,
  course,
  role,
  onContinue,
  className = "",
}: CourseStatusProps) {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl p-6 ${className}`}>
        <Header title="Course Status" />
        <div className="mt-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-2 bg-gray-100 rounded w-full" />
            </div>
            <div className="w-36 h-9 bg-gray-200 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`bg-white rounded-2xl p-6 ${className}`}>
        <Header title="Course Status" />
        <EmptyState />
      </div>
    );
  }

  // Tự suy role nếu không truyền
  const inferredRole: Role =
    role ??
    (hasInstructorFields(course) ? "instructor" : "user");


  // Chuẩn hoá dữ liệu về shape chung cho UI
  const normalized = normalizeCourse(course, inferredRole);

  const badgeColor =
    normalized.status === "published"
      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
      : normalized.status === "draft"
        ? "bg-yellow-50 text-yellow-700 ring-1 ring-yellow-100"
        : "bg-gray-100 text-gray-600";

  const showCTA =
    inferredRole === "instructor" ||
    (inferredRole === "user" && !normalized.isCompleted && !!normalized.nextLessonId);

  return (
    <div className={`bg-white rounded-2xl p-6 ${className}`}>
      <Header title="Course Status" />

      {/* Header row */}
      <div className="flex items-center text-gray-400 text-sm font-medium border-b pb-2">
        <div className="w-2/5">Course</div>
        <div className="w-2/5">Progress</div>
        <div className="w-1/5 text-right">
          {inferredRole === "user" ? "Resume" : "Active"}
        </div>
      </div>

      {/* Content row */}
      <div className="flex items-center pt-6 pb-4">
        {/* Course image + name */}
        {/* Course image + name */}
        <div className="flex items-start w-2/5 gap-4">
          <Thumb src={normalized.thumbnail} alt="Course Thumbnail" />
          <div className="flex flex-col">
            {/* Title + badge: căn baseline để không nhảy */}
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-semibold text-black leading-tight">
                {normalized.name}
              </span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full capitalize self-baseline ${badgeColor}`}
              >
                {normalized.status}
              </span>
            </div>

            {/* Next lesson */}
            {inferredRole === "user" &&
              normalized.nextLessonTitle &&
              !normalized.isCompleted && (
                <span className="text-xs text-gray-500 mt-1">
                  Next: {normalized.nextLessonTitle}
                </span>
              )}
          </div>
        </div>

        {/* Progress */}
        <div className="w-2/5 flex flex-col items-end pr-14">
          <span className="text-blue-600 text-sm mb-1">
            {inferredRole === "instructor"
              ? `${normalized.stepsCompleted}/${normalized.stepsTotal} steps`
              : `${Math.round(normalized.progressPercent)}%`}
          </span>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${normalized.isCompleted ? "bg-emerald-500" : "bg-blue-600"}`}
              style={{ width: `${normalized.progressPercent}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="w-1/5 flex justify-end">
          {showCTA ? (
            <button
              onClick={() =>
                onContinue?.({
                  courseId: normalized._id,
                  role: inferredRole,
                  status: normalized.status,
                  nextLessonId: normalized.nextLessonId ?? null,
                })
              }
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-2 rounded-full flex items-center gap-2 transition"
            >
              {inferredRole === "user" ? "Resume" : "Continue"}
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path
                  d="M13 5l7 7-7 7M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : (
            // Không hiện nút khi user đã completed.
            // Nếu muốn một nhãn nhỏ bên phải, bỏ comment dưới:
            // <span className="text-xs bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 px-2 py-1 rounded-full">
            //   Completed
            // </span>
            <div />
          )}
        </div>

      </div>
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function Header({ title }: { title: string }) {
  return <h2 className="text-2xl font-semibold mb-2 text-black">{title}</h2>;
}

function EmptyState() {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <div className="font-medium text-black">No courses yet.</div>
        <div className="text-sm text-gray-500">
          {`When you start a course, it will appear here.`}
        </div>
      </div>
      <div className="w-10 h-10 bg-gray-200 rounded-full" />
    </div>
  );
}

function Thumb({ src, alt }: { src?: string; alt: string }) {
  const fallback = "/images/course-placeholder.png"; // thay đường dẫn nếu cần
  return (
    <Image
      src={src || fallback}
      alt={alt}
      width={48}
      height={48}
      className="rounded-lg object-cover"
    />
  );
}

function hasInstructorFields(course: InstructorCourse | UserCourse): course is InstructorCourse {
  return (course as InstructorCourse).stepsTotal !== undefined;
}

function normalizeCourse(course: InstructorCourse | UserCourse, role: Role) {
  if (role === "instructor" && hasInstructorFields(course)) {
    const progressPercent =
      course.stepsTotal > 0 ? (course.stepsCompleted / course.stepsTotal) * 100 : 0;

    return {
      _id: course._id,
      name: course.name,
      thumbnail: course.thumbnail,
      status: course.status,
      // instructor-specific
      stepsCompleted: course.stepsCompleted,
      stepsTotal: course.stepsTotal,
      // shared
      progressPercent,
      isCompleted: progressPercent >= 100,
      nextLessonId: undefined as string | undefined,
      nextLessonTitle: undefined as string | undefined,
    };
  }

  // user
  const u = course as UserCourse;
  const progressPercent = Math.max(0, Math.min(100, u.progressPercentage ?? 0));

  return {
    _id: u._id,
    name: u.name,
    thumbnail: u.thumbnail,
    status: u.status,
    stepsCompleted: undefined as unknown as number,
    stepsTotal: undefined as unknown as number,
    progressPercent,
    isCompleted: progressPercent >= 100,
    nextLessonId: u.nextLesson?._id,
    nextLessonTitle: u.nextLesson?.title,
  };
}
