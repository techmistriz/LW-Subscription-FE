import Banner from "@/components/Common/Banner";

export default function AboutUsPage() {
  return (
    <section>
<Banner title={"About Us"}/>
    <div className="flex justify-center items-center bg-gray-100 py-16 px-6">
      <div className="max-w-4xl w-full text-center">
        {/* Title */}
        <h1 className="text-5xl font-semibold text-gray-800 mb-6">
          About Us
        </h1>

        {/* Intro Text */}
        <p className="text-lg font-medium text-gray-700 mb-8">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur 
          vehicula, libero at tincidunt luctus, metus odio vulputate quam, 
          sed dignissim sapien lorem in nulla.
        </p>

        {/* Mission Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
        </div>

        {/* Vision Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Our Vision
          </h2>
          <p className="text-gray-700 text-lg">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Quisque nec est at libero gravida ullamcorper. Duis sollicitudin 
            metus a mi vulputate, a tempor nulla lacinia.
          </p>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
            Our Team
          </h2>
          <div className="space-y-4 text-lg text-gray-800">
            <p>
              John Doe | CEO | <span className="text-red-600">john@example.com</span>
            </p>
            <p>
              Jane Smith | CTO | <span className="text-red-600">jane@example.com</span>
            </p>
            <p>
              Alex Johnson | COO | <span className="text-red-600">alex@example.com</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    </section>
  );
}