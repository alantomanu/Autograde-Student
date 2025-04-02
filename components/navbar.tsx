"use client"

import { useState, useEffect, useRef } from "react";
import { User, LogOut } from "lucide-react";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { DotPattern } from "./magicui/dot-pattern";
import { cn } from "@/lib/utils";
import logoImage from '@/src/assets/logo.png';

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
      callbackUrl: '/'
    });
    setIsLoggedIn(false);
    setShowDropdown(false);
  };

  return (
    <div className="w-full py-3 sm:py-6 flex justify-center backdrop-blur-sm relative z-[999998]">
      <div className="absolute inset-0 overflow-hidden">
        <DotPattern
          width={20}
          height={20}
          cx={1}
          cy={1}
          cr={1.5}
          className={cn(
            "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]",
            "opacity-70",
            "text-gray-400"
          )}
        />
      </div>
      
      <div className="relative z-[999999] w-[95%] sm:w-[80%] max-w-2xl">
        {/* Oval Navbar Container */}
        <nav className="bg-white/90 backdrop-blur-sm rounded-full px-4 sm:px-12 py-2 sm:py-3 shadow-lg flex items-center justify-between border border-gray-100 w-full relative">
          {/* Logo Section */}
          <div className="flex items-center space-x-1">
            <div className="w-10 h-10 relative">
              <Image 
                src={logoImage}
                alt="Logo"
                fill
                sizes="(max-width: 40px) 100vw, 40px"
                className="cursor-pointer filter grayscale object-contain"
                priority
              />
              {/* Fallback SVG in case image fails */}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="w-full h-full cursor-pointer hidden"
                id="fallbackSvg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <span className="font-bold text-gray-700 text-base sm:text-lg">AutoGrade</span>
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
                    <div className="absolute right-0 sm:right-auto sm:absolute sm:-translate-x-1/2 sm:left-1/2 mt-5 w-32 bg-white/100 border border-gray-200 rounded-xl shadow-xl z-[9999999] overflow-visible">
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-200 group rounded-xl bg-white/100"
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
      </div>
    </div>
  );
}