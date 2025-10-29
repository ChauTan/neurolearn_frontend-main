import React from "react";

const Pagination = () => {
  return (
    <div className="flex items-center justify-end gap-2 py-6">
      <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-lg">←</button>
      <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-primary text-white font-semibold">1</button>
      <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white font-semibold">2</button>
      <span className="px-2">...</span>
      <button className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-lg">→</button>
    </div>
  );
};

export default Pagination; 