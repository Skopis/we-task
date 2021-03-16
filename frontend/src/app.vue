<template>
  <div id="app">
    <app-header />
    <router-view />
  </div>
</template>

<script>
import appHeader from "./cmps/app-header";

export default {
  created() {
    this.$store.dispatch({ type: "loadBoard" });
  },
  components: {
    appHeader,
  },
};
</script>

