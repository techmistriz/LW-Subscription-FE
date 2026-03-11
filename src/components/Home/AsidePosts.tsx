import Link from "next/link";
import { Post } from "./service";

export default function AsidePosts({ posts }: { posts: Post[] }) {
  if (!posts?.length) return null;

  return (
    <aside className="lg:col-span-3 border border-gray-200 px-3 pt-3 text-sm">
      {posts.map((post, index) => {
        const category = post.category;
        const magazine = post.magazine;

        return (
          <div key={post.id} className="pb-2">
            {/* Category */}
            {category?.slug && (
              <Link
                href={`/category/${category.slug}`}
                className="text-[#c9060a] text-[14px] font-medium"
              >
                {category.name}
              </Link>
            )}

            {/* Title */}
            {post.slug && (
              <Link href={`/${post.slug}`}>
                <p className="text-[#333333] text-[14px] font-normal cursor-pointer hover:text-black transition-colors line-clamp-2">
                  {post.title}
                </p>
              </Link>
            )}

            {/* Date */}
            {post.publish_date && magazine && (
              <p className="text-gray-400 text-[12px] font-medium">
                {magazine.month?.name} {magazine.year}
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