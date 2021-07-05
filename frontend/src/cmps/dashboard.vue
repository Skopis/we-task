<template>
  <section class="task-details-modal" @click.self="closeDetailsModal">
    <section class="dashboard">
      <header>
        <button class="btn close-modal" @click.self.stop="closeDetailsModal">
          <i class="el-icon-close" @click.self.stop="closeDetailsModal"></i>
        </button>
      </header>
      <div class="chart-conainer">
        <h3>Tasks per list</h3>
        <pie-chart class="chart pie" v-if="pieData" :pieData="pieData" />
      </div>
      <div class="chart-conainer">
        <h3>Tasks per person</h3>
        <bar-chart class="chart" v-if="barData" :barData="barData" />
      </div>
    </section>
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
  },
  methods: {
    closeDetailsModal() {

      this.$router.go(-1);
    },
  },
  components: {
    pieChart,
    barChart,
  },
};
</script>