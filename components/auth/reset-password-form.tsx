"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/service/auth";
import { appToast } from "@/lib/toastify";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      appToast("Invalid or missing reset token", {
        type: "error",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      appToast("Passwords do not match", {
        type: "error",
      });
      return;
    }

    if (formData.password.length < 8) {
      appToast("Password must be at least 8 characters long", {
        type: "error",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await authService.resetPassword({
        token,
        new_password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      appToast("Password reset successfully! Please log in with your new password.", {
        type: "success",
      });
      
      router.push("/login");
    } catch (error: any) {
      appToast(
        error.response?.data?.error ||
          "Failed to reset password. The link may be expired or invalid.",
        {
          type: "error",
        }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!token) {
    return (
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-orange-900 font-serif">
            Invalid Reset Link
          </h2>
          <p className="text-orange-700/70 mt-2 font-light">
            The password reset link is invalid or has expired
          </p>
        </div>

        <div className="space-y-6">
          <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
            <p className="text-orange-800 mb-4">
              Please request a new password reset link.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => router.push("/forgot-password")}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg"
          >
            Request New Reset Link
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
          Reset Password
        </h2>
        <p className="text-orange-700/70 mt-2 font-light">
          Enter your new password below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-orange-800">
            New Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your new password"
            className="border-orange-200 focus:border-orange-400"
            disabled={isLoading}
            minLength={8}
          />
          <p className="text-xs text-orange-600">
            Password must be at least 8 characters long
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-orange-800">
            Confirm New Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your new password"
            className="border-orange-200 focus:border-orange-400"
            disabled={isLoading}
            minLength={8}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg"
          disabled={isLoading || !formData.password || !formData.confirmPassword}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
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