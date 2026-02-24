import Banner from "@/components/Common/Banner";

export default function ContactPage() {
  return (
    <section>
<Banner title={"contact"} />
    
    <div className="flex justify-center items-center bg-gray-100 py-16 px-6">
      <div className="max-w-3xl w-full text-center">
        {/* Title */}
        <h1 className="text-5xl font-semibold text-gray-800 mb-6">Connect with LEXWITNESS</h1>

        {/* Intro Text */}
        <p className="text-lg font-medium text-gray-700 mb-6">
          In order to participate at The Grand Masters 2026 Summit Series,
          please get in touch with:
        </p>

        {/* Contact Persons */}
        <div className="space-y-2 text-md text-gray-800">
          <p>
            Deepak Jha | +91-XXXXXXXXXX |{" "}
            <span className="text-red-600">deepak@witnesslive.in</span>
          </p>

          <p>
            Aditya Raj | +91-XXXXXXXXXX |{" "}
            <span className="text-red-600">aditya@witnesslive.in</span>
          </p>
        </div>

        <div className="my-10 border-t border-gray-300"></div>

        <div className="space-y-3 text-md text-gray-800">
          <p className="font-semibold">
            Lex <span className="text-red-600">Witness</span> – India’s 1st
            Magazine on Legal & Corporate Affairs
          </p>

          <p>Ground Floor, Block H, Sector 63,</p>
          <p>Noida - 201301</p>

          <p>
            E: <span className="text-red-600">info@witnesslive.in</span>
          </p>
        </div>
      </div>
    </div>
    </section>
  );
}
