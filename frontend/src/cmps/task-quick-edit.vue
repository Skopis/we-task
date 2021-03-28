<template>
  <section class="task-edit">
    <form>
      <input
        ref="taskTxt"
        placeholder=""
        v-model="taskToEdit.title"
        @click.stop=""
        @focusout.prevent="stopEdit"
        @keydown.enter.exact.prevent="updateTask"
        autofocus
      />
      <!-- <button class="btn save" >Save</button> -->
    </form>
  </section>
</template>

<script>
//task edit on task list task preview
export default {
  name: "task-quick-edit",
  props: ["task"],
  data() {
    return {
      taskToEdit: null,
      isEdit: true,
    };
  },
  created() {
    if (!this.task) {
      this.taskToEdit = {
        id: "",
        title: "",
        style: {
          bgColor: "#ffff",
        },
        members: [],
        comments: [],
        labels: []
      };
      this.isEdit = false;
    } else {
      this.taskToEdit = this.task;
      this.isEdit = true;
    }
    setTimeout(() => {
      this.$refs.taskTxt.focus();
    }, 300);
  },
  methods: {
    updateTask() {
      this.taskToEdit.byUser = this.$store.getters.loggedinUser;
      const sendData = {
          taskToUpdate:JSON.parse(JSON.stringify(this.taskToEdit)),
          isEdit : this.isEdit
      }
      this.$emit("updateTask",sendData)//JSON.parse(JSON.stringify(this.taskToEdit)),this.isEdit);
    },
    stopEdit() {
      this.$emit("stopEdit");
    },
  },
};
</script>
