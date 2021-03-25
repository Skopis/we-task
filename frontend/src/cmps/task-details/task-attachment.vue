<template>
  <div class="task-attachment">
  <header>
    <h3>Upload an image</h3>
  </header>
    <img-upload @save="saveImg" />
  </div>
</template>


<script>
import imgUpload from "../img-upload.cmp.vue";

export default {
  name: 'task-attachment',
  methods: {
    saveImg(imgUrl) {
      console.log('imgUrl', imgUrl)
      this.$emit('saveImgAsAttachment', imgUrl)
    },
  },
  components: {
    imgUpload,
  },
};
</script>
