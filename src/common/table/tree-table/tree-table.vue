<template>
  <div id="jr-edit-table" class="jr-container">
    <el-table class="jr-edit-table-panel"
              :data="tableData"
              :highlight-current-row="true"
              :row-style="showTr" type="expand" :cell-style="{textAlign:'left',}"
              :header-row-style="{height:'47px'}"
              @selection-change="handlerSelectionChange"
              @row-click="rowClick"
              size="mini"
              height="100%"
              :fit="true"
              stripe
              style="width: 100%">
      <el-table-column  v-for="(column, index) in columns" :key="column.columnName" :label="column.title" :min-width="column.width" >
        <template  slot-scope="scope">
          <span v-if="column.treeColumn" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space"></span>
          <button class="button is-outlined is-primary is-small" v-if="toggleIconShow(column,index,scope.row)" @click="toggle(scope.$index)">
            <i v-if="!scope.row._expanded" class="el-icon-caret-right jr-tree-icon" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon-caret-bottom jr-tree-icon" aria-hidden="true"></i>
          </button>
          <span v-else-if="column.treeColumn" class="ms-tree-space"></span>
          <span>{{scope.row[column.columnName]}}</span>
        </template>
        </el-table-column>
        <el-table-column
          label="操作"
          show-overflow-tooltip
          width="65"
          align="center">
          <template slot-scope="scope">
            <el-button-group>
              <i type="warning" class="el-icon-edit"  size="mini" style="font-size: 13pt;cursor: pointer;color: #3b8cff;"
                 @click="handleOperateClick('edit',scope.$index, scope.row)">
              </i>
              <i type="danger" class="el-icon-delete"  size="mini" style="margin-left:5px;font-size: 13pt;cursor: pointer;color: red;"
                 @click="handleOperateClick('delete',scope.$index, scope.row)">
              </i>
            </el-button-group>
          </template>
        </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import {mixin} from './mixin.js'
  import {tableMixin} from '../tableMixin.js'
    export default {
        name: "common-tree-table",
        mixins: [mixin,tableMixin]
    }
</script>

<style scoped>
  .jr-edit-table-panel{
    height: 100%;display: flex;flex-flow: column;
  }
  .jr-container{
    display: flex;
    flex-flow: column;
    width: 100%;
    height: 100%;
  }
  .ms-tree-space {
    position: relative;
    top: 1px;
    display: inline-block;
    font-family: 'Glyphicons Halflings';
    font-style: normal;
    font-weight: 400;
    line-height: 1;
    width: 18px;
    height: 14px;
  }

  .ms-tree-space::before {
    content: ""
  }

  table td {
    line-height: 26px;
  }

  .jr-tree-icon {
    background-color: white;
    border: 0px;
    line-height: 18px;
  }
</style>

<style>
  #jr-edit-table .el-button--mini, .el-button--mini.is-round {
    padding: 7px 7px;
  }
</style>
