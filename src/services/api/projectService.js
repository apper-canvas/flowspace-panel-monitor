import projectsData from "@/services/mockData/projects.json";

let projects = [...projectsData];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const projectService = {
  async getAll() {
    await delay();
    return [...projects];
  },

  async getById(id) {
    await delay();
    const project = projects.find(project => project.Id === parseInt(id));
    return project ? { ...project } : null;
  },

  async create(projectData) {
    await delay();
    const highestId = projects.length > 0 ? Math.max(...projects.map(p => p.Id)) : 0;
    const newProject = {
      Id: highestId + 1,
      ...projectData,
      createdAt: new Date().toISOString(),
      taskCount: 0,
      completedCount: 0
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, projectData) {
    await delay();
    const index = projects.findIndex(project => project.Id === parseInt(id));
    if (index !== -1) {
      const updatedProject = {
        ...projects[index],
        ...projectData,
        Id: parseInt(id)
      };
      projects[index] = updatedProject;
      return { ...updatedProject };
    }
    return null;
  },

  async delete(id) {
    await delay();
    const index = projects.findIndex(project => project.Id === parseInt(id));
    if (index !== -1) {
      const deletedProject = projects[index];
      projects.splice(index, 1);
      return { ...deletedProject };
    }
    return null;
  },

  async updateTaskCounts(projectId, taskCount, completedCount) {
    await delay();
    const index = projects.findIndex(project => project.Id === parseInt(projectId));
    if (index !== -1) {
      projects[index] = {
        ...projects[index],
        taskCount,
        completedCount
      };
      return { ...projects[index] };
    }
    return null;
  }
};