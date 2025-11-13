import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No items found",
  message = "Get started by creating your first item.",
  actionLabel = "Create Item",
  onAction,
  icon = "Inbox",
  className 
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[400px] text-center px-6",
      className
    )}>
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full p-8 mb-6">
        <ApperIcon 
          name={icon} 
          size={56} 
          className="text-indigo-400"
        />
      </div>
      
      <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-3">
        {title}
      </h3>
      
      <p className="text-slate-600 mb-8 max-w-md text-lg leading-relaxed">
        {message}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
        >
          <ApperIcon name="Plus" size={20} />
          {actionLabel}
        </button>
      )}
      
      <div className="mt-12 text-sm text-slate-500 space-y-2">
        <p>✨ Organize your work efficiently</p>
        <p>📅 Track deadlines and progress</p>
        <p>🎯 Stay focused on what matters</p>
      </div>
    </div>
  );
};

export default Empty;