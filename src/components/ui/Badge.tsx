import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "utility" | "default" | "outline" | "danger" | "success";
  size?: "sm" | "md";
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-sans font-semibold uppercase tracking-wider transition-colors",
        size === "sm" ? "px-2 py-0.5 text-[11px] leading-tight" : "px-2.5 py-1 text-xs",
        variant === "utility" && "bg-accent text-[#1A1A1A] rounded-[4px] font-bold",
        variant === "default" && "bg-primary-tint text-primary rounded-[4px]",
        variant === "outline" && "border border-line text-ink-muted rounded-[4px]",
        variant === "danger" && "bg-danger text-white rounded-[4px]",
        variant === "success" && "bg-success/15 text-success border border-success/30 rounded-[4px]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
