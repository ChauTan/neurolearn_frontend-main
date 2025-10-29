import React from "react";

const Header = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="flex items-center gap-2 flex-1">
        <input
          type="text"
          placeholder="Search"
          className="px-4 py-2 rounded-full border border-gray-200 focus:outline-none w-60"
        />
        <select className="px-4 py-2 rounded-full border border-gray-200 bg-white focus:outline-none">
          <option>All courses</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-primary text-white px-6 py-2 rounded-full font-semibold">Request</button>
        <button className="border border-gray-200 px-4 py-2 rounded-full font-semibold">Instructor</button>
      </div>
    </div>
  );
};

export default Header; 