<script setup lang="ts">
defineProps<{
    title: string
    options: { label: string; value: string }[]
    placeholder?: string
    disabled?: boolean
    error?: string
    modelValue: string
}>()

defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
    <div class="flex flex-col gap-2 w-full">
        <span class="font-inter font-semibold text-[16px]">{{ title }}</span>

        <select
            :value="modelValue"
            @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
            :disabled="disabled"
            class="border border-black rounded-lg px-3 py-2 font-inter text-base outline-none
                   focus:ring-2 focus:ring-black transition bg-white
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <option value="" disabled>{{ placeholder ?? 'Select...' }}</option>
            <option v-for="opt in options" :key="opt.value" :value="opt.value">
                {{ opt.label }}
            </option>
        </select>

        <span v-if="error" class="text-red-500 text-sm font-inter">{{ error }}</span>
    </div>
</template>
