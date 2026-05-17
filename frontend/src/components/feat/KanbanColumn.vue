<script setup lang="ts">
    import TaskItem from '../base/TaskItem.vue'
    import type { Task } from '../../types/task'

    const columnConfig: Record<Task['status'], { label: string; dotColor: string }> = {
        todo:  { label: 'Todo',  dotColor: 'bg-gray-800'  },
        doing: { label: 'Doing', dotColor: 'bg-blue-500'  },
        done:  { label: 'Done',  dotColor: 'bg-green-500' },
    }

    const statusBadge: Record<Task['status'], { labelColor: string; bgColor: string }> = {
        todo:  { labelColor: 'text-white', bgColor: 'bg-[#3B4DE0]' },
        doing: { labelColor: 'text-white', bgColor: 'bg-[#3B4DE0]' },
        done:  { labelColor: 'text-white', bgColor: 'bg-[#22C55E]' },
    }

    const priorityBadge: Record<Task['priority'], { label: string; labelColor: string; bgColor: string }> = {
        urgent: { label: 'Urgent', labelColor: 'text-white',    bgColor: 'bg-[#F97316]' },
        high:   { label: 'High',   labelColor: 'text-black',    bgColor: 'bg-[#FACC15]' },
        medium: { label: 'Medium', labelColor: 'text-gray-700', bgColor: 'bg-[#E5E7EB]' },
        low:    { label: 'Low',    labelColor: 'text-gray-500', bgColor: 'bg-[#F3F4F6]' },
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr + 'T00:00:00')
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }

    function buildBadges(task: Task) {
        const badges = [
            {
                label:      columnConfig[task.status].label,
                labelColor: statusBadge[task.status].labelColor,
                bgColor:    statusBadge[task.status].bgColor,
            },
            {
                label:      priorityBadge[task.priority].label,
                labelColor: priorityBadge[task.priority].labelColor,
                bgColor:    priorityBadge[task.priority].bgColor,
            },
        ]

        if (task.dueDate) {
            badges.push({
                label:      formatDate(task.dueDate),
                labelColor: 'text-gray-600',
                bgColor:    'bg-gray-100',
            })
        }

        return badges
    }

    defineProps<{
        status: Task['status']
        tasks: Task[]
    }>()

    const emit = defineEmits<{
        (e: 'clickTask', task: Task): void
    }>()
</script>

<template>
    <div class="flex flex-col gap-3 flex-1 min-w-[200px]">
        <div class="flex items-center gap-2">
            <span :class="['w-2 h-2 rounded-full inline-block', columnConfig[status].dotColor]" />
            <span class="font-inter font-semibold text-[16px] text-gray-800">
                {{ columnConfig[status].label }}
            </span>
            <span class="font-inter text-gray-400 text-[15px]">{{ tasks.length }}</span>
        </div>

        <div class="flex flex-col gap-2">
            <TaskItem
                v-for="task in tasks"
                :key="task.id"
                :title="task.title"
                titleColor="text-black"
                :badges="buildBadges(task)"
                @click="emit('clickTask', task)"
            />
        </div>
    </div>
</template>
