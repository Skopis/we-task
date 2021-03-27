<template>
  <div class="avatar-container">
    <div v-for="member in members" :key="member._id">
      <img v-if="member.imgUrl" class="avatar" :src="member.imgUrl" alt="" :style="{height:size+'px', width:size+'px'}" />
      <avatar
        class="avatar"
        v-else
        :username="member.fullname"
        :size="size"
        :color="userColor"
        
      ></avatar>
    </div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";

export default {
  props: ['members', 'size'],
  computed: {
    fullname() {
      return this.member.fullname;
    },
    userColor(){
      if(this.member.fullname === 'Nofar Gabso') return 'rgb(0, 150, 136)'
    }
  },
  created(){
    // console.log(this.members)
  },
  components: {
    Avatar,
  },
};
</script>

<style>
</style>