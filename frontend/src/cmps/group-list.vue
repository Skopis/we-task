<template>
  <draggable
    tag="ul"
    class="group-list"
    v-bind="dragOptions"
    :list="groupToShow.tasks"
  >
    <li v-for="task in groupToShow.tasks" :key="'C' + task.id">
      <task-preview :task="task" />
      <!-- <router-link :to="'/task/'+task._id"></router-link> -->
    </li>
  </draggable>
</template>

<script>
import taskDetails from "./task-details.vue";
import taskPreview from "./task-preview.vue";
import draggable from "vuedraggable";

export default {
  name: "group-list",
  props: ["group"],
  data() {
    return {
      groupToShow: null,
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },
  created() {
    this.groupToShow = this.group;
  },
  methods: {},
  components: {
    taskDetails,
    taskPreview,
    draggable,
  },
};
</script>