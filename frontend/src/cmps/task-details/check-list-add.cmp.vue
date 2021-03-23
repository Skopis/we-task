<template>
  <section class="add-note">
  <button @click="closeCheckList">X</button>
    <form @submit.prevent="saveTodo()">
    <h3>{{checklistTitle}}</h3>   
      <textarea class="new-todo-input" type="text" placeholder="Write your To Do here" v-model="todo"></textarea>
      <ul class="todo" v-if="checkList.todos">
        <li v-for="(todo, idx) in checkList.todos" :key="idx">
          <p>{{ todo.text }}</p>
        </li>
      </ul>
      <button class="btn">Add to list</button>
    </form>
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
        // console.log(this.checkList)
        this.$emit('saveCheckList', this.checkList)
    },
    closeCheckList(){
      // console.log('hello')
      this.$emit('closeCheckList')
    }
  },
};
</script>

<style>
</style>