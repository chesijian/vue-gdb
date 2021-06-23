<template>
  <div id="jr-edit-table" class="jr-container" style="overflow: auto;">
    <el-table class="jr-edit-table-panel"
              ref="jr-table"
              :data="tableData"
              :highlight-current-row="true"
              size="mini"
              height="100%"
              width="100%"
              :fit="true"
              @selection-change="handlerSelectionChange"
              stripe style="width: 100%;margin-bottom:-1px;"
    >
      <el-table-column v-if="columns.length>0 && config.showCheckbox"
                       type="selection"
                       width="40">
      </el-table-column>
      <el-table-column v-if="columns.length>0"
                       label="#"
                       type="index"
                       width="40">
      </el-table-column>
      <el-table-column v-if="showOperateTool && columns.length>0 "
                       label="操作"
                       width="120"
                       align="center">
        <template slot-scope="scope">
          <el-button-group>
            <i type="warning" class="el-icon-edit"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
               @click="handleOperateClick('edit',scope.$index, scope.row)">
            </i>
            <i type="danger" class="el-icon-delete"  size="mini" style="margin-left:5px;font-size: 13pt;cursor: pointer;color: red;"
               @click="handleOperateClick('delete',scope.$index, scope.row)">
            </i>
            <i type="warning" class="el-icon-top" title="上移" size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
               @click="handleOperateClick('up',scope.$index, scope.row)">
            </i>
            <i type="danger" class="el-icon-bottom" title="下移"   size="mini" style="margin-left:5px;font-size: 13pt;cursor: pointer;color: red;"
               @click="handleOperateClick('down',scope.$index, scope.row)">
            </i>
          </el-button-group>
        </template>
      </el-table-column>

      <el-table-column
        v-if="!column.hidden"
        v-for="(column,index) in columns" :key="index"
        :prop="column.columnName"
        :sortable="sortable(column)"
        show-overflow-tooltip
        :label="column.title"
        :min-width="column.width">
        <template slot-scope="scope">
            <span class="edit-val" v-show="edit && scope.row[column.columnName+'isShow']">
              <div v-if="column.widgetType === 'select-form' && !column.readOnly">
                <div class="el-select el-select--mini" style="width:100%;"
                     @click="handlerGridOpenSelectForm(column,scope.row,scope.$index)">
                  <div class="el-input el-input--mini el-input--suffix">
                    <input type="text" :ref="column.columnName+scope.$index"
                           v-model="scope.row[column.columnName+'LABEL_']?scope.row[column.columnName+'LABEL_']:scope.row[column.columnName]"
                           @blur="iptBlur(scope.row,column,scope.$index)" readonly="readonly" autocomplete="off"
                           placeholder="请选择" class="el-input__inner">
                    <input type="text" @blur="iptBlur(scope.row,column,scope.$index)"
                           @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"
                           v-model="scope.row[column.columnName]" class="el-input__inner" style="display: none;">
                    <span class="el-input__suffix">
                      <span class="el-input__suffix-inner">
                        <i class="el-select__caret el-input__icon el-icon-more"></i>
                       </span>
                    </span>
                  </div>
                </div>
              </div>
              <el-select v-else-if="column.widgetType === 'select' && !column.readOnly" size="mini"
                         v-model="scope.row[column.columnName]"
                         placeholder="请选择" :ref="column.columnName+scope.$index"
                         @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"
                         @blur="iptBlur(scope.row,column,scope.$index)">
                <el-option
                  v-for="val in column.options"
                  :key="val.value"
                  :label="val.name"
                  :value="val.value"
                  :disabled="val.disabled">
                </el-option>
              </el-select>
              <el-select v-else-if="(column.widgetType === 'select-dic'|| column.widgetType === 'select-sql') && !column.readOnly" size="mini"
                         v-model="scope.row[column.columnName]"
                         placeholder="请选择" :ref="column.columnName+scope.$index"
                         @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"
                         @blur="iptBlur(scope.row,column,scope.$index)">
                <el-option
                  v-for="val in column.options"
                  :key="val.value"
                  :label="val.name"
                  :value="val.value"
                  :disabled="val.disabled">
                </el-option>
              </el-select>
              <el-input-number v-else-if="column.widgetType === 'number'" v-model="scope.row[column.columnName]"
                               @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"
                               @blur="iptBlur(scope.row,column,scope.$index)" :ref="column.columnName+scope.$index"
                               size="mini" :controls="false" style="width: 100%"></el-input-number>
              <el-input v-else size="mini" v-model="scope.row[column.columnName]"
                        @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"
                        @blur="iptBlur(scope.row,column,scope.$index)" :ref="column.columnName+scope.$index"></el-input>
          </span>
          <span v-if="(column.widgetType === 'switch' )" >
              <el-switch v-model="scope.row[column.columnName]" :active-value="1" :inactive-value="0" disabled> </el-switch>
          </span>
          <span v-if="column.widgetType !== 'switch' && !column.readOnly" class="edit-val" v-show="!scope.row[column.columnName+'isShow']"  @click="dblClick(scope.row,column,scope.$index)">
            <span v-if="column.widgetType === 'select' || column.widgetType === 'select-dic' || column.widgetType === 'select-sql'">
             {{dicValue(column,scope.row[column.columnName])}}
            </span>
            <span v-else-if="(column.widgetType === 'select-date' || column.widgetType === 'select-time' || column.widgetType === 'select-date-time')">
              {{ formatDate(column,scope.row) }}</span>
            <span  v-else-if="(column.widgetType === 'tag' )"  :style="{'cursor':(column.openParams && column.openUrl) || (column.sourceType === 'api' && column.sourceAttr )?'pointer':''}">
              <span @click="handleRowButtonClick(column,scope.$index, scope.row)" :class="column.tagMap?column.tagMap[scope.row[column.columnName]]:'jr-tag-1'">{{scope.row[column.columnName] }}</span>
            </span>
            <span v-else :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}">
              {{scope.row[column.columnName]}}
            </span>
          </span>
          <span v-if="column.readOnly" class="edit-val"  >
            <span v-if="column.widgetType === 'select' || column.widgetType === 'select-dic' || column.widgetType === 'select-sql'">
              {{dicValue(column,scope.row[column.columnName])}}
            </span>
            <span v-else-if="(column.widgetType === 'select-date' || column.widgetType === 'select-time' || column.widgetType === 'select-date-time')">
              {{ formatDate(column,scope.row) }}</span>
            <span v-else :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}">
              {{scope.row[column.columnName]}}
            </span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="config.showPageBar">
      <el-pagination
        class="jr-pagination"
        @size-change="((pageSize)=>{handleSizeChange(pageSize)})"
        @current-change="((pageIndex)=>{handleCurrentChange( pageIndex)})"
        :current-page="pageIndex"
        :page-sizes="[30, 50, 100, 500]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
    </div>

    <div v-if="openDialogVisible">
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

  </div>

</template>

<script>
  import {mixin} from './mixin.js'
  import {tableMixin} from '../tableMixin.js'

  export default {
    name: "common-grid-table",
    mixins: [mixin, tableMixin]
  }
</script>

<style scoped>
  .jr-container {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
  }

  .jr-pagination {
    background-color: white;
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
</style>

<style>
  #jr-edit-table .el-button--mini, .el-button--mini.is-round {
    padding: 7px 7px;
  }
</style>
