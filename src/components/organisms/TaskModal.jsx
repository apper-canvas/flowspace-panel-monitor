import React, { useEffect, useState } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import ProjectSelector from "@/components/molecules/ProjectSelector";
import FormField from "@/components/molecules/FormField";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import Button from "@/components/atoms/Button";

const TaskModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task = null,
  projects = [],
  title = "Create Task",
  parentTaskId = null,
  onCreateSubtask = null
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
projectId: "",
    dueDate: "",
    priority: "medium",
    status: "todo",
    parentTaskId: parentTaskId || null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        projectId: task.projectId || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
        priority: task.priority || "medium",
        status: task.status || "todo",
        parentTaskId: parentTaskId || null
      });
    } else {
      setFormData({
        title: "",
        description: "",
        projectId: "",
        dueDate: "",
        priority: "medium",
        status: "todo",
        parentTaskId: parentTaskId || null
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.projectId) {
      newErrors.projectId = "Project is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const taskData = {
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      };
      
      await onSubmit(taskData);
      onClose();
    } catch (error) {
      console.error("Error submitting task:", error);
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
      <div className="bg-white rounded-2xl shadow-modal max-w-lg w-full max-h-[90vh] overflow-hidden animate-scale-in">
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
<form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        
        {parentTaskId && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-blue-700 text-sm">
              <ApperIcon name="ArrowUpRight" size={16} />
              <span className="font-medium">Creating subtask for parent task</span>
            </div>
          </div>
        )}
          <FormField
            label="Task Title"
            id="title"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            placeholder="Enter task title..."
            error={errors.title}
            required
          />

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Add task description..."
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none"
            />
          </div>

          <ProjectSelector
            projects={projects}
            value={formData.projectId}
            onChange={(e) => handleInputChange("projectId", e.target.value)}
            error={errors.projectId}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="priority">Priority</Label>
              <Select
                id="priority"
                value={formData.priority}
                onChange={(e) => handleInputChange("priority", e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="status">Status</Label>
              <Select
                id="status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </Select>
            </div>
          </div>

          <FormField
            label="Due Date"
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
          />

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
                  {task ? "Update" : "Create"} Task
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;