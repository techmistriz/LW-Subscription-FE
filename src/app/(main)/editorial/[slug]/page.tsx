import Banner from "@/components/Common/Banner";
import { getEditorial } from "@/components/Editorial/service";
import Image from "next/image";
const imgUrl = process.env.NEXT_PUBLIC_EDITORIAL_IMAGE_URL || "";

export default async function EditorialPage() {
  const data = await getEditorial();

  return (
    <section>
      <Banner title={"Editorial"} />

      <div className="max-w-6xl mx-auto px-6 py-8 ">
      

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Side - Editor Image */}
          <div className="relative w-[80%] aspect-4/5 mx-auto overflow-hidden shadow-lg rounded-md">
            <Image
              src={`${imgUrl}${data.image}`}
              alt={data.name}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
              priority
            />
          </div>

          {/* Right Side - Editor Description */}
          <div className="-mt-10">
            <h1 className="text-3xl text-[#c9060a] font-semibold mb-1">
              {data.name}
            </h1>
            <h3 className="text-lg font-medium text-[#333]">
              {data.designation}
            </h3>
            <h3 className="text-[#c9060a]">{data.company_name}</h3>
            <h3 className="text-gray-400 mb-5">{data.place}</h3>
            <p className="text-gray-600 text-[15px] font-normal leading-relaxed mb-6">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
