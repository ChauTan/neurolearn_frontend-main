import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />;
}

export { Skeleton };

export function DashboardSkeleton() {
    return <Skeleton className="h-[288px] w-full" />;
}

export function AuthBtnsSkeleton() {
    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-[84px] rounded" />
            <Skeleton className="h-10 w-[84px] rounded" />
        </div>
    );
}

export const VerticalCardSkeleton = () => {
    return (
        <div className="space-y-2 px-2">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="flex gap-4">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
            </div>
            <Skeleton className="h-6 w-1/2 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
            <div className="flex justify-between">
                <Skeleton className="h-6 w-16 rounded" />
                <Skeleton className="h-6 w-24 rounded" />
            </div>
        </div>
    );
};

export function HorizontalCardSkeleton() {
    return (
        <div className="w-full flex pb-5 px-6 mb-5 border-b gap-5 border-primary-100">
            <Skeleton className="h-[240px] w-[320px] shrink-0 rounded-md" />
            <div className="flex flex-col gap-6 w-full">
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-6 w-full rounded" />
                <Skeleton className="h-6 w-3/4 rounded" />
                <Skeleton className="h-6 w-1/4 rounded" />
                <Skeleton className="h-6 w-1/5 rounded" />
            </div>
        </div>
    );
}
export function CourseSidebarSkeleton() {
    return (
        <div className="flex flex-col p-6">
            <Skeleton className="h-6 w-full shrink-0 rounded" />
            <Skeleton className="h-10 w-full shrink-0 rounded mt-4" />
            <Skeleton className="h-3 w-3/4 mx-auto shrink-0 rounded-full mt-2" />
            <Skeleton className="h-6 w-3/4 shrink-0 rounded mt-4" />
            <Skeleton className="h-4 w-1/2 shrink-0 rounded mt-2" />
            <Skeleton className="h-4 w-1/4 shrink-0 rounded mt-2" />
            <Skeleton className="h-4 w-1/2 shrink-0 rounded mt-2" />
            <Skeleton className="h-4 w-1/2 shrink-0 rounded mt-2" />
            <Skeleton className="h-8 w-full shrink-0 border-t border-primary-100 rounded mt-8" />
        </div>
    );
}

export function QuizItemSkeleton() {
    return (
        <li className="list-quizzes group grid grid-cols-10 gap-4 items-center my-4 py-4">
            {/* Quiz Thumbnail and Title (4 parts) */}
            <div className="col-span-4 flex items-center min-w-0">
                <Skeleton className="w-12 h-12 rounded-lg flex-shrink-0" />
                <Skeleton className="ml-4 h-6 w-3/4 rounded" />
            </div>

            {/* Quiz Metadata (5 parts) */}
            <div className="col-span-5 flex items-center">
                <div className="meta grid grid-cols-3 gap-4 md:flex md:items-center md:justify-start md:gap-6">
                    <div className="meta-item flex items-center space-x-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded" />
                    </div>
                    <div className="meta-item flex items-center space-x-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded" />
                    </div>
                    <div className="meta-item flex items-center space-x-2">
                        <Skeleton className="w-6 h-6 rounded-full" />
                        <Skeleton className="h-4 w-16 rounded" />
                    </div>
                </div>
            </div>

            {/* Edit and Remove Buttons (1 part) */}
            <div className="col-span-1 flex items-center justify-end">
                <Skeleton className="w-8 h-8 rounded-full" />
                <Skeleton className="w-8 h-8 rounded-full ml-2" />
            </div>
        </li>
    );
}

export function DashboardNavigationSkeleton() {
    return (
        <div>
            <div className="bg-primary-800 rounded-xl p-6">
                <Skeleton className="w-[50%] bg-primary-50/10 h-6 rounded-md" />
                <div className="flex items-center justify-between mt-6 gap-5">
                    <Skeleton className="h-[30px] w-[11%] rounded-full bg-primary-50/10" />
                    <Skeleton className="h-[30px] w-full bg-primary-50/10" />
                </div>
                <div className="flex items-center justify-between mt-4 gap-5">
                    <Skeleton className="h-[30px] w-[11%] rounded-full bg-primary-50/10" />
                    <Skeleton className="h-[30px] w-full bg-primary-50/10" />
                </div>
                <div className="flex items-center justify-between mt-4 gap-5">
                    <Skeleton className="h-[30px] w-[11%] rounded-full bg-primary-50/10" />
                    <Skeleton className="h-[30px] w-full bg-primary-50/10" />
                </div>
                <div className="flex items-center justify-between mt-4 gap-5">
                    <Skeleton className="h-[30px] w-[11%] rounded-full bg-primary-50/10" />
                    <Skeleton className="h-[30px] w-full bg-primary-50/10" />
                </div>
                <div className="flex items-center justify-between mt-4 gap-5">
                    <Skeleton className="h-[30px] w-[11%] rounded-full bg-primary-50/10" />
                    <Skeleton className="h-[30px] w-full bg-primary-50/10" />
                </div>
            </div>
        </div>
    );
}
