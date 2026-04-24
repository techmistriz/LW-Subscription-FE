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

import { logoutUser } from "@/redux/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { toast } from "sonner";

export default function Header({ categories }: { categories: Category[] }) {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const isLoggedIn = !!user;
  const username = user?.first_name || "User";


const handleLogout = async () => {
  dispatch(logoutUser()); // no await
  toast.success("Logout successful!");

  router.replace("/sign-in");
};

// const handleLogout = async () => {
//   await dispatch(logoutUser());
//   toast.success("Logout successful!");

//     router.replace("/sign-in");
//     router.refresh();
//   };

  // Ref to track the active item for scrolling
  const activeItemRef = useRef<HTMLLIElement | null>(null);


  // Handle body scroll lock
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
    pathname === `/category/${slug}` ||
    pathname.startsWith(`/category/${slug}/`);

  const authPlanLink = isLoggedIn ? "/subscription" : "/register";

  // if (loading) return null;
  // if (loading) {
  //   return (
  //     <header className="border-b h-20 flex items-center px-4">
  //       <div className="animate-pulse text-gray-400">Loading...</div>
  //     </header>
  //   );
  // }

  return (
    <>
      <header className="border-b border-gray-300 bg-white text-black">
        <div className="relative flex items-center justify-start gap-7 h-25 max-w-6xl mx-auto px-4">
          {/* LEFT — Explore */}
          <div className="flex items-center z-10">
            <button
              onClick={() => setOpen(true)}
              className="flex items-center gap-2 text-[#333]"
            >
              <Menu size={20} className="hover:text-[#c9060a] cursor-pointer" />
              <span className="hidden lg:inline hover:text-[#c9060a] cursor-pointer">
                Explore
              </span>
            </button>
          </div>

          {/* CENTER — Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" scroll={false} prefetch={true}>
              <div className="relative block w-[190px] h-[80px]">
                <Image
                  src="/main-logo.png"
                  alt="Lex Witness Logo"
                  fill
                  sizes="190px"
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* RIGHT — Search + User */}
          <div className="flex items-center z-10">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex -ml-3 lg:ml-0 items-center gap-2 text-[#333]"
            >
              <Search
                size={20}
                className="hover:text-[#c9060a] cursor-pointer"
              />
              <span className="hidden lg:inline hover:text-[#c9060a] cursor-pointer">
                Search
              </span>
            </button>

            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3">
              {isLoggedIn ? (
                <HeadlessMenu
                  as="div"
                  className="relative inline-block text-left"
                >
                  <HeadlessMenu.Button className="flex items-center gap-1 hover:text-[#c9060a] cursor-pointer">
                    <span className="hidden lg:inline hover:text-[#c9060a] cursor-pointer">
                      Hi {username}
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
                              className={`block px-4 py-2 text-sm text-gray-700 hover:text-[#c6090a] ${active ? "bg-gray-100" : ""}`}
                            >
                              Dashboard
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <Link
                              href={authPlanLink}
                              className={`block px-4 py-2 text-sm text-gray-700 hover:text-[#c6090a] ${active ? "bg-gray-100" : ""}`}
                            >
                              Plans
                            </Link>
                          )}
                        </HeadlessMenu.Item>
                        <HeadlessMenu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`w-full text-left block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:text-[#c6090a] ${active ? "bg-gray-100" : ""}`}
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
                  <Link href={authPlanLink} className="flex items-center gap-1">
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

        {/* NAV BAR */}
        <nav className="border-t border-gray-300 bg-gray-100">
          <ul className="flex gap-6 h-11 items-center font-normal text-[16px] max-w-280 mx-auto px-4 md:px-0 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-hide">
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
        style={{ width: "300px" }} //  FORCE WIDTH (bypasses Tailwind issues)
        className={`fixed top-0 left-0 h-full bg-[#333333] text-white z-50 flex flex-col transform transition-transform duration-500 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-20 border-b border-[#808080] flex items-center">
          <div className="w-full px-4 flex items-center justify-between">
            {/* LEFT LOGO */}
            <div className="flex items-center gap-2 py-4">
              <Image
                src="https://lexwitness.com/wp-content/themes/lexwitness/images/favicon.png"
                alt="Logo"
                width={36}
                height={36}
              />
            </div>

            {/* RIGHT SIDE (USER + CLOSE) */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User2 size={18} className="text-white " />
                {isLoggedIn ? (
                  <span className="text-md truncate max-w-25">
                    Hi {username}
                  </span>
                ) : (
                  <Link
                    href="/sign-in"
                    onClick={() => setOpen(false)}
                    className="text-sm hover:text-[#c6090a] cursor-pointer"
                  >
                    Sign-in
                  </Link>
                )}
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 cursor-pointer text-white hover:text-[#c6090a] transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto scroll-smooth">
          <ul className="flex flex-col text-sm font-medium px-4">
            {categories.map((item, index) => {
              const active = item.slug && isActive(item.slug);

              return (
                <li
                  key={index}
                  ref={active ? activeItemRef : null}
                  className="border-b border-[#808080]"
                >
                  <Link
                    href={`/category/${item.slug}`}
                    onClick={() => setOpen(false)}
                    className={`block py-4 px-1 transition  ${
                      active
                        ? "text-[#c9060a] bg-[#3a3a3a]"
                        : "text-white hover:bg-[#3a3a3a]"
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
            <div className="flex items-center justify-end">
              <div className="flex gap-2 ml-4 justify-end items-end">
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group w-8 h-8 rounded-lg flex items-center justify-center border border-[#0A66C2] text-white bg-[#0A66C2] shadow-md overflow-hidden transition-transform hover:scale-105"
                >
                  <svg
                    className="w-4 h-4 z-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8h5v16H0V8zm7.5 0h4.78v2.22h.07c.66-1.25 2.27-2.57 4.68-2.57 5 0 5.92 3.28 5.92 7.55V24h-5v-7.92c0-1.89-.03-4.33-2.63-4.33-2.63 0-3.03 2.05-3.03 4.17V24h-5V8z" />
                  </svg>

                  <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 pointer-events-none"></span>
                </a>
                <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group w-8 h-8 rounded-lg flex items-center justify-center  text-white bg-[#25D366] shadow-md overflow-hidden transition-transform hover:scale-105"
                >
                  <svg
                    className="w-6 h-6 z-10"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 pointer-events-none"></span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
