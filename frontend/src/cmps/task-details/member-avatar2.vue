<template>
    <div class="avatar-container">
        <img v-if="member.imgUrl" class="avatar" :src="member.imgUrl" alt="" :style="{height:size+'px', width:size+'px'}" />
        <avatar
        class="avatar"
        v-else
        :username="member.fullname"
        :size="size"
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
    },
    created(){
        // console.log(this.member)
    },
    components: {
        Avatar,
    },
};
</script>