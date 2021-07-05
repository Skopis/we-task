<template>
  <section class="home text-center main-container">
    <section class="home-txt">
      <!-- <p class="main-header">WeTask</p> -->
      <img src="../assets/logo2.svg">
      <!-- <p class="text-center sub-header">Organizing your work & life</p> -->
      <button @click="pushRoute">Try it now</button>
    </section>
    <section class="article-container">
      <p class="text-center sub-header">THE POWER OF THE INTERNET IS HERE</p>
      <article>
        <img src="../assets/Pictures/yours.png" />
        <div class="text-container">
          <h2>Make it yours.</h2>
          <p>
            Make it feel like home for you and your team. Customize the board's
            appearance, Organize your lists to fit the team's flow.
          </p>
        </div>
      </article>
      <article>
        <div class="text-container">
          <h2>Drag n Drop!</h2>
          <p>
            Try our Drag n Drop technology to easily move & update your tasks
            with your mouse or finger.
          </p>
        </div>
        <img src="../assets/Pictures/dnd.png" />
      </article>
      <article>
        <img src="../assets/Pictures/sockets.png" />
        <div class="text-container">
          <h2>Web Sockets.</h2>
          <p>
            With the power of web sockets, you and your team can enjoy a
            workspace that updates in real-time, keeping everyone synced and up
            to date.
          </p>
        </div>
      </article>
    </section>
  </section>
</template>

<script>
export default {
  name: "home",
  data() {
    return {};
  },
  computed: {},
  async created() {
    await this.$store.dispatch({ type: "loadBoards" });
    console.log('this.$store.getters.getBoards', this.$store.getters.getBoards)
  },
  methods: {
    pushRoute() {
      const boardId = this.$store.getters.getBoards[0]._id
      this.$router.push(`/board/${boardId}`);
    },
  },
};
</script>
