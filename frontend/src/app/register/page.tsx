import Link from "next/link";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthCard } from "@/components/auth/AuthCard";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <AuthCard
        title="Create your account"
        subtitle="Join AmIgo — posts, communities, and an agent that keeps up with both."
        footer={
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-[#c1703f]">
              Log in
            </Link>
          </>
        }
      >
        <RegisterForm />
      </AuthCard>
    </AuthLayout>
  );
}
