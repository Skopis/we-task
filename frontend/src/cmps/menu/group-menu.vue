<template>
    <section class="group-menu" :style="menuPos">
        <div class="group-menu-header">
            <h4>List actions</h4>
            <button class="btn">X</button>
        </div>
        <button class="btn" @click="archiveGroup">Archive</button>
        <button class="btn" @click="toggleColorPicker">Change Cover</button>
        <color-picker :group="group" @changeGroupCover="updateGroupCover" v-if="isColorPickerOpen"/>
    </section>
</template>

<script>
import colorPicker from './color-picker.vue'

export default{
    name: 'group-menu',
    props:['group', 'menuPos'],
    data(){
        return{
            isColorPickerOpen: false
        }
    },
    methods:{
        toggleColorPicker(){
            this.isColorPickerOpen = !this.isColorPickerOpen
        },
        archiveGroup(){
            console.log('hi archive group')
            this.$emit('archiveGroup', this.group)
        },
        updateGroupCover(color){
            this.$emit('updateGroupCover', color)
        }
    },
    created(){
        
    },
    components:{
        colorPicker
    }
}
</script>