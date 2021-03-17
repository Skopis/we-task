<template> 
        <ul class="card-list">
            <li v-for="card in listToShow.cards" :key="'C'+card.id">
                <card-preview :card="card"/>
                <!-- <router-link :to="'/card/'+card._id"></router-link> -->
            </li>
        </ul>
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
    },
    methods: {
    
    },
    components:{
        cardDetails,
        cardPreview
    }
}
</script>