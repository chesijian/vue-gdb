<template>
  <div class="jr-container" >
    <!--<div v-if="!singleSelect &&  !multipleSelect && config.showTitle" class="jr-title">-->
      <!--<span class="jr-title-content">{{config.title}}</span>-->
    <!--</div>-->
    <div class="jr-query-form" >
      <query-form v-if="queryFormVisible" :title="config.title" :topButtons="topButtons" :single-select="singleSelect" :multiple-select="multipleSelect" :searchFormColumns="searchFormColumns" @openForm="handlerFormOpen" @queryData="queryData" :searchFormRows="searchFormRows"></query-form>
    </div>

    <!--<div style="height: 100%;background-color: red">-->
    <!--</div>-->
    <div style="height: 100%;display: flex;flex-flow: column;">
      <el-table :data="treeData"
                ref="jr-table"
                size="mini"
                :default-expand-all="config.expandAll == 1"
                :highlight-current-row="true"
                :row-style="showTr" type="expand" :cell-style="{textAlign:'left',}"
                :header-row-style="{height:'47px'}"
                @selection-change="handlerSelectionChange"
                @row-click="rowClick"
                stripe
                height="100%"
                :fit="true"
      >
        <!--<div v-for="(column, index) in treeColumns" :key="column.dataIndex">-->
        <el-table-column  v-for="(column, index) in treeColumns" :key="column.dataIndex" :label="column.text" :min-width="column.width" >
          <template  slot-scope="scope">
            <span v-if="column.treeColumn" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
            <!--<span v-if="toggleIconShow(column,index,scope.row)" class="ms-tree-space" style="width: 21px;"></span>-->
            <button class="button is-outlined is-primary is-small" v-if="toggleIconShow(column,index,scope.row)" @click="toggle(scope.$index)">
              <i v-if="!scope.row._expanded" class="el-icon-caret-right jr-tree-icon" aria-hidden="true"></i>
              <i v-if="scope.row._expanded" class="el-icon-caret-bottom jr-tree-icon" aria-hidden="true"></i>
            </button>
            <span v-else-if="column.treeColumn" class="ms-tree-space"></span>
            <el-input v-model="scope.row[column.dataIndex]" v-if="column.typeDisp == '部门配置' && haveButton"  suffix-icon="el-icon-more" @click.native="selectQuerters(scope.row)"></el-input>
            <span>{{scope.row[column.dataIndex]}}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="treeColumns.length>0 && !singleSelect && !multipleSelect && ((showRowEditButton && config.btnEdit == 1) || (showRowDeleteButton && config.btnDelete == 1))"
                         label="操作"
                         show-overflow-tooltip
                         width="65"
                         align="center">
          <template slot-scope="scope">
            <el-button-group>
              <i v-if="showRowEditButton && config.btnEdit == 1" type="warning" class="el-icon-edit"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
                 @click="handleEdit(scope.$index, scope.row)">
              </i>
              <i v-if="showRowDeleteButton && config.btnDelete == 1" type="danger" class="el-icon-delete"  size="mini" style="margin-left:5px;font-size: 13pt;cursor: pointer;color: red;"
                 @click="handleDelete(scope.$index, scope.row)">
              </i>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 表单编辑页面 -->
    <div v-if="formDialogVisible">
      <div class="mask" ></div>
      <div class="boxs"  :style="{width:config.formWidth?config.formWidth:'500px',height:config.formHeight?config.formHeight:'500px'}">
        <h4 style="margin:10px 0;"><i></i>{{formConfig.title}}</h4>
        <form-edit :config="formConfig" :openConfig="openConfig" style="height: 100%; overflow-y:auto;margin-bottom: 10px;"> </form-edit>
      </div>
    </div>
  </div>
</template>

<script>
  import QueryForm from '../query-form/query-form'
  import {mixin} from './mixin.js'
  import {gridMixin} from '../gridMixin.js'
  export default {
    name: "sp-tree-table",
    mixins:[mixin,gridMixin],
    components: {
      QueryForm // ,FormEdit
    }
  }
</script>

<style scoped>
  .jr-container{
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
  }
  .jr-title{
    width:100%;
    vertical-align: middle;
    background-color: #e6a23c;
    line-height: 40px;
    height:40px;
  }
  .jr-title-content{
    margin-left: 10px;
  }
  .jr-query-form{
    /*height: 50px;*/
  }
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
  }

  .ms-tree-space::before {
    content: ""
  }

  table td {
    line-height: 26px;
  }

  .jr-tree-icon {
    background-color: white;
    border: 0px;
    line-height: 18px;
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
  #jr-form .el-dialog__body {
    padding: 0px 10px 10px 10px;
    color: #606266;
    font-size: 14px;
  }
</style>
