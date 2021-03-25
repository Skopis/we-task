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
        <div v-for="member in boardToShow.members" :key="member._id">
          <member-avatar2
            :member="member"
            :size="28"
            @click.native="toggleMemberModal(member)"
          />
        </div>
        <board-member-modal
          v-if="isMemberModalOpen"
          :member="member"
          @removeMemberFromBoard="removeMemberFromBoard"
        />
        <button class="btn" @click="toggleAddMemberModal">Invite</button>
        <add-board-member
          @addMemberToBoard="addMemberToBoard"
          v-if="isAddMemberModalOpen"
        />
      </div>
      <div class="board-menu" :class="{ active: isBoardMenuModalOpen}">
        <button class="btn  btn-menu-modal" @click="toggleBoardMenuModal" v-if="!isBoardMenuModalOpen">
          <img src="../assets/icons/3dots.png" alt="" />
        </button>
        <board-menu
          v-if="isBoardMenuModalOpen"
          :classSetting="isBoardMenuModalOpen"
          :board="boardToShow"
          @closeModal="closeBoardMenuModal"
          @updateBoardCover="updateBoardCover"
          @searchChanged="searchChanged"
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
        dragClass="chosen-drag"
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
        <span><i class="el-icon-plus"></i></span> Add a new list
      </button>
    </section>
    <router-view />
  </div>
</template>

<script>
import { socketService } from "@/services/socket.service";
import groupList from "../cmps/group-list.vue";
import draggable from "vuedraggable";
import boardMenu from "../cmps/menu/board-menu.vue";
import groupMenu from "../cmps/menu/group-menu";
import memberAvatar2 from "../cmps/task-details/member-avatar2.vue";
import boardMemberModal from "../cmps/board-member-modal.vue";
import AddBoardMember from "../cmps/add-board-member.vue";

export default {
  name: "board",
  data() {
    return {
      isTitleModalOpen: false,
      isBoardMenuModalOpen: false,
      menuPos: null,
      menuGroupId: null,
      isMemberModalOpen: false,
      isAddMemberModalOpen: false,
    };
  },
  computed: {
    boardToShow() {
      //return JSON.parse(JSON.stringify(this.$store.getters.getBoard));
      const fillteredBoard = JSON.parse(
        JSON.stringify(this.$store.getters.getBoard)
      );

      return fillteredBoard;
    },
  },
  async created() {
    const boardId = this.$route.params.boardId;
    if (boardId != "b")
      await this.$store.dispatch({ type: "loadBoard", boardId });
    else {
      await this.$store.dispatch({ type: "loadBoard" });
      const boardId = this.$store.getters.getBoard._id;
      this.$router.push(`/board/${boardId}`);
    }
    socketService.setup();
    socketService.emit("board id", this.boardToShow._id);
    socketService.on("updated board", this.updatedBoard);
  },
  destroyed() {
    {
      socketService.off("updated board", this.updatedBoard);
      socketService.terminate();
    }
  },
  methods: {
    addMemberToBoard(member) {
      this.isAddMemberModalOpen = false;
      this.boardToShow.members.push(member);
      this.updateBoard(this.boardToShow);
    },
    toggleAddMemberModal() {
      this.isAddMemberModalOpen = !this.isAddMemberModalOpen;
    },
    removeMemberFromBoard(member) {
      const memberIdx = this.boardToShow.members.findIndex(
        (m) => m._id === member._id
      );
      this.boardToShow.members.splice(memberIdx, 1);
      this.updateBoard(this.boardToShow);
      this.isMemberModalOpen = false;
    },
    toggleMemberModal(member) {
      this.member = member;
      this.isMemberModalOpen = !this.isMemberModalOpen;
    },
    searchChanged(txt) {
      this.$store.commit({ type: "setFilterBy", filterBy: txt });
    },
    updatedBoard(boardToUpdate) {
      console.log("got board");
      this.$store.commit({
        type: "updateBoard",
        boardIdx: 0,
        board: boardToUpdate,
      });
    },
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
    closeBoardMenuModal(){
      this.isBoardMenuModalOpen=false
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
      console.log('groupIdx', groupIdx)
      var amount = 285 * (groupIdx + 1);
      if (!groupIdx) {
        amount -= 10;
      }
      console.log('amount',amount)
      this.menuPos = { left:amount + "px" };
      // console.log(this.menuPos);
    },
  },
  components: {
    groupList,
    draggable,
    boardMenu,
    groupMenu,
    memberAvatar2,
    AddBoardMember,
    boardMemberModal,
  },
};
</script>
