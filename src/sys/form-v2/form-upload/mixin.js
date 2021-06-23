
import Uploading from '../../../common/upload/upload'
import { uploadForm } from '@/api/form-render'
export const mixin = {
  data: function () {
    return {
      uploadConfig:{
        accept:'.zip',
        limit: 1, // 限制附件上传个数
        limitSize: 2048576, // 200mb单个附件上传大小
      },
      file: null,
      uploading:false,
      uploadButton:'上传表单'
    }
  },
  props: {

  },
  computed:{

  },
  created () {

  },
  mounted () {

  },
  components:{
    Uploading
  },
  methods: {
    handlerUploadForm(){
      // console.log('-------this.file------'+this.file)
      if(this.file === null || this.validUtil.isNull(this.file.id)){
        this.util.warn('请先上传附件!')
        return
      }
      this.uploading = true
      let vm = this
      uploadForm(this.file.id).then(res=>{
        this.util.success('安装成功')
        vm.uploading = false
      }).catch(e=>{
        vm.uploading = false
        this.util.error('安装失败,'+e)
      })
      /*setTimeout(()=>{
        vm.uploading = false
      },2000)*/
    },
    handlerFileUploadSuccess(file){
      console.log('------handlerFileUploadSuccess-----',file)
      this.file = file.data
    }
  }
}
