import Banner from "@/components/common/Banner";
import { siteConfig } from "@/config/site";
import { getEditorial } from "@/services/editorial.service";
import Image from "next/image";

export default async function EditorialPage() {
  const data = await getEditorial();

  const imageUrl = `${siteConfig.editorialImageBaseUrl.replace(
    /\/$/,
    "",
  )}/${data.image}`;

  return (
    <section>
      <Banner title="Editorial" />

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Editor Image */}
          <div className="relative mx-auto w-[80%] aspect-[4/5] overflow-hidden shadow-lg">
            <Image
              src={imageUrl}
              alt={data.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Right Side - Editor Description */}
          <div>
            <h1 className="mb-1 text-3xl font-semibold text-[#c9060a]">
              {data.name}
            </h1>

            <h3 className="text-lg font-medium text-[#333]">
              {data.designation}
            </h3>

            <h3 className="text-[#c9060a]">{data.company_name}</h3>

            {/* <h3 className="mb-5 text-gray-400">{data.place}</h3>   */}

            <div className="text-[15px] font-normal leading-relaxed text-gray-600">
              {data.description
                .split(/\r?\n\r?\n/)
                .filter(Boolean)
                .map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
