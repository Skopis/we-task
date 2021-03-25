<template>
    <section class="board-menu">
        <button class="btn" @click="toggleColorPicker">Cover</button>
        <color-picker :board="board" @changeBoardCover="updateBoardCover" v-if="isColorPickerOpen"/>
        <div
          v-if="(this.board.activities && this.board.activities.length)">
          <div v-for="activity in activities" :key="activity.id">
            <task-activities :activity="activity" :type="activity.txt" />
          </div>
        </div>
        
    </section>
</template>

<script >
import colorPicker from './color-picker.vue'
import taskActivities from '../task-details/task-activities.cmp';
export default{
    name:'board-menu',
    props:['board'],
    data(){
        return{
            isColorPickerOpen: false
        }
    },
    methods:{
        toggleColorPicker(){
            this.isColorPickerOpen = !this.isColorPickerOpen
        },
        updateBoardCover(color){
            this.$emit('updateBoardCover', color)
        }
    },
    computed:{
        activities(){
           return this.board.activities.sort(function(a, b){
                return b.createdAt-a.createdAt
            })
        }
    },
    components:{
        colorPicker,
        taskActivities
    }
}
</script>

