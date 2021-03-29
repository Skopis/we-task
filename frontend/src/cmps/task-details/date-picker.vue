<template>
  <div class=" date-picker">
    <!-- <span class="demonstration"></span> -->
    <el-date-picker
      @change="changeDate"
      v-model="value"
      type="date"
      placeholder="Due Date">
    </el-date-picker>
  </div>
</template>

<script>
  export default {
    name:'date-picker',
    data() {
      return {
        value: '',
        pickerOptions: {
          disabledDate(time) {
            return Date.now();
          },
        },
      };
    },
    methods:{
      changeDate(){
        // console.log('value', this.value)
        this.$emit('toggleDateModal', false)
        this.$emit('updateDueDate', this.value)
      }
    },
  };
</script>