<template> 
    <div>
        <ul class="card-list review-list">
            <li v-for="card in listToShow.cards" :key="'C'+card.id">
                <card-preview :card="card"/>
                <!-- <router-link :to="'/card/'+card._id"></router-link> -->
            </li>
        </ul>
    </div>
</template>

<script>
import cardDetails from '../cmps/card-details.vue'
import cardPreview from '../cmps/card-preview.vue'

export default {
    name: 'card-list',
    props:['list'],
    data() {
        return {
            listToShow: null
        }
    },
    computed: {

    },
    created() {
        this.listToShow = this.list
        console.log('this.listToShow', this.listToShow)
    },
    methods: {
    
    },
    components:{
        cardDetails,
        cardPreview
    }
}
</script>