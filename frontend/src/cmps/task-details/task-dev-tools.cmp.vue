<template>
  <div class="task-side-bar">
  <h4>ADD TO CART</h4>
    <div class="dev-tools">
      <button  class="btn"><i class="el-icon-user"></i> Members</button>
      <button class="btn"><i class="el-icon-collection-tag"></i> Labels</button>
      <button class="btn" @click="addChecklist"><i class="el-icon-finished"></i> Checklist</button>
      <button class="btn"><i class="el-icon-date"></i> Due Date</button>
      <button class="btn"><i class="el-icon-paperclip"></i> Attachment</button>
      <button class="btn"><i class="el-icon-brush"></i> Cover</button>
    </div>
  </div>
</template>

<script>
export default {

    methods:{
        addChecklist(){
            this.$emit('checkList')
        }
    }
};
</script>

<style>
</style>