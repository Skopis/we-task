<template>
    <section class="card-edit">
        <el-form>
            <el-textarea cols="7" rows="3" placeholder="" v-bind="card.title"></el-textarea>
            <el-button @click="saveCard">Save</el-button>
        </el-form>
    </section>
</template>

<script>
//card edit on card list card preview
export default{
    name: 'card-edit',
    props:['card'],
    data(){
        return{
        
        }
    },
    created(){
        
    },
    methods:{
        saveCard(){
            this.$store.dispatch({type:'saveCard', card: this.card})
        }
    }
}

</script>
