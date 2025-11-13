import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import TaskCard from "@/components/molecules/TaskCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";
import { cn } from "@/utils/cn";

const KanbanBoard = () => {
const { onEditTask, projects } = useOutletContext();
  const { 
    tasks, 
    loading, 
    error, 
    loadTasks, 
    updateTaskStatus, 
    deleteTask,
    createSubtask,
    getSubtasks,
    getMainTasks
  } = useTasks();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterProject, setFilterProject] = useState("");
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", icon: "Circle", color: "bg-slate-100" },
    { id: "in-progress", title: "In Progress", icon: "Clock", color: "bg-amber-100" },
    { id: "done", title: "Done", icon: "CheckCircle", color: "bg-green-100" }
  ];

const filteredTasks = useMemo(() => {
    // Get main tasks only for Kanban board
    const mainTasks = getMainTasks();
    return mainTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject = !filterProject || task.projectId === filterProject;
      return matchesSearch && matchesProject;
    });
  }, [tasks, searchQuery, filterProject]);

  const tasksByStatus = useMemo(() => {
    const grouped = {};
    columns.forEach(column => {
      grouped[column.id] = filteredTasks.filter(task => task.status === column.id);
    });
    return grouped;
  }, [filteredTasks, columns]);

  const getTaskProject = (task) => {
    return projects.find(p => p.Id.toString() === task.projectId);
  };

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e) => {
    // Only clear drag over state if we're leaving the column entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(null);
    
    if (draggedTask && draggedTask.status !== columnId) {
      updateTaskStatus(draggedTask.Id, columnId);
    }
    
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView onRetry={loadTasks} />;

  if (tasks.length === 0) {
    return (
      <Empty
        title="No tasks yet"
        message="Create your first task to start organizing your work with the Kanban board."
        actionLabel="Create First Task"
        onAction={() => {}}
        icon="Kanban"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Kanban Board
          </h1>
          <p className="text-slate-600 mt-1">
            Organize your tasks by status and track progress visually
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 lg:w-auto w-full">
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks..."
            className="w-full sm:w-64"
          />
          
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2.5 border border-slate-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Projects</option>
            {projects.map(project => (
              <option key={project.Id} value={project.Id.toString()}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.id] || [];
          const isDragOver = dragOverColumn === column.id;
          
          return (
            <div key={column.id} className="space-y-4">
              {/* Column Header */}
              <Card 
                className={cn(
                  "p-4 transition-all duration-200",
                  isDragOver && "drag-over"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg", column.color)}>
                      <ApperIcon name={column.icon} size={20} className="text-slate-700" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{column.title}</h3>
                      <p className="text-sm text-slate-500">{columnTasks.length} tasks</p>
                    </div>
                  </div>
                  <Badge variant="default" size="sm">
                    {columnTasks.length}
                  </Badge>
                </div>
              </Card>

              {/* Task List */}
              <div
                className={cn(
                  "min-h-[400px] space-y-3 transition-all duration-200",
                  isDragOver && "bg-gradient-to-b from-indigo-50 to-purple-50 rounded-xl p-3"
                )}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className={cn("p-4 rounded-full mb-4", column.color)}>
                      <ApperIcon name={column.icon} size={32} className="text-slate-500" />
                    </div>
                    <p className="text-slate-500 font-medium">No tasks in {column.title.toLowerCase()}</p>
                    <p className="text-sm text-slate-400 mt-1">
                      {column.id === "todo" && "Drag tasks here to get started"}
                      {column.id === "in-progress" && "Move tasks here when you start working"}
                      {column.id === "done" && "Completed tasks will appear here"}
                    </p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <div
                      key={task.Id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      onDragEnd={handleDragEnd}
                    >
<TaskCard
                        task={task}
                        project={getTaskProject(task)}
                        onEdit={onEditTask}
                        onStatusChange={updateTaskStatus}
                        onDelete={deleteTask}
                        onCreateSubtask={(taskId) => onEditTask(null, taskId)}
                        subtasks={getSubtasks(task.Id)}
                        isDragging={draggedTask?.Id === task.Id}
                        className={cn(
                          "transition-all duration-200",
                          draggedTask?.Id === task.Id && "opacity-50 transform rotate-3 scale-105"
                        )}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default KanbanBoard;