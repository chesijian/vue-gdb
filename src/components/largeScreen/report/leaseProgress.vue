<template>
    <div class="page-index" style="padding: 0;height:100%;">
        <!-- 进度汇总 -->
        <div style="float:right;display: flex;align-items: center;margin-bottom: 5px;" >
            <div style="margin-right:15px" class="search-box top-box">
                <input type="text" v-model="searchValue" placeholder="选择项目" @keyup.enter="loadData" @focus="dialogTableVisible=true">
                <i></i>
                <button @click="loadData">搜索</button>
            </div>
        </div>
        <div class="elect-boxs" style="float:right;">
            <span>项目类型</span>
            <el-select v-model="queryObj.projType" @change="loadData" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                <el-option  label="全部" value=""></el-option>
                <el-option  label="租赁" value="租赁"></el-option>
                <el-option  label="自购地" value="自购地"></el-option>
            </el-select>
        </div>
        <div class="elect-boxs" style="float:right;">
            <span>片区</span>
            <el-select @change="loadData" v-model="queryObj.district" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                <el-option label="全部" value=""></el-option>
                <el-option label="华东" value="华东"></el-option>
                <el-option label="华南" value="华南"></el-option>
                <el-option label="华西" value="华西"></el-option>
                <el-option label="华北" value="华北"></el-option>
            </el-select>
        </div>
        <div>
            <el-table :data="dataList" border height="520"
            :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
            style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);">
                <el-table-column prop="XMBH_" label="项目编号"></el-table-column>
                <el-table-column prop="XMMC_"  label="项目名称" width="200"> </el-table-column>
                <el-table-column prop="CLASSIFY_" label="项目类型"> </el-table-column>
                <el-table-column prop="START_DATE_" label="计划开始日期" width="100"> </el-table-column>
                <el-table-column prop="END_DATE_" label="计划完成日期" width="100"> </el-table-column>
                <el-table-column prop="ACT_START_DATE_" label="实际开始日期" width="100"> </el-table-column>
                <el-table-column prop="ACT_END_DATE_" label="实际完成日期" width="100"> </el-table-column>
                <el-table-column label="延误天数">
                    <template  slot-scope="scope">
                        <span>{{scope.row.delayDays||0}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="进度状态">
                    <template  slot-scope="scope">
                      <div style="text-align: center;" :style="{background:initdelayCoolor(scope.row.delayDays)}">{{initdelay(scope.row.delayDays)}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="SITE_TYPE_" label="场地类型"> </el-table-column>
                <el-table-column prop="PROJ_AREA_" label="区域"> </el-table-column>
                <el-table-column prop="CITY_" label="城市"> </el-table-column>
                <el-table-column prop="SITE_PROPERTY_" label="场地属性"> </el-table-column>
                <el-table-column prop="COVERED_AREA_" label="建筑面积(m2)"> </el-table-column>
                <el-table-column prop="DESIGN_" label="设计"> </el-table-column>
                <el-table-column prop="COST_" label="成本"> </el-table-column>
                <el-table-column prop="PURCHASE_" label="采购"> </el-table-column>
                <el-table-column prop="PM_" label="工程项目经理"> </el-table-column>
                <el-table-column prop="BUSINESS_REQUIREMENTS_" label="业务需求接口人"> </el-table-column>
            </el-table>
            <div style="text-align: center;">
                <el-pagination  @current-change="changePageNum($event)"  :current-page="pageIndex"
                    :page-size="pageSize"  layout="prev, pager, next"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="项目列表" :visible.sync="dialogTableVisible">
            <div class="dialog">
                <div class="dialog-top" >
                    <div style="margin-right:15px" class="search-box">
                        <input type="text" v-model="searchProj" placeholder="按项目名称搜索" @keyup.enter="loadProjects('search')">
                        <i></i>
                        <button @click="loadProjects('search')" style="background:rgb(64,158,255)">搜索</button>
                    </div>
                </div>
                <div class="dialog-box">
                    <el-table height="300px" :data="projectList" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="80"></el-table-column>
                        <el-table-column property="name" label="项目名称">
                            <template  slot-scope="scope">
                            <span class="edit-val">{{scope.row.XMMC_}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="dialog-footer">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="projPageIndex"
                        :page-sizes="[10,20, 30, 50, 100]"
                        :page-size="projPageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="projTotalCount">
                    </el-pagination>
                    <div style="text-align: right;padding: 10px 0px;">
                        <el-button size="mini" @click="dialogTableVisible=false">取消</el-button>
                        <el-button type="primary" size="mini" @click="confirmSelect">确定</el-button>
                    </div>
                </div>
            </div>
            
            
        </el-dialog>
    </div>

</template>
<script>
import { getDataByApi } from '@/api/api'
export default {
    data(){
        return{
            queryObj:{
                projType:"",
                district:"",
            },
            dialogTableVisible:false,
            projectList:[],
            searchValue:"",
            searchProj:"",
            pageIndex:1,
            pageSize:30,
            totalCount:0,
            projPageIndex:1,
            projPageSize:10,
            projTotalCount:0,
            dataList:[], //数据
        }
    },
    mounted() {
        this.loadData();
        this.loadProjects();
    },
    methods:{
        handleSizeChange(value){
            this.projPageSize=value;
            this.loadProjects();
        },
        handleCurrentChange(value){
            this.projPageIndex=value;
            this.loadProjects();
        },
        handleSelectionChange(data){
            this.selectData = data;
        },
        //确定选择
        confirmSelect(){
            if(!this.selectData||this.selectData.length==0){
                this.searchValue="";
                this.queryObj.projUids=null;
            }else{
                let ids = this.selectData.map(item=>item.ID_);
                let projNames = this.selectData.map(item=>item.XMMC_);
                this.searchValue = projNames.join(",");
                this.queryObj.projUids = ids.join(",");
            }
            
            this.loadData();
            this.dialogTableVisible=false;
        },
        //获取租赁项目列表
        loadProjects(type){
            if(type=='search'){
                this.projPageIndex=1;
            }
            let params={
                pageIndex:this.projPageIndex,
                pageSize:this.projPageSize,
                keyWork:this.searchProj
            }
            this.util.mask()
            getDataByApi("api-getLeaseProjects",params).then(res => {
                this.util.unmask();
                this.projTotalCount = res.totalCount;
                this.projectList=res.data;
            });
        },
        initdelay(value) {
            if (!value||value<=0) {
                return "正常"
            }else if(value>0&&value<=7){
                return "可控"
            }else if(value>7){
                return "延误"
            }else{
                return ""
            }
        },
        initdelayCoolor(value) {
            if (!value||value<=0) {
                return "green"
            }else if(value>0&&value<=7){
                return "rgb(255,255,0)"
            }else{
                return "red"
            }
        },
        changePageNum(value){
            this.pageIndex=value;
            this.loadData();
        },
        loadData(){
            this.queryObj.pageIndex=this.pageIndex;
            this.queryObj.pageSize=this.pageSize;
            this.util.mask();
             this.util.restGet('/api_v1/business/progress/leaseReportCollect',this.queryObj,(res)=>{
                 this.util.unmask();
                 this.totalCount = res.totalCount;
                if(res.status==200&&res.data){
                    this.dataList = res.data;
                }else{
                    this.dataList=[];
                }
            })

        },
        
       
    }
}
</script>

<style scoped lang="scss">
.dialog{
    margin: -30px 0px;
    &-top{
        float:right;display: flex;align-items: center;margin-bottom: 5px;color:#000;
        input{
            color: #303133;
        }
    }
}
.top-box{
    input{
        width: 500px;
    }
}
.dialog-box{
    height: 330px;
    /deep/ .el-table thead {
        color: #303133;
    }
    
    .edit-val{
        color: #303133;
    }
}
.dialog-footer{
    /deep/ .el-input__inner{
      color: #303133;
    }
}
</style>

