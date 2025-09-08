"use client";

import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

function ForgotPasswordContent() {
  return <ForgotPasswordForm />;
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ForgotPasswordContent />
    </Suspense>
  );
} 