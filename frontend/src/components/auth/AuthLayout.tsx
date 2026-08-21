import Image from "next/image";
import { ReactNode } from "react";

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <Image
        src="/signupcanvas.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-12">
        {children}
      </div>
    </div>
  );
}
