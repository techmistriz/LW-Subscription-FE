import Image from "next/image";

const authorImg =
  process.env.NEXT_PUBLIC_ADMIN_IMAGE_URL || "";

interface AuthorProps {
  data: {
    name: string;
    image: string;
    designation: string;
    company_name: string;
    place: string;
    description: string;
    linkedin?: string;
  };
}

function Author({ data }: AuthorProps) {
  return (
    <div className="w-full">
      {/* Heading */}
      <h2 className="text-xl font-semibold uppercase text-[#333]">
        About Author
      </h2>

      <div className="w-12 h-1 bg-[#c9060a] mt-1 mb-4"></div>

      {/* Card */}
      <div className="border border-gray-200 bg-white p-4 flex flex-col hover:shadow">
        {/* Top Section */}
        <div className="flex gap-4">
          {/* Image */}
          <div className="w-18 h-18 relative shrink-0 overflow-hidden">
            <Image
              src={`${authorImg}${data.image}`}
              alt={data.name}
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className="font-semibold text-md text-[#c9060a]">
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

            {/* LinkedIn */}
            {data.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group mt-6 w-6 h-6  flex items-center justify-center border border-[#0A66C2] text-white bg-[#0A66C2] shadow-sm overflow-hidden"
              >
                <svg
                  className="w-4 h-4 z-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.78v2.22h.07c.66-1.25 2.27-2.57 4.68-2.57 5 0 5.92 3.28 5.92 7.55V24h-5v-7.92c0-1.89-.03-4.33-2.63-4.33-2.63 0-3.03 2.05-3.03 4.17V24h-5V8z" />
                </svg>

                <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></span>
              </a>
            )}
          </div>
        </div>

        {/* Full Description */}
        <p className="text-[14px] font-normal text-gray-600 mt-4 leading-6">
          {data.description}
        </p>
      </div>
    </div>
  );
}

export default Author;