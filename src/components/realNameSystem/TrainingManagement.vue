<template>
  <div class="proj-box LaborContract TrainingManagement">
    <div class="context">
      <div class="context_left">
        <div style="position:relative;width: 100%;height: 100%;box-sizing: border-box;padding: 40px 10px 42px ">
          <div style="width: 100%;position: relative;">
            <div class="context_left_head" style="width: 100%;position: absolute;top:-40px;left: 0;">
              <div class="context_left_head_left">
                <h4>课程名称</h4>
              </div>
              <div style="float: right">
                <button @click="addCurriculum"  v-if="sessionUtil.isAllowBtn('gc7_10:btn_add_lesson')">添加</button>
              </div>
            </div>
          </div>
          <div class="context_left_table" style="width: 100%;height: 100%;box-sizing: border-box;" ref="tablebox">
            <el-table :data="tableData" :height="tableHeightNum" highlight-current-row class="highlight-current-row" @cell-click="handleCurrentclick" border style="width: 100%">
              <el-table-column  label="操作" width="80" v-if="sessionUtil.isAllowBtn('gc7_10:btn_edit_lesson')||sessionUtil.isAllowBtn('gc7_10:btn_delete_lesson')">
                <template slot-scope="scope" class="operation">
                  <span @click="edit(scope.$index,tableData)" v-if="sessionUtil.isAllowBtn('gc7_10:btn_edit_lesson')"><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
                  <span @click="deletes(scope.$index,tableData)" v-if="sessionUtil.isAllowBtn('gc7_10:btn_delete_lesson')"><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span>
                </template>
              </el-table-column>
              <el-table-column prop="courseTitle" width="150" label="课程名称">
              </el-table-column>
              <el-table-column prop="trainingType"  label="培训类型">
              </el-table-column>
              <el-table-column prop="trainingDate" width="120" label="培训日期">
              </el-table-column>
              <el-table-column prop="workerCount" label="人数">
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
                <h4>培训详情</h4>
              </div>
              <div class="context_text_head_right">
                <button @click="addPeople"  v-if="sessionUtil.isAllowBtn('gc7_10:btn_add')">添加人员</button>
                <button @click="addDetails"  v-if="sessionUtil.isAllowBtn('gc7_10:btn_set')">设置</button>
              </div>
            </div>
          </div>
          <div >
            <div class="worktable" ref="tablebox1" style="width: 100%;height: 100%;box-sizing: border-box;">
              <el-table :data="workList" :height="tableHeightNum" class="highlight-current-row" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column  label="操作" width="80" v-if="sessionUtil.isAllowBtn('gc7_10:btn_edit')||sessionUtil.isAllowBtn('gc7_10:btn_delete')">
                  <template slot-scope="scope" class="operation">
                    <span @click="edits(scope.$index,workList)"  v-if="sessionUtil.isAllowBtn('gc7_10:btn_edit')"><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
                    <span @click="deldetails(scope.$index,workList)"  v-if="sessionUtil.isAllowBtn('gc7_10:btn_delete')"><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名">
                </el-table-column>
                <el-table-column prop="idcardNumber" label="身份证号码" >
                </el-table-column>
                <el-table-column prop="workTypeCode" label="工种">
                </el-table-column>
                <el-table-column prop="isItQualified" label="是否合格">
                </el-table-column>
                <el-table-column prop="trainingScore" label="培训得分">
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

    <el-dialog title="课程信息"  class="piliang approachs1" :visible.sync="dialogFormVisible1">
      <el-form :model="form">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="课程名称" :rules="[{ required: true, message: '课程名称不能为空'},]" :label-width="formLabelWidth">
              <el-input  v-model="form.courseTitle" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训日期" :rules="[{ required: true, message: '培训日期不能为空'},]" :label-width="formLabelWidth">
              <el-date-picker v-model="form.trainingDate" @blur="changetime(form.trainingDate)" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训时长(小时)" :label-width="formLabelWidth">
              <el-input v-model="form.trainingDuration" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训类型" :label-width="formLabelWidth">
              <el-select v-model="form.trainingType" placeholder="请选择活动区域">
                <el-option label="安全教育" value="1"></el-option>
                <el-option label="入场教育" value="2"></el-option>
                <el-option label="退场教育" value="3"></el-option>
                <el-option label="技能培训" value="4"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训人" :label-width="formLabelWidth">
              <el-input v-model="form.trainee" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="培训机构" :label-width="formLabelWidth">
              <el-input v-model="form.trainingInstitutions" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="培训地址" :label-width="formLabelWidth">
              <el-input v-model="form.trainingAddress" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="培训简述" :label-width="formLabelWidth">
              <el-input v-model="form.trainingBrief" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible1=false">取 消</el-button>
        <el-button type="primary" @click="downsub">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="进场" class="piliang approachs" :visible.sync="dialogFormVisible">
      <el-form :model="form1">
        <el-form-item label="姓名"  :label-width="formLabelWidths">
          <el-input @focus="addNumber" disabled="disabled" v-model="workername" ></el-input>
        </el-form-item>
        <el-form-item label="得分" :label-width="formLabelWidths">
          <el-input v-model="form1.trainingScore" ></el-input>
        </el-form-item>
        <el-form-item label="是否合格" :label-width="formLabelWidths">
          <el-select @change="changeSelcet(form1.isItQualified)" v-model="form1.isItQualified" placeholder="请选择活动区域">
            <el-option label="是" value="Y"></el-option>
            <el-option label="否" value="N"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="btnsbu">确 定</el-button>
      </div>
    </el-dialog>
    <div>
      <div @click="closemask" v-show="isShowType" style="position: fixed;width:100%;height:100%;background-color: #000;opacity: 0.5;top:0;left:0;"></div>
      <memberManageselcet @close="closes" @closemask="closemask" v-show="isShowType"></memberManageselcet>
    </div>
  </div>
</template>
<script>
  import uploading from '@/components/common/uploading.vue'
  import memberManageselcet from './memberManageselcet.vue'
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
        formLabelWidth:'110px',
        formLabelWidths:'90px',
        form: {},
        form1: {},
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
        createCode1:'',
        curriculumUid:'',
        isShowType:false,
        workername:'',
        workerUids:'',
        ids:''
      }
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.getTrainingData();
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.getTrainingData();
      }
    },
    mounted () {
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
        this.tableHeightNum1=this.$refs.tablebox1.offsetHeight
      })
    },
    methods: {
      addPeople(){
        this.isShowType=true;
      },
      addNumber(){
        // this.dialogFormVisible=false;
        // this.isShowType=true;
      },
      closes(data){
        console.log(data);
        for(let i=0;i<data.length;i++){
          this.workerUids+=data[i].workderId+','
        }
        this.workerUids=this.workerUids.slice(0,this.workerUids.length-1);


        this.util.restPost('/api_v1/modules/training_detail/addWorker?workerUids='+this.workerUids+'&curriculumUid='+this.curriculumUid,null,res=>{
          if(res.status==200){
            this.getDetailsData();
            this.isShowType=false;
            this.util.successToast('添加成功')
          }
        })
        // if(data.length>1){
        //   this.util.failueToast('只能选择一个,请重新选择');
        //   return false;
        // }
        // this.workername=data[0].workername;
        // this.form1.workerUid=data[0].workderId;
      },
      closemask(){
        // this.dialogFormVisible=true;
        this.isShowType=false;
      },
      getTrainingData(){
        this.util.restGet('/api_v1/modules/curriculum?projUid='+this.$store.state.selectProjectObj.id,null,res=>{
          if(res.status==200){
            if(res.data!=undefined){
              for(let i=0;i<res.data.length;i++){
                if(res.data[i].trainingType==1){
                  res.data[i].trainingType='安全教育';
                }else if(res.data[i].trainingType==2){
                  res.data[i].trainingType='入场教育';
                }else if(res.data[i].trainingType==3){
                  res.data[i].trainingType='退场教育';
                }else{
                  res.data[i].trainingType='技能培训';
                }
              }
              this.tableData=res.data;
            }else{
              this.tableData=[];
            }
          }
        })
      },
      addCurriculum(){
        this.form={};
        this.dialogFormVisible1=true;
        this.createCode='';
      },
      deletes(index,arr){
        let id=arr[index].id;
        this.open2(id)
      },
      edit(index,arr){
        let id=arr[index].id;
        this.createCode='edit';
        this.dialogFormVisible1=true;
        this.editFun(id)
      },
      editFun(id){
        this.util.restGet('/api_v1/modules/curriculum/'+id,null,res=>{
          this.form.projUid=res.data.projUid;
          this.form.courseTitle=res.data.courseTitle;
          this.form.trainingDate=res.data.trainingDate;
          this.form.trainingDuration=res.data.trainingDuration;
          this.form.trainingType=res.data.trainingType;
          this.form.trainee=res.data.trainee;
          this.form.trainingInstitutions=res.data.trainingInstitutions;
          this.form.trainingAddress=res.data.trainingAddress;
          this.form.trainingBrief=res.data.trainingBrief;
          this.form.id=res.data.id;
          this.$forceUpdate();
        });
      },
      downsub(){
        if(this.createCode!='edit'){
          if(this.form.courseTitle==''||this.form.courseTitle==undefined){
            this.util.failueToast('请填写课程名称');
            return false;
          }
          if(this.form.trainingDate==''||this.form.trainingDate==undefined){
            this.util.failueToast('请选择培训日期');
            return false;
          }
          this.form.projUid=this.$store.state.selectProjectObj.id;
          this.form.trainingDate=new Date(this.form.trainingDate).format('yyyy-MM-dd');
          this.util.restPost('/api_v1/modules/curriculum',this.form,res=>{
            if(res.status==200){
              this.util.successToast('新增成功');
              this.dialogFormVisible1=false;
              this.getTrainingData();
            }
          })
        }else{
          this.form.trainingDate=new Date(this.form.trainingDate).format('yyyy-MM-dd');
          this.util.restPut('/api_v1/modules/curriculum/'+this.form.id,this.form,res=>{
            if(res.status==200){
              this.util.successToast('编辑成功');
              this.dialogFormVisible1=false;
              this.getTrainingData();
            }else{
              this.util.error(res.errorMsg);
            }
          })
        }

      },
      changetime(val){
        this.form.trainingDate=val;
        this.$forceUpdate();
      },
      handleSelectionChange(val){
        console.log(val)
        this.workername='';
        this.ids='';
        for(let i=0;i<val.length;i++){
          this.workername+=val[i].name+','
          this.ids+=val[i].id+','
        }
        this.workername=this.workername.slice(0,this.workername.length-1);
        this.ids=this.ids.slice(0,this.ids.length-1);
      },
      handleSizeChange(value){
      },
      handleCurrentChange(value){
      },
      handleCurrentChange0(val){
        this.pageIndex1=val;
        this.getDetailsData();
      },
      handleCurrentclick(val){
        this.curriculumUid=val.id;
        this.getDetailsData();
      },
      getDetailsData(){
        let params={
          curriculumUid:this.curriculumUid,
          pageIndex:this.pageIndex1,
          pageSize:this.pageSize1
        };
        this.util.restGet('/api_v1/modules/training_detail',params,res=>{
          if(res.status==200){
            if(res.data!=undefined){
              for(let i=0;i<res.data.length;i++){
                if(res.data[i].isItQualified=='Y'){
                  res.data[i].isItQualified='是'
                }else{
                  res.data[i].isItQualified='否'
                }
              }
              this.workList=res.data;
              this.total1=res.totalCount;
            }else{
              this.workList=[];
              this.total1=res.totalCount;
            }
          }else{
            this.util.error(res.errorMsg)
          }
        })
      },
      addDetails(){
        if(this.ids==''||this.ids==undefined){
          this.util.failueToast('请选择设置的项');
          return false;
        }
        this.createCode1='';
        this.form1={};
        this.dialogFormVisible=true;
      },
      changeSelcet(val){
        this.form1.isItQualified=val;
        this.$forceUpdate();
      },
      btnsbu(){
        if(this.form1.trainingScore==''||this.form1.trainingScore==undefined){
          this.util.failueToast('请填写得分');
          return false;
        }
        if(this.form1.isItQualified==''||this.form1.isItQualified==undefined){
          this.util.failueToast('请选择是否合格');
          return false;
        }
        let reg = /^\+?[1-9][0-9]*$/;
        console.log(!reg.test(this.form1.trainingScore))
        if(!reg.test(this.form1.trainingScore)){
          this.util.failueToast('请填写正确的得分,只能输入整数');
          return false;
        }
        if(this.createCode1!='edit'){
          this.util.restPut('/api_v1/modules/training_detail/setupTrainingResult?ids='+this.ids+'&isItQualified='+this.form1.isItQualified+'&trainingScore='+this.form1.trainingScore,null,res=>{
            if(res.status==200){
              this.util.successToast('新增成功');
              this.dialogFormVisible=false;
              this.getDetailsData();
              this.getTrainingData();
            }else{
              this.util.error(res.errorMsg);
            }
          })
        }else{
          let params={
            isItQualified:this.form1.isItQualified,
            trainingScore:this.form1.trainingScore,
            curriculumUid:this.form1.curriculumUid,
            workerUid:this.form1.workerUid,
          }
          this.util.restPut('/api_v1/modules/training_detail/'+this.form1.id,params,res=>{
            if(res.status==200){
              this.util.successToast('编辑成功');
              this.dialogFormVisible=false;
              this.getDetailsData();
            }else{
              this.util.error(res.errorMsg);
            }
          })
        }
      },
      edits(index,arr){
        let id=arr[index].id;
        this.createCode1='edit';
        this.dialogFormVisible=true;
        this.workername=arr[index].name;
        this.editsfun(id);
      },
      editsfun(id){
        this.util.restGet('/api_v1/modules/training_detail/'+id,null,res=>{
            if(res.status==200){
              this.form1.trainingScore=res.data.trainingScore;
              this.form1.isItQualified=res.data.isItQualified;
              this.form1.curriculumUid=res.data.curriculumUid;
              this.form1.workerUid=res.data.workerUid;
              this.form1.id=res.data.id;
              this.$forceUpdate();
            }
        })
      },
      deldetails(index,arr){
        let id=arr[index].id
        this.open1(id)
      },
      deldetailsfun(id){
        this.util.restDelete('/api_v1/modules/training_detail/'+id,null,res=>{
          if(res.status==200){
            this.getDetailsData();
            this.getTrainingData();
            this.util.successToast('删除成功');
          }else{
            this.util.error(res.errorMsg);
          }
        })
      },
      deletefun(id){
        this.util.restDelete('/api_v1/modules/curriculum/'+id,null,res=>{
          if(res.status==200){
            this.util.successToast('删除成功');
            this.getTrainingData();
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
      },
      open1(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deldetailsfun(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    components:{
      uploading,memberManageselcet
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
    height:42px;
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
  .approachs1 .el-dialog{
    width:760px;
  }
  .approachs1 .el-form-item__label{
    text-align: left;
  }
 .TrainingManagement .el-table--border td:first-child .cell,.TrainingManagement .el-table--border th:first-child .cell, .el-table .cell, .el-table th div{
    /*text-align: center;*/
  }
  .TrainingManagement .el-dialog__body{
    padding:10px 20px;
  }
</style>
