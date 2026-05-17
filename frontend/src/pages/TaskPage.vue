<script setup lang="ts">

    import { ref } from 'vue'

    import Header from '../components/layout/Header.vue';
    import BaseBtn from '../components/base/BaseBtn.vue';
    import BaseCountTask from '../components/base/CountTask.vue';
    import BaseStatusHeader from '../components/base/StatusHeader.vue';
    import BaseBadgeLabel from '../components/base/BadgeLabel.vue';
    import TaskItem from '../components/base/TaskItem.vue';
    import ModalConfirm from '../components/feat/modal/ModalConfirm.vue';
    import TaskForm from '../components/feat/modal/TaskForm.vue';

    const isOpen = ref(false)
    const isFormOpen = ref(false)

    const handleClick = () => {
        console.log('clicked')
    }
</script>

<template>

    <Header
        title="Hello"
        titleColor="text-[#000000]"
    />

    <BaseBtn
        icon="he"
        label="hello"
        textColor="text-[#FFFFFF]"
        bgColor="bg-[#0F172A]"
        hoverBg="hover:bg-[#0F172A]/85"
        @click="handleClick"
    />

    <BaseCountTask
        :count="1000"
        label="hello"
        countColor="text-[#000000]"
        labelColor="text-[#0F172A]"
    />

    <BaseStatusHeader
        statusLabel="hello"
        :countTask="1000"
        labelColor=""
        countColor=""
        statusColor=""
    />

    <BaseBadgeLabel
        label="Done"
        labelColor="text-[#F3F3F3]"
        bgColor="bg-[#000000]"
    />

    <TaskItem
        title="Project Alpha"
        titleColor="text-black"

        :badges="[
            {
                label: 'Done',
                labelColor: 'text-white',
                bgColor: 'bg-green-500'
            },
            {
                label: 'Urgent',
                labelColor: 'text-white',
                bgColor: 'bg-red-500'
            },
            {
                label: 'Review',
                labelColor: 'text-black',
                bgColor: 'bg-yellow-300'
            }
        ]"
    />

    <BaseBtn
        label="Open Modal"
        textColor="text-white"
        bgColor="bg-slate-900"
        hoverBg="hover:bg-slate-800"
        @click="isOpen = true"
    />

    <ModalConfirm
        :visible="isOpen"
        @close="isOpen = false"
    />

    <BaseBtn
        label="Form"
        textColor="text-white"
        bgColor="bg-slate-900"
        hoverBg="hover:bg-slate-800"
        @click="isFormOpen = true"
    />

    <TaskForm
        :visible="isFormOpen"
        @close="isFormOpen = false"
    />
</template>