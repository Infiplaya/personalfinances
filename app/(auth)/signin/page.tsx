import { AuthPage } from "@/components/auth/auth-page";
import { LoginForm } from "@/components/auth/login-form";

export default async function SignInPage() {
  return (
    <AuthPage type="signin">
      <LoginForm />
    </AuthPage>
  );
}
