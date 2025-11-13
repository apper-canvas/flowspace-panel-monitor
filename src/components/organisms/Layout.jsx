import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import TaskModal from "@/components/organisms/TaskModal";
import ProjectModal from "@/components/organisms/ProjectModal";
import { useTasks } from "@/hooks/useTasks";
import { useProjects } from "@/hooks/useProjects";

const Layout = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  const { createTask, updateTask } = useTasks();
  const { projects, createProject, updateProject } = useProjects();

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleTaskSubmit = async (taskData) => {
    if (editingTask) {
      await updateTask(editingTask.Id, taskData);
    } else {
      await createTask(taskData);
    }
    setShowTaskModal(false);
    setEditingTask(null);
  };

  const handleCreateProject = () => {
    setEditingProject(null);
    setShowProjectModal(true);
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setShowProjectModal(true);
  };

  const handleProjectSubmit = async (projectData) => {
    if (editingProject) {
      await updateProject(editingProject.Id, projectData);
    } else {
      await createProject(projectData);
    }
    setShowProjectModal(false);
    setEditingProject(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onCreateTask={handleCreateTask}
        onCreateProject={handleCreateProject}
      />
      
      <main className="p-4 lg:p-6">
        <Outlet context={{ 
          onEditTask: handleEditTask, 
          onEditProject: handleEditProject,
          projects 
        }} />
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        task={editingTask}
        projects={projects}
        title={editingTask ? "Edit Task" : "Create New Task"}
      />

      {/* Project Modal */}
      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => {
          setShowProjectModal(false);
          setEditingProject(null);
        }}
        onSubmit={handleProjectSubmit}
        project={editingProject}
        title={editingProject ? "Edit Project" : "Create New Project"}
      />
    </div>
  );
};

export default Layout;