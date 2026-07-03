"use client";

import { forwardRef } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "danger" | "glass";
  size?: "sm" | "md" | "lg";
}

const variants = {
  primary:
    "bg-off-white text-charcoal-950 hover:bg-off-white/90 border border-transparent shadow-[0_0_20px_rgba(240,237,232,0.04)] hover:shadow-[0_0_30px_rgba(240,237,232,0.08)]",
  ghost:
    "bg-transparent text-off-white-muted hover:text-off-white hover:bg-charcoal-700/50 border border-transparent",
  outline:
    "bg-transparent text-off-white border border-charcoal-500 hover:border-off-white/40 hover:shadow-[0_0_25px_rgba(240,237,232,0.04)]",
  danger:
    "bg-red-950/30 text-red-400 border border-red-900/30 hover:bg-red-900/30 hover:border-red-700/40 shadow-[0_0_20px_rgba(239,68,68,0.03)]",
  glass:
    "glass-light text-off-white hover:bg-charcoal-700/60 hover:border-charcoal-400/60",
};

const sizes = {
  sm: "px-3 py-1.5 text-[10px] tracking-[0.15em]",
  md: "px-5 py-2.5 text-[10px] tracking-[0.18em]",
  lg: "px-8 py-3 text-[10px] tracking-[0.2em]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => (
    <button
      ref={ref}
      className={`uppercase font-sans font-medium transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-off-white/20 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
);
Button.displayName = "Button";

export { Button };
export type { ButtonProps };
