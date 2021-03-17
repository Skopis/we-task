<template>
  <div class="board" v-if="boardToShow">
    <h3>Board Name: {{ boardToShow.title }}</h3>
    <section class="task-list-container">
      <div v-for="group in boardToShow.groups" :key="'L' + group.id">
        <group-list :group="group" />
      </div>
    </section>
    <router-view />
  </div>
</template>

<script>
import groupList from "../cmps/group-list.vue";

export default {
  name: "board",
  data() {
    return {
      boardToShow: null,
    };
  },
  computed: {},
  created() {
    this.boardToShow = this.$store.getters.getBoard;
    console.log("this.boardToShow at board 26", this.boardToShow);
  },
  methods: {},
  components: {
    groupList,
  },
};
</script>
