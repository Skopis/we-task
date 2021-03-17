<template>
  <header>
    <nav>
      <router-link to="/">
        <!-- <span class="logo" role="img" aria-label="logo">  -->
          <img class="logo" src="../assets/logo.svg"/>
        <!-- </span> -->
      </router-link>
      <router-link to="/board">Board</router-link>
      <!-- <router-link to="/chat">Chat</router-link> -->
      <router-link to="/login">Login / Signup</router-link>
    </nav>
    <section className="loggedin-user" v-if="loggedInUser">
      <router-link :to="`/user/${loggedInUser._id}`">
        {{ loggedInUser.fullname }}
      </router-link>
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