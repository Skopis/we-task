<template>
  <div class="board" >
    <h3>Board Name: {{boardToShow.title}} </h3>
    <section class="review-list">
    <div v-for="list in boardToShow.lists" :key="'L'+list.id" class="list">
      <card-list :list="list"/>
    </div>
    </section>
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
  </div>
</template>

<script>
import cardList from '../cmps/card-list.vue'

export default {
  name: 'board',
  data() {
    return {
      boardToShow: null
    }
  },
  computed: {

  },
  created() {
    console.log('hi this.boardToShow before', this.boardToShow)
    this.boardToShow = this.$store.getters.getBoard
    console.log('hi this.boardToShow after', this.boardToShow)
    
  },
  methods: {
  
  },
  components:{
    cardList
  }
}
</script>
