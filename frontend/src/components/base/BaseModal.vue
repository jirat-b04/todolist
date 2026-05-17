<script setup lang="ts">

    defineProps<{
        visible: boolean
    }>()
    
    const emit = defineEmits<{
        (e: 'confirm'): void
        (e: 'cancel'): void
        (e: 'close'): void
    }>()
</script>

<template>

    <div
        v-if="visible"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
        <div class="bg-white rounded-md p-4 min-w-[320px] relative">

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