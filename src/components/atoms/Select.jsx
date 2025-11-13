import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Select = forwardRef(({
  className,
  children,
  error = false,
  ...props
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
        error && "border-red-300 focus:ring-red-500",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;