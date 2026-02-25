import LatestIssue from "./LatestEditionSingle";
import RelatedMagazineArticles from "../RelatedMagazineArticle/RelatedMagazineArticles";
import NirmalaSitaraman from "../NirmalaSitaraman/NirmalaSitaraman";
import Link from "next/link";
import type { Magazine } from "@/types";

interface Post {
  id: number;
  title: string;
  image?: string;
}

type Props = {
  latestEdition: Magazine;
  posts: Post[];
};

export default function LatestIssueWithArticles({
  latestEdition,
  posts,
}: Props) {
  if (!latestEdition) return null;

  return (
    <div className="w-full space-y-12 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-2 px-">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-3 order-1">
        <LatestIssue magazine={latestEdition} />
        <p className="text-[13px] font-normal text-[#333] my-1 leading-relaxed">
          {latestEdition.magazine_name ||
            "A Photo Feature on Judgements, Laws & Bills"}
        </p>
        <Link href="/register">
          <button
            className="bg-[#c9060a] text-white px-4 py-2.5 border-2 border-white hover:bg-[#222] disabled:opacity-50 cursor-pointer block mx-auto"
            type="submit"
            // disabled={loading}
          >
            SUBSCRIBE NOW!
          </button>
        </Link>
      </div>

      {/* CENTER COLUMN */}
      <div className="lg:col-span-6 order-3 lg:order-2 px-2 sm:px-4 md:mt-15 lg:mt-15">
        <div className="overflow-hidden">
          <RelatedMagazineArticles articles={posts} />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="-my-8  lg:col-span-3 order-2 lg:order-3 lg:-ml-3.75 lg:mt-2">
        <NirmalaSitaraman />
      </div>
    </div>
  );
}
