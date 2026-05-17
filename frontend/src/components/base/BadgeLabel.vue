<script setup lang="ts">
    defineProps<{
        label: string,
        labelColor: string,
        bgColor: string,
    }>()
</script>

<template>
    <div
        :class="[
            bgColor,
            'w-fit h-fit px-2 justify-center items-center rounded-md'
        ]"
    >
        <span
            :class="[
                labelColor,
                'font-inter font-semibold text-[14px]'
            ]"
        >
            {{ label }}
        </span>
    </div>
</template>