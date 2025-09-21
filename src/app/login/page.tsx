"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // API call function
  const loginUser = async (userData: {
    email: string;
    password: string;
  }) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

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

    // If no errors, proceed with login
    if (!newErrors.email && !newErrors.password) {
      try {
        const result = await loginUser({
          email,
          password,
        });

        console.log("Login successful:", result);
        setSubmitMessage({
          type: "success",
          text: "Login successful! Redirecting to dashboard...",
        });

        // Store user info in localStorage for client-side access
        localStorage.setItem('user', JSON.stringify(result.user));

        // Redirect to dashboard after a brief delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);

      } catch (error) {
        console.error("Login error:", error);
        setSubmitMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Login failed. Please try again.",
        });
      }
    }

    setIsSubmitting(false);
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
              {/* Submit Message */}
              {submitMessage.text && (
                <div
                  className={`mb-4 p-3 rounded-lg text-center text-sm font-medium ${
                    submitMessage.type === "success"
                      ? "bg-green-100 text-green-700 border border-green-300"
                      : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

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
                  disabled={isSubmitting}
                  className={`cursor-pointer w-full px-6 py-3 text-white rounded-lg text-base font-semibold transform transition-all duration-300 shadow-lg ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                  }`}
                >
                  {isSubmitting ? "Logging in..." : "Login"}
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
