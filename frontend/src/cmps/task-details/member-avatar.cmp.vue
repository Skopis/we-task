<template>
  <div class="avatar-container" v-if="members && members.length">
    <div v-for="member in members" :key="member._id">
      <img v-if="member.imgUrl" class="avatar" :src="member.imgUrl" alt="" :style="{height:size+'px', width:size+'px'}" />
      <avatar
        class="avatar"
        v-else
        :username="member.fullname"
        :size="size"
        :background-color='userColor(member)'
      ></avatar>
    </div>
  </div>
</template>

<script>
import Avatar from "vue-avatar";

export default {
  props: ['members', 'size'],
  methods:{
    userColor(member){
      if(member.fullname === 'Nofar Gabso') return '#009688'
      else if(member.fullname === 'Lian Skopis') return '#5243aa'
      else if(member.fullname === 'Shachar Dorfzaun') return '#607d8b'
      else if(member.fullname === 'Itay Azulay') return '#ff9800'
    }
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