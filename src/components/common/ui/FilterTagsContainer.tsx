"use client";
import * as React from "react";
import { useRouter } from "next/navigation";
import { FilterTags } from "./FilterTags";
import { useGetAllCategoriesWithSubcategoriesQuery } from "@/lib/redux/features/course/category/categoryApi";

const defaultTags = [
  "Data Science",
  "IT Certifications",
  "Leadership",
  "Web Development",
  "Communication",
  "Business Analytics & Intelligence",
];

type Props = {
  tags?: string[];
  defaultSelectedTag?: string;
  onTagChange?: (selectedTag: string) => void;
};

export const FilterTagsContainer: React.FC<Props> = ({
  tags,
  defaultSelectedTag = "Web Development",
  onTagChange,
}) => {
  const router = useRouter();
  const { data, isLoading } = useGetAllCategoriesWithSubcategoriesQuery();

  // 1) Tính snapshot cho lần render đầu (khớp SSR)
  const [renderTags, setRenderTags] = React.useState<string[]>(
    () => (Array.isArray(tags) && tags.length ? tags : defaultTags)
  );

  const [selectedTag, setSelectedTag] = React.useState<string>(() => {
    const initial = (Array.isArray(tags) && tags.length ? tags : defaultTags);
    return initial.includes(defaultSelectedTag)
      ? defaultSelectedTag
      : initial[0] ?? "";
  });

  // 2) Sau khi mount, nếu không có props.tags thì mới nhận data từ API
  React.useEffect(() => {
    if (tags && tags.length) return; // props ưu tiên
    if (isLoading) return;

    const apiList = (data as any)?.categories ?? [];
    const apiTags: string[] = Array.isArray(apiList)
      ? apiList
        .map((c: any) => String(c?.title ?? "").trim())
        .filter((t) => t.length > 0)
      : [];

    if (apiTags.length) {
      setRenderTags(apiTags);
      setSelectedTag((prev) => {
        if (apiTags.includes(prev)) return prev;
        return apiTags.includes(defaultSelectedTag)
          ? defaultSelectedTag
          : apiTags[0] ?? "";
      });
    }
  }, [tags, data, isLoading, defaultSelectedTag]);

  // 3) Handler
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag);
    onTagChange?.(tag);
    router.push(`/courses?page=1&category=${encodeURIComponent(tag)}`);
  };

  return (
    <FilterTags
      tags={renderTags}
      selectedTag={selectedTag}
      onTagSelect={handleTagSelect}
    />
  );
};

export default FilterTagsContainer;
