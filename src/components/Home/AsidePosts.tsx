import Link from "next/link";
import { Post } from "./service";

export default function AsidePosts({ posts }: { posts: Post[] }) {
  if (!posts?.length) return null;

  return (
    <aside className="lg:col-span-3 border border-gray-200 px-3 pt-3 text-sm">
      {posts.map((post, index) => {
        const categorySlug = post.category?.slug;
        const postSlug = post.slug;

        return (
          <div key={post.id} className="pb-2">
            
            {/* Category */}
            {categorySlug && (
              <Link
                href={`/category/${categorySlug}`}
                className="text-[#c9060a] text-[14px] font-medium"
              >
                {post.category?.name}
              </Link>
            )}

            {/* Title */}
            {postSlug && (
              <Link href={`/${postSlug}`}>
                <p className="text-[#333333] text-[14px] font-normal cursor-pointer hover:text-black transition-colors line-clamp-2">
                  {post.title}
                </p>
              </Link>
            )}

            {/* Date */}
            {post.publish_date && (
              <p className="text-gray-400 text-[12px] font-medium">
                {post.publish_date}
              </p>
            )}

            {/* Divider */}
            {index !== posts.length - 1 && (
              <hr className="mt-2 border-dashed border-gray-200" />
            )}
          </div>
        );
      })}
    </aside>
  );
}
