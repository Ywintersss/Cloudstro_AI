"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    // Check for empty fields
    if (!fullName || fullName.trim() === "") {
      newErrors.fullName = "Please do not leave any fields empty";
    }

    if (!email || email.trim() === "") {
      newErrors.email = "Please do not leave any fields empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password || password.trim() === "") {
      newErrors.password = "Please do not leave any fields empty";
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Please do not leave any fields empty";
    }

    // Check if passwords match (only if both are filled)
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    // If no errors, proceed with signup logic
    if (
      !newErrors.fullName &&
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    ) {
      console.log("Signup attempt:", { fullName, email, password });
      // Add your signup logic here
    }
  };

  const clearError = (field: string) => {
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div className="cursor-default min-h-screen bg-white">
      {/* Main Content */}
      <main className="flex flex-col min-h-screen">
        {/* Signup Section - Full Page */}
        <div className="px-4 flex flex-col justify-center items-center min-h-screen py-8">
          <div className="w-full max-w-sm">
            <div className="text-center mb-3">
              <h1 className="text-3xl font-bold text-gray-800 mb-3">
                Start Your Journey
              </h1>
              <p className="text-base text-gray-600">
                Join thousands of creators boosting their social media presence
              </p>
            </div>

            {/* Signup Form */}
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
                    htmlFor="fullName"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.fullName
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter your full name"
                    onChange={() => clearError("fullName")}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.fullName}
                    </p>
                  )}
                </div>

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
                    placeholder="Create a strong password"
                    onChange={() => clearError("password")}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.confirmPassword
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Confirm your password"
                    onChange={() => clearError("confirmPassword")}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="cursor-pointer w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Create Account
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-600">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Login here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
