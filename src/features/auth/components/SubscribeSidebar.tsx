"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { subscribeUser } from "@/services/subscribe.service";
import type { SubscribePayload } from "@/services/subscribe.service";

function SubscribeSidebar() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SubscribePayload>({
    defaultValues: {
      name: "",
      email: "",
      contact: "",
    },
  });

  const handleFormSubmit = async (form: SubscribePayload) => {
    try {
      await subscribeUser(form);

      toast.success("Subscribed successfully!");
      reset();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Subscription failed";

      toast.error(message);
    }
  };

  return (
    <div>
      <h2 className="font-bold text-2xl">SUBSCRIBE US</h2>
      <div className="w-15 h-1 bg-[#c8050b] mb-3"></div>

      <div className="w-full bg-[#2f2f2f] p-4 h-80">
        <div className="min-h-6"></div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <input
            className="w-full h-12 mb-5 p-2 bg-white text-black text-sm"
            placeholder="Enter Your Name"
            required
            type="text"
            disabled={isSubmitting}
            {...register("name")}
          />

          <input
            className="w-full h-12 mb-5 p-2 bg-white text-black text-sm"
            placeholder="Enter Your Email"
            required
            type="email"
            disabled={isSubmitting}
            {...register("email")}
          />

          <input
            className="w-full h-12 mb-6 p-2 bg-white text-black text-sm"
            placeholder="Enter Your Mobile No."
            required
            type="tel"
            maxLength={10}
            disabled={isSubmitting}
            {...register("contact")}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#c8050b] w-1/2 border flex justify-center cursor-pointer text-white py-3 mx-auto text-sm hover:bg-[#444] disabled:opacity-50"
          >
            {isSubmitting ? "SUBMITTING..." : "SUBMIT"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SubscribeSidebar;
