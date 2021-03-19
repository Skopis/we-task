<template>
  <section class="checklist" >
    <h4>{{ checklist.title }}</h4>
    <div v-for="todo in checklist.todos" :key="todo.id"  :class="{completed: todo.isDone}">
      <div class="checkbox" @click="toggleDoneStatus(todo)"><i class="el-icon-check"></i></div>
      <p class="todo">{{ todo.text }}</p>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    checklist: {
      type: Object,
    },
  },
  methods: {
    toggleDoneStatus(todo) {
      todo.isDone = !todo.isDone;
    },
  },
};
</script>

<style>
</style>