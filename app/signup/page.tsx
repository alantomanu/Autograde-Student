"use client"
import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from "next-auth/react";
import GoogleButton from "@/components/GoogleButton";
import { FaUser, FaLock, FaIdCard } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import Image from 'next/image';

function SignupContent() {
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    studentId: '',
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    password: '',
    confirmPassword: '',
    profilePictureUrl: searchParams.get('image') || '',
  });

  const [credentials, setCredentials] = useState({
    studentId: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(
    searchParams.get('error') === 'OAuthSignin' 
      ? 'Failed to sign in with Google. Please try again.' 
      : null
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check if we have OAuth data from URL parameters
  const isOAuth = Boolean(
    searchParams.get('oauth') === 'google' && 
    searchParams.get('email') && 
    searchParams.get('oauthId')
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', {
        callbackUrl: '/',
        redirect: true,
      });
    } catch {
      setError('Failed to sign in with Google. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isOAuth && formData.password !== formData.confirmPassword) {
      setError("Passwords don't match!");
      setSuccessMessage(null);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: formData.studentId,
          name: formData.name,
          email: formData.email,
          password: isOAuth ? null : formData.password,
          oauthId: searchParams.get('oauthId') || null,
          profilePictureUrl: formData.profilePictureUrl,
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        // After successful registration, switch to login mode
        setIsLogin(true);
        setSuccessMessage('Registration successful! Sign in.');
        setError(null);
      } else {
        setError(data.error || 'Registration failed');
        setSuccessMessage(null);
      }
    } catch {
      setError('Registration failed');
      setSuccessMessage(null);
    }
  };

  const handleManualSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isOAuth) {
        // For OAuth users, attempt to find and link account with student ID
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: credentials.studentId,
            name: searchParams.get('name'),
            email: searchParams.get('email'),
            oauthId: searchParams.get('oauthId'),
            profilePictureUrl: searchParams.get('image'),
          }),
        });

        const data = await res.json();
        
        if (res.ok) {
          // After successful registration, sign in with Google
          await signIn('google', {
            callbackUrl: '/',
            redirect: true,
          });
        } else {
          setError(data.error || 'Registration failed');
        }
      } else {
        // Normal credential-based sign in
        const result = await signIn('credentials', {
          identifier: credentials.studentId,
          password: credentials.password,
          callbackUrl: '/',
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid credentials');
        } else {
          window.location.href = '/';
        }
      }
    } catch {
      setError('Invalid credentials');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null); // Clear error when toggling forms
  };

  return (
    <div className="relative flex max-h-screen items-center justify-center bg-transparent px-4 py-12">
      {/* Blurred background elements */}
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-purple-300 opacity-40 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-indigo-300 opacity-40 blur-3xl"></div>
      <div className="absolute top-40 right-20 h-40 w-40 rounded-full bg-violet-400 opacity-30 blur-3xl"></div>
      <div className="absolute bottom-20 left-40 h-60 w-60 rounded-full bg-fuchsia-300 opacity-30 blur-3xl"></div>
      
      <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl bg-white/60 shadow-xl backdrop-blur-lg">
        <div className="flex flex-col md:flex-row">
          {/* Left panel - Welcome back */}
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-8 text-white md:w-5/12 md:p-10">
            <div className="mb-10">
              <div className="flex items-center space-x-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-white/20">
                  
                <Image 
                  src="/logo.png"
                  alt="Logo"
                  width={40}
                  height={40}
                  style={{ width: 'auto', height: 'auto' }}
                  className="cursor-pointer filter invert brightness-10"
                  priority
                />
                <span className="text-xl font-bold"> 
                   
            </span>
                </div>
                <h2 className="text-xl font-semibold">AutoGrade</h2>
              </div>
            </div>
            
            <div className="mb-8 space-y-6">
              <h1 className="text-4xl font-bold">{isLogin ? 'Welcome Back!' : 'Join Us!'}</h1>
              <p className="text-white/80">
                {isLogin 
                  ? 'Sign in to continue with your AI-powered answer evaluation experience.'
                  : 'Create an account to start using our AI-powered answer evaluation system.'}
              </p>
              
              <button 
                onClick={toggleForm} 
                className="inline-block rounded-lg border-2 border-white py-2.5 px-6 font-medium hover:bg-white hover:text-purple-600 transition-colors duration-300"
              >
                {isLogin ? 'SIGN UP' : 'SIGN IN'}
              </button>
            </div>
            
            <div className="hidden md:block">
              <p className="text-sm text-white/70">
                AutoGrade — Revolutionizing answer paper evaluation with AI
              </p>
            </div>
          </div>
          
          {/* Right panel - Create Account / Login */}
          <div className="bg-white/80 p-8 md:w-7/12 md:p-10">
            <div className="mb-8 md:hidden pd-6">
              <button 
                onClick={toggleForm} 
                className="text-sm font-medium text-purple-600"
              >
                {isLogin ? 'SIGN UP' : 'SIGN IN'}
              </button>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h1>
              
              {!isOAuth && (
                <div className="flex justify-center">
                  <GoogleButton 
                    onClick={handleGoogleSignIn}
                    text="Continue with Google"
                  />
                </div>
              )}

              {error && (
                <div className="text-red-600 text-center">
                  {error}
                </div>
              )}
              
              {successMessage && (
                <div className="text-green-600 text-center">
                  {successMessage}
                </div>
              )}
              
              {isLogin ? (
                <form className="mt-8 space-y-6" onSubmit={handleManualSignIn}>
                  <div className="space-y-4 rounded-md shadow-sm">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                        <FaIdCard />
                      </div>
                      <input
                        id="studentId"
                        name="studentId"
                        type="text"
                        required
                        className="relative block w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400"
                        placeholder="Student ID"
                        value={credentials.studentId}
                        onChange={(e) => setCredentials({ ...credentials, studentId: e.target.value })}
                      />
                    </div>
                    {!isOAuth && (
                      <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                          <FaLock />
                        </div>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          required={!isOAuth}
                          className="relative block w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400"
                          placeholder="Password"
                          value={credentials.password}
                          onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-medium text-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    {isOAuth ? 'Link Account' : 'Sign in'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="relative block w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400"
                      required={!isLogin}
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                      <FaIdCard />
                    </div>
                    <input
                      type="text"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleChange}
                      placeholder="Student ID"
                      className="relative block w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                      <MdEmail />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="relative block w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400"
                      required={!isLogin}
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className="relative block w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-900">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="relative block w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 text-black focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder:text-gray-400"
                      required={!isLogin}
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-medium text-white shadow-md hover:shadow-lg transition-shadow"
                  >
                    SIGN UP
                  </button>
                  
                  {/* Mobile toggle */}
                  <div className="pt-4 text-center md:hidden">
                    <p className="text-sm text-gray-600">
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={toggleForm}
                        className="font-medium text-purple-600 hover:underline"
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="relative flex max-h-screen items-center justify-center bg-transparent px-4 py-12">
        <div className="text-center">
          Loading...
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  );
}