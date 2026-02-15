"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { loginUser } from "@/lib/auth/auth";
import Banner from "../Common/Banner";

const bannerImg: React.CSSProperties = {
  backgroundImage: `url(${process.env.NEXT_PUBLIC_BANNER_BASE_URL})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(email.trim(), password);

      // Store auth data in localStorage
      localStorage.setItem("auth_token", res.data.token);
      localStorage.setItem("user_data", JSON.stringify(res.data.user));

      // Redirect to home
      window.location.href = "/";
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
          <Banner title={"sign In"} />

      {/* FORM SECTION */}
      <section className="py-10">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold tracking-wide">SIGN IN YOURSELF</h2>
          <p className="text-[#333333] text-sm mt-2 max-w-xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.
          </p>
          <div className="w-12 h-1 bg-[#c9060a] mx-auto mt-4"></div>

          <div className="mt-6 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] border border-gray-200 p-8 max-w-md mx-auto text-left">
            {error && <p className="text-[#c9060a] text-sm mb-3">{error}</p>}

            <label className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <form onSubmit={handleSubmit} action="">
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-200 px-4 py-2 mb-4 disabled:opacity-50"
              />

              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full border border-gray-200 px-4 py-2 mb-4 disabled:opacity-50"
              />

              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" disabled={loading} />
                <span className="text-sm">Remember Me</span>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="bg-[#c9060a] text-white px-6 py-2 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <p className="text-sm text-[#c9060a] mt-4">
              <Link href="/register">Register</Link> |{" "}
              <Link href="/password-reset">Lost your password?</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
