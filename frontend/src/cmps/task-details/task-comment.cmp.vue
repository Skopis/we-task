<template>
  <div class="task-comment">
    <div class="comment-creator" v-if="comment.byMember">
      <img class="avatar" :src="comment.byMember.imgUrl" alt="" />
      <h3>{{ comment.byMember.fullname }}</h3>
      <p>{{ comment.createdAt }}</p>
    </div>
    <input v-if="isCommentToEdit" v-model="newComment.txt" />
    <p v-else class="comment-txt">{{ comment.txt }}</p>
    <button class="btn">delete</button>
    <button class="btn" @click="saveComment">Save</button>
    <button class="btn" @click="openEditModal">edit</button>
  </div>
</template>

<script>
export default {
  props: ["comment"],
  data() {
    return {
      isCommentToEdit: false,
      newComment:null
    };
  },
  methods: {
    openEditModal() {
      this.isCommentToEdit = true;
    },
    saveComment() {
      this.$emit("saveComment", this.newComment);
       this.isCommentToEdit = false;
    },
  },
  created(){
    this.newComment = JSON.parse(JSON.stringify(this.comment))
  }
};
</script>

<style>
</style>