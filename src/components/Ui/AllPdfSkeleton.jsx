import React from "react";

function AllPdfsSkeleton() {
  const skeletonRows = Array.from({ length: 15 }); 

  return (
    <div className="w-full min-h-screen p-6">
      {/* Table Header */}
      <div className="hidden sm:grid grid-cols-[1fr_2fr_2fr_2fr_2fr_2fr] bg-gray-100 font-semibold text-gray-700 px-4 py-3 rounded-t-xl">
        <div>SL No</div>
        <div>Name</div>
        <div>Size</div>
        <div>Date</div>
        <div className="col-span-2 text-center">Actions</div>
      </div>

      {/* Skeleton Rows */}
      <div className="divide-y divide-gray-200 border border-gray-200 rounded-b-xl">
        {skeletonRows.map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[1fr_2fr_2fr_2fr_2fr_2fr] items-center px-4 py-3 gap-2 sm:gap-4 animate-pulse"
          >
            <div className="h-4 bg-gray-300 rounded w-6 sm:w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="h-4 bg-gray-300 rounded w-full"></div>
            <div className="flex gap-2 sm:col-span-2">
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

export default AllPdfsSkeleton;
