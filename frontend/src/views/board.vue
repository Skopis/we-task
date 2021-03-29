<template>
  <div
    class="board"
    v-if="boardToShow"
    :style="boardToShow.style.bgImg? { backgroundImage: 'url(/img/'+boardToShow.style.bgImg+')', backgroundPosition: 'center center', backgroundOrigin: 'content-box', backgroundRepeat: 'no-repeat', 'background-attachment': 'fixed', 'background-size': 'cover'} : {backgroundColor: boardToShow.style.bgColor }"
  >
    <header
      class="board-header flex space-between"
    >
      <div class="flex">
        <h2
          class="btn"
          @click="editBoardTitle"
          v-if="isTitleModalOpen === false"
        >
          {{ boardToShow.title }}
        </h2>
        <form
          @focusout.prevent="saveBoardTitle"
          v-if="isTitleModalOpen"
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
        <div class="avatar-container">
          <div v-for="member in boardToShow.members" :key="member._id">
            <member-avatar2
              :member="member"
              :size="28"
              @click.native="toggleMemberModal(member, $event)"
            />
          </div>
        </div>
        <board-member-modal
          v-if="isMemberModalOpen"
          :member="member"
          :memberModalPos="memberModalPos"
          @removeMemberFromBoard="removeMemberFromBoard"
        />
        <add-board-member
          @addMemberToBoard="addMemberToBoard"
          v-if="isAddMemberModalOpen"
        />
        <h2 class="btn" @click="toggleAddMemberModal">Invite</h2>
      </div>
      <div class="board-menu" :class="{ active: isBoardMenuModalOpen }">
        <board-menu
          v-if="isBoardMenuModalOpen"
          :classSetting="isBoardMenuModalOpen"
          :board="boardToShow"
          @closeModal="closeBoardMenuModal"
          @updateBoardCover="updateBoardCover"
          @searchChanged="searchChanged"
          @setImageAsBg="setImageAsBg"
        />
      </div>
      <div class="flex header-right">
        <h2 class="btn" @click="goToDashboard" v-if="!isBoardMenuModalOpen">
          <img src="../assets/icons/dashboard.png" alt="" /> Dashboard
        </h2>
        <h2
          class="btn"
          @click="toggleBoardMenuModal"
          v-if="!isBoardMenuModalOpen"
        >
          <i class="el-icon-more"></i> Show menu
        </h2>
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
      memberModalPos: null,
    };
  },
  computed: {
    boardToShow() {
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
    setImageAsBg(path){
      this.boardToShow.style.bgImg = path
      this.$store.dispatch({type: 'updateBoard', boardToUpdate: this.boardToShow})
    },
    goToDashboard(){
      this.$router.push(`/board/${this.boardToShow._id}/dashboard`)
    },
    addMemberToBoard(member) {
      this.isAddMemberModalOpen = false;
      this.boardToShow.members.push(member);
      this.updateBoard(this.boardToShow);
    },
    toggleAddMemberModal() {
      this.isMemberModalOpen = false
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
    toggleMemberModal(member, ev) {
       this.isAddMemberModalOpen = false
      const memberIdx = this.boardToShow.members.findIndex(
        (m) => m._id === member._id
      );
      var distance = 80 + memberIdx * 30;
      if (
        (this.isMemberModalOpen && this.member !== member) ||
        !this.isMemberModalOpen
      ) {
        this.isMemberModalOpen = true;
        this.memberModalPos = { left: distance + "px" };
      } else this.isMemberModalOpen = !this.isMemberModalOpen;
      this.member = member;
    },
    searchChanged(txt) {
      this.$store.commit({ type: "setFilterBy", filterBy: txt });
    },
    updatedBoard(boardToUpdate) {
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
      this.boardToShow.style.bgImg = ''
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
    closeBoardMenuModal() {
      this.isBoardMenuModalOpen = false;
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
    async updateTask(taskToUpdate, group, isEdit) {
      const taskForUpdate = await this.$store.dispatch({
        type: "addTask",
        task: taskToUpdate,
        group,
        boardId: this.boardToShow._id,
      });
      if (isEdit) this.addActivity(`Edited task: ${taskToUpdate.title} on group: ${group.title}`, taskForUpdate)
      else this.addActivity(`Added task: ${taskToUpdate.title} to group: ${group.title}`, taskForUpdate)
    },
    async updateGroup(group) {
      await this.$store.dispatch({
        type: "updateGroup",
        group,
        boardId: this.boardToShow._id,
      });
    },
    itemDragged(group = "", taskTxt = "", toGroup = "") {
      const actTxt =
        group !== "" && taskTxt !== ""
          ? `Task: ${taskTxt} moved from the group: ${group.title} to: ${toGroup}`
          : "group moved";
      // console.log(actTxt);
      //TODO: connect to activity log
      this.addActivity(actTxt);
      const board = this.boardToShow;
      board.groups = this.boardToShow.groups;
      this.updateBoard(board);
    },
    addActivity(activityType, task) {
      // console.log('task', task)
      // const { id, title } = this.task;
      var activity = {
        txt: activityType,
        createdAt: Date.now(),
        byMember: this.$store.getters.loggedinUser,
        task: task || { id: 0, title: "" },
      };
      this.$store.dispatch({ type: "addActivity", activity });
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
    setMenuPos(groupId, ev) {
      var left = this.getEvPos(ev)
      // console.log('new',ev.view.innerWidth - left)
      // console.log('groupId', groupId)
      const groupIdx = this.boardToShow.groups.findIndex(
        (group) => group.id === groupId
      );
      this.menuPos = { right:ev.view.innerWidth - left +'px'};
    },
    getEvPos(ev) {
      // var pos = {
      //   x: ev.offsetX,
      //   y: ev.offsetY,
      // }
      ev.preventDefault();
      // pos = {
      //    x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      //   y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
      // }
      // console.log('client',ev.target.clientRight )
      // console.log('page', ev.pageX)
      return ev.pageX;
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
