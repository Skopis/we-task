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
        <group-list :group="group" />
      </div>
      <!-- </section> -->
    </draggable>
    <router-view />
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
  data() {
    return {
      boardToShow: null,
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 500,
        group: "group",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  created() {
    this.boardToShow = this.$store.getters.getBoard; // JSON.parse(JSON.stringify(this.$store.getters.getBoard));
    console.log("this.boardToShow at board 26", this.boardToShow);
  },
  methods: {
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
