import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';

const SubtaskModal = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  subtask = null,
  parentTask = null,
  title = "Create Subtask"
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
    status: "todo"
  });

  useEffect(() => {
    if (subtask) {
      setFormData({
        title: subtask.title || "",
        description: subtask.description || "",
        dueDate: subtask.dueDate ? subtask.dueDate.slice(0, 16) : "",
        priority: subtask.priority || "medium",
        status: subtask.status || "todo"
      });
    } else {
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
        status: "todo"
      });
    }
  }, [subtask, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      projectId: parentTask?.projectId
    };
    onSubmit(submitData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-modal w-full max-w-md max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            {parentTask && (
              <p className="text-sm text-gray-600 mt-1">
                Subtask for: {parentTask.title}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <ApperIcon name="X" size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          <FormField
            label="Title"
            id="title"
            required
          >
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter subtask title"
              required
            />
          </FormField>

          <FormField
            label="Description"
            id="description"
          >
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter subtask description (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </FormField>

          <FormField
            label="Due Date"
            id="dueDate"
          >
            <Input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={handleInputChange}
            />
          </FormField>

          <FormField
            label="Priority"
            id="priority"
          >
            <Select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </FormField>

          <FormField
            label="Status"
            id="status"
          >
            <Select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </Select>
          </FormField>
        </form>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="min-w-[100px]"
          >
            {subtask ? "Update" : "Create"} Subtask
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SubtaskModal;