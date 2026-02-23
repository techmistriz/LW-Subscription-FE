"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Menu,
  User,
  X,
  ChevronDown,
  User2,
  NewspaperIcon,
  Facebook,
  Instagram,
} from "lucide-react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react"; // for dropdown

import SearchOverlay from "../SearchOverlay";
import { Category } from "@/types";

export default function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setIsLoggedIn(true);
        setUsername(`${user.first_name} ${user.last_name}`.trim());
        return;
      } catch {
        localStorage.removeItem("user_data");
      }
    }

    const token = localStorage.getItem("auth_token");
    if (token) {
      try {
        let payloadStr = token.split(".")[1];
        payloadStr += "=".repeat((4 - (payloadStr.length % 4)) % 4);
        const payload = JSON.parse(atob(payloadStr));
        setIsLoggedIn(true);
        setUsername(
          payload.username ||
            payload.name ||
            payload.email ||
            payload.sub ||
            "User",
        );
      } catch {
        localStorage.removeItem("auth_token");
      }
    }
  }, []);

  useEffect(() => {
    document.body.style.overflow = searchOpen || open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen, open]);

  const isActive = (slug: string) =>
    pathname === `/category/${slug}` ||
    pathname.startsWith(`/category/${slug}/`);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setIsLoggedIn(false);
    setUsername("");
    router.push("/");
  };

  return (
    <>
      <header className="border-b border-gray-300 bg-white text-black">
        <div className="relative flex items-center justify-start gap-7 h-25 max-w-6xl mx-auto px-4">
          {/* LEFT — Explore */}
          <div className="flex items-center">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 text-[#333]"
            >
              <Menu size={20} className="hover:text-[#c9060a] cursor-pointer" />
              <span className="hidden text lg:inline hover:text-[#c9060a] cursor-pointer">
                Explore
              </span>
            </button>
          </div>

          {/* CENTER — Logo */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <Link href="/" className="relative w-[190px] h-[80px] block">
              <Image
                src="/main-logo.jpg"
                alt="Lex Witness Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
          </div>

          {/* RIGHT — Search + User */}
          <div className="flex items-center  lg:ml-0">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex -ml-3 lg:ml-0 items-center gap-2  text-[#333]"
            >
              <Search
                size={20}
                className="hover:text-[#c9060a] cursor-pointer"
              />
              <span className="hidden lg:inline hover:text-[#c9060a] cursor-pointer">
                Search
              </span>
            </button>

            <div className="absolute right-5 top-20 md:top-1/2 -translate-y-1/2 flex items-center gap-3">
              {isLoggedIn ? (
                <HeadlessMenu
                  as="div"
                  className="relative inline-block text-left"
                >
                  <HeadlessMenu.Button className="flex items-center gap-1 hover:text-[#c9060a] cursor-pointer">
                    <User size={20} />
                    <span className="hidden lg:inline truncate max-w-25 mr-1">
                      {username || "Hi Suraj!"}
                    </span>
                    <ChevronDown size={16} />
                  </HeadlessMenu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="absolute right-0 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                      <div className="py-1">
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              href="/dashboard"
                              className={`block px-4 py-2 text-sm text-gray-700 ${active ? "bg-gray-100" : ""}`}
                            >
                              Dashboard
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`w-full text-left block px-4 py-2 text-sm text-gray-700 ${active ? "bg-gray-100" : ""}`}
                            >
                              Logout
                            </button>
                          )}
                        </HeadlessMenu.Item>
                      </div>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              ) : (
                <>
                  <Link href="/register" className="flex items-center gap-1">
                    <NewspaperIcon size={18} />
                    <span className="hidden lg:inline text-md hover:text-[#c9060a] text-[#333]">
                      Subscribe
                    </span>
                  </Link>
                  <Link href="/sign-in" className="flex items-center gap-1">
                    <User size={20} />
                    <span className="hidden lg:inline text-md hover:text-[#c9060a] text-[#333]">
                      Sign In
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* NAV */}
        <nav className="border-t border-gray-300 bg-gray-100">
          <ul className="flex gap-6 h-11 items-center font-normal text-[16px] max-w-280 mx-auto px-4 md:px-0 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent lg:[scrollbar-width:none] lg:[-ms-overflow-style:none] lg:[&::-webkit-scrollbar]:hidden">
            {categories.map((item, index) => (
              <li key={`${item.slug}-${index}`} className="shrink-0">
                <Link
                  href={`/category/${item.slug}`}
                  className={`hover:text-[#c9060a] transition-colors ${
                    item.slug && isActive(item.slug)
                      ? "text-[#c9060a] border-[#c9060a] pb-1"
                      : "text-[#333]"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* MOBILE SIDEBAR */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-40"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-65 sm:w-70 lg:w-75 bg-[#333333] text-white z-50 flex flex-col transform transition-transform duration-500 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-600">
          <Image
            src="https://lexwitness.com/wp-content/themes/lexwitness/images/favicon.png"
            alt=""
            width={38}
            height={38}
          />
          <button onClick={() => setOpen(false)}>
            <X size={22} className="text-white cursor-pointer" />
          </button>
        </div>

        <nav className="flex flex-col h-full overflow-y-scroll">
          <ul className="flex flex-col text-sm font-medium">
            {categories.map((item, index) => (
              <li key={`${item.slug}-${index}`}>
                <Link
                  href={`/category/${item.slug}`}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 border-b border-gray-600 transition ${
                    item.slug && isActive(item.slug)
                      ? "text-[#c9060a] border-[#c9060a] pb-1"
                      : "text-[#333]"
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* MOBILE BOTTOM */}
          <div className="mt-auto bg-[#545454] border-t border-gray-600">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <User2 />
                {isLoggedIn ? (
                  <div className="relative">
                    <button
                      onClick={() => setOpen(!open)}
                      className="hover:text-[#c9060a] transition duration-300 flex items-center gap-1"
                    >
                      {username} <ChevronDown size={16} />
                    </button>
                    {/* Simple mobile dropdown */}
                    {open && (
                      <div className="absolute left-0 mt-1 bg-gray-800 rounded-md w-36 py-1 z-50">
                        <Link
                          href="/dashboard"
                          onClick={() => setOpen(false)}
                          className="block px-4 py-2 text-sm hover:bg-gray-700"
                        >
                          Dashboard
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setOpen(false);
                          }}
                          className="w-full text-left block px-4 py-2 text-sm hover:bg-gray-700"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="hover:text-[#c9060a] transition duration-300"
                  >
                    Sign-in
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-3 ml-auto">
                <a
                  href="#facebook"
                  rel="noopener noreferrer"
                  className="hover:text-[#c9060a] transition duration-300"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#instagram"
                  rel="noopener noreferrer"
                  className="hover:text-[#c9060a] transition duration-300"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
