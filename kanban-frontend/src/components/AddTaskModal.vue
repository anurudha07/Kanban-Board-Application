<template>
  <div class="modal">
    <h3>{{ isEdit ? 'Edit Task' : 'Add Task' }}</h3>
    <input v-model="name" placeholder="Name" />
    <textarea v-model="description" placeholder="Description"></textarea>
    <input type="date" v-model="dueDate" />
    <input v-model="assignee" placeholder="Assignee" />
    <div style="margin-top:8px;">
      <button @click="submit">{{ isEdit ? 'Update' : 'Add' }}</button>
      <button @click="$emit('close')" style="margin-left:8px;">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddTaskModal',
  props: {
    sectionId: String,
    existingTask: { type: Object, default: null }
  },
  data() {
    return {
      name: this.existingTask?.name || '',
      description: this.existingTask?.description || '',
      dueDate: this.existingTask?.dueDate || '',
      assignee: this.existingTask?.assignee || ''
    };
  },
  computed: {
    isEdit() {
      return !!this.existingTask;
    }
  },
  methods: {
    submit() {
      if (!this.name.trim()) return;
      const payload = {
        name: this.name.trim(),
        description: this.description.trim(),
        dueDate: this.dueDate,
        assignee: this.assignee.trim()
      };
      // emit either add-task or update-task
      this.$emit(this.isEdit ? 'update-task' : 'add-task', payload);
    }
  }
};
</script>
