"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { User, Lock, LogIn, Mail } from "lucide-react"; // Import icons

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleLogin = async () => {
    setError(null);
    setIsLoading(true);

    // Core logic remains unchanged
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      setError(error.message);
    } else {
      // Logic unchanged: redirect to dashboard on success
      router.push("/dashboard");
    }
  };

  return (
    // Updated background to match page.js dark theme (bg-gray-900)
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      {/* Login Card: dark, rounded, shadow effect, and slightly interactive */}
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 p-8 md:p-10 rounded-xl shadow-2xl transform transition-all duration-300 hover:shadow-blue-500/30">

        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <User className="h-12 w-12 text-blue-400 mb-3" />
          <h2 className="text-3xl font-extrabold text-white">
            Welcome Back
          </h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to continue to API Tester Pro</p>
        </div>

        {/* Error Message styled for dark mode */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Email Input Group with Icon */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="email">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              // Modern input styling matching dark theme and focusing with blue accent
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Password Input Group with Icon */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-1" htmlFor="password">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              // Modern input styling
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white border border-gray-700 rounded-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Login Button with loading state and matching blue accent */}
        <button
          onClick={handleLogin}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 ${isLoading
              ? "bg-blue-800 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-500 hover:shadow-blue-500/50"
            }`}
        >
          {isLoading ? (
            // Spinner for loading state
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <><LogIn className="w-5 h-5" /> Log In</>
          )}
        </button>

        {/* Signup Link matching the blue accent and original logic */}
        <p className="text-sm text-center mt-6 text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-blue-400 font-semibold cursor-pointer hover:underline hover:text-blue-300 transition duration-150"
          >
            Sign up now
          </span>
        </p>
      </div>
    </div>
  );
}