import dynamic from "next/dynamic";
import { Suspense } from "react";

import HomeHeroSkeleton from "@/components/Home/HomeHeroSkeleton";
import SubscribeBanner from "@/features/auth/SubscribeBanner";
import LatestEdition from "@/components/LatestEdition/LatestEdition";
import LatestEditionWithArticles from "@/components/LatestEdition/LatestEditionWithArticles";
import BigFeature from "@/components/Home/BigFeature";
import { MiddleCards } from "@/components/Home/MiddleCards";
import AsidePosts from "@/components/Home/AsidePosts";

import { getHeroPost } from "@/components/Home/service";
import {
  getLatestMagazines,
  latestEdition,
} from "@/lib/api/services/magazines";

export const revalidate = 300;

/*----------------- Lazy load non-critical components -----------------*/
const EditorPicks = dynamic(
  () => import("@/components/EditorPick's/EditorPicks"),
);

const Advertisement = dynamic(
  () => import("@/components/HomeAdvertisment/advertisement"),
);

export default async function HomePage() {
  /*----------------- Fetch hero + latest edition in parallel -----------------*/
  const [heroData, latestEditionData] = await Promise.all([
    getHeroPost(),
    latestEdition(),
  ]);

  /*----------------- Latest magazines except current edition -----------------*/
  const latestFive = latestEditionData
    ? await getLatestMagazines({
        skipId: latestEditionData.magazine.id,
        limit: 5,
      })
    : [];

  /*----------------- Hero layout posts -----------------*/
  const firstPost = heroData?.slice(0, 1) || [];
  const middlePosts = heroData?.slice(1, 3) || [];
  const asidePosts = heroData?.slice(3) || [];

  const hasHeroContent =
    firstPost.length > 0 && middlePosts.length > 0 && asidePosts.length > 0;

  return (
    <main className="bg-white">
      
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-5">
        {hasHeroContent ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            <BigFeature post={firstPost[0]} />
            <MiddleCards posts={middlePosts} />
            <AsidePosts posts={asidePosts} />
          </div>
        ) : (
          <HomeHeroSkeleton />
        )}
      </section>

      {/* Advertisement */}
      <Suspense fallback={null}>
        <Advertisement />
      </Suspense>

      {/* Editor Picks */}
      <Suspense fallback={null}>
        <EditorPicks />
      </Suspense>

      {/* Subscribe Banner */}
      <SubscribeBanner />

      {/* Latest Issue */}
      {latestEditionData && (
        <section className="max-w-6xl mx-auto px-4 py-10 lg:pb-0">
          <LatestEditionWithArticles
            latestEdition={latestEditionData.magazine}
            posts={latestEditionData.posts}
          />
        </section>
      )}

      {/* Latest Magazines */}
      <LatestEdition magazines={latestFive} />
    </main>
  );
}
