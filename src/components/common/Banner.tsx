"use client";

import Link from "next/link";

interface BannerProps {
  title: string;
  backgroundImage?: string;
}

export default function Banner({ title, backgroundImage }: BannerProps) {
  const bannerStyle: React.CSSProperties = {
    backgroundImage: `
    linear-gradient(
      to bottom,
      rgb(70 70 70 / 60%),
      rgb(70 70 70 / 60%)
    ),
    url(${backgroundImage || process.env.NEXT_PUBLIC_BANNER_BASE_URL})
  `,
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const capitalizeFirst = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  const capitalizeAll = (str: string) => str.toUpperCase();

  return (
    <section className="py-12" style={bannerStyle}>
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold  leading-[28.5px]">
          {capitalizeAll(title)}
        </h1>

        <p className="text-[14px] font-medium text-gray-200">
          <Link href="/" className="text-[#c9060a]">
            Home
          </Link>{" "}
          | {capitalizeFirst(title)}
        </p>
      </div>
    </section>
  );
}
