<template>
  <section v-if="user">
    <h1>User Details - {{ user.fullname }}</h1>
    <h3>{{ user.username }} score: {{ user.score }}</h3>
    <ul>
      <li v-for="review in user.givenReviews" :key="'R'+review._id">
        {{ review.txt }}
        <router-link :to="`/user/${review.aboutUser._id}`">
          About {{ review.aboutUser.fullname }}
        </router-link>
      </li>
    </ul>

    <details>
      <summary>Full JSON</summary>
      <pre>{{ user }}</pre>
    </details>
  </section>
</template>

<script>

export default {
  watch: {
    userId: {
      handler() {
        this.$store.dispatch({ type: "loadAndWatchUser", userId: this.userId });
      },
      immediate: true,
    },
  },
  computed: {
    user() {
      return this.$store.getters.watchedUser;
    },
    userId() {
      return this.$route.params.id;
    },
  },
};
</script>