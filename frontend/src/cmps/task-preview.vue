<template>
  <section class="task-preview" @click="openTaskDetails(task.id)">
    <header class="task-header">
      <div class="task-label-container">
        <span v-for="label in task.labels" :key="label.id" :class="label.color" class="small-label"></span>
      </div>
      <task-quick-edit
        v-if="isEditModalOpen"
        @updateTask="updateTask"
        :task="task"
      />
      <section v-else>
        <p>{{ task.title }}</p>
        <button class="btn edit-task-title" @click.stop="openEditModal">✎</button>
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
        <p v-if="task.comments">
          💬{{ task.comments.length }}
        </p>
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
    };
  },
  //TODO: when click on window anywhere but the modal - modal closes
  methods: {
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