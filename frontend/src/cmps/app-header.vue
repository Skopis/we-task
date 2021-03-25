<template>
  <header class="app-header">
    <nav>
      <router-link to="/">
          <img class="logo" src="../assets/logo3.svg"/>
      </router-link>
      <button class="btn" @click="routeBoards">Boards</button>
      <button class="btn" @click="routeLogin" to="/login">Login / Signup</button>
    <section className="loggedin-user" v-if="loggedInUser">
    </section>
    </nav>
    <member-avatar2 :member="loggedInUser" :size="32"/>
  </header>
</template>

<script>
import memberAvatar2 from './task-details/member-avatar2.vue'

export default {
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    }
  },
  methods:{
    routeLogin(){
      this.$router.push('/login')
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