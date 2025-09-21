"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    submit: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      submit: "",
    };

    // Validation
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
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
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
      !newErrors.email &&
      !newErrors.password &&
      !newErrors.confirmPassword
    ) {
      try {
        // Generate username from email (you can modify this logic)
        const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');

        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim().toLowerCase(),
            username,
            subscription: 'free', // Default subscription
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Success - redirect to login or dashboard
          console.log('User created successfully:', data.data);
          
          // You can either:
          // 1. Redirect to login page
          router.push('/login?message=Account created successfully! Please log in.');
          
          // 2. Or auto-login and redirect to dashboard
          // localStorage.setItem('userId', data.data.userId);
          // router.push('/dashboard');
          
        } else {
          // Handle API errors
          if (response.status === 409) {
            newErrors.email = "An account with this email already exists";
          } else {
            newErrors.submit = data.error || "Failed to create account. Please try again.";
          }
          setErrors(newErrors);
        }
      } catch (error) {
        console.error('Signup error:', error);
        newErrors.submit = "Network error. Please check your connection and try again.";
        setErrors(newErrors);
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
                  className="cursor-pointer w-full px-6 py-3 bg-blue-600 text-white rounded-lg text-base font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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