<template>
  <section class="task-preview">
    <header class="task-header">
      <task-quick-edit
        v-if="isEditModalOpen"
        @updateTask="updateTask"
        :task="task"
      />
      <section v-else>
        <h4>{{ task.title }}</h4>
        <button class="btn edit-task-title" @click="openEditModal">✎</button>
      </section>
    </header>
    <div class="task-body">
      <div
        v-for="member in task.members"
        :key="member._id"
        :v-if="task.members"
      >
        <img
          class="avatar"
          :src="member.imgUrl"
          alt="member-img"
          @click="openMemberModal"
        />
        <member-preview
          v-if="isMemberModalOpen"
          @removeMemberFromTask="removeMemberFromTask"
          :member="member"
        />
      </div>
      <div class="btn-container">
        <el-button class="btn badge" icon="el-icon-view"></el-button
        ><!-- v-if logged in member = member assigned to task-->
        <button class="btn badge" v-if="task.comments">
          🗨 {{ task.comments.length }}
        </button>
        <button class="btn badge" @click="openTaskDetails(task.id)">
          Details
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import taskQuickEdit from "./task-quick-edit.vue";
import memberPreview from "./member-preview.vue";
import {eventBus} from '../main.js';


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
    //dispatch or another emit? is this a smart or dumb component?
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
      this.$store.commit({type:'saveCurrGroupId', groupId:this.groupId})
      this.$router.push(`${this.boradId}/task/${taskId}`);
    },
  },
  computed: {
    boradId() {
      return this.$store.getters.getBoardId;
    },
  },
  components: {
    taskQuickEdit,
    memberPreview,
  },
};
</script>