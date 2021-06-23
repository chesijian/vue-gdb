<template>

  <div id="jr-edit-table" class="jr-container" style="overflow-x: hidden">
    <div v-if="openDialogVisible">
      <div class="mask" ></div>
      <div class="boxs"  :style="{width:openDialogWidth+'px',height:openDialogHeight+'px'}">
        <div style="">
          <div style="width:100%" v-if="showOpenDialogTitle">
            <h4 style="margin:10px 10px;"><i></i>{{openDialogTitle}}</h4>
          </div>
          <div style="width:30%;text-align: right;padding-top: 9px;position: absolute;top: 0px;right: 16px;">
            <i class="el-icon-close" @click="openDialogVisible = !openDialogVisible" style="cursor: pointer;font-size: 20px;"></i>
          </div>
        </div>
        <cmp-loader ref="select-form" :vueName="openDialogVueName" :config="openDialogConfig" :style="{'margin-top': showOpenDialogTitle?'0px':'35px'}"></cmp-loader>
      </div>
    </div>
    <!--{{readOnly}}&#45;&#45;{{showTopNewButton}}&#45;&#45;{{topBar.length}}-->
    <div v-if="!readOnly && (computeOperateButtonOnly('topNew') || computeOperateButtonOnly('topDelete') || topBar.length>0)" class="jr-query-topBar-tool">
      <el-button v-if="computeOperateButtonOnly('topNew') && !isTree" @click.native.prevent="addRow()" round type="warning" size="mini" icon="el-icon-plus" >新增</el-button>
      <el-button v-if="computeOperateButtonOnly('topNew') && isTree" @click.native.prevent="addNode()" round type="warning" size="mini" icon="el-icon-folder-add" >新增同级</el-button>
      <el-button v-if="computeOperateButtonOnly('topNew') && isTree" @click.native.prevent="addChildNode()" round type="warning" size="mini" icon="el-icon-document-add" >新增下级</el-button>
      <el-button v-if="computeOperateButtonOnly('topDelete')" @click.native.prevent="removeRow()" round type="danger" size="mini" icon="el-icon-delete" >删除</el-button>
      <el-button round type="warning" size="mini" @click.native.prevent="handlerTopBarClick(button)" v-show="button.hidden !== 1" v-for="(button,index) in topBar" :key="index" :icon="button.icon" >{{button.title}}</el-button>
      <!--<el-button round type="warning" size="mini" icon="el-icon-download">导入</el-button>-->
      <!--<el-button round type="warning" size="mini" icon="el-icon-upload2">导出</el-button>-->
      <!--{{dicValue({columnName:'UNIT_'},'1')}}-->
      <!--&#45;&#45;{{dicMap['UNIT_']?dicMap['UNIT_']['1']:''}}&#45;&#45;{{JSON.stringify(dicMap['UNIT_'])}}-->
    </div>
    <el-table
      v-loading="loading"
      class="jr-edit-table-panel"
      ref="jr-table"
      :highlight-current-row="true"
      size="mini"
      stripe
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      height="100%"
      :fit="true"
      :data="config.tableData"
      :row-key="rowKey"
      @current-change="handlerCurrentChange"
      @selection-change="handlerSelectionChange"
      :summary-method="getSummaries"
      :show-summary="showSummary"
      style="width: 100%; margin-top: 0px;border-top: 1px solid #ebeef5;display: flex;height: 100%;flex-flow: column;">
      <el-table-column v-if="!readOnly && columns.length>0"
        type="selection"
                       width="40">
      </el-table-column>
      <el-table-column v-if="columns.length>0"
        label = "#"
        type="index"
        width="40">
      </el-table-column>
      <el-table-column v-if="!readOnly && !isTree && columns.length>0 && (showCellNewButton || showCellDeleteButton)"
                       label="操作"
                       width="65"
                       align="center">
        <template slot-scope="scope">
          <el-button-group>
            <i v-if="computeOperateButtonOnly('cellNew') && !isTree" type="warning" class="el-icon-plus"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
               @click="addRow(scope.$index,config.tableData)">
            </i>
            <i v-if="computeOperateButtonOnly('cellNew') && isTree" type="warning" class="el-icon-plus"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
               @click="addNode(scope.$index,config.tableData)">
            </i>
            <i v-if="computeOperateButtonOnly('cellDelete')" type="danger" class="el-icon-delete"  size="mini" style="margin-left:5px;font-size: 13pt;cursor: pointer;color: red;"
               @click="deleteRow(scope.$index, scope.row, config.tableData)">
            </i>
          </el-button-group>
        </template>
      </el-table-column>
      <el-table-column v-if="!column.hidden" v-for="(column,index) in moreColumns" :key="index"
        :prop="column.columnName"
        :header-align="column.titleAlign || 'center'"
        show-overflow-tooltip
        :align="column.dataAlign  || 'center'"
        :label="column.title"
                       :sortable="column.columnName === 'SORT_' || column.columnName === 'sort' || column.columnName === 'CREATE_TIME_'"
                       :min-width="column.width">
        <el-table-column
          v-if="!edit.hidden"
          v-for="(edit,j) in column.children" :key="j"
          :prop="edit.columnName"
          :header-align="edit.titleAlign || 'center'"
          :align="edit.dataAlign  || 'center'"
          :label="edit.title"
          show-overflow-tooltip
          :sortable="edit.columnName === 'SORT_' || edit.columnName === 'sort' || edit.columnName === 'CREATE_TIME_'"
          :min-width="edit.width">
            <template slot-scope="scope">
              <span class="edit-val" v-if=" !readOnly && scope.row[edit.columnName+'isShow']">
                <div v-if="edit.widgetType === 'select-form' && !formColumnReadOnly(edit)">
                  <div  class="el-select el-select--mini" style="width:100%;" @click="handlerGridOpenSelectForm(edit,scope.row,scope.$index)">
                    <div class="el-input el-input--mini el-input--suffix">
                      <input type="text"  :ref="edit.columnName+scope.$index" v-model="scope.row[edit.columnName+'LABEL_']?scope.row[edit.columnName+'LABEL_']:scope.row[edit.columnName]" @blur="iptBlur(scope.row,edit,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                      <input type="text"  @blur="iptBlur(scope.row,edit,scope.$index)" @change="newVal=>handlerChangeValue(newVal,edit,scope.row,scope.$index)" v-model="scope.row[edit.columnName]"   class="el-input__inner" style="display: none;">
                      <span class="el-input__suffix" >
                        <span class="el-input__suffix-inner">
                          <i class="el-select__caret el-input__icon el-icon-more"></i>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else-if="edit.widgetType === 'open-form' && !formColumnReadOnly(edit)">
                  <div  class="el-select el-select--mini" style="width:100%;" @click="handlerGridOpenSelectForm(edit,scope.row,scope.$index)">
                    <div class="el-input el-input--mini el-input--suffix">
                      <input type="text"  :ref="edit.columnName+scope.$index" v-model="scope.row[edit.columnName]" @blur="iptBlur(scope.row,edit,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                      <input type="text"  @blur="iptBlur(scope.row,edit,scope.$index)" @change="newVal=>handlerChangeValue(newVal,edit,scope.row,scope.$index)" v-model="scope.row[edit.columnName]"   class="el-input__inner" style="display: none;">
                      <span class="el-input__suffix" >
                        <span class="el-input__suffix-inner">
                          <i class="el-select__caret el-input__icon el-icon-more"></i>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else-if="edit.widgetType === 'select-user' || edit.widgetType === 'select-user-multi' && !formColumnReadOnly(edit)">
                  <div  class="el-select el-select--mini" style="width:100%;" @click="selectMember(edit,scope.row,scope.$index)">
                    <div class="el-input el-input--mini el-input--suffix">
                      <input type="text"  :ref="edit.columnName+scope.$index"  v-model="edit.ifNotRelated == 1 ? scope.row[edit.columnName] : scope.row[edit.columnName+'LABEL_']" @blur="iptBlur(scope.row,edit,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                      <input type="text"  @blur="iptBlur(scope.row,edit,scope.$index)" v-model="scope.row[edit.columnName]"  class="el-input__inner" style="display: none;">
                      <span class="el-input__suffix" >
                        <span class="el-input__suffix-inner">
                          <i class="el-select__caret el-input__icon el-icon-more"></i>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div v-else-if="edit.widgetType === 'select-depart' && !formColumnReadOnly(edit)">
                  <div  class="el-select el-select--mini" style="width:100%;" @click="selectQuerters(edit,scope.row,scope.$index)">
                    <div class="el-input el-input--mini el-input--suffix">
                      <input type="text"  :ref="edit.columnName+scope.$index" v-model="scope.row[edit.columnName+'LABEL_']?scope.row[edit.columnName+'LABEL_']:scope.row[edit.columnName]" @blur="iptBlur(scope.row,edit,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                      <input type="text"  @blur="iptBlur(scope.row,edit,scope.$index)" v-model="scope.row[edit.columnName]"  class="el-input__inner" style="display: none;">
                      <span class="el-input__suffix" >
                        <span class="el-input__suffix-inner">
                          <i class="el-select__caret el-input__icon el-icon-more"></i>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <el-select v-else-if="edit.widgetType === 'select' && !formColumnReadOnly(edit)" size="mini" v-model="scope.row[edit.columnName]"
                        placeholder="请选择" :ref="edit.columnName+scope.$index" @change="newVal=>handlerChangeValue(newVal,edit,scope.row,scope.$index)"  @blur="iptBlur(scope.row,edit,scope.$index)">
                  <el-option
                    v-for="val in edit.options"
                    :key="val.value"
                    :label="val.name"
                    :value="val.value"
                    :disabled="val.disabled">
                  </el-option>
                </el-select>
                <el-select v-else-if="(edit.widgetType === 'select-dic' ||edit.widgetType === 'select-sql') && !formColumnReadOnly(edit)"  :multiple="edit.multiple === 1" size="mini" v-model="scope.row[edit.columnName]"
                          placeholder="请选择" :ref="edit.columnName+scope.$index" @change="newVal=>handlerChangeValue(newVal,edit,scope.row,scope.$index)"  @visible-change="visible=>iptBlur(newVal,edit,scope.row,scope.$index,visible)" >
                  <el-option
                    v-for="val in edit.options"
                    :key="val.value"
                    :label="val.name"
                    :value="val.value"
                    :disabled="val.disabled">
                  </el-option>
                </el-select>
                <el-date-picker  v-else-if="edit.widgetType === 'select-date' && !formColumnReadOnly(edit)"
                    size="mini"
                    :label="edit.title"
                    :prop="edit.columnName"
                    v-model="scope.row[edit.columnName+'LABEL_']"
                    :type="edit.dateType || 'date'"
                    range-separator="至"
                    :ref="edit.columnName+scope.$index"
                    @change="newVal=>handlerChangeValue(newVal,edit,scope.row,scope.$index)"
                    @blur="iptBlur(scope.row,edit,scope.$index)"
                    style="width: 100%;">
                </el-date-picker>
                <el-time-picker  v-else-if="edit.widgetType === 'select-time' && !formColumnReadOnly(edit)"
                    size="mini"
                    :label="edit.title"
                    :prop="edit.columnName"
                    v-model="scope.row[edit.columnName+'LABEL_']"
                    placeholder="选择时间"
                    :ref="edit.columnName+scope.$index"
                    @change="newVal=>handlerChangeValue(newVal,edit,scope.row,scope.$index)"
                    @blur="iptBlur(scope.row,edit,scope.$index)"
                    value-format="HH:mm:ss"
                    style="width: 100%;">
                </el-time-picker>
                <el-date-picker  v-else-if="edit.widgetType === 'select-date-time' && !formColumnReadOnly(edit)"
                    size="mini"
                    :label="edit.title"
                    :prop="edit.columnName"
                    v-model="scope.row[edit.columnName+'LABEL_']"
                    type="datetime"
                    placeholder="选择时间日期"
                    :ref="edit.columnName+scope.$index"
                    @change="newVal=>handlerChangeValue(newVal,edit,scope.row,scope.$index)"
                    @blur="iptBlur(scope.row,edit,scope.$index)"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    style="width: 100%;">
                </el-date-picker>
                <el-input-number v-else-if="edit.widgetType === 'number'" v-model="scope.row[edit.columnName]" @change="newVal=>handlerChangeValue(newVal,edit,scope.row,scope.$index)" @blur="iptBlur(scope.row,edit,scope.$index)" :ref="edit.columnName+scope.$index" size="mini" :controls="false" style="width: 100%"></el-input-number>
                <el-input v-else size="mini" v-model="scope.row[edit.columnName]" @change="newVal=>handlerChangeValue(newVal,edit,scope.row,scope.$index)"  @blur="iptBlur(scope.row,edit,scope.$index)" :ref="edit.columnName+scope.$index"></el-input>
              </span>

              <span v-if="edit.widgetType === 'switch' && !formColumnReadOnly(edit)" class="edit-val" v-show="!scope.row[edit.columnName+'isShow']">
                <el-switch v-if="edit.widgetType === 'switch'" v-model="scope.row[edit.columnName+'_SWITCH']" active-value="true" inactive-value="false"
                          :ref="edit.columnName+scope.$index" @change="newVal=>handlerChangeValue(newVal,edit,scope.row,scope.$index)"   @blur="iptBlur(scope.row,edit,scope.$index)"> </el-switch>
                </el-switch>
              </span>
              <span v-if="edit.widgetType !== 'switch' && !formColumnReadOnly(edit)" class="edit-val" v-show="!scope.row[edit.columnName+'isShow']"  @click="dblClick(scope.row,edit,scope.$index)"  :style="{'color':(edit.openParams && edit.openUrl)?'blue':'' ,'cursor':(edit.openParams && edit.openUrl)?'pointer':''}">
                <span v-if="edit.widgetType === 'select' || edit.widgetType === 'select-dic' || edit.widgetType === 'select-sql'">
                  {{dicValue(edit,scope.row[edit.columnName]) === undefined ? scope.row[edit.columnName] : dicValue(edit,scope.row[edit.columnName])}}
                  <!--&#45;&#45;{{scope.row[column.columnName]}}&#45;&#45;{{dicMap[column.columnName][scope.row[column.columnName]]}}-->
                </span>
                <span v-else-if="edit.widgetType === 'select-user' || edit.widgetType === 'select-user-multi' || edit.widgetType === 'select-user-list' || edit.widgetType === 'select-depart'">
                  {{edit.ifNotRelated == 1 ? scope.row[edit.columnName] : scope.row[edit.columnName+'LABEL_']}}
                </span>
                <span v-else-if="edit.widgetType === 'select-date' || edit.widgetType === 'select-time'|| edit.widgetType === 'select-date-time'">
                  {{scope.row[edit.columnName+'LABEL_']}}
                </span>
                <span v-else>
                  {{scope.row[edit.columnName]}}
                </span>
              </span>
              <span v-if="formColumnReadOnly(edit)" :style="{'color':(edit.openParams && edit.openUrl)?'blue':'' ,'cursor':(edit.openParams && edit.openUrl)?'pointer':''}" @click="dblClick(scope.row,edit,scope.$index)" >
                <span v-if="edit.widgetType === 'select' || edit.widgetType === 'select-dic' || edit.widgetType === 'select-sql'">
                  {{dicValue(edit,scope.row[edit.columnName])}}
                </span>
                <span v-else-if="edit.widgetType === 'select-form' || edit.widgetType === 'select-date' || edit.widgetType === 'select-time'|| edit.widgetType === 'select-date-time'|| edit.widgetType === 'select-user' || edit.widgetType === 'select-user-multi' || edit.widgetType === 'select-user-list' ||  edit.widgetType === 'select-depart'">
                  {{scope.row[edit.columnName+'LABEL_']?scope.row[edit.columnName+'LABEL_']:scope.row[edit.columnName]}}
                </span>
                <span v-else>
                  {{scope.row[edit.columnName]}}
                </span>
              </span>
            </template>
            <el-table-column
              v-if="!edit1.hidden"
              v-for="(edit1,k) in edit.children" :key="k"
              :prop="edit1.columnName"
              show-overflow-tooltip
              :header-align="edit1.titleAlign || 'center'"
              :align="edit1.dataAlign  || 'center'"
              :label="edit1.title"
              :sortable="edit1.columnName === 'SORT_' || edit1.columnName === 'sort' || edit1.columnName === 'CREATE_TIME_'"
              :min-width="edit1.width">
              <template slot-scope="scope">
                <span class="edit-val" v-if=" !readOnly && scope.row[edit1.columnName+'isShow']">
                  <div v-if="edit1.widgetType === 'select-form' && !formColumnReadOnly(edit1)">
                    <div  class="el-select el-select--mini" style="width:100%;" @click="handlerGridOpenSelectForm(edit1,scope.row,scope.$index)">
                      <div class="el-input el-input--mini el-input--suffix">
                        <input type="text"  :ref="edit1.columnName+scope.$index" v-model="scope.row[edit1.columnName+'LABEL_']?scope.row[edit1.columnName+'LABEL_']:scope.row[edit1.columnName]" @blur="iptBlur(scope.row,edit1,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                        <input type="text"  @blur="iptBlur(scope.row,edit1,scope.$index)" @change="newVal=>handlerChangeValue(newVal,edit1,scope.row,scope.$index)" v-model="scope.row[edit1.columnName]"   class="el-input__inner" style="display: none;">
                        <span class="el-input__suffix" >
                          <span class="el-input__suffix-inner">
                            <i class="el-select__caret el-input__icon el-icon-more"></i>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="edit1.widgetType === 'open-form' && !formColumnReadOnly(edit1)">
                    <div  class="el-select el-select--mini" style="width:100%;" @click="handlerGridOpenSelectForm(edit1,scope.row,scope.$index)">
                      <div class="el-input el-input--mini el-input--suffix">
                        <input type="text"  :ref="edit1.columnName+scope.$index" v-model="scope.row[edit1.columnName]" @blur="iptBlur(scope.row,edit1,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                        <input type="text"  @blur="iptBlur(scope.row,edit1,scope.$index)" @change="newVal=>handlerChangeValue(newVal,edit1,scope.row,scope.$index)" v-model="scope.row[edit1.columnName]"   class="el-input__inner" style="display: none;">
                        <span class="el-input__suffix" >
                          <span class="el-input__suffix-inner">
                            <i class="el-select__caret el-input__icon el-icon-more"></i>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="edit1.widgetType === 'select-user' || edit1.widgetType === 'select-user-multi' || edit1.widgetType === 'select-user-list' && !formColumnReadOnly(edit1)">
                    <div  class="el-select el-select--mini" style="width:100%;" @click="selectMember(edit1,scope.row,scope.$index)">
                      <div class="el-input el-input--mini el-input--suffix">
                        <input type="text"  :ref="edit1.columnName+scope.$index"  v-model="edit1.ifNotRelated == 1 ? scope.row[edit1.columnName] : scope.row[edit1.columnName+'LABEL_']" @blur="iptBlur(scope.row,edit1,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                        <input type="text"  @blur="iptBlur(scope.row,edit1,scope.$index)" v-model="scope.row[edit1.columnName]"  class="el-input__inner" style="display: none;">
                        <span class="el-input__suffix" >
                          <span class="el-input__suffix-inner">
                            <i class="el-select__caret el-input__icon el-icon-more"></i>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div v-else-if="edit1.widgetType === 'select-depart' && !formColumnReadOnly(edit1)">
                    <div  class="el-select el-select--mini" style="width:100%;" @click="selectQuerters(edit1,scope.row,scope.$index)">
                      <div class="el-input el-input--mini el-input--suffix">
                        <input type="text"  :ref="edit1.columnName+scope.$index" v-model="scope.row[edit1.columnName+'LABEL_']?scope.row[edit1.columnName+'LABEL_']:scope.row[edit1.columnName]" @blur="iptBlur(scope.row,edit1,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                        <input type="text"  @blur="iptBlur(scope.row,edit1,scope.$index)" v-model="scope.row[edit1.columnName]"  class="el-input__inner" style="display: none;">
                        <span class="el-input__suffix" >
                          <span class="el-input__suffix-inner">
                            <i class="el-select__caret el-input__icon el-icon-more"></i>
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <el-select v-else-if="edit1.widgetType === 'select' && !formColumnReadOnly(edit1)" size="mini" v-model="scope.row[edit1.columnName]"
                          placeholder="请选择" :ref="edit1.columnName+scope.$index" @change="newVal=>handlerChangeValue(newVal,edit1,scope.row,scope.$index)"   @blur="iptBlur(scope.row,edit1,scope.$index)">
                    <el-option
                      v-for="val in edit1.options"
                      :key="val.value"
                      :label="val.name"
                      :value="val.value"
                      :disabled="val.disabled">
                    </el-option>
                  </el-select>
                  <el-select v-else-if="(edit1.widgetType === 'select-dic' || edit1.widgetType === 'select-sql') && !formColumnReadOnly(edit1)" :multiple="edit1.multiple === 1" size="mini" v-model="scope.row[edit1.columnName]"
                            placeholder="请选择" :ref="edit1.columnName+scope.$index" @change="newVal=>handlerChangeValue(newVal,edit1,scope.row,scope.$index)" @visible-change="visible=>iptBlur(scope.row,edit1,scope.$index,visible)" >
                    <el-option
                      v-for="val in edit1.options"
                      :key="val.value"
                      :label="val.name"
                      :value="val.value"
                      :disabled="val.disabled">
                    </el-option>
                  </el-select>

                  <el-date-picker  v-else-if="edit1.widgetType === 'select-date' && !formColumnReadOnly(edit1)"
                      size="mini"
                      :label="edit1.title"
                      :prop="edit1.columnName"
                      v-model="scope.row[edit1.columnName+'LABEL_']"
                      :type="edit1.dateType || 'date'"
                      range-separator="至"
                      :ref="edit1.columnName+scope.$index"
                      @change="newVal=>handlerChangeValue(newVal,edit1,scope.row,scope.$index)"
                      @blur="iptBlur(scope.row,edit1,scope.$index)"
                      style="width: 100%;">
                  </el-date-picker>

                  <el-time-picker  v-else-if="edit1.widgetType === 'select-time' && !formColumnReadOnly(edit1)"
                      size="mini"
                      :label="edit1.title"
                      :prop="edit1.columnName"
                      v-model="scope.row[edit1.columnName+'LABEL_']"
                      placeholder="选择时间"
                      :ref="edit1.columnName+scope.$index"
                      @change="newVal=>handlerChangeValue(newVal,edit1,scope.row,scope.$index)"
                      @blur="iptBlur(scope.row,edit1,scope.$index)"
                      value-format="HH:mm:ss"
                      style="width: 100%;">
                  </el-time-picker>

                  <el-date-picker  v-else-if="edit1.widgetType === 'select-date-time' && !formColumnReadOnly(edit1)"
                      size="mini"
                      :label="edit1.title"
                      :prop="edit1.columnName"
                      v-model="scope.row[edit1.columnName+'LABEL_']"
                      type="datetime"
                      placeholder="选择时间日期"
                      :ref="edit1.columnName+scope.$index"
                      @change="newVal=>handlerChangeValue(newVal,edit1,scope.row,scope.$index)"
                      @blur="iptBlur(scope.row,edit1,scope.$index)"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      style="width: 100%;">
                  </el-date-picker>

                  <el-input-number v-else-if="edit1.widgetType === 'number'" v-model="scope.row[edit1.columnName]" @change="newVal=>handlerChangeValue(newVal,edit1,scope.row,scope.$index)" @blur="iptBlur(scope.row,edit1,scope.$index)" :ref="edit1.columnName+scope.$index" size="mini" :controls="false" style="width: 100%"></el-input-number>
                  <el-input v-else size="mini" v-model="scope.row[edit1.columnName]" @change="newVal=>handlerChangeValue(newVal,edit1,scope.row,scope.$index)"  @blur="iptBlur(scope.row,edit1,scope.$index)" :ref="edit1.columnName+scope.$index"></el-input>
                </span>

                <span v-if="edit1.widgetType === 'switch' && !formColumnReadOnly(edit1)" class="edit-val" v-show="!scope.row[edit1.columnName+'isShow']">
                  <el-switch v-if="edit1.widgetType === 'switch'" v-model="scope.row[edit1.columnName+'_SWITCH']" active-value="true" inactive-value="false"
                            :ref="edit1.columnName+scope.$index" @change="newVal=>handlerChangeValue(newVal,edit1,scope.row,scope.$index)"   @blur="iptBlur(scope.row,edit1,scope.$index)"> </el-switch>
                  </el-switch>
                </span>

                <span v-if="edit1.widgetType !== 'switch' && !formColumnReadOnly(edit1)" class="edit-val" v-show="!scope.row[edit1.columnName+'isShow']"  @click="dblClick(scope.row,edit1,scope.$index)"  :style="{'color':(edit1.openParams && edit1.openUrl)?'blue':'' ,'cursor':(edit1.openParams && edit1.openUrl)?'pointer':''}">
                  <span v-if="edit1.widgetType === 'select' || edit1.widgetType === 'select-dic' || edit1.widgetType === 'select-sql'">
                    {{dicValue(edit1,scope.row[edit1.columnName]) === undefined ? scope.row[edit1.columnName] : dicValue(edit1,scope.row[edit1.columnName])}}
                    <!--&#45;&#45;{{scope.row[column.columnName]}}&#45;&#45;{{dicMap[column.columnName][scope.row[column.columnName]]}}-->
                  </span>
                  <span v-else-if="edit1.widgetType === 'select-user' || edit1.widgetType === 'select-user-multi' || edit1.widgetType === 'select-user-list' || edit1.widgetType === 'select-depart'">
                    {{edit1.ifNotRelated == 1 ? scope.row[edit1.columnName] : scope.row[edit1.columnName+'LABEL_']}}
                  </span>
                  <span v-else-if="edit1.widgetType === 'select-date' || edit1.widgetType === 'select-time'|| edit1.widgetType === 'select-date-time'">
                    {{scope.row[edit1.columnName+'LABEL_']}}
                  </span>
                  <span v-else>
                    {{scope.row[edit1.columnName]}}
                  </span>
                </span>
                <span v-if="formColumnReadOnly(edit1)" :style="{'color':(edit1.openParams && edit1.openUrl)?'blue':'' ,'cursor':(edit1.openParams && edit1.openUrl)?'pointer':''}" @click="dblClick(scope.row,edit1,scope.$index)" >
                  <span v-if="edit1.widgetType === 'select' || edit1.widgetType === 'select-dic' || edit1.widgetType === 'select-sql'">
                    {{dicValue(edit1,scope.row[edit1.columnName])}}
                  </span>
                  <span v-else-if="edit1.widgetType === 'select-form' || edit1.widgetType === 'select-date' || edit1.widgetType === 'select-time'|| edit1.widgetType === 'select-date-time'|| edit1.widgetType === 'select-user' || edit1.widgetType === 'select-user-multi' || edit1.widgetType === 'select-user-list' ||  edit1.widgetType === 'select-depart'">
                    {{scope.row[edit1.columnName+'LABEL_']?scope.row[edit1.columnName+'LABEL_']:scope.row[edit1.columnName]}}
                  </span>
                  <span v-else>
                    {{scope.row[edit1.columnName]}}
                  </span>
                </span>
              </template>
            </el-table-column>
        </el-table-column>
        <template slot-scope="scope">
          <span class="edit-val" v-if=" !readOnly && scope.row[column.columnName+'isShow']">
            <div v-if="column.widgetType === 'select-form' && !formColumnReadOnly(column)">
              <div  class="el-select el-select--mini" style="width:100%;" @click="handlerGridOpenSelectForm(column,scope.row,scope.$index)">
                <div class="el-input el-input--mini el-input--suffix">
                  <input type="text"  :ref="column.columnName+scope.$index" v-model="scope.row[column.columnName+'LABEL_']?scope.row[column.columnName+'LABEL_']:scope.row[column.columnName]" @blur="iptBlur(scope.row,column,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                  <input type="text"  @blur="iptBlur(scope.row,column,scope.$index)" @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)" v-model="scope.row[column.columnName]"   class="el-input__inner" style="display: none;">
                  <span class="el-input__suffix" >
                    <span class="el-input__suffix-inner">
                      <i class="el-select__caret el-input__icon el-icon-more"></i>
                     </span>
                  </span>
                </div>
              </div>
            </div>
            <div v-else-if="column.widgetType === 'open-form' && !formColumnReadOnly(column)">
              <div  class="el-select el-select--mini" style="width:100%;" @click="handlerGridOpenSelectForm(column,scope.row,scope.$index)">
                <div class="el-input el-input--mini el-input--suffix">
                  <input type="text"  :ref="column.columnName+scope.$index" v-model="scope.row[column.columnName]" @blur="iptBlur(scope.row,column,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                  <input type="text"  @blur="iptBlur(scope.row,column,scope.$index)" @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)" v-model="scope.row[column.columnName]"   class="el-input__inner" style="display: none;">
                  <span class="el-input__suffix" >
                    <span class="el-input__suffix-inner">
                      <i class="el-select__caret el-input__icon el-icon-more"></i>
                     </span>
                  </span>
                </div>
              </div>
            </div>
            <div v-else-if="column.widgetType === 'select-user' || column.widgetType === 'select-user-multi' || column.widgetType === 'select-user-list' && !formColumnReadOnly(column)">
              <div  class="el-select el-select--mini" style="width:100%;" @click="selectMember(column,scope.row,scope.$index)">
                <div class="el-input el-input--mini el-input--suffix">
                  <input type="text"  :ref="column.columnName+scope.$index"  v-model="column.ifNotRelated == 1 ? scope.row[column.columnName] : scope.row[column.columnName+'LABEL_']" @blur="iptBlur(scope.row,column,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                  <input type="text"  @blur="iptBlur(scope.row,column,scope.$index)" v-model="scope.row[column.columnName]"  class="el-input__inner" style="display: none;">
                  <span class="el-input__suffix" >
                    <span class="el-input__suffix-inner">
                      <i class="el-select__caret el-input__icon el-icon-more"></i>
                     </span>
                  </span>
                </div>
              </div>
            </div>
            <div v-else-if="column.widgetType === 'select-depart' && !formColumnReadOnly(column)">
              <div  class="el-select el-select--mini" style="width:100%;" @click="selectQuerters(column,scope.row,scope.$index)">
                <div class="el-input el-input--mini el-input--suffix">
                  <input type="text"  :ref="column.columnName+scope.$index" v-model="scope.row[column.columnName+'LABEL_']?scope.row[column.columnName+'LABEL_']:scope.row[column.columnName]" @blur="iptBlur(scope.row,column,scope.$index)"  readonly="readonly" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                  <input type="text"  @blur="iptBlur(scope.row,column,scope.$index)" v-model="scope.row[column.columnName]"  class="el-input__inner" style="display: none;">
                  <span class="el-input__suffix" >
                    <span class="el-input__suffix-inner">
                      <i class="el-select__caret el-input__icon el-icon-more"></i>
                     </span>
                  </span>
                </div>
              </div>
            </div>
            <el-select v-else-if="column.widgetType === 'select' && !formColumnReadOnly(column)" size="mini" v-model="scope.row[column.columnName]"
                    placeholder="请选择" :ref="column.columnName+scope.$index" @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"   @blur="iptBlur(scope.row,column,scope.$index)">
              <el-option
                v-for="val in column.options"
                :key="val.value"
                :label="val.name"
                :value="val.value"
                :disabled="val.disabled">
              </el-option>
            </el-select>
            <el-select v-else-if="(column.widgetType === 'select-dic' || column.widgetType === 'select-sql') && !formColumnReadOnly(column)" :multiple="column.multiple === 1" size="mini" v-model="scope.row[column.columnName]"
                       placeholder="请选择" :ref="column.columnName+scope.$index" @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)" @visible-change="visible=>iptBlur(scope.row,column,scope.$index,visible)" >
              <!--<el-option value="" label="-请选择-">&#45;&#45;请选择&#45;&#45;{{JSON.stringify(column.options)}}</el-option>-->
              <el-option
                v-for="val in column.options"
                :key="val.value"
                :label="val.name"
                :value="val.value"
                :disabled="val.disabled">
              </el-option>
            </el-select>

            <el-date-picker  v-else-if="column.widgetType === 'select-date' && !formColumnReadOnly(column)"
                size="mini"
                :label="column.title"
                :prop="column.columnName"
                v-model="scope.row[column.columnName+'LABEL_']"
                :type="column.dateType || 'date'"
                range-separator="至"
                :ref="column.columnName+scope.$index"
                @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"
                @blur="iptBlur(scope.row,column,scope.$index)"
                style="width: 100%;">
            </el-date-picker>

            <el-time-picker  v-else-if="column.widgetType === 'select-time' && !formColumnReadOnly(column)"
                size="mini"
                :label="column.title"
                :prop="column.columnName"
                v-model="scope.row[column.columnName+'LABEL_']"
                placeholder="选择时间"
                :ref="column.columnName+scope.$index"
                @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"
                @blur="iptBlur(scope.row,column,scope.$index)"
                value-format="HH:mm:ss"
                style="width: 100%;">
            </el-time-picker>

            <el-date-picker  v-else-if="column.widgetType === 'select-date-time' && !formColumnReadOnly(column)"
                size="mini"
                :label="column.title"
                :prop="column.columnName"
                v-model="scope.row[column.columnName+'LABEL_']"
                type="datetime"
                placeholder="选择时间日期"
                :ref="column.columnName+scope.$index"
                @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"
                @blur="iptBlur(scope.row,column,scope.$index)"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="width: 100%;">
            </el-date-picker>

            <el-input-number v-else-if="column.widgetType === 'number'" v-model="scope.row[column.columnName]" @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)" @blur="iptBlur(scope.row,column,scope.$index)" :ref="column.columnName+scope.$index" size="mini" :controls="false" style="width: 100%"></el-input-number>
            <el-input v-else size="mini" v-model="scope.row[column.columnName]" @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"  @blur="iptBlur(scope.row,column,scope.$index)" :ref="column.columnName+scope.$index"></el-input>
          </span>

          <span v-if="column.widgetType === 'switch' && !formColumnReadOnly(column)" class="edit-val" v-show="!scope.row[column.columnName+'isShow']">
            <el-switch v-if="column.widgetType === 'switch'" v-model="scope.row[column.columnName+'_SWITCH']" active-value="true" inactive-value="false"
                       :ref="column.columnName+scope.$index" @change="newVal=>handlerChangeValue(newVal,column,scope.row,scope.$index)"   @blur="iptBlur(scope.row,column,scope.$index)"> </el-switch>
            </el-switch>
          </span>

          <span v-if="column.widgetType !== 'switch' && !formColumnReadOnly(column)" class="edit-val" v-show="!scope.row[column.columnName+'isShow']"  @click="dblClick(scope.row,column,scope.$index)"  :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}">
            <span v-if="column.widgetType === 'select' || column.widgetType === 'select-dic' || column.widgetType === 'select-sql'">
              {{dicValue(column,scope.row[column.columnName]) === undefined ? scope.row[column.columnName] : dicValue(column,scope.row[column.columnName])}}
              <!--&#45;&#45;{{scope.row[column.columnName]}}&#45;&#45;{{dicMap[column.columnName][scope.row[column.columnName]]}}-->
            </span>
            <span v-else-if="column.widgetType === 'select-user' || column.widgetType === 'select-user-multi' || column.widgetType === 'select-user-list' || column.widgetType === 'select-depart'">
              {{column.ifNotRelated == 1 ? scope.row[column.columnName] : scope.row[column.columnName+'LABEL_']}}
            </span>
            <span v-else-if="column.widgetType === 'select-date' || column.widgetType === 'select-time'|| column.widgetType === 'select-date-time'">
              {{scope.row[column.columnName+'LABEL_']}}
            </span>
            <span v-else-if="column.widgetType === 'file'" >
              <i class="el-icon-paperclip" @click.stop="handlerSubFormUpload(column, scope.row)" style="cursor:pointer;font-size: 13pt;"></i>
            </span>

            <span v-else>
              {{scope.row[column.columnName]}}
            </span>
          </span>
          <span v-if="formColumnReadOnly(column)" :style="{'color':(column.openParams && column.openUrl)?'blue':'' ,'cursor':(column.openParams && column.openUrl)?'pointer':''}" @click="dblClick(scope.row,column,scope.$index)" >
            <span v-if="column.widgetType === 'select' || column.widgetType === 'select-dic' || column.widgetType === 'select-sql'">
              {{dicValue(column,scope.row[column.columnName])}}
            </span>
            <span v-else-if="column.widgetType === 'select-form' || column.widgetType === 'select-date' || column.widgetType === 'select-time'|| column.widgetType === 'select-date-time'|| column.widgetType === 'select-user' || column.widgetType === 'select-user-multi' || column.widgetType === 'select-user-list' ||  column.widgetType === 'select-depart'">
              {{scope.row[column.columnName+'LABEL_']?scope.row[column.columnName+'LABEL_']:scope.row[column.columnName]}}
            </span>
            <span v-else>
              {{scope.row[column.columnName]}}
            </span>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="selectFormVisible" >
      <div class="mask" ></div>
      <div class="boxs" :style="{width:selectFormConfig.width?selectFormConfig.width:'900px',height:selectFormConfig.height?selectFormConfig.height:'600px'}">
        <!-- <h4 style="margin:10px 0;"><i></i>{{selectFormConfig.title}}</h4> -->
        <form-view ref="select-form" @on-load="setFormWidth" :config="selectFormConfig" :select-form-key="selectFormKey"  :readOnly="true"  :queryParams="queryParams"  :single-select="selectFormSingleSelect"  :multiple-select="!selectFormSingleSelect"  style="padding:5px;border: 1px solid #e9eaec;border-radius: 5px;"></form-view>
        <div style="text-align: right;padding: 5px 0px;">
          <el-button style=""  type="info" size="mini" @click="selectFormVisible = !selectFormVisible" >取消</el-button>
          <el-button  type="warning" size="mini" @click="confirmSelect()" >确定</el-button>
        </div>
      </div>
    </div>
    <!-- 选人 -->
    <!-- <div v-for="(item, index) in selectMemberModels.selectList" :key="index">{{item.label}}</div> -->
    <selectMember  v-if="selectMemberModels.isShow" :selectMemberModels="selectMemberModels"></selectMember>
    <!-- 部门 -->
    <!-- <div v-for="(item, index) in selectQuertersModels.selectList" :key="index">{{item.label}}</div> -->
    <selectQuerters  v-if="selectQuertersModels.isShow" :selectQuertersModels="selectQuertersModels"></selectQuerters>
    <!--导入Excel-->
    <div>
      <div class="select-box" v-if="selectExcelVisible">
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
    <!--明细表附件上传-->
    <div>
      <div class="select-box" v-if="uploadDialogVisible">
        <div class="select" style="width: 600px;height: 500px;">
          <div class="title">
            <h4 style="margin:30px 22px 0;"><i></i>上传附件</h4>
          </div>
          <div class="select-center">
            <upload-dialog
              :readOnly="formColumnReadOnly(uploadDialogConfig.column)"
              :name="uploadDialogConfig.name"
              :column="uploadDialogConfig.column"
              :config="uploadDialogConfig.config"
              :filesList="uploadDialogConfig.filesList"
              :deleteFilesList="uploadDialogConfig.deleteFilesList"
              ref='upload-dialog'
              style="padding-top: 20px;"
            ></upload-dialog>
          </div>
          <div class="footer">
            <el-button  type="warning" size="mini" @click.stop="handlerUploadDialogCondirm">确定</el-button>
            <el-button style=""  type="info" size="mini" @click.stop="uploadDialogVisible = false" >取消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import CmpLoader from '../../../common/cmp-loader/cmp-loader'
  import selectQuerters from "../../select-depart/select-depart.vue";
  import selectMember from "../../select-user/select-user.vue";
  import Upload from "../../upload/upload.vue";
  import UploadDialog from "../../upload-dialog/index.vue";
  import {mixin} from './mixin.js'
  export default {
    name: "edit-table",
    mixins: [mixin],
    components: {
      selectMember,
      selectQuerters,
      CmpLoader,
      Upload,
      UploadDialog
    },
  }
</script>

<style scoped>
  .jr-container{
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    overflow-x: hidden
  }
  .jr-query-topBar-tool{
    margin-bottom: 8px;
    margin-top: 8px;
    margin-left: 0px;
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
</style>
<style>
  #jr-edit-table-panel .el-tabs__header {
    padding: 0;
    position: relative;
    margin: 0px 0 10px;
  }
  #jr-edit-table-panel .el-table__body-wrapper{
    height: 100%;
    overflow: auto;
  }
  #jr-edit-table .jr-edit-table-panel.el-table--mini td{
    padding: 0px 0;
  }
  #jr-edit-table .jr-edit-table-panel.el-input__inner{
    padding: 0px 5px;
  }
  .el-button--mini, .el-button--mini.is-round {
    padding: 7px 7px;
  }
</style>
