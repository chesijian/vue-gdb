<template>
  <div class="jr-container">
    <el-form id="jr-edit-form" :model="formData" :rules="rules" ref="form" label-width="100px" size="mini"
             :label-position="'right'" style="display: flex;flex-flow: column;">
      <el-row :gutter="20"  style="display: none;">
        <el-col :span="24">
          <el-form-item label="主键" prop="id">
            <el-input v-model="formData['id']" placeholder="主键"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="表单名称" prop="title">
            <el-input v-model="formData['title']" placeholder="表单名称"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="实体" prop="entity">
            <el-input v-model="formData['entity']" placeholder="实体"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级表单" prop="parentId">
            <el-select v-model="formData['parentId']" placeholder="请选择上级表单" style="width:100%;"  @change="newVal=>handlerValueChange('parentId',newVal)">
              <el-option label="--请选择--" value=""></el-option>
              <el-option v-for="(form, index) in formOptions" :key="form.id" :label="form.title" :value="form.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="数据库表" prop="tableName">
            <el-input v-model="formData['tableName']" placeholder="数据库表"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="列表类型" prop="type">
            <el-select v-model="formData['type']" placeholder="请选择" style="width:100%;"  @change="newVal=>handlerValueChange('type',newVal)">
              <el-option label="列表" value=1></el-option>
              <el-option label="树表" value=2></el-option>
              <el-option label="树" value=4></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="formData['type'] === '2' || formData['type'] === '4' ">
        <el-col :span="12">
          <el-form-item label="根节点id" prop="rootId">
            <el-input v-model="formData['rootId']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="根节点text" prop="rootText">
            <el-input v-model="formData['rootText']"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20" v-if="formData['type'] === '2' || formData['type'] === '4' ">
        <el-col :span="12">
          <el-form-item label="树列" prop="treeColumn">
            <el-input v-model="formData['treeColumn']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="parent列" prop="parentColumn">
            <el-input v-model="formData['parentColumn']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="懒加载" >
            <el-switch style="margin-left:10px;"
                        v-model="formData['lazy_SWITCH']">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示根节点">
            <el-switch style="margin-left:10px;"
                        v-model="formData['showRoot_SWITCH']"></el-switch>
           </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="表单宽度" prop="width">
            <el-input v-model="formData['formWidth']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="表单高度" prop="height">
            <el-input v-model="formData['formHeight']"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="列表宽度" prop="width">
            <el-input v-model="formData['gridWidth']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12" v-if="config.parent.config.layout && config.parent.config.layout == 2" >
          <el-form-item label="列表高度" prop="height">
            <el-input v-model="formData['gridHeight']"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item v-if="formData['type'] !== '3' " label="表单列数" prop="colNum">
            <el-input-number v-model="formData['colNum']" style="width:100%"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="formData['type'] === '3' " label="外键" prop="subFormForeignKey" >
            <el-input v-model="formData['subFormForeignKey']"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="formData['type'] !== '3'" label="分页大小" prop="pageSize" >
            <el-select  v-model="formData['pageSize']" placeholder="请选择" style="width:100%;"  @change="newVal=>handlerValueChange('pageSize',newVal)">
              <el-option label='20' value='20'></el-option>
              <el-option label='30' value='30'></el-option>
              <el-option label='50' value='50'></el-option>
              <el-option label='100' value='100'></el-option>
              <el-option label='500' value='500'></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item v-if="formData['type'] !== '3' " label="API数据接口" prop="api">
            <input type="text" v-model="formData['api']"   class="el-input__inner" style="display: none;">
            <el-input
              v-model="formData['apiTitle']"
              placeholder="请选择"
              name="api"
              suffix-icon="el-icon-more"
              @click.native="apiSelectDialogVisible = true"
              style="width:100%;cursor: pointer;"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item v-if="formData['type'] !== '3' " label="排序号" prop="sort">
            <el-input-number v-model="formData['sort']" style="width:100%"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="12" >
          <el-form-item label="显示标题">
            <el-switch style="margin-left:10px;"
              v-model="formData['showTitle_SWITCH']">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item v-if="formData['type'] === '2' || formData['type'] === '4' "  label="展开全部">
            <el-switch style="margin-left:10px;"
                        v-model="formData['expandAll_SWITCH']">
            </el-switch>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24"  style="">
        <el-col :span="24">
          <el-form-item label="摘要模板" prop="id">
            <el-input type="textarea" v-model="formData['abstracts']" placeholder="摘要模板"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24"  style="">
        <el-col :span="12">
          <el-form-item label="移动端路由" prop="mobilePath">
            <el-input v-model="formData['mobilePath']"></el-input>
          </el-form-item>
        </el-col>
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
    name: "form-info",
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
    height: 301px;
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
