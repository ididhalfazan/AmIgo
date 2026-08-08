import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Welcome back"
        subtitle="Log in to keep up with your feed and communities."
        footer={
          <>
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-[#c1703f]">
              Sign up
            </Link>
          </>
        }
      >
        <LoginForm />
      </AuthCard>
    </AuthLayout>
  );
}
