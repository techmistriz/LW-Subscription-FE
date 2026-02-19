"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { subscribeUser } from "@/lib/auth/subscribe";

interface FormData {
  name: string;
  email: string;
  contact: string;
}

function SubscribeSidebar() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await subscribeUser(form);
      setMessage("Subscribed successfully!");

      setTimeout(() => {
        setMessage(null);
      }, 3000);

      setForm({ name: "", email: "", contact: "" });
    } catch (err: any) {
      setError(err.message);

      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl">SUBSCRIBE US</h2>
      <div className="w-15 h-1 bg-[#c9060a] mb-3"></div>

      <div className="w-full bg-[#2f2f2f] p-4 h-80" >
        <div className="min-h-6  ">
          {message && <p className="text-white text-sm mb-1">{message}</p>}
          {error && <p className="text-white text-sm mb-1">{error}</p>}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full h-12 mb-5 p-2 bg-white text-black text-sm"
            placeholder="Enter Your Name"
            required
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            className="w-full h-12 mb-5 p-2 bg-white text-black text-sm"
            placeholder="Enter Your Email"
            required
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />

          <input
            className="w-full h-12 mb-6 p-2 bg-white text-black text-sm"
            placeholder="Enter Your Mobile No."
            required
            type="tel"
            maxLength={10}
            name="contact"
            value={form.contact}
            onChange={handleChange}
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-[#c9060a] w-1/2 border flex justify-center cursor-pointer text-white  py-3 mx-auto text-sm hover:bg-[#444] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubscribeSidebar;
