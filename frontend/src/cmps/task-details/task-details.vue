<template>
  <div v-if="task" class="task-details-modal" @click.self="closeDetailsModal">
    <div class="task-details-content" @click.self.stop="closeAllModals">
      <header
        :style="
          task.style.imgUrl
            ? {
              backgroundImage: 'url(' + task.style.imgUrl + ')',
              backgroundColor: 'rgb(131, 127, 126)!important',
              minHeight: 160 + 'px' ,width:100 +'%',
              backgroundSize:' contain',
              backgroundOrigin: 'content-box',
              padding: 0 +'px',
              position:'relative',
              margin:'auto',
              backgroundPosition: 'center center',
            }
            : { backgroundColor: (!task.style.bgColor)?  'rgb(244, 245, 247)' : task.style.bgColor  }
        "
      >
        <div class="header-content">
          <button class="btn close-modal" @click="closeDetailsModal">
            <i class="el-icon-close"></i>
          </button>
          <h1 class="task-title" v-if="!task.style.imgUrl">
            <img src="../../assets/icons/card.png" alt="" />{{ task.title }}
          </h1>
          <p v-if="!task.style.imgUrl">
            in List <span class="list-title"> {{ listTitle }}</span>
          </p>
        </div>
      </header>
      <main>
        <div v-if="task.style.imgUrl">
          <h1 class="task-title">
            <img src="../../assets/icons/card.png" alt="" />{{ task.title }}
          </h1>
          <p>
            in List <span class="list-title"> {{ listTitle }}</span>
          </p>
        </div>
        <div class="task-info">
         
          <div class="members-container container" v-if="task.members && task.members.length">
            <h3>MEMBERS</h3>
            <div v-if="task.members">
              <member-avatar :members="task.members" :size="32" />
            </div>
            <div class="avatar">+</div>
          </div>
          <members-menu
            v-if="membersMenu"
            :style="task.style.imgUrl ? { marginTop: 140 + 'px' } : {}"
            @addMemberToTask="addMemberToTask"
            @closeMembersMenu="manageMembersMenu"
          />
          <labels-menu
            v-if="labelsModal"
            :style="task.style.imgUrl ? { marginTop: 140 + 'px' } : {}"
            @setLabel="setTaskLabel"
            @closeLabelMenu="manageLabelMenu"
            @updateLabel="updateLabel"
          />
          <div class="labels-container container">
            <div v-if="task.labels" class="task-labels-wrapper">
              <h3>Labels</h3>
              <div v-for="label in task.labels" :key="label.id">
                <div :class="label.color" class="task-label">
                  {{ accurateTitle(label.id) }}
                </div>
              </div>
              <div class="task-label add-label">+</div>
            </div>
          </div>

          <div class="due-date-continer container">
            <div v-if="task.dueDate" class="due-date-wrapper">
              <h3>Due Date</h3>
              <div class="flex due-date-content">
                <el-checkbox v-model="task.dueDate.isComplete"></el-checkbox>
                <p class="due-date" @click="toggleTaskComplete">
                  {{ task.dueDate.date }}
                  <span class="complete" v-if="task.dueDate.isComplete">
                    COMPLETE</span
                  >
                </p>
              </div>
            </div>
          </div>
          <task-attachment
            v-if="isAttachmentModalOpen"
            :style="task.style.imgUrl ? { marginTop: 140 + 'px' } : {}"
            @saveImgAsAttachment="saveImgAsAttachment"
          />
        </div>
        <div class="task-desc module">
          <h3 class="module-header">
            <i class="el-icon-s-unfold"></i>Description
          </h3>
          <p
            v-if="task.description && !isDescEditOpen"
            @click="editTaskDescription"
          >
            {{ task.description }}
          </p>
          <p
            v-else-if="!isDescEditOpen"
            class="description-area"
            @click="editTaskDescription"
          >
            Add a more detailed description
          </p>
          <form
            class="comment-section"
            @submit.prevent="saveTaskDescription"
            v-if="isDescEditOpen"
          >
            <textarea
              autofocus
              ref="descTxt"
              @focusout.prevent="closeTaskDescription"
              class="comment-box"
              placeholder="Add a more detailed description"
              name=""
              id=""
              cols="20"
              rows="3"
              v-model="task.description"
            ></textarea>
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
          <div v-if="task.checklists && task.checklists.length">
            <h3 class="module-header">
              <i class="el-icon-finished"></i>Check List
            </h3>
            <div v-for="checklist in task.checklists" :key="checklist.id">
              <task-todo
                :checklist="checklist"
                @updateChecklist="updateChecklist"
              />
            </div>
          </div>
        </div>
        <div class="module">
          <div v-if="task.attachments && task.attachments.length">
            <h3 class="module-header">
              <i class="el-icon-paperclip"></i>Attachments
            </h3>
            <div
              class="img-list"
              v-for="(attachment, idx) in task.attachments"
              :key="idx"
            >
              <task-attachment-display
                :attachment="attachment"
                :task="task"
                @setImageAsTaskCover="setImageAsTaskCover"
                @removeAttachment="removeAttachment"
                @comment="commentOnAttachment"
              />
            </div>
          </div>
        </div>
        <div class="module">
          <h3 class="module-header">
            <i class="el-icon-s-order"></i>Activities
          </h3>
          <div class="comment-section" @click="showSaveButton">
            <textarea
              :style="{height: textareaHeight+'px'}"
              ref="writeComment"
              placeholder="Write a comment"
              v-model="comment.txt"
              class="comment-box"
              @keydown="modifyHeight($event)"
              @focusout="hideSaveButton"
            ></textarea>
            <button v-if="isCommentButtonOn" @click="addComment" class="btn">Save</button>
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
        :style="task.style.imgUrl ? { marginTop: 140 + 'px' } : {}"
        :task="task"
        :isColorPickerOpen="false"
        :checklistTitleModa="false"
        @checkList="createCheckList"
        @removeTask="removeTask"
        @updateTaskCover="updateTaskCover"
        @openLabelModal="manageLabelMenu"
        @openMembersMenu="manageMembersMenu"
        @toggleAttachmentModal="toggleAttachmentModal"
        @closeAllModals="closeAllModals"
        @updateDueDate="updateDueDate"
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
import taskAttachment from "./task-attachment.vue";
import taskAttachmentDisplay from "./task-attachment-display.vue";
import { socketService } from "@/services/socket.service";


export default {
  data() {
    return {
      task: null,
      activities: null,
      checkListModal: false,
      comment: { txt: "" },
      labelsModal: false,
      membersMenu: false,
      loggedinUser: null,
      isDescEditOpen: false,
      isAttachmentModalOpen: false,
      checklistTitle: "",
      checklistTitleModal: false,
      isColorPickerOpen: false,
      isCommentButtonOn :false,
      textareaHeight:20,
      lettersArray:[],
      lettersCount:0
    };
  },
  methods: {
    showSaveButton(){
      this.isCommentButtonOn = true;
    },
    hideSaveButton(){
      if(this.comment.txt) return
      this.isCommentButtonOn = false
    },
    modifyHeight(ev){
      if(ev.key === 'Backspace'){
        if(!this.lettersCount){
          if(!this.lettersArray.length) return 20
          this.textareaHeight -=20
          this.lettersCount = this.lettersArray.length
        }
        this.lettersCount -=1
        this.lettersArray.pop()
        return
      } else if (ev.key === 'Enter'){
        this.lettersCount = 0
        this.textareaHeight +=20
        return  
      }
      this.lettersArray.push('e')
      this.lettersCount++
    },
    accurateTitle(labelId) {
      var title;
      const board = this.$store.getters.getBoard;
      board.labels.forEach((label) => {
        if (label.id === labelId) title = label.title;
      });
      return title;
    },
    async toggleTaskComplete() {
      this.task.dueDate.isComplete = !this.task.dueDate.isComplete;
      await this.$store.dispatch({
        type: "addTask",
        task: JSON.parse(JSON.stringify(this.task)),
      });
      if (this.task.dueDate.isComplete)
        this.addActivity("Marked Task as Complete");
      else this.addActivity("Marked Task as Incomplete");
    },
    commentOnAttachment(imgUrl) {
      setTimeout(() => {
        this.$refs.writeComment.focus();
        this.comment.txt = imgUrl;
      }, 300);
    },
    async removeAttachment(imgUrl) {
      const attachmentIdx = this.task.attachments.findIndex(
        (a) => a.imgUrl === imgUrl
      );
      this.task.attachments.splice(attachmentIdx, 1);
      await this.$store.dispatch({
        type: "addTask",
        task: JSON.parse(JSON.stringify(this.task)),
      });
      this.addActivity("Deleted Attachment");
    },
    async setImageAsTaskCover(imgUrl) {
      this.task.style.imgUrl = imgUrl;
      await this.$store.dispatch({
        type: "addTask",
        task: JSON.parse(JSON.stringify(this.task)),
      });
      if (!imgUrl) {
        this.addActivity("Removed Attached Image from Cover");
        return "cover";
      } else {
        this.addActivity("Changed cover to Attached Image");
        return "";
      }
    },
    async saveImgAsAttachment(imgUrl, originalFilename, format) {
      this.isAttachmentModalOpen = false;
      const attachment = {
        byMember: this.loggedinUser,
        imgUrl,
        originalFilename,
        format,
        createdAt: Date.now(),
      };
      if (!this.task.attachments) this.task.attachments = [];
      this.task.attachments.push(attachment);
      await this.$store.dispatch({
        type: "addTask",
        task: JSON.parse(JSON.stringify(this.task)),
      });
      this.addActivity("Added Attachment");
    },
    updateLabel(labelData) {
      this.$store.dispatch({ type: "updateLabel", labelData });
    },
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
    toggleAttachmentModal() {
      if (!this.isAttachmentModalOpen) {
        this.closeAllModals();
        this.isAttachmentModalOpen = true;
      } else this.isAttachmentModalOpen = false;
    },
    async saveTaskDescription() {
      this.isDescEditOpen = false;
      await this.$store.dispatch({
        type: "addTask",
        task: JSON.parse(JSON.stringify(this.task)),
      });
      this.addActivity("Changed Task Description");
    },
    closeTaskDescription() {
      this.isDescEditOpen = false;
    },
    editTaskDescription() {
      this.closeAllModals();
      this.isDescEditOpen = true;
      setTimeout(() => {
        this.$refs.descTxt.focus();
      }, 300);
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
        month: "short",
        day: "numeric",
        year: "numeric",
      };
      return date.toLocaleDateString(undefined, options);
    },
    manageMembersMenu(status) {
      if (!this.membersMenu) {
        this.closeAllModals();
        this.membersMenu = true;
      } else {
        this.membersMenu = false;
      }
    },
    createCheckList(checklistTitle) {
      this.checklistTitle = checklistTitle;
      this.checkListModal = true;
    },

    closeCheckList() {
      this.checkListModal = false;
    },
    async saveCheckList(checkList) {
      this.checkListModal = false;
      await this.$store.dispatch({
        type: "addCheckList",
        checkList,
        task: this.task,
      });
      this.addActivity(`Added CheckList: ${checkList.title}`);
      // this.loadTask();
    },
    async addComment() {
      if (!this.comment.txt) return;
      await this.$store.dispatch({
        type: "saveComment",
        task: this.task,
        comment: this.comment,
      });
      this.comment = { txt: "" };
      // this.loadTask();
    },

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
      const isAdded = await this.$store.dispatch({
        type: "setTaskLabel",
        task: this.task,
        label,
      });
      const txt = isAdded ? "Added a Label" : "Removed a Label";
      this.addActivity(txt);
      this.loadTask();
    },
    async updateDueDate(date) {
      var taskToEdit = JSON.parse(JSON.stringify(this.task));
      if (!taskToEdit.dueDate)
        taskToEdit.dueDate = { date: "", isComplete: false };
      taskToEdit.dueDate.date = this.formattedDate(date);
      console.log('taskToEdit.dueDate.date', taskToEdit.dueDate.date)
      taskToEdit.dueDate.isComplete = false;
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
    async addMemberToTask(member) {
      if (!this.task.members) this.task.members = [];
      for (let i = 0; i < this.task.members.length; i++) {
        if (this.task.members[i]._id === member._id) return;
      }
      this.task.members.push(member);
      await this.$store.dispatch({ type: "addTask", task: this.task });
      this.addActivity(`Added ${member.fullname} to task ${this.task.title}`)

      socketService.emit("task-added", {fullname:member.fullname, senderName:this.$store.getters.loggedinUser.fullname});
    },
    updateTaskCover(color) {
      this.task.style.imgUrl = "";
      // console.log("this.task", this.task);
      this.task.style.bgColor = color;
      this.$store.dispatch({ type: "addTask", task: this.task });
    },
    manageLabelMenu(status) {
      if (!this.labelsModal) {
        this.closeAllModals();
        this.labelsModal = true;
      } else this.labelsModal = false;
      // this.labelsModal = !this.labelsModal; //JSON.parse(status);
    },
    closeModals() {
      this.labelsModal = false;
      this.checkListModal = false;
      // console.log(this.labelsModal, this.checkListModal);
    },
    updateChecklist(checklistId, todoId, isDone) {
      const checklistIdx = this.task.checklists.findIndex(
        (checklist) => checklist.id === checklistId
      );
      const todoIdx = this.task.checklists[checklistIdx].todos.findIndex(
        (todo) => todo.id === todoId
      );
      const todo = this.task.checklists[checklistIdx].todos[todoIdx];
      todo.isDone = isDone;
      this.$store.dispatch({ type: "addTask", task: this.task });
    },
    updatedBoard(boardToUpdate) {
      // console.log("got board");
      this.$store.commit({
        type: "updateBoard",
        boardIdx: 0,
        board: boardToUpdate,
      });
      this.loadTask();
    },
    closeAllModals() {
      this.checkListModal = false;
      this.labelsModal = false;
      this.membersMenu = false;
      this.dateMenu = false;
      this.isDescEditOpen = false;
      this.isAttachmentModalOpen = false;
      this.checklistTitleModal = false;
      this.isColorPickerOpen = false;
    },
  },
  created() {
    this.loggedinUser = this.$store.getters.loggedinUser;
    this.loadTask();
    // socketService.emit("board id", this.boradId);
    socketService.on("updated board", this.updatedBoard);
  },
  // destroyed() {
  //   {
  //     socketService.off("updated board", this.updatedBoard);
  //     socketService.terminate();
  //   }
  // },
  computed: {
    listTitle() {
      this.$store.commit("getGroupByTaskId", this.task.id);
      return this.$store.getters.groupTitle;
    },
    activitiesToShow() {
      if (
        this.activities &&
        this.activities.length &&
        this.task.comments &&
        this.task.comments.length
      )
        var allArr = JSON.parse(
          JSON.stringify(this.activities.concat(this.task.comments))
        );
      else if (this.activities && this.activities.length)
        allArr = JSON.parse(JSON.stringify(this.activities));
      else allArr = JSON.parse(JSON.stringify(this.task.comments));
      var sortedArr = allArr.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
      return sortedArr;
    },
    boradId() {
      return this.$store.getters.getBoardId;
    },
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
    taskAttachment,
    taskAttachmentDisplay,
  },
};
</script>