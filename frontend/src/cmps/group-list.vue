<template>
  <div
    class="group-list"
    v-if="group"
    :style="{ backgroundColor: group.style.bgColor }"
  >
    <div class="preview-header">
      <h4 @click="editGroupTitle" v-if="isTitleModalOpen === false">
        {{ group.title }}
      </h4>
      <form
        @submit.prevent="saveGroupTitle"
        @focusout.prevent="saveGroupTitle"
        v-if="isTitleModalOpen"
      >
        <input
          type="text"
          ref="groupTitle"
          placeholder="Group Title"
          v-model="group.title"
          autofocus
        />
        <!-- <button>Save</button> -->
      </form>
      <button class="btn" @click="toggleGroupMenuModal($event)">
        <img src="../assets/icons/3dots.png" alt="" />
      </button>
    </div>
    <div class="preview-content">
      <ul>
        <draggable
          @end="itemDragged"
          animation="500"
          ghostClass="ghost"
          dragClass="chosen-drag"
          group="task"
          v-model="group.tasks"
          handle="li"
        >
          <li v-for="task in group.tasks" :key="'C' + task.id">
            <task-preview
              :task="task"
              @updateTask="updateTask"
              @toggleMemberModal="toggleMemberPreview"
              :groupId="group.id"
              :style="computedStyle(task)"
            />
          </li>
        </draggable>
      </ul>
      <task-quick-edit
        v-if="isAddModalOpen"
        @updateTask="updateTask"
        @stopEdit="stopEdit"
      />
    </div>
    <footer>
      <button class="btn add-task" @click="openAddModal(-1)">
        <i class="el-icon-plus"></i>Add another card
      </button>
    </footer>
    <member-preview
      v-if="isMemberModalOpen && member"
      @removeMemberFromTask="removeMemberFromTask"
      :member="member"
    />
  </div>
</template>

<script>
// import taskDetails from "./task-details/task-details.vue";
import memberPreview from "./task-member-modal.vue";
import taskPreview from "./task-preview.vue";
import TaskQuickEdit from "./task-quick-edit.vue";
import draggable from "vuedraggable";
import { eventBus } from "../services/event-bus.service.js";

export default {
  name: "group-list",
  props: ["group"],
  data() {
    return {
      isTitleModalOpen: false,
      isAddModalOpen: false,
      group1: this.group,
      isMemberModalOpen: false,
      member: null,
      task: null,
    };
  },
  computed: {},
  created() {
    eventBus.$on("addCard", this.openAddModal);
  },
  destroyed() {
    eventBus.$off("addCard", this.openAddModal);
  },
  methods: {
    computedStyle(task) {
      if (task.style.imgUrl)
        return {
          background: "url(" + task.style.imgUrl + ")",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          "min-height": "120px",
          "background-position": "center",
        };
      else return { backgroundColor: task.style.bgColor };
    },
    toggleMemberPreview(member, status, task) {
      this.isMemberModalOpen = status;
      this.member = member;
      this.task = task;
    },
    removeMemberFromTask(member) {
      this.$emit("removeMemberFromTask", member, this.task, this.group);
      this.isMemberModalOpen = false;
    },
    archiveGroup(groupToArchive) {
      this.isGroupMenuModalOpen = false;
      this.$emit("archiveGroup", groupToArchive);
    },
    toggleGroupMenuModal(ev) {
      // this.getEvPos(ev);
      this.isGroupMenuModalOpen = !this.isGroupMenuModalOpen;
      this.$emit("toggleGroupMenuModal", this.group.id);
      this.$emit("openModal", this.group.id, ev);
    },
    saveGroupTitle() {
      this.isTitleModalOpen = false;
      this.updateGroup();
    },
    editGroupTitle() {
      this.isTitleModalOpen = true;
      setTimeout(() => {
        this.$refs.groupTitle.focus();
      }, 300);
    },
    itemDragged(ev) {
      this.$emit("itemDragged", this.group);
    },
    openAddModal(groupId = -1) {
      if (groupId === this.group.id || groupId == -1) {
        this.isAddModalOpen = true;
      }
    },
    updateGroup() {
      this.$emit("updateGroup", this.group);
    },
    updateTask({ taskToUpdate }) {
      this.isAddModalOpen = false;
      // if (!isEdit) { //TODO: remove to reAdd
      //   setTimeout(() => {
      //     this.isAddModalOpen = true;
      //   }, 300);
      // }
      if (taskToUpdate.title != "") {
        this.$emit("updateTask", taskToUpdate, this.group);
      }
    },
    stopEdit() {
      this.isAddModalOpen = false;
    },
  },
  components: {
    taskPreview,
    TaskQuickEdit,
    draggable,
    memberPreview,
  },
};
</script>