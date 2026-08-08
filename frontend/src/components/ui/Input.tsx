import { InputHTMLAttributes, forwardRef } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-[#362a1e]"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={inputId}
          className="w-full rounded-lg border border-white/40 bg-white/30 px-4 py-2.5 text-sm text-[#362a1e] placeholder:text-[#6b5b45]/70 focus:border-[#c1703f] focus:outline-none focus:ring-2 focus:ring-[#c1703f]/30"
          {...props}
        />
        {error && <p className="text-xs text-[#c1703f]">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
