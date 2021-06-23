<template>
  <div class="proj-box signinRecord">
    <div class="context">
      <div class="context_left">
          <div style="position:relative;width: 100%;height: 100%;box-sizing: border-box;padding: 50px 10px 42px ">
            <div style="width: 100%;position: relative;">
              <div class="context_left_head" style="width: 100%;position: absolute;top:-40px;left: 0;">
                <div class="context_left_head_left">
                  <h4>班组</h4>
                </div>
                <div class="context_left_head_right">
                </div>
              </div>
            </div>
            <div class="context_left_table" style="width: 100%;height: 100%;box-sizing: border-box;" ref="tablebox">
              <el-table :data="tableData" :height="tableHeightNum" highlight-current-row class="highlight-current-row" @cell-click="handleCurrentclick" border >
                <el-table-column prop="name" label="班组名称">
                </el-table-column>
                <el-table-column prop="responsiblePersonName" label="负责人">
                </el-table-column>
                <el-table-column prop="teamMemberNum" label="人数">
                </el-table-column>
              </el-table>
            </div>
            <div  style="position:absolute;bottom: 10px;right: 0;">
              <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="total">
              </el-pagination>
            </div>
        </div>
      </div>
      <div class="context_right" >
        <div class="context_text" style="height:100%;width:100%;box-sizing: border-box;padding: 62px 10px 20px;">
          <div style="width: 100%;position: relative;">
            <div class="context_text_head" style="width: 100%;position: absolute;top:-40px;left: 0;">
              <div class="context_text_head_left">
                <span @click="changeType(0)" :class="{active:createType==0}">考勤报表</span>
                <span @click="changeType(1)" :class="{active:createType==1}">考勤记录</span>
              </div>
              <div class="pagetion" style="float:left;line-height: 40px;">
                <span>考勤时间:</span>
                <el-date-picker
                  v-model="selectTime"
                  @change="changeTime"
                  type="month"
                  placeholder="选择月">
                </el-date-picker>
              </div>
              <div style="float:left"  class="search-box" v-show="createType==1">
                  <input type="text" v-model="searchValue" @keyup.enter="getAttendanceData()">
                  <i></i>
                  <button @click="getAttendanceData()">搜索</button>
              </div>
              <div class="context_text_head_right">
                  <button @click="derivetext" v-if="sessionUtil.isAllowBtn('gc7_2:exprot')">导出</button>
              </div>
          </div>
          </div>
          <div v-if="createType==0">
            <div class="worktable" ref="tablebox1" style="width: 100%;height: 100%;box-sizing: border-box;">
              <el-table :data="workList0" :height="tableHeightNum" class="highlight-current-row" border >
                <el-table-column prop="teamName" label="班组名称">
                </el-table-column>
                <el-table-column prop="workerName" label="姓名">
                </el-table-column>
                <el-table-column prop="idcardNumber" label="身份证号码">
                </el-table-column>
                <el-table-column prop="workTypeCode" label="工种">
                </el-table-column>
                <el-table-column prop="attendanceCount" label="出工天数">
                </el-table-column>
              </el-table>
            </div>
            <div class="block">
              <el-pagination
                @current-change="handleCurrentChange1"
                :current-page.sync="currentPage1"
                :page-size="pageSize1"
                layout="prev, pager, next, jumper"
                :total="total1">
              </el-pagination>
            </div>
          </div>
          <div v-if="createType==1">
            <div class="worktable" ref="tablebox1" style="width: 100%;height: 100%;box-sizing: border-box;">
              <el-table :data="workList" :height="tableHeightNum" class="highlight-current-row" border >
                <el-table-column prop="teamName" label="班组名称">
                </el-table-column>
                <el-table-column prop="workerName" label="姓名">
                </el-table-column>
                <el-table-column prop="idcardNumber" width="180" label="身份证号码">
                </el-table-column>
                <el-table-column prop="date" width="180" label="考勤时间">
                </el-table-column>
                <el-table-column prop="direction" label="进出方向">
                </el-table-column>
                <el-table-column prop="deviceName" label="通道">
                </el-table-column>
                <el-table-column prop="attendType" label="通行方式">
                </el-table-column>
                <!--<el-table-column prop="name" label="刷卡近照">-->
                <!--</el-table-column>-->
                <el-table-column prop="lng" label="经度">
                </el-table-column>
                <el-table-column prop="lat" label="纬度">
                </el-table-column>
              </el-table>
            </div>
            <div class="block">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange0"
                :current-page.sync="currentPage0"
                :page-size="pageSize0"
                layout="prev, pager, next, jumper"
                :total="total0">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>



  </div>
</template>
<script>
  export default {
    data () {
      return {
        searchValue:"",
        options:[{
          value: '选项1',
          label: '黄金糕'
        }],
        selectTime:'',
        tableData:[],
        workList:[],
        workList0:[],
        createType:0,
        currentPage:1,
        currentPage0:1,
        currentPage1:1,
        pageIndex:1,
        pageSize:15,
        total:0,
        teamUid:'',
        total0:0,
        pageSize0:15,
        pageIndex0:1,
        pageIndex1:1,
        pageSize1:15,
        total1:0,
        tableHeightNum:0,
        tableHeightNum1:0
      }
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.loadTeamData();
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.loadTeamData()
      }
    },
    activated(){

    },
    mounted () {
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
        console.log(this.$refs.tablebox1.offsetHeight)
        console.log(this.$refs.tablebox.offsetHeight)
        this.tableHeightNum1=this.$refs.tablebox1.offsetHeight
      })
      this.selectTime=new Date().format('yyyy-MM');
    },
    methods: {
      loadTeamData () {
        var params = {
          // selectTime:this.selectTime,
          pageSize: this.pageSize,
          pageNum: this.pageIndex,
          company:  this.sessionUtil.getCompanyUid(),
          projUid: this.$store.state.selectProjectObj.id,
        }
        this.util.restGet('/api_v1/modules/teams', params, (res) => {
            if(res.status==200){
              if(res.data!=undefined){
                this.tableData=res.data;
                this.total=res.totalCount;
              }else{
                this.tableData=[]
              }
            }
        })
      },
      getAttendanceData(){
        let params={
          projUid:this.$store.state.selectProjectObj.id,
          teamUid:this.teamUid,
          date:this.selectTime,
          search:this.searchValue,
          pageIndex:this.pageIndex0,
          pageSize:this.pageSize0
        };
        this.util.mask('正在加载数据');
        // this.util.restGet('/api_v1/modules/real/records',params, (res) => {
        this.util.restGet('/api_v1/modules/real/attendanceRecords',params, (res) => {
          if(res.status==200) {
            this.util.unmask()
            if(res.data!=undefined){
              for(let i=0;i<res.data.length;i++){
                if(res.data[i].directory==1){
                  res.data[i].direction='入场'
                }else{
                  res.data[i].direction='出场'
                }
              }
                this.workList=res.data
                this.total0=res.totalCount
            }else{
              this.workList=[]
            }
          }else{
            this.util.error(res.errorMsg)
            this.util.unmask()
          }
        });
      },
      derivetext(){

        if(this.createType==1){
          window.open(this.util.getBaseUrl()+'/api_v1/modules/real/exportWorkerAttendance?projUid='+this.$store.state.selectProjectObj.id+'&teamUid='+this.teamUid+'&date='+this.selectTime+'&access_token='+this.sessionUtil.getAccessToken())
        }else{
          window.open(this.util.getBaseUrl()+'/api_v1/modules/real/exportWorkerAttendanceReport?projUid='+this.$store.state.selectProjectObj.id+'&teamUid='+this.teamUid+'&date='+this.selectTime+'&access_token='+this.sessionUtil.getAccessToken())
        }
      },
      getFormsData(){
        let params={
          projUid:this.$store.state.selectProjectObj.id,
          teamUid:this.teamUid,
          date:this.selectTime,
          pageIndex:this.pageIndex1,
          pageSize:this.pageSize1
        };
        this.util.mask('正在加载数据');
        this.util.restGet('/api_v1/modules/real/attendance_report',params,res=>{
          if(res.status==200){
            this.util.unmask();
            if(res.data!=undefined){
              this.workList0=res.data;
              this.total1=res.totalCount;
            }else{
              this.workList0=[];
            }
          }else{
            this.util.error(res.errorMsg);
            this.util.unmask();
          }
        })
      },
      changeTime(){
        if(this.selectTime==''||this.selectTime==undefined||this.selectTime==null){
          this.selectTime='';
        }else{
          this.selectTime=new Date(this.selectTime).format('yyyy-MM')
        }

        if(this.createType==0){
          this.getFormsData();
        }else{
          this.getAttendanceData();
        }
      },
      handleCurrentclick(val){
        this.teamUid=val.id;
        if(this.createType==0){
          this.getFormsData();
        }else{
          this.getAttendanceData();
        }
      },
      changeType(num){
        if(num==1){
          this.getAttendanceData();
        }else{
          // this.util.failueToast('该功能未开发');
          // return false;
          this.getFormsData();
        }
        this.createType=num;
      },
      handleSizeChange(value){
        console.log(value)
      },
      handleCurrentChange0(val){
        this.pageIndex0=val
        this.getAttendanceData();
      },
      handleCurrentChange1(val){
        this.pageIndex1=val;
        this.getFormsData();
      },
      handleCurrentChange(val){
        this.pageIndex=val;
        this.loadTeamData();
      }
    }
  }
</script>

<style scoped>
  .proj-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0px;
    color: #44D2FF;
    font-size: 14px;
    padding-top: 10px;
    position: relative;
    overflow: auto;
  }
.block{
  text-align: right;
}
  .tabs-box {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .tabs {
    width: 100%;
    height: 36px;
    border: 1px solid #44D2FF;
    box-sizing: border-box;
    padding: 0 10px;
    text-align: center;
  }

  .tabs > span {
    width: 78px;
    float: left;
    height: 26px;
    line-height: 26px;
    margin-top: 4px;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .tabs > .active {
    background: url(../../assets/indexImg/select.png) no-repeat top center;
  }
.context{
  width:100%;
  height:100%;
}
.context_left{
  float: left;
  width:320px;
  height:100%;
  box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
  padding:13px 14px 13px 14px;
  box-sizing: border-box;
  overflow: auto;
}
.context_right{
  overflow: hidden;
  height:100%;
  padding-left: 10px;
  box-sizing: border-box;
}
  .context_text{
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    padding:10px 20px;
    height:100%;
    width:100%;
    box-sizing: border-box;
    overflow: auto;
  }
.context_left_head{
  overflow: hidden;
}
.context_left_head_left{
  float: left;
}
  .context_left_head_right{
    float: right;
    overflow: hidden;
  }
.context_text_head_left{
  float: left;
}
.context_text_head_left span{
  width: 78px;
  float: left;
  height: 26px;
  line-height: 26px;
  margin-top: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 12px;
  color:#fff;
}
  .active{
    background: url(../../assets/indexImg/select.png) no-repeat  top center;
  }
  .context_text_head_right{
    float: right;
  }
</style>

<style>
.context_left_head_right .el-select{
  background: rgba(255,255,255,0.2);
  width:90px;
  height:24px;
}
.context_left_head_right .el-input--suffix .el-input__inner{
  height:24px;
}
.context_left_head_right .el-input__icon{
  line-height: 0px;
}
.context_left_head_right .el-date-editor.el-input,.context_left_head_right .el-date-editor.el-input__inner{
  width:150px;
}
.signinRecord .el-table td,.signinRecord .el-table th{
  padding:3px 0;
}
  .pagetion .el-input__icon{
    line-height: 0;
  }
</style>
