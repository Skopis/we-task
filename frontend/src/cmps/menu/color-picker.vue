<template>
    <div class="form__field">
        <div class="form__label">
            <strong>Choose a color:</strong>
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
                swatches: ['#ebecf0', '#ffff', '#CC859A', '#EECAB6', '#B1C294', '#D8C9FF', '#FBFFD4', '#D1F5F5', '#A4A9A7']
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
            console.log("id from paprms", id);
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