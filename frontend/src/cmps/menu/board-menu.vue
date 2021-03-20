<template>
    <section class="board-menu">
        <button class="btn" @click="toggleColorPicker">Cover</button>
        <color-picker :board="board" @changeBoardCover="updateBoardCover" v-if="isColorPickerOpen"/>
    </section>
</template>

<script >
import colorPicker from './color-picker.vue'
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
            console.log('color', color)
            this.$emit('updateBoardCover', color)
        }
    },
    components:{
        colorPicker
    }
}
</script>