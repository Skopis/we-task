<template>
  <div class="group-list" :style="{'backgroundColor': group.style.bgColor}">
    <div class="flex space-between align-center">
    <h3 @click="editGroupTitle" v-if="isTitleModalOpen===false">{{ group.title }}</h3>
    <form @submit.prevent="saveGroupTitle" v-if="isTitleModalOpen">
      <input type="text" placeholder="Group Title" v-model="group.title">
      <button>Save</button>
    </form>
    <button class="btn" @click="toggleGroupMenuModal"><img src="../assets/icons/3dots.png" alt=""></button>
    <group-menu v-if="isGroupMenuModalOpen" :group="group" @archiveGroup="archiveGroup" @updateGroupCover="updateGroupCover"/>
    </div>
    <task-quick-edit v-if="isAddModalOpen" @updateTask="updateTask" />
    <draggable
      tag="ul"
      v-bind="dragOptions"
      :list="group1.tasks"
      @start="dragOn"
      @end="dragOff"
      :move="moveCheck"
    >
      <li v-for="task in group.tasks" :key="'C' + task.id">
        <task-preview :task="task" @updateTask="updateTask" :groupId="group.id" />
      </li>
      <button class="btn" @click="openAddModal">Add a new Task</button>
    </draggable>
  </div>
</template>

<script>
// import taskDetails from "./task-details/task-details.vue";
import taskPreview from "./task-preview.vue";
import TaskQuickEdit from "./task-quick-edit.vue";
import draggable from "vuedraggable";
import groupMenu from './menu/group-menu'

export default {
  name: "group-list",
  props: ["group"],
  data() {
    return {
      isTitleModalOpen: false,
      isAddModalOpen: false,
      isGroupMenuModalOpen: false,
      group1: this.group,
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 500,
        group: "tasks",
        disabled: false,
        ghostClass: "ghost",
        chosenClass: "chosen-move",
        dragClass: "chosen-drag",
        // disabled: "disableDraggable",
      };
    },
  },
  methods: {
    archiveGroup(groupToArchive){
      this.isGroupMenuModalOpen = false
      this.$emit('archiveGroup', groupToArchive)
    },
    toggleGroupMenuModal(){
      this.isGroupMenuModalOpen = !this.isGroupMenuModalOpen
    },
    saveGroupTitle(){
      this.isTitleModalOpen = false
      this.updateGroup()
    },
    editGroupTitle(){
      this.isTitleModalOpen = true
    },
    moveCheck() {
      this.$emit("changedPlaces", this.group1);
    },
    dragOff(ev) {
      // console.log("Off");
      // console.log(ev);
      // console.log(this.tasks);
    },
    dragOn(ev) {
      // console.log("On");
      // console.log(ev);
    },
    checkMove: function (evt) {
      console.log(evt.draggedContext.element);
    },
    openAddModal() {
      this.isAddModalOpen = true;
    },
    updateGroup(){
      console.log('this.group at group-list 81', this.group)
      this.$emit('updateGroup', this.group)
    },
    updateTask(taskToUpdate) {
      // need to check if this changes the board
      this.isAddModalOpen = false;
      this.$emit("updateTask", taskToUpdate, this.group);
    },
    updateGroupCover(color){
      var group=JSON.parse(JSON.stringify(this.group)) 
      group.style.bgColor = color
      this.$emit('updateGroup', group)
    }
  },
  components: {
    taskPreview,
    TaskQuickEdit,
    draggable,
    groupMenu
  },
};
</script>