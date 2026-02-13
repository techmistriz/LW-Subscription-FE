export const NavSkeleton = () => {
  return (
    <ul
      className="
        flex gap-6 h-12 items-center
        max-w-280 mx-auto px-4 md:px-0
        overflow-x-auto whitespace-nowrap
        animate-pulse
      "
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <li key={i} className="shrink-0">
          <div className="h-4 w-20 bg-gray-300 rounded" />
        </li>
      ))}
    </ul>
  );
};
