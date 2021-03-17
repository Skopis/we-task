<template>
    <section class="task-edit">
        <form @submit.prevent="updateTask">
            <textarea placeholder="" v-model="taskToEdit.title"></textarea>
            <button >Save</button>
        </form>
    </section>
</template>

<script>
//task edit on task list task preview
export default{
    name: 'task-quick-edit',
    props:['task'],
    data(){
        return{
            taskToEdit: null
        }
    },
    created(){
        if(!this.task) this.taskToEdit = {id: '', title: ''}
        else this.taskToEdit = JSON.parse(JSON.stringify(this.task))
    },
    methods:{
        updateTask(){
            console.log('this.taskToEdit', this.taskToEdit)
            this.$emit('updateTask', this.taskToEdit)
        }
    }
}

</script>
