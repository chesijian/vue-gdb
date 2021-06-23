<template>
  <div id="jr-container" class="jr-container">
    <div class="jr-tree">
      <div class="jr-tree-tool">
        <el-button round type="success" size="mini" icon="el-icon-document" @click="handlerSaveClick">保存</el-button>
        <el-button round type="warning" size="mini" icon="el-icon-plus" @click="handlerNewClick">新增</el-button>
      </div>
      <div class="jr-tree-content">
        <common-tree-table :config="treeGridConfig" @handleOperateClick="((buttonId,index,row)=>{handlerTreeOperateClick( buttonId,index,row)})"  @handlerRowClick="((row)=>{handlerTreeRowClick( row)})" ref="tree-grid"></common-tree-table>
      </div>
    </div>
    <div id="jr-form-config" class="jr-content">
      <el-tabs v-if="showTab" v-model="activeName" @tab-click="handleTabClick" class="jr-tabs" >
        <el-tab-pane label="查询设计" name="query-design" class="jr-tab">
          <common-grid-table :config="queryDesignGridConfig" ref="query-design" edit @handleOperateClick="((buttonId,index,row)=>{handlerGridOperateClick( buttonId,index,row)})"  :style="{width:(width-390)+'px'}"></common-grid-table>
        </el-tab-pane>
        <el-tab-pane label="表单设计" name="form-design" class="jr-tab">
          <common-grid-table :config="formDesignGridConfig"  ref="form-design" edit  @handleOperateClick="((buttonId,index,row)=>{handlerGridOperateClick( buttonId,index,row)})"  :style="{width:(width-390)+'px'}"></common-grid-table>
        </el-tab-pane>
          <el-tab-pane v-for="(subForm) in subForms" :key="subForm.key" :title="subForm.title" :label="subForm.title.length>5?subForm.title.substring(0,5)+'...' : subForm.title" :name="subForm.key" class="jr-tab">
            <common-grid-table :config="subFormDesignGridConfig"  :ref="subForm.key" edit  @handleOperateClick="((buttonId,index,row)=>{handlerGridOperateClick( buttonId,index,row)})"  :style="{width:(width-390)+'px'}"></common-grid-table>
          </el-tab-pane>
          <el-tab-pane label="事件配置" name="event-design" class="jr-tab">
            <common-grid-table :config="eventDesignGridConfig"  ref="event-design" edit :queryParams="queryParams" @handleOperateClick="((buttonId,index,row)=>{handlerGridOperateClick( buttonId,index,row)})"  :style="{width:(width-390)+'px'}"></common-grid-table>
          </el-tab-pane>
        </el-tabs>
         <div style="position: absolute;right: 30px;top: 0px;">
        <!-- <div style="position: absolute;right: 157px;top: 52px;z-index:5;"> -->
          <el-button round type="warning" size="mini"  @click="handlerColumnCopyClick">复制</el-button>
          <el-button round type="warning" size="mini"  @click="handlerColumnPasteClick">粘贴</el-button>
          <el-button round type="warning" size="mini" icon="el-icon-plus" @click="handlerColumnSelectClick">选择字段</el-button>
          <el-button round type="warning" size="mini" icon="el-icon-plus" @click="handlerGridAddClick">新增</el-button>
          <el-button round type="warning" size="mini" icon="el-icon-delete" @click="handlerGridDeleteClick">删除</el-button>
          <el-button round type="warning" size="mini" icon="el-icon-view" @click="handlerGridViewClick">预览</el-button>
        </div>
      </div>

      <div v-if="dialogVisible" >
        <div class="mask" ></div>
        <div class="boxs"  style="width:650px;height:550px;">
          <div style="border-top: 1px #dcdfe6  solid">
            <h4 style="margin:10px 0;"><i></i>{{formTitle?formTitle:'新增表单'}}</h4>
          </div>
          <form-info :data="formData"  :config="formInfoConfig" ref="form-info" style="padding-top: 10px;border-top: 1px #dcdfe6 solid"></form-info>
          <div style="text-align: right;padding: 5px 0px;border-top: 1px #dcdfe6 solid">
            <el-button style=""  type="info" size="mini" @click="dialogVisible = !dialogVisible" >取消</el-button>
            <el-button  type="warning" size="mini" @click="handlerFormInfoSaveClick" >确定</el-button>
          </div>
        </div>
      </div>

      <div v-if="columnDialogVisible" >
        <div class="mask" ></div>
        <div class="boxs"  style="width:850px;height:550px;">
          <div style="border-top: 1px #dcdfe6  solid">
            <h4 style="margin:10px 0;"><i></i>{{columnTitle?columnTitle:'新增配置列'}}</h4>
          </div>
          <form-column  :config="columnConfig" :api-data="apiOptions" ref="column-info" style="padding-top: 10px;border-top: 1px #dcdfe6 solid"></form-column>
          <div style="text-align: right;padding: 5px 0px;border-top: 1px #dcdfe6 solid">
            <el-button style=""  type="info" size="mini" @click="columnDialogVisible = !columnDialogVisible" >取消</el-button>
            <el-button  type="warning" size="mini" @click="handlerColumnInfoSaveClick" >确定</el-button>
          </div>
        </div>
      </div>

      <div v-if="columnSelectDialogVisible" >
        <div class="mask" ></div>
        <div class="boxs"  style="width:700px;height:650px;">
          <div style="border-top: 1px #dcdfe6  solid">
            <h4 style="margin:10px 0;"><i></i>数据库字段选择</h4>
          </div>
          <form-view   ref="column-select" selectFormKey="entity-columns" :multiple-select="true" :query-params="queryParams" style="padding-top: 10px;border-top: 1px #dcdfe6 solid"></form-view>
          <div style="text-align: right;padding: 5px 0px;border-top: 1px #dcdfe6 solid">
            <el-button style=""  type="info" size="mini" @click="columnSelectDialogVisible = !columnSelectDialogVisible" >取消</el-button>
            <el-button  type="warning" size="mini" @click="handlerColumnSelectOkClick" >确定</el-button>
          </div>
        </div>
      </div>

  </div>
</template>

<script>
  import {mixin} from './mixin.js'
  import {commonMixin} from '../../../common/commonMixin.js'
    export default {
        name: "form-config",
        mixins: [mixin,commonMixin]
    }
</script>

<style lang="scss" scoped>
  .jr-container{
    display: flex;
    width: 100%;
    height: 100%;
    flex-flow: initial;
  .jr-tree{
    background-color:transparent;
    width: 350px;
    height: 100%;
    display: flex;
    flex-flow: column;
  .jr-tree-tool{
    padding-top: 5px;
    padding-left: 10px;
    border-bottom: 1px solid #e4e7ed;
    height:37px;
    padding-bottom: 0px;
  }
  .jr-tree-content{
    height:100%;
    display: flex;
    flex-flow: column;
    background-color: transparent;
  }
  }
  .jr-content{
    background-color:transparent;
    padding-left: 10px;
    margin-left: 10px;
    width: 100%;
    height: 100%;

  }
  }
  .jr-tabs{
    height: 100%;
    width: 100%;
    /*display: flex;flex-flow: column;*/
    display: flex;flex-flow: column;
    .jr-tab{
      height: 100%;
      width: 100%;
      margin-right: 10px;
    }
  }

  .mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 98;
    background: rgba(0, 0, 0, 0.6);
  }

  .boxs {
    width: 812px;
    transform: translate(-50%, -50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    height: 391px;
    z-index: 99;
    overflow: hidden;
    padding: 0 15px;
    display: flex;
    flex-flow: column;
    box-sizing: border-box;
  }
</style>

<style>

  #jr-container .el-tabs__content{
    height: 100%;
    width: 100%;
    display: flex;
    /*background-color: red;*/
    /*padding-right: 10px;*/
  }
  .el-tabs__content{
    height: 100%;
    width: 100%;
    display: flex;
    /*background-color: red;*/
    /*padding-right: 10px;*/
  }
  #jr-container .el-tabs__header{
    padding: 0;
    position: relative;
    margin: 0 0 0px;
  }
  .el-tabs__header{
    padding: 0;
    position: relative;
    margin: 0 0 0px;
  }
  .el-tabs__item {
    color: #fff;
  }
</style>
