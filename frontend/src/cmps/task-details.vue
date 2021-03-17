<template>
  <div>
    <h1>{{ task.title }}</h1>
    <h5>in list {{ listParent }}</h5>
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
    loadTask() {
      //   const task = taskService.getById(id);
      //   this.task=task;
      //   this.setReviews(id);
    },
  },

  components: {
    taskActivities,
  },
  created() {
    //   this.loadTask()
    const id = this.$route.params.taskId;
    console.log("id from params:", id);
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