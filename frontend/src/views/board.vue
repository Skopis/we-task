<template>
  <div class="board" v-if="boardToShow">
    <h3>Board Name: {{ boardToShow.title }}</h3>
    <section class="review-list">
      <div v-for="list in boardToShow.lists" :key="'L' + list.id">
        <card-list :list="list" />
      </div>
    </section>
  </div>
</template>

<script>
import cardList from "../cmps/card-list.vue";

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
    cardList,
  },
};
</script>
