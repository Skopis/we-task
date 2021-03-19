<template>
    <section class="archive">
        Hi Archive
        <div v-for="item in archive" :key="item.id || item._id">
            <p>{{item}}</p>
        </div>
    </section>
</template>

<script>

export default{
    name: 'archive',
    computed:{
        archive(){
            console.log('this.$store.getters.getArchive', this.$store.getters.getArchive)
            return this.$store.getters.getArchive
        }
    },
    async created(){
        await this.$store.dispatch({ type: 'loadArchive'})
    }
}
</script>