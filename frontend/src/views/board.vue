<template>
  <div
    class="board"
    v-if="boardToShow"
    :style="{ backgroundColor: boardToShow.style.bgColor }"
  >
    <h2 @click="editBoardTitle" v-if="isTitleModalOpen === false">
      {{ boardToShow.title }}
    </h2>
    <form @submit.prevent="saveBoardTitle" v-if="isTitleModalOpen">
      <input
        type="text"
        placeholder="Board Title"
        v-model="boardToShow.title"
      />
      <button>Save</button>
    </form>
    <button class="btn" @click="toggleBoardMenuModal">
      <img src="../assets/icons/3dots.png" alt="" />
    </button>
    <board-menu
      v-if="isBoardMenuModalOpen"
      :board="boardToShow"
      @updateBoardCover="updateBoardCover"
    />
    <!-- <section class="task-list-container"> -->
      <section class="main-board-container">
    <draggable
      v-model="boardToShow.groups"
      @end="itemDragged"
      animation="500"
      ghostClass="ghost"
      class="task-list-container"
      handle=".group-list"
    >
      <div v-for="group in boardToShow.groups" :key="'L' + group.id">
<<<<<<< HEAD
        <group-list
          :group="group"
          @itemDragged="itemDragged"
          @updateTask="updateTask"
          @updateGroup="updateGroup"
          @archiveGroup="archiveGroup"
          @openModal="setMenuPos"
          @toggleGroupMenuModal="toggleGroupMenuModal"
        />
        <group-menu
          :group="group"
          :menuPos="menuPos"
          v-if="group.id === menuGroupId && isGroupMenuModalOpen"
          @archiveGroup="archiveGroup"
          @updateGroupCover="updateGroupCover"
        />
=======
        <group-list :group="group" @itemDragged="itemDragged" @updateTask="updateTask" @updateGroup="updateGroup" @archiveGroup="archiveGroup" @openModal="setMenuPos" @toggleGroupMenuModal="toggleGroupMenuModal" />
        <group-menu :group="group" :menuPos="menuPos" v-if="group.id === menuGroupId && isGroupMenuModalOpen" @archiveGroup="archiveGroup"   @updateGroupCover="updateGroupCover" />
>>>>>>> ced4812db4aa05dc8da93a14b52a2c077c05c7a1
      </div>
      <!-- </section> -->
    </draggable>
      <button class="btn" @click="addGroup">Add a New Group</button>
      </section>
    <router-view />
  </div>
</template>

:v-if="setMenuPos" @archiveGroup="archiveGroup" @updateGroupCover="updateGroupCover"

<script>
import groupList from "../cmps/group-list.vue";
import draggable from "vuedraggable";
import boardMenu from "../cmps/menu/board-menu.vue";
import groupMenu from "../cmps/menu/group-menu";

export default {
  name: "board",
  data() {
    return {
      isTitleModalOpen: false,
      isBoardMenuModalOpen: false,
      menuPos: null,
      isGroupMenuModalOpen: false,
      menuGroupId: null,
    };
  },
  computed: {
    boardToShow() {
      return JSON.parse(JSON.stringify(this.$store.getters.getBoard));
    },
  },

  async created() {
    const boardId = this.$route.params.boardId;
    await this.$store.dispatch({ type: "loadBoard", boardId });
  },
  methods: {
    toggleGroupMenuModal(isGroupMenuModalOpen, groupId) {
      this.isGroupMenuModalOpen = isGroupMenuModalOpen;
      if (!isGroupMenuModalOpen) this.menuGroupId = null;
      else this.menuGroupId = groupId;
    },
    updateGroupCover(color, group) {
      group.style.bgColor = color;
      this.updateGroup(group);
    },
    updateBoardCover(color) {
      console.log("this.boardToShow before", this.boardToShow);
      this.boardToShow.style.bgColor = color;
      console.log("this.boardToShow after", this.boardToShow);
      this.$store.dispatch({
        type: "updateBoard",
        boardToUpdate: this.boardToShow,
      });
    },
    toggleBoardMenuModal() {
      this.isBoardMenuModalOpen = !this.isBoardMenuModalOpen;
    },
    archiveGroup(groupToArchive) {
      this.$store.dispatch({
        type: "archiveGroup",
        group: groupToArchive,
        boardId: this.boardToShow._id,
      });
    },
    addGroup() {
      this.$store.dispatch({ type: "addGroup", boardId: this.boardToShow._id });
    },
    editBoardTitle() {
      this.isTitleModalOpen = true;
    },
    saveBoardTitle() {
      this.isTitleModalOpen = false;
      this.$store.dispatch({
        type: "updateBoard",
        boardToUpdate: this.boardToShow,
      });
    },
    async updateTask(taskToUpdate, group) {
      await this.$store.dispatch({
        type: "addTask",
        task: taskToUpdate,
        group,
        boardId: this.boardToShow._id,
      });
    },
    async updateGroup(group) {
      console.log("group at board 55", group);
      await this.$store.dispatch({
        type: "updateGroup",
        group,
        boardId: this.boardToShow._id,
      });
    },
    itemDragged() {
      const board = this.boardToShow;
      board.groups = this.boardToShow.groups;
      console.log(board.groups);
      this.updateBoard(board);
    },
    updateBoard(board) {
      this.$store.dispatch({
        type: "updateBoard",
        boardToUpdate: board,
      });
    },
    saveBoard() {
      this.$store.dispatch({ type: "setBoard", board: this.boardToShow });
    },
    setMenuPos(groupId) {
      const groupIdx = this.boardToShow.groups.findIndex(
        (group) => group.id === groupId
      );
      var amount = 276 * (groupIdx + 1) - 12;
      if (groupIdx < 1) {
        amount -= 12;
      }
      this.menuPos = { left: amount + "px" };
      console.log(this.menuPos)
      
    },
  },
  components: {
    groupList,
    draggable,
    boardMenu,
    groupMenu,
  },
};
</script>
