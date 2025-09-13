import React from "react";

export default function AllPdfsSkeleton() {
  const skeletonArray = Array.from({ length: 10 }); 

  return (
    <div className="w-[100dvw] min-h-screen p-6">
      <div className="hidden sm:grid grid-cols-[1fr_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)] bg-gray-100 font-semibold text-gray-700 px-4 py-3 rounded-t-xl">
        <div>SL No</div>
        <div>Name</div>
        <div>Size</div>
        <div>Date</div>
        <div className="col-span-2 text-center">Actions</div>
      </div>

      <div className="divide-y divide-gray-200 border border-gray-200 rounded-b-xl">
        {skeletonArray.map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[1fr_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)_minmax(0,2fr)] items-center px-4 py-3 gap-2 sm:gap-4 animate-pulse"
          >
            <div className="h-4 bg-gray-300 rounded w-6"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-12"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
            <div className="flex gap-2 sm:col-span-2">
              <div className="h-8 bg-gray-300 rounded flex-1"></div>
              <div className="h-8 bg-gray-300 rounded flex-1"></div>
              <div className="h-8 bg-gray-300 rounded flex-1"></div>
              <div className="h-8 bg-gray-300 rounded flex-1"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
