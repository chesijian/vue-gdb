<template>
  <div>
    <div style="margin-top: 10px;">
      <el-form  ref="main-form" label-width="100px" size="mini" :label-position="'right'" style="display: flex;flex-flow: column;">
        <el-row :gutter="24" >
          <el-col :span="12" >
            <el-form-item  label="接口名称：" >
              {{mainData['NAME_']}}
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item  label="类型：" >
              {{mainData['RUNTYPE_']}}
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item  label="用途：" >
              {{mainData['CATEGORY_']}}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24" >
          <el-col :span="20" >
            <el-form-item  label="执行代码：" >
              <!--<el-tooltip offect="dark" :content="mainData['RUNSQL_']" placement="bottom" style="">-->
               <el-button @click="openMessage">{{mainData['RUNSQL_']?mainData['RUNSQL_'].substring(0,70)+' ...':''}}</el-button>
              <!--</el-tooltip>-->

            </el-form-item>
          </el-col>
          <el-col :span="4" >
            <el-button round type="warning" size="mini" @click="queryData()" icon="el-icon-search">查询</el-button>
          </el-col>

        </el-row>
      </el-form>

    </div>
    <div style="padding-left: 10px;padding-right: 10px;">
      <el-tabs v-model="activeParamsName"  style="height: 100%;    border-bottom: 1px solid #e4e7ed;">
        <el-tab-pane label="参数" name="query-params" class="jr-tab" style="height: 120px;">
          <common-grid-table :config="paramsGridConfig" ref="query-params" ></common-grid-table>
        </el-tab-pane>
      </el-tabs>

      <el-tabs v-model="activeParamsName"  style="height: 100%;    border-bottom: 1px solid #e4e7ed;">
        <el-tab-pane label="执行结果" name="query-params" class="jr-tab">
          <common-grid-table :config="resultGridConfig" ref="query-data" ></common-grid-table>
        </el-tab-pane>
      </el-tabs>
    </div>

  </div>
</template>

<script>
  import {mixin} from './mixin.js'
    export default {
        name: "api-run",
        mixins: [mixin]
    }
</script>

<style scoped>
.jr-tab{
  width: 100%;
  height: 250px;
}
</style>
