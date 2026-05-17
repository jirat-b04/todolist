# Todo List — Kanban Board

A Kanban-style task management app built with Vue 3, TypeScript, and Tailwind CSS. Tasks are stored in `localStorage` — no backend or database required.

---

## Setup — Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm (bundled with Node.js)

### Steps

```bash
# 1. Clone the repository
git clone <repository-url>
cd todolist

# 2. Move into the frontend directory
cd frontend

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with hot reload |
| `npm run build` | Type-check then build for production |
| `npm run preview` | Preview the production build locally |

---

## Component Structure

```
src/
├── main.ts                        Entry point — creates Vue app, registers PrimeVue
├── App.vue                        Root component — mounts TaskPage
├── style.css                      Global styles (Tailwind, PrimeIcons, Inter font)
│
├── types/
│   └── task.ts                    TaskStatus, TaskPriority, Task interface
│
├── composables/
│   └── useTaskStore.ts            Shared task state + localStorage persistence
│
├── pages/
│   └── TaskPage.vue               The only page — board, filters, stats, modal control
│
└── components/
    ├── layout/
    │   ├── Header.vue             Page/modal header with title
    │   └── Navbar.vue             Navigation bar (prepared, not active)
    │
    ├── base/                      Generic, reusable — no business logic
    │   ├── form/
    │   │   ├── InputForm.vue      Text input with label + error message
    │   │   ├── DropdownForm.vue   Select dropdown with label + placeholder + error
    │   │   └── DatePickerForm.vue Native date picker with label
    │   ├── BadgeLabel.vue         Coloured pill badge
    │   ├── BaseBtn.vue            Button with icon + label (label hidden on mobile)
    │   ├── BaseModal.vue          Centred overlay modal wrapper (locks body scroll)
    │   ├── CountTask.vue          Large number + label for stats display
    │   ├── StatusHeader.vue       Status label with colour indicator
    │   └── TaskItem.vue           Task card: title, badges, three-dot action menu
    │
    └── feat/                      Feature-specific — contains product logic
        ├── KanbanColumn.vue       One board column: task list + drag-and-drop
        ├── TaskDetail.vue         Right-side slide panel: view + inline edit
        └── modal/
            ├── TaskForm.vue       Create task modal with validation
            └── ModalConfirm.vue   Generic confirmation dialog (used for delete)
```

### How the pieces connect

```
TaskPage
├── CountTask × 2          (stats: active tasks, urgent tasks)
├── DropdownForm × 2       (filter by priority, sort by)
├── BaseBtn                (Add task → opens TaskForm)
├── KanbanColumn × 3       (Todo / In Progress / Done)
│   └── TaskItem           (one card per task)
│       └── BadgeLabel × n (status, priority, due date badges)
├── TaskForm               (create task modal)
│   ├── BaseModal
│   ├── Header
│   ├── InputForm × 2      (title, description)
│   ├── DropdownForm × 2   (status, priority)
│   ├── DatePickerForm
│   └── BaseBtn × 2        (Cancel, Save)
├── TaskDetail             (slide panel — opens on task click)
│   ├── BadgeLabel × 2     (view mode: status + priority)
│   ├── InputForm × 2      (edit mode)
│   ├── DropdownForm × 2   (edit mode)
│   ├── DatePickerForm     (edit mode)
│   └── BaseBtn × 2        (edit mode: Cancel, Save)
└── ModalConfirm           (delete confirmation)
```

---

## Design Decisions & Trade-offs

### 1. Module-level composable for state instead of Pinia

`useTaskStore.ts` holds the `tasks` ref at module scope (outside the function). This means every component that calls `useTaskStore()` shares the exact same reactive reference — no store plugin needed.

**Why:** Keeps the project dependency-free for state management. The store pattern is simple enough that Pinia would add boilerplate without benefit at this scale.

**Trade-off:** No Vue Devtools time-travel or action history. If the app grows to multiple pages or complex async flows, migrating to Pinia would be worth it.

---

### 2. localStorage only — no backend

All task data is read from and written to `localStorage` on every change via a deep `watch` in the composable.

**Why:** Zero server setup. Works offline. Fits the scope of a single-user todo app.

**Trade-off:** Data doesn't sync across browsers or devices. `localStorage` has a ~5 MB limit, which is more than enough for tasks but would block any future file attachment features.

---

### 3. Native drag & drop + custom touch drag — no library

Desktop drag uses the browser's built-in HTML5 Drag and Drop API. Mobile drag is implemented manually: `touchstart` clones the card into a ghost element that follows the finger; `touchend` calls `document.elementFromPoint` (with the ghost temporarily hidden) to detect which column the finger is over.

**Why:** Avoids adding a drag-and-drop library (e.g. vue-draggable) and keeps the bundle small.

**Trade-off:** More code to maintain. The `elementFromPoint` approach requires hiding the ghost on every frame, and the touch implementation is more fragile than a battle-tested library across all device/browser combinations.

---

### 4. `base/` vs `feat/` component split

Components are split into two groups: `base/` for generic, reusable UI primitives (buttons, inputs, badges) and `feat/` for components that contain product-specific logic (Kanban column, task form, task detail panel).

**Why:** Makes it immediately clear which components are safe to reuse anywhere and which ones carry domain assumptions. Base components accept only props and emit events — they never import from the store.

**Trade-off:** Requires discipline. It is tempting to put domain logic into base components over time, which erodes the boundary.

---

### 5. All form inputs use `v-model` with an `error` prop

`InputForm`, `DropdownForm`, and `DatePickerForm` all follow the same contract: accept `modelValue` + emit `update:modelValue`, and accept an optional `error` string that renders a red message below the field.

**Why:** Consistent pattern across all form fields. Validation logic lives in the parent (`TaskForm`) and the input components stay dumb.

**Trade-off:** Validation is manual — each parent must manage its own error refs and clear them on reset. A form library (e.g. VeeValidate) would handle this automatically but adds dependency weight.

---

### 6. `TaskDetail` is a slide panel, not a modal

Clicking a task opens a fixed panel that slides in from the right instead of a centred modal overlay.

**Why:** Allows the user to see the full board behind the panel and understand context while reading or editing a task.

**Trade-off:** The panel takes the full width on mobile, which is identical to a modal at that breakpoint. A centred modal would be simpler to implement and more space-efficient on mobile.

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| [Vue 3](https://vuejs.org/) | ^3.5 | UI framework (Composition API, `<script setup>`) |
| [TypeScript](https://www.typescriptlang.org/) | ~6.0 | Static typing across all components and composables |
| [Vite](https://vitejs.dev/) | ^8.0 | Dev server and production build tool |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.3 | Utility-first styling via Vite plugin |
| [PrimeVue](https://primevue.org/) | ^4.5 | PrimeIcons icon set |
