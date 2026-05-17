<script setup lang="ts">
    import Header from '../layout/Header.vue';
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
        class="w-70 bg-[#FFFFFF] border rounded-md p-2 cursor-pointer items-start hover:bg-[#fafafa]"
    >
        <Header
            :title="title"
            :titleColor="titleColor"
        />
        
        <div class="flex flex-row mt-4 gap-2">
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