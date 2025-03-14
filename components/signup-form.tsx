// LoginSignupPage.jsx
import React, { useState } from 'react';
import { FaGoogle, FaFacebookF, FaLinkedinIn, FaUser, FaLock, FaIdCard } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

export default function LoginSignupPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would normally handle form submission to your backend
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      {/* Yellow accent */}
      <div className="hidden md:block absolute bottom-0 left-0 w-48 h-48 bg-amber-300 rounded-tr-3xl" />
      
      {/* Red accent */}
      <div className="hidden md:block absolute top-0 right-0 w-48 h-48 bg-rose-400 rounded-bl-3xl" />
      
      <div className="container mx-auto flex items-center justify-center px-4 py-12 relative z-10">
        <div className="flex w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl">
          {/* Left panel - Welcome back */}
          <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-emerald-400 to-teal-500 p-12 flex-col justify-between text-white">
            <div>
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-white/20 rounded-md flex items-center justify-center">
                  <span className="font-bold text-xl">AG</span>
                </div>
                <h2 className="text-xl font-semibold">AutoGrade</h2>
              </div>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-4xl font-bold">{isLogin ? 'Welcome Back!' : 'Join Us!'}</h1>
              <p className="text-white/80">
                {isLogin 
                  ? 'To keep connected with us please login with your personal info.'
                  : 'Create an account to use our AI-powered answer evaluation system.'}
              </p>
              
              <button 
                onClick={toggleForm} 
                className="border-2 border-white hover:bg-white hover:text-teal-500 transition-colors duration-300 rounded-full py-3 px-8 inline-block font-medium"
              >
                {isLogin ? 'SIGN UP' : 'SIGN IN'}
              </button>
            </div>
            
            <div>
              {/* Footer content if needed */}
            </div>
          </div>
          
          {/* Right panel - Create Account / Login */}
          <div className="w-full md:w-7/12 bg-white p-8 md:p-12">
            <div className="md:hidden flex justify-between items-center mb-8">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-teal-500/20 rounded-md flex items-center justify-center">
                  <span className="font-bold text-sm text-teal-500">AG</span>
                </div>
                <h2 className="text-lg font-semibold text-teal-500">AutoGrade</h2>
              </div>
              <button 
                onClick={toggleForm} 
                className="text-teal-500 text-sm font-medium"
              >
                {isLogin ? 'SIGN UP' : 'SIGN IN'}
              </button>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">
                {isLogin ? 'Sign In' : 'Create Account'}
              </h1>
              
              <div className="flex space-x-4 justify-center">
                <button className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FaGoogle className="text-gray-600" />
                </button>
                <button className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FaFacebookF className="text-gray-600" />
                </button>
                <button className="h-12 w-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <FaLinkedinIn className="text-gray-600" />
                </button>
              </div>
              
              <div className="relative">
                <p className="text-center text-sm text-gray-500 bg-white px-4 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  or use your email for {isLogin ? 'login' : 'registration'}
                </p>
                <div className="border-t border-gray-200 my-4"></div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLogin && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleChange}
                      placeholder="Full Name"
                      className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaIdCard />
                  </div>
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleChange}
                    placeholder="Student ID"
                    className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MdEmail />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                    required
                  />
                </div>
                
                {!isLogin && (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className="w-full bg-gray-50 pl-10 pr-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                      required={!isLogin}
                    />
                  </div>
                )}
                
                {isLogin && (
                  <div className="flex justify-end">
                    <a href="#" className="text-sm text-teal-500 hover:underline">
                      Forgot Password?
                    </a>
                  </div>
                )}
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white py-3 rounded-full hover:shadow-lg transition-shadow font-medium text-center"
                >
                  {isLogin ? 'SIGN IN' : 'SIGN UP'}
                </button>
                
                {/* Mobile toggle */}
                <div className="pt-4 text-center md:hidden">
                  <p className="text-gray-600 text-sm">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={toggleForm}
                      className="text-teal-500 font-medium hover:underline"
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