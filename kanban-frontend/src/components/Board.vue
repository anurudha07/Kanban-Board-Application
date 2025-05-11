
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
        @delete-task="deleteTask"
        @reorder-tasks="reorderSection"
      />
    </div>

    <AddSectionModal v-if="showAddSection" @add-section="addSection" @close="showAddSection = false" />
    <AddTaskModal
      v-if="showAddTask"
      :section-id="currentSectionId"
      @add-task="addTask"
      @close="showAddTask = false"
    />
  </div>
</template>

<script>
import Column from './Column.vue';
import AddSectionModal from './AddSectionModal.vue';
import AddTaskModal from './AddTaskModal.vue';
import api from '../api'; // Create this helper as described

console.log('🚀 imported api =', api);
// api.post('/tasks', payload);

export default {
  name: 'Board',
  components: {
    Column,
    AddSectionModal,
    AddTaskModal
  },
  data() {
    return {
      sections: [],
      tasks: {},
      showAddSection: false,
      showAddTask: false,
      currentSectionId: null
    };
  },
  async created() {
    try {
      const res = await api.get('/sections');
      this.sections = res.data.map(sec => ({
        id: sec._id,
        title: sec.title,
        taskIds: sec.taskIds.map(t => t._id)
      }));
      this.tasks = res.data.reduce((acc, sec) => {
        sec.taskIds.forEach(t => {
          acc[t._id] = {
            id: t._id,
            name: t.name,
            description: t.description,
            dueDate: t.dueDate?.slice(0, 10),
            assignee: t.assignee
          };
        });
        return acc;
      }, {});
    } catch (err) {
      console.error('Failed to load data from backend:', err);
      this.sections = [
        { id: 'section-1', title: 'Todo', taskIds: [] },
        { id: 'section-2', title: 'In Progress', taskIds: [] },
        { id: 'section-3', title: 'Done', taskIds: [] }
      ];
    }
  },
  methods: {
    async addSection(title) {
      try {
        const res = await api.post('/sections', { title });
        this.sections.push({
          id: res.data._id,
          title: res.data.title,
          taskIds: []
        });
        this.showAddSection = false;
      } catch (err) {
        console.error('Error adding section:', err);
      }
    },
    openAddTask(sectionId) {
      this.currentSectionId = sectionId;
      this.showAddTask = true;
    },
    async addTask(newTask) {
       console.log('addTask called with:', newTask, 'section:', this.currentSectionId);
      try {
        const payload = { ...newTask, sectionId: this.currentSectionId };
        const res = await api.post('/tasks', payload);
        const task = res.data;

        this.$set(this.tasks, task._id, {
          id: task._id,
          name: task.name,
          description: task.description,
          dueDate: task.dueDate?.slice(0, 10),
          assignee: task.assignee
        });

        const section = this.sections.find(s => s.id === this.currentSectionId);
        section.taskIds.push(task._id);
        this.showAddTask = false;
      } catch (err) {
        console.error('Error adding task:', err);
      }
    },
    async deleteTask(taskId) {
      try {
        await api.delete(`/tasks/${taskId}`);
        this.$delete(this.tasks, taskId);
        this.sections.forEach(section => {
          section.taskIds = section.taskIds.filter(id => id !== taskId);
        });
      } catch (err) {
        console.error('Error deleting task:', err);
      }
    },
    async reorderSection({ sectionId, taskIds }) {
      try {
        await api.put(`/sections/${sectionId}`, { taskIds });
        const section = this.sections.find(s => s.id === sectionId);
        if (section) section.taskIds = taskIds;
      } catch (err) {
        console.error('Error reordering tasks:', err);
      }
    }
  }
};
</script>
