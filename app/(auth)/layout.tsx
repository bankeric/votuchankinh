"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/service/auth";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    // Redirect to home if already authenticated
    if (authService.isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mb-4 shadow-lg">
            <span className="text-white text-3xl">☸</span>
          </div>
          <h1 className="text-3xl font-bold text-orange-900 font-serif">Buddha AI</h1>
          <p className="text-orange-700/70 mt-2 font-light">
            Your companion on the path to wisdom
          </p>
        </div>
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-orange-200/50">
          {children}
        </div>
      </div>
    </div>
  );
} 