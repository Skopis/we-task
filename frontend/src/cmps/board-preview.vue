<template>
    <section class="board-preview">
        <div >
            <p>{{board._id}}</p>
            <p>{{board.title}}</p>
        </div>
    </section>
</template>

<script>
export default{
    name: 'board-preview',
    props: ['board']
}
</script>
