<template> 
    <div>
        <task-quick-edit v-if="isAddModalOpen" @updateTask="updateTask"/>
    <draggable
        tag="ul"
        class="group-list"
        v-bind="dragOptions"
        :list="groupToShow.tasks">
        <!-- <task-quick-edit
        v-if="isEditModalOpen"
        @updateTask="updateTask"
        :task="task"
      /> -->
        <h4 class="list-title">{{group.title}}</h4>
        <li v-for="task in groupToShow.tasks" :key="'C' + task.id">
            <task-preview :task="task" @updateTask="updateTask"/>
        </li>
        <button class="btn" @click="openAddModal">Add a new Task</button>
    </draggable>
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