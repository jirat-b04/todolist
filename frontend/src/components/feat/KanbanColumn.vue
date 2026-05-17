<script setup lang="ts">
    import { ref } from 'vue'
    import TaskItem from '../base/TaskItem.vue'
    import type { Task } from '../../types/task'

    const columnConfig: Record<Task['status'], { label: string; dotColor: string }> = {
        todo:  { label: 'Todo',        dotColor: 'bg-gray-800'  },
        doing: { label: 'In Progress', dotColor: 'bg-blue-500'  },
        done:  { label: 'Done',        dotColor: 'bg-green-500' },
    }

    const statusBadge: Record<Task['status'], { labelColor: string; bgColor: string }> = {
        todo:  { labelColor: 'text-black', bgColor: 'bg-gray-200'  },
        doing: { labelColor: 'text-white', bgColor: 'bg-blue-500'  },
        done:  { labelColor: 'text-white', bgColor: 'bg-green-500' },
    }

    const priorityBadge: Record<Task['priority'], { label: string; labelColor: string; bgColor: string }> = {
        urgent: { label: 'Urgent', labelColor: 'text-white', bgColor: 'bg-red-500'    },
        high:   { label: 'High',   labelColor: 'text-white', bgColor: 'bg-orange-500' },
        medium: { label: 'Medium', labelColor: 'text-black', bgColor: 'bg-yellow-400' },
        low:    { label: 'Low',    labelColor: 'text-black', bgColor: 'bg-blue-200'   },
    }

    function formatDate(dateStr: string) {
        const date = new Date(dateStr + 'T00:00:00')
        const dd   = String(date.getDate()).padStart(2, '0')
        const mm   = String(date.getMonth() + 1).padStart(2, '0')
        const yyyy = date.getFullYear()
        return `${dd}/${mm}/${yyyy}`
    }

    function buildBadges(task: Task) {
        const badges = [
            {
                label:      columnConfig[task.status].label,
                labelColor: statusBadge[task.status].labelColor,
                bgColor:    statusBadge[task.status].bgColor,
            },
            {
                label:      priorityBadge[task.priority].label,
                labelColor: priorityBadge[task.priority].labelColor,
                bgColor:    priorityBadge[task.priority].bgColor,
            },
        ]

        if (task.dueDate) {
            badges.push({
                label:      formatDate(task.dueDate),
                labelColor: 'text-gray-600',
                bgColor:    'bg-gray-100',
            })
        }

        return badges
    }

    const props = defineProps<{
        status: Task['status']
        tasks: Task[]
    }>()

    const emit = defineEmits<{
        (e: 'clickTask', task: Task): void
        (e: 'deleteTask', task: Task): void
        (e: 'dropTask', taskId: string, targetStatus: Task['status']): void
    }>()

    // ── Desktop drag & drop ──────────────────────────────────────────
    const isDragOver = ref(false)

    function onDragStart(e: DragEvent, task: Task) {
        e.dataTransfer!.setData('taskId', task.id)
        e.dataTransfer!.effectAllowed = 'move'
    }

    function onDragOver(e: DragEvent) {
        e.preventDefault()
        e.dataTransfer!.dropEffect = 'move'
        isDragOver.value = true
    }

    function onDragLeave() {
        isDragOver.value = false
    }

    function onDrop(e: DragEvent) {
        e.preventDefault()
        isDragOver.value = false
        const taskId = e.dataTransfer?.getData('taskId')
        if (taskId) emit('dropTask', taskId, props.status)
    }

    // ── Touch drag & drop ────────────────────────────────────────────
    // Module-level state so listeners survive across component instances
    let _ghost: HTMLElement | null = null
    let _dragTaskId: string | null = null

    function getTargetStatus(x: number, y: number): Task['status'] | null {
        if (_ghost) _ghost.style.display = 'none'
        const el = document.elementFromPoint(x, y)
        if (_ghost) _ghost.style.display = ''
        const col = el?.closest('[data-status]')
        return (col?.getAttribute('data-status') as Task['status']) ?? null
    }

    function onTouchStart(e: TouchEvent, task: Task) {
        // Don't interfere with taps — only activate after slight move (handled in move)
        const touch = e.touches[0]
        const src   = e.currentTarget as HTMLElement
        _dragTaskId = task.id

        _ghost = src.cloneNode(true) as HTMLElement
        Object.assign(_ghost.style, {
            position:     'fixed',
            pointerEvents:'none',
            opacity:      '0.85',
            zIndex:       '9999',
            width:        src.offsetWidth + 'px',
            left:         touch.clientX - src.offsetWidth / 2 + 'px',
            top:          touch.clientY - src.offsetHeight / 2 + 'px',
            boxShadow:    '0 8px 24px rgba(0,0,0,0.18)',
            borderRadius: '6px',
            transform:    'scale(1.03)',
        })
        document.body.appendChild(_ghost)

        function onMove(ev: TouchEvent) {
            ev.preventDefault()
            const t = ev.touches[0]
            if (!_ghost) return
            _ghost.style.left = t.clientX - _ghost.offsetWidth  / 2 + 'px'
            _ghost.style.top  = t.clientY - _ghost.offsetHeight / 2 + 'px'
        }

        function onEnd(ev: TouchEvent) {
            document.removeEventListener('touchmove', onMove)
            document.removeEventListener('touchend',  onEnd)

            const t = ev.changedTouches[0]
            const targetStatus = getTargetStatus(t.clientX, t.clientY)

            _ghost?.remove()
            _ghost = null

            if (_dragTaskId && targetStatus && targetStatus !== props.status) {
                emit('dropTask', _dragTaskId, targetStatus)
            }
            _dragTaskId = null
        }

        document.addEventListener('touchmove', onMove, { passive: false })
        document.addEventListener('touchend',  onEnd)
    }
</script>

<template>
    <div
        :data-status="status"
        class="flex flex-col gap-3 w-full md:flex-1 md:min-w-[200px] rounded-lg transition-colors duration-150"
        :class="isDragOver ? 'bg-blue-50 ring-2 ring-blue-200' : ''"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
    >
        <div class="flex items-center gap-2">
            <span :class="['w-2 h-2 rounded-full inline-block', columnConfig[status].dotColor]" />
            <span class="font-inter font-semibold text-[16px] text-gray-800">
                {{ columnConfig[status].label }}
            </span>
            <span class="font-inter text-gray-400 text-[15px]">{{ tasks.length }}</span>
        </div>

        <div class="flex flex-col gap-2 min-h-[200px] p-2 rounded-md">
            <div
                v-for="task in tasks"
                :key="task.id"
                draggable="true"
                @dragstart="onDragStart($event, task)"
                @touchstart="onTouchStart($event, task)"
                class="cursor-grab active:cursor-grabbing"
            >
                <TaskItem
                    :title="task.title"
                    titleColor="text-black"
                    :badges="buildBadges(task)"
                    @click="emit('clickTask', task)"
                    @detail="emit('clickTask', task)"
                    @delete="emit('deleteTask', task)"
                />
            </div>
        </div>
    </div>
</template>
