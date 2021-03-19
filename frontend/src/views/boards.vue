<template>
    <section v-if="boardsToShow">
        <h3>My Boards</h3>
        <button @click="addBoard" class="btn">Add a new Board</button>
        <section class="board-preview-container">
            <div v-for="board in boardsToShow" :key="'B'+board._id">
                <board-preview @click.native.self.stop="pushBoard(board._id)" :board="board" @archiveBoard="archiveBoard"/>
                <!-- <router-link :to="'board/'+board._id"></router-link>  -->
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
