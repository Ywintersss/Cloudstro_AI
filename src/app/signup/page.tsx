"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [errors, setErrors] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    submit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ type: "", text: "" });

  // API call function
  const createUser = async (userData: {
    email: string;
    username: string;
    fullName: string;
    password: string;
  }) => {
    const response = await fetch('/api/dynamodb/addUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...userData,
        subscription: 'free', // Default subscription
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create account');
    }

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage({ type: "", text: "" });

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const newErrors = {
      fullName: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      submit: "",
    };

    // Validation
    if (!fullName || fullName.trim() === "") {
      newErrors.fullName = "Please do not leave any fields empty";
    }

    if (!username || username.trim() === "") {
      newErrors.username = "Please do not leave any fields empty";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }

    if (!email || email.trim() === "") {
      newErrors.email = "Please do not leave any fields empty";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password || password.trim() === "") {
      newErrors.password = "Please do not leave any fields empty";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    if (!confirmPassword || confirmPassword.trim() === "") {
      newErrors.confirmPassword = "Please do not leave any fields empty";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);

    // If validation passes, make API call
    if (
      !newErrors.fullName &&
      !newErrors.username &&
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    ) {
      try {
        const result = await createUser({
          fullName,
          username,
          email,
          password,
        });

        console.log("User created successfully:", result);
        setSubmitMessage({
          type: "success",
          text: "Account created successfully! You can now log in.",
        });

        // Reset form
        (e.target as HTMLFormElement).reset();
        setErrors({
          fullName: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });

        // Optionally redirect to login page after a delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);

      } catch (error) {
        console.error("Signup error:", error);
        setSubmitMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Failed to create account. Please try again.",
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
    <div className="cursor-default min-h-screen bg-white">
      <main className="flex flex-col min-h-screen">
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
                {/* General submit error */}
                {errors.submit && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}

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
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
                    htmlFor="username"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.username
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Choose a unique username"
                    onChange={() => clearError("username")}
                  />
                  {errors.username && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.username}
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
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.password
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Create a strong password (min 8 characters)"
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
                    disabled={isSubmitting}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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
                  disabled={isSubmitting}
                  className={`cursor-pointer w-full px-6 py-3 text-white rounded-lg text-base font-semibold transform transition-all duration-300 shadow-lg ${
                    isSubmitting
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:scale-105"
                  }`}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
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