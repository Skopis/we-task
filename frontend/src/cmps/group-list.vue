<template> 
        <ul class="group-list">
            <li v-for="task in groupToShow.tasks" :key="'C'+task.id">
                <task-preview :task="task"/>
                
                <!-- <router-link :to="'/task/'+task._id"></router-link> -->
            </li>
        </ul>
</template>

<script>
import taskDetails from './task-details.vue'
import taskPreview from './task-preview.vue'

export default {
    name: 'group-list',
    props:['group'],
    data() {
        return {
            groupToShow: null
        }
    },
    computed: {

    },
    created() {
        this.groupToShow = this.group
    },
    methods: {
    
    },
    components:{
        taskDetails,
        taskPreview
    }
}
</script>