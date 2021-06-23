<template>
  <div id="jr-form" :style="{'height': '100%','overflow':'hidden','width': '100%'}">
    <!-- 单页面 -->
    <template v-if="singleQuery">
      <div class="jr-center">
        <tree :level="1" ref="queryForm1" :isTree="true" v-if="queryForm[1].type === 4 && queryForm[1].show" :readOnly="queryForm[1].readOnly" :queryParams="routeQuery != null ?routeQuery:queryParams" :config="queryForm[1]" :single-select="queryForm[1].singleSelect" :multiple-select="queryForm[1].multipleSelect"></tree>
        <grid-tree-table :level="1" ref="queryForm1" :isTree="true" v-if="queryForm[1].type === 2 && queryForm[1].show" :readOnly="queryForm[1].readOnly" :queryParams="routeQuery != null ?routeQuery:queryParams" :config="queryForm[1]" :single-select="queryForm[1].singleSelect" :multiple-select="queryForm[1].multipleSelect"></grid-tree-table>
        <grid-tree-table :level="1" ref="queryForm1" v-if="queryForm[1].type === 1 && queryForm[1].show" :readOnly="queryForm[1].readOnly" :queryParams="routeQuery != null ?routeQuery:queryParams"  :hasTitle="hasTitle" :config="queryForm[1]"  :showCheckBox="queryForm[1].showCheckBox" :single-select="queryForm[1].singleSelect" :multiple-select="queryForm[1].multipleSelect"></grid-tree-table>
      </div>
    </template>
    <!-- 左右或者上下 -->
    <template v-if="cascadeTwoQuery">
      <div :class="formConfig.layout&&formConfig.layout === 2 ? 'jr-cascade-UpperAndLower' :'jr-cascade'">
      <!-- 第一层 -->
      <div :class="formConfig.layout&&formConfig.layout === 2 ? 'jr-cascade-left-UpperAndLower' :'jr-cascade-left'" :style="treeTableStyle">
        <tree :cascade="true" :level="1"  ref="queryForm1" :isTree="true" v-if="queryForm[1].show && queryForm[1].type === 4" :readOnly="queryForm[1].readOnly" :showCheckBox="queryForm[1].showCheckBox" :single-select="queryForm[1].singleSelect" :queryParams="routeQuery != null ?routeQuery:queryParams" :multiple-select="queryForm[1].multipleSelect" :config="queryForm[1]" :isLeft="true" @handlerRowClick="((row)=>{handlerRowClick(2, row)})"></tree>
        <grid-tree-table :cascade="true" :level="1" ref="queryForm1" :isTree="true" v-if="queryForm[1].show && queryForm[1].type === 2" :readOnly="queryForm[1].readOnly" :showCheckBox="queryForm[1].showCheckBox"  :single-select="queryForm[1].singleSelect" :queryParams="routeQuery != null ?routeQuery:queryParams" :multiple-select="queryForm[1].multipleSelect" :config="queryForm[1]" :isLeft="true" @handlerRowClick="((row)=>{handlerRowClick(2, row)})"></grid-tree-table>
        <grid-tree-table :cascade="true" :level="1"  ref="queryForm1" v-if="queryForm[1].show && queryForm[1].type === 1" :readOnly="queryForm[1].readOnly" :showCheckBox="queryForm[1].showCheckBox"  :hasTitle="hasTitle" :queryParams="routeQuery != null ?routeQuery:queryParams" :config="queryForm[1]" :single-select="queryForm[1].singleSelect" :isLeft="true" :multiple-select="queryForm[1].multipleSelect" @handlerRowClick="((row)=>{handlerRowClick(2, row)})"></grid-tree-table>
      </div>
      <!-- 第二层 -->
        <div :class="formConfig.layout&&formConfig.layout === 2 ? 'jr-cascade-content-UpperAndLower' :'jr-cascade-content'" :style="jrCascadeContentStyle">
          <!-- 多个tab -->
          <template v-if="queryForm[2] && queryForm[2].children && queryForm[2].children.length>0">

            <el-tabs id="jr-form-view"  v-model="activeName" @tab-click="handleTabClick" class="jr-tabs">
              <el-tab-pane v-for="(tabForm, index) in queryForm[2].children" :key="tabForm.key" :label="tabForm.title" :name="tabForm.key" class="jr-tab">
                <grid-tree-table :cascade="true" :level="2" :autoLoad="false" ref="queryForm2" :config="tabForm" :readOnly="tabForm.readOnly" :queryParams="routeQuery != null ? routeQuery:queryParams"  :hasTitle="hasTitle" :hasQuery="false" :single-select="tabForm.singleSelect" :searchVisible="false" :multiple-select="false"  @handlerRowClick="((row)=>{handlerRowClick(3, row)})"></grid-tree-table>
                <!--<div style="height: 100%;width: 100%;background-color: red"></div>-->
              </el-tab-pane>
            </el-tabs>

            <div v-if="searchVisible" :class="formConfig.layout&&formConfig.layout === 2 ? 'jr-cascade-tool-lower' :'jr-cascade-tool-upper'">
              <div  style="float:left;margin-right:10px;">
                <el-input placeholder="请输入关键字" @keyup.enter.native="queryData()" size="mini" v-model="keyword" class="input-with-select"></el-input>
              </div>
              <el-button  round type="warning" size="mini" @click="queryData()" icon="el-icon-search">查询</el-button>
              <div v-if="topButtons && topButtons.length>0" style="float:right;margin-left:10px;">
                <el-button v-for="(button,index) in topButtons" v-if="button.hidden === undefined || button.hidden === false" :key="index" round type="warning" size="mini" :icon="button.icon" @click="handlerTopButtonClick(button)">{{button.title}}</el-button>
              </div>
            </div>

          </template>
          <!-- 单个页面 -->
          <template>
            <tree :cascade="true" :level="2" :autoLoad="false" :isTree="true" ref="queryForm2" v-if="queryForm[2].show && queryForm[2].type === 4" :readOnly="queryForm[2].readOnly" :single-select="queryForm[2].singleSelect" :queryParams="routeQuery != null ?routeQuery:queryParams" :multiple-select="queryForm[2].multipleSelect" :config="queryForm[2]" @handlerRowClick="((row)=>{handlerRowClick(3, row)})"></tree>
            <grid-tree-table :cascade="true" :level="2" :autoLoad="false" :isTree="true" ref="queryForm2" v-if="queryForm[2].show && queryForm[2].type === 2" :readOnly="queryForm[2].readOnly" :single-select="queryForm[2].singleSelect" :queryParams="routeQuery != null ?routeQuery:queryParams" :multiple-select="queryForm[2].multipleSelect" :config="queryForm[2]" @handlerRowClick="((row)=>{handlerRowClick(3, row)})"></grid-tree-table>
            <grid-tree-table :cascade="true" :level="2" :autoLoad="false" ref="queryForm2" v-if="queryForm[2].show && queryForm[2].type === 1" :readOnly="queryForm[2].readOnly" :single-select="queryForm[2].singleSelect"  :hasTitle="hasTitle" :queryParams="routeQuery != null ?routeQuery:queryParams" :multiple-select="queryForm[2].multipleSelect" :config="queryForm[2]" @handlerRowClick="((row)=>{handlerRowClick(3, row)})"></grid-tree-table>
          </template>

        </div>
      </div>
    </template>

    <!-- 左右(上下) -->
    <template v-if="cascadeThreeQuery">

    </template>

  </div>
</template>

<script>
  import {mixin} from './mixin.js'
  import {commonMixin} from '../../commonMixin.js'
  // import TreeTable from '../grid-tree-table/grid-tree-table'
  // import GridTable from '../grid-tree-table/grid-tree-table'
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
    border-top: 1px solid #ebeef5;
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

  .jr-cascade-tool-upper{
    position: absolute;right: 30px;top: 105px;
  }
.jr-cascade-tool-lower{
  position: absolute;
  right: 30px;
  margin-top: 6px;
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

  .boxs h4 {
    color: #333;
  }
</style>
