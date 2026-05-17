<script setup lang="ts">
    import { ref, computed } from 'vue'
    import CountTask from '../components/base/CountTask.vue'
    import KanbanColumn from '../components/feat/KanbanColumn.vue'
    import TaskForm from '../components/feat/modal/TaskForm.vue'
    import TaskDetail from '../components/feat/TaskDetail.vue'
    import ModalConfirm from '../components/feat/modal/ModalConfirm.vue'
    import BaseBtn from '../components/base/BaseBtn.vue'
    import DropdownForm from '../components/base/form/DropdownForm.vue'
    import { useTaskStore } from '../composables/useTaskStore'
    import type { Task, TaskStatus, TaskPriority } from '../types/task'

    const { tasks, addTask, updateTask, removeTask } = useTaskStore()

    const isFormOpen    = ref(false)
    const defaultStatus = ref<TaskStatus>('todo')
    const selectedTask  = ref<Task | null>(null)
    const taskToDelete  = ref<Task | null>(null)

    const filterStatus   = ref('all')
    const filterPriority = ref('any')
    const sortBy         = ref('none')

    const priorityOrder: Record<TaskPriority, number> = {
        urgent: 0, high: 1, medium: 2, low: 3,
    }

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
        filterStatus.value === 'all' ? allStatuses : [filterStatus.value as TaskStatus]
    )

    function tasksForColumn(status: TaskStatus) {
        const filtered = tasks.value.filter(t => {
            const matchStatus   = t.status === status
            const matchPriority = filterPriority.value === 'any' || t.priority === filterPriority.value
            return matchStatus && matchPriority
        })

        if (sortBy.value === 'priority') {
            return [...filtered].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        }
        if (sortBy.value === 'dueDate') {
            return [...filtered].sort((a, b) => {
                if (!a.dueDate && !b.dueDate) return 0
                if (!a.dueDate) return 1
                if (!b.dueDate) return -1
                return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            })
        }
        return filtered
    }

    function confirmDelete() {
        if (taskToDelete.value) {
            removeTask(taskToDelete.value.id)
            if (selectedTask.value?.id === taskToDelete.value.id) selectedTask.value = null
            taskToDelete.value = null
        }
    }

    function handleDrop(taskId: string, targetStatus: TaskStatus) {
        const task = tasks.value.find(t => t.id === taskId)
        if (task && task.status !== targetStatus) updateTask(taskId, { status: targetStatus })
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

    const priorityFilterOptions = [
        { label: 'Any',    value: 'any'    },
        { label: 'Urgent', value: 'urgent' },
        { label: 'High',   value: 'high'   },
        { label: 'Medium', value: 'medium' },
        { label: 'Low',    value: 'low'    },
    ]

    const sortByOptions = [
        { label: 'None',     value: 'none'     },
        { label: 'Priority', value: 'priority' },
        { label: 'Due date', value: 'dueDate'  },
    ]
</script>

<template>
    <div class="min-h-screen bg-gray-50 flex flex-col">
        <main class="flex-1 px-4 py-4 md:px-8 md:py-6 flex flex-col gap-4 md:gap-6">
            <!-- Title -->
            <div>
                <h1 class="font-inter font-bold text-[24px] md:text-[32px] text-gray-900">To Do List</h1>
                <p class="font-inter text-gray-400 text-[13px] md:text-[15px]">{{ today }}</p>
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
            <div class="flex flex-col sm:flex-row sm:items-end gap-3 sm:justify-between">
                <div class="flex flex-col sm:flex-row sm:items-end gap-3 flex-wrap">
                    <div class="w-full sm:w-36">
                        <DropdownForm
                            title="Priority"
                            :options="priorityFilterOptions"
                            v-model="filterPriority"
                        />
                    </div>
                    <div class="w-full sm:w-36">
                        <DropdownForm
                            title="Sort by"
                            :options="sortByOptions"
                            v-model="sortBy"
                        />
                    </div>
                </div>

                <BaseBtn
                    label="Add task"
                    icon="pi pi-plus"
                    textColor="text-white"
                    bgColor="bg-[#1a2d5a]"
                    hoverBg="hover:bg-[#1a2d5a]/90"
                    type="button"
                    @click="openFormForStatus('todo')"
                />
            </div>

            <!-- Kanban Board -->
            <div class="flex flex-col gap-4 md:flex-row md:gap-6 md:overflow-x-auto pb-4">
                <KanbanColumn
                    v-for="status in displayedStatuses"
                    :key="status"
                    :status="status"
                    :tasks="tasksForColumn(status)"
                    @click-task="selectedTask = $event"
                    @delete-task="taskToDelete = $event"
                    @drop-task="handleDrop"
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

        <ModalConfirm
            :visible="taskToDelete !== null"
            :message="`Delete &quot;${taskToDelete?.title}&quot;? This cannot be undone.`"
            @close="taskToDelete = null"
            @confirm="confirmDelete"
        />
    </div>
</template>
