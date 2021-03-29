<template>
  <section class="task-preview" @click="openTaskDetails(task.id)">
    <header class="task-header">
      <div >
        <div v-if="labelDataShown" class="task-label-container">
          <span
            v-for="label in task.labels"
            :key="label.id"
            :class="label.color"
            class="label-info small-label"
            @click.stop="classChange(label, false)"
            > {{accurateTitle(label.id)}}</span
          >
        </div>
        <div v-else class="task-label-container">
          <span
            v-for="label in task.labels"
            :key="label.id"
            :class="label.color"
            class="small-label"
            @click.stop="classChange(label, true)"
          ></span>
        </div>
      </div>
      <button class="btn edit-task-title" @click.stop="openEditModal">
          <i class="el-icon-edit"></i>
        </button>
      <task-quick-edit
        v-if="isEditModalOpen"
        @updateTask="updateTask"
        :task="task"
        @stopEdit="stopEdit"
      />
      <section v-else>
        <p @click.stop="openEditModal">{{ task.title }}</p>

      </section>
    </header>
    <div class="task-body" :style="{height:bodyHeight}">
      
      <div class="btn-container">
        <el-button
          class="badge eye"
          icon="el-icon-view"
          v-if="isloggedinUserMember"
        ></el-button>
        <button class="badge clock" @click.stop="toggleComplete" v-if="task.dueDate && !task.dueDate.isComplete">
          <img src="../assets/icons/clock.png" alt="">
          <p>{{formattedDueDate}}</p>
        </button>
        <button v-else-if="task.dueDate" class="badge clock complete" @click.stop="toggleComplete">
          <img src="../assets/icons/checkbox.png" alt="">
          <p>{{formattedDueDate}}</p>
        </button>
        <button class="badge" v-if="task.comments && task.comments.length">
          <i class="el-icon-chat-square"></i>
          <span>{{ task.comments.length }}</span>
        </button>
        <button class="badge checklist" :style="{marginLeft:checklistBadgeMargin +'px'}" v-if="task.checklists && task.checklists.length && !isChecklistComplete">
          <i class="el-icon-finished"></i>
          <span>{{ checklistInfo }}</span>
        </button>
        <button class="badge checklist complete" v-if="task.checklists && task.checklists.length && isChecklistComplete">
          <i class="el-icon-finished white-font"></i>
          <span class="white-font">{{ checklistInfo }}</span>
        </button>
        <button class="badge attachment" v-if="task.attachments && task.attachments.length">
        <i class="el-icon-paperclip"></i>
          <span>{{ task.attachments.length }}</span>
        </button>
      </div>
      <div class="members-container">
        <div
          :v-if="task.members"
          v-for="member in task.members"
          :key="member._id"
        >
          <member-avatar2
            :member="member"
            :size="30"
            @click.native.stop="toggleMemberModal(member)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import taskQuickEdit from "./task-quick-edit.vue";
import memberAvatar2 from "./task-details/member-avatar2.vue";

export default {
  name: "task-preview",
  props: ["task", "groupId"],
  data() {
    return {
      isEditModalOpen: false,
      isMemberModalOpen: false,
      labelDataShown: false,
      isChecklistComplete: false
    };
  },
  //TODO: when click on window anywhere but the modal - modal closes
  methods: {
    accurateTitle(labelId){
      var title;
      const board = this.$store.getters.getBoard
      board.labels.forEach(label=>{
        if(label.id === labelId) title = label.title
      })
      return title
    },
    toggleComplete(){
      var task = JSON.parse(JSON.stringify(this.task))
      task.dueDate.isComplete = !task.dueDate.isComplete
      this.$emit("updateTask", {taskToUpdate: task});
    },
    stopEdit() {
      // this.$emit("stopEdit");
      this.isEditModalOpen = false;
    },
    classChange(label, status) {
      // console.log(label)
      // console.log(status)
      this.labelDataShown = status;
      // console.log(this.labelDataShown)
    },
    openMemberModal() {
      this.isMemberModalOpen = true;
    },
    toggleMemberModal(member) {
      this.isMemberModalOpen = !this.isMemberModalOpen;
      this.$emit(
        "toggleMemberModal",
        member,
        this.isMemberModalOpen,
        this.task
      );
    },
    openEditModal() {
      this.isEditModalOpen = true;
    },
    updateTask(taskToUpdate) {
      this.isEditModalOpen = false;
      this.$emit("updateTask", taskToUpdate);
    },
    openTaskDetails(taskId) {
      // this.$store.commit({type:'saveCurrGroupId', groupId:this.groupId})
      this.$store.dispatch({
        type: "updateCurrGroupIdSession",
        status: "saveToSession",
        groupId: this.groupId,
      });
      // console.log('taskId', taskId)
      // console.log(`${this.boradId}/task/${taskId}`)
      this.$router.push(`${this.boradId}/task/${taskId}`);
    },
  },
  computed: {
    bodyHeight(){
      if(!this.task.dueDate &&
      (!this.task.comments || !this.task.comments.length ) &&
      (!this.task.checklists)&&
      (!this.task.members || !this.task.members.length)&&
      (!this.task.attachments || !this.task.attachments.length)){
        return 0

      }else return 'fit-content'
    },
    checklistBadgeMargin(){
       if(!this.task.dueDate &&
      (!this.task.comments || !this.task.comments.length ) &&
      (!this.task.members || !this.task.members.length)&&
      (!this.task.attachments || !this.task.attachments.length)&&
      (this.task.checklists)){
        console.log('only checklist')
        return 0
      } else return -6
    },
    formattedDueDate(){
      return this.task.dueDate.date.substring(0, this.task.dueDate.date.length-4);
    },
    boradId() {
      return this.$store.getters.getBoardId;
    },
    isloggedinUserMember() {
      const loggedinUser = this.$store.getters.loggedinUser;
      if (!this.task.members) return false;
      for (let i = 0; i < this.task.members.length; i++) {
        if (this.task.members[i]._id === loggedinUser._id) return true;
      }
    },
    checklistInfo() {
      var todosCount = 0;
      var doneTodosCount = 0;
      for (var i = 0; i < this.task.checklists.length; i++) {
        var currChecklist = this.task.checklists[i];
        for (var j = 0; j < currChecklist.todos.length; j++) {
          todosCount++;
          // console.log(currChecklist.todos[j]);
          if (currChecklist.todos[j].isDone) doneTodosCount++;
        }
      }
      if(doneTodosCount===todosCount) this.isChecklistComplete = true
      return doneTodosCount + "/" + todosCount;
    },
  },
  cerated() {},
  components: {
    taskQuickEdit,
    memberAvatar2,
  },
};
</script>