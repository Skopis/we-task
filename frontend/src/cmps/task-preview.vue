<template>
  <section class="task-preview" @click="openTaskDetails(task.id)">
    <header class="task-header">
      <div class="task-label-container">
      <div v-if="labelDataShown"  class="task-label-container">
        <span v-for="label in task.labels" :key="label.id" :class="label.color" class="label-info small-label" @click.stop="classChange(label, false)">{{label.title}}</span>
      </div>
      <div v-else  class="task-label-container">
        <span v-for="label in task.labels" :key="label.id" :class="label.color" class="small-label" @click.stop="classChange(label, true)"></span>
      </div>
      </div>
      <task-quick-edit
        v-if="isEditModalOpen"
        @updateTask="updateTask"
        :task="task"
      />
      <section v-else>
        <p>{{ task.title }}</p>
        <button class="btn edit-task-title" @click.stop="openEditModal"><i class="el-icon-edit"></i>
        </button>
      </section>
    </header>
    <div class="task-body">
      <member-avatar :v-if="task.members" :members="task.members" :size="30" @click.native="openMemberModal" />
      <div :v-if="task.members" v-for="member in task.members" :key="member._id">
        <member-preview
          v-if="isMemberModalOpen"
          @removeMemberFromTask="removeMemberFromTask"
          :member="member"
        />
      </div>
      <div class="btn-container">
        <el-button class="btn badge eye" icon="el-icon-view" v-if="isloggedinUserMember"></el-button>
        <!-- v-if logged in member = member assigned to task-->
        <button class="btn badge" v-if="task.comments">
          <i class="el-icon-chat-square"></i> <span>{{ task.comments.length }}</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import taskQuickEdit from "./task-quick-edit.vue";
import memberPreview from "./member-preview.vue";
import memberAvatar from "./task-details/member-avatar.cmp.vue";

export default {
  name: "task-preview",
  props: ["task", "groupId"],
  data() {
    return {
      isEditModalOpen: false,
      isMemberModalOpen: false,
      labelDataShown:false,
    };
  },
  //TODO: when click on window anywhere but the modal - modal closes
  methods: {
    classChange(label, status){
      console.log(label)
      console.log(status)
      this.labelDataShown = status
      console.log(this.labelDataShown)
    },
    openMemberModal() {
      this.isMemberModalOpen = true;
    },
    openEditModal() {
      this.isEditModalOpen = true;
    },
    updateTask(taskToUpdate) {
      this.isEditModalOpen = false;
      this.$emit("updateTask", taskToUpdate);
    },
    removeMemberFromTask(member) {},
    openTaskDetails(taskId) {
      // this.$store.commit({type:'saveCurrGroupId', groupId:this.groupId})
      this.$store.dispatch({
        type: "updateCurrGroupIdSession",
        status: "saveToSession",
        groupId: this.groupId,
      });
      this.$router.push(`${this.boradId}/task/${taskId}`);
    },
  },
  computed: {
    boradId() {
      return this.$store.getters.getBoardId;
    },
    isloggedinUserMember() {
      const loggedinUser = this.$store.getters.loggedinUser;
      if (!this.task.members) return false;
      for (let i = 0; i < this.task.members.length; i++) {
        if (this.task.members[i]._id === loggedinUser._id) return true;
      }

      // return false
    },
  },
  cerated() {},
  components: {
    taskQuickEdit,
    memberPreview,
    memberAvatar,
  },
};
</script>