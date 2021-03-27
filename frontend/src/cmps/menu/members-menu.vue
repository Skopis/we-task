<template>
    <div class="members-menu">
        <div class="members-header">
            <p>Members</p>
        </div>
        <input class="member-search" type="text" placeholder="Search members">
        <h4>Board Members</h4>
        <div class="member-line" v-for="member in board.members" :key="member._id" @click="addMemberToTask(member)">
            <member-avatar2 :member="member" :size="32"/>
            <p>{{member.fullname}} ({{member.fullname.toLowerCase().replace(/\s/g, '')}})</p>
        </div>
    </div>
</template>

<script>
import memberAvatar2 from "../task-details/member-avatar2.vue"


export default {
    name: 'members-menu',
    data(){
        return {
            board: null
        }
    },
    methods:{
        addMemberToTask(member){
            this.$emit('addMemberToTask', member)
        },
        closeMenu(){
            this.$emit('closeMembersMenu', false)
        }
    },
    created(){
        this.board = this.$store.getters.getBoard
        // console.log('this.board', this.board)
    },
    components: {
        memberAvatar2
    }
}
</script>