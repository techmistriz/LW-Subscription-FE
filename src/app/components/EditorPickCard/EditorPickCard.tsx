import Image from "next/image";

interface Props {
  img?: string;
  title: string;
  author: string;
}

export default function EditorPickCard({ img, title, author }: Props) {
  return (
    <div className="bg-[#F8F8F8] border  border-gray-300 flex flex-col items-center transition-none hover:shadow-gray-400 hover:shadow-md cursor-pointer">
      <div className="overflow-hidden">
        <Image
          src={img || "/dummy-image.jpg"}
          alt={title}
          width={300}
          height={200}
          className="w-full h-40 object-cover"
        />
      </div>

      <div className="px-3 py-3  bg-[#F8F8F8] border-t border-gray-300">
        <h3 className="text-sm font-semibold text-[#333333] leading-snug">
          {title}
        </h3>
        <p className="text-[#c9060a] text-sm mt-1">{author}</p>
      </div>
    </div>
  );
}
