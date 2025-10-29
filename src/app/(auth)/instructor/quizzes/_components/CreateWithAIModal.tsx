"use client";
import React, { useMemo, useState } from 'react';

export type AIQuestionType = 'single-choice' | 'multiple-choice';

export interface CreateWithAIModalProps {
    open: boolean;
    defaultExamTitle?: string;
    defaultTopic?: string;
    onClose: () => void;
    onConfirm: (details: {
        examTitle: string;
        difficultyLevel: 'Easy' | 'Medium' | 'Hard';
        topic: string;
        documentFile?: File | null;
        totalCount: number;
        questionType: AIQuestionType;
    }) => void;
}

const CreateWithAIModal: React.FC<CreateWithAIModalProps> = ({ open, defaultExamTitle, defaultTopic, onClose, onConfirm }) => {
    const [examTitle, setExamTitle] = useState<string>(defaultExamTitle || '');
    const [topic, setTopic] = useState<string>(defaultTopic || '');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
    const [file, setFile] = useState<File | null>(null);
    const [questionType, setQuestionType] = useState<AIQuestionType>('multiple-choice');
    const [count, setCount] = useState<number>(5);

    const canSubmit = useMemo(() => {
        if (file) return !!examTitle || true; // file provided, topic may be optional
        return !!topic || !!examTitle; // at least one
    }, [examTitle, topic, file]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative w-full max-w-md bg-white rounded-xl shadow-lg p-5">
                <div className="flex items-center justify-between mb-3">
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-sm flex items-center">
                        <span className="mr-1">←</span> Back
                    </button>
                    <h2 className="text-base font-semibold">Create with AI</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
                </div>

                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Title</label>
                        <input
                            value={examTitle}
                            onChange={e => setExamTitle(e.target.value)}
                            placeholder="e.g., Ứng dụng AI trong thực tế"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Scan From document (Optional)</label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center text-sm text-gray-500">
                            <input
                                id="ai-doc-input"
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                className="hidden"
                                onChange={e => setFile(e.target.files?.[0] || null)}
                            />
                            <label htmlFor="ai-doc-input" className="text-blue-600 hover:underline cursor-pointer">Choose folder/File</label>
                            <div className="mt-1">or drag and drop</div>
                            <div className="mt-1 text-xs">PDF, DOCX, TXT up to 10MB</div>
                            {file && (
                                <div className="mt-2 text-xs text-gray-600">Selected: {file.name}</div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty Level</label>
                        <select
                            value={difficulty}
                            onChange={e => setDifficulty(e.target.value as any)}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Topic (Required if no document)</label>
                        <input
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="e.g., History of Ancient Rome, JavaScript Basics"
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Question Type</label>
                        <div className="flex items-center gap-2">
                            <select
                                value={questionType}
                                onChange={e => setQuestionType(e.target.value as AIQuestionType)}
                                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="multiple-choice">Multiple choice</option>
                                <option value="single-choice">Single choice</option>
                            </select>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => setCount(c => Math.max(1, c - 1))}
                                    className="px-3 py-2 border rounded-l-lg text-gray-700 hover:bg-gray-50"
                                >
                                    −
                                </button>
                                <div className="px-3 py-2 border-t border-b">{count}</div>
                                <button
                                    type="button"
                                    onClick={() => setCount(c => Math.min(50, c + 1))}
                                    className="px-3 py-2 border rounded-r-lg text-gray-700 hover:bg-gray-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Apply this type to all generated questions.</p>
                    </div>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50">Back</button>
                    <button
                        disabled={!canSubmit}
                        onClick={() =>
                            onConfirm({
                                examTitle: examTitle.trim(),
                                difficultyLevel: difficulty,
                                topic: topic.trim(),
                                documentFile: file || undefined,
                                totalCount: count,
                                questionType,
                            })
                        }
                        className={`px-4 py-2 rounded-lg text-white ${canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'}`}
                    >
                        Generate
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateWithAIModal;
