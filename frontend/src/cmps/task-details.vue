<template>
  <div v-if="task" class="task-details-modal">
    <div class="task-details-content">
      <header>
        <button class="btn close-btn">+</button>
        <h1>{{ task.title }}</h1>
        <p><span>in list</span></p>
      </header>
      <div class="task-members">
        <h3>MEMBERS</h3>
        <div v-for="member in task.members" :key="member._id">
          <img class="avatar" :src="member.imgUrl" alt="" />
        </div>
      </div>
      <div class="task-desc">
        <h3>Description</h3>
        <p v-if="task.description">{{ task.description }}</p>
        <p v-else class="description-area"> Add a more detailed description </p>
      </div>
      <div class="task-activities">
        <h3>Activities</h3>
        <div v-if="activities">
          <div v-for="activity in activities" :key="activity.id">
            <task-activities :activity="activity" />
          </div>
        </div>
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
        if (!taskActivities || !taskActivities.length) return;
        else this.activities = taskActivities;
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