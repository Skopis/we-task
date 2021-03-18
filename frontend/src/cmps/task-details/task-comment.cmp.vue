<template>
  <div class="task-comment">
  <div class="comment-creator">
    <img class="avatar" :src="comment.byMember.imgUrl" alt="" />
    <h3>{{ comment.byMember.fullname }}</h3>
    <p>{{ comment.createdAt }}</p>
  </div>
    <p class="comment-txt">{{ comment.txt }}</p>
    <button class="btn">delete</button>
    <button class="btn">edit</button>
  </div>
</template>

<script>
export default {
  props:['comment']
};
</script>

<style>
</style>