<script setup lang="ts">
    import BadgeLabel from '../base/BadgeLabel.vue'
    import type { Task } from '../../types/task'

    const statusBadge: Record<Task['status'], { label: string; labelColor: string; bgColor: string }> = {
        todo:  { label: 'Todo',  labelColor: 'text-white', bgColor: 'bg-[#3B4DE0]' },
        doing: { label: 'Doing', labelColor: 'text-white', bgColor: 'bg-[#3B4DE0]' },
        done:  { label: 'Done',  labelColor: 'text-white', bgColor: 'bg-[#22C55E]' },
    }

    const priorityBadge: Record<Task['priority'], { label: string; labelColor: string; bgColor: string }> = {
        urgent: { label: 'Urgent', labelColor: 'text-white',    bgColor: 'bg-[#F97316]' },
        high:   { label: 'High',   labelColor: 'text-black',    bgColor: 'bg-[#FACC15]' },
        medium: { label: 'Medium', labelColor: 'text-gray-700', bgColor: 'bg-[#E5E7EB]' },
        low:    { label: 'Low',    labelColor: 'text-gray-500', bgColor: 'bg-[#F3F4F6]' },
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr + 'T00:00:00')
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
    }

    defineProps<{
        task: Task | null
    }>()

    const emit = defineEmits<{
        (e: 'close'): void
    }>()
</script>

<template>
    <Transition name="backdrop">
        <div
            v-if="task"
            class="fixed inset-0 bg-black/20 z-40"
            @click="emit('close')"
        />
    </Transition>

    <Transition name="slide">
        <div
            v-if="task"
            class="fixed inset-y-0 right-0 w-96 bg-white shadow-2xl z-50 flex flex-col"
        >
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <span class="font-inter font-semibold text-[16px] text-gray-500">Task detail</span>
                <button
                    @click="emit('close')"
                    class="text-gray-400 hover:text-gray-700 transition text-lg leading-none"
                >✕</button>
            </div>

            <div class="flex flex-col gap-6 px-6 py-6 overflow-y-auto flex-1">
                <h2 class="font-inter font-bold text-[24px] text-gray-900">{{ task.title }}</h2>

                <div class="flex flex-row gap-2 flex-wrap">
                    <BadgeLabel
                        :label="statusBadge[task.status].label"
                        :labelColor="statusBadge[task.status].labelColor"
                        :bgColor="statusBadge[task.status].bgColor"
                    />
                    <BadgeLabel
                        :label="priorityBadge[task.priority].label"
                        :labelColor="priorityBadge[task.priority].labelColor"
                        :bgColor="priorityBadge[task.priority].bgColor"
                    />
                </div>

                <div v-if="task.description" class="flex flex-col gap-1">
                    <span class="font-inter font-semibold text-[13px] text-gray-400 uppercase tracking-wide">Description</span>
                    <p class="font-inter text-[15px] text-gray-700">{{ task.description }}</p>
                </div>

                <div v-if="task.dueDate" class="flex flex-col gap-1">
                    <span class="font-inter font-semibold text-[13px] text-gray-400 uppercase tracking-wide">Due date</span>
                    <p class="font-inter text-[15px] text-gray-700">{{ formatDate(task.dueDate) }}</p>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
    transform: translateX(100%);
}

.backdrop-enter-active,
.backdrop-leave-active {
    transition: opacity 0.25s ease;
}
.backdrop-enter-from,
.backdrop-leave-to {
    opacity: 0;
}
</style>
