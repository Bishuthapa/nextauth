"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { loginSchema } from "@/src/validators/loginSchema";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const rawData = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    const parsed = loginSchema.safeParse(rawData);

    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }


    setLoading(true);

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed" );
      }


      toast.success("Login successful 🎉", {
        duration: 3000,
        style: {
          background: "#16a34a",
          color: "#fff",
        },
      });
      setTimeout(() =>
        router.push("/profile"),
        1200

      )
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.message || "Login failed. Please try again.", {
        duration: 3000,
        style: {
          background: "#dc2626",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">

      <form onSubmit={submitHandler}
        className="w-full max-w-md space-y-4 rounded-xl border p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full rounded border px-3 py-2"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full rounded border px-3 py-2"
        />

        <button
          disabled={loading}
          className="w-full rounded bg-black py-2 text-white disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-sm text-center">
          Don&apos;t have an account?{" "}
          <a href="/signup" className="text-blue-600">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
