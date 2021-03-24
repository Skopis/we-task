<template>
  <div class="task-activity" v-if="activity && activity.byMember">
    <div class="activity-creator">
      <img
        v-if="activity.byMember.imgUrl"
        :src="activity.byMember.imgUrl"
        class="avatar"
      />
      <member-avatar2 :member="activity.byMember" :size="32" />
    </div>
    <div class="activity-info">
      <p v-if="activity.byMember">
        {{ activity.byMember.fullname }}<span>{{ activity.txt }}</span>
      </p>
      <p class="activity-date">{{ formattedTime(activity.createdAt) }}</p>
    </div>
  </div>
</template>

<script>
import memberAvatar2 from "./member-avatar2.vue";
export default {
  props: ["activity", "type"],
  created() {
    // console.log(this.activity)
  },
  methods: {
    formattedTime(timeStamp) {
      return moment(timeStamp).fromNow();
    },
  },
  methods:{
    formattedTime(timeStamp){
      console.log('timeStamp', timeStamp)
      return moment(timeStamp).fromNow()
    }
  },
  components: {
    memberAvatar2,
  }
};
</script>

<style>
</style>