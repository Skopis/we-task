<template>
    <section>
        <p>{{board._id}}</p>
        <p>{{board.title}}</p>
    </section>
</template>

<script>
export default{
    name: 'board-preview',
    props: ['board']
}
</script>
