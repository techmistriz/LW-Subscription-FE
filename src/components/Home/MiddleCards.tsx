import Image from "next/image";
import Link from "next/link";
import { Post } from "./service";

const baseUrl =
  process.env.NEXT_PUBLIC_POSTS_BASE_URL ;

export function MiddleCards({ posts }: { posts: Post[] }) {
  if (!posts?.length) return null;

  return (
    <div className="lg:col-span-3 flex flex-col gap-2">
      {posts.map((post) => {
        const imageUrl = post.image
          ? `${baseUrl}/${post.image}`
          : "/placeholder.jpg";

        return (
          <div
            key={post.id}
            className="lg:col-span-3 relative overflow-hidden"
            style={{ height: "188px" }}
          >
            {/* Image */}
            <Image
              src={imageUrl}
              alt={post.title || "Post image"}
              fill
              priority={false}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            {/* Gradient (same as BigFeature) */}
            <div
              className="absolute inset-0 z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.4) 60%, transparent 100%)",
              }}
            />

            {/* Category */}
            <Link
            href={`/category/${post?.category?.slug}`}
            className="absolute top-0 left-0 bg-[#c9060a] text-white text-sm px-4 py-1 z-10">
              {post.category?.name}
            </Link>

            {/* Content (exact pattern as BigFeature) */}
            <div className="absolute bottom-3 left-6 right-6 text-white z-10">
              <Link href={`/${post.slug}`}>
                <h2 className="text-[14px]  leading-snug text-white">
                  {post.title}
                </h2>
              </Link>

              <p className="text-xs mt-2 opacity-90">
                {post.publish_date}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
