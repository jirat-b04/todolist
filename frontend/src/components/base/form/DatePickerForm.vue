<script setup lang="ts">
import { ref, watch } from 'vue'

    const props = defineProps<{
        title: string
        placeholder?: string
        disabled?: boolean
        error?: string
        isOpen: boolean
        due?: string
    }>()

    const emit = defineEmits<{
        (e: 'submit', value: string): void
    }>()

    const dateValue = ref('')

    watch(() => props.isOpen, (val) => {
        if (val) dateValue.value = ''
    })
</script>

<template>
    <div class="flex flex-col gap-4 w-full">
        <span class="font-inter font-semibold text-[20px]">
            {{ title }}
        </span>

        <input
            type="date"
            v-model="dateValue"
            :max="due"
            :disabled="disabled"
            class="border border-black rounded-lg px-3 py-2 font-inter text-base outline-none
                   focus:ring-2 focus:ring-black transition
                   disabled:opacity-50 disabled:cursor-not-allowed"
        />

        <span v-if="error" class="text-red-500 text-sm font-inter">
            {{ error }}
        </span>
    </div>
</template>