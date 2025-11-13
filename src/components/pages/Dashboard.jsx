import React, { useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { isToday, isAfter, isBefore, addDays, format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import ErrorView from "@/components/ui/ErrorView";
import Empty from "@/components/ui/Empty";
import StatsCard from "@/components/molecules/StatsCard";
import TaskCard from "@/components/molecules/TaskCard";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";

const Dashboard = () => {
  const { onEditTask, projects } = useOutletContext();
  const { tasks, loading, error, loadTasks, updateTaskStatus, deleteTask } = useTasks();

  const stats = useMemo(() => {
    const today = new Date();
    const todayTasks = tasks.filter(task => isToday(new Date(task.dueDate)));
    const completedTasks = tasks.filter(task => task.status === "done");
    const upcomingTasks = tasks.filter(task => {
      const dueDate = new Date(task.dueDate);
      return isAfter(dueDate, today) && isBefore(dueDate, addDays(today, 7));
    });

    return {
      todayCount: todayTasks.length,
      completedCount: completedTasks.length,
      upcomingCount: upcomingTasks.length,
      totalTasks: tasks.length
    };
  }, [tasks]);

  const todaysTasks = useMemo(() => {
    return tasks.filter(task => isToday(new Date(task.dueDate)));
  }, [tasks]);

  const upcomingDeadlines = useMemo(() => {
    const today = new Date();
    return tasks
      .filter(task => {
        const dueDate = new Date(task.dueDate);
        return isAfter(dueDate, today) && isBefore(dueDate, addDays(today, 7)) && task.status !== "done";
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 5);
  }, [tasks]);

  const projectProgress = useMemo(() => {
    return projects.map(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.Id.toString());
      const completedTasks = projectTasks.filter(task => task.status === "done");
      const progress = projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;
      
      return {
        ...project,
        taskCount: projectTasks.length,
        completedCount: completedTasks.length,
        progress: Math.round(progress)
      };
    });
  }, [projects, tasks]);

  const getTaskProject = (task) => {
    return projects.find(p => p.Id.toString() === task.projectId);
  };

  if (loading) return <Loading />;
  if (error) return <ErrorView onRetry={loadTasks} />;

  if (tasks.length === 0) {
    return (
      <Empty
        title="Welcome to FlowSpace!"
        message="Start organizing your productivity by creating your first task and project."
        actionLabel="Create Your First Task"
        onAction={() => {}}
        icon="Zap"
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-primary to-secondary bg-clip-text text-transparent">
          Welcome back to FlowSpace
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Here's your productivity overview for today. Stay focused and get things done!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Today's Tasks"
          value={stats.todayCount}
          icon="Calendar"
          color="primary"
        />
        <StatsCard
          title="Completed"
          value={stats.completedCount}
          icon="CheckCircle"
          color="success"
        />
        <StatsCard
          title="Upcoming"
          value={stats.upcomingCount}
          icon="Clock"
          color="warning"
        />
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon="ListTodo"
          color="primary"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Today's Focus */}
        <div className="xl:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ApperIcon name="Target" size={24} className="text-primary" />
                Today's Focus
              </h2>
              {todaysTasks.length > 0 && (
                <Badge variant="primary" size="sm">
                  {todaysTasks.filter(t => t.status !== "done").length} remaining
                </Badge>
              )}
            </div>

            {todaysTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ApperIcon name="Sun" size={32} className="text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">All caught up for today!</h3>
                <p className="text-slate-600">No tasks due today. Great job staying on top of things!</p>
              </div>
            ) : (
              <div className="space-y-4">
{todaysTasks.map(task => (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    project={getTaskProject(task)}
                    onEdit={onEditTask}
                    onStatusChange={updateTaskStatus}
                    onDelete={deleteTask}
                    onCreateSubtask={(taskId) => onEditTask(null, taskId)}
                    subtasks={tasks.filter(t => t.parentTaskId === task.Id)}
                  />
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ApperIcon name="AlertTriangle" size={20} className="text-amber-500" />
              Upcoming Deadlines
            </h3>

            {upcomingDeadlines.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" size={32} className="text-green-500 mx-auto mb-2" />
                <p className="text-sm text-slate-600">No upcoming deadlines!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map(task => {
                  const project = getTaskProject(task);
                  return (
                    <div 
                      key={task.Id}
                      className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                      onClick={() => onEditTask(task)}
                    >
                      <div 
                        className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                        style={{ backgroundColor: project?.color || "#6B7280" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <ApperIcon name="Calendar" size={12} className="text-slate-400" />
                          <span className="text-xs text-slate-600">
                            {format(new Date(task.dueDate), "MMM d, yyyy")}
                          </span>
                          <Badge variant={task.priority} size="xs">
                            {task.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Project Progress */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ApperIcon name="BarChart3" size={20} className="text-primary" />
              Project Progress
            </h3>

            {projectProgress.length === 0 ? (
              <div className="text-center py-8">
                <ApperIcon name="FolderPlus" size={32} className="text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">No projects yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projectProgress.map(project => (
                  <div key={project.Id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="text-sm font-medium text-slate-900">
                          {project.name}
                        </span>
                      </div>
                      <span className="text-sm text-slate-600">
                        {project.completedCount}/{project.taskCount}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">
                        {project.progress}% complete
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;