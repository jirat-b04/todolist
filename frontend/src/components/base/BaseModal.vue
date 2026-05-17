<script setup lang="ts">
    import { watch } from 'vue'

    const props = defineProps<{
        visible: boolean
    }>()

    const emit = defineEmits<{
        (e: 'confirm'): void
        (e: 'cancel'): void
        (e: 'close'): void
    }>()

    watch(() => props.visible, (val) => {
        document.body.style.overflow = val ? 'hidden' : ''
    })
</script>

<template>
    <div
        v-if="visible"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
        <div class="bg-white rounded-md p-4 relative w-full max-w-lg mx-4 flex flex-col">
            <button
                @click="emit('close')"
                class="absolute top-4 right-4"
            >
                ✕
            </button>

            <slot />
        </div>
    </div>
</template>
