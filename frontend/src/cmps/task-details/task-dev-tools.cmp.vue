<template>
  <div class="task-side-bar">
  <h4>ADD TO TASK</h4>
    <div class="dev-tools">
      <button  class="btn" @click="openMembersMenu"><i class="el-icon-user"></i> Members</button>
      <button class="btn" @click="openLabelModal"><i class="el-icon-collection-tag"></i> Labels</button>
      <button class="btn" @click="addChecklist"><i class="el-icon-finished"></i> Checklist</button>
      <button class="btn" @click="openDateModal"><i class="el-icon-date"></i> Due Date</button>
      <button class="btn"><i class="el-icon-paperclip"></i> Attachment</button>
      <button class="btn" @click="toggleColorPicker"><i class="el-icon-brush"></i> Cover</button>
      <color-picker @changeTaskCover="updateTaskCover" v-if="isColorPickerOpen"/>
      <button class="btn delete" @click="removeTask"><i class="el-icon-delete"></i> Delete</button>
    </div>
  </div>
</template>

<script>
import colorPicker from '../menu/color-picker.vue'
export default {
    data(){
        return{
            isColorPickerOpen: false
        }
    },
    methods:{
      openMembersMenu(){
        this.$emit('openMembersMenu', true)
      },
      openDateModal(){
        this.$emit('openDateModal', true)
      },
        toggleColorPicker(){
            this.isColorPickerOpen = !this.isColorPickerOpen
        },
        updateTaskCover(color){
            this.$emit('updateTaskCover', color)
        },
        addChecklist(){
            this.$emit('checkList')
        },
        removeTask(){
          this.$router.go(-1)
          this.$emit('removeTask')
        },
        openLabelModal(){
          this.$emit('openLabelModal', 'true')
        }
    },
    components:{
      colorPicker
    }
};
</script>

<style>
</style>