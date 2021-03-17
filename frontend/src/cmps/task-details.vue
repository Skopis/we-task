<template>
  <div v-if="task">
    <h1>{{ task.title }}</h1>
    <h5>in list</h5>
    <h4>Description</h4>
    <p>{{ task.description }}</p>
    <h4>Activities</h4>
    <div v-for="activity in task.activities" :key="activity.id">
      <task-activities :activity="activity" />
    </div>
  </div>
</template>

<script>
import taskActivities from "../cmps/task-activities.cmp";
export default {
  //   props: ["listParent"],
  data() {
    return {
      task: null,
    };
  },
  methods: {
    async loadTask() {
      const id = this.$route.params.taskId;
    //   console.log("id from params:", id);
      try {
        const task = await this.$store.dispatch({ type: "getById", id });
        console.log("task in details", task);
        this.task = task;
      } catch (err) {
        console.log("Cannot find task", err);
      }

      //   const task = taskService.getById(id);
    },
  },

  components: {
    taskActivities,
  },
  created() {
    this.loadTask();

    //   console.log(this.task)
  },
  watch: {
    "$route.params.toyId"(id) {
      console.log("Changed to", id);
      this.loadTask();
    },
  },
};
</script>

<style>
</style>