<template>
  <div class="column" ref="column">
    <div class="column-header flex items-center justify-between">
      <h3 class="column-title text-lg font-semibold">{{ section.title }}</h3>
      <div class="header-actions flex items-center space-x-2">
        <button
          class="add-task-header-btn p-1 text-xl"
          @click="$emit('open-add-task', section.id)"
          title="Add task"
        >
          +
        </button>
        <div class="relative" @click.stop>
          <button
            class="its-more-btn"
            @click="toggleMenu"
            title="Options"
          >
            ...
          </button>
          <div v-if="showMenu" class="section-dropdown" @click.stop>
            <button class="dropdown-item" @click="onAdd">Add Card</button>
            <button class="dropdown-item mt-1" @click="onEmpty">Empty Section</button>
            <button class="dropdown-item mt-1" @click="onDelete">Delete Section</button>
          </div>
        </div>
      </div>
    </div>

    <div class="tasks-box mt-2">
      <draggable
        :list="section.taskIds"
        item-key="id"
        :group="{ name: 'tasks', pull: true, put: true }"
        :animation="200"
        ghost-class="drag-ghost"
        chosen-class="drag-chosen"
        @change="onDragChange"
      >
        <template #item="{ element: taskId }">
          <TaskCard
            :task="tasksMap[taskId]"
            @edit-task="$emit('edit-task', taskId)"
            @delete-task="$emit('delete-task', taskId)"
          />
        </template>
      </draggable>

      <div
        v-if="section.taskIds.length === 0"
        class="add-task-placeholder mt-2 p-2 text-center cursor-pointer text-gray-500"
        @click="$emit('open-add-task', section.id)"
      >
        + Add Task
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import TaskCard from './TaskCard.vue';

export default {
  name: 'Column',
  components: { draggable, TaskCard },
  props: {
    section: { type: Object, required: true },
    tasksMap: { type: Object, required: true }
  },
  data() {
    return { showMenu: false };
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick);
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    handleOutsideClick(event) {
      if (this.showMenu && !this.$refs.column.contains(event.target)) {
        this.showMenu = false;
      }
    },
    onDragChange(event) {
      const { added, removed } = event;
      if (added && removed) {
        // Moved between columns
        const fromSectionId = removed.context.component.section.id;
        const toSectionId = added.context.component.section.id;
        const fromTaskIds = removed.list;
        const toTaskIds = this.section.taskIds;
        this.$emit('move-task', { from: fromSectionId, to: toSectionId, fromTaskIds, toTaskIds });
      } else {
        // Reordered within same column
        this.$emit('reorder-tasks', { sectionId: this.section.id, taskIds: this.section.taskIds });
      }
      this.showMenu = false;
    },
    onAdd() {
      this.showMenu = false;
      this.$emit('open-add-task', this.section.id);
    },
    onEmpty() {
      this.showMenu = false;
      this.$emit('empty-section', this.section.id);
    },
    onDelete() {
      this.showMenu = false;
      this.$emit('delete-section', this.section.id);
    }
  }
};
</script>