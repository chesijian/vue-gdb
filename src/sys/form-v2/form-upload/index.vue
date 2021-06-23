<template>
  <div class="jr-container">
    <div class="jr-content">
      <!--<div>上传表单</div>-->
      <uploading
                 name="form"
                 :config="uploadConfig"
                 ref="form-upload" @on-success="file=>handlerFileUploadSuccess(file)"> </uploading>

      <el-button type="primary" @click="handlerUploadForm" :loading="uploading" style="margin-top: 10px;">{{uploading?'安装中...':'开始安装'}}</el-button>
      <div class="remark">
        <p >上传须知：</p>
        <p class="remark-content">
          • 相同的formKey的表单将执行覆盖替换操作；
          <br >
          • SYS_FORM_BASIC和SYS_FORM_BASIC_INFO的ID_必须在唯一，否则报错；
          <br >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import {mixin} from './mixin.js'
    export default {
        name: "form-upload",
        mixins: [mixin]
    }
</script>

<style scoped>
  .jr-content{
    background-color: white;
    padding-top: 10px;
    padding-left: 10px;

    width: 100%;
    height: 100%;
  }
  .remark{
    text-align: left;
    padding-left: 27px;
    margin-top: 10px;
  }
  .remark-content{
    color: #808080;
    font-size: 12px;
    line-height: 2;
  }
</style>
