import Image from "next/image";
import Link from "next/link";
import type { Magazine } from "@/types";

const magazineBaseUrl = process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL || "";
type Props = {
  magazine: Magazine;
  showTitle?: boolean;
};

export default function LatestIssue({ magazine, showTitle = true }: Props) {
  if (!magazine) return null;

  return (
    <div>
      <h3 className="text-2xl text-[#333333] font-semibold tracking-wide mt-2">
        LATEST EDITION
      </h3>
      <div className="w-14 h-1 bg-[#c9060a] mt-1 mb-4"></div>

      <Link
        href={`/magazines/${magazine.slug}`}
        className="block relative w-full aspect-3/4"
      >
        <Image
          src={
            magazine.image
              ? `${magazineBaseUrl}/${magazine.image}`
              : "/placeholder.jpg"
          }
          alt={magazine.title || "Latest magazine edition"}
          fill
          className="object-cover hover:shadow-md transition-shadow"
          sizes="300px"
        />
      </Link>

      {showTitle && (
        <p className="text-[18px] font-semibold my-2 text-start">
          {magazine.title}
        </p>
      )}

      <div className="w-full h-[0.5px] bg-gray-200 mt-1 mb-2"></div>
    </div>
  );
}
