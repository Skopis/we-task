<template>
  <div class="task-activity">
    <img :src="activity.byMember.imgUrl" class="avatar" />
    <div class="txt">
      <p>
        <span v-if="activity.byMember">{{ activity.byMember.fullname }}</span>  {{ activity.txt }}
      </p>
      <p>{{ formattedTime(activity.createdAt) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["activity"],
  created(){
      console.log(this.activity)
  },
  methods:{
    formattedTime(timeStamp){
      return moment(timeStamp).fromNow()
    }
  }
};
</script>

<style>
</style>