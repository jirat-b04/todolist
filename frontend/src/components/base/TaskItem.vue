<script setup lang="ts">
    import { ref, onMounted, onUnmounted } from 'vue'
    import BadgeLabel from './BadgeLabel.vue'

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
        (e: 'detail'): void
        (e: 'delete'): void
    }>()

    const showMenu = ref(false)

    function toggleMenu(e: MouseEvent) {
        e.stopPropagation()
        showMenu.value = !showMenu.value
    }

    function onDetail(e: MouseEvent) {
        e.stopPropagation()
        showMenu.value = false
        emit('detail')
    }

    function onDelete(e: MouseEvent) {
        e.stopPropagation()
        showMenu.value = false
        emit('delete')
    }

    function closeMenu() {
        showMenu.value = false
    }

    onMounted(() => document.addEventListener('click', closeMenu))
    onUnmounted(() => document.removeEventListener('click', closeMenu))
</script>

<template>
    <div class="relative">
        <div
            @click="emit('click')"
            class="w-full bg-[#FFFFFF] border rounded-md p-2 cursor-pointer hover:bg-[#fafafa] text-left"
        >
            <div class="flex justify-between items-start gap-2">
                <span :class="[titleColor, 'font-inter font-semibold text-[15px] flex-1']">{{ title }}</span>

                <button
                    @click="toggleMenu"
                    class="text-gray-400 hover:text-gray-700 transition leading-none px-0.5 flex-shrink-0"
                >
                    <i class="pi pi-ellipsis-v text-[13px]" />
                </button>
            </div>

            <div class="flex flex-row mt-3 gap-2 flex-wrap">
                <BadgeLabel
                    v-for="badge in badges"
                    :key="badge.label"
                    :label="badge.label"
                    :labelColor="badge.labelColor"
                    :bgColor="badge.bgColor"
                />
            </div>
        </div>

        <div
            v-if="showMenu"
            class="absolute top-7 right-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1 min-w-[140px]"
        >
            <button
                @click="onDetail"
                class="w-full text-left px-4 py-2 text-sm font-inter text-gray-700 hover:bg-gray-50 transition"
            >
                See detail
            </button>
            <button
                @click="onDelete"
                class="w-full text-left px-4 py-2 text-sm font-inter text-red-500 hover:bg-red-50 transition"
            >
                Delete
            </button>
        </div>
    </div>
</template>
