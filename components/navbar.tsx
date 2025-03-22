"use client"

import { useState, useEffect, useRef } from "react";
import { User, LogOut } from "lucide-react";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Jane Doe");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const session = await getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserName(session.user?.name || "Jane Doe");
        setProfilePictureUrl(session.user?.image || "");
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const dropdownElement = dropdownRef.current as HTMLDivElement | null;
      if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignUpRedirect = () => {
    router.push('/signup');
  };

  const handleLogout = async () => {
    await signOut({ 
      redirect: true,
      callbackUrl: '/signup'
    });
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  return (
    <div className="w-full py-3 sm:py-6 flex justify-center bg-white relative">
      <div className="relative z-50 w-[95%] sm:w-[80%] max-w-2xl">
        {/* Oval Navbar Container */}
        <nav className="bg-white rounded-full px-4 sm:px-12 py-2 sm:py-3 shadow-lg flex items-center justify-between border border-gray-100 w-full relative">
          {/* Logo Section */}
          <div className="flex items-center space-x-1">
            <Image 
              src="/logo.png"
              alt="Logo"
              width={40}
              height={40}
              className="cursor-pointer filter grayscale"
              priority
            />
            <span className="font-bold text-gray-700 text-base sm:text-lg">Autograde</span>
          </div>
          
          {/* Authentication Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span className="text-gray-900 font-bold text-sm sm:text-base hidden sm:block">
                  {userName}
                </span>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {profilePictureUrl ? (
                      <Image
                        src={profilePictureUrl}
                        alt="Profile"
                        className="rounded-full"
                        width={36}
                        height={36}
                      />
                    ) : (
                      <User size={16} className="text-gray-700 sm:size-18" />
                    )}
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 sm:right-auto sm:transform sm:-translate-x-1/2 sm:left-1/2 mt-5 w-32 bg-white border border-gray-200 rounded-xl shadow-lg z-[100] overflow-hidden">
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-200 group"
                      >
                        <LogOut 
                          size={18} 
                          className="mr-2 text-gray-400 group-hover:text-red-500 transition-colors" 
                        />
                        <span className="group-hover:text-red-600 font-medium">
                          Sign out
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={handleSignUpRedirect}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-4 sm:px-5 py-1.5 sm:py-2 rounded-full hover:shadow-md hover:scale-105 transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 text-xs sm:text-sm"
              >
                Sign Up
              </button>
            )}
          </div>
        </nav>
        
        {/* Decorative background pill */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-full blur-md -z-10 opacity-75"></div>
      </div>
    </div>
  );
}