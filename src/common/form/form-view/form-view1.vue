<template>
  <div id="jr-form" :style="{'height': '100%','overflow':'hidden'}">
    <div v-if="cascadeShow" :class="formConfig.layout&&formConfig.layout === 2 ? 'jr-cascade-UpperAndLower' :'jr-cascade'">
      <div :class="formConfig.layout&&formConfig.layout === 2 ? 'jr-cascade-left-UpperAndLower' :'jr-cascade-left'" :style="treeTableStyle">
          <sp-tree-table ref="queryForm1" v-if="queryForm[1].show && queryForm[1].type === 2" :single-select="singleSelect" :queryParams="routeQuery != null ?routeQuery:queryParams" :multiple-select="multipleSelect" :config="queryForm[1]" :isLeft="true" @handlerRowClick="((row)=>{handlerRowClick(2, row)})"></sp-tree-table>
          <grid-table ref="queryForm1" v-if="queryForm[1].show && queryForm[1].type === 1" :readOnly="readOnly" :hasTitle="hasTitle" :queryParams="routeQuery != null ?routeQuery:queryParams" :config="queryForm[1]" :single-select="singleSelect" :isLeft="true" :multiple-select="multipleSelect" @handlerRowClick="((row)=>{handlerRowClick(2, row)})"></grid-table>
      </div>
      <div :class="formConfig.layout&&formConfig.layout === 2 ? 'jr-cascade-content-UpperAndLower' :'jr-cascade-content'" :style="jrCascadeContentStyle">
        <sp-tree-table :autoLoad="false" ref="queryForm2" v-if="queryForm[2].show && queryForm[2].type === 2" :single-select="singleSelect" :queryParams="routeQuery != null ?routeQuery:queryParams" :multiple-select="multipleSelect" :config="queryForm[2]" @handlerRowClick="((row)=>{handlerRowClick(3, row)})"></sp-tree-table>
        <grid-table :autoLoad="false" ref="queryForm2" v-if="queryForm[2].show && queryForm[2].type === 1" :readOnly="readOnly" :single-select="singleSelect"  :hasTitle="hasTitle" :queryParams="routeQuery != null ?routeQuery:queryParams" :multiple-select="multipleSelect" :config="queryForm[2]" @handlerRowClick="((row)=>{handlerRowClick(3, row)})"></grid-table>
      </div>
      <!-- 多个grid-table渲染 -->
      <el-tabs v-if="queryForm[3].show" id="jr-form-view"  v-model="activeName" @tab-click="handleTabClick" class="jr-tabs">
        <el-tab-pane v-for="(tabForm, index) in queryForm[3].tabs" :key="tabForm.key" :label="tabForm.title" :name="tabForm.key" class="jr-tab">
          <grid-table :autoLoad="false" ref="queryForm3" :config="tabForm" :readOnly="readOnly" :queryParams="routeQuery != null ? routeQuery:queryParams"  :hasTitle="hasTitle" :hasQuery="false" :single-select="singleSelect" :searchVisible="false" :multiple-select="false" :style="{width:(width-390)+'px'}" @handlerRowClick="((row)=>{handlerRowClick(3, row)})"></grid-table>
          <!--<div style="height: 100%;width: 100%;background-color: red"></div>-->
        </el-tab-pane>
      </el-tabs>

      <div style="position: absolute;right: 30px;top: 103px;">
        <div v-if="searchVisible" style="float:left;margin-right:10px;">
          <el-input placeholder="请输入关键字" @keyup.enter.native="queryData()" size="mini" v-model="keyword" class="input-with-select"></el-input>
        </div>
        <el-button v-if="searchVisible" round type="warning" size="mini" @click="queryData()" icon="el-icon-search">查询</el-button>
        <div v-if="topButtons && topButtons.length>0" style="float:right;margin-left:10px;">
            <el-button v-for="(button,index) in topButtons" v-if="button.hidden === undefined || button.hidden === false" :key="index" round type="warning" size="mini" :icon="button.icon" @click="handlerTopButtonClick(button)">{{button.title}}</el-button>
        </div>
      </div>
    </div>
    <div v-if="singleQuery" class="jr-center">
      <sp-tree-table ref="queryForm1" v-if="queryForm[1].type === 2 && queryForm[1].show" :queryParams="routeQuery != null ?routeQuery:queryParams" :config="queryForm[1]" :single-select="singleSelect" :multiple-select="multipleSelect"></sp-tree-table>
      <grid-table ref="queryForm1" v-if="queryForm[1].type === 1 && queryForm[1].show" :readOnly="readOnly" :queryParams="routeQuery != null ?routeQuery:queryParams"  :hasTitle="hasTitle" :config="queryForm[1]" :single-select="singleSelect" :multiple-select="multipleSelect"></grid-table>
    </div>
  </div>
</template>

<script>
  import {mixin} from './mixin.js'
  import {commonMixin} from '../../commonMixin.js'
  // import TreeTable from '../sp-tree-table/sp-tree-table'
  // import GridTable from '../grid-table/grid-table'
    export default {
      name: "form-view",
      mixins:[mixin],
      components: {
        // TreeTable,GridTable
      },
      computed:{
        treeTableStyle:function(){
          let style = {
            'width': this.queryForm[1].gridWidth
          };
          var height = document.body.clientHeight;
          height = height-235;
          return style
        },
        jrCascadeContentStyle:function(){
          var height = document.body.clientHeight;
          // height = height-263;
          height = height-150;
          let style = {
            // 'height': height+'px'
          };
          //let queryHeight = document.getElementById("jr-cascade-content-query-2").clientHeight;
          //let formHeight = document.getElementById("jr-cascade-content-form-2").clientHeight;
          //console.info(queryHeight+'-----------'+formHeight)
          return style
        }
      }
    }
</script>

<style scoped>
/* 上下 */
  .jr-cascade-UpperAndLower{
      height: 100%;
      overflow-y: auto;
   }
  .jr-cascade-left-UpperAndLower{
    width:100%;
    flex-shrink: 0;
    height: 50%;
  }
  .jr-cascade-content-UpperAndLower{
    display: flex;
    flex-flow: column;
    overflow-y: auto;
    width:100%;
    height: 50%;
  }
  /* 左右 */
  .jr-cascade{
     display: flex;
      height: 100%;
   }
  .jr-cascade-left{
    width:25%;
    flex-shrink: 0;
    flex-flow: column;
    height: 100%;
  }
  .jr-cascade-content{
    margin-left:20px;
    display: flex;
    flex-flow: column;
    overflow-y: auto;
    width:100%;
    height: 100%;
  }
  .jr-tabs{
    background-color: white;
    display: flex;
    height: 100%;
    flex-flow: column;
  }
  .jr-center{
    height: 100%;
  }
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
</style>
<style>

  #jr-form .el-col{
    border-radius: 4px;
    margin-left: 0px;

  }
  #jr-form .el-button--mini, .el-button--mini.is-round {
    padding: 7px 7px;
  }
  #jr-form .el-row{
    margin-bottom: 0px;

  }
  .el-button--mini{
    padding: 7px 7px;
  }

  #jr-form .el-tabs__content{
    height: 100%;
    display: flex;
  }
  #jr-form .el-tabs__header{
    padding: 0;
    position: relative;
    margin: 0 0 8px;
  }
  /* margin-bottom: 20px; */

  #jr-form-view .el-tabs__header {
    padding-left: 10px!important;
  }
</style>
