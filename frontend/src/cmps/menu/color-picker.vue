<template>
    <div class="form__field">
        <div class="form__label">
            <strong>Choose a color:</strong>
        </div>
        <div class="form__input" >
            <v-swatches v-model="color" popover-x="left" @input="saveNewCover"></v-swatches>
        </div>
    </div>
</template>

<script>
    import VSwatches from 'vue-swatches'
    import "vue-swatches/dist/vue-swatches.css"

    export default {
        props:['group', 'board'],
        components: { VSwatches }, // window['vue-swatches'] - from CDN
        data () {
            return {
                color: '#1CA085'
            }
        },
        created(){
            if (this.group){
                this.color=this.group.style.bgColor
            }
            if (this.board){
                this.color=this.board.style.bgColor
            }
        },
        methods:{
            saveNewCover(){
                console.log('hi color')
                if (this.group){
                    this.$emit('changeGroupCover', this.color)
                }
                if (this.board){
                    this.$emit('changeBoardCover', this.color)
                }
                else{
                    this.$emit('changeTaskCover', this.color)
                }
            }
        }
    }
</script>