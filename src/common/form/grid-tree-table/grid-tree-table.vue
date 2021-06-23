<template>
  <div class="jr-container" style="position: relative;">
    <!--<div v-if="!singleSelect && !multipleSelect && config.showTitle" class="jr-title">-->
      <!--<span class="jr-title-content">{{config.title}}</span>-->
    <!--</div>-->
    <div class="jr-query-form">
      <query-form ref="query-form" v-if="queryFormVisible" :title="config.title" :hasQuery="hasQuery" :hasTitle="hasTitle" :topButtons="topButtons" :search-placeholder="searchPlaceholder" :search-visible="searchVisible" :single-select="singleSelect" :multiple-select="multipleSelect" :searchFormColumns="searchFormColumns" @handlerTopButtonClick="handlerTopButtonClick" @openForm="handlerFormOpen" @queryData="queryData" :searchFormRows="searchFormRows"></query-form>
    </div>
    <div id="grid-tree-table" class="jr-table"  v-loading="loading" element-loading-text="拼命加载中"
         element-loading-spinner="el-icon-loading"
         element-loading-background="rgba(0, 0, 0, 0.8)" style="height: 100%;display: flex;flex-flow: column;">
      <el-table
        :highlight-current-row="true"
        :show-overflow-tooltip="true"
        ref="jr-table"
        size="mini"
        :data="gridData"
        row-key="id"
        :lazy="config.lazy === 1"
        :default-expand-all="config.expandAll == 1"
        :load="load"
        :tree-props="{children: 'children'}"
        stripe
        height="100%"
        :fit="true"
        @selection-change="handlerSelectionChange"
        @toggleRowExpansion="toggleRowExpansion"
        @row-click="rowClick"
        :empty-text="emptyText"
        style="width: 100%;margin-bottom:1px;">
        <!-- <el-table-column
          v-if="((!singleSelect && !isLeft) || multipleSelect) && gridColumns.length>0"
          type="selection"
          width="40">
        </el-table-column> -->
         <el-table-column
           v-if="(multipleSelect || showCheckBox)&& gridColumns.length>0"
          type="selection"
          width="40">
        </el-table-column>
        <el-table-column
          v-if="!isTree && gridColumns.length>0"
          show-overflow-tooltip
          type="index"
          width="40">
        </el-table-column>
        <el-table-column v-if="!isTree && !readOnly && !singleSelect && !multipleSelect && gridColumns.length>0  && ((showRowEditButton && config.btnEdit == 1) || (showRowDeleteButton && config.btnDelete == 1))"
          label="操作"
          width="65"
          align="center">
          <template slot-scope="scope">
            <el-button-group>
              <i v-if="showRowEditButton && config.btnEdit == 1  && !readOnly && !singleSelect && !multipleSelect" type="warning" class="el-icon-edit"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
                  @click="handleEdit(scope.$index, scope.row)">
              </i>
              <i v-if="showRowDeleteButton && config.btnDelete == 1 && !readOnly && !singleSelect && !multipleSelect" type="danger" class="el-icon-delete"  size="mini" style="margin-left:5px;font-size: 13pt;cursor: pointer;color: red;"
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
            <span v-else-if="scope.row['PROC_STATUS_'] === '已审'" class="jr-tag-1">
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
          v-for="(column,index) in moreColumns" :key="index"
          :prop="column.columnName"
          :sortable="column.columnName === 'SORT_' || column.columnName === 'sort' || column.columnName === 'CREATE_TIME_'"
          :header-align="column.dataAlign ? column.dataAlign : isTree ? 'left':'center'"
          :align="column.dataAlign ? column.dataAlign : isTree ? 'left':'center'"
          show-overflow-tooltip
          :label="column.title"
          :min-width="column.width">
          <el-table-column
            v-if="edit!=undefined"
            :prop="edit.columnName"
            :sortable="edit.columnName === 'SORT_' || edit.columnName === 'sort' || edit.columnName === 'CREATE_TIME_'"
            :header-align="edit.dataAlign ? edit.dataAlign : isTree ? 'left':'center'"
            :align="edit.dataAlign ? edit.dataAlign : isTree ? 'left':'center'"
            show-overflow-tooltip
            :label="edit.title"
            :min-width="edit.width"
            v-for="(edit,j) in column.children" :key="j">
            <template slot-scope="scope">
              <span :style="{'color':(edit.openParams && edit.openUrl)?'blue':'' ,'cursor':(edit.openParams && edit.openUrl)?'pointer':''}" v-if="(edit.widgetType === 'select-dic' || edit.widgetType === 'select-sql')" @click="cellClick(scope.$index,scope.row,edit)"> {{dicValue(edit,scope.row[edit.columnName])}}</span>
              <!--<span :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-if="(column.widgetType === 'select-dic' && dicData[column.attr])" @click="cellClick(scope.row,column)"> {{ dicData[column.attr][scope.row[column.columnName]] }}</span>-->
              <span :style="{'color':(edit.openParams && edit.openUrl)?'blue':'' ,'cursor':(edit.openParams && edit.openUrl)?'pointer':''}" v-else-if="(edit.widgetType === 'select' )" @click="cellClick(scope.$index,scope.row,edit)"> {{dicValue(edit,scope.row[edit.columnName])}}</span>
              <span :style="{'color':(edit.openParams && edit.openUrl)?'blue':'' ,'cursor':(edit.openParams && edit.openUrl)?'pointer':''}" v-else-if="(edit.widgetType === 'switch' )" >
                <el-switch v-model="scope.row[edit.columnName+'_SWITCH']" active-value="true" inactive-value="false" disabled> </el-switch>
              </span>
              <span :style="{'color':(edit.openParams && edit.openUrl)?'blue':'' ,'cursor':(edit.openParams && edit.openUrl)?'pointer':''}" v-else-if="(edit.javaType === 'CellButton' )" >
                  <i type="warning" :class="edit.icon"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
                    @click="handleRowButtonClick(edit,scope.$index, scope.row)">
                  </i>
              </span>
              <span v-else-if="(edit.widgetType === 'pic-view' )" >
                <div style="margin:8px;">
                  <a :href="computePicView(edit, scope.row)" target="_blank">
                  <img :src="computePicView(edit, scope.row)" :style="{width: edit.width,height: edit.height}">
                    </img>
                </a>
                  </div>
              </span>
              <span  v-else-if="edit.widgetType === 'progress'" >
                <el-progress :percentage="scope.row[edit.columnName]" style="text-align: left;" ></el-progress>
              </span>
              <span :style="{'cursor':(edit.openParams && edit.openUrl) || (edit.sourceType === 'api' && edit.sourceAttr )?'pointer':''}" v-else-if="(edit.widgetType === 'tag' )" >
                <span @click="handleRowButtonClick(edit,scope.$index, scope.row)" :class="edit.tabMap?edit.tabMap[scope.row[edit.columnName]]:'jr-tag-1'">{{scope.row[edit.columnName] }}</span>
              </span>
              <span
                :style="{'color':(edit.openParams && edit.openUrl)?'blue':'' ,'cursor':(edit.openParams && edit.openUrl)?'pointer':''}"
                v-else-if="(edit.widgetType === 'select-user' ||
                edit.widgetType === 'select-depart'||
                edit.widgetType === 'select-role' ||
                edit.widgetType === 'select-form' ||
                edit.columnName === 'CREATE_USER_'||
                edit.columnName === 'UPDATE_USER_'||
                edit.columnName === 'SUB_COMPANY_'||
                edit.columnName === 'COMPANY_')"
                @click.stop="cellClick(scope.$index,scope.row,edit)"> {{ scope.row[edit.columnName +'LABEL_'] }}</span>
              <span
                :style="{'color':(edit.openParams && edit.openUrl)?'blue':'' ,'cursor':(edit.openParams && edit.openUrl)?'pointer':''}"
                v-else-if="(edit.widgetType === 'select-date' || edit.widgetType === 'select-time' || edit.widgetType === 'select-date-time')"
                @click="cellClick(scope.$index,scope.row,edit)"> {{ formatDate(edit,scope.row) }}</span>
              <span :style="{'color':(edit.openParams && edit.openUrl)?'blue':'' ,'cursor':(edit.openParams && edit.openUrl)?'pointer':''}" v-else @click.stop.prevent="cellClick(scope.$index,scope.row,edit)">
                {{scope.row[edit.columnName] }}
              </span>
            </template>
            <el-table-column
              v-if="edit1!=undefined"
              :prop="edit1.columnName"
              :sortable="edit1.columnName === 'SORT_' || edit1.columnName === 'sort' || edit1.columnName === 'CREATE_TIME_'"
              :header-align="edit1.dataAlign ? edit1.dataAlign : isTree ? 'left':'center'"
              :align="edit1.dataAlign ? edit1.dataAlign : isTree ? 'left':'center'"
              show-overflow-tooltip
              :label="edit1.title"
              :min-width="edit1.width"
              v-for="(edit1,k) in edit.children" :key="k">
              <template slot-scope="scope">
              <span :style="{'color':(edit1.openParams && edit1.openUrl)?'blue':'' ,'cursor':(edit1.openParams && edit1.openUrl)?'pointer':''}" v-if="(edit1.widgetType === 'select-dic' || edit1.widgetType === 'select-sql')" @click="cellClick(scope.$index,scope.row,edit1)"> {{dicValue(edit1,scope.row[edit1.columnName])}}</span>
              <!--<span :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-if="(column.widgetType === 'select-dic' && dicData[column.attr])" @click="cellClick(scope.row,column)"> {{ dicData[column.attr][scope.row[column.columnName]] }}</span>-->
              <span :style="{'color':(edit1.openParams && edit1.openUrl)?'blue':'' ,'cursor':(edit1.openParams && edit1.openUrl)?'pointer':''}" v-else-if="(edit1.widgetType === 'select' )" @click="cellClick(scope.$index,scope.row,edit1)"> {{dicValue(edit1,scope.row[edit1.columnName])}}</span>
              <span :style="{'color':(edit1.openParams && edit1.openUrl)?'blue':'' ,'cursor':(edit1.openParams && edit1.openUrl)?'pointer':''}" v-else-if="(edit1.widgetType === 'switch' )" >
                <el-switch v-model="scope.row[edit1.columnName+'_SWITCH']" active-value="true" inactive-value="false" disabled> </el-switch>
              </span>
              <span :style="{'color':(edit1.openParams && edit1.openUrl)?'blue':'' ,'cursor':(edit1.openParams && edit1.openUrl)?'pointer':''}" v-else-if="(edit1.javaType === 'CellButton' )" >
                  <i type="warning" :class="edit1.icon"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
                    @click="handleRowButtonClick(edit1,scope.$index, scope.row)">
                  </i>
              </span>
              <span v-else-if="(edit1.widgetType === 'pic-view' )" >
                <div style="margin:8px;">
                  <a :href="computePicView(edit1, scope.row)" target="_blank">
                  <img :src="computePicView(edit1, scope.row)" :style="{width: edit1.width,height: edit1.height}">
                    </img>
                </a>
                  </div>
              </span>
              <span  v-else-if="(edit1.widgetType === 'progress' )" >
                <el-progress :percentage="scope.row[edit1.columnName]" style="text-align: left;" ></el-progress>
              </span>
              <span :style="{'cursor':(edit1.openParams && edit1.openUrl) || (edit1.sourceType === 'api' && edit1.sourceAttr )?'pointer':''}" v-else-if="(edit1.widgetType === 'tag' )" >
                <span @click="handleRowButtonClick(edit1,scope.$index, scope.row)" :class="edit1.tabMap?edit1.tabMap[scope.row[edit1.columnName]]:'jr-tag-1'">{{scope.row[edit1.columnName] }}</span>
              </span>
              <span
                :style="{'color':(edit1.openParams && edit1.openUrl)?'blue':'' ,'cursor':(edit1.openParams && edit1.openUrl)?'pointer':''}"
                v-else-if="(edit1.widgetType === 'select-user' ||
                edit1.widgetType === 'select-depart'||
                edit1.widgetType === 'select-role' ||
                edit1.widgetType === 'select-form' ||
                edit1.columnName === 'CREATE_USER_'||
                edit1.columnName === 'UPDATE_USER_'||
                edit1.columnName === 'SUB_COMPANY_'||
                edit1.columnName === 'COMPANY_')"
                @click.stop="cellClick(scope.$index,scope.row,edit1)"> {{ scope.row[edit1.columnName +'LABEL_'] }}</span>
              <span
                :style="{'color':(edit1.openParams && edit1.openUrl)?'blue':'' ,'cursor':(edit1.openParams && edit1.openUrl)?'pointer':''}"
                v-else-if="(edit1.widgetType === 'select-date' || edit1.widgetType === 'select-time' || edit1.widgetType === 'select-date-time')"
                @click="cellClick(scope.$index,scope.row,edit1)"> {{ formatDate(edit1,scope.row) }}</span>
              <span :style="{'color':(edit1.openParams && edit1.openUrl)?'blue':'' ,'cursor':(edit1.openParams && edit1.openUrl)?'pointer':''}" v-else @click.stop.prevent="cellClick(scope.$index,scope.row,edit1)">
                {{scope.row[edit1.columnName] }}
              </span>
            </template>
          </el-table-column>
          </el-table-column>
          <template slot-scope="scope">
            <template v-if="scope.row[column.columnName+'isShow']">
              <el-input-number v-if="column.widgetType === 'number'" v-model="scope.row[column.columnName]" @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)" @blur="iptBlur(scope.row,column,scope.$index)" :ref="column.columnName+scope.$index" size="mini" :controls="false" style="width: 100%"></el-input-number>
              <!--<el-input v-if="column.widgetType === 'input' && column.javaType && column.javaType ==='Double' " type="number"  size="mini" v-model="scope.row[column.columnName]" @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"  @blur="iptBlur(scope.row,column,scope.$index)" :ref="column.columnName+scope.$index"></el-input>-->
              <el-input v-else size="mini" v-model="scope.row[column.columnName]" @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"  @blur="iptBlur(scope.row,column,scope.$index)" :ref="column.columnName+scope.$index"></el-input>

            </template>

            <template  v-else >
              <span class="edit-val"  :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-if="(column.widgetType === 'select-dic' || column.widgetType === 'select-sql')" @click="cellClick(scope.$index,scope.row,column)"> {{dicValue(column,scope.row[column.columnName])}}</span>
              <!--<span :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-if="(column.widgetType === 'select-dic' && dicData[column.attr])" @click="cellClick(scope.row,column)"> {{ dicData[column.attr][scope.row[column.columnName]] }}</span>-->
              <span class="edit-val" :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-else-if="(column.widgetType === 'select' )" @click="cellClick(scope.$index,scope.row,column)"> {{dicValue(column,scope.row[column.columnName])}}</span>
              <span class="edit-val" :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-else-if="(column.widgetType === 'switch' )" >
                <el-switch v-model="scope.row[column.columnName+'_SWITCH']" active-value="true" inactive-value="false" disabled> </el-switch>
              </span>
              <span class="edit-val" :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-else-if="(column.javaType === 'CellButton' )" >
                  <i type="warning" :class="column.icon"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
                     @click="handleRowButtonClick(column,scope.$index, scope.row)">
                  </i>
              </span>
              <span class="edit-val" v-else-if="(column.widgetType === 'pic-view' )" >
                <div style="margin:8px;">
                  <a :href="computePicView(column, scope.row)" target="_blank">
                  <img :src="computePicView(column, scope.row)" :style="{width: column.width,height: column.height}">
                    </img>
                </a>
                  </div>
              </span>
              <span class="edit-val"  v-else-if="column.widgetType === 'progress'" >
                <el-progress :percentage="scope.row[column.columnName]" style="text-align: left;" ></el-progress>
              </span>
              <span class="edit-val" :style="{'cursor':(column.openParams && column.openUrl) || (column.sourceType === 'api' && column.sourceAttr )?'pointer':''}" v-else-if="(column.widgetType === 'tag' )" >
                <span @click="handleRowButtonClick(column,scope.$index, scope.row)" :class="column.tabMap?column.tabMap[scope.row[column.columnName]]:'jr-tag-1'">{{scope.row[column.columnName] }}</span>
              </span>
              <span class="edit-val"
                :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}"
                v-else-if="(column.widgetType === 'select-user' ||
                column.widgetType === 'select-depart'||
                column.widgetType === 'select-role' ||
                column.widgetType === 'select-form' ||
                column.columnName === 'CREATE_USER_'||
                column.columnName === 'UPDATE_USER_'||
                column.columnName === 'SUB_COMPANY_'||
                column.columnName === 'COMPANY_')"
                @click.stop="cellClick(scope.$index,scope.row,column)"> {{ scope.row[column.columnName +'LABEL_'] }}</span>
              <span class="edit-val"
                :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}"
                v-else-if="(column.widgetType === 'select-date' || column.widgetType === 'select-time' || column.widgetType === 'select-date-time')"
                @click="cellClick(scope.$index,scope.row,column)"> {{ formatDate(column,scope.row) }}</span>
              <span class="edit-val" :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" v-else @click.stop.prevent="cellClick(scope.$index,scope.row,column)">
                {{scope.row[column.columnName] }}
              </span>
            </template>

          </template>
        </el-table-column>
        <el-table-column v-if="isTree && !readOnly && !singleSelect && !multipleSelect && gridColumns.length>0 && ((showRowEditButton && config.btnEdit == 1) || (showRowDeleteButton && config.btnDelete == 1))"
          label="操作"
          width="60"
          align="center">
          <template slot-scope="scope">
            <el-button-group>
              <i v-if="showRowEditButton && config.btnEdit == 1 && config.btnEdit == 1  && !readOnly && !singleSelect && !multipleSelect" type="warning" class="el-icon-edit"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
                  @click="handleEdit(scope.$index, scope.row)">
              </i>
              <i v-if="showRowDeleteButton && config.btnDelete == 1 && config.btnEdit == 1  && !readOnly && !singleSelect && !multipleSelect" type="danger" class="el-icon-delete"  size="mini" style="margin-left:5px;font-size: 13pt;cursor: pointer;color: red;"
                  @click="handleDelete(scope.$index, scope.row)">
              </i>
              <!-- <i type="warning" class="el-icon-top" title="上移" size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
               @click="handleOperateClick('up',scope.$index, scope.row)">
              </i>
              <i type="danger" class="el-icon-bottom" title="下移"   size="mini" style="margin-left:5px;font-size: 13pt;cursor: pointer;color: red;"
                @click="handleOperateClick('down',scope.$index, scope.row)">
              </i> -->
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <div >
        <el-pagination
          v-if="!isTree"
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

    <div v-if="formDialogVisible && cascade">
      <div class="mask" ></div>
      <div class="boxs"  :style="{width:formConfig.formWidth?(formConfig.formWidth.indexOf('px')>-1 ? formConfig.formWidth :formConfig.formWidth+'px'):'900px',height:formConfig.formHeight?(formConfig.formHeight.indexOf('px')>-1 ? formConfig.formHeight :formConfig.formHeight+'px'):'600px'}">
        <h4 style="margin:10px 0;"><i></i>{{formConfig.title}}</h4>
        <form-edit :config="formConfig" :openConfig="openConfig" style="height: 100%; overflow-y:auto;margin-bottom: 10px;overflow-x: hidden"> </form-edit>
        <!--<div style="background-color: red;height: 100%;"></div>-->
      </div>
    </div>
    <div v-if="formDialogVisible && !cascade" class="openDialog">
      <!-- <div class="mask" ></div> -->
      <!-- <div class="boxs"  :style="{width:formConfig.formWidth?(formConfig.formWidth.indexOf('px')>-1 ? formConfig.formWidth :formConfig.formWidth+'px'):'900px',height:formConfig.formHeight?(formConfig.formHeight.indexOf('px')>-1 ? formConfig.formHeight :formConfig.formHeight+'px'):'600px'}"> -->
      <div  :style="{width:'100%',height:'100%',position: 'absolute',zIndex: '12',top: '0',background: 'white','padding-left': '10px','padding-right': '10px','box-sizing': 'border-box','padding-top': '10px','display': 'flex','flex-flow': 'column'}">
        <!--<div :style="formDialogStyle">-->
        <!--<h4 style="margin:10px 10px;"><i></i>{{formConfig.title}}</h4>-->
        <form-edit :config="formConfig" :openConfig="openConfig" style="height: 100%; overflow-y:auto;margin-bottom: 10px; overflow-x: hidden"> </form-edit>
        <!--<div style="background-color: red;height: 100%;"></div>-->
      </div>
    </div>
    <div v-if="openDialogVisible && (cascade || openDialogConfirmVisible)">
      <div class="mask" ></div>
      <div class="boxs"  :style="{width:openDialogWidth?openDialogWidth+'px':'1200px',height:openDialogHeight?openDialogHeight+'px':'600px'}">
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
    <!--导入Excel-->
    <div  v-if="selectExcelVisible" style="position: absolute;top: 0;z-index:10;background: #fff;width: 100%;height: 100%;">
      <div class="select-box" >
        <div class="select" style="width: 600px;height: 400px;">
          <div class="title">
            <h4 style="margin:30px 22px 0;"><i></i>下载模板，按格式修改后上传</h4>
          </div>
          <div class="select-center">
            <ul>
              <li v-for="(item,key) in excelList" :key="key" @click="downloadExecl(item)">
                  <upload
                  :config="{id: item.id, readOnly: false, xtype: 'FILE_', hasButton:false}"
                ></upload>
              </li>
            </ul>
            <h4 style="margin:30px 0 0;"><i></i>上传附件</h4>
            <upload
                @on-before-upload="handleBeforeUpload"
                :config="uploadConfig"
                ref='uploading'
                style="padding-top: 20px;"
              ></upload>
          </div>
          <div class="footer">
            <el-button  type="warning" size="mini" @click.stop="selectExcel">提交</el-button>
            <el-button style=""  type="info" size="mini" @click.stop="selectExcelVisible = false" >取消</el-button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="openDialogVisible && !cascade && !openDialogConfirmVisible"  class="openDialog">
      <!-- <div class="mask" ></div> -->
      <!-- <div class="boxs"  :style="{width:openDialogWidth?openDialogWidth+'px':'1200px',height:openDialogHeight?openDialogHeight+'px':'600px'}"> -->
      <div  :style="{width:'100%',height:'100%',position: 'absolute',zIndex: '12',top: '0',background: 'white','padding-left': '10px','padding-right': '10px','box-sizing': 'border-box','padding-top': '10px','display': 'flex','flex-flow': 'column'}">
        <div style="">
          <div style="width:100%" v-if="showOpenDialogTitle">
            <h4 style="margin:10px 0px;"><i></i>{{openDialogTitle}}</h4>
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
  import Upload from "../../upload/upload.vue";
  import {commonMixin} from '../../commonMixin.js'
  export default {
    name: "grid-tree-table",
    mixins:[mixin,gridMixin,commonMixin],
    components: {
      CmpLoader,QueryForm,Upload// ,FormEdit
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
  background-color: none;
  height: 33px;
  line-height: 35px;
  padding-top: 7px;
}
  .edit-val {
    min-height: 24px;
    display: inline-block;
    line-height: 32px;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
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
  #grid-tree-table .el-table th>.cell{
    display: block;
  }
</style>

