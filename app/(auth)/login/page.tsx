"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { appToast } from "@/lib/toastify";

function LoginContent() {
  const searchParams = useSearchParams();

  // Handle any search params or show toasts here
  const error = searchParams.get("error");
  if (error) {
    appToast(error === "unauthorized" 
        ? "Please log in to access this page"
        : "An error occurred during login",
      {
        type: "error",
      }
    );
  }

  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginContent />
        </Suspense>
      </div>
    </div>
  );
} 