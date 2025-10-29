// app/(auth)/instructor/courses/create-course/_components/step2/PickQuizToAddModal.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common/ui/Button2";
import { useGetAllQuizzesQuery } from "@/lib/redux/features/quiz/quizApi";
import { toast } from "@/hooks/use-toast";
import { Search, ListChecks, RefreshCw, CheckCircle2, FolderOpen } from "lucide-react";
import QuizCard from "@/app/(auth)/instructor/quizzes/_components/QuizCard";

type Props = {
    courseId?: string;
    onSubmit: (payload: { quizId: string; position?: number }) => Promise<any> | any;
    onClose: () => void;
};

type Quiz = {
    _id: string;
    name?: string;
    examTitle?: string;
    totalQuestions?: number;
    category?: string;
    duration?: string;
    progress?: number;
    createdAt?: string;
    [k: string]: any;
};

const DIFFICULTIES = ["all", "easy", "medium", "hard"] as const;

export default function PickQuizToAddModal({ onSubmit, onClose }: Props) {
    const [q, setQ] = useState("");
    const [difficulty, setDifficulty] = useState<(typeof DIFFICULTIES)[number]>("all");
    const [selected, setSelected] = useState<string>("");
    const [position, setPosition] = useState<string>("");

    const {
        data,
        isLoading,
        isError,
        error,
        refetch,
        isFetching,
    } = useGetAllQuizzesQuery(
        { difficulty: difficulty === "all" ? undefined : difficulty },
        { refetchOnMountOrArgChange: true }
    );

    // 🔹 Helper nhỏ trong file: chuẩn hoá lỗi từ RTK/BE và bắn toast
    const showApiError = (err: any, fallback = "Request failed") => {
        let message = fallback;
        let details: string[] = [];

        const toArray = (val: any): string[] => {
            if (!val) return [];
            if (Array.isArray(val)) {
                return val
                    .map((x) =>
                        typeof x === "string" ? x : x?.msg || x?.message || x?.error || ""
                    )
                    .filter(Boolean);
            }
            if (typeof val === "object") {
                const out: string[] = [];
                for (const [k, v] of Object.entries(val)) {
                    if (Array.isArray(v)) v.forEach((s) => out.push(`${k}: ${s}`));
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
                message = data?.message || data?.error || (err as any)?.error || fallback;
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
                message = data?.message || (data as any)?.error || fallback;
                details = toArray((data as any)?.errors);
            }
        }

        toast({
            title: "Error",
            description:
                details.length > 0 ? (
                    <ul className="list-disc pl-4">
                        {details.map((d, i) => (
                            <li key={i}>{d}</li>
                        ))}
                    </ul>
                ) : (
                    <span>{message}</span>
                ),
            variant: "destructive",
            duration: 6000,
        });
    };

    const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
    useEffect(() => {
        const fromApi: Quiz[] = (data as any)?.quizzes ?? (data as any)?.data ?? [];
        const map = new Map<string, Quiz>();
        for (const item of fromApi) {
            if (!item?._id) continue;
            if (!map.has(item._id)) map.set(item._id, item);
        }
        setAllQuizzes(Array.from(map.values()).sort((a, b) => a._id.localeCompare(b._id)));
    }, [data]);

    useEffect(() => {
        if (selected && !allQuizzes.some((x) => x._id === selected)) setSelected("");
    }, [allQuizzes, selected]);

    const [loadErrorToasted, setLoadErrorToasted] = useState(false);
    useEffect(() => {
        if (isError && !loadErrorToasted) {
            showApiError(error, "Failed to load quizzes.");
            setLoadErrorToasted(true);
        }
    }, [isError, error, loadErrorToasted]); // eslint-disable-line

    const visibleQuizzes = useMemo(() => {
        const term = q.trim().toLowerCase();
        if (!term) return allQuizzes;
        return allQuizzes.filter((it) =>
            (it?.name || it?.examTitle || "").toLowerCase().includes(term)
        );
    }, [allQuizzes, q]);

    const toggleSelected = (id: string) => {
        setSelected((prev) => (prev === id ? "" : id));
    };

    const handleConfirm = async () => {
        if (!selected) {
            toast({
                title: "Select a quiz",
                description: "Please select a quiz to add to the section.",
                variant: "destructive",
            });
            return;
        }
        const posNum = position.trim() === "" ? undefined : Number(position);
        const finalPos = Number.isFinite(posNum as number) ? (posNum as number) : undefined;

        try {
            const res: any = await onSubmit({ quizId: selected, position: finalPos });
            const ok = res?.success ?? true;
            const name =
                res?.quiz?.name ||
                allQuizzes.find((x) => x._id === selected)?.name ||
                res?.quiz?.examTitle ||
                allQuizzes.find((x) => x._id === selected)?.examTitle;

            if (ok) {
                toast({
                    title: "Success",
                    description: name ? `Quiz "${name}" added to section.` : "Quiz added to section.",
                    variant: "success",
                });
                onClose();
            } else {
                throw { data: { message: res?.message || "Failed to add quiz." } };
            }
        } catch (err) {
            showApiError(err, "Failed to add quiz. Please try again.");
        }
    };

    // ✅ Chỉ scroll nếu số quiz hiển thị > 4
    const shouldScroll = visibleQuizzes.length > 4;

    return (
        <div
            className="
        w-full h-full flex flex-col overflow-hidden
        rounded-3xl border border-slate-100/70
        bg-gradient-to-br from-white to-slate-50
        [@supports(backdrop-filter:blur(0))]:bg-white/80
        [@supports(backdrop-filter:blur(0))]:backdrop-blur-xl
        shadow-xl
        dark:from-slate-900 dark:to-slate-950 dark:border-slate-800
      "
        >
            {/* Header */}
            <div
                className="
          sticky top-0 z-10 px-6 pt-6 pb-3 flex items-center gap-3
          bg-white/70 backdrop-blur-xl border-b border-slate-100
          dark:bg-slate-900/60 dark:border-slate-800
        "
            >
                <div
                    className="
            w-10 h-10 rounded-2xl grid place-items-center
            bg-gradient-to-br from-primary/15 to-primary/10 text-primary
            shadow-[0_4px_16px_rgba(59,130,246,0.15)]
          "
                >
                    <ListChecks size={18} />
                </div>
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Add an existing quiz
                    </h3>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                        Pick one of your quizzes to attach to this section.
                    </p>
                </div>

                <div className="ml-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="
              gap-2 rounded-xl
              shadow-[0_1px_2px_rgba(0,0,0,0.05)]
              border-slate-200 dark:border-slate-700
            "
                    >
                        <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
                        Refresh
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="px-6 pb-5 pt-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <div className="relative w-full md:w-72">
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        <input
                            className="
                w-full rounded-2xl pl-9 pr-3 py-2.5 text-sm
                bg-white border border-slate-200
                shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                placeholder:text-slate-400
                focus:outline-none focus-visible:outline-none
                focus:ring-2 focus:ring-primary/20 focus:border-primary/40
                transition
                dark:bg-slate-900 dark:border-slate-700
              "
                            placeholder="Search quiz by name..."
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                        />
                    </div>

                    <select
                        className="
              rounded-2xl px-3 py-2.5 text-sm w-full md:w-48
              bg-white border border-slate-200
              shadow-[0_1px_2px_rgba(0,0,0,0.04)]
              focus:outline-none focus-visible:outline-none
              focus:ring-2 focus:ring-primary/20 focus:border-primary/40
              transition
              dark:bg-slate-900 dark:border-slate-700
            "
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as any)}
                    >
                        {DIFFICULTIES.map((d) => (
                            <option key={d} value={d}>
                                Difficulty: {d}
                            </option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-600 dark:text-slate-300">Insert at</label>
                        <input
                            type="number"
                            min={0}
                            className="
                w-24 rounded-2xl px-3 py-2.5 text-sm
                bg-white border border-slate-200
                shadow-[0_1px_2px_rgba(0,0,0,0.04)]
                focus:outline-none focus-visible:outline-none
                focus:ring-2 focus:ring-primary/20 focus:border-primary/40
                transition
                dark:bg-slate-900 dark:border-slate-700
              "
                            placeholder="end"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* List */}
            <div
                className={[
                    "relative z-0 px-6 pb-24",
                    shouldScroll ? "max-h-[400px] overflow-y-auto pr-2" : "",
                ].join(" ")}
            >
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="
                  rounded-2xl border border-slate-200 p-4
                  bg-gradient-to-br from-white to-slate-50
                  shadow-sm overflow-hidden relative
                  dark:from-slate-900 dark:to-slate-950 dark:border-slate-800
                "
                            >
                                <div className="h-4 bg-slate-200/70 rounded w-1/2 mb-2 animate-pulse" />
                                <div className="h-3 bg-slate-200/60 rounded w-1/3 mb-4 animate-pulse" />
                                <div className="h-3 bg-slate-200/50 rounded w-1/4 animate-pulse" />
                                <div className="absolute inset-0 -translate-x-full bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,.6)_50%,rgba(255,255,255,0)_100%)] animate-[shimmer_1.6s_infinite] [@keyframes_shimmer]:from-[-100%] [@keyframes_shimmer]:to-[100%]" />
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="p-4 text-sm text-red-600 border rounded-2xl bg-red-50/80 border-red-200 shadow-sm">
                        Failed to load quizzes. Please try again.
                    </div>
                    ) : visibleQuizzes.length === 0 ? (
                    <div
                        className="
              p-10 text-center text-sm text-slate-500 rounded-3xl
              bg-white/70 backdrop-blur-xl border border-slate-200 shadow-sm
              dark:bg-slate-900/60 dark:border-slate-800
            "
                    >
                        <div className="mx-auto mb-3 w-12 h-12 rounded-full grid place-items-center bg-slate-100 text-slate-500 shadow-inner">
                            <FolderOpen size={22} />
                        </div>
                        No quizzes found. Try adjusting filters or create a new quiz.
                    </div>
                ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                                    {visibleQuizzes.map((qz) => {
                                        const checked = selected === qz._id;
                                        return (
                                            <div
                                                key={qz._id}
                                                onClick={() => toggleSelected(qz._id)}
                                                role="radio"
                                                aria-checked={checked}
                                                className="group cursor-pointer rounded-3xl transition-all bg-transparent border-0 shadow-none relative"
                                            >
                                                {/* Selected badge */}
                                                <div className="absolute right-5 top-5 z-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm p-1.5">
                                                    <CheckCircle2 size={18} className={checked ? "text-emerald-600" : "text-slate-300"} />
                                                </div>

                                                <QuizCard
                                                    quiz={qz as any}
                                                    disableLink
                                                    hideOptions
                                                    isSelected={checked}
                                                    liftOnHover={false}
                                                    onClick={() => toggleSelected(qz._id)}
                                                    className="focus:outline-none focus-visible:outline-none"
                                                />
                                            </div>
                                        );
                                    })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div
                className="
          sticky bottom-0 z-10 px-6 py-4 flex items-center justify-end gap-3
          bg-white/70 backdrop-blur-xl border-t border-slate-100
          dark:bg-slate-900/60 dark:border-slate-800
          shadow-[0_-8px_24px_-20px_rgba(0,0,0,0.25)]
        "
            >
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="rounded-xl border-slate-200 dark:border-slate-700 shadow-sm"
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    onClick={handleConfirm}
                    disabled={!selected}
                    className="rounded-xl shadow-[0_8px_24px_-12px_rgba(59,130,246,0.35)]"
                >
                    Add Quiz
                </Button>
            </div>
        </div>
    );
}
