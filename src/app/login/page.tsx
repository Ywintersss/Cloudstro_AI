"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const newErrors = {
      email: "",
      password: "",
    };

    // Check for empty fields
    if (!email || email.trim() === "") {
      newErrors.email = "Please do not leave any fields empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password || password.trim() === "") {
      newErrors.password = "Please do not leave any fields empty";
    }

    setErrors(newErrors);

    // If no errors, redirect to home page or dashboard
    if (!newErrors.email && !newErrors.password) {
      window.location.href = "/dashboard"; // Redirects to home page
      // Or use: window.location.href = '/dashboard'; for a dashboard page
    }
  };

  const clearError = (field: string) => {
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="flex flex-col min-h-screen">
        {/* Login Section - Full Page */}
        <div className="px-4 flex flex-col justify-center items-center min-h-screen py-8">
          <div className="w-full max-w-sm">
            <div className="text-center mb-3">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Welcome Back
              </h1>
              <p className="text-base text-gray-600">
                Sign in to continue your social media journey
              </p>
            </div>

            {/* Login Form */}
            <div
              className="p-6"
              style={{
                borderRadius: "36px",
                background: "#ffffff",
                boxShadow: "5px 5px 0px #5a5a5a, -5px -5px 0px #aaaaaaff",
              }}
            >
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.email
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your email"
                    onChange={() => clearError("email")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.password
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your password"
                    onChange={() => clearError("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Login
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Sign up here
                  </Link>
                </p>
                {/* <p className="text-xs text-gray-600 mt-2">
                  <Link href="/forgot-password" className="text-blue-600 hover:text-blue-700 font-medium">
                    Forgot your password?
                  </Link>
                </p> */}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
