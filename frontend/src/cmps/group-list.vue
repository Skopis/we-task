<template>
  <div class="group-list">
    <h5>{{ group.title }}</h5>
    <task-quick-edit v-if="isAddModalOpen" @updateTask="updateTask" />
    <draggable
      tag="ul"
      v-bind="dragOptions"
      :list="groupToShow.tasks"
      @start="dragOn"
      @end="dragOff"
      :move="checkMove"
    > <!-- double group-list 2 -->
      <!-- <task-quick-edit
        v-if="isEditModalOpen"
        @updateTask="updateTask"
        :task="task"
      /> -->
      <li v-for="task in groupToShow.tasks" :key="'C' + task.id">
        <task-preview :task="task" @updateTask="updateTask" />
      </li>
      <button class="btn" @click="openAddModal">Add a new Task</button>
    </draggable>
  </div>
</template>

<script>
import taskDetails from "./task-details.vue";
import taskPreview from "./task-preview.vue";
import TaskQuickEdit from "./task-quick-edit.vue";
import draggable from "vuedraggable";

export default {
  name: "group-list",
  props: ["group"],
  data() {
    return {
      groupToShow: null,
      isAddModalOpen: false,
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
      };
    },
  },
  created() {
    this.groupToShow = this.group;
  },
  methods: {
    dragOff(ev) {
      console.log("Off");
      console.log(ev);
    },
    dragOn(ev) {
      console.log("On");
      console.log(ev);
    },
    checkMove: function (evt) {
      //return evt.draggedContext.element.name !== "apple";
      // console.log(evt.draggedContext.element);
    },
    openAddModal() {
      this.isAddModalOpen = true;
    },
    updateTask(taskToUpdate) {
      // need to check if this changes the board
      this.isAddModalOpen = false;
      this.$store.dispatch({
        type: "addTask",
        task: taskToUpdate,
        group: this.groupToShow,
      });
    },
  },
  components: {
    taskDetails,
    taskPreview,
    TaskQuickEdit,
    draggable,
  },
};
</script>