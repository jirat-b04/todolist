<script setup lang="ts">
    defineProps<{
        count: number,
        countColor: string,
        label: string,
        labelColor: string,
    }>()
</script>

<template>
    <div
        class="flex flex-col w-fit h-fit p-2"
    >
        <span
            :class="[
                countColor,
                'font-inter font-semibold text-[58px] leading-none mb-3'
            ]"
        >
            {{ count }}
        </span>

        <span
            :class="[
                labelColor,
                'font-inter font-normal lg:text-[32px] leading-none'
            ]"
        >
            {{ label }}
        </span>
        
    </div>
</template>