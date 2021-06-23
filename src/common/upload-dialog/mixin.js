
export const mixin = {
  data: function () {
    return {

    }
  },
  props: {
    config: { // 列表或者按钮或者传统触发弹框打开页面时使永
      type: Object,
      default: function () {
        return undefined
      }
    },
    readOnly: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    name: {
      type: String,
      default: function () {
        return "file"
      }
    },
    column: {
      type: Object,
      default: function () {
        return undefined
      }
    },
    filesList: {
      type: Array,
      default: function () {
        return []
      }
    },
    deleteFilesList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  computed:{

  },
  created () {

  },
  mounted () {

  },
  methods: {
    getFilesList() {
      return this.getUploadCmp().getFilesList()
    },
    getDeleteFilesList() {
      return this.getUploadCmp().getDeleteFilesList()
    },
    getUploadCmp(){
      let uploading = this.$refs['uploading']
      if (uploading && uploading.length > 0) {
         uploading = uploading[0]
      }
      return uploading
    },
    handlerFileUploadSuccess(file){

    }
  }
}
