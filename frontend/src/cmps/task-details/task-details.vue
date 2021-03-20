<template>
  <div v-if="task" class="task-details-modal">
    <div class="task-details-content">
      <header :style="{'backgroundColor': task.style.bgColor}">
        <button class="btn close-btn" @click="closeDetailsModal">+</button>
        <h1>{{ task.title }}</h1>
        <p><span>in list</span></p>
      </header>
      <div class="task-members">
        <h3>MEMBERS</h3>
        <div v-if="task.members">
            <member-avatar :members="task.members" :size="40"   />
        </div>
      </div>
      <div class="task-desc">
        <h3>Description</h3>
        <p v-if="task.description">{{ task.description }}</p>
        <p v-else class="description-area">Add a more detailed description</p>
      </div>
      <div class="task-checklists">
        <check-list-add @saveCheckList="saveCheckList" v-if="checkListModal" />
        <div v-if="task.checklists">
          <h3>Check List</h3>
          <div v-for="checklist in task.checklists" :key="checklist.id">
            <task-todo :checklist="checklist" />
          </div>
        </div>
      </div>
      <div class="task-activities">
        <h3>Activities</h3>
        <div v-if="activities">
          <div v-for="(activity, idx) in activities" :key="idx">
            <task-activities :activity="activity" />
          </div>
        </div>
      </div>
      <textarea placeholder="write a comment" v-model="comment.txt"></textarea>
      <button @click="addComment">Save</button>
      <div v-if="task.comments">
        <div v-for="(comment, idx) in task.comments" :key="idx">
          <task-comment :comment="comment" @saveComment="saveComment" />
        </div>
      </div>
      <task-dev-tools @checkList="createCheckList" @removeTask="removeTask" @updateTaskCover="updateTaskCover"/>
    </div>
  </div>
</template>

<script>
import taskActivities from "./task-activities.cmp";
import memberAvatar from "./member-avatar.cmp";
import taskComment from "./task-comment.cmp";
import taskDevTools from "./task-dev-tools.cmp";
import checkListAdd from "./check-list-add.cmp";
import taskTodo from "./task-todo.cmp";

export default {
  data() {
    return {
      task: null,
      activities: null,
      checkListModal: false,
      comment: { txt: "" },
    };
  },
  methods: {
    async loadTask() {
      const id = this.$route.params.taskId;
      console.log("id from paprms", id);
      try {
        const task = await this.$store.dispatch({ type: "getById", id });
        this.task = JSON.parse(JSON.stringify(task));
        let taskActivities = this.$store.getters.taskActivities;
        this.activities = taskActivities;
      } catch (err) {
        console.log("Cannot find task", err);
      }
    },
    createCheckList() {
      console.log("checklist");
      this.checkListModal = true;
    },
    saveCheckList(checkList) {
      this.checkListModal = false;
      this.$store.dispatch({
        type: "addCheckList",
        checkList,
        task: this.task,
      });
    },
    addComment() {
      console.log("comment", this.comment.txt);
      this.$store.dispatch({
        type: "saveComment",
        task: this.task,
        comment: this.comment,
      });
      this.comment = { txt: "" };
    },
    saveComment(comment) {
      console.log("edit comment", comment);
      this.$store.dispatch({ type: "saveComment", task: this.task, comment });
    },
    removeTask() {
      this.$store.dispatch("removeTask", { task: this.task });
    },
    closeDetailsModal() {
      this.$store.dispatch({
        type: "updatecurrGroupIdSession",
        status: "removeFromSession",
        groupId: null,
      });
      this.$router.go(-1);
    },
    updateTaskCover(color){
      console.log('this.task', this.task)
      this.task.style.bgColor= color
      this.$store.dispatch({type: 'addTask', task: this.task})
    }
  },
  computed: {
    boradId() {
      return this.$store.getters.getBoardId;
    },
  },
  created() {
    this.loadTask();
  },
  watch: {
    "$route.params.taskId"(id) {
      console.log("Changed to", id);
      this.loadTask();
    },
  },
  components: {
    taskActivities,
    memberAvatar,
    taskComment,
    taskDevTools,
    checkListAdd,
    taskTodo,
  },
};
</script>

<style>
</style>