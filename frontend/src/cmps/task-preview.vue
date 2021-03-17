<template>
  <section class="task-preview">
    <p>{{ task.title }}</p>

    <button class="btn" @click="openEditModal">✎</button>
    <task-quick-edit
      v-if="isEditModalOpen"
      @updateTask="updateTask"
      :task="task"
    />

    <div v-for="member in task.members" :key="member._id" :v-if="task.members">
      <img :src="member.imgUrl" alt="member-img" @click="openMemberModal" />
      <member-preview
        v-if="isMemberModalOpen"
        @removeMemberFromTask="removeMemberFromTask"
        :member="member"
      />
    </div>
    <div class="btn-container">
      <button>👁</button
      ><!-- v-if logged in member = member assigned to task-->
      <button v-if="task.comments">🗨 {{ task.comments.length }}</button>
    </div>
    

    <button @click="openTaskDetails(task.id)">Details</button>
  </section>
</template>

<script>
import taskQuickEdit from "./task-quick-edit.vue";
import memberPreview from "./member-preview.vue";

export default {
  name: "task-preview",
  props: ["task"],
  data() {
    return {
      isEditModalOpen: false,
      isMemberModalOpen: false,
      // task: {
      //         "id": "c104",
      //         "title": "Help me",
      //         "description": "description",
      //         "comments": [
      //             {
      //                 "id": "ZdPnm",
      //                 "txt": "also @yaronb please CR this",
      //                 "createdAt": 1590999817436.0,
      //                 "byMember": {
      //                     "_id": "u101",
      //                     "fullname": "Tal Tarablus",
      //                     "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
      //                 }
      //             }
      //         ]
      // }
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
    updateTask(taskToSave) {
      console.log("taskToSave", taskToSave);
      this.isEditModalOpen = false;
      this.$store.dispatch({ type: "addTask", task: taskToSave });
    },
    removeMemberFromTask(member) {},
    openTaskDetails(taskId) {
      console.log("id:", taskId);
      this.$router.push(`board/task/${taskId}`);
    },
  },
  components: {
    taskQuickEdit,
    memberPreview,
  },
};
</script>
