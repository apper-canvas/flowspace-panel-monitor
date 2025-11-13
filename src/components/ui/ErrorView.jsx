import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const ErrorView = ({ 
  title = "Something went wrong",
  message = "We couldn't load your data. Please try again.",
  onRetry,
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] text-center px-6",
      className
    )}>
      <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-full p-6 mb-6">
        <ApperIcon 
          name="AlertTriangle" 
          size={48} 
          className="text-red-500"
        />
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-8 max-w-md leading-relaxed">
        {message}
      </p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <ApperIcon name="RefreshCw" size={18} />
          Try Again
        </button>
      )}
      
      <div className="mt-8 text-sm text-slate-500">
        <p>If this problem persists, please refresh the page or contact support.</p>
      </div>
    </div>
  );
};

export default ErrorView;