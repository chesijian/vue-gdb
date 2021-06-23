<template>
  <div class="jr-container">
    <div class="jr-content">
      <el-tabs v-if="showTab" v-model="activeName" @tab-click="handleTabClick" class="jr-tabs" >
        <el-tab-pane label="主表字段" name="main-form" class="jr-tab">
          <common-grid-table :config="mainFormGridConfig" ref="main-form" edit @handleOperateClick="((buttonId,index,row)=>{handlerGridOperateClick( buttonId,index,row)})"  style="width: 100%"></common-grid-table>
        </el-tab-pane>
        <el-tab-pane v-for="(subForm) in subForms" :key="subForm.key" :title="subForm.title" :label="subForm.title.length>5?subForm.title.substring(0,5)+'...' : subForm.title" :name="subForm.key" class="jr-tab">
          <common-grid-table :config="subFormGridConfig"  :ref="subForm.key" edit  @handleOperateClick="((buttonId,index,row)=>{handlerGridOperateClick( buttonId,index,row)})"  style="width: 100%"></common-grid-table>
        </el-tab-pane>
      </el-tabs>
      <div style="position: absolute;right: 30px;top: 105px;">
        <!-- <div style="position: absolute;right: 157px;top: 52px;z-index:5;"> -->
      <!--  <el-button round type="warning" size="mini"  @click="handlerColumnCopyClick">复制</el-button>
        <el-button round type="warning" size="mini"  @click="handlerColumnPasteClick">粘贴</el-button>-->
        <!--<el-button round type="warning" size="mini" icon="el-icon-plus" @click="handlerColumnSelectClick">选择字段</el-button>-->
       <!-- <el-button round type="warning" size="mini" icon="el-icon-plus" @click="handlerGridAddClick">新增</el-button>
        <el-button round type="warning" size="mini" icon="el-icon-delete" @click="handlerGridDeleteClick">删除</el-button>-->
      </div>
    </div>
  </div>
</template>

<script>
  import {mixin} from './mixin.js'
    export default {
        name: "wf-form-auth",
        mixins: [mixin]
    }
</script>

<style scoped type="scss">
@import "index.scss";
</style>
