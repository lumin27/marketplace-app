"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { createUser } from "@/lib/actions";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      const { data: supabaseData, error: supabaseError } =
        await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo:
              process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
              `${window.location.origin}/dashboard`,
            data: { full_name: formData.fullName, role: formData.role },
          },
        });

      if (supabaseError) throw supabaseError;
      if (!supabaseData.user) throw new Error("Supabase user not returned");

      await createUser({
        id: supabaseData.user.id,
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role.toUpperCase() as "BUYER" | "SELLER",
      });

      localStorage.setItem("signupEmail", formData.email);
      localStorage.setItem("signupFullName", formData.fullName);
      localStorage.setItem("signupRole", formData.role);

      router.push("/auth/signup-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-gray-200 dark:from-gray-900 dark:via-gray-950 dark:to-black p-4'>
      <div className='w-full max-w-md bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800/40 rounded-xl p-6 border border-gray-200 dark:border-gray-800 transition-colors'>
        <h2 className='text-2xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100'>
          Create Account
        </h2>
        <p className='text-center text-gray-500 dark:text-gray-400 mb-6'>
          Join our marketplace community
        </p>

        <form onSubmit={onSubmit} className='space-y-4'>
          <div>
            <label htmlFor='fullName' className='block text-sm font-medium'>
              Full Name
            </label>
            <input
              id='fullName'
              type='text'
              placeholder='Enter your full name'
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className='mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-secondary'
            />
          </div>

          <div>
            <label htmlFor='email' className='block text-sm font-medium'>
              Email
            </label>
            <input
              id='email'
              type='email'
              placeholder='Enter your email'
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className='mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-secondary'
            />
          </div>

          <div>
            <label htmlFor='role' className='block text-sm font-medium'>
              I want to
            </label>
            <select
              id='role'
              value={formData.role}
              onChange={(e) => handleChange("role", e.target.value)}
              className='mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-secondary'>
              <option value='buyer'>Buy items</option>
              <option value='seller'>Sell items</option>
            </select>
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium'>
              Password
            </label>
            <input
              id='password'
              type='password'
              placeholder='Create a password'
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              className='mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-secondary'
            />
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium'>
              Confirm Password
            </label>
            <input
              id='confirmPassword'
              type='password'
              placeholder='Confirm your password'
              value={formData.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className='mt-1 block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-secondary'
            />
          </div>

          {error && <p className='text-sm text-red-500'>{error}</p>}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-2 px-4 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors'>
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-gray-600'>
          Already have an account?{" "}
          <Link href='/auth/login' className='text-secondary hover:underline'>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
