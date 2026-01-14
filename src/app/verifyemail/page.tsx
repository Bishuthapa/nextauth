"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!token) return;

    const verifyUserEmail = async () => {
      try {
        await axios.post("/api/user/verify-email", { token });
        setVerified(true);
      } catch (err: any) {
        setError(true);
        console.log(err?.response?.data);
      }
    };

    verifyUserEmail();
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>

      <h2 className="p-2 bg-orange-500 text-black">
        {token ? token : "No token"}
      </h2>

      {verified && (
        <div>
          <h2 className="text-2xl">Email Verified ✅</h2>
          <Link href="/login">Login</Link>
        </div>
      )}

      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">
            Verification Failed ❌
          </h2>
        </div>
      )}
    </div>
  );
}
