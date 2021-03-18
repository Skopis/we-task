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
        <p v-else class="description-area">Add a more detailed description</p>
      </div>
      <div class="task-checklist" v-if="checkListModal">
         <check-lisd-add @saveCheckList="saveCheckList" />
      </div>

      <div class="task-activities">
        <h3>Activities</h3>
        <div v-if="activities">
          <div v-for="activity in activities" :key="activity.id">
            <task-activities :activity="activity" />
          </div>
        </div>
      </div>
      <textarea placeholder="write a comment"></textarea>
      <div v-if="task.comments">
        <div v-for="(comment, idx) in task.comments" :key="idx">
          <task-comment :comment="comment" />
        </div>
      </div>
      <task-dev-tools @checkList="createCheckList" />
    </div>
  </div>
</template>

<script>
import taskActivities from "./task-activities.cmp.vue";
import taskComment from "./task-comment.cmp.vue";
import taskDevTools from "./task-dev-tools.cmp";
import checkLisdAdd from './check-list-add.cmp';
export default {
  data() {
    return {
      task: null,
      activities: null,
      checkListModal:false,
    };
  },
  methods: {
    async loadTask() {
      const id = this.$route.params.taskId;
      try {
        const task = await this.$store.dispatch({ type: "getById", id });
        this.task = task;
        console.log(task.comments);
        let taskActivities = this.$store.getters.taskActivities;
        if (!taskActivities || !taskActivities.length) return;
        else this.activities = taskActivities;
      } catch (err) {
        console.log("Cannot find task", err);
      }
    },
    createCheckList(){
      console.log('checklist')
      this.checkListModal = true
    },
    saveCheckList(checkList){
      this.checkListModal = false
      console.log(checkList)

    }
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
  components: {
    taskActivities,
    taskComment,
    taskDevTools,
    checkLisdAdd
  },
};
</script>

<style>
</style>