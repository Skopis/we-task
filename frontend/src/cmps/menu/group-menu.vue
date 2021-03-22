<template>
  <section class="group-menu" :style="menuPos">
    <div class="group-menu-header">
      <h4>List actions</h4>
<<<<<<< HEAD
      <button @click="closeMenu" class="btn big-plus">X</button>
=======
      <button @click="closeMenu" class="btn"><i class="el-icon-close"></i></button>
>>>>>>> 4964fb5239c977dfb2f0bf1e6b325b03d929bbcf
    </div>
    <button class="btn" @click="archiveGroup">Archive</button>
    <button class="btn" @click="toggleColorPicker">Cover</button>
    <color-picker
      :group="group"
      @changeGroupCover="updateGroupCover"
      v-if="isColorPickerOpen"
    />
  </section>
</template>

<script>
import colorPicker from "./color-picker.vue";

export default {
  name: "group-menu",
  props: ["group", "menuPos"],
  data() {
    return {
      isColorPickerOpen: false,
    };
  },
  methods: {
    toggleColorPicker() {
      this.isColorPickerOpen = !this.isColorPickerOpen;
    },
    archiveGroup() {
      this.$emit("archiveGroup", this.group);
    },
    updateGroupCover(color) {
      this.$emit("updateGroupCover", color, this.group);
    },
    closeMenu() {
      this.$emit("closeMenu");
    },
  },
  created() {},
  components: {
    colorPicker,
  },
};
</script>