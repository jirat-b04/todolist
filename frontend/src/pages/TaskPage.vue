<script setup lang="ts">
    import { ref, computed } from 'vue'
    import CountTask from '../components/base/CountTask.vue'
    import KanbanColumn from '../components/feat/KanbanColumn.vue'
    import TaskForm from '../components/feat/modal/TaskForm.vue'
    import TaskDetail from '../components/feat/TaskDetail.vue'
    import { useTaskStore } from '../composables/useTaskStore'
    import type { Task, TaskStatus, TaskPriority } from '../types/task'

    const { tasks, addTask } = useTaskStore()

    const isFormOpen   = ref(false)
    const defaultStatus = ref<TaskStatus>('todo')
    const selectedTask  = ref<Task | null>(null)

    const filterStatus = ref<'all' | TaskStatus>('all')
    const filterPriority = ref<'any' | TaskPriority>('any')

    const allStatuses: TaskStatus[] = ['todo', 'doing', 'done']

    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'long', day: 'numeric'
    })

    const todoAndDoing = computed(() =>
        tasks.value.filter(t => t.status === 'todo' || t.status === 'doing').length
    )

    const urgentCount = computed(() =>
        tasks.value.filter(t => t.priority === 'urgent').length
    )

    const displayedStatuses = computed<TaskStatus[]>(() =>
        filterStatus.value === 'all' ? allStatuses : [filterStatus.value]
    )

    function tasksForColumn(status: TaskStatus) {
        return tasks.value.filter(t => {
            const matchStatus   = t.status === status
            const matchPriority = filterPriority.value === 'any' || t.priority === filterPriority.value
            return matchStatus && matchPriority
        })
    }

    function openFormForStatus(status: TaskStatus) {
        defaultStatus.value = status
        isFormOpen.value    = true
    }

    function handleConfirm(data: {
        title: string; description: string; status: string
        priority: string; dueDate: string
    }) {
        addTask({
            title:       data.title,
            description: data.description,
            status:      data.status   as TaskStatus,
            priority:    data.priority as TaskPriority,
            dueDate:     data.dueDate,
        })
    }

    const statusFilterOptions = [
        { label: 'All',   value: 'all'   },
        { label: 'Todo',  value: 'todo'  },
        { label: 'Doing', value: 'doing' },
        { label: 'Done',  value: 'done'  },
    ]

    const priorityFilterOptions = [
        { label: 'Any',    value: 'any'    },
        { label: 'Urgent', value: 'urgent' },
        { label: 'High',   value: 'high'   },
        { label: 'Medium', value: 'medium' },
        { label: 'Low',    value: 'low'    },
    ]
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <main class="flex-1 px-8 py-6 flex flex-col gap-6">
            <!-- Title -->
            <div>
                <h1 class="font-inter font-bold text-[32px] text-gray-900">To Do List</h1>
                <p class="font-inter text-gray-400 text-[15px]">{{ today }}</p>
            </div>

            <!-- Stats -->
            <div class="flex gap-8">
                <CountTask
                    :count="todoAndDoing"
                    label="TODO & DOING"
                    countColor="text-gray-900"
                    labelColor="text-gray-500"
                />
                <CountTask
                    :count="urgentCount"
                    label="URGENT"
                    countColor="text-teal-500"
                    labelColor="text-gray-500"
                />
            </div>

            <!-- Filters -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-inter text-sm text-gray-500">Status</span>
                    <select
                        v-model="filterStatus"
                        class="border border-gray-200 rounded-md px-2 py-1 text-sm font-inter bg-white outline-none focus:ring-1 focus:ring-gray-400"
                    >
                        <option v-for="opt in statusFilterOptions" :key="opt.value" :value="opt.value">
                            {{ opt.label }}
                        </option>
                    </select>

                    <span class="font-inter text-sm text-gray-500 ml-2">Priority</span>
                    <select
                        v-model="filterPriority"
                        class="border border-gray-200 rounded-md px-2 py-1 text-sm font-inter bg-white outline-none focus:ring-1 focus:ring-gray-400"
                    >
                        <option v-for="opt in priorityFilterOptions" :key="opt.value" :value="opt.value">
                            {{ opt.label }}
                        </option>
                    </select>

                    <div class="flex items-center gap-1.5 text-sm font-inter text-gray-500 cursor-pointer hover:text-gray-800 transition ml-2 border border-gray-200 rounded-md px-2 py-1 bg-white">
                        <i class="pi pi-sort-alt text-xs" />
                        <span>Sort by priority</span>
                        <i class="pi pi-chevron-down text-xs" />
                    </div>
                </div>

                <button
                    @click="openFormForStatus('todo')"
                    class="flex items-center gap-1.5 bg-[#1a2d5a] text-white text-sm font-inter font-medium px-3 py-2 rounded-md hover:bg-[#1a2d5a]/90 transition"
                >
                    <span class="text-base leading-none">+</span>
                    <span>Add task</span>
                </button>
            </div>

            <!-- Kanban Board -->
            <div class="flex gap-6 overflow-x-auto pb-4">
                <KanbanColumn
                    v-for="status in displayedStatuses"
                    :key="status"
                    :status="status"
                    :tasks="tasksForColumn(status)"
                    @click-task="selectedTask = $event"
                />
            </div>
        </main>

        <TaskForm
            :visible="isFormOpen"
            :default-status="defaultStatus"
            @close="isFormOpen = false"
            @confirm="handleConfirm"
        />

        <TaskDetail
            :task="selectedTask"
            @close="selectedTask = null"
        />
    </div>
</template>
