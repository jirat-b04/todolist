<script setup lang="ts">
    defineProps<{
        statusLabel: string,
        countTask: number,
        labelColor: string,
        countColor: string,
        statusColor: string
    }>()
</script>

<template>
    <div class="flex flex-row justify-between items-center w-[30%]">
        <span
            :class="[
                labelColor,
                'font-inter font-semibold lg:text-[28px]'
            ]"
        >
            {{ statusLabel }}
        </span>

        <span
            :class="[
                countColor,
                'font-inter font-normal lg:text-[22px]'
            ]"
        >
            {{ countTask }}
        </span>
    </div>
</template>