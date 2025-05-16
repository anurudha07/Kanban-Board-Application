<template>
  <div class="board-container">
    <div class="board-header">
      <h1 class="board-title">Kanban Board📌</h1>
      <div class="board-header-spacer"></div>
      <button class="add-section-btn" @click="showAddSection = true">+ Add Section</button>
    </div>

    <div class="board">
      <Column
        v-for="section in sections"
        :key="section.id"
        :section="section"
        :tasksMap="tasks"
        @open-add-task="openAddTask"
        @edit-task="openEditTask"
        @delete-task="deleteTask"
        @reorder-tasks="reorderSection"
        @empty-section="emptySection"
        @delete-section="deleteSection"
        @rename-section="renameSection"
      />
    </div>

    <AddSectionModal
      v-if="showAddSection"
      @add-section="addSection"
      @close="showAddSection = false"
    />

    <!-- Add Task -->
    <AddTaskModal
      v-if="showAddTask"
      :section-id="currentSectionId"
      @add-task="addTask"
      @close="showAddTask = false"
    />

    <!-- Edit Task -->
    <AddTaskModal
      v-if="showEditTask"
      :existing-task="tasks[editTaskId]"
      @update-task="updateTask"
      @close="showEditTask = false"
    />
  </div>
</template>

<script>
import Column from './Column.vue';
import AddSectionModal from './AddSectionModal.vue';
import AddTaskModal from './AddTaskModal.vue';
import api from '../api';

export default {
  components: { Column, AddSectionModal, AddTaskModal },
  data() {
    return {
      sections: [],
      tasks: {},
      showAddSection: false,
      showAddTask: false,
      showEditTask: false,
      currentSectionId: null,
      editTaskId: null
    };
  },
  async created() {
    const res = await api.get('/sections');
    this.sections = res.data.map(s => ({
      id: s._id,
      title: s.title,
      taskIds: s.taskIds.map(t => t._id)
    }));
    this.tasks = res.data.reduce((m, s) => {
      s.taskIds.forEach(t => {
        m[t._id] = {
          id: t._id,
          name: t.name,
          description: t.description,
          dueDate: t.dueDate?.slice(0, 10),
          assignee: t.assignee
        };
      });
      return m;
    }, {});
  },
  methods: {
    async addSection(title) {
      const r = await api.post('/sections', { title });
      this.sections.push({ id: r.data._id, title: r.data.title, taskIds: [] });
      this.showAddSection = false;
    },
    openAddTask(sectionId) {
      this.currentSectionId = sectionId;
      this.showAddTask = true;
    },
    async addTask(payload) {
      const r = await api.post('/tasks', {
        ...payload,
        sectionId: this.currentSectionId
      });
      const t = r.data;
      this.tasks = {
        ...this.tasks,
        [t._id]: {
          id: t._id,
          name: t.name,
          description: t.description,
          dueDate: t.dueDate?.slice(0, 10),
          assignee: t.assignee
        }
      };
      this.sections.find(s => s.id === this.currentSectionId).taskIds.push(t._id);
      this.showAddTask = false;
    },
    openEditTask(taskId) {
      this.editTaskId = taskId;
      this.showEditTask = true;
    },
    async updateTask(payload) {
      const r = await api.put(`/tasks/${this.editTaskId}`, payload);
      const t = r.data;
      this.tasks = {
        ...this.tasks,
        [t._id]: {
          id: t._id,
          name: t.name,
          description: t.description,
          dueDate: t.dueDate?.slice(0, 10),
          assignee: t.assignee
        }
      };
      this.showEditTask = false;
    },
    async deleteTask(taskId) {
      await api.delete(`/tasks/${taskId}`);
      const { [taskId]: _, ...rest } = this.tasks;
      this.tasks = rest;
      this.sections = this.sections.map(s => ({
        ...s,
        taskIds: s.taskIds.filter(id => id !== taskId)
      }));
    },
    async reorderSection({ sectionId, taskIds }) {
      await api.put(`/sections/${sectionId}`, { taskIds });
      this.sections = this.sections.map(s =>
        s.id === sectionId ? { ...s, taskIds } : s
      );
    },

    // New section handlers:
    async emptySection(sectionId) {
      await api.put(`/sections/${sectionId}`, { taskIds: [] });
      this.sections = this.sections.map(s =>
        s.id === sectionId ? { ...s, taskIds: [] } : s
      );
    },
    async deleteSection(sectionId) {
      await api.delete(`/sections/${sectionId}`);
      this.sections = this.sections.filter(s => s.id !== sectionId);
    }
  }
};
</script>
