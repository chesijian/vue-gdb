<template>
    <div class="page-index" style="padding: 0;height:100%;">
        <!-- 项目应用 -->
        <div style="float:right;display: flex;align-items: center;margin-bottom: 5px;" >
            <div class="elect-boxs" style="float:left;">
                <span>片区</span>
                <el-select @change="loadData" v-model="queryObj.district" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="华东" value="华东"></el-option>
                    <el-option label="华南" value="华南"></el-option>
                    <el-option label="华西" value="华西"></el-option>
                    <el-option label="华北" value="华北"></el-option>
                </el-select>
            </div>
            <div class="elect-boxs" style="float:left;">
                <span>项目类型</span>
                <el-select @change="loadData" v-model="queryObj.projType" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="自购地" value="自购地"></el-option>
                    <el-option label="租赁" value="租赁"></el-option>
                </el-select>
            </div>
            <div class="elect-boxs" style="float:left;">
                <span>年度</span>
                <el-select @change="loadData" v-model="queryObj.year" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item,index) in 10" :key="index" :label="currentYear-index" :value="currentYear-index"></el-option>
                </el-select>
            </div>
            <div class="elect-boxs" style="float:left;">
                <span>季度</span>
                <el-select @change="loadData" v-model="queryObj.quarter" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="第一季度" value="1"></el-option>
                    <el-option label="第二季度" value="2"></el-option>
                    <el-option label="第三季度" value="3"></el-option>
                    <el-option label="第四季度" value="4"></el-option>
                </el-select>
            </div>
            <div class="elect-boxs" style="float:left;">
                <span>月度</span>
                <el-select @change="loadData" v-model="queryObj.month" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                    <el-option  label="全部" value=""></el-option>
                    <el-option v-for="(item,index) in 12" :key="index" :label="`${item}月`" :value="item"></el-option>
                </el-select>
            </div>
        </div>
        <div>
            <el-table class="table__wordWraped" :data="projAppList" ref="multipleTable" border  :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
            style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);">
                <el-table-column prop="projName" width="357" label="项目名称"></el-table-column>
                <el-table-column prop="statusName"  label="项目状态"> </el-table-column>
                <el-table-column prop="district"  label="片区"> </el-table-column>
                <el-table-column prop="changeAmount"  label="预估变更金额"> </el-table-column>
                <el-table-column prop="amountAfterApproval"  label="审定后变更金额"> </el-table-column>
                <el-table-column prop="classify" label="项目类型"> </el-table-column>
                <el-table-column prop="principalName" label="项目经理"> </el-table-column>
                <el-table-column prop="partsNum" label="楼栋管理"> </el-table-column>
                <el-table-column prop="planNum" label="项目计划"> </el-table-column>
                <el-table-column prop="qualityNum" label="质量检查"> </el-table-column>
                <el-table-column prop="safetyNum" label="安全检查"> </el-table-column>
                <el-table-column prop="procedureNum" label="工序检查"> </el-table-column>
                <el-table-column prop="measureNum" label="实测实量"> </el-table-column>
                <el-table-column prop="dailyNum" label="项目日报"> </el-table-column>
                <el-table-column prop="weekReportNum" label="项目周报"> </el-table-column>
                <el-table-column prop="monthReportNum" label="项目月报"> </el-table-column>
                <el-table-column prop="meetingNum" label="项目会议"> </el-table-column>
                <el-table-column prop="totalNum" label="合计"> </el-table-column>
                
            </el-table>
            <div style="position:absolute;bottom:53px;left:50%;transform:translateX(-50%)">
                <el-pagination  @current-change="changePageNum($event)"  :current-page="pageIndex"
                    :page-size="pageSize"  layout="prev, pager, next"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
        
    </div>

</template>
<script>
export default {
    data(){
        return{
            currentYear:0,
            projAppList:[],
            queryObj:{
                year:"",
                quarter:"",
                month:""
            },
            pageIndex:1,
            pageSize:15,
            totalCount:0,
        }
    },
    mounted() {
        this.currentYear = new Date().getFullYear();
        this.loadData();
    },
    methods:{
        changePageNum(value){
            this.pageIndex=value;
            this.loadData();
        },
        loadData(){
            this.util.mask();
            // let params={
            //     pageIndex:this.pageIndex,
            //     pageSize:this.pageSize,
            // }
            this.queryObj.pageIndex=this.pageIndex;
            this.queryObj.pageSize=this.pageSize;
            this.util.restGet('/api_v1/modules/statistics/projApplication', this.queryObj,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.totalCount = res.totalCount
                    this.projAppList = res.data
                }else{
                    this.projAppList = [];
                    this.totalCount = 0;
                }
                
            });
            

        },
        
       
    }
}
</script>

<style scoped lang="scss">
.search-box{
    input{
        width: 300px;
    }
}
.dialog-box{
    height: 300px;
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

