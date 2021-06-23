<template>
  <div class="jr-container">
    <!--<div v-if="!singleSelect && !multipleSelect && config.showTitle" class="jr-title">-->
      <!--<span class="jr-title-content">{{config.title}}</span>-->
    <!--</div>-->
    <div class="jr-query-form">
      <query-form v-if="queryFormVisible" :title="config.title" :hasQuery="hasQuery" :hasTitle="hasTitle" :topButtons="topButtons" :search-visible="searchVisible" :single-select="singleSelect" :multiple-select="multipleSelect" :searchFormColumns="searchFormColumns"  @openForm="handlerFormOpen" @queryData="queryData" :searchFormRows="searchFormRows"></query-form>
    </div>
    <div class="jr-table" style="height: 100%;display: flex;flex-flow: column;" v-loading="loading" element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table
        :highlight-current-row="true"
        ref="jr-table"
        size="mini"
        :data="gridData"
        stripe
        height="100%"
        :fit="true"
        @selection-change="handlerSelectionChange"
        @row-click="rowClick"
        :empty-text="emptyText"
        style="width: 100%;margin-bottom:1px;">
        <el-table-column
          v-if="((!singleSelect && !isLeft) || multipleSelect) && gridColumns.length>0"
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column
          v-if="gridColumns.length>0"
          type="index"
          width="40">
        </el-table-column>
        <el-table-column v-if="!readOnly && gridColumns.length>0 && !singleSelect && !multipleSelect && ((showRowEditButton && config.btnEdit == 1) || (showRowDeleteButton && config.btnDelete == 1))"
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

        <el-table-column v-if="gridColumns.length>0 && (config.ifHasProcess && config.ifHasProcess === 1)"
                         label="审批状态"
                         show-overflow-tooltip
                         width="70"
                         align="center">
          <template slot-scope="scope">
            <span  v-if="scope.row['PROC_STATUS_'] === '未审' " class="jr-tag-5">
             {{scope.row['PROC_STATUS_'] }}
            </span>
            <span  v-else-if="scope.row['PROC_STATUS_'] === '已审'" class="jr-tag-1">
              {{scope.row['PROC_STATUS_'] }}
            </span>
            <span  v-else-if="scope.row['PROC_STATUS_'] === '送审' "  class="jr-tag-2">
              {{scope.row['PROC_STATUS_'] }}
            </span>
            <span  v-else-if="scope.row['PROC_STATUS_'] === '-5'" class="jr-tag-1">
              已审
            </span>
            <span  v-else-if="scope.row['PROC_STATUS_'] === '-1'" class="jr-tag-2">
              送审
            </span>
            <span  v-else class="jr-tag-5">
             未审
            </span>
          </template>
        </el-table-column>

        <el-table-column
          v-if="!column.hidden"
          v-for="(column,index) in gridColumns" :key="index"
          :prop="column.columnName"
          :sortable="column.columnName === 'SORT_' || column.columnName === 'sort' || column.columnName === 'CREATE_TIME_'"
          :header-align="column.titleAlign || 'center'"
          :align="column.dataAlign  || 'center'"
          :label="column.title"
          :min-width="column.width">
          <template slot-scope="scope">
            <span :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-if="(column.widgetType === 'select-dic' || column.widgetType === 'select-sql')" @click="cellClick(scope.$index,scope.row,column)"> {{dicValue(column,scope.row[column.columnName])}}</span>
            <!--<span :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-if="(column.widgetType === 'select-dic' && dicData[column.attr])" @click="cellClick(scope.row,column)"> {{ dicData[column.attr][scope.row[column.columnName]] }}</span>-->
            <span :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-else-if="(column.widgetType === 'select' )" @click="cellClick(scope.$index,scope.row,column)"> {{dicValue(column,scope.row[column.columnName])}}</span>
            <span :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-else-if="(column.widgetType === 'switch' )" >

              <!--{{scope.row[column.columnName]}}&#45;&#45;{{scope.row[column.columnName+'_SWITCH']}}-->
              <!--<el-switch v-model="scope.row[column.columnName]" active-value="1" inactive-value=0-->
                <!--disabled> </el-switch>-->
              <el-switch v-model="scope.row[column.columnName+'_SWITCH']" active-value="true" inactive-value="false" disabled> </el-switch>
            </span>

            <span :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-else-if="(column.javaType === 'CellButton' )" >
                <i type="warning" :class="column.icon"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
                   @click="handleRowButtonClick(column,scope.$index, scope.row)">
                </i>
            </span>
            <span  v-else-if="(column.widgetType === 'pic-view' )" >
              <div  style="margin:8px;">
                <a :href="computePicView(column, scope.row)" target="_blank">
                <img :src="computePicView(column, scope.row)" :style="{width: column.width,height: column.height}">
                  </img>
              </a>
                </div>
            </span>
            <span :style="{'cursor':(column.openParams && column.openUrl) || (column.sourceType === 'api' && column.sourceAttr )?'pointer':''}" v-else-if="(column.widgetType === 'tag' )" >

              <span @click="handleRowButtonClick(column,scope.$index, scope.row)" :class="column.tabMap?column.tabMap[scope.row[column.columnName]]:'jr-tag-1'">{{scope.row[column.columnName] }}</span>
            </span>
            <span
              :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}"
              v-else-if="(column.widgetType === 'select-user' ||
              column.widgetType === 'select-depart'||
              column.widgetType === 'select-role' ||
              column.widgetType === 'select-form' ||
              column.columnName === 'CREATE_USER_'||
              column.columnName === 'UPDATE_USER_'||
              column.columnName === 'SUB_COMPANY_'||
              column.columnName === 'COMPANY_')"
              @click="cellClick(scope.$index,scope.row,column)"> {{ scope.row[column.columnName +'LABEL_'] }}</span>
            <span
              :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}"
              v-else-if="(column.widgetType === 'select-date' || column.widgetType === 'select-time' || column.widgetType === 'select-date-time')"
              @click="cellClick(scope.$index,scope.row,column)"> {{ formatDate(column,scope.row) }}</span>
            <span :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-else @click.stop.prevent="cellClick(scope.$index,scope.row,column)">
              {{scope.row[column.columnName] }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div >
        <el-pagination
          class="jr-pagination"
          small
          :pager-count="isLeft ? 5 : 11"
          @size-change="((pageSize)=>{handleSizeChange(pageSize)})"
          @current-change="((pageIndex)=>{handleCurrentChange( pageIndex)})"
          :current-page="pageIndex"
          :page-sizes="[20, 30, 50, 100, 500]"
          :page-size="pageSize"
          :layout="isLeft ? 'total, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
          :total="totalCount">
        </el-pagination>
      </div>
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
        <cmp-loader :vueName="openDialogVueName" :config="openDialogConfig" :style="{'margin-top': showOpenDialogTitle?'0px':'35px'}"></cmp-loader>
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
    name: "grid-table",
    mixins:[mixin,gridMixin,commonMixin],
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
    display: inline-grid;
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
</style>

