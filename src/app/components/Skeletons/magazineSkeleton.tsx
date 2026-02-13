export const MagazineSkeleton = () => (
  <div className="animate-pulse">
    {/* Image */}
    <div className="relative w-full h-80 bg-gray-300" />

    {/* Text */}
    <div className="p-3 text-center space-y-2">
      <div className="h-4 bg-gray-300 rounded mx-auto w-3/4" />
      <div className="h-4 bg-gray-300 rounded mx-auto w-1/2" />
    </div>
  </div>
);
