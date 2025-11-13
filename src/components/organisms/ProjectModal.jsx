import React, { useState, useEffect } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";

const ProjectModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  project = null,
  title = "Create Project"
}) => {
  const [formData, setFormData] = useState({
    name: "",
    color: "#4F46E5"
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { name: "Indigo", value: "#4F46E5" },
    { name: "Purple", value: "#7C3AED" },
    { name: "Pink", value: "#EC4899" },
    { name: "Rose", value: "#F43F5E" },
    { name: "Orange", value: "#F97316" },
    { name: "Amber", value: "#F59E0B" },
    { name: "Yellow", value: "#EAB308" },
    { name: "Lime", value: "#84CC16" },
    { name: "Green", value: "#10B981" },
    { name: "Emerald", value: "#059669" },
    { name: "Teal", value: "#14B8A6" },
    { name: "Cyan", value: "#06B6D4" },
    { name: "Sky", value: "#0EA5E9" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Slate", value: "#64748B" },
    { name: "Gray", value: "#6B7280" }
  ];

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        color: project.color || "#4F46E5"
      });
    } else {
      setFormData({
        name: "",
        color: "#4F46E5"
      });
    }
    setErrors({});
  }, [project, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Project name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-modal max-w-md w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-100 rounded-lg"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          <FormField
            label="Project Name"
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            placeholder="Enter project name..."
            error={errors.name}
            required
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Project Color
            </label>
            
            <div className="grid grid-cols-8 gap-2">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleInputChange("color", color.value)}
                  className={cn(
                    "w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110",
                    formData.color === color.value && "ring-2 ring-slate-400 ring-offset-2"
                  )}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: formData.color }}
              />
              <span className="text-sm text-slate-600">
                Selected color: {colorOptions.find(c => c.value === formData.color)?.name || "Custom"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <ApperIcon name="Loader" size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <ApperIcon name="Save" size={16} />
                  {project ? "Update" : "Create"} Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;