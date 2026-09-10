"use client";

const PopupSkeleton = () => {
  return (
    <>
      {/* TOP SECTION */}
      <div className="flex flex-col md:flex-row animate-pulse">
        {/* LEFT IMAGE SKELETON */}
        <div className="flex items-center justify-center w-full p-4 border-b border-gray-100 md:w-5/12 md:p-12 md:border-b-0">
          <div className="w-[55%] sm:w-[45%] md:w-full aspect-[3/4] bg-gray-200 rounded-sm" />
        </div>

        {/* RIGHT CONTENT SKELETON */}
        <div className="flex flex-col justify-center w-full p-5 md:w-7/12 md:p-14">
          {/* Latest Issue */}
          <div className="w-24 h-3 bg-gray-200 rounded" />

          {/* Magazine name */}
          <div className="w-64 h-7 mt-3 bg-gray-200 rounded" />

          {/* Offer */}
          <div className="mt-6">
            <div className="w-72 h-7 bg-gray-200 rounded" />

            {/* Features */}
            <div className="mt-5 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
                <div className="w-56 h-4 bg-gray-200 rounded" />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
                <div className="w-48 h-4 bg-gray-200 rounded" />
              </div>

              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
                <div className="w-52 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="w-36 h-12 mt-6 bg-gray-200 rounded" />
        </div>
      </div>

      {/* CONTACT BAR SKELETON */}
      <div className="border-t border-gray-200 mx-4 md:mx-10 px-4 md:px-6 py-5">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-10">
          <div className="w-36 h-4 bg-gray-200 rounded" />
          <div className="w-44 h-4 bg-gray-200 rounded" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    </>
  );
};

export default PopupSkeleton;
