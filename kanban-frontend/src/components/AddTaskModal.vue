<!-- src/components/AddTaskModal.vue -->
<template>
  <div class="modal">
    <h3>Add Task</h3>
    <input v-model="name" placeholder="Name" />
    <textarea v-model="description" placeholder="Description"></textarea>
    <input type="date" v-model="dueDate" />
    <input v-model="assignee" placeholder="Assignee" />
    <div style="margin-top:8px;">
      <button @click="add">Add</button>
      <button @click="$emit('close')" style="margin-left:8px;">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddTaskModal',
  props: ['sectionId'],
  data() {
    return {
      name: '',
      description: '',
      dueDate: '',
      assignee: ''
    };
  },
  methods: {
    add() {
      console.log('🛠️ AddTaskModal.add() fired for section:', this.sectionId, {
        name: this.name,
        description: this.description,
        dueDate: this.dueDate,
        assignee: this.assignee
      });
      if (!this.name.trim()) return;
      this.$emit('add-task', {
        name: this.name.trim(),
        description: this.description.trim(),
        dueDate: this.dueDate,
        assignee: this.assignee.trim()
      });
    }
  }
};
</script>
