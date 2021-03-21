<template>
  <div class="task-lable-menu">
    <header>
      <p>Labels</p>
      <button class="btn close" @click="closeModal"><i class="el-icon-close"></i></button>
    </header>
    <div v-for="label in labels" :key="label.id" class="label-container">
      <div class="label" :class="label.color"  @click="addLabel(label)">{{ label.title }}</div>
      <button class="btn" ><i class="el-icon-edit"></i></button>
    </div>
  </div>
</template>
 <div class="label green" @click="addLabel('green')">klafb <button>X</button></div>
    <div class="label yellow" @click="addLabel('yellow')" >klafb <button>X</button></div>
    <div class="label orange" @click="addLabel('orange')"> <button>X</button></div>
    <div class="label red" @click="addLabel('red')">klafb <button>X</button></div>
    <div class="label purple" @click="addLabel('purple')"><button>X</button></div>
    <div class="label blue" @click="addLabel('blue')"><button>X</button></div>
  </div>

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