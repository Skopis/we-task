<template>
  <header class="app-header">
    <nav>
      <router-link to="/">
        <!-- <span class="logo" role="img" aria-label="logo">  -->
          <img class="logo" src="../assets/logo3.svg"/>
        <!-- </span> -->
      </router-link>
      <router-link to="/board">Boards</router-link>
      <router-link to="/archive">Archive</router-link>
      <!-- <router-link to="/chat">Chat</router-link> -->
      <router-link to="/login">Login / Signup</router-link>
    </nav>
    <section className="loggedin-user" v-if="loggedInUser">
      <h3>Welcome, {{loggedInUser.fullname}}</h3>
      <!-- <router-link :to="`/user/${loggedInUser._id}`"> -->
      <!-- </router-link> -->
    </section>
    <button class="btn">weTaskbigger</button>
  </header>
</template>
<script>
export default {
  computed: {
    loggedInUser() {
      return this.$store.getters.loggedinUser
    }
  },
};
</script>