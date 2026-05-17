<script setup lang="ts">
import { ref, watch } from 'vue'

    const props = defineProps<{
        title: string
        options: { label: string; value: string }[]
        placeholder?: string
        disabled?: boolean
        error?: string
        isOpen: boolean
    }>()

    const emit = defineEmits<{
        (e: 'submit', value: string): void
    }>()

    const selected = ref('')

    watch(() => props.isOpen, (val) => {
        if (val) selected.value = ''
    })
</script>

<template>
    <div class="flex flex-col gap-4 w-full">
        <span class="font-inter font-semibold text-[20px]">
            {{ title }}
        </span>

        <select
            v-model="selected"
            :disabled="disabled"
            class="border border-black rounded-lg px-3 py-2 font-inter text-base outline-none
                   focus:ring-2 focus:ring-black transition bg-white
                   disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <option value="" disabled>
                {{ placeholder ?? 'เลือก...' }}
            </option>
            <option
                v-for="opt in options"
                :key="opt.value"
                :value="opt.value"
            >
                {{ opt.label }}
            </option>
        </select>

        <span v-if="error" class="text-red-500 text-sm font-inter">
            {{ error }}
        </span>
    </div>
</template>