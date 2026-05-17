<script setup lang="ts">
    import { ref } from 'vue'

    import BaseModal from '../../base/BaseModal.vue'
    import Header from '../../layout/Header.vue'
    import InputForm from '../../base/form/InputForm.vue'
    import DropdownForm from '../../base/form/DropdownForm.vue'
    import DatePickerForm from '../../base/form/DatePickerForm.vue'
    import BaseBtn from '../../base/BaseBtn.vue'

    defineProps<{
        visible: boolean
    }>()

    const emit = defineEmits<{
        (e: 'close'): void
        (e: 'confirm', data: {
            taskTitle: string
            description: string
            statusTask: string
            priority: string
            dueDate: string
        }): void
    }>()

    const taskTitle   = ref('')
    const description = ref('')
    const statusTask  = ref('')
    const priority    = ref('')
    const dueDate     = ref('')

    const statusOptions = [
        { label: 'Todo', value: 'todo'     },
        { label: 'In Progress',    value: 'in_progress'  },
        { label: 'Done',  value: 'done'         },
    ]

    const priorityOptions = [
        { label: 'Urgent',   value: 'high'   },
        { label: 'High',   value: 'high'   },
        { label: 'Medium',  value: 'medium' },
        { label: 'Low',   value: 'low'    },
    ]

    function handleConfirm() {
        emit('confirm', {
            taskTitle:   taskTitle.value,
            description: description.value,
            statusTask:  statusTask.value,
            priority:    priority.value,
            dueDate:     dueDate.value,
        })
    }

    function handleClose() {
        taskTitle.value   = ''
        description.value = ''
        statusTask.value  = ''
        priority.value    = ''
        dueDate.value     = ''
        emit('close')
    }
</script>

<template>
    <BaseModal
        :visible="visible"
        @close="handleClose"
    >
        <div class="flex flex-col gap-6">
            <Header
                title="New Task"
                title-color="text-[#000000]"
            />

            <div class="flex flex-col gap-4">
                <InputForm
                    title="Title"
                    placeholder="task"
                    :is-open="visible"
                    v-model="taskTitle"
                />

                <InputForm
                    title="Description"
                    placeholder="more detail"
                    :is-open="visible"
                    v-model="description"
                />
                
                <div class="flex flex-row gap-6">
                    <DropdownForm
                        title="Status"
                        placeholder="select"
                        :options="statusOptions"
                        :is-open="visible"
                        v-model="statusTask"
                    />

                    <DropdownForm
                        title="Priority"
                        placeholder="select"
                        :options="priorityOptions"
                        :is-open="visible"
                        v-model="priority"
                    />

                    <DatePickerForm
                        title="Due date"
                        :is-open="visible"
                        v-model="dueDate"
                    />
                </div>

                <div class="flex flex-row self-end gap-3">
                    <BaseBtn
                        label="close"
                        textColor="text-[#0F172A]"
                        bgColor="bg-transparent"
                        hoverBg="hover:bg-gray-100"
                        type="button"
                        @click="handleClose"
                    />

                    <BaseBtn
                        label="save"
                        textColor="text-[#FFFFFF]"
                        bgColor="bg-[#0F172A]"
                        hoverBg="hover:bg-[#0F172A]/85"
                        type="submit"
                        @click="handleConfirm"
                    />
                </div>
            </div>
        </div>
    </BaseModal>
</template>