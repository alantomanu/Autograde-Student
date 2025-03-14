"use client"
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { signIn } from "next-auth/react";
import GoogleButton from "@/components/GoogleButton";
import {  FaUser, FaLock, FaIdCard } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function SignupPage() {
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
      const result = await signIn('google', {
        redirect: false,
      });

      if (result?.error) {
        console.error('Google Sign-In failed:', result.error);
        alert('Google Sign-In failed: ' + result.error);
      }
      // The redirect will be handled by NextAuth callback
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      alert('Google Sign-In failed');
    }
  };

  const handleOAuthRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: formData.studentId,
          name: searchParams.get('name'),
          email: searchParams.get('email'),
          oauthId: searchParams.get('oauthId'),
          profilePictureUrl: searchParams.get('image'),
          password: null, // No password for OAuth users
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        // After successful registration, sign in with Google
        await signIn('google', { 
          callbackUrl: '/dashboard',
        });
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!isOAuth && formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
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
        // Sign in the user automatically after registration
        await signIn('google', { callbackUrl: '/dashboard' });
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // If we have OAuth data, show the student ID form
  if (isOAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
        <div className="w-full max-w-md space-y-8">
          <h2 className="text-center text-2xl font-bold">Complete Your Registration</h2>
          <p className="text-center text-gray-600">
            Welcome {searchParams.get('name')}! Please enter your student ID to complete registration
          </p>
          
          <form onSubmit={handleOAuthRegistration} className="mt-8 space-y-6">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaIdCard />
              </div>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                placeholder="Student ID"
                className="w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-medium text-white"
            >
              Complete Registration
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
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
                  <span className="text-xl font-bold">AG</span>
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
            <div className="mb-8 md:hidden">
              <button 
                onClick={toggleForm} 
                className="text-sm font-medium text-purple-600"
              >
                {isLogin ? 'SIGN UP' : 'SIGN IN'}
              </button>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h1>
              
              <div className="flex justify-center">
                <GoogleButton 
                  onClick={handleGoogleSignIn}
                  text="Continue with Google"
                />
              </div>
              
              <div className="relative">
                <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/80 px-4 text-center text-sm text-gray-500">
                  or use your {isLogin ? 'student ID' : 'email for registration'}
                </p>
                <div className="my-4 border-t border-gray-200"></div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 placeholder:opacity-70"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <FaIdCard />
                  </div>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="Student ID"
                    className="w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 placeholder:opacity-70"
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <MdEmail />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 placeholder:opacity-70"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 placeholder:opacity-70"
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full rounded-lg border border-gray-300 bg-white/70 py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-400 placeholder:opacity-70"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                {isLogin && (
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-purple-600 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 py-3 font-medium text-white shadow-md hover:shadow-lg transition-shadow"
                >
                  {isLogin ? 'SIGN IN' : 'SIGN UP'}
                </button>
                
                {/* Mobile toggle */}
                <div className="pt-4 text-center md:hidden">
                  <p className="text-sm text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="font-medium text-purple-600 hover:underline"
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}