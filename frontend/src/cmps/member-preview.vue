//member-preview

<template>
    <section class="member-preview">
        <div class="member-preview-main">
            <img v-if="member.imgUrl" :src="member.imgUrl" alt="member-img">
            <member-avatar2 :v-if="member" :member="member" :size="40" />
            <div>
                <p>{{member.fullname}}</p>
                <p>@{{member.fullname.toLowerCase().replace(/\s/g, '')}}</p>
            </div>
        </div>
        <button class="btn" @click="removeMemberFromTask">Remove from Task</button>
    </section>
</template>

<script>
import memberAvatar2 from './task-details/member-avatar2.vue'
export default{
    name: 'member-preview',
    props: ['member'],
    data() {
        return{

        } 
    },
    methods:{
        removeMemberFromTask(){
            this.$emit('removeMemberFromTask', this.member)
        }
    },
    components:{
        memberAvatar2
    }
}
</script>

