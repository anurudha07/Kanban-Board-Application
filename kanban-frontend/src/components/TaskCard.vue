<template>
  <div class="task-card" ref="card">
    <div class="task-header">
      <strong class="task-title">{{ task.name }}</strong>
      <div class="more-menu">
        <button class="more-btn" @click="toggleMenu">⋮</button>
        <div v-if="showMenu" class="dropdown">
          <button class="dropdown-item" @click="onEdit">Edit</button>
          <button class="dropdown-item" @click="onDelete">Delete</button>
        </div>
      </div>
    </div>
    <p class="task-desc">{{ task.description }}</p>
    <div class="task-meta">
      <span>Due: {{ task.dueDate }}</span>
      <span>Assignee: {{ task.assignee }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TaskCard',
  props: {
    task: { type: Object, required: true }
  },
  data() {
    return { showMenu: false };
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    onEdit() {
      this.$emit('edit-task', this.task.id);
      this.showMenu = false;
    },
    onDelete() {
      this.$emit('delete-task', this.task.id);
      this.showMenu = false;
    },
    handleClickOutside(event){
      if(this.showMenu && !this.$refs.card.contains(event.target)){
        this.showMenu = false;
      }
    }
  },
   mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
.task-card {
  background: rgba(255, 255, 255, 0.419);
  border-radius: 18px;
  height: 125px;
  padding: 22px;
  margin-bottom: 22px;
  box-shadow: 0 12px 6px rgba(0,0,0,0.1);
  position: relative;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
}

.task-title {
  font-size: 1.1rem;
}

.more-menu {
  position: relative;
}

.more-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
}

.dropdown {
  position: absolute;
  right: 0;
  top: 100%;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
  margin-top: 4px;
  z-index: 10;
  min-width: 80px;
}

.dropdown-item {
  background: none;
  border: none;
  padding: 8px 12px;
  width: 100%;
  text-align: left;
  cursor: pointer;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

.task-desc {
  margin: 8px 0;
  font-size: 0.95rem;
  color: #444;
}
.task-meta {
  font-size: 0.85rem;
  color: #666;
  display: flex;
  justify-content: space-between;
}
</style>