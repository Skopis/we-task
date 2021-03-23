<template>
    <section class="archive">
        <h3>Archive</h3>
        <section v-if="archive">
            <div v-for="item in archive" :key="item.id || item._id" class="archive-item">
                <button class="btn">Restore</button>
                <button class="btn">Remove Permanently</button>
                <!-- <p>{{item}}</p> -->
                <p>Title: {{item.title}}</p>
                <p v-if="item.createdBy">Created By: {{item.createdBy.fullname}}</p>
                <p v-if="item.createdAt">Created At: {{formattedTime(item.createdAt)}}</p>
            </div>
        </section>
    </section>
</template>

<script>

export default{
    name: 'archive',
    computed:{
        archive(){
            return this.$store.getters.getArchive
        },
    },
    methods:{
        formattedTime(timeStamp){
            return moment(timeStamp).fromNow()
        }
    },
    async created(){
        await this.$store.dispatch({ type: 'loadArchive'})
    }
}
</script>