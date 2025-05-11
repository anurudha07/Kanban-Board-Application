<template>
  <div class="task-card">
    <div style="display:flex; justify-content:space-between;">
      <strong>{{ task.name }}</strong>
      <button @click="$emit('delete-task')">⋮</button>
    </div>
    <p>{{ task.description }}</p>
    <small>Due: {{ task.dueDate }}</small><br>
    <small>Assignee: {{ task.assignee }}</small>
  </div>
</template>

<script>
export default {
  props: {
    task: { type: Object, required: true }
  }
};
</script>