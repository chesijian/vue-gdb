<template>

    <div class="box page-body appContent">
        <div class="condition" style="padding: 0 20px;">
            <h4 ><i></i>类型</h4>
            <div class="condition-time">
                <span @click="statusValue=''" :class="{active:statusValue== ''}">全部</span>
                <span @click="statusValue=1" :class="{active:statusValue==1}">未读</span>
                <span @click="statusValue=2" :class="{active:statusValue==2}">已读</span>
            </div>
        </div>
        <div style="background: #fff; padding: 0 20px 80px;position:relative;">
            <div style="display: flex;justify-content: space-between;align-items: center;">
                <h4 style="margin: 20px 0;"><i></i>消息中心</h4>
                <div>
                    <el-button type="primary" size="small">标志为已读</el-button>
                    <el-button size="small">删除</el-button>
                </div>
            </div>
            <el-table
            :data="tableData"
            :stripe="true"
            style="width: 100%"
            height="560"
            :border="true"
            :header-row-style="{background:'#FAFAFA',overflow:'hidden',}"
            :row-style="{overflow:'hidden',}"  @current-change='openApproval'
            :cell-style="{textAlign:'center',}"
            :header-cell-style="{background:'#FAFAFA',height:'44px',padding:0,textAlign:'center',color:'#333'}">
                <el-table-column type="selection" width="80"></el-table-column>
                <el-table-column label="类型">
                    <template slot-scope="scope">
                        <span style="white-space: nowrap; background: #3B8CFF;color: #fff; padding: 1px 5px;border-radius:2px;text-align: center;margin: 0 auto;width:45px;display: block;">{{validUtil.isNotEmpty(scope.row.endTime)?'已审批':'审批中'}}</span>
                        <!-- <span style="white-space: nowrap;margin-left: 10px">{{ validUtil.isNotEmpty(scope.row.endTime)?'已审批':'审批中'}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column label="消息内容">
                    <template slot-scope="scope">
                        <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.subject}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column label="时间">
                    <template slot-scope="scope">
                        <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.createUser}}</span>
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

</template>

<script>
import { getByApi, updateByApi } from "@/api/api"
export default {
    data(){
        return {
            tableData:[],
            pageIndex: 1,
            pageSize: 30,
            totalCount: 0,
            statusValue: '',
        }
    },
    created(){
        this.loadData()
    },
    activated(){
        this.loadData();
    },
    watch:{
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
            let params = {
                formKey: "sys-notice",
                id: "sys-notice-1",
                keyword: "",
                pageIndex: this.pageIndex,
                pageSize: this.pageSize,
                parentId: null,
                queryParams: [{key: "ASSIGNEE_",value:"{current-user-uid}"}],
                searchParams: [],
            }
            this.util.mask();
            this.util.restPost('/api_v1/form/data_list', params,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    if(res.data) {
                        this.tableData = res.data
                    }
                   this.totalCount = res.totalCount
                }else{
                    this.util.error(res.msg)
                }
            })
        },
        openApproval(item){

        },
    },
}
</script>
<style scoped>
@import '../../../public/css/bid_style.css';
.box{
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    position: relative;
}
.fy_style {
    bottom: 30px!important;
}
</style>
