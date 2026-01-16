"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
 async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    

    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email: data.email, password: data.password})
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      toast.success("Login successful 🎉", {
        duration: 3000,
        style: {
          background: "#16a34a",
          color: "#fff",
        },
      });

      router.push("/profile");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error?.message || "Login failed. Please try again.", {
        duration: 3000,
        style: {
          background: "#dc2626",
          color: "#fff",
        },
      });
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Login Page</h1>

      <form onSubmit={submitHandler}>

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}
