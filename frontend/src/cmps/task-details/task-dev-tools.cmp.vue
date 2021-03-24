<template>
  <div class="task-side-bar">
  <h3>ADD TO CARD</h3>
    <div class="dev-tools">
      <button  class="btn" @click="openMembersMenu"><i class="el-icon-user"></i><p> Members</p></button>
      <button class="btn" @click="openLabelModal"><i class="el-icon-collection-tag"></i><p> Labels</p></button>
      <button class="btn" @click="openCheckListTitleModal"><i class="el-icon-finished"></i><p> Checklist</p></button>
      <div class="checklist-title-modal" v-if="checklistTitleModal">
      <div class="checklist-modal-header"> <p></p>Add checklist
        <button class="btn close" @click="closeTitleModal"><i class="el-icon-close"></i></button>
      </div>
      <form @submit.prevent="startNewChecklist">
         <input class="new-todo-input new-checklist-title" type="text" placeholder="Title for CheckList" v-model="checklistTitle" />
       <button class="btn">Save</button>
      </form>
      </div>
      <button class="btn" @click="openDateModal"><i class="el-icon-date"></i><p> Due Date</p></button>
      <button class="btn"><i class="el-icon-paperclip"></i><p> Attachment</p></button>
      <button class="btn" @click="toggleColorPicker"><i class="el-icon-brush"></i><p> Cover</p></button>
      <color-picker @changeTaskCover="updateTaskCover" v-if="isColorPickerOpen"/>
      <button class="btn delete" @click="removeTask"><i class="el-icon-delete"></i><p> Delete</p></button>
    </div>
  </div>
</template>

<script>
import colorPicker from '../menu/color-picker.vue'
export default {
  props:[],
    data(){
        return{
            isColorPickerOpen: false,
            checklistTitleModal:false,
            checklistTitle :'',
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
        openCheckListTitleModal(){
          this.checklistTitleModal = true;
        },
        closeTitleModal(){
          this.checklistTitleModal = false;
        },
        startNewChecklist(){
          if(!this.checklistTitle) this.checklistTitle = 'Checklist'
          this.$emit('checkList', this.checklistTitle )
          this.checklistTitleModal = false;
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