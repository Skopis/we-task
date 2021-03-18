<template>
  <div v-if="task" class="task-details">
    <h1>{{ task.title }}</h1>
    <h5>in list</h5>
    <h4>Description</h4>
    <p>{{ task.description }}</p>
    <h4>Activities</h4>
    <div v-if=" activities">
      <div v-for="activity in activities" :key="activity.id">
        <task-activities :activity="activity" />
      </div>
    </div>
  </div>
</template>

<script>
import taskActivities from "../cmps/task-activities.cmp";
export default {
  data() {
    return {
      task: null,
      activities: null,
    };
  },
  methods: {
    async loadTask() {
      const id = this.$route.params.taskId;
      console.log("id in load task:", id);
      try {
        const task = await this.$store.dispatch({ type: "getById", id });
        this.task = task;
        let taskActivities = this.$store.getters.taskActivities;
        if(!taskActivities || !taskActivities.length) return
        else this.activities = taskActivities
        console.log("active length:", this.activities.length);
      } catch (err) {
        console.log("Cannot find task", err);
      }
    },
  },
  //   computed: {
  //     gatActivities() {
  //       this.actvities = this.$store.getters.taskActivities;
  //       console.log("active:", this.activities);
  //     },
  //   },
  components: {
    taskActivities,
  },
  created() {
    this.loadTask();
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