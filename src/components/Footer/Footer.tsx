"use client";

import React from "react";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import {
  FaLinkedinIn,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { motion } from "framer-motion";

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
            <h1 className="text-[#c9060a] font-semibold text-[18px] mb-4">
              CONTACT
            </h1>
            <div className="space-y-6 text-sm text-[#E2E2E2] mb-6">
              <div>
                <p className="font-semibold text-white">Bhupinder Kaur</p>
                <p>Sr. Manager - Brand Innovation</p>

                <a
                  href="mailto:bhupinder@witnesslive.in"
                  className="block hover:text-[#c9060a] transition"
                >
                  bhupinder@witnesslive.in
                </a>

                <a
                  href="tel:+919654155065"
                  className="hover:text-[#c9060a] transition"
                >
                  +91-9654155065
                </a>
              </div>

              <div>
                <p className="font-semibold text-white">Neelima Maheshwari</p>
                <p>Sr. Manager - Brand Innovation</p>

                <a
                  href="mailto:neelima.maheshwari@witnesslive.in"
                  className="block hover:text-[#c9060a] transition"
                >
                  neelima.maheshwari@witnesslive.in
                </a>

                <a
                  href="tel:+918800841600"
                  className="hover:text-[#c9060a] transition"
                >
                  +91-8800841600
                </a>
              </div>
            </div>

            <Image
              src="https://lexwitness.com/wp-content/themes/lexwitness/images/logo-white.png"
              alt="Lex Witness"
              width={200}
              height={68}
              className="mb-6 w-48 h-auto object-contain -ml-2 "
              priority
            />

            <div className="text-sm text-[#E2E2E2] my-4">
              {/* <p className="font-semibold text-white">Address:</p> */}
              <p>
                <span className="font-semibold text-white">Address: </span>Suite
                # B 1/6, LGF,
              </p>
              <p>Hauz Khas, New Delhi - 110016</p>
            </div>

            <p className="mt-4 text-sm text-[#E2E2E2]">Connect Us:</p>
            {/* 
            <div className="flex items-center gap-2.5 mt-3.5">
              <a
                href="https://wa.me/917982771770?text=Hi%2C%20I%20have%20a%20few%20questions%20about%20Lex%20Witness"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-md bg-[#4CAF7A] flex items-center justify-center text-white hover:brightness-110 transition"
              >
                <FaWhatsapp className="text-lg" />
              </a>

              <a
                href="tel:+7982771770"
                className="w-8 h-8 rounded-md bg-[#E89B72] flex items-center justify-center text-white hover:brightness-110 transition"
              >
                <FaPhoneAlt className="text-lg" />
              </a>

              <a
                href="mailto:info@witnesslive.in"
                className="w-8 h-8 rounded-md bg-[#D97A72] flex items-center justify-center text-white hover:brightness-110 transition"
              >
                <FaEnvelope className="text-lg" />
              </a>

              <a
                href="#"
                className="w-8 h-8 rounded-md bg-[#5C8FD6] flex items-center justify-center text-white hover:brightness-110 transition"
              >
                <FaLinkedinIn className="text-lg" />
              </a>
            </div> */}

            <div className="mt-4">
              <motion.div
                // initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex gap-2.5">
                  {[
                    {
                      icon: FaWhatsapp,
                      href: "https://wa.me/917982771770?text=Hi%2C%20I%20have%20a%20few%20questions%20about%20Lex%20Witness",
                    },
                    {
                      icon: FaPhoneAlt,
                      href: "tel:+7982771770",
                    },
                    {
                      icon: FaEnvelope,
                      href: "mailto:info@witnesslive.in",
                    },
                    {
                      icon: FaLinkedinIn,
                      href: "#",
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;

                    return (
                      <motion.a
                        key={i}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        // whileHover={{ scale: 1.1, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        <Icon className="text-lg" />
                      </motion.a>
                    );
                  })}
                </div>
              </motion.div>
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
            <h3 className="text-[#c9060a] font-semibold text-[18px] mb-4">
              THE LEX WITNESS SUMMITS LEGACY - 10 YEARS & COUNTING!
            </h3>

            <ul className="space-y-6 text-sm">
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
              ].map(([title, link, cities], i) => (
                <li key={i}>
                  <a
                    href={`https://${link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <p className="text-gray-200 font-semibold hover:text-[#c9060a] transition-colors">
                      {title}
                    </p>
                  </a>
                  <p className="text-xs text-[#E2E2E2] mt-1">{cities}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <h3 className="text-[#c9060a] font-semibold text-[18px] mb-4">
              EXPLORE FURTHER!
            </h3>

            <p className="text-sm leading-relaxed text-[#E2E2E2]">
              We at Lex Witness strategically assist firms in reaching out to
              the relevant audience sets through various knowledge sharing
              initiatives. Here are some more info decks for you to know us
              better :)
            </p>

            {/* <h3 className="text-white font-semibold text-[18px] mb-4 mt-10">
              OTHER LINKS
            </h3> */}

            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* <Link
                href="/brand-deck"
                className="border border-[#c9060a] rounded-lg px-3 py-5 text-center text-xs font-medium whitespace-nowrap text-white hover:bg-[#c9060a] transition"
              >
                OUR BRAND DECK
              </Link> */}

              <Link
                href="/about"
                className="border border-[#c9060a] rounded-lg px-3 py-5 text-center text-xs font-medium whitespace-nowrap text-white hover:bg-[#c9060a] transition"
              >
                About Lex Witnes
              </Link>

              <Link
                href="/events"
                className="border border-[#c9060a] rounded-lg px-3 py-5 text-center text-xs font-medium whitespace-nowrap text-white hover:bg-[#c9060a] transition"
              >
                EVENTS
              </Link>
               <Link
                href="/privacy"
                className="border border-[#c9060a] rounded-lg px-3 py-5 text-center text-xs font-medium whitespace-nowrap text-white hover:bg-[#c9060a] transition"
              >
                PRIVACY POLICY
              </Link>

              <Link
                href="/terms"
                className="border border-[#c9060a] rounded-lg px-3 py-5 text-center text-xs font-medium whitespace-nowrap text-white hover:bg-[#c9060a] transition"
              >
                TERMS & CONDITIONS
              </Link>

              <Link
                href="/get-involved"
                className="border border-[#c9060a] leading-5 rounded-lg px-3 py-5 text-center text-xs font-medium whitespace-nowrap text-white hover:bg-[#c9060a] transition"
              >
                Get-Involved
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
          {"|"}
          <p>Rights Of Admission Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
