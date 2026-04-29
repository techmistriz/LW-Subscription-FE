 const PricingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="relative mx-4 p-6 md:p-8 rounded-2xl border border-gray-200 bg-white animate-pulse"
        >
          {/* BADGE */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="h-5 w-20 bg-gray-200 rounded-full" />
          </div>

          {/* RADIO */}
          <div className="flex justify-center mb-5">
            <div className="w-5 h-5 rounded-full border border-gray-200" />
          </div>

          {/* TITLE */}
          <div className="h-5 w-24 bg-gray-200 rounded mx-auto mb-6" />

          {/* FEATURES */}
          <div className="space-y-2 min-h-[60px]">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-3/4 bg-gray-200 rounded" />
            <div className="h-3 w-5/6 bg-gray-200 rounded" />
          </div>

          {/* PRICE */}
          <div className="mt-6 text-center">
            <div className="h-6 w-20 bg-gray-200 rounded mx-auto" />
            <div className="h-3 w-28 bg-gray-200 rounded mx-auto mt-2" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default  PricingSkeleton;