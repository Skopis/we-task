<template>
    <section v-if="boardsToShow">
        <div v-for="board in boardsToShow" :key="'B'+board._id">
            <router-link :to="'board/'+board._id"><board-preview :board="board"/></router-link> 
        </div>
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
    async created(){
        await this.$store.dispatch({ type: "loadBoards" });
    },
    components: {
        boardPreview,
    },
};
</script>
