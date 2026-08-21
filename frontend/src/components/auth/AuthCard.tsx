import Image from "next/image";
import { ReactNode } from "react";

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/10 p-8 shadow-2xl backdrop-blur-md">
      <div className="mb-4 flex justify-center">
        <Image
          src="/logo.png"
          alt="AmIgo"
          width={160}
          height={55}
          priority
          unoptimized
          className="h-auto w-40"
        />
      </div>
      <h1 className="text-2xl font-semibold text-[#362a1e]">{title}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-[#6b5b45]">{subtitle}</p>
      )}
      <div className="mt-6 flex flex-col gap-4">{children}</div>
      {footer && (
        <div className="mt-6 text-center text-sm text-[#6b5b45]">
          {footer}
        </div>
      )}
    </div>
  );
}
