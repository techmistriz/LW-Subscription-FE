import Image from "next/image";
import Link from "next/link";
import type { Magazine } from "@/types";

const magazineBaseUrl = process.env.NEXT_PUBLIC_MAGAZINES_BASE_URL || "";

type Props = {
  magazine: Magazine;
};

export default function LatestIssue({ magazine }: Props) {
  if (!magazine) return null;

  return (
    <div>
      {/* Section header */}
      <h3 className="text-2xl text-[#333333] font-semibold tracking-wide">
        LATEST EDITION
      </h3>
      <div className="w-14 h-1 bg-[#c9060a] mt-1 mb-6"></div>

      {/* Magazine cover */}
      <Link href={`/magazines/${magazine.slug}`}>
        <Image
          src={
            magazine.image
              ? `${magazineBaseUrl}/${magazine.image}`
              : "/placeholder.jpg"
          }
          alt={magazine.title || "Latest magazine edition"}
          width={300}
          height={400}
          className="hover:shadow-md transition-shadow"
        />
      </Link>

      {/* Title */}
      <p className="text-sm my-3 text-start">{magazine.title}</p>

      <div className="w-full h-[0.5px] bg-gray-200 mt-1 mb-4"></div>
    </div>
  );
}
