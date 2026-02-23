import React from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#2f2f2f] text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10">
        {/* TOP GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* LEFT */}
          <div className="lg:col-span-4">
            <Image
              src="https://lexwitness.com/wp-content/themes/lexwitness/images/logo-white.png"
              alt="Lex Witness"
              width={200}
              height={68}
              className="mb-4 w-48 h-15 object-contain -ml-6"
              priority
            />

           

            <h3 className="text-white text-[18px] font-semibold mb-2">
              ABOUT <span className="text-[#c9060a]">WITNESS</span>
            </h3>

            <p className="text-sm leading-relaxed text-[#E2E2E2]">
              For over 10 years, since its inception in 2009 as a monthly, Lex
              Witness has become India’s most credible platform for the legal
              luminaries to opine, comment and share their views. more...
            </p>

            <p className="mt-4 text-sm">Connect Us:</p>

            {/* Social */}
             <div className="flex lg:mt-2 gap-3">
                    <a
                      href="#linkedin"
                      className="w-6 h-6 flex items-center justify-center  border border-[#0A66C2] text-[#0A66C2] transition-all duration-300 hover:bg-[#0A66C2] hover:text-white"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.78v2.22h.07c.66-1.25 2.27-2.57 4.68-2.57 5 0 5.92 3.28 5.92 7.55V24h-5v-7.92c0-1.89-.03-4.33-2.63-4.33-2.63 0-3.03 2.05-3.03 4.17V24h-5V8z" />
                      </svg>
                    </a>
                  </div>

            {/* App Buttons */}
            {/* <div className="flex gap-3 mt-5 flex-wrap">
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
            </div> */}
          </div>

          {/* MIDDLE */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold text-[18px] mb-4">
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
                    {link} <span className="text-[#E2E2E2]">| 8 Years & Counting</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold text-[18px] mb-4">EXPLORE FURTHER!</h3>

            <p className="text-sm leading-relaxed text-[#E2E2E2]">
              We at Lex Witness strategically assist firms in reaching out to
              the relevant audience sets through various knowledge sharing
              initiatives. Here are some more info decks for you to know us
              better.
            </p>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-600 mt-12 py-6 text-[14px] text-[#E2E2E2] text-center md:flex md:justify-center md:gap-6">
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
