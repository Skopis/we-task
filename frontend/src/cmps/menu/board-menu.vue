<template>
    <section class="board-menu-content" :class="{ active: isBoardMenuModalOpen}">
    <header class="menu-modal-header">
        <p>Menu</p>
        <button class="btn" @click="closeModal"><i class="el-icon-close"></i></button>
    </header>
    <button class="btn" @click="toggleColorPicker">Cover</button>
    
    <color-picker :board="board" @changeBoardCover="updateBoardCover"  v-if="isColorPickerOpen"/>
    <div class="search-input" v-if="isSearchOpen">
        <input  type="text"  class="member-search"  placeholder="What are you looking for?"  v-model="filterBy"  @change="searchTextChanged" />
        <button class="btn" @click="toggleSearch"><i class="el-icon-close"></i></button>
    </div>
    <button v-else class="btn" @click="toggleSearch">Search</button>
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

export default {
  name: "board-menu",
  props: ["board", "isBoardMenuModalOpen"],
  data() {
    return {
      isColorPickerOpen: false,
      isSearchOpen: false,
      filterBy:'',
    };
  },
  created(){
      this.filterBy = this.$store.state.filterBy;
  },
  methods: {
    toggleColorPicker() {
      this.isColorPickerOpen = !this.isColorPickerOpen;
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
        taskActivities
    }
}
</script>

