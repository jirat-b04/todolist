<script setup lang="ts">
    defineEmits<{
        (e: 'newTask'): void
    }>()
</script>

<template>
    <nav class="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-40">
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
                <div class="w-7 h-7 bg-[#1a2d5a] rounded-md flex items-center justify-center">
                    <span class="text-white font-bold text-sm font-inter">T</span>
                </div>
                <span class="font-inter font-semibold text-[18px] text-gray-900">Tally</span>
            </div>

            <div class="flex items-center gap-2 bg-gray-100 rounded-md px-3 py-1.5 w-56 text-gray-400 text-sm font-inter cursor-pointer">
                <i class="pi pi-search text-xs" />
                <span>Search tasks...</span>
                <span class="ml-auto text-xs opacity-60">⌘K</span>
            </div>
        </div>

        <div class="flex items-center gap-3">
            <button class="text-gray-500 hover:text-gray-800 transition">
                <i class="pi pi-bell text-[18px]" />
            </button>
            <button class="text-gray-500 hover:text-gray-800 transition">
                <i class="pi pi-sliders-h text-[18px]" />
            </button>
            <button
                @click="$emit('newTask')"
                class="flex items-center gap-1.5 bg-[#1a2d5a] text-white text-sm font-inter font-medium px-3 py-2 rounded-md hover:bg-[#1a2d5a]/90 transition"
            >
                <span class="text-base leading-none">+</span>
                <span>New task</span>
            </button>
            <div class="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold font-inter select-none">
                HK
            </div>
        </div>
    </nav>
</template>
