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
    if (searchOpen || open) {
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
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
            <Link href="/" className="relative block w-[190px] h-[80px]">
              <Image
                src="/main-logo.png"
                alt="Lex Witness Logo"
                fill
                sizes="190px"
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
                  <Link href="/register" className="flex items-center gap-1 ">
                    <NewspaperIcon className="hover:text-[#c9060a]" size={18} />
                    <span className="hidden lg:inline text-md hover:text-[#c9060a] text-[#333]">
                      Subscribe
                    </span>
                  </Link>
                  <Link href="/sign-in" className="flex items-center gap-1">
                    <User className="hover:text-[#c9060a]" size={20} />
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
                      ? "bg-[#3a3a3a] text-[#c9060a]"
                      : "hover:bg-[#3a3a3a]"
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

              <div className="flex items-center gap-2 ml-auto">
                {/* <a
                  href="#facebook"
                  rel="noopener noreferrer"
                  className="hover:text-[#c9060a] transition duration-300"
                >
                  <Facebook size={20} />
                </a> */}

                {/* <a
                  href="#instagram"
                  rel="noopener noreferrer"
                  className="hover:text-[#c9060a] transition duration-300"
                >
                  <Instagram size={20} />
                </a> */}

                <a
                  href="#"
                  // target="_blank"
                  rel="noopener noreferrer"
                  className="relative group w-9 h-6 flex items-center justify-center border border-[#0A66C2] text-[#0A66C2] bg-white shadow-sm overflow-hidden"
                >
                  <svg
                    className="w-4 h-4 z-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.78v2.22h.07c.66-1.25 2.27-2.57 4.68-2.57 5 0 5.92 3.28 5.92 7.55V24h-5v-7.92c0-1.89-.03-4.33-2.63-4.33-2.63 0-3.03 2.05-3.03 4.17V24h-5V8z" />
                  </svg>

                  <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10    pointer-events-none"></span>
                </a>

                <a
                  href="#"
                  // target="_blank"
                  rel="noopener noreferrer"
                  className="relative group w-9 h-6 flex items-center justify-center border border-[#25D366] text-[#25D366] bg-white shadow-sm overflow-hidden"
                >
                  <svg
                    className="w-4 h-4 z-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M.057 24l1.687-6.163a11.907 11.907 0 01-1.62-6.126C.124 5.355 5.48 0 12.057 0c3.2 0 6.2 1.25 8.457 3.508a11.894 11.894 0 013.5 8.49c-.003 6.578-5.358 11.933-11.936 11.933a11.89 11.89 0 01-6.19-1.652L.057 24zm6.597-3.807c1.733.995 3.38 1.591 5.403 1.592 5.448 0 9.888-4.441 9.891-9.892.002-2.64-1.03-5.12-2.893-6.987-1.86-1.868-4.337-2.897-6.877-2.895-5.447 0-9.888 4.44-9.891 9.884-.001 2.352.785 4.635 2.22 6.414l-.999 3.648 3.66-.966zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.15-.198.297-.767.966-.94 1.162-.173.198-.347.223-.644.074-.296-.149-1.248-.46-2.378-1.463-.879-.784-1.472-1.749-1.646-2.046-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413z" />
                  </svg>

                  <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10   pointer-events-none"></span>
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
