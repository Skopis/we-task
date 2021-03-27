//member-preview

<template>
    <section class="member-preview" :style="memberModalPos">
        <div class="member-preview-main">
            <img v-if="member.imgUrl" :src="member.imgUrl" alt="member-img">
            <member-avatar2 :v-if="member" :member="member" :size="40" />
            <div>
                <p>{{member.fullname}}</p>
                <p>@{{member.fullname.toLowerCase().replace(/\s/g, '')}}</p>
            </div>
        </div>
        <button class="btn add-task" @click="removeMemberFromBoard">Remove from Board</button>
    </section>
</template>

<script>
import memberAvatar2 from './task-details/member-avatar2.vue'
export default{
    name: 'board-member-preview',
    props: ['member', 'memberModalPos'],
    methods:{
        removeMemberFromBoard(){
            this.$emit('removeMemberFromBoard', this.member)
        }
    },
    components:{
        memberAvatar2
    }
}
</script>