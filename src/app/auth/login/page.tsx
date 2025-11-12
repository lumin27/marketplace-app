"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const supabase = createClient();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        if (loginError.message.includes("Invalid login credentials")) {
          setError("Invalid email or password.");
        } else if (
          loginError.message.includes("Email not confirmed") ||
          loginError.message.includes("User not found")
        ) {
          setError(loginError.message);
        } else {
          throw loginError;
        }
        return;
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setError("Please enter your email to reset password.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      setSuccess("Check your email for the password reset link!");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0f172a] p-4 transition-colors duration-300'>
      <div className='w-full max-w-md bg-white dark:bg-[#1e293b] shadow-lg rounded-2xl p-8 border border-gray-200 dark:border-gray-700'>
        <h2 className='text-3xl font-bold text-center mb-2 text-gray-900 dark:text-gray-100'>
          Welcome Back
        </h2>
        <p className='text-center text-gray-600 dark:text-gray-400 mb-8'>
          Sign in to your marketplace account
        </p>

        <form onSubmit={onSubmit} className='space-y-5'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Email
            </label>
            <input
              id='email'
              type='email'
              placeholder='Enter your email'
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition'
            />
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
              Password
            </label>
            <input
              id='password'
              type='password'
              placeholder='Enter your password'
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition'
            />
          </div>

          {error && (
            <p className='text-sm text-red-500 bg-red-100 dark:bg-red-900/30 p-2 rounded'>
              {error}
            </p>
          )}
          {success && (
            <p className='text-sm text-green-600 bg-green-100 dark:bg-green-900/30 p-2 rounded'>
              {success}
            </p>
          )}

          <button
            type='submit'
            disabled={isLoading}
            className='w-full py-2.5 flex items-center justify-center gap-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-all disabled:opacity-50'>
            {isLoading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className='mt-4 text-center text-sm'>
          <button
            type='button'
            onClick={handleResetPassword}
            className='text-secondary hover:underline'>
            Forgot password?
          </button>
        </div>

        <div className='mt-6 text-center text-sm text-gray-700 dark:text-gray-300'>
          Don&apos;t have an account?{" "}
          <Link
            href='/auth/signup'
            className='text-secondary hover:underline font-medium'>
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
