<script setup lang="ts">
defineProps<{
    title: string
    disabled?: boolean
    error?: string
    modelValue: string
    due?: string
}>()

defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
    <div class="flex flex-col gap-2 w-full">
        <span class="font-inter font-semibold text-[16px]">{{ title }}</span>

        <input
            type="date"
            :value="modelValue"
            @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            :max="due"
            :disabled="disabled"
            class="border border-black rounded-lg px-3 py-2 font-inter text-base outline-none
                   focus:ring-2 focus:ring-black transition
                   disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <span v-if="error" class="text-red-500 text-sm font-inter">{{ error }}</span>
    </div>
</template>
