<script setup lang="ts">
    import BadgeLabel from './BadgeLabel.vue';

    defineProps<{
        title: string
        titleColor: string
        badges: {
            label: string
            labelColor: string
            bgColor: string
        }[]
    }>()

    const emit = defineEmits<{
        (e: 'click'): void
    }>()
</script>

<template>
    <button
        @click="emit('click')"
        class="w-full bg-[#FFFFFF] border rounded-md p-2 cursor-pointer items-start hover:bg-[#fafafa] text-left"
    >
        <span :class="[titleColor, 'font-inter font-semibold text-[20px]']">{{ title }}</span>

        <div class="flex flex-row mt-4 gap-2 flex-wrap">
            <BadgeLabel
                v-for="badge in badges"
                :key="badge.label"
                :label="badge.label"
                :labelColor="badge.labelColor"
                :bgColor="badge.bgColor"
            />
        </div>
    </button>
</template>
