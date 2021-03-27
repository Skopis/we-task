<template>
    <section class="add-member-preview">
        <h4>Invite a member to Board</h4>
        <div class="member-preview-main" v-for="member in membersToShow" :key="member._id">
            <img v-if="member.imgUrl" :src="member.imgUrl" alt="member-img">
            <member-avatar2 :v-if="member" :member="member" :size="40" @click.native="addMemberToBoard(member)"/>
            <div>
                <p>{{member.fullname}}</p>
                <p>@{{member.fullname.toLowerCase().replace(/\s/g, '')}}</p>
            </div>
        </div>
        <!-- <button class="btn" @click="addMemberToBoard">Add to Board</button> -->
    </section>
</template>

<script>
import memberAvatar2 from './task-details/member-avatar2.vue'
export default{
    name: 'add-board-member',
    // props: ['member'],
    date(){
        return{
            allMembers: [],
            boardMembers: []
        }
    },
    created(){
        this.allMembers = this.$store.getters.members
        this.boardMembers = this.$store.getters.boardMembers
    },
    computed:{
        membersToShow(){
            var membersToShow = []
            var counter
            for(let i=0; i<this.allMembers.length; i++){
                counter = 0
                for(let j=0; j<this.boardMembers.length; j++){
                    if (this.allMembers[i]._id === this.boardMembers[j]._id) counter ++
                }
                if(!counter) membersToShow.push(this.allMembers[i])
            }
            return membersToShow
        }
    },
    methods:{
        addMemberToBoard(member){
            this.$emit('addMemberToBoard', member)
        }
    },
    components:{
        memberAvatar2
    }
}
</script>