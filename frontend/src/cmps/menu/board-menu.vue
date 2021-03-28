<template>
    <section class="board-menu-content" :class="{ active: isBoardMenuModalOpen}">
    <header class="menu-modal-header">
        <p>Menu</p>
        <button class="btn" @click="closeModal"><i class="el-icon-close"></i></button>
    </header>
    <button class="btn" @click="toggleBgPicker"><img src="../../assets/icons/bg.png" alt=""> Cover</button>
    <div class="flex bg-btn-container">
      <button class="btn" @click="toggleColorPicker" v-if="isBgPickerOpen">Color</button>
      <button class="btn" @click="toggleBgImagePicker" v-if="isBgPickerOpen">Image</button>
    </div>
    <color-picker :board="board" @changeBoardCover="updateBoardCover" v-if="isColorPickerOpen"/>
    <bg-image v-if="isBgImagepickerOpen" @setImageAsBg="setImageAsBg"/>
    <div class="search-input" v-if="isSearchOpen">
        <input  type="text"  class="member-search"  placeholder="What are you looking for?"  v-model="filterBy"  @change="searchTextChanged" />
        <button class="btn" @click="toggleSearch"><i class="el-icon-close"></i></button>
    </div>
    <button v-else class="btn" @click="toggleSearch"><i class="el-icon-search"></i>Search</button>
    <h3 class="module-header">
      <i class="el-icon-s-order"></i>Activity
    </h3>
    <div v-if="(this.board.activities && this.board.activities.length)">
        <div v-for="activity in activities" :key="activity.id">
            <task-activities :activity="activity" :type="activity.txt" />
        </div>
    </div>   
    </section>
</template>
  
<script >
import colorPicker from "./color-picker.vue";import taskActivities from '../task-details/task-activities.cmp';
import bgImage from './bg-image.vue'

export default {
  name: "board-menu",
  props: ["board", "isBoardMenuModalOpen"],
  data() {
    return {
      isColorPickerOpen: false,
      isSearchOpen: false,
      filterBy:'',
      isBgImagepickerOpen: false,
      isBgPickerOpen: false
    };
  },
  created(){
      this.filterBy = this.$store.state.filterBy;
  },
  methods: {
    toggleBgPicker(){
      this.isBgPickerOpen = !this.isBgPickerOpen
      if (this.isBgImagepickerOpen) this.isBgImagepickerOpen = false
      if (this.isColorPickerOpen) this.isColorPickerOpen = false
    },
    setImageAsBg(path){
      this.$emit('setImageAsBg', path)
    },
    toggleBgImagePicker(){
      this.isBgImagepickerOpen = !this.isBgImagepickerOpen
      this.isColorPickerOpen = false
    },
    toggleColorPicker() {
      this.isColorPickerOpen = !this.isColorPickerOpen;
      this.isBgImagepickerOpen = false;
      this.isSearchOpen = false;
    },
    toggleSearch() {
      this.isSearchOpen = !this.isSearchOpen;
      this.isColorPickerOpen = false;
    },
    updateBoardCover(color) {
      this.$emit("updateBoardCover", color);
    },
    searchTextChanged() {
      this.$emit("searchChanged", this.filterBy);
    },
    closeModal(){
        this.$emit('closeModal')
    }
  },
    computed:{
        activities(){
          return this.board.activities.sort(function(a, b){
            return b.createdAt-a.createdAt
          })
        }
    },
    components:{
        colorPicker,
        taskActivities,
        bgImage
    }
}
</script>

