"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, Fragment, useRef } from "react";
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
} from "lucide-react";
import { Menu as HeadlessMenu, Transition } from "@headlessui/react";

import SearchOverlay from "../SearchOverlay";
import { Category } from "@/types";
import { useAuth } from "@/features/authContext";

export default function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileUserDropdown, setMobileUserDropdown] = useState(false);

  const { user, logout, loading } = useAuth();
  
  // Ref to track the active item for scrolling
  const activeItemRef = useRef<HTMLLIElement | null>(null);

  const isLoggedIn = !!user;
  const username = user?.firstName || "User";

  // Handle body scroll lock
  useEffect(() => {
    if (searchOpen || open) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }
  }, [searchOpen, open]);

  // Handle scrolling active item into center when sidebar opens or path changes
  useEffect(() => {
    if (open && activeItemRef.current) {
      activeItemRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [open, pathname]);

  const isActive = (slug: string) =>
    pathname === `/category/${slug}` || pathname.startsWith(`/category/${slug}/`);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (loading) return null;

  return (
    <>
      <header className="border-b border-gray-300 bg-white text-black">
        <div className="relative flex items-center justify-start gap-7 h-25 max-w-6xl mx-auto px-4">
          
          {/* LEFT — Explore */}
          <div className="flex items-center z-10">
            <button onClick={() => setOpen(true)} className="flex items-center gap-2 text-[#333]">
              <Menu size={20} className="hover:text-[#c9060a] cursor-pointer" />
              <span className="hidden lg:inline hover:text-[#c9060a] cursor-pointer">Explore</span>
            </button>
          </div>

          {/* CENTER — Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
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
          <div className="flex items-center z-10">
            <button onClick={() => setSearchOpen(true)} className="flex -ml-3 lg:ml-0 items-center gap-2 text-[#333]">
              <Search size={20} className="hover:text-[#c9060a] cursor-pointer" />
              <span className="hidden lg:inline hover:text-[#c9060a] cursor-pointer">Search</span>
            </button>

            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {isLoggedIn ? (
                <HeadlessMenu as="div" className="relative inline-block text-left">
                  <HeadlessMenu.Button className="flex items-center gap-1 hover:text-[#c9060a] cursor-pointer">
                    <span className="hidden lg:inline truncate max-w-25 mr-1 text-gray-500">
                      Hi! {username}
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
                            <Link href="#" className={`block px-4 py-2 text-sm text-gray-700 ${active ? "bg-gray-100" : ""}`}>
                              Dashboard
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button onClick={handleLogout} className={`w-full text-left block px-4 py-2 text-sm text-gray-700 ${active ? "bg-gray-100" : ""}`}>
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
                  <Link href="/subscription" className="flex items-center gap-1">
                    <NewspaperIcon className="hover:text-[#c9060a]" size={18} />
                    <span className="hidden lg:inline text-md hover:text-[#c9060a] text-[#333]">Subscribe</span>
                  </Link>
                  <Link href="/sign-in" className="flex items-center gap-1">
                    <User className="hover:text-[#c9060a]" size={20} />
                    <span className="hidden lg:inline text-md hover:text-[#c9060a] text-[#333]">Sign In</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* NAV BAR */}
        <nav className="border-t border-gray-300 bg-gray-100">
          <ul className="flex gap-6 h-11 items-center font-normal text-[16px] max-w-280 mx-auto px-4 md:px-0 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-hide">
            {categories.map((item, index) => (
              <li key={`${item.slug}-${index}`} className="shrink-0">
                <Link
                  href={`/category/${item.slug}`}
                  className={`hover:text-[#c9060a] transition-colors ${
                    item.slug && isActive(item.slug) ? "text-[#c9060a] border-[#c9060a] pb-1" : "text-[#333]"
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
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-black/60 z-40" />}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#333333] text-white z-50 flex flex-col transform transition-transform duration-500 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-600">
          <Image src="https://lexwitness.com/wp-content/themes/lexwitness/images/favicon.png" alt="" width={38} height={38} />
          <button onClick={() => setOpen(false)}>
            <X size={22} className="text-white cursor-pointer" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scroll-smooth">
          <ul className="flex flex-col text-sm font-medium">
            {categories.map((item, index) => {
              const active = item.slug && isActive(item.slug);
              return (
                <li 
                  key={index} 
                  ref={active ? activeItemRef : null} // Attach ref to active item
                >
                  <Link
                    href={`/category/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className={`block px-4 py-4 border-b border-gray-600 transition ${
                      active ? "bg-[#222222] text-[#c9060a]" : "hover:bg-[#3a3a3a] text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* MOBILE BOTTOM */}
        <div className="mt-auto bg-[#545454] border-t border-gray-600">
          <div className="flex flex-col px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User2 size={20} />
                {isLoggedIn ? (
                  <button 
                    onClick={() => setMobileUserDropdown(!mobileUserDropdown)}
                    className="flex items-center gap-1 text-sm font-medium"
                  >
                    Hi! {username} <ChevronDown size={14} className={`transition-transform ${mobileUserDropdown ? 'rotate-180' : ''}`} />
                  </button>
                ) : (
                  <Link href="/sign-in" onClick={() => setOpen(false)} className="text-sm">Sign-in</Link>
                )}
              </div>
              
              <div className="flex gap-2 ml-4">
                <a href="#" className="w-8 h-6 flex items-center justify-center bg-[#0A66C2] text-white"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.78v2.22h.07c.66-1.25 2.27-2.57 4.68-2.57 5 0 5.92 3.28 5.92 7.55V24h-5v-7.92c0-1.89-.03-4.33-2.63-4.33-2.63 0-3.03 2.05-3.03 4.17V24h-5V8z" /></svg></a>
                <a href="#" className="w-8 h-5 flex items-center justify-center bg-[#25D366] text-white"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163a11.907 11.907 0 01-1.62-6.126C.124 5.355 5.48 0 12.057 0c3.2 0 6.2 1.25 8.457 3.508a11.894 11.894 0 013.5 8.49c-.003 6.578-5.358 11.933-11.936 11.933a11.89 11.89 0 01-6.19-1.652L.057 24zm6.597-3.807c1.733.995 3.38 1.591 5.403 1.592 5.448 0 9.888-4.441 9.891-9.892.002-2.64-1.03-5.12-2.893-6.987-1.86-1.868-4.337-2.897-6.877-2.895-5.447 0-9.888 4.44-9.891 9.884-.001 2.352.785 4.635 2.22 6.414l-.999 3.648 3.66-.966zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.296-.149-1.758-.868-2.03-.967-.272-.099-.47-.149-.669.15-.198.297-.767.966-.94 1.162-.173.198-.347.223-.644.074-.296-.149-1.248-.46-2.378-1.463-.879-.784-1.472-1.749-1.646-2.046-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.521-.074-.149-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.693.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413z" /></svg></a>
              </div>
            </div>

            {isLoggedIn && mobileUserDropdown && (
              <div className="mt-3 bg-[#444] rounded border border-gray-600 flex flex-col overflow-hidden">
                <Link href="#dashboard" onClick={() => setOpen(false)} className="px-4 py-2 text-xs hover:bg-[#333]">Dashboard</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-xs hover:bg-[#333]">Logout</button>
              </div>
            )}
          </div>
        </div>
      </aside>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}