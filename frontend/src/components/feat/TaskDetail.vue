<script setup lang="ts">
    import { ref, watch } from 'vue'
    import BadgeLabel from '../base/BadgeLabel.vue'
    import InputForm from '../base/form/InputForm.vue'
    import DropdownForm from '../base/form/DropdownForm.vue'
    import DatePickerForm from '../base/form/DatePickerForm.vue'
    import BaseBtn from '../base/BaseBtn.vue'
    import { useTaskStore } from '../../composables/useTaskStore'
    import type { Task, TaskStatus, TaskPriority } from '../../types/task'

    const statusBadge: Record<Task['status'], { label: string; labelColor: string; bgColor: string }> = {
        todo:  { label: 'Todo',        labelColor: 'text-black', bgColor: 'bg-gray-200'  },
        doing: { label: 'In Progress', labelColor: 'text-black', bgColor: 'bg-blue-500'  },
        done:  { label: 'Done',        labelColor: 'text-black', bgColor: 'bg-green-500' },
    }

    const priorityBadge: Record<Task['priority'], { label: string; labelColor: string; bgColor: string }> = {
        urgent: { label: 'Urgent', labelColor: 'text-black', bgColor: 'bg-red-500'    },
        high:   { label: 'High',   labelColor: 'text-black', bgColor: 'bg-orange-500' },
        medium: { label: 'Medium', labelColor: 'text-black', bgColor: 'bg-yellow-400' },
        low:    { label: 'Low',    labelColor: 'text-black', bgColor: 'bg-blue-200'   },
    }

    const statusOptions = [
        { label: 'Todo',        value: 'todo'  },
        { label: 'In Progress', value: 'doing' },
        { label: 'Done',        value: 'done'  },
    ]

    const priorityOptions = [
        { label: 'Urgent', value: 'urgent' },
        { label: 'High',   value: 'high'   },
        { label: 'Medium', value: 'medium' },
        { label: 'Low',    value: 'low'    },
    ]

    function formatDate(dateStr: string) {
        const date = new Date(dateStr + 'T00:00:00')
        const dd   = String(date.getDate()).padStart(2, '0')
        const mm   = String(date.getMonth() + 1).padStart(2, '0')
        const yyyy = date.getFullYear()
        return `${dd}/${mm}/${yyyy}`
    }

    const props = defineProps<{ task: Task | null }>()
    const emit = defineEmits<{ (e: 'close'): void }>()

    const { updateTask } = useTaskStore()

    const isEditing    = ref(false)
    const editTitle    = ref('')
    const editDesc     = ref('')
    const editStatus   = ref<TaskStatus>('todo')
    const editPriority = ref<TaskPriority | ''>('')
    const editDueDate  = ref('')

    watch(() => props.task, (val) => {
        isEditing.value = false
        document.body.style.overflow = val ? 'hidden' : ''
    })

    function startEdit() {
        if (!props.task) return
        editTitle.value    = props.task.title
        editDesc.value     = props.task.description
        editStatus.value   = props.task.status
        editPriority.value = props.task.priority
        editDueDate.value  = props.task.dueDate
        isEditing.value    = true
    }

    function save() {
        if (!props.task || !editTitle.value.trim()) return
        updateTask(props.task.id, {
            title:       editTitle.value.trim(),
            description: editDesc.value.trim(),
            status:      editStatus.value,
            priority:    editPriority.value as TaskPriority,
            dueDate:     editDueDate.value,
        })
        isEditing.value = false
    }
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
            class="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 flex flex-col"
        >
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <span class="font-inter font-semibold text-[16px] text-gray-500">Task detail</span>
                <div class="flex items-center gap-3">
                    <button
                        v-if="!isEditing"
                        @click="startEdit"
                        class="font-inter text-sm text-[#1a2d5a] hover:underline transition"
                    >Edit</button>
                    <button
                        @click="emit('close')"
                        class="text-gray-400 hover:text-gray-700 transition text-lg leading-none"
                    >✕</button>
                </div>
            </div>

            <!-- View mode -->
            <div v-if="!isEditing" class="flex flex-col gap-6 px-6 py-6 overflow-y-auto flex-1">
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

            <!-- Edit mode -->
            <div v-else class="flex flex-col gap-4 px-6 py-6 overflow-y-auto flex-1">
                <InputForm title="Title" placeholder="Task title" v-model="editTitle" />
                <InputForm title="Description" placeholder="More detail (optional)" v-model="editDesc" />

                <div class="flex flex-col sm:flex-row gap-4">
                    <DropdownForm
                        title="Status"
                        placeholder="Select"
                        :options="statusOptions"
                        v-model="editStatus"
                    />
                    <DropdownForm
                        title="Priority"
                        placeholder="Select"
                        :options="priorityOptions"
                        v-model="editPriority"
                    />
                </div>

                <DatePickerForm title="Due date" v-model="editDueDate" />

                <div class="flex self-end gap-3 mt-2">
                    <BaseBtn
                        label="Cancel"
                        textColor="text-[#0F172A]"
                        bgColor="bg-transparent"
                        hoverBg="hover:bg-gray-100"
                        @click="isEditing = false"
                    />
                    <BaseBtn
                        label="Save"
                        textColor="text-[#FFFFFF]"
                        bgColor="bg-[#0F172A]"
                        hoverBg="hover:bg-[#0F172A]/85"
                        @click="save"
                    />
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
