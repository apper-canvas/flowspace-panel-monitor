import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths
} from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import TaskCard from "@/components/molecules/TaskCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/utils/cn";

const CalendarView = () => {
  const { onEditTask, projects } = useOutletContext();
  const { tasks, loading, error, loadTasks, updateTaskStatus, deleteTask } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);
    
    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd
    });
  }, [currentDate]);

  const tasksByDate = useMemo(() => {
    const grouped = {};
    tasks.forEach(task => {
      if (task.dueDate) {
        const dateKey = format(new Date(task.dueDate), "yyyy-MM-dd");
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const selectedDateTasks = useMemo(() => {
    if (!selectedDate) return [];
    const dateKey = format(selectedDate, "yyyy-MM-dd");
    return tasksByDate[dateKey] || [];
  }, [selectedDate, tasksByDate]);

  const getTaskProject = (task) => {
    return projects.find(p => p.Id.toString() === task.projectId);
  };

  const getTasksForDate = (date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return tasksByDate[dateKey] || [];
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-amber-500";
      case "low": return "bg-blue-500";
      default: return "bg-slate-500";
    }
  };

  const navigateMonth = (direction) => {
    if (direction === "prev") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(addMonths(currentDate, 1));
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView onRetry={loadTasks} />;

  if (tasks.length === 0) {
    return (
      <Empty
        title="No scheduled tasks"
        message="Add due dates to your tasks to see them in the calendar view."
        actionLabel="Create Task with Due Date"
        onAction={() => {}}
        icon="Calendar"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Calendar View
          </h1>
          <p className="text-slate-600 mt-1">
            View your tasks by due date and plan your schedule
          </p>
        </div>

        {/* Calendar Navigation */}
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={goToToday}
          >
            Today
          </Button>
          
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => navigateMonth("prev")}
              className="p-2 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ApperIcon name="ChevronLeft" size={16} />
            </button>
            
            <span className="px-4 py-2 font-semibold text-slate-900 min-w-[120px] text-center">
              {format(currentDate, "MMMM yyyy")}
            </span>
            
            <button
              onClick={() => navigateMonth("next")}
              className="p-2 hover:bg-slate-100 rounded-md transition-colors"
            >
              <ApperIcon name="ChevronRight" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-3">
          <Card className="p-6">
            {/* Week Headers */}
            <div className="grid grid-cols-7 gap-1 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="p-3 text-center text-sm font-medium text-slate-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map(date => {
                const dayTasks = getTasksForDate(date);
                const isCurrentMonth = isSameMonth(date, currentDate);
                const isSelected = selectedDate && isSameDay(date, selectedDate);
                const isTodayDate = isToday(date);
                
                return (
                  <div
                    key={date.toISOString()}
                    className={cn(
                      "min-h-[100px] p-2 border border-slate-100 rounded-lg cursor-pointer transition-all duration-200 hover:bg-slate-50",
                      !isCurrentMonth && "opacity-40",
                      isSelected && "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30",
                      isTodayDate && !isSelected && "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
                    )}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className={cn(
                        "text-sm font-medium",
                        isTodayDate ? "text-amber-700 font-bold" : "text-slate-700"
                      )}>
                        {format(date, "d")}
                      </span>
                      
                      {dayTasks.length > 0 && (
                        <Badge variant="default" size="xs">
                          {dayTasks.length}
                        </Badge>
                      )}
                    </div>

                    {/* Task Indicators */}
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map(task => {
                        const project = getTaskProject(task);
                        return (
                          <div
                            key={task.Id}
                            className="text-xs p-1 rounded truncate"
                            style={{ 
                              backgroundColor: project?.color + "20",
                              color: project?.color || "#6B7280"
                            }}
                          >
                            <div className="flex items-center gap-1">
                              <div 
                                className={cn("w-2 h-2 rounded-full", getPriorityColor(task.priority))}
                              />
                              <span className="truncate font-medium">
                                {task.title}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-slate-500 text-center py-1">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Selected Date Tasks */}
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Calendar" size={20} className="text-primary" />
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select a date"}
            </h3>

            {!selectedDate ? (
              <div className="text-center py-8">
                <ApperIcon name="CalendarDays" size={32} className="text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Click on a calendar date to view tasks</p>
              </div>
            ) : selectedDateTasks.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="Calendar" size={32} className="text-green-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600 font-medium">No tasks scheduled</p>
                <p className="text-xs text-slate-500 mt-1">This day is free!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {selectedDateTasks.map(task => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    project={getTaskProject(task)}
                    onEdit={onEditTask}
                    onStatusChange={updateTaskStatus}
                    onDelete={deleteTask}
                    className="shadow-sm"
                  />
                ))}
              </div>
            )}
          </Card>

          {/* Calendar Legend */}
          <Card className="p-6">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Legend</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-slate-600">High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span className="text-slate-600">Medium Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-slate-600">Low Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-amber-200 to-yellow-200 rounded border-amber-300 border"></div>
                <span className="text-slate-600">Today</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;