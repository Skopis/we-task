<template>
  <section class="group-menu" :style="menuPos">
    <div class="group-menu-header">
      <h4>List actions</h4>
      <button @click="closeMenu" class="btn close-menu"><i class="el-icon-close"></i></button>
    </div>
    <ul>
    <li class="btn" @click="archiveGroup">Delete</li>
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
import Swal from 'sweetalert2'
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
      Swal.fire({
        title: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, keep it'
      }).then((result) => {
            if (result.value) {
              this.$emit("archiveGroup", this.group);
              Swal.fire(
                'Deleted!',
                'Group has been deleted.',
                'success'
              )
            }
            else if (result.dismiss === Swal.DismissReason.cancel) {
              Swal.fire(
                'Cancelled'
              )
            return
            }
      })
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