import Image from "next/image";
import { getEditorial } from "./service";
import Link from "next/link";

const imgUrl = process.env.NEXT_PUBLIC_EDITORIAL_IMAGE_URL || "";

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

  return (
    <div className="col-span-12 lg:col-span-3 ml-4  w-">
      {/* Heading */}
      <h2 className="text-xl font-semibold uppercase text-[#333]">
        Editorial
      </h2>
      <div className="w-12 h-1 bg-[#c9060a] mt-1 mb-4"></div>

      {/* Card */}
      <div className="border border-gray-200 bg-[#ffffff] p-4  h-122.5 flex flex-col hover:shadow ">

        {/* Top Section (Text Left + Image Right) */}
        <div className="flex gap-4">
          
        

          {/* Right Image */}
          <div className="w-24 h-24 relative shrink-0  overflow-hidden">
            <Image
              src={`${imgUrl}${data.image}`}
              alt={data.name}
              fill
              className="object-cover"
            />
          </div>

            {/* Left Content */}
          <div className="flex-1">
            <p className="font-semibold text-md text-[#333]">
              {data.name}
            </p>

            <p className="text-sm text-[#333] mt-1">
              {data.designation}
            </p>

            <p className="text-sm text-[#c9060a] mt-1 font-medium">
              {data.company_name}
            </p>
<p className="text-sm text-gray-400 mt-1 font-medium">
              {data.place}
            </p>

          </div>
        </div>
        {/* Description Below (Full Width) */}
        <p className="text-[14px] font-normal text-gray-600 mt-3 line-clamp-15 ">
          {data.description}
        </p>
            <Link
              href={`/editorial/${slug}`}
              className="text-sm text-[#c9060a] font-normal mt-3 inline-block "
            >
              Read More
            </Link>

      </div>
    </div>
  );
}

export default NirmalaSitaraman;