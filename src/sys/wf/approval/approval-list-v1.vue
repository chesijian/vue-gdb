<template>
    <div>
        <div class="box">
            <div class="condition" style="padding: 0;">
                <h4 ><i></i>审批</h4>
                <!-- <div class="condition-time">
                    <p>审批状态：</p>
                    <span v-if="statusValue==1" class="active">我的待办</span>
                    <span class="active" v-if="statusValue==2">我的申请</span>
                    <span class="active" v-if="statusValue==3">抄送给我</span>
                </div> -->
                <div class="condition-time">
                    <p>年&emsp;&emsp;份：</p>
                    <span @click="yearValue=(currentYear-index)" :class="{active:yearValue==(currentYear-index)}" v-for="(item,index) in 4" :key="index">{{currentYear-index}}</span>
                </div>
            </div>
		    <div style="position:relative;padding-bottom:80px;">
                <div style="display: flex;justify-content: space-between;align-items: center;">
                    <h4 ><i></i>审批</h4>
                    <div style="" class="search-box" style="height: 32px;">
                        <button class="button-style" style="margin: 0 !important;width: 60px !important;" @click="loadData()">搜索</button>
                        <input type="text" v-model="searchValue" @keyup.enter="loadData()" placeholder="查询主题或摘要" style="padding: 0 10px; ">
                        <i></i>
                    </div>
                </div>
			    <el-table
                :data="tableData"
                :stripe="true"
                style="width: 100%"
                height="510"
                :border="true"
                :header-row-style="{background:'#FAFAFA',overflow:'hidden',}"
                :row-style="{overflow:'hidden',}"
                :cell-style="{textAlign:'center',}"
                :header-cell-style="{background:'#FAFAFA',height:'44px',padding:0,textAlign:'center',color:'#333'}">
			        <el-table-column label="编号" width="100">
			            <template slot-scope="scope">
                            <span></span>
                            <span style="white-space: nowrap; background: #3B8CFF;color: #fff; padding: 1px 5px;border-radius:2px;text-align: center;margin: 0 auto;width:45px;display: block;">{{validUtil.isNotEmpty(scope.row.endTime)?'已审批':'审批中'}}</span>
			            </template>
			        </el-table-column>
			        <el-table-column label="主题">
			            <template slot-scope="scope">
			                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.subject}}</span>
			            </template>
			        </el-table-column>
			        <el-table-column label="流程">
			            <template slot-scope="scope">
			                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.procDefName}}</span>
			            </template>
			        </el-table-column>
			        <el-table-column label="内容摘要">
			            <template slot-scope="scope">
			                <span style="white-space: nowrap;margin-left: 10px"></span>
			            </template>
			        </el-table-column>
			        <el-table-column label="申请时间">
			            <template slot-scope="scope">
			                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.createDate}}</span>
			            </template>
			        </el-table-column>
                    <el-table-column label="当前审批人">
			            <template slot-scope="scope">
			                <span style="white-space: nowrap;margin-left: 10px"></span>
			            </template>
			        </el-table-column>
			       <el-table-column label="停留时间">
			            <template slot-scope="scope">
			                <span style="white-space: nowrap;margin-left: 10px">{{  ((Number(new Date(scope.row.createTime)) - Number(new Date(scope.row.startTime)))/(60*60*1000)).toFixed(2) }}</span>
			            </template>
			        </el-table-column>
			    </el-table>
                <div class="fy_style" >
                    <el-pagination background layout="prev, pager, next"
                    :small="true"  :page-size='pageSize'
                    @current-change="currentPage($event)"
                    :pager-count="5"  :page-sizes="[5]"
                    :total="totalCount">
                    </el-pagination>
                </div>
			</div>
            
        </div>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return {
            tableData:[],
            searchValue:'',
            currentYear:new Date().getFullYear(),
            pageIndex: 1,
            pageSize: 10,
            totalCount: 0,
            statusValue: 1,
            yearValue: new Date().getFullYear(),
        }
    },
    computed:{
        ...mapState({
            userId:state => state.userUid
        })
    },
    mounted() {
        let routerParams = JSON.parse(sessionStorage.getItem('routerParams'))
        if(routerParams.title == '我的待办') {
            this.statusValue = 1
        }
        if(routerParams.title == '我的申请') {
            this.statusValue = 2
        }
        if(routerParams.title == '抄送给我') {
            this.statusValue = 3
        }
        this.loadData()
    },
    activated(){
        this.loadData();
    },
    watch:{
        yearValue(news){
            console.log(news)
            this.loadData();
        },
        statusValue(news){
            this.loadData();
        }
    },
    methods:{
        changePageSize (pageSize) {
            this.pageSize = pageSize
            this.loadData()
        },
        currentPage(value){
          this.pageIndex=value;
          this.loadData();
        },
        loadData(){
            // this.util.mask();
            // this.util.restGet('/api_v1/business/bidManage/messages',{pageSize:this.pageSize,pageIndex:this.pageIndex,assignee:this.sessionUtil.getUserUid(),type:"线索登记"},(res)=>{
            //     this.util.unmask();
            //     if(res.status==200){
            //         if(res.data){
            //           this.tableData=res.data
            //           this.totalCount=res.data.length
            //           this.$store.state.messageCount=res.data.length
            //         }
                    
            //     }else{
            //         this.util.error(res.msg)
            //     }
            // })
        },
    },
}
</script>
<style scoped>
@import '../../../public/css/bid_style.css';
.box{
    background: #fff;
    overflow-y: auto;
    height: 100%;
    padding: 0 20px ;
    box-sizing: border-box;
    position: relative;
}
.fy_style {
    bottom: 30px !important;
}
</style>
