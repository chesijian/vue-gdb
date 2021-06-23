<template>
  <div class="jr-container">
    <div class="jr-tool">
      <div class="jr-query">
        <el-form :inline="true" :model="queryData"  size="mini">
          <el-form-item label="表单名称">
          <el-input v-model="queryData.title" placeholder="表单名称"></el-input>
        </el-form-item>
          <el-form-item label="数据库表名">
            <el-input v-model="queryData.tableName" placeholder="数据库表名"></el-input>
          </el-form-item>
          <el-form-item label="所属类别">
            <el-select v-model="queryData.type" placeholder="所属类别">
              <el-option label="--选择--" value=""></el-option>
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="jr-tool-btn-group">
        <el-button  type="warning" size="mini" @click="">新增</el-button>
        <el-button  type="warning" size="mini" @click="">拷贝</el-button>
        <el-button  type="warning" size="mini" @click="">删除</el-button>
      </div>
    </div>
    <div class="jr-content">
      <common-grid-table :config="gridConfig"></common-grid-table>
    </div>
  </div>
</template>

<script>
  import {mixin} from './mixin.js'

  export default {
    name: "form-list",
    mixins: [mixin]
  }
</script>

<style lang="scss" scoped>
  .jr-container {
    display: flex;
    flex-flow: column;
    background-color: white;
    height: 100%;

      .jr-tool {
        padding-top: 10px;
        height: 40px;
        display: flex;
        border-bottom: 1px solid #ebeef5;
        .jr-query {
          width: 70%;
          padding-left: 10px;
        }

        .jr-tool-btn-group {
          width: 30%;
          padding-right: 10px;
          text-align: right;
        }

      }
      .jr-content {
        height: 100%;display: flex;
        background-color: blue;
      }

  }
</style>
