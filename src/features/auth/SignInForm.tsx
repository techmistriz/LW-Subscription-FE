"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { loginUser } from "@/lib/auth/auth";
import Banner from "../../components/Common/Banner";
import { useRouter } from "next/navigation";
import { useAuth } from "../authContext";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await loginUser(email, password);

      // save token + user
      const token = res?.token || res?.data?.token || res?.data?.data?.token;

      const user = res?.user || res?.data?.user || res?.data?.data?.user;

      if (!token || !user) {
        throw new Error("Invalid login response from server");
      }

      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", JSON.stringify(user));

      login(user, token);

      // IMPORTANT: replace avoids back navigation glitches
      router.replace("/dashboard");
    } catch (error: any) {
      setError(error?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-white">
      <Banner title={"sign In"} />

      <section className="py-10">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold tracking-wide">SIGN IN YOURSELF</h2>

          <p className="text-[#333333] text-sm mt-2 max-w-xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>

          <div className="w-12 h-1 bg-[#c9060a] mx-auto mt-4"></div>

          <div className="mt-6 bg-white shadow-[0_8px_20px_rgba(0,0,0,0.25)] border border-gray-200 p-8 max-w-md mx-auto text-left">
            {error && <p className="text-[#c9060a] text-sm mb-3">{error}</p>}

            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full border px-4 py-2 mb-4"
              />

              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full border px-4 py-2 mb-4"
              />

              <button
                disabled={loading}
                type="submit"
                className="bg-[#c9060a] text-white px-6 py-2 text-sm w-full"
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
