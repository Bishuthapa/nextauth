"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { signupSchema } from "@/src/validators/signupSchema";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: React.FormEvent) => {
    
    e.preventDefault();
    const {username, password, email} = form;
    // Zod validation
    const result = signupSchema.safeParse(form);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password}),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      toast.success("Account created! Check your email");

      // redirect after success
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      if(err instanceof Error) toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-4 rounded-xl border p-6 shadow"
      >
        <h1 className="text-2xl font-bold text-center">Create Account</h1>

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        <input 
          name= "confirmPassword"
          type="password"
          placeholder="confirm password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full rounded border px-3 py-2"
        />

        <button
          disabled={loading}
          className="w-full rounded bg-black py-2 text-white disabled:opacity-60"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
