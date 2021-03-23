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
      <member-avatar2
        class="avatar"
        v-else
        :member="comment.byMember"
        :size="32"
      >
      </member-avatar2>
      <h3>{{ comment.byMember.fullname }}</h3>
      <p>{{ formattedTime(comment.createdAt) }}</p>
    </div>
    <input v-if="isCommentToEdit" v-model="editComment.txt" />
    <p v-else class="comment-txt">{{ editComment.txt }}</p>
    <button class="btn" @click="reply">Reply</button>
    <!-- <button class="btn" @click="saveComment">Save</button> -->
  </div>
</template>
<button class="btn" @click="openEditModal">edit</button>

<script>
import memberAvatar2 from './member-avatar2.vue';
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
    reply(){
      this.$emit('reply', this. comment.byMember.fullname)
    }
  },
  created() {
    this.editComment = JSON.parse(JSON.stringify(this.comment));
  },
  components: {
    memberAvatar2,
  },
};
</script>