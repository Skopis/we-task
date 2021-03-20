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
        if(!this.task) this.taskToEdit = {
            'id': '',
            'title': '',
            'style': {
                "bgColor": "#ffff"
            }
        }
        else this.taskToEdit = this.task
    },
    methods:{
        updateTask(){
            this.$emit('updateTask', JSON.parse(JSON.stringify(this.taskToEdit)))
        }
    }
}

</script>
