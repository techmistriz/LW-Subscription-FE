import React from "react";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import Link from "next/link";
import {
  FaLinkedinIn,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const date = new Date();
  const year = date.getFullYear();
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

            <p className="mt-4 text-sm text-[#E2E2E2]">Connect Us:</p>

            <div className="flex items-center gap-2.5 mt-3.5">
              {/* WhatsApp */}
              <a
                href="https://wa.me/917982771770?text=Hi%2C%20I%20have%20a%20few%20questions%20about%20Lex%20Witness"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-8 h-8 rounded-md bg-[#25D366] flex items-center justify-center text-white transition-all duration-300  hover:brightness-110 shadow-xs"
              >
                <FaWhatsapp className="text-2xl" />
              </a>

              {/* Phone */}
              <a
                href="tel:+7982771770"
                aria-label="Call Us"
                className="w-8 h-8 rounded-md bg-[#ff6b35] flex items-center justify-center text-white transition-all duration-300  hover:brightness-110 shadow-xs"
              >
                <FaPhoneAlt className="text-lg" />
              </a>

              {/* Email */}
              <a
                href="mailto:info@witnesslive.in"
                aria-label="Email Us"
                className="w-8 h-8 rounded-md bg-[#EA4335] flex items-center justify-center text-white transition-all duration-300  hover:brightness-110 shadow-xs"
              >
                <FaEnvelope className="text-lg" />
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                // target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="w-8 h-8 rounded-md bg-[#0A66C2] flex items-center justify-center text-white transition-all duration-300  hover:brightness-110 shadow-xs"
              >
                <FaLinkedinIn className="text-lg" />
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
                  "New Delhi, Mumbai, Bengaluru, Chennai, Hyderabad, Ahmedabad and Pune",
                ],
                [
                  "The Real Estate & Construction Legal Summit",
                  "www.rcls.in",
                  "New Delhi",
                ],
                [
                  "The Information Technology Legal Summit",
                  "www.itlegalsummit.com",
                  "Bengaluru",
                ],
                ["The Banking & Finance Legal Summit", "www.bfls.in", "Mumbai"],
                [
                  "The Media, Advertising and Entertainment Legal Summit",
                  "www.maels.in",
                  "Mumbai",
                ],
                [
                  "The Pharma Legal & Compliance Summit",
                  "www.plcs.co.in",
                  "Mumbai",
                ],
              ].map(([title, link, country], i) => (
                <li key={i}>
                  <p className="text-gray-200">{title}</p>
                  <p className="text-[#c9060a] text-xs">
                    <a
                      href={`https://${link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#c9060a] hover:underline"
                    >
                      {link}
                    </a>
                    <span className="text-[#E2E2E2]">
                      {" "}
                      | {country} | 8 Years & Counting
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold text-[18px] mb-4">
              EXPLORE FURTHER!
            </h3>

            <p className="text-sm leading-relaxed text-[#E2E2E2]">
              We at Lex Witness strategically assist firms in reaching out to
              the relevant audience sets through various knowledge sharing
              initiatives. Here are some more info decks for you to know us
              better.
            </p>

            <h3 className="text-white font-semibold text-[18px] mb-4 mt-10">
              OTHER LINKS
            </h3>
            <div className="flex flex-col gap-2 text-sm">
              <Link
                href="/about"
                className="text-[#E2E2E2] hover:text-[#c9060a] transition"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="text-[#E2E2E2] hover:text-[#c9060a] transition"
              >
                Contact Us
              </Link>

              <Link
                href="/terms"
                className="text-[#E2E2E2] hover:text-[#c9060a] transition"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/privacy"
                className="text-[#E2E2E2] hover:text-[#c9060a] transition"
              >
                Privacy Policy
              </Link>

              <Link
                href="/get-involved"
                className="text-[#E2E2E2] hover:text-[#c9060a] transition"
              >
                Get Involved
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-gray-600 mt-12 py-5 text-[14px] text-[#E2E2E2] text-center md:flex md:justify-center md:gap-6">
          <p>
            Copyright © {year} Lex Witness – India’s 1st Magazine On Legal &
            Corporate Affairs
          </p>
          <p>Rights Of Admission Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
