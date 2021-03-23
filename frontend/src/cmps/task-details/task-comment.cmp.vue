<template>
  <div class="task-comment">
    <div class="comment-info">
      <div class="comment-creator" v-if="comment.byMember">
        <img
          v-if="comment.byMember.imgUrl"
          class="avatar"
          :src="comment.byMember.imgUrl"
          alt=""
          :style="{ height: 32 + 'px', width: 32 + 'px' }"
        />
        <member-avatar2
          class="avatar"
          v-else
          :member="comment.byMember"
          :size="32"
        >
        </member-avatar2>

        <h3 class="comment-creator">{{ comment.byMember.fullname }}</h3>
        <p class="comment-date">{{ formattedTime(comment.createdAt) }}</p>
      </div>
    </div>
    <p class="comment-txt">{{ editComment.txt }}</p>
    <button class="btn">Reply</button>
  </div>
</template>
<button class="btn" @click="openEditModal">edit</button>

<script>
import memberAvatar2 from "./member-avatar2.vue";
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
    memberAvatar2,
  },
};
</script>

<style>
</style>