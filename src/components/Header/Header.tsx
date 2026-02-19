"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Menu,
  User,
  X,
  LogOut,
} from "lucide-react";
import { Facebook, Instagram } from "lucide-react";

import SearchOverlay from "../SearchOverlay";
// import { getCategories } from "@/lib/api/services/categories";
// import { NavSkeleton } from "../Skeletons/skeleton";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  // const [navCategories, setNavCategories] = useState<Category[]>([]);
  // const [loading, setLoading] = useState(true);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    // 1. Try stored user data first (faster, more reliable)
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

    // 2. Fallback to JWT token
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
    document.body.style.overflow = searchOpen ? "hidden" : "auto";
  }, [searchOpen]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
        <div className="relative flex items-center justify-between h-25 max-w-6xl mx-auto px-4">
          {/* LEFT — Explore */}
          <div className="flex items-center">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 text-[#333]"
            >
              <Menu size={20} />
              <span className="hidden text lg:inline hover:text-[#c9060a]">
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
          <div className="flex items-center gap-4 mr-5 lg:ml-0">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 text-[#333]"
            >
              <Search size={20} />
              <span className="hidden  lg:inline hover:text-[#c9060a]">
                Search
              </span>
            </button>

            {/* Logged In User */}
            {isLoggedIn && (
              <>
                <button onClick={handleLogout} title="Logout">
                  <LogOut size={20} />
                </button>

                <div className="hidden lg:flex items-center gap-1">
                  <User size={20} />
                  <span className="text-sm truncate max-w-28">{username}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* NAV (unchanged) */}
        <nav className="border-t border-gray-300 bg-gray-100">
          <ul className="flex gap-6 h-11 items-center font-normal text-[16px] max-w-280 mx-auto px-4 md:px-0 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent lg:[scrollbar-width:none] lg:[-ms-overflow-style:none] lg:[&::-webkit-scrollbar]:hidden">
            {categories.map((item, index) => {
              const active = isActive(item.slug);
              return (
                <li key={`${item.slug}-${index}`} className="shrink-0">
                  <Link
                    href={`/category/${item.slug}`}
                    className={`hover:text-[#c9060a] transition-colors ${
                      active
                        ? "text-[#c9060a]  border-[#c9060a] pb-1"
                        : "text-[#333]"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* MOBILE SIDEBAR - CONDITIONAL */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/60 z-40"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-65 sm:w-70 lg:w-75 bg-[#333333] text-white z-50 flex flex-col transform transition-transform duration-500 ${open ? "translate-x-0" : "-translate-x-full"}`}
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

        <nav className="flex flex-col h-full overflow-y-scroll ">
          <ul className="flex flex-col text-sm font-medium">
            {categories.map((item, index) => {
              const active = isActive(item.slug);
              return (
                <li key={`${item.slug}-${index}`}>
                  <Link
                    href={`/category/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-3 border-b border-gray-600 transition ${
                      active
                        ? "bg-[#3a3a3a] text-[#c9060a]"
                        : "hover:bg-[#3a3a3a]"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* MOBILE BOTTOM - CONDITIONAL  */}
          <div className="mt-auto bg-[#545454] border-t border-gray-600">
            <div className="flex items-center justify-between px-4 py-3">
              {/* LEFT SIDE (Login / Logout) */}
              {/* <div className="flex items-center gap-2">
                <User2 />
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpen(false);
                    }}
                    className="hover:text-[#c9060a] transition duration-300"
                  >
                    Logout ({username})
                  </button>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="hover:text-[#c9060a] transition duration-300"
                  >
                    Sign-in
                  </Link>
                )}
              </div> */}

              {/* RIGHT SIDE (Social Icons) */}
              <div className="flex items-center gap-3 ml-auto">
                <a
                  href=" #facebook"
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
