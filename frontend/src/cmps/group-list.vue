<template> 
    <div class="group-list">
        <task-quick-edit v-if="isAddModalOpen" @updateTask="updateTask"/>
    <draggable
        tag="ul"
        v-bind="dragOptions"
        :list="groupToShow.tasks">
        <li v-for="task in groupToShow.tasks" :key="'C' + task.id">
            <task-preview :task="task" @updateTask="updateTask"/>
        </li>
    </draggable>
        <button @click="openAddModal">Add a new Task</button>
    </div>
</template>

<script>
import taskDetails from './task-details.vue'
import taskPreview from './task-preview.vue'
import TaskQuickEdit from './task-quick-edit.vue'
import draggable from "vuedraggable";

export default {
    name: 'group-list',
    props:['group'],
    data() {
        return {
            groupToShow: null,
            isAddModalOpen: false
        }
    },
    computed: {
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost",
            }
        },
    },
    created() {
        this.groupToShow = this.group
    },
    methods: {
        openAddModal() {
        this.isAddModalOpen = true;
    },
        updateTask(taskToUpdate){
            this.isAddModalOpen = false
            this.$store.dispatch({ type: "addTask", task: taskToUpdate, group: this.groupToShow});
        }
    },
    components:{
        taskDetails,
        taskPreview,
        TaskQuickEdit,
        draggable
    }
}
</script>