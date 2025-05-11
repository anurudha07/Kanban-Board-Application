<template>
  <div class="column">
    <!-- 1) Header sits outside the box -->
    <div class="column-header">
      <h3 class="column-title">{{ section.title }}</h3>
      <button
        class="add-task-header-btn"
        @click="$emit('open-add-task', section.id)"
        title="Add task"
      >+</button>
    </div>

    <!-- 2) Box around tasks / placeholder -->
    <div class="tasks-box">
      <draggable
        :list="section.taskIds"
        item-key="id"
        group="tasks"
        @end="onDragEnd"
      >
        <template #item="{ element: taskId }">
          <TaskCard
            :task="tasksMap[taskId]"
            @delete-task="$emit('delete-task', taskId)"
          />
        </template>
      </draggable>

      <div
        v-if="section.taskIds.length === 0"
        class="add-task-placeholder"
        @click="$emit('open-add-task', section.id)"
      >
        + Add task
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import TaskCard from './TaskCard.vue'

export default {
  components: { draggable, TaskCard },
  props: {
    section: { type: Object, required: true },
    tasksMap: { type: Object, required: true }
  },
  methods: {
    onDragEnd(evt) {
      // emit reorder event if you implement persistence
    }
  }
}
</script>
