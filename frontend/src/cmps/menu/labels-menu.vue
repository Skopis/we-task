<template>
  <div class="task-lable-menu">
    <header>
      <p>Labels</p>
      <button class="btn close" @click="closeModal"><i class="el-icon-close"></i></button>
    </header>
    <div v-for="label in labels" :key="label.id" class="label-container">
      <div class="label" :class="label.color"  @click="addLabel(label)"><p>{{ label.title }}</p></div>
      <button class="btn" ><i class="el-icon-edit"></i></button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    addLabel(label) {
      // console.log(labelId)
      this.$emit("setLabel", label);
    },
    closeModal(){
      this.$emit('closeLabelMenu', 'false')
    }
  },
  computed:{
    labels() {
      return this.$store.getters.getBoardLabels;
    },
  },
};
</script>

<style>
</style>