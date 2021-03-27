<template>
    <section class="task-attachment-display">
        <img :src="attachment.imgUrl" alt="images" />
        <div>
            <p>{{attachment.originalFilename}}.{{attachment.format}}</p>
            <p>Added {{formattedDate(attachment.createdAt)}}</p>
            <button class="btn" @click="removeAttachment">Delete</button>
            <button class="btn">Edit</button>
            <button class="btn" @click="comment">Comment</button>
            <button class="btn" @click="toggleSetAsTaskCover">{{title}}</button>
        </div>
    </section>
</template>


<script>

export default {
    name: 'task-attachment-display',
    props: ['attachment', 'task'],
    data(){
        return{
            isCoverOn: false
        }
    },
    computed:{
        title(){
            return this.isCoverOn ? 'Remove cover' : 'Make cover'
        },
    },
    methods:{
        formattedDate(date) {
            return moment(date).fromNow();
        },
        toggleSetAsTaskCover(){
            if (this.isCoverOn){
                this.$emit('setImageAsTaskCover', '', {class:''})
            }
            else{
                this.$emit('setImageAsTaskCover', this.attachment.imgUrl, {class:'cover'})
            }
            this.isCoverOn = !this.isCoverOn
        },
        removeAttachment(){
            this.$emit('removeAttachment', this.attachment.imgUrl)
        },
        comment(){
            this.$emit('comment', this.attachment.imgUrl)
        }
    },
    created(){
        if (this.task.style.imgUrl) this.isCoverOn = true
    }
}
</script>