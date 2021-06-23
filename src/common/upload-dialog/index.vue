<template>
  <upload
    :readOnly="readOnly"
    :filesList="filesList"
    :deleteFilesList="deleteFilesList"
    :name="name"
    :config="config"
    ref="uploading" @on-success="file=>handlerFileUploadSuccess(column,file)"
  ></upload>
</template>

<script>
  import Upload from "../upload/upload.vue";
  import {mixin} from './mixin.js'

  export default {
    name: "upload-dialog",
    mixins: [mixin],
    components: {
      Upload
    }
  }
</script>

<style scoped>

</style>
