'use client';

interface OverViewProps {
  title?: string
  overview?: string;
}

export default function OverView({ title, overview}: OverViewProps) {
  return (
    <div className="max-w-full p-4 bg-white rounded-2xl shadow-md border border-gray-200 mx-auto w-[395px]">
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-semibold text-black">Overview</h2>
      </div>

      <h2 className="text-2xl font-bold text-black mb-4">
        {title || 'No course overview provided'}
      </h2> 

      <p className="text-sm text-gray-700 mb-4">
        {overview ||
          'This course includes multiple in-depth sections covering various skills and tools in modern development or design.'}
      </p>
    </div>
  );
}
