"use client";

import { useState, forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = props.value !== undefined && props.value !== "";

    return (
      <div className={`relative w-full ${className}`}>
        <input
          ref={ref}
          id={id}
          className={`peer w-full bg-transparent border-b px-0 pb-2 pt-6 text-sm text-off-white placeholder-transparent transition-all duration-300 focus:outline-none ${
            error
              ? "border-red-500/70 focus:border-red-400"
              : "border-charcoal-500 focus:border-off-white/60"
          }`}
          placeholder={label}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        <label
          htmlFor={id}
          className={`absolute left-0 transition-all duration-300 pointer-events-none ${
            focused || hasValue
              ? "top-0 text-[9px] tracking-[0.15em] uppercase text-off-white-muted"
              : "top-5 text-sm text-charcoal-400"
          } ${error ? "text-red-400" : focused ? "text-off-white/60" : ""}`}
        >
          {label}
        </label>
        {error && (
          <p className="mt-1 text-[9px] tracking-wider text-red-400">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
export type { InputProps };
