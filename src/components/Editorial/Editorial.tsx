import Image from "next/image";
import { getEditorial } from "./service";

const imgUrl = process.env.NEXT_PUBLIC_EDITORIAL_IMAGE_URL || "";

async function NirmalaSitaraman() {
  const data = await getEditorial();

  return (
    <div className="col-span-12  lg:col-span-3 w-full ml-3 mt-1">
      <h2 className="text-[24px] font-semibold uppercase text-[#333333]">
        Editorial
      </h2>
      <div className="w-12 h-1 bg-[#c9060a] mt-1 mb-4"></div>

      <div className="border border-gray-300 bg-[#F8F8F8] p-2 flex gap-4 items-start h-120 w-69">
        {/* Image */}
        <div className="w-20 h-20 shrink-0">
          <Image
            src={`${imgUrl}${data.image}`}
            alt={data.name}
            width={80}
            height={80}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-start">
          <p className="font-semibold text-sm text-gray-900 leading-tight">
            {data.name}
          </p>

          <p className="text-sm text-gray-600 mt-1">{data.designation}</p>

          <p className="text-sm text-[#c9060a] mt-6">{data.company_name}</p>
        </div>
      </div>
    </div>
  );
}

export default NirmalaSitaraman;
