import { Plus } from "lucide-react";
import { Button } from "@/components/common/ui/Button2";

export default function SectionHeader({
    onAdd,
}: {
    onAdd: () => void;
}) {
    return (
        <div className="flex flex-col gap-2 px-6 py-5 bg-background rounded-xl w-full">
            <div className="flex flex-row justify-between items-center w-full">
                <h2 className="text-2xl font-semibold text-gray-900">
                    Curriculum Lesson
                </h2>
                <Button
                    onClick={onAdd}
                    variant="ghost2"
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-lg font-medium">
                        New Section
                    </span>
                </Button>
            </div>
        </div>
    );
}