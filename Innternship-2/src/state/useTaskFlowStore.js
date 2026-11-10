import { create } from 'zustand'
import { seedActivities, seedProjects, seedTasks } from '../data/mockData'

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'light'
  const savedTheme = window.localStorage.getItem('taskflow-theme')
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`

const addActivity = (activity) => ({
  id: makeId('activity'),
  createdAt: new Date().toISOString(),
  ...activity,
})

export const useTaskFlowStore = create((set) => ({
  projects: seedProjects,
  tasks: seedTasks,
  activities: seedActivities,
  theme: getInitialTheme(),
  searchQuery: '',
  filters: { priority: 'all', assigneeId: 'all', projectId: 'all' },
  sidebarOpen: false,
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  clearFilters: () => set({ searchQuery: '', filters: { priority: 'all', assigneeId: 'all', projectId: 'all' } }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setTheme: (theme) => {
    if (typeof window !== 'undefined') window.localStorage.setItem('taskflow-theme', theme)
    set({ theme })
  },
  toggleTheme: () => set((state) => {
    const nextTheme = state.theme === 'dark' ? 'light' : 'dark'
    if (typeof window !== 'undefined') window.localStorage.setItem('taskflow-theme', nextTheme)
    return { theme: nextTheme }
  }),
  addTask: (task) => set((state) => ({
    tasks: [{
      id: makeId('task'),
      tags: [],
      subtasks: [],
      comments: [],
      ...task,
    }, ...state.tasks],
    activities: [addActivity({ actorId: 'alex', action: 'created', target: task.title, detail: 'a new task' }), ...state.activities],
  })),
  updateTask: (taskId, updates) => set((state) => {
    const currentTask = state.tasks.find((task) => task.id === taskId)
    if (!currentTask) return state
    return {
      tasks: state.tasks.map((task) => task.id === taskId ? { ...task, ...updates } : task),
      activities: updates.status && updates.status !== currentTask.status
        ? [addActivity({ actorId: 'alex', action: 'moved', target: currentTask.title, detail: `to ${updates.status}` }), ...state.activities]
        : state.activities,
    }
  }),
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter((task) => task.id !== taskId),
  })),
  moveTask: (taskId, status) => set((state) => {
    const currentTask = state.tasks.find((task) => task.id === taskId)
    if (!currentTask || currentTask.status === status) return state
    return {
      tasks: state.tasks.map((task) => task.id === taskId ? { ...task, status } : task),
      activities: [addActivity({ actorId: 'alex', action: 'moved', target: currentTask.title, detail: `to ${status}` }), ...state.activities],
    }
  }),
  reorderTask: (taskId, overTaskId) => set((state) => {
    const activeTask = state.tasks.find((task) => task.id === taskId)
    const overTask = state.tasks.find((task) => task.id === overTaskId)
    if (!activeTask || !overTask || activeTask.status !== overTask.status || taskId === overTaskId) return state
    const columnTasks = state.tasks.filter((task) => task.status === activeTask.status)
    const activeIndex = columnTasks.findIndex((task) => task.id === taskId)
    const overIndex = columnTasks.findIndex((task) => task.id === overTaskId)
    const reordered = [...columnTasks]
    const [removed] = reordered.splice(activeIndex, 1)
    reordered.splice(overIndex, 0, removed)
    let nextIndex = 0
    return { tasks: state.tasks.map((task) => task.status === activeTask.status ? reordered[nextIndex++] : task) }
  }),
  toggleSubtask: (taskId, subtaskId) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === taskId ? {
      ...task,
      subtasks: task.subtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask),
    } : task),
  })),
  addComment: (taskId, body) => set((state) => ({
    tasks: state.tasks.map((task) => task.id === taskId ? {
      ...task,
      comments: [...task.comments, { id: makeId('comment'), authorId: 'alex', body, createdAt: new Date().toISOString() }],
    } : task),
    activities: [addActivity({ actorId: 'alex', action: 'commented on', target: state.tasks.find((task) => task.id === taskId)?.title || 'a task', detail: body }), ...state.activities],
  })),
}))

export const selectVisibleTasks = (state) => {
  const query = state.searchQuery.trim().toLowerCase()
  return state.tasks.filter((task) => {
    const matchesQuery = !query || [task.title, task.description, ...task.tags].some((value) => value.toLowerCase().includes(query))
    const matchesPriority = state.filters.priority === 'all' || task.priority === state.filters.priority
    const matchesAssignee = state.filters.assigneeId === 'all' || task.assigneeId === state.filters.assigneeId
    const matchesProject = state.filters.projectId === 'all' || task.projectId === state.filters.projectId
    return matchesQuery && matchesPriority && matchesAssignee && matchesProject
  })
}
