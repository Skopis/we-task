<template>
  <header class="app-header">
    <nav>
      <router-link to="/">
          <img class="logo" src="../assets/logo3.svg"/>
      </router-link>
      <h2 class="btn" @click="routeBoards">Boards</h2>
    <section className="loggedin-user" v-if="loggedInUser">
    </section>
    </nav>
    <div class="user-container flex">
      <h2 class="btn login" @click="routeLogin">{{title}}</h2>
      <member-avatar2 :member="loggedInUser" :size="32"/>
    </div>
  </header>
</template>

<script>
import memberAvatar2 from './task-details/member-avatar2.vue'

export default {
  computed: {
    title(){
      return (!this.loggedInUser || this.loggedInUser.fullname === 'Guest' )? 'Login' : 'Logout'
    },
    loggedInUser() {
      return this.$store.getters.loggedinUser
    }
  },
  methods:{
    routeLogin(){
      console.log('this.$route.name', this.$route.name)
      if(this.$route.name !== 'loginSignup') this.$router.push('/login')
    },
    routeBoards(){
      this.$router.push('/board')
    }
  },
  components:{
    memberAvatar2
  }
};
</script>