import { useState, useEffect } from "react";
import { taskService } from "@/services/api/taskService";
import { toast } from "react-toastify";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Please try again.");
      console.error("Error loading tasks:", err);
    } finally {
      setLoading(false);
    }
  };

const createTask = async (taskData) => {
    try {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
      toast.success("Task created successfully!");
      return newTask;
    } catch (err) {
      toast.error("Failed to create task");
      throw err;
    }
  };

  const createSubtask = async (parentTaskId, subtaskData) => {
    try {
      const newSubtask = await taskService.createSubtask(parentTaskId, subtaskData);
      setTasks(prev => [...prev, newSubtask]);
      toast.success("Subtask created successfully!");
      return newSubtask;
    } catch (err) {
      toast.error("Failed to create subtask");
      throw err;
    }
  };

  const getSubtasks = (parentTaskId) => {
    return tasks.filter(task => task.parentTaskId === parseInt(parentTaskId));
  };

  const getMainTasks = () => {
    return tasks.filter(task => !task.parentTaskId);
  };

  const updateSubtask = async (subtaskId, updates) => {
    try {
      const updatedSubtask = await taskService.update(subtaskId, updates);
      setTasks(prev => prev.map(task => 
        task.Id === subtaskId ? updatedSubtask : task
      ));
      toast.success("Subtask updated successfully!");
      return updatedSubtask;
    } catch (err) {
      toast.error("Failed to update subtask");
      throw err;
    }
  };

  const deleteSubtask = async (subtaskId) => {
    try {
      await taskService.deleteSubtask(subtaskId);
      setTasks(prev => prev.filter(task => task.Id !== subtaskId));
      toast.success("Subtask deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete subtask");
      throw err;
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskService.update(id, taskData);
      if (updatedTask) {
        setTasks(prev => prev.map(task => task.Id === parseInt(id) ? updatedTask : task));
        toast.success("Task updated successfully!");
        return updatedTask;
      }
    } catch (err) {
      toast.error("Failed to update task");
      throw err;
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskService.delete(id);
      setTasks(prev => prev.filter(task => task.Id !== parseInt(id)));
      toast.success("Task deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete task");
      throw err;
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      const updatedTask = await taskService.update(id, { status });
      if (updatedTask) {
        setTasks(prev => prev.map(task => task.Id === parseInt(id) ? updatedTask : task));
        const statusMessage = status === "done" ? "Task completed!" : "Task status updated!";
        toast.success(statusMessage);
        return updatedTask;
      }
    } catch (err) {
      toast.error("Failed to update task status");
      throw err;
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    createSubtask,
    updateTask,
    updateSubtask,
    updateTaskStatus,
    deleteTask,
    deleteSubtask,
    getSubtasks,
    getMainTasks
  };
};