"use client";

import * as React from "react";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";
import { Course } from "@/types/course";
import { useGetCategoriesQuery } from "@/lib/redux/features/course/category/categoryApi";
import { useGetLevelsQuery } from "@/lib/redux/features/course/level/levelApi";
import { Plus, Trash2 } from "lucide-react";

/* ============================== Types =============================== */
interface CourseInformationFormProps {
    formData: Partial<Course>;
    setFormData: React.Dispatch<React.SetStateAction<Partial<Course>>>;
    courseId?: string | null;
    onDraftSaved?: (id: string) => void;
    errors?: Record<string, string>;
    setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

/* ============================ UI Helpers ============================ */
function SectionTitle({
    title,
    hint,
    required,
}: {
    title: string;
    hint?: string;
    required?: boolean;
}) {
    return (
        <header className="flex flex-col gap-2">
            <h2 className="text-xl md:text-2xl font-bold text-stone-950">
                {title} {required && <span className="text-red-500">*</span>}
            </h2>
            {hint ? <p className="text-xs text-blue-600">{hint}</p> : null}
        </header>
    );
}

/** Uncontrolled textarea: không “giật” khi gõ; commit lên parent khi blur / Ctrl+Enter */
function TextArea({
    label,
    value,
    onChange,
    required,
    error,
    placeholder,
}: {
    label: string;
    value?: string;
        onChange: (v: string) => void;
        required?: boolean;
        error?: string;
        placeholder?: string;
    }) {
    const ref = React.useRef<HTMLTextAreaElement>(null);

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-gray-900">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <textarea
                ref={ref}
                defaultValue={value || ""}
                placeholder={placeholder}
                className={`p-3 text-sm text-gray-900 rounded-lg border min-h-[120px] outline-none resize-y ${error
                    ? "border-red-500 ring-2 ring-red-500"
                    : "border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    }`}
                onBlur={() => onChange(ref.current?.value ?? "")}
                onKeyDown={(e) => {
                    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                        onChange(ref.current?.value ?? "");
                    }
                }}
                aria-invalid={!!error}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}

function ListRow({
    index,
    text,
    onRemove,
}: {
    index: number;
    text: string;
    onRemove: () => void;
}) {
    return (
        <div className="flex justify-between items-center p-3 h-14 rounded-xl bg-slate-50 w-full">
            <div className="flex items-center gap-3">
                <div className="relative flex justify-center items-center w-7 h-7">
                    <svg
                        width="28"
                        height="28"
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="stage-icon"
                    >
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M14.0001 3C20.1203 3 25.0834 7.96201 25.0834 14.0833C25.0834 20.2047 20.1203 25.1667 14.0001 25.1667C7.87876 25.1667 2.91675 20.2047 2.91675 14.0833C2.91675 7.96201 7.87876 3 14.0001 3Z"
                            stroke="#6B6B6B"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="absolute text-xs leading-6 text-neutral-500">
                        {index + 1}
                    </span>
                </div>
                <span className="text-xs leading-4 text-stone-950">{text}</span>
            </div>

            <button
                type="button"
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                onClick={onRemove}
                aria-label="Remove item"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}

function ListEditor({
    title,
    required,
    items,
    setItems,
    error,
    placeholder,
    max = 3,
    counterLabel,
    onClearError,
}: {
    title: string;
    required?: boolean;
    items: { title: string }[];
    setItems: (next: { title: string }[]) => void;
    error?: string;
    placeholder: string;
    max?: number;
    counterLabel: string;
    onClearError?: () => void;
}) {
    const [newItem, setNewItem] = React.useState("");

    const canAdd = items.length < max && newItem.trim().length > 0;

    const addItem = () => {
        const v = newItem.trim();
        if (!v || items.length >= max) return;
        setItems([...items, { title: v }]);
        setNewItem("");
        onClearError?.();
    };

    const removeAt = (i: number) => {
        const next = items.filter((_, idx) => idx !== i);
        setItems(next);
        if (next.length > 0) onClearError?.();
    };

    return (
        <div className="space-y-4">
            <SectionTitle
                title={title}
                required={required}
                hint={`${items.length}/${max} ${counterLabel}`}
            />

            <div className="flex flex-col gap-3 w-full">
                {items.map((it, i) => (
                    <ListRow key={`${it.title}-${i}`} index={i} text={it.title} onRemove={() => removeAt(i)} />
                ))}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {items.length < max && (
                <div className="flex gap-2 w-full">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        placeholder={placeholder}
                        className={`flex-1 p-2 text-sm border rounded-lg outline-none ${error
                            ? "border-red-500 ring-2 ring-red-500"
                            : "border-gray-300 focus:ring-2 focus:ring-blue-500"
                            }`}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") addItem();
                        }}
                        aria-invalid={!!error}
                    />
                    <button
                        type="button"
                        onClick={addItem}
                        disabled={!canAdd}
                        className="flex items-center justify-center p-3 w-14 h-14 bg-slate-50 rounded-[40px] hover:bg-slate-100 transition-colors disabled:opacity-50"
                        aria-label="Add item"
                    >
                        <Plus className="text-blue-600" size={24} />
                    </button>
                </div>
            )}
        </div>
    );
}

/* ============================= Main Form ============================ */
export function CourseInformationForm({
    formData = {},
    setFormData,
    errors = {},
    setErrors,
}: CourseInformationFormProps) {
    const { data: categoryData } = useGetCategoriesQuery();
    const { data: levelData } = useGetLevelsQuery();

    // Arrays (defensive)
    const benefitsArray = Array.isArray(formData.benefits) ? formData.benefits : [];
    const prereqArray = Array.isArray(formData.prerequisites) ? formData.prerequisites : [];

    // Normalize category/level to id (run once)
    React.useEffect(() => {
        setFormData((prev) => {
            const cat = prev.category as any;
            const lvl = prev.level as any;
            return {
                ...prev,
                category: typeof cat === "string" ? cat : cat?._id ?? "",
                level: typeof lvl === "string" ? lvl : lvl?._id ?? "",
            };
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Helpers
    const setField = <K extends keyof Course,>(key: K, value: Course[K]) =>
        setFormData((prev) => ({ ...prev, [key]: value }));
    const updateArrayField = (field: keyof Course, value: any[]) =>
        setFormData((prev) => ({ ...prev, [field]: value }));
    const pushError = (key: string, message?: string) => {
        if (!setErrors) return;
        setErrors((prev) => {
            const next = { ...(prev || {}) };
            if (message) next[key] = message;
            else delete next[key];
            return next;
        });
    };

    // Select options
    const categoryOptions =
        categoryData?.categories?.map((c: any) => ({ label: c.title, value: c._id })) ?? [];
    const levelOptions =
        levelData?.levels?.map((lv: any) => ({ label: lv.name, value: lv._id })) ?? [];

    return (
        <section className="p-6 bg-white rounded-xl w-full">
            <div className="flex flex-col gap-6 w-full">
                <h1 className="text-2xl font-bold text-gray-800">Course Information</h1>

                <form className="flex flex-col gap-10" onSubmit={(e) => e.preventDefault()}>
                    {/* ========================== Basics ========================== */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="Title"
                            placeholder="Your course title"
                            required
                            value={formData.name || ""}
                            onChange={(e) => {
                                setField("name", e.target.value);
                                if (e.target.value.trim()) pushError("name", undefined);
                            }}
                            error={errors.name}
                        />

                        <FormInput
                            label="Sub Title"
                            placeholder="Short course subtitle"
                            value={formData.subTitle || ""}
                            onChange={(e) => setField("subTitle", e.target.value)}
                        />

                        <FormSelect
                            label="Category"
                            placeholder="Select"
                            options={categoryOptions}
                            value={
                                typeof formData.category === "object" && formData.category !== null
                                    ? (formData.category as any)._id
                                    : (formData.category as string) || ""
                            }
                            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                            error={errors.category}
                        />

                        <FormSelect
                            label="Skill level"
                            placeholder="Select"
                            options={levelOptions}
                            value={
                                typeof formData.level === "object" && formData.level !== null
                                    ? (formData.level as any)._id
                                    : (formData.level as string) || ""
                            }
                            onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                            error={errors.level}
                        />
                    </div>

                    {/* ====================== Pricing & Duration =================== */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput
                            label="Original Price"
                            placeholder="Enter price"
                            type="number"
                            required
                            value={formData.price?.toString() || ""}
                            onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                setField("price", Number.isFinite(v) ? v : 0);
                                if (Number.isFinite(v) && v >= 0) pushError("price", undefined);
                            }}
                            error={errors.price}
                        />

                        <FormInput
                            label="Sale Price"
                            placeholder="Enter sale price"
                            type="number"
                            value={formData.estimatedPrice?.toString() || ""}
                            onChange={(e) => {
                                const v = parseFloat(e.target.value);
                                setField("estimatedPrice", Number.isFinite(v) ? v : 0);
                            }}
                        />

                        <FormInput
                            label="Duration (minutes)"
                            placeholder="e.g. 120"
                            type="number"
                            required
                            value={formData.duration?.toString() || ""}
                            onChange={(e) => {
                                const v = parseInt(e.target.value);
                                setField("duration", Number.isFinite(v) ? v : 0);
                                if (Number.isFinite(v) && v > 0) pushError("duration", undefined);
                            }}
                            error={errors.duration}
                        />
                    </div>

                    {/* =========================== Content ========================= */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <TextArea
                            label="Description"
                            required
                            placeholder="Course description"
                            value={formData.description || ""}
                            onChange={(v) => {
                                setFormData((prev) => ({ ...prev, description: v }));
                                if (v.trim()) pushError("description", undefined);
                            }}
                            error={errors.description}
                        />

                        <TextArea
                            label="Overview"
                            placeholder="Course overview (optional)"
                            value={formData.overview || ""}
                            onChange={(v) => setFormData((prev) => ({ ...prev, overview: v }))}
                        />
                    </div>

                    {/* ======================== Prerequisites ======================= */}
                    <ListEditor
                        title="Course Prerequisites"
                        required
                        items={prereqArray}
                        setItems={(next) => updateArrayField("prerequisites", next)}
                        error={errors.prerequisites}
                        placeholder="Enter prerequisite"
                        max={3}
                        counterLabel="prerequisites"
                        onClearError={() => pushError("prerequisites", undefined)}
                    />

                    {/* ========================== Benefits ========================= */}
                    <ListEditor
                        title="Course Benefits"
                        required
                        items={benefitsArray}
                        setItems={(next) => updateArrayField("benefits", next)}
                        error={errors.benefits}
                        placeholder="Enter benefit"
                        max={3}
                        counterLabel="benefits"
                        onClearError={() => pushError("benefits", undefined)}
                    />
                </form>
            </div>
        </section>
    );
}
