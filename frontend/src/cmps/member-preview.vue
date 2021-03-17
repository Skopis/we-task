//member-preview

<template>
    <section class="member-preview">
        <img :src="member.imgUrl" alt="member-img">
        <p>{{member.fullname}}</p>
        <p>@{{member.fullname.toLowerCase(member)}}</p>
        <button @click="removeMemberFromTask">Remove from Task</button>
    </section>
</template>

<script>

export default{
    name: 'member-preview',
    props: ['member'],
    data() {
        return{

        } 
    },
    methods:{
        removeMemberFromTask(member){
            this.$emit('removeMemberFromTask', member)
        }
    }
}
</script>

