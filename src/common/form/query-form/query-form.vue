<template>
  <div v-if="hasQuery" class="jr-container" style="display: contents;">
    <div v-if="advanceSearchBtnVisible" class="jr-form" id="jr-cascade-content-form-2">
      <h4 v-if="hasTitle" style="font-weight: lighter;">
        <i></i>
        {{title}}
      </h4>
      <el-form :model="formData"  ref="queryForm" label-width="100px" size="mini" :label-position="'left'" class="query-form" style="padding:0px 10px 0px 10px;">
        <el-row :gutter="24" v-for="(row,index) in searchFormRows" :key="index">
          <el-col  :span="24*column.col"
            v-for="(column,colIndex) in row" :key="colIndex" >
            <el-form-item v-if="column.widgetType === 'select' || column.widgetType === 'select-dic'|| column.widgetType === 'select-api'|| column.widgetType === 'select-sql'" :label="column.title" :prop="column.columnName">
               <el-button :type="optionsBtnType[column.columnName + 'all'] || 'primary'"  @click="handlerClickAll(column)" >全部</el-button>
               <el-button :type="optionsBtnType[column.columnName + index] || ''"  v-for="(option,index) in column.options" :key="index" @click="handlerSearchBtnClick(column,index)" >{{option}}</el-button>
            </el-form-item>
            <el-form-item v-if="column.widgetType === 'number'" :label="column.title" :prop="column.columnName">
              <el-input-number  v-model="formData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)" :min="1" :label="column.title" style="width:100%;"></el-input-number>
            </el-form-item>
            <el-form-item v-if="column.widgetType === 'number-cn'" :label="column.title" :prop="column.columnName">
              <el-input  v-model="formData[column.columnName]"></el-input>
            </el-form-item>
            <el-form-item v-if="column.widgetType === 'textarea'" :label="column.title" :prop="column.columnName">
              <el-input v-model="formData[column.columnName]"  type="textarea" ></el-input>
            </el-form-item>
            <el-form-item v-if="column.widgetType === 'switch'" :label="column.title" :prop="column.columnName">
              <el-switch v-model="formData[column.columnName+'_SWITCH']"  @change="newVal=>handlerValueChange(column,newVal)" > </el-switch>
            </el-form-item>
            <el-form-item v-if="column.widgetType === 'select-date'" :label="column.title" :prop="column.columnName">
              <el-date-picker v-model="formData[column.columnName+'LABEL_']"  @change="newVal=>handlerValueChange(column,newVal)"  align="right" :type="column.dateType || 'date'" range-separator="至" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            </el-form-item>
              <el-form-item v-if="column.widgetType === 'select-time'" :label="column.title" :prop="column.columnName">
                <el-time-picker v-model="mainData[column.columnName]" :disabled="formColumnReadOnly(column)"  @change="newVal=>handlerValueChange(column,newVal)"  align="right" placeholder="选择时间" value-format="HH:mm:ss" style="width: 100%;">
              </el-time-picker>
            </el-form-item>
            <el-form-item v-if="column.widgetType === 'select-date-time'" :label="column.title" :prop="column.columnName">
              <el-date-picker v-model="mainData[column.columnName]" :disabled="formColumnReadOnly(column)"  @change="newVal=>handlerValueChange(column,newVal)"  align="right" type="datetime" placeholder="选择时间日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%;">
              </el-date-picker>
            </el-form-item>
            <el-form-item v-if="column.widgetType === 'select-user' || column.widgetType === 'select-user-multi'" :label="column.title" :prop="column.columnName">
              <input type="text" v-model="formData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)"  class="el-input__inner" style="display: none;">
              <el-input
                  v-model="formData[column.columnName+'LABEL_']"
                  placeholder="请选择"
                  :readonly="true"
                  :name="column.columnName"
                  suffix-icon="el-icon-more"
                  @click.native="selectMember(column)"
                ></el-input>
            </el-form-item>
            <el-form-item v-if="column.widgetType === 'select-depart' || column.widgetType === 'select-depart-multi'" :label="column.title" :prop="column.columnName">
                <input type="text" v-model="formData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)"  class="el-input__inner" style="display: none;">
                <el-input
                  v-model="formData[column.columnName+'LABEL_']"
                  placeholder="请选择"
                  :readonly="true"
                  :name="column.columnName"
                  suffix-icon="el-icon-more"
                  @click.native="selectQuerters(column)"
                ></el-input>
            </el-form-item>
            <el-form-item v-if="column.widgetType === 'select-form' || column.widgetType === 'open-form'" :label="column.title" :prop="column.columnName">
              <input type="text" v-model="formData[column.columnName]"  @change="newVal=>handlerValueChange(column,newVal)"  class="el-input__inner" style="display: none;">
              <el-input
                v-model="formData[column.columnName+'LABEL_']"
                placeholder="请选择"
                :readonly="true"
                :name="column.columnName"
                suffix-icon="el-icon-more"
                @click.native="openSelectForm(column)"
                style="width:100%;cursor: pointer;"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="column.widgetType === 'input' || !column.widgetType" :label="column.title" :prop="column.columnName">
              <el-input  @change="newVal=>handlerValueChange(column,newVal)"  v-model="formData[column.columnName]"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div v-if="selectFormVisible" >
      <div class="mask" ></div>
      <div class="boxs"  :style="{width:selectFormConfig.width?selectFormConfig.width:'900px',height:selectFormConfig.height?selectFormConfig.height:'600px'}">
        <!-- <h4 style="margin:10px 0;"><i></i>{{selectFormTitle}}</h4> -->
        <form-view :on-load="setFormWidth" :hasTitle="false" :queryParams="selectFormQueryParams" :isModal="true" :select-form-key="selectFormKey"  :readOnly="true"   :single-select="true"  :multiple-select="false" ref="select-form"></form-view>
        <div style="text-align: right;padding: 5px 0px;">
          <el-button style=""  type="info" size="mini" @click="selectFormVisible = !selectFormVisible" >取消</el-button>
          <el-button  type="warning" size="mini" @click="confirmSelect()" >确定</el-button>
        </div>
      </div>
    </div>
    <div class="jr-query" id="jr-cascade-content-query-2">
      <div class="jr-query-topBar">
        <h4 v-if="advanceSearchBtnVisible" style="font-weight: lighter;display: inline-block;padding: 0;margin: 5px 0px 0px 10px;">
          <i></i>&nbsp;
          查询
        </h4>
        <h4 v-else style="font-weight: lighter;display: inline-block;padding: 0;margin: 5px 0 0 10px;padding-left: 14px;">
          <i></i>&nbsp;
           {{title}}
        </h4>
        <div class="jr-query-topBar-search">
          <!-- 选人 -->
          <!-- <div v-for="(item, index) in selectMemberModels.selectList" :key="index">{{item.label}}</div> -->
          <selectMember v-if="selectMemberModels.isShow" :selectMemberModels="selectMemberModels"></selectMember>
          <!-- 部门 -->
          <!-- <div v-for="(item, index) in selectQuertersModels.selectList" :key="index">{{item.label}}</div> -->
          <selectQuerters v-if="selectQuertersModels.isShow" :selectQuertersModels="selectQuertersModels"></selectQuerters>
          <!-- <div v-if="searchVisible" style="float:right;">
            <el-input placeholder="请输入关键字" @keyup.enter.native="queryData()" size="mini" v-model="keyword" class="input-with-select">
              <el-button slot="append" @click="queryData()" icon="el-icon-search"></el-button>
            </el-input>
          </div> -->
          <div v-if="searchVisible" style="float:right;">
            <el-input placeholder="请输入关键字" @keyup.enter.native="queryData()" size="mini" v-model="keyword" class="input-with-select">
            </el-input>
          </div>
          <div v-if="searchVisible" style="float:right;margin-left:10px;">
            <el-button round type="warning" size="mini" @click="queryData()" icon="el-icon-search">查询</el-button>
          </div>
          <div v-if="resetVisible" style="float:right;margin-left:10px;">
            <el-button round type="info" size="mini" @click="queryData(0)" icon="el-icon-refresh">取消</el-button>
          </div>
          <div v-if="topButtons && topButtons.length>0" style="float:right;margin-left:10px;">
            <template v-if="isTree">
              <i v-for="(button,index) in topButtons" v-if="button.hidden === undefined || button.hidden === false || button.hidden === 0" :type="button.type?button.type:'warning'" :class="button.class"  size="mini" style=""
                :title="button.title"  @click="handlerTopButtonClick(button)">
              </i>
            </template>
            <template v-else>
              <el-button v-for="(button,index) in topButtons" v-if="button.hidden === undefined || button.hidden === false || button.hidden === 0" :key="index" round type="warning" size="mini" :icon="button.icon" @click="handlerTopButtonClick(button)">{{button.title}}</el-button>
            </template>
         </div>
          <!-- <div v-if="advanceSearchBtnVisible && !advanceSearchVisible" style="float:right;margin-left: 10px;">
            <el-button  type="warning" v-on:click="handlerAdvanceBtnClick" size="mini" icon="el-icon-caret-bottom" circle></el-button>
          </div>
          <div v-if="advanceSearchBtnVisible && advanceSearchVisible" style="float:right;margin-left: 10px;">
            <el-button  type="warning" v-on:click="handlerAdvanceBtnClick" size="mini" icon="el-icon-caret-top" circle></el-button>
          </div> -->
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
          <!--选择模板-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import selectQuerters from "../../select-depart/select-depart.vue";
  import selectMember from "../../select-user/select-user.vue";
  import {mixin} from './mixin.js'
  import {commonMixin} from '../../commonMixin.js'
  export default {
    name: "query-form",
    mixins:[mixin,commonMixin],
    components: {
      selectMember,
      selectQuerters
    },
  }
</script>

<style scoped>
  .jr-container{
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
  }
  .jr-query{
    /*height:40px;*/
  }
  .jr-query-topBar-tool{
    float:left;
  }
  .jr-query-topBar-search{
    float:right;
    display: flex;
  }
  .jr-query-topBar{
    height: 30px;
    padding-top:7px;
    padding-bottom:7px;
    padding-right: 10px;
    background: none;
    border-top: 1px solid #44d2ff;
    border-bottom: 1px solid #44d2ff;
    /* border-bottom: 1px solid #ebeef5; */
  }
  .jr-form{
    background-color: none;
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    /*margin-bottom:10px;*/
  }
  query-form{
    padding:0px 10px 0px 10px;
  }
  </style>
<style scoped>
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

   h4 {
    font-size: 18px;
    font-family: SourceHanSansCN-Medium;
    padding-left: 12px;
    position: relative;
    margin: 30px 0;
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
  .query-form .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
    margin-bottom: 10px;
  }
</style>
