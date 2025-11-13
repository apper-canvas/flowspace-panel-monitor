import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="MapPin" size={40} className="text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Page Not Found
        </h2>
        
        <p className="text-slate-600 mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or the URL might be incorrect.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate("/")}
            className="w-full"
            size="lg"
          >
            <ApperIcon name="Home" size={18} />
            Back to Dashboard
          </Button>
          
          <Button 
            variant="secondary"
            onClick={() => window.history.back()}
            className="w-full"
            size="lg"
          >
            <ApperIcon name="ArrowLeft" size={18} />
            Go Back
          </Button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Need help? Check out our{" "}
            <button 
              onClick={() => navigate("/")}
              className="text-primary hover:text-primary/80 font-medium underline"
            >
              dashboard
            </button>
            {" "}or{" "}
            <button 
              onClick={() => navigate("/kanban")}
              className="text-primary hover:text-primary/80 font-medium underline"
            >
              kanban board
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;