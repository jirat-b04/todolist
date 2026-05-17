<script setup lang="ts">
    defineProps<{
        title: string
        titleColor: string,
    }>()
</script>

<template>
    <h1
        :class="[
            titleColor,
            'font-bold font-inter text-[30px]'
        ]"
    >
        {{ title }}
    </h1>
</template>