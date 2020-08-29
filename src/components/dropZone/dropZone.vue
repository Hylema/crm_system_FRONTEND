<template>
  <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" :useCustomSlot=true class="background action--text" v-on:vdropzone-file-added="test">
    <v-icon size="50" color="action">mdi-cloud-upload</v-icon>
    <div>Нажмите сюда или перетащите файлы</div>
  </vue-dropzone>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
export default {
  name: "dropZone",
  components: {
    vueDropzone: vue2Dropzone
  },
  data: function () {
    return {
      dropzoneOptions: {
        url: 'https://httpbin.org/post',
        thumbnailWidth: 150,
        maxFilesize: 0.5,
        addRemoveLinks: true,
        // maxThumbnailFilesize: 20,
        // previewTemplate: this.template(),

      }
    }
  },
  methods: {
    template: function () {
      return `<div class="container">
<div class="row">
<div class="card dz-processing dz-success dz-complete" style="width: 18rem;">
  <img data-dz-thumbnail class="card-img-top" width="100%" height="200px"/>
  <div class="card-body dz-details">
    <h5 class="card-title dz-filename"><span data-dz-name></span></h5>
    <p class="card-text dz-size" data-dz-size></p>
    <a data-dz-remove class="btn btn-primary">Удалить</a>
  </div>
</div>
</div>
</div>`;
    },
    test(file){
      console.log(file);

      this.$store.commit('tasks/addFile', file)
    }
  },
}
</script>

<style>
</style>
