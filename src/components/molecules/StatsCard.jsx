import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const StatsCard = ({
  title,
  value,
  change,
  icon,
  color = "primary",
  className,
  ...props
}) => {
  const colorClasses = {
    primary: "from-primary/10 to-secondary/10 text-primary",
    success: "from-green-50 to-emerald-50 text-green-600",
    warning: "from-amber-50 to-yellow-50 text-amber-600",
    danger: "from-red-50 to-pink-50 text-red-600"
  };

  return (
    <Card className={cn("p-6", className)} {...props}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-600 uppercase tracking-wider">
          {title}
        </h3>
        <div className={cn(
          "w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center",
          colorClasses[color]
        )}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
      
      <div className="space-y-2">
        <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
          {value}
        </p>
        
        {change && (
          <div className="flex items-center gap-1">
            <ApperIcon 
              name={change.positive ? "TrendingUp" : "TrendingDown"} 
              size={14} 
              className={change.positive ? "text-green-500" : "text-red-500"}
            />
            <span className={cn(
              "text-sm font-medium",
              change.positive ? "text-green-600" : "text-red-600"
            )}>
              {change.value}% from last week
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;