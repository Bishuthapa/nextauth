"use client";

import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
 async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };
    

    try {
      const response = await fetch("/api/user/signup", {
        method: "POST",
        body: JSON.stringify({username: data.username, email: data.email, password: data.password})
      });

      if (!response.json()) {
          throw new Error("Signup failed");
      }
        router.push("/login");
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Signup Page</h1>

      <form onSubmit={submitHandler}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          required
        />

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

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
