<template>
    <section class="group-menu">
        <button class="btn" @click="archiveGroup">Archive</button>
    </section>
</template>

<script>
export default{
    name: 'group-menu',
    props:['group'],
    methods:{
        archiveGroup(){
            console.log('hi archive group')
            this.$emit('archiveGroup', this.group)
        }
    }
}
</script>