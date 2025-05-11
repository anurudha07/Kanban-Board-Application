<template>
  <div class="modal">
    <h3>Add Section</h3>
    <input v-model="title" placeholder="Section title" />
    <div style="margin-top:8px;">
      <button @click="add">Add</button>
      <button @click="$emit('close')" style="margin-left:8px;">Cancel</button>
    </div>
  </div>
</template>

<script>
export default {
  data() { return { title: '' }; },
  methods: {
    add() {
      if (this.title.trim()) {
        this.$emit('add-section', this.title.trim());
      }
    }
  }
};
</script>