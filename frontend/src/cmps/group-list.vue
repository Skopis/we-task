<template>
  <div class="group-list">
    <h5>{{ group.title }}</h5>
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

export default {
  name: "group-list",
  props: ["group"],
  data() {
    return {
      isAddModalOpen: false,
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
    updateTask(taskToUpdate) {
      // need to check if this changes the board
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