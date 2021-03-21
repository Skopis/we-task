<template>
  <div class="task-comment">
    <div class="comment-creator" v-if="comment.byMember">
      <img
        v-if="comment.byMember.imgUrl"
        class="avatar"
        :src="comment.byMember.imgUrl"
        alt=""
        :style="{ height: 30 + 'px', width: 30 + 'px' }"
      />
      <avatar
        class="avatar"
        v-else
        :username="comment.byMember.fullname"
        :size="30"
      ></avatar>
      <h3>{{ comment.byMember.fullname }}</h3>
      <p>{{ formattedTime(comment.createdAt) }}</p>
    </div>
    <input v-if="isCommentToEdit" v-model="editComment.txt" />
    <p v-else class="comment-txt">{{ editComment.txt }}</p>
    <button class="btn">Reply</button>
    <button class="btn" @click="saveComment">Save</button>
  </div>
</template>
     <button class="btn" @click="openEditModal">edit</button>

<script>
import memberAvatar from "./member-avatar.cmp";
export default {
  props: ["comment"],
  data() {
    return {
      isCommentToEdit: false,
      editComment: null,
    };
  },
  methods: {
    formattedTime(timeStamp) {
      return moment(timeStamp).fromNow();
    },
    openEditModal() {
      this.isCommentToEdit = true;
    },
    saveComment() {
      this.$emit("saveComment", this.editComment);
      this.isCommentToEdit = false;
    },
  },
  created() {
    this.editComment = JSON.parse(JSON.stringify(this.comment));
  },
  components: {
    memberAvatar,
  },
};
</script>

<style>
</style>