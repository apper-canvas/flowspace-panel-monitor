import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onCreateTask, onCreateProject }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const navigationItems = [
    { label: "Dashboard", path: "/", icon: "LayoutDashboard" },
    { label: "Kanban", path: "/kanban", icon: "Kanban" },
    { label: "Calendar", path: "/calendar", icon: "Calendar" }
  ];

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    if (currentPath === "/") return "Dashboard";
    if (currentPath === "/kanban") return "Kanban Board";
    if (currentPath === "/calendar") return "Calendar";
    return "FlowSpace";
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" size={18} className="text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FlowSpace
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.path) 
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <ApperIcon name={item.icon} size={16} />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Page Title - Mobile */}
          <div className="lg:hidden">
            <h2 className="text-lg font-semibold text-slate-900">
              {getPageTitle()}
            </h2>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Actions - Desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={onCreateProject}
                className="flex items-center gap-2"
              >
                <ApperIcon name="FolderPlus" size={16} />
                New Project
              </Button>
              
              <Button
                size="sm"
                onClick={onCreateTask}
                className="flex items-center gap-2"
              >
                <ApperIcon name="Plus" size={16} />
                New Task
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ApperIcon name={showMobileMenu ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden py-4 border-t border-slate-200">
            <nav className="space-y-2 mb-4">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setShowMobileMenu(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive(item.path) 
                      ? "bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20" 
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  )}
                >
                  <ApperIcon name={item.icon} size={18} />
                  {item.label}
                </button>
              ))}
            </nav>
            
            {/* Mobile Actions */}
            <div className="flex flex-col gap-2">
              <Button
                variant="secondary"
                onClick={() => {
                  onCreateProject();
                  setShowMobileMenu(false);
                }}
                className="w-full justify-start"
              >
                <ApperIcon name="FolderPlus" size={16} />
                New Project
              </Button>
              
              <Button
                onClick={() => {
                  onCreateTask();
                  setShowMobileMenu(false);
                }}
                className="w-full justify-start"
              >
                <ApperIcon name="Plus" size={16} />
                New Task
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;