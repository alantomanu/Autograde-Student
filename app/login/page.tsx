"use client";
import { useState } from 'react';
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';
import GoogleButton from "@/components/GoogleButton";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    studentId: '',
    password: '',
  });

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn('google', {
        callbackUrl: '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        console.error('Google Sign-In failed:', result.error);
        alert('Google Sign-In failed: ' + result.error);
      } else if (result?.url) {
        if (result.url.includes('/signup')) {
          router.push(result.url);
        } else {
          router.push('/dashboard');
        }
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      alert('Google Sign-In failed');
    }
  };

  const handleManualSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const result = await signIn('credentials', {
        identifier: credentials.studentId,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        alert('Invalid credentials');
      } else {
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 space-y-6">
          <GoogleButton 
            onClick={handleGoogleSignIn}
            text="Sign in with Google"
          />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gray-50 px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleManualSignIn}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <label htmlFor="studentId" className="sr-only">
                  Student ID
                </label>
                <input
                  id="studentId"
                  name="studentId"
                  type="text"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Student ID"
                  value={credentials.studentId}
                  onChange={(e) => setCredentials({ ...credentials, studentId: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline focus-visible:outline-offset-2"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 