<template>
  <div id="jr-edit-form" class="jr-container"  style="overflow-x: hidden"   v-loading="loading"  element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div v-if="!processFormVisible" class="jr-form-tool">
      <el-button-group style="float:right">
        <el-button v-if="!readOnly && !disabled" type="warning" size="mini" @click="submit(-1)">保存</el-button>
        <!-- <el-button type="warning" size="mini" @click="submit(9)">打印</el-button> -->
        <el-button type="warning" size="mini" @click="submit(10)" >导出</el-button>
        <el-button type="info" size="mini" @click="submit(0)">关闭</el-button>
      </el-button-group>
    </div>
    <!--<el-button type="warning" size="mini" @click="submit(-1)">保存</el-button>-->
    <!--<el-button type="info" size="mini" @click="submit(-2)">测试</el-button>-->
    <div v-if="processFormVisible" >
      <!--<div class="mask" ></div>-->
      <!--<div class="boxs"  :style="{width:config.formWidth?config.formWidth:'50%',height:config.formHeight?config.formHeight:'50%'}">-->
      <!--<h4 style="margin:10px 0;"><i></i>流程提交</h4>-->
      <!--{{readOnly}}&#45;&#45;{{disabled}} &#45;&#45; {{computeReadOnly()}}-->
      <process-form :readOnly="computeReadOnly()" :model="processModel"  ref="process-form"></process-form>
      <!--</div>-->
    </div>
    <!--<div style="height: 100%;background-color: red"></div>-->
    <div class="jr-form-main" style="">
      <el-form :model="mainData" :rules="rules" ref="mainForm" label-width="100px" size="mini" :label-position="'right'" style="display: flex;flex-flow: column;">
        <el-row :gutter="24" v-for="(row,index) in formRows" :key="index">
          <el-col :span="24*column.newCol" v-for="(column,colIndex) in row" :key="colIndex">

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'input'" :label="column.title" :prop="column.columnName">
              <el-input  :disabled="formColumnReadOnly(column)"  @change="newVal=>handlerValueChange(column,newVal)"  v-model="mainData[column.columnName]"></el-input>
            </el-form-item>
            <!-- 地图选择控件 -->
            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'select-map-point'" :label="column.title" :prop="column.columnName">
              <!--<el-input  :disabled="formColumnReadOnly(column)"  @change="newVal=>handlerValueChange(column,newVal)"  v-model="mainData[column.columnName]"></el-input>
              <div style="position:absolute;right:0;top:0;">
                <img @click="openAddress(column)" style="height:39px;margin-left:7px" src="../../../assets/location.png" alt="">
              </div>-->
              <input type="text" v-model="mainData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)"  class="el-input__inner" style="display: none;">
              <el-input
                v-model="mainData[column.columnName]"
                placeholder="请选择"
                :disabled="formColumnReadOnly(column)"
                :name="column.columnName"
                suffix-icon="el-icon-place"
                @click.native="openAddress(column)"
                style="width:100%;cursor: pointer;"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'number'" :label="column.title" :prop="column.columnName">
              <el-input-number :disabled="formColumnReadOnly(column)"  v-model="mainData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)" :label="column.title" style="width:100%;"></el-input-number>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'number-cn'" :label="column.title" :prop="column.columnName">
              <el-input :disabled="formColumnReadOnly(column)"    v-model="mainData[column.columnName]"></el-input>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'textarea'" :label="column.title" :prop="column.columnName">
              <el-input v-model="mainData[column.columnName]" :disabled="formColumnReadOnly(column)" type="textarea" ></el-input>
            </el-form-item>

            <el-form-item style="width:100%;padding-bottom:30px;" v-if="!formColumnHidden(column) && column.widgetType === 'full-editor'" :label="column.title" :prop="column.columnName">
              <quill-editor v-if="!formColumnReadOnly(column)" :options="editorOption"
                @blur="onEditorBlur($event)"
                @focus="onEditorFocus($event)"
                @change="onEditorChange($event)"
                @ready="onEditorReady($event)"
                v-model="mainData[column.columnName]"
                ref="QuillEditor"  style="margin-bottom: 13px;">
              </quill-editor>
              <div v-if="formColumnReadOnly(column)" style="width:100%;" v-html="mainData[column.columnName]">

              </div>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'switch'" :label="column.title" :prop="column.columnName">
              <el-switch v-model="mainData[column.columnName+'_SWITCH']" :disabled="formColumnReadOnly(column)" @change="newVal=>handlerValueChange(column,newVal)" > </el-switch>
            </el-form-item>
            <h4 v-if="column.widgetType === 'divider'" style="font-weight: lighter;display: inline-block;padding: 0;">
              <i></i>&nbsp;
              {{column.title}}
            </h4>

            <template v-if=" !formColumnHidden(column) && (column.widgetType === 'select' ||column.widgetType === 'select-dic' || column.widgetType === 'select-sql')">

              <el-form-item :label="column.title" :prop="column.columnName">
                <el-select v-if="column.multiple === 1" v-model="mainData[column.columnName + 'LABEL_']" :multiple="column.multiple === 1" :disabled="formColumnReadOnly(column)"  placeholder="请选择"  @change="newVal=>handlerValueChange(column,newVal)"  style="width:100%;">
                  <el-option v-for="(option,optionIndex) in column.options" :key="optionIndex" :label="option.name" :value="option.value"></el-option>
                </el-select>

                <el-select v-else v-model="mainData[column.columnName]" :multiple="column.multiple === 1" :disabled="formColumnReadOnly(column)"  placeholder="请选择"  @change="newVal=>handlerValueChange(column,newVal)"  style="width:100%;">
                  <el-option v-for="(option,optionIndex) in column.options" :key="optionIndex" :label="option.name" :value="option.value"></el-option>
                </el-select>
              </el-form-item>

            </template>

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'select-date'" :label="column.title" :prop="column.columnName">
              <el-date-picker v-model="mainData[column.columnName]" :disabled="formColumnReadOnly(column)"  @change="newVal=>handlerValueChange(column,newVal)" range-separator="至" align="right" :type="column.dateType || 'date'" style="width: 100%;">
              </el-date-picker>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'select-date-time'" :label="column.title" :prop="column.columnName">
 			        <span v-if="formColumnReadOnly(column)">{{ formatDate(column, mainData[column.columnName])}}</span>
              <el-date-picker v-else v-model="mainData[column.columnName]"  :disabled="formColumnReadOnly(column)"  @change="newVal=>handlerValueChange(column,newVal)"  align="right" type="datetime" placeholder="选择时间日期"
              value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;">
              </el-date-picker>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'select-time'" :label="column.title" :prop="column.columnName">
              <el-time-picker v-model="mainData[column.columnName]" :disabled="formColumnReadOnly(column)"  @change="newVal=>handlerValueChange(column,newVal)"  align="right" placeholder="选择时间" style="width: 100%;"
              :value-format="validUtil.isNotNull(column.dateType)?column.dateType:'HH:mm:ss'" :format="validUtil.isNotNull(column.dateType)?column.dateType:'HH:mm:ss'">
              </el-time-picker>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && (column.widgetType === 'select-user' || column.widgetType === 'select-user-multi')" :label="column.title" :prop="column.columnName">
              <input type="text" v-model="mainData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)"  class="el-input__inner" style="display: none;">
              <el-input
                  v-model="column.ifNotRelated === 1? mainData[column.columnName]:mainData[column.columnName+'LABEL_']"
                  placeholder="请选择"
                  :readonly="true"
                  :disabled="formColumnReadOnly(column)"
                  :name="column.columnName"
                  suffix-icon="el-icon-more"
                  @click.native="selectMember(column)"
                ></el-input>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && (column.widgetType === 'select-user-list' || column.widgetType === 'select-role-list' || column.widgetType === 'select-depart-list')" :label="column.title" :prop="column.columnName">
              <div v-if="column.widgetType === 'select-user-list'">
                <div class="load">
                  <ul style="margin-bottom:0px;">
                    <li style="margin-top: 2px;">
                      <ul style="overflow:hidden;">
                        <li
                          v-if="typeof mainData[column.columnName] === 'object'"
                          style="float:left;margin:5px 5px 5px 5px;margin-right: 10px;position:relative;text-align:left;width:43px;display: inline-block;"
                          v-for="procUser in mainData[column.columnName]" :key="procUser.id">
                          <div>
                            <div>
                              <img style="width:43px;height:43px;" :src="procUser.picture || 'https://rescdn.qqmail.com/node/wwmng/wwmng/style/images/independent/DefaultAvatar$73ba92b5.png'" alt=""></div>
                            <div style="text-align:center; font-size: 10px; color: black;height: 13px;">
                              <span>{{procUser.userName && procUser.userName.length>4?procUser.userName.substring(procUser.userName.length-4,procUser.userName.length):procUser.userName}}</span>
                            </div>
                          </div>
                          <i v-if="!formColumnReadOnly(column)" @click="removeProcUser(procUser, column)" class="el-icon-error" style="position:absolute;top:-3px;left:30px;z-index:2;color: #a0a6b5;"></i>
                          <!-- <i @click="removeProcUser(procUser, column)" class="changeDelete"
                            style="position:absolute;top:-3px;left:30px;background:#f00;width:20px;height:20px;font-size:14px;line-height:20px;border-radius:50%;color:#fff">&nbsp;X</i> -->
                        </li>
                        <li v-if="!formColumnReadOnly(column)"
                            style="float:left;margin:5px 0px 17px 3px;position:relative;text-align:left;width:43px;display: inline-block;">
                          <div>
                            <svg class="icon" style="width:46px;height:46px;fill:#ccc;font-size:46px;color:#ccc;" @click="selectMember(column)" aria-hidden="true">
                              <use xlink:href="#icon-tianjiarenyuan"></use>
                            </svg>
                            <!-- <img style="width:45px;height:45px;" @click="addProcUser()" src="../../assets/addPeople1.png"> -->
                          </div>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              <!--<selectMember :selectMemberModels="selectMemberModels"></selectMember>-->
              <div v-if="typeof mainData[column.columnName] === 'object' && column.widgetType === 'select-role-list'" v-for="obj in mainData[column.columnName]" class="c-member" >
                <span class="c-icon c-member-icon-user"></span>
                <span class="c-member-text">{{obj.roleName}}</span>
              </div>
              <div v-if="typeof mainData[column.columnName] === 'object' && column.widgetType === 'select-depart-list'" v-for="obj in mainData[column.columnName]" class="c-member" >
                <span class="c-icon c-member-icon-depart"></span>
                <span class="c-member-text">{{obj.departName}}</span>
              </div>

              <!-- <a v-if="column.widgetType === 'select-user-list' && !(typeof mainData[column.columnName] === 'object' && mainData[column.columnName].length > 0)" class="c-items-content-rule-type-add" href="javascript:;" @click="selectMember(column)">添加</a> -->
              <a v-if="column.widgetType === 'select-role-list'" class="c-items-content-rule-type-add" href="javascript:;" @click="selectRole(column)">{{mainData[column.columnName] && (typeof mainData[column.columnName] === 'object' && mainData[column.columnName].length >0) ?'修改':'添加'}}</a>
              <a v-if="column.widgetType === 'select-depart-list'" class="c-items-content-rule-type-add" href="javascript:;" @click="selectQuerters(column)">{{mainData[column.columnName] && (typeof mainData[column.columnName] === 'object' && mainData[column.columnName].length >0)?'修改':'添加'}}</a>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && (column.widgetType === 'select-role' || column.widgetType === 'select-role-multi')" :label="column.title" :prop="column.columnName">
              <input type="text" v-model="mainData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)"  class="el-input__inner" style="display: none;">
              <el-input
                  v-model="mainData[column.columnName+'LABEL_']"
                  placeholder="请选择"
                  :readonly="true"
                  :disabled="formColumnReadOnly(column)"
                  :name="column.columnName"
                  suffix-icon="el-icon-more"
                  @click.native="selectRole(column)"
                ></el-input>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'select-cascade'" :label="column.title" :prop="column.columnName">
              <el-cascader :ref="column.columnName + 'cascade'" v-model="mainData[column.columnName+'cascade']" :placeholder="mainData[column.columnName+'placeholder'] || '请选择'" :props="getAddressCascader(column)" clearable></el-cascader>
            </el-form-item>
            <el-form-item v-if="!formColumnHidden(column) && (column.widgetType === 'select-depart' || column.widgetType === 'select-depart-multi')" :label="column.title" :prop="column.columnName">
                <input type="text" v-model="mainData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)"  class="el-input__inner" style="display: none;">
                <el-input
                  v-model="mainData[column.columnName+'LABEL_']"
                  placeholder="请选择"
                  :disabled="formColumnReadOnly(column)"
                  :name="column.columnName"
                  suffix-icon="el-icon-more"
                  @click.native="selectQuerters(column)"
                ></el-input>
            </el-form-item>
            <!--
            <el-form-item v-if="column.widgetType === 'select-form'" :label="column.title" :prop="column.columnName">
              <div  class="el-select el-select--mini" style="width:100%;" @click="openSelectForm(column)">
                <div class="el-input el-input--mini el-input--suffix">
                  <input type="text" v-model="mainData[column.columnName+'LABEL_']"  :disabled="formColumnReadOnly(column)" autocomplete="off" placeholder="请选择"  class="el-input__inner">
                  <input type="text" v-model="mainData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)"  class="el-input__inner" style="display: none;">
                  <span class="el-input__suffix" >
                    <span class="el-input__suffix-inner">
                      <i class="el-select__caret el-input__icon el-icon-more"></i>
                     </span>
                  </span>
                </div>
              </div>
            </el-form-item>
            -->
            <!-- -->
            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'select-form'" :label="column.title" :prop="column.columnName">
              <input type="text" v-model="mainData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)"  class="el-input__inner" style="display: none;">
              <el-input
                v-model="mainData[column.columnName+'LABEL_']"
                placeholder="请选择"
                :disabled="formColumnReadOnly(column)"
                :name="column.columnName"
                suffix-icon="el-icon-more"
                @click.native="openSelectForm(column)"
                style="width:100%;cursor: pointer;"
              ></el-input>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'open-form'" :label="column.title" :prop="column.columnName">
              <el-input
                v-model="mainData[column.columnName]"
                placeholder="请选择"
                :disabled="formColumnReadOnly(column)"
                :name="column.columnName"
                suffix-icon="el-icon-more"
                @click.native="openSelectForm(column)"
                style="width:100%;cursor: pointer;"
              ></el-input>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'pic-view'" :label="column.title" :prop="column.columnName">
              <a :href="computePicView(column)" target="_blank">
                <img :src="computePicView(column)" :style="{width: column.width,height: column.height}">
                </img>
              </a>
            </el-form-item>

            <el-form-item v-if="!formColumnHidden(column) && column.widgetType === 'file'" :label="column.title" :prop="column.columnName">
              <upload
                :readOnly="formColumnReadOnly(column)"
                :name="column.columnName"
                :config="column.config"
                :ref="'uploading_'+column.columnName" @on-success="file=>handlerFileUploadSuccess(column,file)"
              ></upload>
            </el-form-item>
            <div v-if="!formColumnHidden(column) && column.widgetType === 'sub-form'"  :style="{'height': '100%','margin-bottom':(index ===formRows.length-1?'0px':'15px') }">
              <el-button v-if="config.formExcelList && config.formExcelList.length > 0" round type="warning"  @click.native.prevent="handlerExcelClick()" size="mini" icon="el-icon-download">导入</el-button>
              <!--{{readOnly}}-->
              <el-tabs ref="tabs" v-model="activeTab" @tab-click="handleTabClick" style="height: 100%;">
                <el-tab-pane v-for="(subForm,subFormIndex) in column.subForms" :key="subFormIndex" :label="subForm.title" :name="'subForm'+(subFormIndex+1)" style="min-height: 450px;width: 100%;height: 450px;">
                  <!--{{'sub-form-'+subForm.index}}-->

                  <edit-table :config="subForm.config" :readOnly="readOnly" style="overflow-y: auto" :ref="'sub-form-'+subForm.key" > </edit-table>
                </el-tab-pane>
              </el-tabs>
            </div>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="24">
            <el-form-item v-for="(column,index) in hiddenColumns" :key="index" hidden= ture  :label="column.title" :prop="column.columnName">
              <el-input v-model="mainData[column.columnName]" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
        <!--{{JSON.stringify(processModel)}}-->
        <process-monitor  v-if="processMonitorVisible" :model="processModel" ref="process-monitor"></process-monitor>

        </el-row>


      </el-form>

    </div>
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
    <!-- 选角色 -->
    <selectRole v-if="selectRoleModels.isShow" :selectRoleModels="selectRoleModels"></selectRole>
    <!-- 部门 -->
    <!-- <div v-for="(item, index) in selectQuertersModels.selectList" :key="index">{{item.label}}</div> -->
    <selectQuerters v-if="selectQuertersModels.isShow" :selectQuertersModels="selectQuertersModels"></selectQuerters>
    <!-- 选用户 -->
    <selectMember v-if="selectMemberModels.isShow" :selectMemberModels="selectMemberModels"></selectMember>
    <!-- 地图选择 -->
    <ChooseAddress v-show="addressObj.addressVisible" ref="chooseAddress" :address="addressObj" @chooseAddress="chooseAddress($event)"></ChooseAddress>

    <div v-if="subFormsVisible" class="jr-form-sub"></div>
    <div v-if="selectFormVisible" >
      <div class="mask" ></div>
      <div class="boxs"  :style="{width:selectFormConfig.width?selectFormConfig.width:'900px',height:selectFormConfig.height?selectFormConfig.height:'600px'}">
        <!-- <h4 style="margin:10px 0;"><i></i>{{selectFormTitle}}</h4> -->
        <form-view @on-load="setFormWidth" :hasTitle="false" :queryParams="selectFormQueryParams" :isModal="true" :select-form-key="selectFormKey"  :readOnly="true"   :single-select="true"  :multiple-select="false" ref="select-form"></form-view>
        <div style="text-align: right;padding: 5px 0px;">
          <el-button style=""  type="info" size="mini" @click="selectFormVisible = !selectFormVisible" >取消</el-button>
          <el-button  type="warning" size="mini" @click="confirmSelect()" >确定</el-button>
        </div>
      </div>
    </div>
    <!--选择模板-->
    <div>
      <div class="select-box" v-if="selectModalVisible">
        <div class="select">
          <div class="title">
            <h4 style="margin:30px 22px 0;"><i></i>请选择报表</h4>
          </div>
          <div class="select-center">
            <ul>
              <li v-for="(item,key) in modalList" :key="key" @click="selected(item,modalList)"
                  style="border-bottom: dashed  1px rgb(235, 233, 233);">
                <p>{{item.title}}</p>
                <img class="select-img" src="../../../assets/administrationIcon/active.png" width="20px"
                     v-show="item.selected" alt="">
                <img class="select-img" src="../../../assets/administrationIcon/defult.png" width="20px"
                     v-show="!item.selected" alt="">
              </li>
            </ul>
          </div>
          <div class="footer">
            <button @click="selectModal" class="button">提交</button>
            <button @click="selectModalVisible = false">取消</button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {mixin} from './mixin.js'
  // import TreeTable from '../tree-table/tree-table'
  // import QueryForm from '../query-form/query-form'
  // import FormView from '../form-view/form-view'
  import selectRole from '../../select-role/select-role.vue'
  import selectQuerters from "../../select-depart/select-depart.vue";
  import selectMember from "../../select-user/select-user.vue";
  import { quillEditor } from "vue-quill-editor";
  // 引入流程提交页面
  import ProcessForm from "../../wf/v2/process-form.vue";
  import Upload from "../../upload/upload.vue";
  import webapp from '../../../sys/report/grhtml5-6.6-min.js'
  import ChooseAddress from '../chooseAddress/ChooseAddress.vue'
  import ProcessMonitor from '../../wf/v3/process-monitor.vue'

  export default {
    name: "form-edit",
    mixins: [mixin],
    components: {
      selectMember,
      selectQuerters,
      ProcessForm,
      ProcessMonitor,
      Upload,
      selectRole,
      quillEditor,
      ChooseAddress
    }
  }
</script>

<style scoped>
  .jr-container{
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  .jr-form-tool {
    /*border-top:1px solid #efefef;*/
    padding-top: 0px;
    /*padding-left: 12px;*/
    padding-bottom: 0px;
    /*border-bottom:1px solid #efefef;*/
    margin-bottom: 10px;
  }

  .jr-form-main {
    background-color: white;
    border: 1px solid #efefef;
    border-radius: 5px;
    padding: 10px;
    /*display:table;*/
    /*display: flex;*/
    /*flex-flow: column;*/
    margin-bottom: 10px;
    /*height:100%;*/
  }

  .jr-form-sub {
    margin-top: 10px;
    border: 1px solid #efefef;
    height: 100%;
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
  #jr-edit-form .el-tabs__content{
    height: 100%;
    display: flex;
  }
  #jr-edit-form .el-tabs__header{
    padding: 0;
    position: relative;
    margin: 0 0 8px;
  }
  #jr-edit-form .el-col {
    border-radius: 4px;
    margin-left: 0px;
  }
  #jr-edit-form .el-row {
    /*padding-left: 10px;*/
    /*padding-right: 10px;*/
    /*width: 100%;*/
    margin-bottom: 0px;
  }
  #jr-edit-form .el-button--mini, .el-button--mini.is-round {
    padding: 7px 7px;
  }

  #jr-edit-form .el-table__body-wrapper {
    overflow: auto;
    position: relative;
  }
  #jr-edit-form .el-input__inner {
    cursor: pointer;
  }
  .select-box {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 998;
  }

  .select {
    position: absolute;
    z-index: 999;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    width: 460px;
    height: 250px;
    overflow: hidden;
    padding: 68px 20px 58px 20px;
    box-sizing: border-box;
  }

  .select-center {
    width: 100%;
    height: 100%;
    overflow: auto;
  }

  #jr-edit-form h4 {
    color: #333;
    font-size: 18px;
    font-family: SourceHanSansCN-Medium;
    padding-left: 25px;
    position: relative;
    margin: 5px 0px 15px 0px;

  }

  h4 i {
    content: "";
    position: absolute;
    left: 0;
    top: 4px;
    height: 20px;
    width: 2px;
  }

  .select .title {
    position: absolute;
    top: 0;
    width: 100%;
    left: 0;
  }

  .img-box img {
    width: 100%;
    margin-top: 4px;
  }

  .footer {
    position: absolute;
    bottom: 20px;
    width: 100%;
    left: 0;
  }

  .footer button {
    float: right;
    width: 60px;
    height: 28px;
    margin-right: 20px;
  }

  .select-center li {
    height: 37px;
    box-sizing: border-box;
    padding: 6.5px 0;
  }

  .select-center li p {
    float: left;
  }

  .select-center li img {
    float: left;
    margin-right: 8px;
  }

  .select-center li .select-img {
    float: right;
  }

  .button {
    background: rgb(92, 154, 212);
    color: rgb(255, 255, 255);
    border-color: rgb(92, 154, 212);
  }

  /* .buttonGroup {
      position: fixed;
      bottom: 16px;
      background: white;
      height: 50px;
      z-index: 100;
      right: 65px;
  } */
  .jrsoft-process {
    padding-bottom: 10px;
  }

  .jrsoft-process img {
    vertical-align: middle;
  }

  .btnClass button {
    height: 35px;
  }

  .span-look {
    margin-left: 20px;
    text-align: left;
    color: #9a9a9a;
    cursor: pointer;
  }

  span.span-look:hover {
    color: #908c8c;
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
  .quill-editor {
    height: 200px;
    width: 100%;
  }
  .c-member{
    font-size: 13px;
    height: 22px;
    float: left;
    max-width: 231px;
    line-height: 1.5;
    margin: 0px 10px 3px 0;
    padding: 4px 5px 0px 5px;
    background-color: #fff;
    border: 1px solid #E4E6E9;
    border-radius: 2px;
  }
  .c-icon {
    display: inline-block;
    overflow: hidden;
    font-size: 0;
    line-height: 0;
  }
  .c-member-icon-user{
    background-size: 100% 100%;
    width: 12px;
    height: 12px;
    float: left;
    margin: 3px 5px 0 0;
  }
  .c-member-icon-depart{
    background-image: url(../../../public/icon/wework-1.png);
    background-position: -169px -306px;
    width: 14px;
    height: 12px;
    float: left;
    margin: 3px 5px 0 0;
  }
  .c-icon-add {
    background-image: url(../../../public/icon/wework.png);
    background-position: -176px -676px;
    width: 12px;
    height: 12px;
    margin-right: 5px;
  }

  .c-member-text{
    float: left;
    max-width: 174px;
    padding-right: 11px;
    overflow: hidden;
    line-height: 18px;
    cursor: default;
  }
  .el-cascader--mini {
      width: 100%;
  }
</style>
