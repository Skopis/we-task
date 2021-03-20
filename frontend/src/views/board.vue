<template>
  <div class="board" v-if="boardToShow">

<h2 @click="editBoardTitle" v-if="isTitleModalOpen===false">{{ boardToShow.title }}</h2>
    <form @submit.prevent="saveBoardTitle" v-if="isTitleModalOpen">
      <input type="text" placeholder="Board Title" v-model="boardToShow.title">
      <button>Save</button>
    </form>

    <!-- <section class="task-list-container"> -->
    <draggable
      tag="section"
      v-bind="dragOptions"
      :list="boardToShow.groups"
      @start="dragOn"
      @end="dragOff"
      class="task-list-container"
    >
      <div v-for="group in boardToShow.groups" :key="'L' + group.id">
        <group-list :group="group" @updateTask="updateTask" @updateGroup="updateGroup" @archiveGroup="archiveGroup" @openModal="setMenuPos"/>
        <group-menu  :group="group" :menuPos="menuPos" v-if="setMenuPos" @archiveGroup="archiveGroup" @updateGroupCover="updateGroupCover" />
      </div>
      <!-- </section> -->
      <button class="btn" @click="addGroup">Add a New Group</button>
    </draggable>
    <router-view  />
    <pre>
    {{ boardToShow.groups }}
    </pre>
  </div>
</template>

<script>
import groupList from "../cmps/group-list.vue";
import draggable from "vuedraggable";
import groupMenu from "../cmps/menu/group-menu";


export default {
  name: "board",
  data(){
    return{
      isTitleModalOpen: false,
      menuPos:null,
    }
  },
  computed: {
    boardToShow(){
      return JSON.parse(JSON.stringify(this.$store.getters.getBoard))
    },
    dragOptions() {
      return {
        animation: 500,
        group: "group",
        disabled: false,
        ghostClass: "ghost",
      };
    },
  },

  async created() {
    const boardId= this.$route.params.boardId
    await this.$store.dispatch({ type: "loadBoard", boardId });
  },
  methods: {
    archiveGroup(groupToArchive){
      this.$store.dispatch({type: 'archiveGroup', group: groupToArchive, boardId: this.boardToShow._id})
    },
    addGroup(){
      this.$store.dispatch({type: 'addGroup', boardId: this.boardToShow._id})
    },
    editBoardTitle(){
      this.isTitleModalOpen = true
    },
    saveBoardTitle(){
      this.isTitleModalOpen = false
      this.$store.dispatch({type:'updateBoard', boardToUpdate: this.boardToShow})
    },
    async updateTask(taskToUpdate, group){
      await this.$store.dispatch({
        type: "addTask", task: taskToUpdate, group, boardId: this.boardToShow._id
      });
    },
    async updateGroup(group){
      console.log('group at board 55', group)
      await this.$store.dispatch({ type: "updateGroup", group, boardId: this.boardToShow._id});
    },
    dragOff(ev) {
      console.log("Off");
      console.log(ev);
    },
    dragOn(ev) {
      console.log("On");
      console.log(ev);
    },
    updateBoard(){
      this.$em
    },
    saveBoard() {
      this.$store.dispatch({ type: "setBoard", board: this.boardToShow });
    },
    setMenuPos(groupId, isGroupMenuModalOpen){
      const groupIdx = this.boardToShow.groups.findIndex(group => group.id === groupId)
        var amount = 276*(groupIdx+1)-12
      if(groupIdx  < 1){
        amount -=12
      }
      this.menuPos = {left:amount+'px'}
     return isGroupMenuModalOpen
    }
  },
  components: {
    groupList,
    draggable,
    groupMenu,

  },
};
</script>
