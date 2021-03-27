<template>
  <div class="task-attachment">
  <div class="attachment-header">
    <h3>Upload an image</h3>
  </div>
    <img-upload @save="saveImg" />
  </div>
</template>


<script>
import imgUpload from "../img-upload.cmp.vue";

export default {
  name: 'task-attachment',
  methods: {
    saveImg(imgUrl, originalFilename, format) {
      console.log('imgUrl', imgUrl)
      this.$emit('saveImgAsAttachment', imgUrl, originalFilename, format)
    },
  },
  components: {
    imgUpload,
  },
};
</script>
