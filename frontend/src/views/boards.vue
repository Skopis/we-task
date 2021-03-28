<template>
    <section v-if="boardsToShow" class="boards">
        <h3 class="page-header">My Boards</h3>
        <section class="board-preview-container">
        <div @click="addBoard" class="board-preview new"><i class="el-icon-plus"></i>Add a new Board</div>
            <div v-for="board in boardsToShow" :key="'B'+board._id">
                <board-preview @click.native.stop="pushBoard(board._id)" :board="board" @archiveBoard="archiveBoard"/>
        </div>
        <div class="board-preview">
            <div>
                <h3>Simple Project Board</h3>
                <h4>4 Groups</h4>
            </div>
            <button class="btn menu" @click.stop.prevent="toggleBoardMenuModal">
                <img src="../assets/icons/3dots.png" alt="" />
            </button>
        </div>
        <div class="board-preview">
            <div>
                <h3>Winnig Death</h3>
                <h4>16 Groups</h4>
            </div>
            <button class="btn menu" @click.stop.prevent="toggleBoardMenuModal">
                <img src="../assets/icons/3dots.png" alt="" />
            </button>
        </div>
        <div class="board-preview">
            <div>
                <h3>Winnig Death</h3>
                <h4>16 Groups</h4>
            </div>
            <button class="btn menu" @click.stop.prevent="toggleBoardMenuModal">
                <img src="../assets/icons/3dots.png" alt="" />
            </button>
        </div>
        </section>
    </section>
</template>

<script>
import boardPreview from "../cmps/board-preview.vue";

export default {
    name: 'boards',
    computed:{
        boardsToShow(){
            return JSON.parse(JSON.stringify(this.$store.getters.getBoards))
        }
    },
    methods:{
        pushBoard(boardId){
            this.$router.push(`board/${boardId}`)
        },
        archiveBoard(boardToArchive){
            this.$store.dispatch({type: 'archiveBoard', board: boardToArchive})
        },
        addBoard(){
            this.$store.dispatch({type: 'addBoard'})
        }
    },
    async created(){
        await this.$store.dispatch({ type: "loadBoards" });
    },
    components: {
        boardPreview,
    },
};
</script>
