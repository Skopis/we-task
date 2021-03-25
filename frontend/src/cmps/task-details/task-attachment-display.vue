<template>
    <section class="task-attachment-display">
        <img :src="imgUrl" alt="images" />
        <button class="btn" @click="removeAttachment">Delete</button>
        <button class="btn">Edit</button>
        <button class="btn" @click="comment">Comment</button>
        <button class="btn" @click="toggleSetAsTaskCover">{{title}}</button>
    </section>
</template>


<script>

export default {
    name: 'task-attachment-display',
    props: ['imgUrl'],
    data(){
        return{
            title: 'Set as Cover'
        }
    },
    methods:{
        toggleSetAsTaskCover(){
            if (this.title === 'Remove as Cover'){
                this.title = 'Set as Cover'
                this.$emit('setImageAsTaskCover', '')
            }
            else{
                this.$emit('setImageAsTaskCover', this.imgUrl)
                this.title = 'Remove as Cover'
            }
        },
        removeAttachment(){
            this.$emit('removeAttachment', this.imgUrl)
        },
        comment(){
            this.$emit('comment', this.imgUrl)
        }
    },
}
</script>