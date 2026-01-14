"use client";

import { useRouter } from "next/navigation";

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
        body: JSON.stringify({email: data.email, password: data.password})
      });

      if (!response.ok) {
          throw new Error("Login failed");
      }
      console.log(response);

      router.push("/profile");
      alert("Login successful");
    } catch (error) {
      console.error("Login error:", error);
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
