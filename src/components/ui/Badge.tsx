interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default:
    "bg-charcoal-700/70 text-off-white-muted border-charcoal-500/50",
  success:
    "bg-emerald-950/30 text-emerald-400 border-emerald-800/30 shadow-[0_0_15px_rgba(52,211,153,0.04)]",
  warning:
    "bg-amber-950/30 text-amber-400 border-amber-800/30 shadow-[0_0_15px_rgba(251,191,36,0.04)]",
  danger:
    "bg-red-950/30 text-red-400 border-red-800/30 shadow-[0_0_15px_rgba(239,68,68,0.04)]",
};

const dots = {
  default: "bg-charcoal-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
  danger: "bg-red-400",
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[9px] font-medium uppercase tracking-[0.15em] border ${variantStyles[variant]}`}
    >
      <span className={`w-1 h-1 rounded-full ${dots[variant]}`} />
      {children}
    </span>
  );
}
