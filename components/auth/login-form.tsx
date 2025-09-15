"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/service/auth";
import { appToast } from "@/lib/toastify";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await authService.login(formData);
      const from = searchParams.get("from") || "/";
      router.push(from);
      appToast("Welcome back", {
        type: "success",
      });
    } catch (error: any) {
      appToast(
        error.response?.data?.error ||
          "Please check your credentials and try again.",
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

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-orange-900 font-serif">
          Welcome Back
        </h2>
        <p className="text-orange-700/70 mt-2 font-light">
          Sign in to continue your journey
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
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="border-orange-200 focus:border-orange-400"
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-orange-800">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-sm text-orange-600 hover:text-orange-700 font-light"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="border-orange-200 focus:border-orange-400"
            disabled={isLoading}
          />
        </div>

        <Button
          data-test="login-button"
          type="submit"
          className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>

        <p className="text-center text-sm text-orange-700/70 font-light">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-orange-600 hover:text-orange-700 font-medium"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
