"use client";

interface SpinnerProps {
  size?: number;
  fullScreen?: boolean;
}

export default function Spinner({
  size = 32,
  fullScreen = false,
}: SpinnerProps) {
  const spinner = (
    <div
      style={{ width: size, height: size }}
      className="border-4 border-gray-300 border-t-[#c9060a] rounded-full animate-spin"
    />
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm z-50">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center py-10">
      {spinner}
    </div>
  );
}
