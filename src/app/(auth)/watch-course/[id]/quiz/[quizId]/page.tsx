// app/watch-course/[id]/quiz/[quizId]/page.tsx (ví dụ đường dẫn)
// Code tiếng Anh, comment tiếng Việt

'use client';

import { useParams } from 'next/navigation';
import KnowledgeCheckAssignment from '../KnowledgeCheckAssignment';

// 🔒 Container cố định: đồng bộ với KnowledgeCheckAssignment (1319px)
const PAGE_CONTAINER = 'mx-auto w-full max-w-[1319px] px-4 md:px-6';

export default function QuizPage() {
    // Lấy quizId an toàn, không làm vỡ type
    const { quizId } = useParams() as { quizId?: string };

    return (
        <main className="w-full py-10">
            {/* KHÓA chiều rộng & căn giữa; không dùng flex ở đây để tránh ảnh hưởng layout bên trong */}
            <div className={PAGE_CONTAINER}>
                {quizId ? (
                    <KnowledgeCheckAssignment />
                ) : (
                    <p className="text-center text-slate-600">Loading quiz...</p>
                )}
            </div>
        </main>
    );
}
