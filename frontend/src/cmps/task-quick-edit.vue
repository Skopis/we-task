<template>
    <section class="task-edit">
        <form >
            <textarea 
            ref="taskTxt"
            placeholder=""
            v-model="taskToEdit.title"
            @keydown.enter.exact.prevent="updateTask"
            autofocus
            >
            </textarea>
            <!-- <button >Save</button> -->
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
        setTimeout(() => {
        this.$refs.taskTxt.focus();
    }, 300);
    },
    methods:{
        updateTask(){
            this.$emit('updateTask', JSON.parse(JSON.stringify(this.taskToEdit)))
        }
    }
}

</script>
