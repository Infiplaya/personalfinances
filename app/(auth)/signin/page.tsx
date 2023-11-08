import { AuthPage } from '@/components/auth/auth-page';
import { LoginForm } from '@/components/auth/login-form';
import { SuccessToast } from '@/components/ui/success-toast';

export default function SignInPage() {
  return (
    <AuthPage type="signin">
      <SuccessToast message="Created account! Sign In with your credentials" />
      <LoginForm />
    </AuthPage>
  );
}
