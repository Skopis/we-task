<template>
  <div
    class="board"
    v-if="boardToShow"
    :style="{ backgroundColor: boardToShow.style.bgColor }"
  >
    <header
      class="board-header flex space-between"
      :style="{ backgroundColor: boardToShow.style.bgColor }"
    >
      <div class="flex">
        <h2 @click="editBoardTitle" v-show="isTitleModalOpen === false">
          {{ boardToShow.title }}
        </h2>
        <form
          @focusout.prevent="saveBoardTitle"
          v-show="isTitleModalOpen"
          @submit.prevent.stop="saveBoardTitle"
        >
          <input
            autofocus
            ref="titleChange"
            type="text"
            placeholder="Board Title"
            v-model="boardToShow.title"
          />
        </form>
        <member-avatar :members="boardToShow.members" :size="28" />
      </div>
      <div class="flex row-reverse align-center">
        <button class="btn" @click="toggleBoardMenuModal">
          <img src="../assets/icons/3dots.png" alt="" />
        </button>
        <board-menu
          v-if="isBoardMenuModalOpen"
          :board="boardToShow"
          @updateBoardCover="updateBoardCover"
        />
      </div>
    </header>
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
          <group-list
            :group="group"
            @itemDragged="itemDragged"
            @updateTask="updateTask"
            @updateGroup="updateGroup"
            @archiveGroup="archiveGroup"
            @openModal="setMenuPos"
            @toggleGroupMenuModal="toggleGroupMenuModal"
            @removeMemberFromTask="removeMemberFromTask"
          />
          <group-menu
            :group="group"
            :menuPos="menuPos"
            v-if="group.id === menuGroupId"
            @archiveGroup="archiveGroup"
            @updateGroupCover="updateGroupCover"
            @closeMenu="closeMenu"
          />
        </div>
        <!-- </section> -->
      </draggable>
      <button class="btn new-group" @click="addGroup">
        <span class="big-plus">＋</span> Add a new list
      </button>
    </section>
    <router-view />
    <button class="bfb" @click.stop="sendUpdatedBoard">
      aaaaaaaaaaaaaaaaa
    </button>
  </div>
</template>

// :v-if="setMenuPos" @archiveGroup="archiveGroup" @updateGroupCover="updateGroupCover"

<script>
import { socketService } from "@/services/socket.service";
import groupList from "../cmps/group-list.vue";
import draggable from "vuedraggable";
import boardMenu from "../cmps/menu/board-menu.vue";
import groupMenu from "../cmps/menu/group-menu";
import memberAvatar from "../cmps/task-details/member-avatar.cmp.vue";

export default {
  name: "board",
  data() {
    return {
      isTitleModalOpen: false,
      isBoardMenuModalOpen: false,
      menuPos: null,
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
    socketService.setup();
    socketService.emit("board id", this.boardToShow._id);
    socketService.on("updated board", this.updateBoard);
  },
  destroyed() {
    {
      socketService.off("updated board", this.updateBoard);
      socketService.terminate();
    }
  },
  //socketService.emit('board change', this.msg) //on board change(will send)
  methods: {
    updateBoard(boardToUpdate) {
      console.log(boardToUpdate);
      console.log("getting the changes");
      this.$store.emit({
        type: "updateBoard",
        boardIdx: 0,
        board: boardToUpdate,
      });
    },
    // sendUpdatedBoard() {
    //   console.log("Sending", this.boardToShow);
    //   socketService.emit("board change", this.boardToShow);
    // },
    removeMemberFromTask(member, task, group) {
      var memberIdx = task.members.findIndex((m) => m._id === member._id);
      task.members.splice(memberIdx, 1);
      this.updateTask(task, group);
    },
    closeMenu() {
      this.menuGroupId = null;
    },
    toggleGroupMenuModal(groupId) {
      if (groupId === this.menuGroupId) {
        this.menuGroupId = null;
      } else {
        this.menuGroupId = groupId;
      }
    },
    updateGroupCover(color, group) {
      group.style.bgColor = color;
      this.updateGroup(group);
    },
    updateBoardCover(color) {
      this.boardToShow.style.bgColor = color;
      this.$store.dispatch({
        type: "updateBoard",
        boardToUpdate: this.boardToShow,
      });
    },
    toggleBoardMenuModal() {
      //TODO:
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
      setTimeout(() => {
        this.$refs.titleChange.focus();
      }, 300);
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
      await this.$store.dispatch({
        type: "updateGroup",
        group,
        boardId: this.boardToShow._id,
      });
    },
    itemDragged() {
      const board = this.boardToShow;
      board.groups = this.boardToShow.groups;
      // console.log(board.groups);
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
      // console.log('groupId', groupId)
      const groupIdx = this.boardToShow.groups.findIndex(
        (group) => group.id === groupId
      );
      // console.log('groupIdx', groupIdx)
      var amount = 276 * (groupIdx + 1) - 12;
      if (groupIdx < 1) {
        amount -= 12;
      }
      this.menuPos = { left: amount + "px" };
      // console.log(this.menuPos);
    },
  },
  components: {
    groupList,
    draggable,
    boardMenu,
    groupMenu,
    memberAvatar,
  },
};
</script>
