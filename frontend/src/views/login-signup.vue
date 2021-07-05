<template>
  <div class="container about">
    <p>{{ msg }}</p>
    <div v-if="loggedinUser">
      <h3>
        Loggedin User:
        {{ loggedinUser.username }}
        <button @click="doLogout">Logout</button>
      </h3>
    </div>
    <div v-else>
      <h2>Login</h2>
      <form @submit.prevent="doSignup">
        <input type="text" v-model="signupCred.fullname" placeholder="Your full name" />
        <input
          type="password"
          v-model="signupCred.password"
          placeholder="Password"
        />
        <input
          type="text"
          v-model="signupCred.username"
          placeholder="Username"
        />
        <button>Login</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "test",
  data() {
    return {
      msg: "",
      loginCred: {username: 'user1', password: '123'},
      signupCred: {username: '', password: '', fullname: ''},
    };
  },
  computed: {
    users() {
      return this.$store.getters.users;
    },
    loggedinUser() {
      return this.$store.getters.loggedinUser;
    },
  },
  created() {
    this.loadUsers()
  },
  methods: {
    async doLogin() {
      if (!this.loginCred.username) {
        this.msg = "Please enter username/password"
        return;
      }
      try {
        await this.$store.dispatch({ type: "login", userCred: this.loginCred });
        this.$router.push('/')
      } catch(err) {
          console.log(err)
          this.msg = "Failed to login"
      }
    },
    doLogout() {
      this.$store.dispatch({ type: "logout" });
    },
    async doSignup() {
      if (!this.signupCred.fullname || !this.signupCred.password || !this.signupCred.username) {
        this.msg = "Please fill up the form"
        return
      }
      await this.$store.dispatch({ type: "signup", userCred: this.signupCred });
      this.$router.push('/')
      
    },
    loadUsers() {
      this.$store.dispatch({ type: "loadUsers" });
    },
    async removeUser(userId) {
      try {
        await this.$store.dispatch({ type: "removeUser", userId })
        this.msg = 'User removed'
      } catch(err) {
        this.msg = 'Failed to remove user'
      }
    }
  }
};
</script>