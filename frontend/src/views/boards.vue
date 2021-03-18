//displays all boards, will need a board preview maybe?
//v-for routerlink to the /boards/board+id ==> board.vue

<template>
    <board-preview />
</template>


<script>
import boardPreview from "../cmps/board-preview.vue";
export default {
    data() {
        return {};
    },
    components: {
        boardPreview,
    },
};
</script>
