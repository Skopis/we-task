<template>
  <div class="task-lable-menu">
    <header>
      <p>Labels</p>
    </header>
    <div
      v-for="(label, index) in labels"
      :key="label.id"
      class="label-container"
    >
      <div class="label" :class="label.color" @click="addLabel(label)">
        <p v-if="editIdx !== index">{{ label.title }}</p>
        <input
          v-else
          type="text"
          :value="label.title"
          @click.prevent.stop=""
          @focusout.prevent="closeEditLabel"
          @keydown.enter.exact.prevent="updateLabel(label.id,$event)"
        />
      </div>
      <button class="btn" @click="editLabel(index)">
        <i class="el-icon-edit"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editIdx: -1,
    };
  },
  methods: {
    addLabel(label) {
      console.log(label.id);
      console.log(label);
      this.$emit("setLabel", label);
    },
    closeModal() {
      this.$emit("closeLabelMenu", "false");
    },
    editLabel(idx) {
      if (this.editIdx === idx) {
        this.editIdx = -1;
      } else {
        this.editIdx = idx;
      }
    },
    closeEditLabel() {
      this.editIdx = -1;
    },
    updateLabel(labelId,ev){
      const labelData = {
        labelId,
        txt:ev.srcElement.value
      }
      this.editIdx = -1;
      this.$emit("updateLabel",labelData)
    },
  },
  computed: {
    labels() {
      return this.$store.getters.getBoardLabels;
    },
  },
};
</script>

<style>
</style>