<script setup lang="ts">
    import BaseModal from '../../base/BaseModal.vue';
    import Header from '../../layout/Header.vue';
    import BaseBtn from '../../base/BaseBtn.vue';

    defineProps<{
        visible: boolean
    }>()

    const emit = defineEmits<{
        (e: 'close'): void
        (e: 'confirm'): void
    }>()
</script>

<template>

    <BaseModal
        :visible="visible"
        @close="emit('close')"
    >

        <div class="flex flex-col justify-center">
            <Header
                title="Hello"
                titleColor="text-[#000000]"
            />

            <div class="flex flex-row self-end gap-3">
                <BaseBtn 
                    label="hello"
                    textColor="text-[#FFFFFF]"
                    bgColor="bg-[#0F172A]"
                    hoverBg="hover:bg-[#0F172A]/85"
                />

                <BaseBtn
                    label="hello"
                    textColor="text-[#FFFFFF]"
                    bgColor="bg-[#0F172A]"
                    hoverBg="hover:bg-[#0F172A]/85"
                />
            </div>
        </div>
    </BaseModal>
</template>