import Link from "next/link";
import { getEditorial } from "@/services/editorial.service";
import SafeImage from "@/components/media/SafeImage";
import { siteConfig } from "@/config/site";

const imgUrl = siteConfig.editorialImageBaseUrl || "";

async function NirmalaSitaraman() {
  const data = await getEditorial();

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "")
      .replace(/--+/g, "-");
  };

  const slug = generateSlug(data.name);

  const firstParagraph = data.description
    .split(/\r?\n\r?\n/)
    .filter(Boolean)[0];

  return (
    <div className="col-span-12 ml-4 lg:col-span-3">
      {/* Heading */}
      <h2 className="text-xl font-semibold uppercase text-[#333]">Editorial</h2>

      <div className="mt-1 mb-4 h-1 w-12 bg-[#c9060a]" />

      {/* Card */}
      <div className="flex h-122.5 flex-col border border-gray-200 bg-[#ffffff] p-4 hover:shadow">
        {/* Top Section */}
        <div className="flex gap-4">
          {/* Image */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden">
            <SafeImage
              src={`${imgUrl}${data.image}`}
              alt={data.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="text-md font-semibold text-[#333]">{data.name}</p>

            <p className="mt-1 text-sm text-[#333]">{data.designation}</p>

            <p className="mt-1 text-sm font-medium text-[#c9060a]">
              {data.company_name}
            </p>

            <p className="mt-1 text-sm font-medium text-gray-400">
              {data.place}
            </p>
          </div>
        </div>

        {/* First Paragraph Only */}
        <p className="mt-3 line-clamp-13 text-[14px] font-normal text-gray-600">
          {firstParagraph}
        </p>

        {/* Read More */}
        <Link
          href={`/editorial/${slug}`}
          className="mt-3 inline-block text-sm font-normal text-[#c9060a]"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}

export default NirmalaSitaraman;
