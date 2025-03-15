"use client"

import { useState, useEffect, useRef } from "react";
import { User, LogOut } from "lucide-react";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Jane Doe");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const session = await getSession();
      if (session) {
        setIsLoggedIn(true);
        setUserName(session.user.name || "Jane Doe");
        setProfilePictureUrl(session.user.image || "");
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
    console.log("Logging out...");
    await signOut({ redirect: false });
    setIsLoggedIn(false);
    setShowDropdown(false);
    console.log("Logged out");
  };

  return (
    <div className="w-full">
      <nav className="bg-white border-b border-gray-100 shadow-sm px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <AcmeLogo />
            <span className="font-bold text-xl text-gray-600">Autograde</span>
          </div>

          {/* Right Side - Auth Section */}
          <div className="flex items-center">
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-900 font-semibold text-sm">
                  {userName}
                </span>
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      console.log("Profile picture clicked");
                      setShowDropdown(!showDropdown);
                    }}
                  >
                    {profilePictureUrl ? (
                      <Image
                        src={profilePictureUrl}
                        alt="Profile"
                        className="rounded-full"
                        width={40}
                        height={40}
                      />
                    ) : (
                      <User size={20} className="text-gray-700" />
                    )}
                  </button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-bold text-gray-900">{userName}</p>
                        <p className="text-xs text-gray-500 truncate">Student</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 transition-all duration-200 group"
                      >
                        <LogOut 
                          size={18} 
                          className="mr-3 text-gray-400 group-hover:text-red-500 transition-colors" 
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
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transform transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Sign Up
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}