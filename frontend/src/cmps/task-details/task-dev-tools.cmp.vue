<template>
  <div class="task-side-bar">
    <h3>ADD TO CARD</h3>
    <div class="dev-tools">
      <button class="btn" @click="openMembersMenu">
        <i class="el-icon-user"></i>
        <p>Members</p>
      </button>
      <button class="btn" @click="openLabelModal">
        <i class="el-icon-collection-tag"></i>
        <p>Labels</p>
      </button>
      <button class="btn" @click="toggleCheckListTitleModal">
        <i class="el-icon-finished"></i>
        <p>Checklist</p>
      </button>
      <div class="checklist-title-modal" v-if="checklistTitleModal">
        <div class="checklist-modal-header"><p>Add checklist</p></div>
        <form @submit.prevent="startNewChecklist">
          <input
            class="new-todo-input new-checklist-title"
            type="text"
            placeholder="Title for CheckList"
            v-model="checklistTitle"
          />
          <button class="btn">Save</button>
        </form>
      </div>
      <button class="btn" @click="toggleDateModal">
        <i class="el-icon-date"></i>
        <p>Due Date</p>
      </button>
      <date-picker
        v-if="isDateModalOpen"
        :style="task.style.imgUrl ? { marginTop: 140 + 'px' } : {}"
        @updateDueDate="updateDueDate"
        @toggleDateModal="toggleDateModal"
      />
      <button class="btn" @click="toggleAttachmentModal">
        <i class="el-icon-paperclip"></i>
        <p>Attachment</p>
      </button>
      <button class="btn" @click="toggleColorPicker">
        <i class="el-icon-brush"></i>
        <p>Cover</p>
      </button>
      <color-picker
        @changeTaskCover="updateTaskCover"
        v-if="isColorPickerOpen"
      />
      <h3>Actions</h3>
      <button class="btn delete" @click="removeTask">
        <i class="el-icon-delete"></i>
        <p>Delete</p>
      </button>
    </div>
  </div>
</template>

<script>
import DatePicker from "./date-picker.vue";
import colorPicker from "../menu/color-picker.vue";
import Swal from "sweetalert2";

export default {
  props: ["colorPicker", "checklistModal", "task"],
  data() {
    return {
      isColorPickerOpen: this.colorPicker,
      checklistTitleModal: this.checklistModal,
      checklistTitle: "",
      isDateModalOpen: false,
    };
  },
  methods: {
    updateDueDate(date){
      this.$emit('updateDueDate', date)
    },
    toggleAttachmentModal() {
      this.$emit("toggleAttachmentModal");
    },
    openMembersMenu() {
      this.$emit("openMembersMenu", true);
    },
    toggleDateModal(status) {
      if(status===false) this.isDateModalOpen = false
      else this.isDateModalOpen = !this.isDateModalOpen;
    },
    toggleColorPicker() {
      if (!this.isColorPickerOpen) {
        this.checklistTitleModal = false;
        this.$emit("claseAllModals");
        this.isColorPickerOpen = true;
      } else this.isColorPickerOpen = false;
    },
    updateTaskCover(color) {
      this.$emit("updateTaskCover", color);
    },
    toggleCheckListTitleModal() {
      if (!this.checklistTitleModal) {
        this.isColorPickerOpen = false;
        this.$emit("closeAllModals");
        this.checklistTitleModal = true;
      } else this.checklistTitleModal = false;
    },
    startNewChecklist() {
      if (!this.checklistTitle) this.checklistTitle = "Checklist";
      this.$emit("checkList", this.checklistTitle);
      this.checklistTitleModal = false;
    },
    removeTask() {
      Swal.fire({
        title: "Are you sure?",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, keep it",
      }).then((result) => {
        if (result.value) {
          this.$emit("removeTask");
          Swal.fire("Deleted!", "Task has been deleted.");
          this.$router.go(-1);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled");
          return;
        }
      });
    },
    openLabelModal() {
      this.$emit("openLabelModal", "true");
    },
  },
  components: {
    colorPicker,
    DatePicker,
  },
};
</script>

<style>
</style>