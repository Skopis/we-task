<template>
  <section class="home text-center main-container">
    <section class="home-txt">
    <h1>WeTask</h1>
    <h5 class="text-center">
      Organizing your work & life
    </h5>
    <button @click="pushRoute">Try it now</button>
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
  created() {},
  methods: {
    pushRoute(){
      this.$router.push('/board/b101')
    }
  },
};
</script>
