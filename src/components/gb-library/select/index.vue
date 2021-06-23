<template>
  <!--element-loading-text="拼命加载中"
  element-loading-spinner="el-icon-loading"
  element-loading-background="rgba(0, 0, 0, 0.8)"-->
  <div class="jr-cascade-layout"  v-loading="loading" element-loading-text="拼命加载中"
       element-loading-spinner="el-icon-loading"
       element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="jr-cascade-left">
      <tree v-if="showTree" :config="treeConfig" ref="jr-tree" :queryParams="queryParams"  @handlerRowClick="((row)=>{handlerRowClick(2, row)})" :single-select="false" :isLeft="true" :multiple-select="true" isTree readOnly isLeft></tree>
    </div>
    <div class="jr-cascade-right">
      <div>
        <h4  style="font-weight: lighter;"><i ></i>
          设置
        </h4>
        <el-form id="jr-gb-select" :model="formData" :rules="rules" ref="jr-form" label-width="150px">
          <el-form-item label="项目类型" prop="PROJ_LX" style="margin-bottom: 0px;">
            <el-checkbox-group v-model="formData.PROJ_LX" style="padding-left: 20px">
              <el-checkbox v-for="(option) in dicValue('PROJ_LX')" :key="option.value" :label="option.value" name="PROJ_LX">{{option.name}}</el-checkbox>

            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="业态" prop="PROJ_PURPOSE"   style="margin-bottom: 0px;">
            <el-checkbox-group v-model="formData.PROJ_PURPOSE" style="padding-left: 20px">
              <el-checkbox v-for="(option) in dicValue('PROJ_PURPOSE')" :key="option.value" :label="option.value" name="PROJ_PURPOSE">{{option.name}}</el-checkbox>

            </el-checkbox-group>
          </el-form-item>
        </el-form>
      </div>
       <grid-tree-table v-if="showTree" :config="dataConfig" ref="jr-data" :queryParams="queryParams" :single-select="false" :multiple-select="false" :isLeft="false" :autoLoad="false" readOnly ></grid-tree-table>

    </div>
  </div>
</template>

<script>
  // 国标库选择
  import {mixin} from './mixin.js'
    export default {
        name: "gb-library-select",
        mixins: [mixin]
    }
</script>

<style scoped>
.jr-cascade-layout{
  height: 100%;
  width:100%;
  display: flex;
}
  .jr-cascade-left{
    width:35%;
    height: 100%;
  }
.jr-cascade-right{
  border-top: 1px solid #ebeef5;
  margin-left: 10px;
  width:65%;
  height: 100%;
  display: flex;
  flex-flow: column;
  background-color: white;
}
h4 {
  color: #333;
  font-size: 18px;
  font-family: PingFangSC;
  padding-left: 10px;
  position: relative;
  border-left: 3px solid #3B8CFF;
  font-weight: 400;
  margin: 15px 0px;
  margin-left: 10px;
  height: 20px;
  line-height: 20px;
}

</style>

<style>
  #jr-gb-select .el-form-item__label{
    color: black!important;
  }
</style>
