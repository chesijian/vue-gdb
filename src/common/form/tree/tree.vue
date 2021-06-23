<template>
  <div class="jr-container">
    <!--{{readOnly}}&#45;&#45;{{showCheckBox}}&#45;&#45;{{multipleSelect}}&#45;&#45;{{showCheckBox || multipleSelect}}-->
    <!--<div v-if="!singleSelect && !multipleSelect && config.showTitle" class="jr-title">-->
      <!--<span class="jr-title-content">{{config.title}}</span>-->
    <!--</div>-->
    <div class="jr-query-form">
      <query-form v-if="queryFormVisible" isTree :title="config.title" :hasQuery="hasQuery" :hasTitle="hasTitle" :topButtons="topButtons" :search-visible="searchVisible" :single-select="singleSelect" :multiple-select="multipleSelect" :searchFormColumns="searchFormColumns"  @handlerTopButtonClick="handlerTopButtonClick"  @openForm="handlerFormOpen" @queryData="queryData" :searchFormRows="searchFormRows"></query-form>
    </div>
    <div class="jr-table el-table" style="height: 100%;display: flex;flex-flow: column;">
      <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%">
        <thead class="has-gutter">
        <tr class="" style="height: 44px;">
          <th colspan="1" rowspan="1" class="is-leaf">
            <div class="cell">标题</div>
          </th>
          <th v-if="false && !this.singleSelect && !this.multipleSelect && !this.readOnly" colspan="1" rowspan="1" class="is-center   is-leaf" style="width: 80px;">
            <div class="cell">操作</div>
          </th>
        </tr>
        </thead>
      </table>
      <el-tree
        ref="jr-table"
        style="overflow: auto;"
        :data="gridData"
        highlight-current
        :props="defaultProps"
        :empty-text="emptyText"
        node-key="id"
        :expand-on-click-node="false"
        :default-expand-all="config.expandAll === 1"
        @node-drag-start="handleDragStart"
        @node-drag-enter="handleDragEnter"
        @node-drag-leave="handleDragLeave"
        @node-drag-over="handleDragOver"
        @node-drag-end="handleDragEnd"
        @node-drop="handleDrop"
        @check-change="handlerSelectionChange"
        @node-click="rowClick"
        :draggable="false"
        :render-content="renderContent"
        :show-checkbox="showCheckBox || multipleSelect"
        :load="load"
        :lazy="config.lazy === 1"
        :allow-drop="allowDrop"
        :allow-drag="allowDrag">
      </el-tree>
    </div>
    <!-- 表单编辑页面 -->
    <div v-if="formDialogVisible">
      <div class="mask" ></div>
      <div class="boxs"  :style="{width:formConfig.formWidth?(formConfig.formWidth.indexOf('px')>-1 ? formConfig.formWidth :formConfig.formWidth+'px'):'900px',height:formConfig.formHeight?(formConfig.formHeight.indexOf('px')>-1 ? formConfig.formHeight :formConfig.formHeight+'px'):'600px'}">
        <h4 style="margin:10px 0;"><i></i>{{formConfig.title}}</h4>
        <form-edit :config="formConfig" :openConfig="openConfig" style="height: 100%; overflow-y:auto;margin-bottom: 10px;overflow-x: hidden"> </form-edit>
        <!--<div style="background-color: red;height: 100%;"></div>-->
      </div>
    </div>
    <div v-if="openDialogVisible">
      <div class="mask" ></div>
      <div class="boxs"  :style="{width:openDialogWidth?openDialogWidth+'px':'1000px',height:openDialogHeight?openDialogHeight+'px':'600px'}">
        <div style="">
          <div style="width:100%" v-if="showOpenDialogTitle">
            <h4 style="margin:10px 0;"><i></i>{{openDialogTitle}}</h4>
          </div>
          <div style="width:30%;text-align: right;padding-top: 9px;position: absolute;top: 0px;right: 16px;">
            <i class="el-icon-close" @click="openDialogVisible = !openDialogVisible" style="cursor: pointer;font-size: 20px;"></i>
          </div>
        </div>
        <cmp-loader ref="open-dialog" :vueName="openDialogVueName" :config="openDialogConfig" :style="{'margin-top': showOpenDialogTitle?'0px':'35px'}"></cmp-loader>
        <div  v-if="openDialogConfirmVisible" style="text-align: right;padding: 5px 0px;">
          <el-button style=""  type="info" size="mini" @click="openDialogVisible = !openDialogVisible" >取消</el-button>
          <el-button  type="warning" size="mini" @click="handlerOpenDialogConfirm()">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QueryForm from '../query-form/query-form'
  import CmpLoader from '../../../common/cmp-loader/cmp-loader'
  import {mixin} from './mixin.js'
  import {gridMixin} from '../gridMixin.js'
  import {commonMixin} from '../../commonMixin.js'
  export default {
    name: "tree",
    mixins:[commonMixin,gridMixin,mixin],
    components: {
      CmpLoader,QueryForm // ,FormEdit
    }
  }
</script>

<style scoped>
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
.jr-container{
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 100%;
}

.jr-table{
  margin-top:0px;
}
.jr-pagination{
  background-color: white;
  height: 33px;
  line-height: 35px;
  padding-top: 7px;
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

  .el-button--mini, .el-button--mini.is-round {
    padding: 7px 7px;
  }
  .el-button--mini {
    padding: 7px 7px;
  }



</style>
<style>

  .jr-tree-node{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding-right: 8px;
    width: 100%;
  }
  .jr-tree-node-text{
    width: 100%;
  }
  .jr-tree-node-tool{
    width: 65px;
    text-align: center;
  }

  .jr-pageStyleChange.el-pagination .el-pagination__total{
    margin-right: 0;
  }
  .jr-pageStyleChange.el-pagination .el-select .el-input{
    width: 70px;
  }
  .jr-pageStyleChange.el-pagination .el-select .el-input .el-input__inner{
    padding-right: 13px;
  }
  .jr-pageStyleChange.el-pagination .el-input__icon{
    width: 16px;
  }
  .jr-pageStyleChange.el-pagination .el-pagination__sizes{
    margin-right: 0px;
  }
  .jr-pageStyleChange.el-pagination .btn-prev{
    padding-right: 0;
  }
  .jr-pageStyleChange.el-pagination .btn-next{
    padding-left: 0px;
  }

  .el-tree-node__content {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 26px;
    cursor: pointer;
    padding: 12px 0;
    min-width: 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    text-overflow: ellipsis;
    vertical-align: middle;
    position: relative;
    text-align: left;
    height: 45px;
    border-bottom: 1px solid #EBEEF5;
    min-width: 50px!important;
  }

  div[class='el-tree-node__content']:nth-child(2n+1) {
    /* 匹配偶数行 //even*/
    /*background: #FAFAFA;*/
  }

  .el-tree-node__row--striped {
    background: #FAFAFA;
  }
</style>
