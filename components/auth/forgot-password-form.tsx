"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/service/auth";
import { appToast } from "@/lib/toastify";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.forgotPassword({ email });
      setIsEmailSent(true);
      appToast("Password reset link sent to your email", {
        type: "success",
      });
    } catch (error: any) {
      appToast(
        error.response?.data?.error ||
          "Failed to send password reset email. Please try again.",
        {
          type: "error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  if (isEmailSent) {
    return (
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-orange-900 font-serif">
            Check Your Email
          </h2>
          <p className="text-orange-700/70 mt-2 font-light">
            We've sent a password reset link to your email address
          </p>
        </div>

        <div className="space-y-6">
          <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-orange-800 mb-4">
              Please check your email and click the link to reset your password.
            </p>
            <p className="text-sm text-orange-600">
              Didn't receive the email? Check your spam folder or try again.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setIsEmailSent(false)}
            variant="outline"
            className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            Send Another Email
          </Button>

          <p className="text-center text-sm text-orange-700/70 font-light">
            Remember your password?{" "}
            <Link
              href="/login"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-orange-900 font-serif">
          Forgot Password
        </h2>
        <p className="text-orange-700/70 mt-2 font-light">
          Enter your email address and we'll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-orange-800">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="border-orange-200 focus:border-orange-400"
            disabled={isLoading}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg"
          disabled={isLoading || !email}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>

        <p className="text-center text-sm text-orange-700/70 font-light">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
} 