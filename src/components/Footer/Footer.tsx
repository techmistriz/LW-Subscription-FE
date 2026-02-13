import React from "react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-[#2f2f2f] text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-4">
            <Image
              src="https://lexwitness.com/wp-content/themes/lexwitness/images/logo-white.png"
              alt="Lex Witness"
              width={192}
              height={48}
              className="mb-4 w-48 h-12 object-contain -ml-10"
              priority
            />

           

            <h3 className="text-white font-semibold mb-2">
              ABOUT <span className="text-[#c9060a]">WITNESS</span>
            </h3>

            <p className="text-sm leading-relaxed text-gray-400">
              For over 10 years, since its inception in 2009 as a monthly, Lex
              Witness has become India’s most credible platform for the legal
              luminaries to opine, comment and share their views. more...
            </p>

            <p className="mt-4 text-sm">Connect Us:</p>

            {/* Social */}
            <div className="flex gap-3 mt-2">
              {["X", "X", "X"].map((item, i) => (
                <span
                  key={i}
                  className="border w-7 h-7 flex items-center justify-center text-xs"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* App Buttons */}
            <div className="flex gap-3 mt-5 flex-wrap">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Get it on Google Play"
                width={180}
                height={53}
                className="h-10 w-auto object-contain"
                priority
              />

              <Image
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                alt="Download on the App Store"
                width={180}
                height={53}
                className="h-10 w-auto object-contain ml-4"
                priority
              />
            </div>
          </div>

          {/* MIDDLE */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold mb-4">
              THE LEX WITNESS SUMMITS LEGACY
            </h3>

            <ul className="space-y-4 text-sm">
              {[
                [
                  "The Grand Masters – A Corporate Counsel Legal Best Practices Summit Series",
                  "www.grandmasters.in",
                ],
                ["The Real Estate & Construction Legal Summit", "www.rcls.in"],
                [
                  "The Information Technology Legal Summit",
                  "www.itlegalsummit.com",
                ],
                ["The Banking & Finance Legal Summit", "www.bfls.in"],
                [
                  "The Media, Advertising and Entertainment Legal Summit",
                  "www.maels.in",
                ],
                ["The Pharma Legal & Compliance Summit", "www.plcs.co.in"],
              ].map(([title, link], i) => (
                <li key={i}>
                  <p className="text-gray-200">{title}</p>
                  <p className="text-[#c9060a] text-xs">
                    {link} | 8 Years & Counting
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold mb-4">EXPLORE FURTHER!</h3>

            <p className="text-sm leading-relaxed text-gray-400">
              We at Lex Witness strategically assist firms in reaching out to
              the relevant audience sets through various knowledge sharing
              initiatives. Here are some more info decks for you to know us
              better.
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-600 mt-12 pt-6 text-sm text-center md:flex md:justify-center md:gap-6">
          <p>
            © 2020 Lex Witness – India’s 1st Magazine On Legal & Corporate
            Affairs
          </p>
          <p>Rights Of Admission Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
