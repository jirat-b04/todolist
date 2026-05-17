<script setup lang="ts">
    defineProps<{
        icon?: string,
        label: string,
        textColor: string,
        bgColor: string,
        hoverBg?: string,
        type?: 'button' | 'submit' | 'reset',
        borderColor?: string
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
            borderColor,
            'flex flex-row rounded-lg items-center gap-2 cursor-pointer px-3 py-2 w-fit h-fit border'
        ]"
    >
        <i v-if="icon" :class="icon" />

        <span class="font-inter font-normal lg:text-[20px] ">
            {{ label }} 
        </span>
    </button>
</template>