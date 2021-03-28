<template>
  <section class="dashboard">
    <div class=chart-conainer>
      <h3>Tasks per list</h3>
      <pie-chart class="chart" v-if="pieData" :pieData="pieData" />
    </div>
    <div class=chart-conainer>
      <h3>Tasks per person</h3>
      <bar-chart class="chart" v-if="barData" :barData="barData" />
    </div>
  </section>
</template>

<script >
import pieChart from "@/cmps/charts/pie-chart";
import barChart from "@/cmps/charts/bar-chart";

export default {
  name: "dashboard",
  data() {
    return {
      barData: this.$store.getters.tasksPerPerson,
      pieData: this.$store.getters.groupsNameNAmount,
    };
  },
  created() {
    const boardId = this.$route.params.boardId;
    // console.log("boardId at dashboard", boardId);
  },
  components: {
    pieChart,
    barChart,
  },
};
</script>