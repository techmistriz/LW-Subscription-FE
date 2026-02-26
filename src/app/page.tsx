import dynamic from "next/dynamic";

import HomeHeroSkeleton from "@/components/Home/HomeHeroSkeleton";
import SubscribeBanner from "@/features/auth/SubscribeBanner";
import LatestEdition from "@/components/LatestEdition/LatestEdition";
import LatestIssueWithArticles from "@/components/LatestEdition/LatestIssueWithArticles";
import BigFeature from "@/components/Home/BigFeature";
import { MiddleCards } from "@/components/Home/MiddleCards";
import AsidePosts from "@/components/Home/AsidePosts";


import { getHeroPost } from "@/components/Home/service";
import { getLatestMagazines, latestEdition } from "@/lib/api/services/magazines";

export const revalidate = 60;

// Lazy load non-critical components
const EditorPicks = dynamic(() => import("@/components/EditorPick's/EditorPicks"));
const Advertisement = dynamic(() => import("@/components/HomeAdvertisment/advertisement"));

export default async function HomePage() {
  // Hero posts
  const heroData = await getHeroPost();
  const get1LatestPost = heroData.slice(0, 1); // First post
  const get2LatestPost = heroData.slice(1, 3); // Next 2 posts
  const get4LatestPost = heroData.slice(3);    // Remaining posts

  // Latest magazine edition
  const latestEditionData = await latestEdition();

  // Latest 5 magazines excluding current edition
  const latestFive = await getLatestMagazines({
    skipId: latestEditionData?.magazine.id,
    limit: 5,
  });

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-5">
        {get1LatestPost.length && get2LatestPost.length && get4LatestPost.length ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
            <BigFeature post={get1LatestPost[0]} />
            <MiddleCards posts={get2LatestPost} />
            <AsidePosts posts={get4LatestPost} />
          </div>
        ) : (
          <HomeHeroSkeleton />
        )}
      </section>

      {/* Advertisement */}
      <Advertisement />

      {/* Editor Picks */}
      <EditorPicks />

      {/* Subscribe Banner */}
      <SubscribeBanner />

      {/* Latest Issue */}
      {latestEditionData && (
        <section className="max-w-6xl mx-auto px-4 py-10 lg:pb-0">
          <LatestIssueWithArticles
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