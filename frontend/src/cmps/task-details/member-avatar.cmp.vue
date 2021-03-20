<template>
  <div >
    <div v-for="member in members" :key="member._id">
      <img v-if="member.imgUrl" class="avatar" :src="member.imgUrl" alt="" />
      <avatar
        class="avatar"
        v-else
        :username="member.fullname"
        :size="size"
      ></avatar>
    </div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";

export default {
  props: {
    members: {
      type: Array,
    },
    size: {
      type: Number,
    },
  },
  computed: {
    fullname() {
      return this.member.fullname;
    },
  },
  components: {
    Avatar,
  },
};
</script>

<style>
</style>