import { ref, watch } from 'vue'
import type { Task } from '../types/task'

const STORAGE_KEY = 'tally_tasks'

const tasks = ref<Task[]>(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))

watch(tasks, (val) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(val))
}, { deep: true })

export function useTaskStore() {
  function addTask(task: Omit<Task, 'id'>) {
    tasks.value.push({ ...task, id: crypto.randomUUID() })
  }

  function removeTask(id: string) {
    tasks.value = tasks.value.filter(t => t.id !== id)
  }

  function updateTask(id: string, updates: Partial<Task>) {
    const idx = tasks.value.findIndex(t => t.id === id)
    if (idx !== -1) tasks.value[idx] = { ...tasks.value[idx], ...updates }
  }

  return { tasks, addTask, removeTask, updateTask }
}
