<template>
    <div>
        <div class="box">
            <h4 style="margin:20px 0;"><i></i>我的待阅
                <input type="text" style="float:right;border:1px solid #ccc;padding:5px" v-model="searchText" @keydown.enter="loadData">
            </h4>
        <el-table
        :data="tableData"
        :stripe="true"
        style="width: 100%"
        :header-row-style="{background:'#FDEED9',overflow:'hidden',}"
        :row-style="{overflow:'hidden',}" @current-change='openCopy'
        :cell-style="{textAlign:'center',}"
        :header-cell-style="{background:'#FDEED9',height:'34px',padding:0,textAlign:'center'}">
        <el-table-column label="流程名称">
            <template slot-scope="scope">
                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.procDefName}}</span>
            </template>
        </el-table-column>
        <el-table-column label="流程标题">
            <template slot-scope="scope">
                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.subject}}</span>
            </template>
        </el-table-column>
        <el-table-column label="流程发起人">
            <template slot-scope="scope">
                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.startUserName}}</span>
            </template>
        </el-table-column>
        <el-table-column label="环节名称">
            <template slot-scope="scope">
                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.actName}}</span>
            </template>
        </el-table-column>
        <el-table-column label="流程发起时间">
            <template slot-scope="scope">
                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.startTime }}</span>
            </template>
        </el-table-column>
        <el-table-column label="创建时间">
            <template slot-scope="scope">
                <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.createTime }}</span>
            </template>
        </el-table-column>
        <el-table-column label="审批状态">
            <template slot-scope="scope">
                <span style="white-space: nowrap;margin-left: 10px">{{ validUtil.isNotEmpty(scope.row.endTime)?'已审批':'审批中'}}</span>
            </template>
        </el-table-column>
    </el-table>
       <div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%)" v-if="tableData.length>0">
            <el-pagination
                @size-change="changePageSize($event)"
                @current-change="changePageNum($event)"
                :current-page="pageNum"
                :page-sizes="[10, 25, 50, 100]"
                :small="true"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
          </el-pagination>
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
            title:'',
            searchText:'',
            pageNum: 1,
            pageSize: 10,
            totalCount: 0,
        }
    },
    computed:{
        ...mapState({
            userId:state => state.userUid
        })
    },
    // mounted() {
    //     document.title='我的'+this.theme
    // },
    created(){
            this.loadData()

    },
    methods:{
        changePageSize (pageSize) {
            this.pageSize = pageSize
            this.loadData()
        },
      //页面跳转
        changePageNum (pageNum) {
            this.pageNum = pageNum
            this.loadData()
        },
        loadData(){
            this.util.restGet('/api_v1/wf/tasks/copy',{pageSize:10,pageIndex:1,assignee:this.sessionUtil.getUserUid()},(res)=>{
                if(res.status==200){
                  if(res.data){
                    this.tableData=res.data
                  }
                    this.totalCount=res.totalCount
                }else{
                    this.util.error(res.msg)
                }
            })
        },
         openCopy(item) {
            if (this.validUtil.isNotEmpty(item.formKey)) {
              if(this.validUtil.isNotEmpty(item.procInstId) && this.validUtil.isNotEmpty(item.id )){
                let query = { id: item.businessKey,formKey:item.formKey, _procInstId: item.procInstId, _procDefId: item.procDefId, _taskId: item.id , _taskType: item.category, _currentActId: item.actId, isReadOnly: true }
                if (this.validUtil.isNotEmpty(item.formUrl)) {
                  this.$router.push({path: item.formUrl, query:  query});
                }else {
                  this.$router.push({
                    name: "page/formDataEdit",
                    query: query,
                    params: query
                  }); //编辑表单数据

                }
              }


            }
        },
    },
}
</script>
<style scoped>
.box{
    background: #fff;
    overflow: hidden;
    height: 100%;
    min-height: 768px;
    padding: 0 20px ;
    box-sizing: border-box;
    position: relative;
}

</style>
