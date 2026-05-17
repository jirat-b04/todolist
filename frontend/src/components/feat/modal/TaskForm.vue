<script setup lang="ts">
    import { ref, watch } from 'vue'
    import BaseModal from '../../base/BaseModal.vue'
    import Header from '../../layout/Header.vue'
    import InputForm from '../../base/form/InputForm.vue'
    import DropdownForm from '../../base/form/DropdownForm.vue'
    import DatePickerForm from '../../base/form/DatePickerForm.vue'
    import BaseBtn from '../../base/BaseBtn.vue'
    import type { TaskStatus, TaskPriority } from '../../../types/task'

    const props = defineProps<{
        visible: boolean
        defaultStatus?: TaskStatus
    }>()

    const emit = defineEmits<{
        (e: 'close'): void
        (e: 'confirm', data: {
            title: string
            description: string
            status: TaskStatus
            priority: TaskPriority
            dueDate: string
        }): void
    }>()

    const title       = ref('')
    const description = ref('')
    const status      = ref<TaskStatus>('todo')
    const priority    = ref<TaskPriority | ''>('')
    const dueDate     = ref('')

    const titleError    = ref('')
    const priorityError = ref('')

    watch(() => props.visible, (val) => {
        if (val) {
            title.value         = ''
            description.value   = ''
            status.value        = props.defaultStatus ?? 'todo'
            priority.value      = ''
            dueDate.value       = ''
            titleError.value    = ''
            priorityError.value = ''
        }
    })

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

    function handleConfirm() {
        titleError.value    = title.value.trim()  ? '' : 'Title is required'
        priorityError.value = priority.value       ? '' : 'Priority is required'
        if (titleError.value || priorityError.value) return
        emit('confirm', {
            title:       title.value.trim(),
            description: description.value.trim(),
            status:      status.value,
            priority:    priority.value as TaskPriority,
            dueDate:     dueDate.value,
        })
        emit('close')
    }

    function handleClose() {
        emit('close')
    }
</script>

<template>
    <BaseModal :visible="visible" @close="handleClose">
        <div class="flex flex-col w-full min-h-0 flex-1">
            <Header title="New Task" title-color="text-[#000000]" />

            <div class="flex flex-col gap-4 overflow-y-auto flex-1 mt-4">
                <InputForm
                    title="Title"
                    placeholder="Task title"
                    v-model="title"
                    :error="titleError"
                />

                <InputForm
                    title="Description"
                    placeholder="More detail (optional)"
                    v-model="description"
                />

                <div class="grid grid-cols-3 sm:flex-row gap-4">
                    <DropdownForm
                        title="Status"
                        placeholder="Select"
                        :options="statusOptions"
                        v-model="status"
                    />
                    <DropdownForm
                        title="Priority"
                        placeholder="Select"
                        :options="priorityOptions"
                        v-model="priority"
                        :error="priorityError"
                    />

                    <DatePickerForm
                        title="Due date"
                        v-model="dueDate"
                    />
                </div>
            </div>

            <div class="flex flex-row self-end gap-3 mt-6">
                <BaseBtn
                    label="Cancel"
                    textColor="text-[#0F172A]"
                    bgColor="bg-transparent"
                    hoverBg="hover:bg-gray-100"
                    type="button"
                    @click="handleClose"
                />
                <BaseBtn
                    label="Save"
                    textColor="text-[#FFFFFF]"
                    bgColor="bg-[#0F172A]"
                    hoverBg="hover:bg-[#0F172A]/85"
                    type="submit"
                    @click="handleConfirm"
                />
            </div>
        </div>
    </BaseModal>
</template>
