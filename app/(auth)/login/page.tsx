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
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
} 