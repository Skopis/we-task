<script>
import { Pie } from "vue-chartjs";

export default {
  props: ["pieData"],
  computed: {
    labels() {
      const labelName = this.pieData.map((group) => {
        return group.groupName;
      });
      return labelName;
    },
    amount() {
      const amount = this.pieData.map((group) => {
        return group.amount;
      });
      return amount;
    },
  },
  extends: Pie,
  mounted() {
    this.renderChart({
      labels: this.labels,
      datasets: [
        {
          backgroundColor: [
            "rgba(255, 99, 132, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 206, 86, 0.6)",
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(75, 102, 255, 0.6)",
          ],
          data: this.amount,
        },
      ],
    });
  },
};
</script>

