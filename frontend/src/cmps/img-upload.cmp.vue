<template>
  <section class="img-upload-container">
    <label v-if="!isLoading" for="imgUploader" >
      <img class="upload" src="https://lh3.googleusercontent.com/proxy/Tm_MhA6O8xY2czjMuetUxXxIkPOBF6IjHQBUIDk0edLeioeELiEsIOfMMmlR1Kk1x4Y9g6fwCIzTYE1dNNN7M_teTSSBHwaJHVMprD6jS8fpP69GRAaBqJivtFU" alt="">
    </label>

    <img class="loading" v-else src="https://i.pinimg.com/originals/f6/65/6a/f6656aa6fdb6b8f905dea0bcc2d71dd8.gif" alt="">
    <input type="file" id="imgUploader" @change="onUploadImg" />
  </section>
</template>

<script>
import { uploadImg } from "../services/img-upload.service";
export default {

  data() {
    return {
      isLoading: false
    }
  },

  methods: {
    async onUploadImg(ev) {
      this.isLoading = true
      const res = await uploadImg(ev)
      this.$emit('save', res.url)
      console.log('onUploadImg -> res', res)
      this.isLoading = false
    },
  },
};
</script>

<style>
input {
  display: none;
}

.loading {
  height: 200px;
}

img.upload {
  height: 150px;
  cursor: pointer;
}
</style>