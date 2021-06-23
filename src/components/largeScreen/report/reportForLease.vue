<template>
    <div class="page-index" style="padding: 0;height:100%;">
        <!-- 进度明细 -->
        <div class="query-box">
            <div class="elect-boxs" style="float:left;" >
                <span>计划开工与完工</span>
                <el-date-picker v-model="queryObj.searchDate" @change="reload"
                        type="daterange"
                        style="color:#fff;"
                        align="right"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"
                        unlink-panels
                        placeholder="选择日期"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        >
                        </el-date-picker>
            </div>
            <div class="elect-boxs">
                <span>负责人</span>
                <input type="text" v-model="queryObj.assigneeName" placeholder="选择负责人" @focus="selectMemberModels.isShow=true">
            </div>
            <div class="elect-boxs">
                <span>进度状态</span>
                <el-select v-model="queryObj.status" @change="reload" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                    <el-option  label="全部" value=""></el-option>
                    <el-option  label="未开始" value="未开始"></el-option>
                    <el-option  label="提前" value="提前"></el-option>
                    <el-option  label="正常" value="正常"></el-option>
                    <el-option  label="延误" value="延误"></el-option>
                    <el-option  label="可控" value="可控"></el-option>
                </el-select>
            </div>
            <div class="elect-boxs">
                <span>项目类型</span>
                <el-select v-model="queryObj.projType" @change="reload" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                    <el-option  label="全部" value=""></el-option>
                    <el-option  label="租赁" value="租赁"></el-option>
                    <el-option  label="自购地" value="自购地"></el-option>
                </el-select>
            </div>
            <div style="display: flex;align-items: center;" >
                <div style="margin-right:15px" class="search-box top-box">
                    <input type="text" v-model="searchValue" placeholder="选择项目" @keyup.enter="loadData" @focus="dialogTableVisible=true">
                    <i></i>
                    <button @click="changePageNum(1)">搜索</button>
                </div>
            </div>
        </div>
        
        
        <div>
            <el-table :data="dataList" border :span-method="objectSpanMethod" height="520"
            :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
            style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);">
                <el-table-column prop="projCode" label="项目编号"></el-table-column>
                <el-table-column prop="projName"  label="项目名称"> </el-table-column>
                <el-table-column prop="text" label="任务名称"> </el-table-column>
                <el-table-column prop="assigneeName" label="负责人"> </el-table-column>
                <el-table-column prop="function" label="职能"> </el-table-column>
                <el-table-column prop="lastReportDate" label="汇报时间" width="138"> </el-table-column>
                <el-table-column prop="statusName" label="是否通过审核"> </el-table-column>
                <el-table-column prop="startDate" label="计划开始日期" width="100"> </el-table-column>
                <el-table-column prop="endDate" label="计划完成日期" width="100"> </el-table-column>
                <el-table-column prop="actStartDate" label="实际开始日期" width="100"> </el-table-column>
                <el-table-column prop="actEndDate" label="实际完成日期" width="100"> </el-table-column>
                <el-table-column prop="duration" label="计划工期(天)"> </el-table-column>
                <el-table-column prop="actDuration" label="实际工期(天)"> </el-table-column>
                <el-table-column label="延误天数">
                    <template  slot-scope="scope">
                        <span>{{scope.row.delayDays||0}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="进度状态">
                    <template  slot-scope="scope">
                      <div style="text-align: center;" :style="{background:initdelayCoolor(scope.row.taskStatusName)}">{{scope.row.taskStatusName}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="工期偏差(天)">
                    <template  slot-scope="scope">
                      <span class="edit-val">{{scope.row.offsetDuration}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="进度成果"> </el-table-column>
                <el-table-column prop="riskProblem" label="问题风险"> </el-table-column>
                <el-table-column prop="riskCounterMeasure" label="风险对应措施"> </el-table-column>
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
        <selectMember ref="selectMemberFun" :selectMemberModels='selectMemberModels'></selectMember>
    </div>

</template>
<script>
import selectMember from '@/components/common/selectMember.vue'
import { getDataByApi } from '@/api/api'
export default {
    data(){
        return{
            queryObj:{
                projType:"",//项目类型
                projUids:"",
            },
            selectMemberModels:{
                isShow:false,
                selectList:[],
                callBack:this.selectUserCallBack,
                radioSelectFlags:true,
            },
            memberList:[],//项目成员列表
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
    components:{
        selectMember
    },
    mounted() {
        this.updateTaskStatus();
        this.reload();
        this.loadProjects();
    },
    methods:{
        updateTaskStatus(){
            this.util.restPut("/api_v1/business/progress/taskStatus",null,res=>{
                console.log("updateTaskStatus======taskStatus=======>",res);
            })
        },
        //选择负责人回调
        selectUserCallBack(data){
            let obj={
                userName:"",
                id:""
            }
            if(data&&data.length>0){
                obj =data[0];
            }
            this.selectMemberModels.isShow=false;
            this.$set(this.queryObj,"assigneeName",obj.userName);
            this.queryObj.assignee=obj.id;
            this.reload();
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
            if (value=="正常") {
                return "green"
            }else if(value=="提前"){
                return "rgb(102,177,255)"
            }else if(value=="可控"){
                return "#f08b00"
            }else if(value=="未开始"){
                return "#909399"
            }else{
                return "red"
            }
        },
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
            this.reload();
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
            this.util.mask();
            getDataByApi("api-getLeaseProjects",params).then(res => {
                    this.util.unmask();
                    this.projTotalCount = res.totalCount;
                    this.projectList=res.data;
                });
        },
        objectSpanMethod({ row, column, rowIndex, columnIndex }) {
            if (columnIndex === 0||columnIndex === 1) {
                if (row.rowspan) {
                    return {
                    rowspan: row.rowspan,
                    colspan: 1
                    };
                } else {
                    return {
                    rowspan: 0,
                    colspan: 0
                    };
                }
            }
        },
        changePageNum(value){
            this.pageIndex=value;
            this.loadData();
        },
        //重新加载
        reload(){
            this.dataList=[];
            this.pageIndex=1;
            this.loadData();
        },
        loadData(){
            if(this.queryObj.searchDate){
                this.queryObj.startDate = this.queryObj.searchDate[0];
                this.queryObj.endDate = this.queryObj.searchDate[1];
            }
            this.queryObj.pageSize = this.pageSize;
            this.queryObj.pageIndex = this.pageIndex;
            this.util.mask();
            this.util.restGet('/api_v1/business/progress/leaseReport',this.queryObj,(res)=>{
                this.util.unmask();
                this.totalCount = res.totalCount;
                if(res.status==200&&res.data){
                    let dataList=[];
                    res.data.forEach(item=>{
                        item.taskList[0].rowspan=item.taskList.length;
                        item.taskList[0].projName=item.projName;
                        item.taskList[0].projCode=item.projCode;
                        dataList = dataList.concat(item.taskList);
                    });
                    this.dataList = dataList;
                }
            })

        },
        
       
    }
}
</script>

<style scoped lang="scss">
.query-box{
    display: flex;
    justify-content: flex-end;
    align-items: center;
}
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
        width: 300px;
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

