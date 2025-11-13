import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay();
    return [...tasks];
  },

  async getById(id) {
    await delay();
    const task = tasks.find(task => task.Id === parseInt(id));
    return task ? { ...task } : null;
  },

  async create(taskData) {
    await delay();
    const highestId = tasks.length > 0 ? Math.max(...tasks.map(t => t.Id)) : 0;
    const newTask = {
      Id: highestId + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
      completedAt: null,
      attachments: [],
      comments: []
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const updatedTask = {
        ...tasks[index],
        ...taskData,
        Id: parseInt(id)
      };
      
      // Handle completion timestamp
      if (taskData.status === "done" && tasks[index].status !== "done") {
        updatedTask.completedAt = new Date().toISOString();
      } else if (taskData.status !== "done") {
        updatedTask.completedAt = null;
      }
      
      tasks[index] = updatedTask;
      return { ...updatedTask };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = tasks.findIndex(task => task.Id === parseInt(id));
    if (index !== -1) {
      const deletedTask = tasks[index];
      tasks.splice(index, 1);
      return { ...deletedTask };
    }
    return null;
  },

  async getByProject(projectId) {
    await delay();
    return tasks.filter(task => task.projectId === projectId.toString()).map(task => ({ ...task }));
  },

  async getByStatus(status) {
    await delay();
    return tasks.filter(task => task.status === status).map(task => ({ ...task }));
  },

  async getByDateRange(startDate, endDate) {
    await delay();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return tasks.filter(task => {
      const taskDate = new Date(task.dueDate);
      return taskDate >= start && taskDate <= end;
    }).map(task => ({ ...task }));
  },

  async search(query) {
    await delay();
    const searchTerm = query.toLowerCase();
    return tasks.filter(task => 
      task.title.toLowerCase().includes(searchTerm) ||
      task.description.toLowerCase().includes(searchTerm)
    ).map(task => ({ ...task }));
  }
};