<script setup lang="ts">
    import BaseModal from '../../base/BaseModal.vue'
    import Header from '../../layout/Header.vue'
    import BaseBtn from '../../base/BaseBtn.vue'

    defineProps<{
        visible: boolean
        message?: string
    }>()

    const emit = defineEmits<{
        (e: 'close'): void
        (e: 'confirm'): void
    }>()
</script>

<template>
    <BaseModal :visible="visible" @close="emit('close')">
        <div class="flex flex-col gap-6 min-w-[300px]">
            <Header title="Confirm delete" titleColor="text-[#000000]" />

            <p class="font-inter text-[15px] text-gray-600">
                {{ message ?? 'Are you sure you want to delete this task?' }}
            </p>

            <div class="flex flex-row self-end gap-3">
                <BaseBtn
                    label="Cancel"
                    textColor="text-[#0F172A]"
                    bgColor="bg-transparent"
                    hoverBg="hover:bg-gray-100"
                    @click="emit('close')"
                />
                <BaseBtn
                    label="Delete"
                    textColor="text-[#FFFFFF]"
                    bgColor="bg-red-500"
                    hoverBg="hover:bg-red-600"
                    @click="emit('confirm')"
                />
            </div>
        </div>
    </BaseModal>
</template>
