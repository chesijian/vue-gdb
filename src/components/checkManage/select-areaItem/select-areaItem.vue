<template>
  
  <div class="jr-cascade-layout">
    <div style="margin-bottom: 10px;">
      <!-- <p style="margin-bottom: 10px;">区域检查项资源库</p> -->
      <div>
        <span>业态</span>
        <el-select v-model="yetaiValue" @change="initData" placeholder="请选择">
          <!-- <el-option  label="全部" value=""></el-option> -->
          <el-option v-for="item in dicData" :key="item.name"
            :label="item.name"
            :value="item.name">
          </el-option>
        </el-select>
      </div>
    </div>
    <div style="display: flex;">
      <div class="jr-cascade-left" v-loading="loading">
        <div style="text-align: left;font-size: 18px;color:#000;">选择区域</div>
        <el-tree :data="areaList" show-checkbox node-key="id" check-strictly :props="defaultProps" ref="areaTree"></el-tree>
      </div>
      <div class="jr-cascade-right" v-loading="loadIteming">
        <div style="text-align: left;font-size: 18px;color:#000;">选择检查项
          <!-- <el-dropdown >
                  <el-button type="primary">
                    {{dataSource}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="dataSource='项目库'">项目库</el-dropdown-item>
                    <el-dropdown-item @click.native="dataSource='企业库'">企业库</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown> -->
          <el-select v-model="dataSource" placeholder="请选择">
            <el-option  label="企业库" value="企业库"></el-option>
            <el-option  label="项目库" value="项目库"></el-option>
          </el-select>
        </div>
        <!-- <el-tree v-show="dataSource=='项目库'" :data="projItemList" check-strictly show-checkbox node-key="id"  :props="defaultProps" ref="projTree"></el-tree> -->
        <div>
          <el-tree v-show="dataSource=='项目库'" check-strictly show-checkbox node-key="id" :load="loadProjCheckItem" lazy :props="companyProps" ref="projTree"></el-tree>
          <el-tree v-show="dataSource=='企业库'" show-checkbox node-key="id" check-strictly :load="loadCompanyItem" lazy :props="companyProps" ref="companyTree"> </el-tree>
        </div>
        
      </div>
    </div>
    <div>
      <div style="padding: 8px 0px;">下达任务</div>
      <div style="font-size: 14px;">
        <el-row>
          <el-col :span="8">
            <div style="display: flex;">
              <div style="line-height: 32px;">检查负责人</div>
              <div>
                <el-select v-model="principal" multiple  collapse-tags placeholder="请选择">
                  <el-option v-for="item in projMembers" :key="item.id" :label="item.userName" :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div style="display: flex;">
              <div style="line-height: 32px;">计划开始</div>
              <div><el-date-picker v-model="startDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker></div>
            </div>
          </el-col>
          <el-col :span="8">
            <div style="display: flex;">
              <div style="line-height: 32px;">计划完成</div>
              <div><el-date-picker v-model="finishDate" value-format="yyyy-MM-dd" type="date" placeholder="选择日期"></el-date-picker></div>
            </div>
          </el-col>
        </el-row>
        
      </div>
    </div>
    <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
      <el-button @click="closeForm()">关闭</el-button>
      <el-button type="primary" @click="submitForm()">保存</el-button>
    </div>
    
  </div>
</template>

<script>
  // 国标库选择
  import {mixin} from './mixin.js'
    export default {
        name: "gb-workInspect-select",
        mixins: [mixin]
    }
</script>

<style scoped>
.jr-cascade-layout{
  height: 100%;
  width:100%;
  /* display: flex; */
}
  .jr-cascade-left{
    width:50%;
    height: 360px;
    padding:5px;
    overflow: auto;
    border: 1px solid #ebeef5;
  }
.jr-cascade-right{
  border: 1px solid #ebeef5;
  margin-left: 10px;
  width:50%;
  height: 360px;
  overflow: auto;
  padding:5px;
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
