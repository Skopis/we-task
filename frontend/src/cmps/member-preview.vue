//member-preview

<template>
    <section class="member-preview">
        <img :src="member.imgUrl" alt="member-img">
        <p>{{member.fullname}}</p>
        <p>@{{member.fullname.toLowerCase(member)}}</p>
        <button @click="removeMemberFromCard">Remove from Card</button>
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
        removeMemberFromCard(member){
            this.$emit('removeMemberFromCard', member)
        }
    }
}
</script>

