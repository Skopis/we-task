<template>
  <div class="board" v-if="boardToShow">
    <h3>Board Name: {{ boardToShow.title }}</h3>
    <!-- <section class="task-list-container"> -->
    <draggable
      tag="section"
      v-bind="dragOptions"
      :list="boardToShow.groups"
      @start="dragOn"
      @end="dragOff"
      class="task-list-container"
    >
      <div v-for="group in boardToShow.groups" :key="'L' + group.id">
        <group-list :group="group" @updateTask="updateTask"/>
      </div>
      <!-- </section> -->
    </draggable>
    <router-view  />
    <pre>
    {{ boardToShow.groups }}
    </pre>
  </div>
</template>

<script>
import groupList from "../cmps/group-list.vue";
import draggable from "vuedraggable";

export default {
  name: "board",
  computed: {
    boardToShow(){
      return JSON.parse(JSON.stringify(this.$store.getters.getBoard))
    },
    dragOptions() {
      return {
        animation: 500,
        group: "group",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  async created() {
    const boardId= this.$route.params.boardId
    await this.$store.dispatch({ type: "loadBoard", boardId });
  },
  methods: {
    async updateTask(taskToUpdate, group){
      await this.$store.dispatch({
        type: "addTask", task: taskToUpdate, group,
      });
    },
    dragOff(ev) {
      console.log("Off");
      console.log(ev);
    },
    dragOn(ev) {
      console.log("On");
      console.log(ev);
    },
    saveBoard() {
      this.$store.dispatch({ type: "setBoard", board: this.boardToShow });
    },
  },
  components: {
    groupList,
    draggable,
  },
};
</script>
