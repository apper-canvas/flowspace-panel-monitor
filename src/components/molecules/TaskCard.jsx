import React from "react";
import { format, isToday, isTomorrow, isPast } from "date-fns";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";

const TaskCard = ({ 
  task, 
  project, 
  onEdit, 
  onStatusChange, 
  onDelete,
  onCreateSubtask,
  subtasks = [],
  isDragging = false,
  className,
  ...props
}) => {
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "todo": return "Circle";
      case "in-progress": return "Clock";
      case "done": return "CheckCircle";
      default: return "Circle";
    }
  };

  const getDateDisplay = (dueDate) => {
    const date = new Date(dueDate);
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM d");
  };

  const getDateStyle = (dueDate) => {
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return "text-red-600 font-medium";
    if (isToday(date)) return "text-amber-600 font-medium";
    return "text-slate-600";
  };

  const handleStatusClick = (e) => {
    e.stopPropagation();
    const statusOrder = ["todo", "in-progress", "done"];
    const currentIndex = statusOrder.indexOf(task.status);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
    onStatusChange?.(task.Id, nextStatus);
  };

  return (
    <Card
      className={cn(
        "p-4 cursor-pointer transition-all duration-200 hover:shadow-hover group",
        isDragging && "dragging",
        task.status === "done" && "opacity-75",
        className
      )}
      onClick={() => onEdit?.(task)}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={handleStatusClick}
            className="mt-0.5 text-slate-400 hover:text-primary transition-colors"
          >
            <ApperIcon 
              name={getStatusIcon(task.status)} 
              size={18} 
              className={cn(
                task.status === "done" && "text-green-500",
                task.status === "in-progress" && "text-amber-500"
              )}
            />
          </button>
          
          <div className="flex-1 min-w-0">
            <h4 className={cn(
              "font-semibold text-slate-900 mb-1 line-clamp-2 leading-tight",
              task.status === "done" && "line-through text-slate-500"
            )}>
              {task.title}
            </h4>
            
            {task.description && (
              <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                {task.description}
              </p>
            )}
          </div>
        </div>
<div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!task.parentTaskId && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCreateSubtask?.(task.Id);
              }}
              className="text-slate-400 hover:text-blue-500 transition-colors p-1"
              title="Add subtask"
            >
              <ApperIcon name="Plus" size={14} />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(task.Id);
            }}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
          >
            <ApperIcon name="Trash2" size={14} />
          </button>
        </div>

        {/* Subtasks Progress Indicator */}
        {!task.parentTaskId && subtasks.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ApperIcon name="CheckSquare" size={12} />
              <span>
                {subtasks.filter(s => s.status === 'done').length} / {subtasks.length} subtasks
              </span>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full ml-2">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${subtasks.length > 0 ? (subtasks.filter(s => s.status === 'done').length / subtasks.length) * 100 : 0}%` 
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Parent Task Indicator */}
        {task.parentTaskId && (
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <ApperIcon name="ArrowUpRight" size={12} />
            <span>Subtask</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {project && (
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: project.color }}
            />
          )}
          
          {project && (
            <span className="text-xs font-medium text-slate-600">
              {project.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={getPriorityVariant(task.priority)} size="xs">
            {task.priority}
          </Badge>
          
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={12} className="text-slate-400" />
              <span className={cn("text-xs", getDateStyle(task.dueDate))}>
                {getDateDisplay(task.dueDate)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Drag Handle */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50 transition-opacity">
        <ApperIcon name="GripVertical" size={16} className="text-slate-400" />
      </div>
    </Card>
  );
};

export default TaskCard;