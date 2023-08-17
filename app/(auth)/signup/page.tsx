"use client";

import { AuthPage } from "@/components/auth/auth-page";
import { RegisterForm } from "@/components/auth/register-form";

export default function SignUpPage() {
  return (
    <>
      <AuthPage type="signup">
        <RegisterForm />
      </AuthPage>
    </>
  );
}
