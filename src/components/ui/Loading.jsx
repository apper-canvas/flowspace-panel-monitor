import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className }) => {
  return (
    <div className={cn("animate-pulse space-y-6", className)}>
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-48"></div>
        <div className="h-10 bg-gradient-to-r from-indigo-200 to-purple-300 rounded-lg w-32"></div>
      </div>
      
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="bg-white rounded-xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24"></div>
              <div className="h-8 w-8 bg-gradient-to-r from-indigo-200 to-purple-300 rounded-lg"></div>
            </div>
            <div className="h-8 bg-gradient-to-r from-slate-300 to-slate-400 rounded-lg w-16 mb-2"></div>
            <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32"></div>
          </div>
        ))}
      </div>

      {/* Main content skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-32 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-40"></div>
                  <div className="h-6 bg-gradient-to-r from-amber-200 to-orange-300 rounded-full w-16"></div>
                </div>
                <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-24"></div>
                <div className="flex items-center justify-between">
                  <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-20"></div>
                  <div className="h-3 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-card">
          <div className="h-6 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg w-36 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-3 w-3 bg-gradient-to-r from-indigo-200 to-purple-300 rounded-full"></div>
                  <div className="h-4 bg-gradient-to-r from-slate-200 to-slate-300 rounded w-32"></div>
                </div>
                <div className="h-4 bg-gradient-to-r from-red-200 to-pink-300 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;