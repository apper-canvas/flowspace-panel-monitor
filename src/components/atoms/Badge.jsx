import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ 
  children, 
  className, 
  variant = "default",
  size = "sm",
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200";
  
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    primary: "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20",
    success: "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200",
    warning: "bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border border-amber-200",
    danger: "bg-gradient-to-r from-red-50 to-pink-50 text-red-700 border border-red-200",
    high: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg",
    medium: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg",
    low: "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
  };

  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base"
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;