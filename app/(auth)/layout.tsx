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
    <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
} 