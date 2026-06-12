"use client";
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import { UserPlus, User, Lock, Mail, Phone } from "lucide-react";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSignup = async () => {
    setError(null);
    setSuccessMessage(null);

    // ✅ Validation
    if (!name || !phone || !email || !password || !confirmPassword) {
      return setError("All fields are required");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (!/^\d{10}$/.test(phone)) {
      return setError("Enter valid 10 digit phone number");
    }

    setLoading(true);

    // ✅ ONLY AUTH SIGNUP (NO PROFILE INSERT HERE)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    console.log("Auth Signup Data:", data);

    if (error) {
      setLoading(false);
      return setError(error.message);
    }

    // ✅ SUCCESS
    setLoading(false);
    setSuccessMessage("Account created successfully! Redirecting to login...");

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 p-8 md:p-10 rounded-xl shadow-2xl">

        <div className="flex flex-col items-center mb-8">
          <UserPlus className="h-12 w-12 text-green-400 mb-3" />
          <h2 className="text-3xl font-extrabold text-white">Create Account</h2>
          <p className="text-gray-400 text-sm mt-1">
            Join API Tester Pro to start managing requests
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 p-3 rounded-lg mb-4 text-sm">
            {successMessage}
          </div>
        )}

        <div className="mb-4 relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg"
            disabled={loading}
          />
        </div>

        <div className="mb-4 relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg"
            disabled={loading}
          />
        </div>

        <div className="mb-4 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg"
            disabled={loading}
          />
        </div>

        <div className="mb-4 relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg"
            disabled={loading}
          />
        </div>

        <div className="mb-6 relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg"
            disabled={loading}
          />
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-500"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-6 text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-green-400 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
