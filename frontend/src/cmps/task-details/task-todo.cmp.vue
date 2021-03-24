<template>
  <section class="checklist">
    <h4>{{ checklist.title }}</h4>
    <div class="progress-bar">
      <span class="bar">
        <span class="progress" :style="progress"></span>
      </span>
    </div>
    <div
      v-for="todo in checklist.todos"
      :key="todo.id"
      class="todo"
      :class="{ completed: todo.isDone }"
    >
      <div class="checkbox" @click="toggleDoneStatus(todo)">
        <i class="el-icon-check"></i>
      </div>
      <p class="todo-txt">{{ todo.text }}</p>
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
  data(){
    return{
      dscrease:0
    }
  },
  methods: {
    toggleDoneStatus(todo) {
      todo.isDone = !todo.isDone;
    },
  },
  computed: {
    progress() {
      console.log("progress", this.checklist);
      var countDoneTodos = 0;
      const todosAmount = this.checklist.todos.length
      for (var i = 0; i < todosAmount; i++) {
        if (!this.checklist.todos[i].isDone) countDoneTodos++;
      }
      var decrease = todosAmount-countDoneTodos
      decrease = decrease/todosAmount*100
      var bcg = (decrease === 0) ? 'transparent': '#5ba4cf'
      return {width: decrease+'%', backgroundColor:bcg}
    },
  },
};
</script>

<style>
</style>