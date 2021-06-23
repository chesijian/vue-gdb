<template>
  <div class="proj-box LaborContract">
    <div class="context">
      <div class="context_left">
        <div style="position:relative;width: 100%;height: 100%;box-sizing: border-box;padding: 40px 10px 42px ">
          <div style="width: 100%;position: relative;">
            <div class="context_left_head" style="width: 100%;position: absolute;top:-40px;left: 0;">
              <div class="context_left_head_left">
                <h4>薪资统计</h4>
              </div>
              <div style="float: right">
                <button @click="addSalary"  v-if="sessionUtil.isAllowBtn('gc7_9:btn_batch')">添加</button>
              </div>
            </div>
          </div>
          <div class="context_left_table" style="width: 100%;height: 100%;box-sizing: border-box;" ref="tablebox">
            <el-table :data="tableData" :height="tableHeightNum" highlight-current-row class="highlight-current-row" @cell-click="handleCurrentclick" border style="width: 100%">
              <el-table-column  label="操作" width="80"  v-if="sessionUtil.isAllowBtn('gc7_9:btn_edit')||sessionUtil.isAllowBtn('gc7_9:btn_delete')">
              <template slot-scope="scope" class="operation">
              <span @click="edit(scope.$index,tableData)"  v-if="sessionUtil.isAllowBtn('gc7_9:btn_edit')"><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
              <span @click="deletes(scope.$index,tableData)"  v-if="sessionUtil.isAllowBtn('gc7_9:btn_delete')"><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span>
              </template>
              </el-table-column>
              <el-table-column prop="monthOfIssue" label="薪资月份">
              </el-table-column>
              <el-table-column prop="workerNameCount" width="40" label="人数">
              </el-table-column>
              <el-table-column prop="amountPayableSum" label="应发金额">
              </el-table-column>
              <el-table-column prop="actualAmountSum" label="实发金额">
              </el-table-column>
            </el-table>
          </div>
          <div class="pagenation" style="text-align: right">
            <!--<el-pagination-->
              <!--@current-change="handleCurrentChange"-->
              <!--:current-page.sync="currentPage"-->
              <!--:page-size="pageSize"-->
              <!--layout="prev, pager, next, jumper"-->
              <!--:total="total">-->
            <!--</el-pagination>-->
          </div>
        </div>
      </div>
      <div class="context_right">
        <div class="context_text" style="height:100%;width:100%;box-sizing: border-box;padding: 55px 10px 20px;">
          <div style="width: 100%;position: relative;">
            <div class="context_text_head" style="width: 100%;position: absolute;top:-40px;left: 0;">
              <div class="context_text_head_left">
                <h4>发放记录</h4>
              </div>
              <div class="context_text_head_right">
                <button @click="Import" v-if="sessionUtil.isAllowBtn('gc7_9:exprot')">导入</button>
                <button @click="exportlist" v-if="sessionUtil.isAllowBtn('gc7_9:import')">导出</button>
              </div>
            </div>
          </div>
          <div >
            <div class="worktable" ref="tablebox1" style="width: 100%;height: 100%;box-sizing: border-box;">
              <el-table :data="workList" :height="tableHeightNum" class="highlight-current-row" border style="width: 100%" @selection-change="handleSelectionChange">
                 <el-table-column prop="teamName" label="班组名称">
                </el-table-column>
               	<el-table-column prop="workerName" label="姓名">
                </el-table-column>
                <el-table-column prop="idcardNumber" label="身份证号码">
                </el-table-column>
                <el-table-column prop="attendanceDaysNum" label="出勤天数" >
                </el-table-column>
                <el-table-column prop="totalWorkingHours" label="总工时">
                </el-table-column>
                <el-table-column prop="amountPayable" label="应发金额">
                </el-table-column>
                <el-table-column prop="actualAmount" label="实发金额">
                </el-table-column>
                <el-table-column prop="whetherToReissue" label="是否是补发">
                </el-table-column>
                <el-table-column prop="dateOfIssue" label="发放日期">
                </el-table-column>
                <el-table-column prop="payrollCode" label="工资单编号">
                </el-table-column>
              </el-table>
            </div>
            <div class="block pagenation" style="text-align: right">
              <el-pagination
                @current-change="handleCurrentChange0"
                :current-page.sync="currentPage1"
                :page-size="pageSize1"
                layout="prev, pager, next, jumper"
                :total="total1">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog title="进场" class="piliang approachs" :visible.sync="dialogFormVisible1">
      <div style="width:100%;height:42px;line-height: 42px;border:1px solid rgba(68,210,255,1);margin-bottom: 20px;">
        <span>只能上传xls,xlsx文件，且不超过50</span>
        <span><button style="background-color: rgba(92,154,212,1)" @click="DownModule">下载模板</button></span>
      </div>
      <div style="width:100%;height:120px;padding-top:50px;border:1px solid rgba(68,210,255,1);">
        <uploading ref="uploadFile" :config="uploadConfig"></uploading>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1=false">取 消</el-button>
        <el-button type="primary" @click="downsub">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="薪资统计" class="piliang approachs" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="工资单编号" :label-width="formLabelWidth">
          <el-input v-model="form.payrollCode" ></el-input>
        </el-form-item>
        <el-form-item label="第三方工资单编号" :label-width="formLabelWidth">
          <el-input v-model="form.thirdPayrollCode" ></el-input>
        </el-form-item>
        <el-form-item label="发放工资的年月" :label-width="formLabelWidth">
          <el-date-picker v-model="form.monthOfIssue" @blur="changetime(form.monthOfIssue)"  format="yyyy-MM" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        
      </el-form>
      <div>
        <uploading ref="seeLoadFile" :config="uploadConfig"></uploading>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button class="item_button" @click="close">取 消</el-button>
        <el-button class="item_button" type="primary" @click="btnsbu">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script>
  import uploading from '@/components/common/uploading.vue'
  export default {
    data () {
      return {
        selectTime:'',
        tableData:[],
        workList:[],
        currentPage:1,
        currentPage1:1,
        dialogFormVisible:false,
        dialogFormVisible1:false,
        formLabelWidth:'130px',
        form: {
        },
        tableHeightNum:0,
        tableHeightNum1:0,
        isType:'',
        pageIndex:1,
        pageSize:10,
        total:0,
        pageIndex1:1,
        pageSize1:10,
        total1:0,
        teamUid:'',
        entryExitFlag:1,
        uploadConfig: {
          limit: 1,//限制附件上传个数
          limitSize: 52428800,//50mb单个附件上传大小
          readOnly: false,//是否只读
          multiple: false,//是否允许多选
          xtype: 'device_'+this.deviceType,//同一个表单区别多个附件上传块
          accept:".xls,.xlsx",
          acceptMsg: '将文件拖拽至此区域',//提示信息
        },
        createCode:'',
        salaryUid:''
      }
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.getWageData();
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.getWageData();
      }
    },
    mounted () {
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
        this.tableHeightNum1=this.$refs.tablebox1.offsetHeight
      })
    },
    methods: {
      getWageData(){
        this.util.restGet('/api_v1/modules/salary?projUid='+this.$store.state.selectProjectObj.id,null,res=>{
          if(res.status==200){
            if(res.data!=undefined){
              this.tableData=res.data;
            }else{
              this.tableData=[];
            }
          }
        })
      },
      deletes(index,arr){
        console.log(111)
        let id=arr[index].id;
        this.open2(id)
      },
      edit(index,arr){
        let id=arr[index].id;
        this.createCode='edit'
        this.dialogFormVisible=true;
        this.editFun(id)
      },
      editFun(id){
        this.util.restGet('/api_v1/modules/salary/'+id,null,res=>{
          this.form.projUid=res.data.projUid;
          this.form.payrollCode=res.data.payrollCode;
          this.form.thirdPayrollCode=res.data.thirdPayrollCode;
          this.form.monthOfIssue=res.data.monthOfIssue;
          this.form.id=res.data.id;
          this.$forceUpdate();
        });
      },
      downsub(){
        let params={
          fileId:this.uploadConfig.filesList[0].id+'.'+this.uploadConfig.filesList[0].suffix,
          salaryUid:this.salaryUid
        };
        this.util.restGet('/api_v1/modules/salary/importSalaryDetail',params,res=>{
          if(res.status==200){
            this.util.successToast('导入成功');
            this.dialogFormVisible1=false;
            this.getRecordData();
            this.getWageData();
          }
        })
      },
      DownModule(){
        window.open(this.util.getBaseUrl()+'/api_v1/modules/salary/templateDownloadSalaryDetail?access_token='+this.sessionUtil.getAccessToken())
        // this.util.restGet('/api_v1/modules/salary/templateDownloadSalaryDetail',null,res=>{
        //   if(res.status==200){
        //     this.util.successToast('正在下载');
        //   }
        // })
      },
      changetime(val){
        this.form.monthOfIssue=val;
        this.$forceUpdate();
      },
      addSalary(){
        this.createCode='';
        this.dialogFormVisible=true;
      },
      Import(){
        if(this.salaryUid==''||this.salaryUid==undefined){
          this.util.failueToast('请选择薪资统计');
          return false
        }
        this.dialogFormVisible1=true
      },
      handleSelectionChange(val){

      },
      handleSizeChange(value){
      },
      handleCurrentChange(value){
      },
      handleCurrentChange0(val){
        this.pageIndex1=val;
        this.getRecordData();
      },
      handleCurrentclick(val){
        this.salaryUid=val.id;
        this.getRecordData();
      },
      exportlist(){
        if(this.salaryUid==''||this.salaryUid==undefined){
          this.util.failueToast('请选择薪资统计');
          return false;
        }
        window.open(this.util.getBaseUrl()+'/api_v1/modules/salary/exportSalaryDetail?salaryUid='+this.salaryUid+'&access_token='+this.sessionUtil.getAccessToken())

      },
      getRecordData(){
        let params={
          salaryUid:this.salaryUid,
          pageIndex:this.pageIndex1,
          pageSize:this.pageSize1
        };
        this.util.restGet('/api_v1/modules/salary_detail',params,res=>{
          if(res.status==200){
            if(res.data!=undefined){
            	console.log("res.data",res.data)
              this.workList=res.data;
              this.total1=res.totalCount;
            }
          }else{
            this.util.error(res.errorMsg)
          }
        })
      },
      close(){
        this.dialogFormVisible=false;
      },
      btnsbu(){
        if(this.form.thirdPayrollCode==''||this.form.thirdPayrollCode==undefined){
          this.util.failueToast('请填写第三方工资单编码');
          return false;
        }
        if(this.form.payrollCode==''||this.form.payrollCode==undefined){
          this.util.failueToast('请填写工资单编码');
          return false;
        }
        if(this.form.monthOfIssue==''||this.form.monthOfIssue==undefined){
          this.util.failueToast('请选择年月');
          return false;
        }
        if(this.createCode!='edit'){
          let params={
            projUid:this.$store.state.selectProjectObj.id,
            payrollCode:this.form.payrollCode,
            thirdPayrollCode:this.form.thirdPayrollCode,
            monthOfIssue:new Date(this.form.monthOfIssue).format('yyyy-MM')
          };
          this.util.restPost('/api_v1/modules/salary',params,res=>{
            if(res.status==200){
              this.util.successToast('新增成功');
              this.dialogFormVisible=false;
              this.getWageData();
            }else{
              this.util.error(res.errorMsg);
            }
          })
        }else{
          this.form.monthOfIssue=new Date(this.form.monthOfIssue).format('yyyy-MM');
          this.util.restPut('/api_v1/modules/salary/'+this.form.id,this.form,res=>{
            if(res.status==200){
              this.util.successToast('编辑成功');
              this.dialogFormVisible=false;
              this.getWageData();
            }else{
              this.util.error(res.errorMsg);
            }
          })
        }

      },
      deletefun(id){
        this.util.restDelete('/api_v1/modules/salary/'+id,null,res=>{
          if(res.status==200){
            this.util.successToast('删除成功');
            this.getWageData();
          }
        })
      },
      open2(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletefun(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    components:{
      uploading
    }
  }
</script>

<style scoped>
  .proj-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding:0;
    color: #44D2FF;
    font-size: 14px;
    padding-top: 10px;
    position: relative;
    overflow: auto;
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
    width:350px;
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

  .context_left_head_left{
    float: left;
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
  .piliang .el-input{
    border:1px solid rgba(212,212,212,1);
  }
  .piliang .el-input__inner{
    color:rgba(51,51,51,1) !important;
  }
  .piliang .el-date-editor.el-input{
    width:100%;
  }
  .piliang .el-select .el-input .el-select__caret.el-input__icon{
    color:#000;
  }
  .LaborContract .el-table td,.LaborContract .el-table th{
    padding:3px 0;
  }
  .LaborContract .el-select{
    width:100% !important;
  }
  .context_left_table .bg .el-table--enable-row-transition .el-table__body td{
    text-align: center;
  }
  .approachs .el-dialog{
    width:420px;
  }
</style>
