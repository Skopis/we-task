<template>
  <div class="task-activity" v-if="activity && activity.byMember">
    <img v-if="activity.byMember.imgUrl" :src="activity.byMember.imgUrl" class="avatar" />
    <div class="txt">
      <p>
        <member-avatar2  :member="activity.byMember" :size="32"/>
        <span v-if="activity.byMember">{{ activity.byMember.fullname }}</span>  {{ activity.txt }}
      </p>
      <p>{{ formattedTime(activity.createdAt) }}</p>
    </div>
  </div>
</template>

<script>
import memberAvatar2 from './member-avatar2.vue'
export default {
  props: ["activity", "type"],
  created(){
      // console.log(this.activity)
  },
  methods:{
    formattedTime(timeStamp){
      return moment(timeStamp).fromNow()
    }
  },
  components:{
    memberAvatar2
  }
};
</script>

<style>
</style>