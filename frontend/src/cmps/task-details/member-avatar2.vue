<template>
    <div class="avatar-container">
        <img v-if="member.imgUrl" class="avatar" :src="member.imgUrl" alt="" :style="{height:size+'px', width:size+'px'}" />
        <avatar
        class="avatar"
        v-else
        :username="member.fullname"
        :size="size"
        :style="{ marginRight:0+'px' }"
        :background-color='userColor'

        >
        </avatar>
    </div>
</template>

<script>
import Avatar from "vue-avatar";

export default {
    name:'member-avatar2',
    props: ['member', 'size'],
    computed: {
        fullname() {
            return this.member.fullname;
        },
        userColor(){
            if(this.member.fullname === 'Nofar Gabso') return '#009688'
            else if(this.member.fullname === 'Lian Skopis') return '#5243aa'
            else if(this.member.fullname === 'Shachar Dorfzaun') return '#607d8b'
            else if(this.member.fullname === 'Itay Azulay') return '#ff9800'
    }
    },
    components: {
        Avatar,
    },
};
</script>