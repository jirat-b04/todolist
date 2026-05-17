<script setup lang="ts">
    defineProps<{
        icon?: string,
        label: string,
        textColor: string,
        bgColor: string,
        hoverBg?: string,
        type?: 'button' | 'submit' | 'reset'
    }>()

    const emit = defineEmits<{
        (e: 'click'): void
    }>()
</script>

<template>
    <button
        @click="emit('click')"
        :type="type"
        :class="[
            textColor,
            bgColor,
            hoverBg,
            'flex flex-row font-inter font-normal lg:text-[20px] px-3 rounded-lg items-center gap-2 cursor-pointer'
        ]"
    >
        <i v-if="icon" :class="icon" />

        <span class="hidden md:block">
            {{ label }} 
        </span>
    </button>
</template>