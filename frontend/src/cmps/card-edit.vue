<template>
    <section class="card-edit">
        <form @submit.prevent="updateCard">
            <textarea cols="7" rows="3" placeholder="" v-model="cardToEdit.title"></textarea>
            <button >Save</button>
        </form>
    </section>
</template>

<script>
//card edit on card list card preview
export default{
    name: 'card-edit',
    props:['card'],
    data(){
        return{
            cardToEdit: null
        }
    },
    created(){
        console.log('this.card', this.card)
        this.cardToEdit = JSON.parse(JSON.stringify(this.card))
    },
    methods:{
        updateCard(){
            console.log('this.cardToEdit', this.cardToEdit)
            this.$emit('updateCard', this.cardToEdit)
        }
    }
}

</script>
