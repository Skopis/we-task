<template>
  <section class="add-checklist">
  <button class="btn close" @click="closeCheckList">Delete</button>
    <form @submit.prevent="saveTodo()">
    <h3>{{checklistTitle}}</h3>   
      <input class="new-todo-input" type="text" placeholder="Write your To Do here" v-model="todo"/>
      <ul class="todo" v-if="checkList.todos">
        <li v-for="(todo, idx) in checkList.todos" :key="idx">
        <div class="checkbox">
        <i class="el-icon-check"></i>
          </div>
          <p class="todo-txt">{{ todo.text }}</p>
        </li>
      </ul>
    </form>
      <button class="btn" @click="saveTodo()">Add to list</button>
    <button class="btn done" @click="saveCheckList">Done</button>
  </section>
</template>

<script>
export default {
  props:['checklistTitle'],
  data() {
    return {
      todo: "",
      checkList: {
        title: this.checklistTitle,
        todos: [],
      },
    };
  },
  methods: {
    saveTodo() {
      if (!this.todo) return;
      const newTodo = { text: this.todo, isDone: false };
      this.checkList.todos.push(newTodo);
      this.todo = null;
    },
    saveCheckList(){
        console.log(this.checkList)
        this.$emit('saveCheckList', this.checkList)
    },
    closeCheckList(){
      this.$emit('closeCheckList')
    }
  },
};
</script>

<style>
</style>