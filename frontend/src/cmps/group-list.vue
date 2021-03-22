<template>
  <div class="group-list" :style="{ backgroundColor: group.style.bgColor }">
    <div class="preview-header">
      <h4 @click="editGroupTitle" v-if="isTitleModalOpen === false">
        {{ group.title }}
      </h4>
      <form @submit.prevent="saveGroupTitle" v-if="isTitleModalOpen">
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
      <task-quick-edit v-if="isAddModalOpen" @updateTask="updateTask" />
      <ul>
        <draggable
          @end="itemDragged"
          animation="500"
          group="task"
          ghostClass="ghost"
          dragClass="chosen-drag"
          v-model="group.tasks"
          handle="li"
        >
          <li v-for="task in group.tasks" :key="'C' + task.id">
            <task-preview
              :task="task"
              @updateTask="updateTask"
              :groupId="group.id"
              :style="{ backgroundColor: task.style.bgColor }"
            />
          </li>
          <footer>
            <button class="btn add-task" @click="openAddModal">
              <span class="big-plus">＋</span> Add another card
            </button>
          </footer>
        </draggable>
      </ul>
    </div>
  </div>
</template>

<script>
// import taskDetails from "./task-details/task-details.vue";
import taskPreview from "./task-preview.vue";
import TaskQuickEdit from "./task-quick-edit.vue";
import draggable from "vuedraggable";

export default {
  name: "group-list",
  props: ["group"],
  data() {
    return {
      isTitleModalOpen: false,
      isAddModalOpen: false,
      group1: this.group,
    };
  },
  methods: {
    archiveGroup(groupToArchive) {
      this.isGroupMenuModalOpen = false;
      this.$emit("archiveGroup", groupToArchive);
    },
    toggleGroupMenuModal(ev) {
      this.isGroupMenuModalOpen = !this.isGroupMenuModalOpen;
      this.$emit("toggleGroupMenuModal", this.group.id);
      this.$emit("openModal", this.group.id);
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
    openAddModal() {
      this.isAddModalOpen = true;
    },
    updateGroup() {
      this.$emit("updateGroup", this.group);
    },
    updateTask(taskToUpdate) {
      this.isAddModalOpen = false;
      this.$emit("updateTask", taskToUpdate, this.group);
    },
  },
  components: {
    taskPreview,
    TaskQuickEdit,
    draggable,
  },
};
</script>