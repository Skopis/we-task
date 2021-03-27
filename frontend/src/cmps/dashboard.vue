<template>
    <section class="dashboard">
        <h1>Hi Dashboard</h1>
    </section>
</template>

<script >

export default {
    name: 'dashboard',
    created(){
        const boardId = this.$route.params.boardId;
    }
}
</script>