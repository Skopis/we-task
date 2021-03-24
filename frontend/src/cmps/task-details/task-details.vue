<template>
  <div v-if="task" class="task-details-modal">
    <div class="task-details-content" @click.self="closeModals">
      <header :style="{ backgroundColor: task.style.bgColor }">
        <div class="header-content">
          <button class="btn close-btn" @click="closeDetailsModal">+</button>
          <h1>{{ task.title }}</h1>
          <p><span>in List</span></p>
        </div>
      </header>
      <main>
        <div class="task-info">
          <members-menu
            v-if="membersMenu"
            @addMemberToTask="addMemberToTask"
            @closeMembersMenu="manageMembersMenu"
          />
          <div class="members-container container">
            <h3>MEMBERS</h3>
            <div v-if="task.members">
              <member-avatar :members="task.members" :size="32" />
            </div>
            <div class="avatar">+</div>
          </div>
          <members-menu
            v-if="membersMenu"
            @addMemberToTask="addMemberToTask"
            @closeMembersMenu="manageMembersMenu"
          />
          <labels-menu
            v-if="labelsModal"
            @setLabel="setTaskLabel"
            @closeLabelMenu="manageLabelMenu"
          />
          <div class="labels-container container">
            <div v-if="task.labels" class="task-labels-wrapper">
              <h3>Labels</h3>
              <div v-for="label in task.labels" :key="label.id">
                <div :class="label.color" class="task-label">
                  {{ label.title }}
                </div>
              </div>
              <div class="task-label add-label">+</div>
            </div>
          </div>
          <date-picker
            v-if="dateMenu"
            @closeDateModal="manageDateMenu"
            @updateDueDate="updateDueDate"
          />
          <div class="due-date-continer container">
            <div v-if="task.dueDate" class="due-date-wrapper">
              <h3>Due Date</h3>
              <p class="due-date">{{ task.dueDate }}</p>
            </div>
          </div>
        </div>
        <div class="task-desc module">
          <h3 class="module-header">
            <i class="el-icon-s-unfold"></i>Description
          </h3>
          <p v-if="task.description && !isDescEditOpen" @click="editTaskDescription">{{ task.description }}</p>
          <p v-else-if="!isDescEditOpen" class="description-area" @click="editTaskDescription">Add a more detailed description</p>
          <form @submit.prevent="saveTaskDescription" v-if="isDescEditOpen">
            <textarea name="" id="" cols="20" rows="3" v-model="task.description"></textarea>
            <button class="btn" type="submit">Save</button>
          </form>
        </div>
        <div class="task-checklists module">
          <check-list-add
            :checklistTitle="checklistTitle"
            @saveCheckList="saveCheckList"
            v-if="checkListModal"
            @closeCheckList="closeCheckList"
          />
          <div v-if="task.checklists">
            <h3 class="module-header">
              <i class="el-icon-finished"></i>Check List
            </h3>
            <div v-for="checklist in task.checklists" :key="checklist.id">
              <task-todo :checklist="checklist" />
            </div>
          </div>
        </div>
        <div class="module">
          <h3 class="module-header">
            <i class="el-icon-s-order"></i>Activities
          </h3>
          <div class="comment-section">
            <textarea
              ref="writeComment"
              placeholder="write a comment"
              v-model="comment.txt"
              class="comment-box"
            ></textarea>
            <button @click="addComment" class="btn">Save</button>
          </div>
        </div>
        <div
          v-if="
            (this.task.comments && this.task.comments) ||
            (this.activities && this.activities.length)
          "
        >
          <div v-for="item in activitiesToShow" :key="item.id">
            <div v-if="item.task">
              <task-activities :activity="item" :type="item.txt" />
            </div>
            <div v-else>
              <task-comment :comment="item" @reply="reply" />
            </div>
          </div>
        </div>
      </main>
      <task-dev-tools
        @checkList="createCheckList"
        @removeTask="removeTask"
        @updateTaskCover="updateTaskCover"
        @openLabelModal="manageLabelMenu"
        @openMembersMenu="manageMembersMenu"
        @openDateModal="manageDateMenu"
      />
    </div>
  </div>
</template>

<script>
import taskActivities from "./task-activities.cmp";
import memberAvatar from "./member-avatar.cmp.vue";
import taskComment from "./task-comment.cmp";
import taskDevTools from "./task-dev-tools.cmp";
import checkListAdd from "./check-list-add.cmp";
import taskTodo from "./task-todo.cmp";
import labelsMenu from "../menu/labels-menu";
import membersMenu from "../menu/members-menu";
import DatePicker from "./date-picker.vue";

export default {
  data() {
    return {
      task: null,
      activities: null,
      checkListModal: false,
      comment: { txt: "" },
      labelsModal: false,
      membersMenu: false,
      dateMenu: false,
      loggedinUser: null,
      isDescEditOpen: false
    };
  },
  methods: {
    async loadTask() {
      const id = this.$route.params.taskId;
      try {
        const task = await this.$store.dispatch({ type: "getById", id });
        this.task = JSON.parse(JSON.stringify(task));
        let taskActivities = this.$store.getters.taskActivities;
        this.activities = taskActivities;
      } catch (err) {
        console.log("Cannot find task", err);
      }
    },
    async saveTaskDescription(){
      this.isDescEditOpen = false
      await this.$store.dispatch({ type: "addTask", task: JSON.parse(JSON.stringify(this.task)) });
      this.addActivity("Changed Task Description");
    },
    editTaskDescription(){
      this.isDescEditOpen = true
    },
    reply(memberName) {
      setTimeout(() => {
        this.$refs.writeComment.focus();
        this.comment.txt =
          "@" + memberName.toLowerCase().replace(/\s/g, "") + " ";
      }, 300);
    },
    formattedDate(date) {
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return date.toLocaleDateString(undefined, options);
    },
    manageDateMenu(status) {
      this.dateMenu = status;
    },
    manageMembersMenu(status) {
      ////////////////////
      this.membersMenu = status;
    },
    createCheckList() {
      // console.log("checklist");
      this.checkListModal = true;
    },
    closeCheckList() {
      // console.log("yahoo");
      this.checkListModal = false;
    },
    async saveCheckList(checkList) {
      this.checkListModal = false;
      await this.$store.dispatch({
        type: "addCheckList",
        checkList,
        task: this.task,
      });
      this.addActivity("Added CheckList");
      this.loadTask();
    },
    addComment() {
      if (!this.comment.txt) return;
      this.$store.dispatch({
        type: "saveComment",
        task: this.task,
        comment: this.comment,
      });
      this.comment = { txt: "" };
    },
    // saveComment(comment) {
    //   console.log("edit comment", comment);
    //   this.$store.dispatch({ type: "saveComment", task: this.task, comment });
    // },
    removeTask() {
      this.$store.dispatch("removeTask", { task: this.task });
    },
    closeDetailsModal() {
      this.$store.dispatch({
        type: "updateCurrGroupIdSession",
        status: "removeFromSession",
        groupId: null,
      });
      this.$router.go(-1);
    },
    async setTaskLabel(label) {
      await this.$store.dispatch({
        type: "setTaskLabel",
        task: this.task,
        label,
      });
      this.addActivity("Added Label");
      this.loadTask();
    },
    async updateDueDate(date) {
      var taskToEdit = JSON.parse(JSON.stringify(this.task));
      taskToEdit.dueDate = this.formattedDate(date);
      await this.$store.dispatch({ type: "addTask", task: taskToEdit });
      this.addActivity("Added Due Date");
    },
    async addActivity(activityType) {
      const { id, title } = this.task;
      var activity = {
        txt: activityType,
        createdAt: Date.now(),
        byMember: this.loggedinUser,
        task: { id, title },
      };
      await this.$store.dispatch({ type: "addActivity", activity });
      this.loadTask();
    },
    addMemberToTask(member) {
      if (!this.task.members) this.task.members = [];
      for (let i = 0; i < this.task.members.length; i++) {
        if (this.task.members[i]._id === member._id) return;
      }
      this.task.members.push(member);
      this.$store.dispatch({ type: "addTask", task: this.task });
    },
    updateTaskCover(color) {
      // console.log("this.task", this.task);
      this.task.style.bgColor = color;
      this.$store.dispatch({ type: "addTask", task: this.task });
    },
    manageLabelMenu(status) {
      // console.log(status);
      this.labelsModal = JSON.parse(status);
    },
    closeModals() {
      this.labelsModal = false;
      this.checkListModal = false;
      // console.log(this.labelsModal, this.checkListModal);
    },
  },
  computed: {
    activitiesToShow(){
      if (this.activities && this.activities.length &&
      this.task.comments && this.task.comments.length)
      var allArr = JSON.parse(JSON.stringify(this.activities.concat(this.task.comments)))
      
      else if (this.activities && this.activities.length)
        allArr = JSON.parse(JSON.stringify(this.activities))
      else allArr = JSON.parse(JSON.stringify(this.task.comments))
      var sortedArr = allArr.sort((a, b)=>{
        return b.createdAt - a.createdAt
      })
      return sortedArr
    },
    boradId() {
      return this.$store.getters.getBoardId;
    },
  },
  created() {
    this.loggedinUser = this.$store.getters.loggedinUser;
    this.loadTask();
  },
  watch: {
    "$route.params.taskId"(id) {
      // console.log("Changed to", id);
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
    labelsMenu,
    membersMenu,
    DatePicker,
  },
};
</script>