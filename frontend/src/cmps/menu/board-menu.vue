<template>
    <section class="board-menu">
        <button class="btn" @click="toggleColorPicker">Cover</button>
    <color-picker :board="board" @changeBoardCover="updateBoardCover"  v-if="isColorPickerOpen"/>
    <button class="btn" @click="toggleSearch">Search</button>
    <input  v-if="isSearchOpen" type="text"  class="member-search"  placeholder="search"  v-model="filterBy"  @change="searchTextChanged" />
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
  props: ["board"],
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

