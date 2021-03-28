<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  props: ["barData"],
  computed: {
    labels() {
      const labelsName = this.barData.persons.map((person) => {
        return person.fullname;
      });
      labelsName.unshift("All Tasks");
      return labelsName;
    },
    tasks() {
      const tasksAmt = this.barData.persons.map((person) => {
        return person.tasks;
      });
      tasksAmt.unshift(this.barData.allTasks);
      return tasksAmt;
    },
  },
  mounted() {
    this.renderChart(
      {
        labels: this.labels,
        datasets: [
          {
            label: "All Tasks",
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            data: this.tasks,
          },
        ],
      },
      {
        scales: {
          yAxes: [
            {
              type: "linear",
              ticks: {
                beginAtZero: true,
                min: 0,
              },
            },
          ],
        },
      }
    );
  },
};
</script>