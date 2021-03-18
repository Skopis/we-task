<template>
  <div class="task-activity">
    <img :src="activity.byMember.imgUrl" class="avatar" />
    <div class="txt">
      <p>
        <span>{{ activity.byMember.fullname }}</span>  {{ activity.txt }}
      </p>
      <p>{{ moment( 1616057204201) }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["activity"],
  created(){
      console.log(this.activity)
  }
};
</script>

<style>
</style>