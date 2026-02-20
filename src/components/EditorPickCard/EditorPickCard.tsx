import Image from "next/image";

interface Props {
  img?: string;
  title: string;
  author: string;
}

export default function EditorPickCard({ img, title, author }: Props) {
  return (
    <div className="bg-[#F8F8F8] border  border-gray-300 flex flex-col items-center transition-none hover:shadow-gray-400 hover:shadow-md cursor-pointer">
      <div className="h-40 w-full relative bg-white">
        {img ? (
          <Image
            src={img}
            alt={title}
            fill
            className="object-cover"
            sizes="300px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <div className="w-20 h-14 bg-gray-300 rounded-sm flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8 text-gray-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 4a1 1 0 110 2 1 1 0 010-2zm-2 7l3-4 2 3 3-4 4 5H5z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="px-3 py-3  bg-[#F8F8F8] border-t border-gray-300">
        <h3 className="text-sm font-semibold text-[#333333] leading-snug line-clamp-2">
          {title}
        </h3>
        <p className="text-[#c9060a] text-sm mt-1">{author}</p>
      </div>
    </div>
  );
}
