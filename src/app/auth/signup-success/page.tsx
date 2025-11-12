"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function SignupSuccessPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("signupEmail") || "";
    const storedFullName = localStorage.getItem("signupFullName");
    const storedRole = localStorage.getItem("signupRole");
    setEmail(storedEmail);

    const createUser = async () => {
      if (!storedEmail) return;

      try {
        const res = await fetch("/api/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: storedEmail,
            fullName: storedFullName,
            role: storedRole,
          }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to create user");
        setSuccess(true);
      } catch (err: any) {
        console.error(err.message);
        setError(err.message);
      }
    };

    createUser();
  }, []);

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-black p-4 transition-colors'>
      <div className='w-full max-w-md bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800/40 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-800 transition-colors'>
        <h2 className='text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100'>
          Check Your Email
        </h2>
        <p className='text-gray-500 dark:text-gray-400 mb-6'>
          We've sent you a confirmation link. Please check your email and click
          the link to activate your account.
        </p>

        {error && <p className='text-red-500 mb-2'>{error}</p>}
        {success && (
          <p className='text-green-500 mb-2'>Confirmation email sent!</p>
        )}

        <div className='mb-4'>
          <input
            className='w-full max-w-sm border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary transition-colors'
            type='email'
            placeholder='your@email.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Link
          href='/auth/login'
          className='inline-block py-2 px-4 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors'>
          Back to Login
        </Link>
      </div>
    </div>
  );
}
