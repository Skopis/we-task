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
    props: ['imgUrl', 'task'],
    data(){
        return{
            isCoverOn: false
        }
    },
    computed:{
        title(){
            return this.isCoverOn ? 'Remove as Cover' : 'Set as Cover'
        }
    },
    methods:{
        toggleSetAsTaskCover(){
            if (this.isCoverOn){
                this.$emit('setImageAsTaskCover', '', {class:''})
            }
            else{
                this.$emit('setImageAsTaskCover', this.imgUrl, {class:'cover'})
            }
            this.isCoverOn = !this.isCoverOn
        },
        removeAttachment(){
            this.$emit('removeAttachment', this.imgUrl)
        },
        comment(){
            this.$emit('comment', this.imgUrl)
        }
    },
    created(){
        if (this.task.style.imgUrl) this.isCoverOn = true
    }
}
</script>