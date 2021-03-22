<template>
    <section class="board-preview-menu">
        <button class="btn" @click.stop="archiveBoard">Archive</button>
    </section>
</template>

<script>
export default{
    name: 'board-preview-menu',
    props:['board'],
    methods:{
        archiveBoard(){
            this.$emit('archiveBoard', this.board)
        }
    }
}
</script>