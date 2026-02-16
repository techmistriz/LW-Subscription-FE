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
  magazine: Magazine;
  articles: Post[];
};

export default function LatestIssueWithArticles({ magazine, articles }: Props) {
  if (!magazine) return null;

  return (
    <div className="w-full space-y-12 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-8 px-4">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-3 order-1">
        <LatestIssue magazine={magazine} />
        <p className="text-[13px] font-normal text-[#333] my-1  leading-relaxed">
          A Photo Feature on Judgements, Laws & Bills
        </p>
        <Link
          href="/register"
          className="block w-full bg-[#c9060a] text-white text-center py-3 px-4 text-[12px] font-normal"
        >
          Subscribe Now For Subscription
        </Link>
      </div>

      {/* CENTER COLUMN */}
      <div className="lg:col-span-6 order-3 lg:order-2 px-2 sm:px-4 md:mt-15 lg:mt-15">
        <div className="overflow-hidden">
          <RelatedMagazineArticles articles={articles} />
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-3 order-2 lg:order-3">
        <NirmalaSitaraman />
      </div>
    </div>
  );
}
