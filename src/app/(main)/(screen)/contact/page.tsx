export default function ContactPage() {
  return (
    <div className="flex justify-center items-center bg-gray-100 py-16 px-6">
      <div className="max-w-3xl w-full text-center">
        {/* Title */}
        <h1 className="text-5xl font-semibold text-gray-800 mb-6">
          Connect
        </h1>

        {/* Intro Text */}
        <p className="text-lg font-medium text-gray-700 mb-6">
          In order to participate at The Grand Masters 2026 Summit Series,
          please get in touch with:
        </p>

        {/* Contact Persons */}
        <div className="space-y-2 text-lg text-gray-800">
          <p>
            Bhupinder Kaur | +91-9654155065 |{" "}
            <span className="text-red-600">
              bhupinder@witnesslive.in
            </span>
          </p>

          <p>
            Neelima Maheshwari | +91-8800841600 |{" "}
            <span className="text-red-600">
              neelima.maheshwari@witnesslive.in
            </span>
          </p>
        </div>

        {/* Divider */}
        <div className="my-10 border-t border-gray-300"></div>

        {/* Company Info */}
        <div className="space-y-3 text-lg text-gray-800">
          <p className="font-semibold">
            Lex <span className="text-red-600">Witness</span> – India’s 1st
            Magazine on Legal & Corporate Affairs
          </p>

          <p>
            Suite 1/6, Lower Ground Floor, Block B, Hauz Khas,
          </p>
          <p>New Delhi - 110016</p>

          <p>
            E: <span className="text-red-600">info@witnesslive.in</span>
          </p>
        </div>
      </div>
    </div>
  );
}