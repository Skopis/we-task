<template>
  <div id="app">
    <h1>Let's tupload some images</h1>
    <img-upload @save="saveImg" />
    <div class="img-list">
      <img
        v-for="(imgUrl, idx) in imgUrls"
        :src="imgUrl"
        :key="idx"
        alt="images"
      />
    </div>
  </div>
</template>


<script>
import imgUpload from "../img-upload.cmp.vue";

export default {
  data() {
    return {
      imgUrls: [],
    };
  },

  methods: {
    saveImg(imgUrl) {
      this.imgUrls.push(imgUrl)
    },
  },
  components: {
    imgUpload,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.img-list {
  margin: 5%;
}

.img-list img {
  height: 150px;
}
</style>