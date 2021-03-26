<template>
    <div class="form__field">
        <div class="form__label">
        </div>
        <div class="form__input" >
            <v-swatches :swatches="swatches" v-model="color" popover-x="left" @input="saveNewCover"></v-swatches>
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
                color: '#1CA085',
                swatches: ['#7bc86c', '#f5dd29', '#ffaf3f', '#ef7564', '#cd8de5', '#5ba4cf', '#29cce5', '#6deca9', '#ff8ed4', '#172b4d', '#f4f5f7', '#ffff']
            }
        },
        async created(){
            if (this.group){
                this.color=this.group.style.bgColor
                return
            }
            if (this.board){
                this.color=this.board.style.bgColor
                return
            }
            const id = this.$route.params.taskId;
            const task = await this.$store.dispatch({ type: "getById", id });
            if(task){
                this.color=task.style.bgColor
            }
        },
        methods:{
            saveNewCover(){
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