<template>
  <section class="group-menu" :style="menuPos">
    <div class="group-menu-header">
      <h4>List actions</h4>
      <button @click="closeMenu" class="btn close-menu"><i class="el-icon-close"></i></button>
    </div>
    <ul>
    <li class="btn" @click="archiveGroup">Archive</li>
    <li class="btn" @click="toggleColorPicker">Cover</li>
    <li class="btn" @click="addCard">Add card</li>
    <color-picker
      :group="group"
      @changeGroupCover="updateGroupCover"
      v-if="isColorPickerOpen"
    />
    </ul>
  </section>
</template>

<script>
import colorPicker from "./color-picker.vue";
import {
    eventBus
} from '../../services/event-bus.service.js';

export default {
  name: "group-menu",
  props: ["group", "menuPos"],
  data() {
    return {
      isColorPickerOpen: false,
    };
  },
  methods: {
    addCard(){
      eventBus.$emit("addCard",this.group.id);
      this.closeMenu();
    },
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