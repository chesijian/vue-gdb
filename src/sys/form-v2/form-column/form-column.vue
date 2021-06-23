<template>
  <div class="jr-container">
    <el-form id="jr-edit-form" :model="formData" :rules="rules" ref="form" label-width="100px" size="mini"
             :label-position="'right'" style="display: flex;flex-flow: column;">
      <el-row :gutter="20" style="display: none;">
        <el-col :span="24">
          <el-form-item label="主键" prop="id">
            <el-input v-model="formData['id']"  placeholder="主键"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item :label="getTitle('title')" prop="title">
            <el-input v-model="formData['title']" :placeholder="getTitle('title')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('columnName')" prop="columnName">
            <el-input v-model="formData['columnName']" :placeholder="getTitle('columnName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('javaType')" prop="javaType">
            <el-select v-model="formData['javaType']" :label="getTitle('javaType')" style="width:100%;"  @change="newVal=>handlerValueChange('javaType',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(option, index) in columnsMap['javaType'].options" :key="index" :label="option.name" :value="option.value"></el-option>
            </el-select>
          </el-form-item>

        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="8" >
          <el-form-item :label="getTitle('widgetType')" prop="widgetType">
            <el-select v-model="formData['widgetType']" :label="getTitle('widgetType')" style="width:100%;"  @change="newVal=>handlerValueChange('widgetType',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(option, index) in columnsMap['widgetType'].options" :key="index" :label="option.name" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('attr')" prop="attr">
            <el-input v-model="formData['attr']" :placeholder="getTitle('attr')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8" style="display: flex;">
          <el-form-item :label="getTitle('silence')" prop="silence">
            <el-switch v-model="formData['silence_SWITCH']" @change="newVal=>handlerValueChange('silence',newVal)" > </el-switch>
          </el-form-item>
          <el-form-item :label="getTitle('hidden')" prop="hidden" label-width="55px">
            <el-switch v-model="formData['hidden_SWITCH']" @change="newVal=>handlerValueChange('hidden',newVal)" > </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="formData['widgetType'] === 'select-user-list' || formData['widgetType'] === 'select-role-list' || formData['widgetType'] === 'select-depart-list' || formData['widgetType'] === 'select-cascade'" :gutter="20">
        <el-col :span="8">
          <el-form-item :label="getTitle('subFormForeignKey')" prop="subFormForeignKey">
            <el-input v-model="formData['subFormForeignKey']" :placeholder="getTitle('subFormForeignKey')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('tableName')" prop="tableName">
            <el-input v-model="formData['tableName']" :placeholder="getTitle('tableName')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="type === 4 || type === 2" :gutter="20">
        <el-col :span="8">
          <el-form-item :label="getTitle('require')" prop="require">
            <el-switch v-model="formData['require_SWITCH']" @change="newVal=>handlerValueChange('require',newVal)" > </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('validType')" prop="validType">
            <el-input v-model="formData['validType']" :placeholder="getTitle('validType')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="type === 4 || type === 2" :gutter="20">
        <el-col :span="8">
          <el-form-item :label="getTitle('validRule')" prop="validRule">
            <el-input v-model="formData['validRule']" :placeholder="getTitle('validRule')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('validMessage')" prop="validMessage">
            <el-input v-model="formData['validMessage']" :placeholder="getTitle('validMessage')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="type === 1 || type === 4" :gutter="20">
        <el-col :span="8">
          <el-form-item :label="getTitle('titleAlign')" prop="titleAlign">
            <el-select v-model="formData['titleAlign']" :label="getTitle('titleAlign')" style="width:100%;"  @change="newVal=>handlerValueChange('titleAlign',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(option, index) in columnsMap['titleAlign'].options" :key="index" :label="option.name" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('dataAlign')" prop="dataAlign">
            <el-select v-model="formData['dataAlign']" :label="getTitle('dataAlign')" style="width:100%;"  @change="newVal=>handlerValueChange('dataAlign',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(option, index) in columnsMap['dataAlign'].options" :key="index" :label="option.name" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="type === 2" :gutter="20">
        <el-col :span="8">
          <el-form-item :label="getTitle('readOnly')" prop="readOnly">
            <el-switch v-model="formData['readOnly_SWITCH']" @change="newVal=>handlerValueChange('readOnly',newVal)" > </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('onlyRule')" prop="onlyRule">
            <el-select v-model="formData['onlyRule']" :label="getTitle('onlyRule')" style="width:100%;"  @change="newVal=>handlerValueChange('onlyRule',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(option, index) in columnsMap['onlyRule'].options" :key="index" :label="option.name" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="type !== 3" :gutter="20">
        <el-col :span="8">
          <el-form-item :label="getTitle('openType')" prop="openType">
            <el-select v-model="formData['openType']" :label="getTitle('openType')" style="width:100%;"  @change="newVal=>handlerValueChange('openType',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(option, index) in columnsMap['openType'].options" :key="index" :label="option.name" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('openUrl')" prop="openUrl">
            <el-input v-model="formData['openUrl']" :placeholder="getTitle('openUrl')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('openParams')" prop="openParams">
            <el-input v-model="formData['openParams']" :placeholder="getTitle('openParams')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="type !== 3" :gutter="20">

        <el-col :span="8">
          <el-form-item :label="getTitle('openWidth')" prop="openWidth">
            <el-input-number v-model="formData['openWidth']" :placeholder="getTitle('openWidth')"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('openHeight')" prop="openHeight">
            <el-input-number v-model="formData['openHeight']" :placeholder="getTitle('openHeight')"></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20" v-if="type != 4">
        <el-col :span="8">
          <el-form-item :label="getTitle('row')" prop="row">
            <el-input-number v-model="formData['row']" :placeholder="getTitle('row')"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('col')" prop="col">
            <el-input-number v-model="formData['col']" :placeholder="getTitle('col')"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col v-if="formData['javaType'] === 'CellButton' ||  formData['widgetType'] === 'top-button' ||  formData['widgetType'] === 'button'" :span="8">
          <el-form-item :label="getTitle('icon')" prop="icon">
            <el-input v-model="formData['icon']" :placeholder="getTitle('icon')"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="type === 1 && formData['javaType'] !== 'CellButton' && formData['widgetType'] !== 'top-button' &&  formData['widgetType'] !== 'button'" :span="8">
          <el-form-item :label="getTitle('summary')" prop="summary">
            <el-switch v-model="formData['summary_SWITCH']" @change="newVal=>handlerValueChange('summary',newVal)" > </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="type === 1">
        <el-col :span="8">
          <el-form-item :label="getTitle('matchType')" prop="matchType">
            <el-select v-model="formData['matchType']" :label="getTitle('matchType')" style="width:100%;"  @change="newVal=>handlerValueChange('matchType',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(option, index) in columnsMap['matchType'].options" :key="index" :label="option.name" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('initMatchValue')" prop="icon">
            <el-input v-model="formData['initMatchValue']" :placeholder="getTitle('initMatchValue')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('width')" prop="width">
            <el-input-number v-model="formData['width']" > </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="type === 1 || type === 4">
        <el-col :span="8">
          <el-form-item :label="getTitle('sortRule')" prop="sortRule">
            <el-select v-model="formData['sortRule']" :label="getTitle('sortRule')" style="width:100%;"  @change="newVal=>handlerValueChange('sortRule',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(option, index) in columnsMap['sortRule'].options" :key="index" :label="option.name" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="type === 1">
        <el-col :span="24">
      <el-form-item v-if="formData['javaType'] === 'TopButton' || formData['javaType'] === 'CellButton' || formData['widgetType'] === 'tag' " label="触发API接口" prop="api">
        <!--<input type="text" v-model="formData['sourceAttr']"   class="el-input__inner" style="display: none;">
        <el-input
          v-model="formData['sourceAttrCn']?formData['sourceAttrCn']:formData['sourceAttr']"
          placeholder="请选择"
          name="api"
          suffix-icon="el-icon-more"
          @click.native="apiSelectDialogVisible = true"
          style="width:100%;cursor: pointer;"
        ></el-input>
          collapse-tags-->
        <el-select
          v-model="formData['sourceAttrArr']"
          multiple
          style="margin-left: 20px;width: 90%"
          @change="newVal=>handlerApiValueChange(newVal)"
          placeholder="请选择">
          <el-option
            v-for="item in apiData"
            :key="item.value"
            :label="item.name"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="type === 2 || type === 4" :gutter="24">
        <el-col :span="8">
          <el-form-item :label="getTitle('sourceType')" prop="sourceType">
            <el-select v-model="formData['sourceType']" :label="getTitle('sourceType')" style="width:100%;"  @change="newVal=>handlerValueChange('sourceType',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(option, index) in columnsMap['sourceType'].options" :key="index" :label="option.name" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item v-if="formData['sourceType'] === 'api' " label="API数据接口" prop="api">
            <input type="text" v-model="formData['sourceAttr']"   class="el-input__inner" style="display: none;">
            <el-input
              v-model="formData['sourceAttrCn']?formData['sourceAttrCn']:formData['sourceAttr']"
              placeholder="请选择"
              name="api"
              suffix-icon="el-icon-more"
              @click.native="apiSelectDialogVisible = true"
              style="width:100%;cursor: pointer;"
            ></el-input>

          </el-form-item>

          <el-form-item  v-if="formData['sourceType'] !== 'api' " :label="getTitle('sourceAttr')" prop="sourceAttr">
            <el-input v-model="formData['sourceAttr']" :placeholder="getTitle('sourceAttr')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
        </el-col>
      </el-row>

    <el-row v-if="type === 3 || formData['widgetType'] === 'sub-form'" :gutter="20">
      <el-col :span="8">
        <el-form-item :label="getTitle('category')" prop="sourceType">
          <el-select v-model="formData['category']" :label="getTitle('category')" style="width:100%;"  @change="newVal=>handlerValueChange('category',newVal)">
            <el-option label="--请选择--" value=""></el-option>
            <el-option v-for="(option, index) in columnsMap['category'].options" :key="index" :label="option.name" :value="option.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item  v-if="formData['category'] === 'tree-table'" :label="getTitle('rootId')" prop="rootId">
          <el-input v-model="formData['rootId']" :placeholder="getTitle('rootId')"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item  v-if="formData['category'] === 'tree-table'" :label="getTitle('rootText')" prop="rootText">
          <el-input v-model="formData['rootText']" :placeholder="getTitle('rootText')"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
      <el-row v-if="formData['category'] === 'tree-table'" :gutter="20">
        <el-col :span="8">
          <el-form-item :label="getTitle('treeColumn')" prop="treeColumn">
            <el-input v-model="formData['treeColumn']" :placeholder="getTitle('treeColumn')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('parentColumn')" prop="parentColumn">
            <el-input v-model="formData['parentColumn']" :placeholder="getTitle('parentColumn')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item   label="展开全部">
            <el-switch style="margin-left:10px;"
                       v-model="formData['expandAll_SWITCH']">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="(type === 3 || formData['widgetType'] === 'sub-form')" :gutter="20">
        <el-col :span="8">
          <el-form-item :label="getTitle('entity')" prop="entity">
            <el-input v-model="formData['entity']" :placeholder="getTitle('entity')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('tableName')" prop="tableName">
            <el-input v-model="formData['tableName']" :placeholder="getTitle('tableName')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('subFormForeignKey')" prop="subFormForeignKey">
            <el-input v-model="formData['subFormForeignKey']" :placeholder="getTitle('subFormForeignKey')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="type === 4" :gutter="24">
        <el-col :span="8">
          <el-form-item :label="getTitle('expression')" prop="expression">
            <el-input v-model="formData['expression']" :placeholder="getTitle('expression')"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('summary')" prop="summary">
            <el-switch v-model="formData['summary_SWITCH']" @change="newVal=>handlerValueChange('summary',newVal)" > </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('width')" prop="width">
            <el-input-number v-model="formData['width']" > </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col v-if="type !== 2" :span="8">
          <el-form-item :label="getTitle('readOnly')" prop="readOnly">
            <el-switch v-model="formData['readOnly_SWITCH']" @change="newVal=>handlerValueChange('readOnly',newVal)" > </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="getTitle('filterAuth')" prop="filterAuth">
            <el-switch v-model="formData['filterAuth_SWITCH']" @change="newVal=>handlerValueChange('filterAuth',newVal)" > </el-switch>
          </el-form-item>
        </el-col>
        <!-- <el-col v-if="formData['widgetType'] === 'select-user'  ||
                      formData['widgetType'] === 'select-role'||
                      formData['widgetType'] === 'select-depart' ||
                      formData['widgetType'] === 'select-form'" :span="8"> -->

        <el-col v-if="formData['widgetType'] === 'select-user' || formData['widgetType'] === 'select-user-multi' || formData['widgetType'] === 'select-form'" :span="8">
          <el-form-item :label="getTitle('ifNotRelated')" prop="ifNotRelated">
            <el-switch v-model="formData['ifNotRelated_SWITCH']" @change="newVal=>handlerValueChange('ifNotRelated',newVal)" > </el-switch>
          </el-form-item>
        </el-col>
         <el-col v-if="formData['widgetType'] === 'select' || formData['widgetType'] === 'select-dic'|| formData  ['widgetType'] === 'select-sql'" :span="8">
          <el-form-item :label="getTitle('multiple')" prop="multiple">
            <el-switch v-model="formData['multiple_SWITCH']" @change="newVal=>handlerValueChange('multiple',newVal)" > </el-switch>
          </el-form-item>
        </el-col>
        <el-col v-if="formData['widgetType'] === 'select-date' || formData['widgetType'] === 'select-time'" :span="8">
          <el-form-item :label="getTitle('dateType')" prop="dateType">
            <el-select v-model="formData['dateType']" :label="getTitle('dateType')" style="width:100%;"  @change="newVal=>handlerValueChange('dateType',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(option, index) in dataTypeOptions()" :key="index" :label="option.name" :value="option.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div v-if="apiSelectDialogVisible" >
      <div class="mask" ></div>
      <div class="boxs"  style="width:550px;height:450px;">
        <div style="border-top: 1px #dcdfe6  solid">
          <h4 style="margin:10px 0;"><i></i>api选择</h4>
        </div>
        <form-view   ref="api-select" selectFormKey="sys_api" :single-select="true"  style="padding-top: 10px;border-top: 1px #dcdfe6 solid"></form-view>
        <div style="text-align: right;padding: 5px 0px;border-top: 1px #dcdfe6 solid">
          <el-button style=""  type="info" size="mini" @click="apiSelectDialogVisible = !apiSelectDialogVisible" >取消</el-button>
          <el-button  type="warning" size="mini" @click="handlerApiSelectOkClick" >确定</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import {mixin} from './mixin.js'
    export default {
        name: "form-column",
        mixins: [mixin]
    }
</script>


<style scoped>
  .jr-container {
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
    overflow: auto;
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
  #jr-edit-form .el-col {
    border-radius: 4px;
    margin-left: 0px;
  }

  #jr-edit-form .el-row {
    /*padding-left: 10px;*/
    /*padding-right: 10px;*/
    margin-bottom: 0px;
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
</style>
