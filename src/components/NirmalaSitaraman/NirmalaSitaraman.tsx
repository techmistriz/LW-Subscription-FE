// ✅ NirmalaSitaraman.tsx - Fully Responsive
import Image from 'next/image'

function NirmalaSitaraman() {
  return (
    <div className="col-span-12 lg:col-span-3 w-full">
      <h2 className="text-xl font-bold uppercase text-[#333333]">
        Editorial
      </h2>
      <div className="w-12 h-1 bg-[#c9060a] mt-1 mb-5"></div>

      <div className="border border-gray-300 bg-[#F8F8F8] p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="w-20 h-20 shrink-0">
          <Image
            src="https://lexwitness.com/wp-content/themes/lexwitness/images/n-s.png"
            alt="Nirmala Sitharaman"
            width={80}
            height={80}
            className="object-cover rounded-full w-full h-full"
          />
        </div>
        <p className="font-medium text-sm border-b border-gray-300 pb-2 sm:pb-0 sm:mt-0">
          Nirmala Sitharaman
        </p>
      </div>
    </div>
  )
}

export default NirmalaSitaraman
