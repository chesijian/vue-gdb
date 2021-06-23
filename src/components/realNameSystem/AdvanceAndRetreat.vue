<template>
  <div class="proj-box LaborContract">
    <div class="context">
      <div class="context_left">
        <div style="position:relative;width: 100%;height: 100%;box-sizing: border-box;padding: 40px 10px 42px ">
          <div style="width: 100%;position: relative;">
            <div class="context_left_head" style="width: 100%;position: absolute;top:-40px;left: 0;">
              <div class="context_left_head_left">
                <h4>班组</h4>
              </div>
            </div>
          </div>
          <div class="context_left_table" style="width: 100%;height: 100%;box-sizing: border-box;" ref="tablebox">
            <el-table :data="tableData" :height="tableHeightNum" highlight-current-row class="highlight-current-row" @cell-click="handleCurrentclick" border style="width: 100%">
              <el-table-column prop="name" label="班组名称">
              </el-table-column>
              <el-table-column prop="responsiblePersonName" label="负责人">
              </el-table-column>
              <el-table-column prop="teamMemberNum" label="人数">
              </el-table-column>
            </el-table>
          </div>
          <div class="pagenation" style="text-align: right">
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
      <div class="context_right">
        <div class="context_text" style="height:100%;width:100%;box-sizing: border-box;padding: 55px 10px 20px;">
          <div style="width: 100%;position: relative;">
            <div class="context_text_head" style="width: 100%;position: absolute;top:-40px;left: 0;">
              <div class="context_text_head_left">
                <span @click="changeType(0)" :class="{active:createType==0}">进场</span>
                <span @click="changeType(1)" :class="{active:createType==1}">退场</span>
              </div>
              <div class="context_text_head_right">
                <button @click="openFrom" v-if="sessionUtil.isAllowBtn('gc7_8:btn_batch')">批量生成</button>
              </div>
            </div>
          </div>
          <div >
            <div class="worktable" ref="tablebox1" style="width: 100%;height: 100%;box-sizing: border-box;">
              <el-table :data="workList" :height="tableHeightNum" class="highlight-current-row" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column  label="操作" width="80">
                  <template slot-scope="scope" class="operation">
                    <span @click.stop="edit(scope.$index, workList)"><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
                    <!-- <span @click.stop="removedel(scope.$index, workList)"><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span> -->
                  </template>
                </el-table-column>
                <el-table-column prop="workerName" label="姓名">
                </el-table-column>
                <el-table-column prop="cellphone" label="手机号码">
                </el-table-column>
                <el-table-column prop="idcardNumber" width="180" label="身份证号码" >
                </el-table-column>
                <el-table-column prop="workTypeCode" label="工种">
                </el-table-column>
                <el-table-column prop="entryExitFlag" label="类型">
                </el-table-column>
                <el-table-column prop="entryExitTime" label="日期">
                </el-table-column>
              </el-table>
            </div>
            <div class="block pagenation" style="text-align: right">
              <el-pagination
                @size-change="handleSizeChange"
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

    <el-dialog title="人员进退场" class="piliang approach" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="类型" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选择类型', trigger: 'blur' }]">
          <el-select v-model="form.entryExitFlag" placeholder="请选择类型">
            <el-option label="进场" value="1"></el-option>
            <el-option label="退场" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期" :label-width="formLabelWidth" :rules="[{ required: true, message: '请选择日期', trigger: 'blur' }]">
          <el-date-picker v-model="form.entryExitTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="btnsbu">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="人员信息" class="piliang" :visible.sync="dialogUserInfoVisible">
      <el-form :model="form">
        <el-row :gutter="20">
          <el-col :span="12" v-if="form.id!=undefined">
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.workerName"  placeholder="请输入合同编号" class="item_content" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" :label-width="formLabelWidth">
              <el-input v-model="form.cellphone"  placeholder="请输入合同编号" class="item_content" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工种" :label-width="formLabelWidth">
              <el-input class="item_content" v-model="form.workTypeCode" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型" :label-width="formLabelWidth">
              <el-select v-model="form.entryExitFlag" :disabled="true" class="item_date" placeholder="请选择进出类型">
                <el-option label="进场" value="1"></el-option>
                <el-option label="退场" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
            <!--<el-col :span="24" >
            	<div style="height: 100px;">
                <img width="100px" height="100px"  :src="urls"/>
                <span>点击上传</span>
            	</div>
          </el-col>-->
          <el-col :span="24" v-show="form.id!=undefined">
            <el-form-item label="上传图片" :label-width="formLabelWidth">
            	<div @click="uploadings()" style="height: 100px;width: 500px;margin: 0 auto;display: flex;justify-content: space-between;align-items: center;">
                <img v-if="urls.length != 0" width="100px" height="100px"  :src="urls"/>
                <span>点击上传</span>
            	</div>
            	
            	<div v-show="uploadingshow">
            		
            		<uploading ref="seeLoadFile" :config="uploadConfig"></uploading>
            	</div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUserInfoVisible=false">取 消</el-button>
        <el-button type="primary" @click="btnsbu">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import uploading from '@/components/common/uploading.vue'
  export default {
    data () {
      return {
      	uploadingshow:false,
      	urls:'',
        selectTime:'',
        tableData:[],
        workList:[],
        createType:0,
        currentPage:1,
        currentPage1:1,
        dialogFormVisible:false,
        dialogUserInfoVisible:false,//编辑框
        formLabelWidth:'80px',
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
        tablearr:[],
        ids:'',
        uploadConfig: {
          limit: 1,//限制附件上传个数
          limitSize: 52428800,//50mb单个附件上传大小
          readOnly: false,//是否只读
          multiple: false,//是否允许多选
          xtype: 'device_'+this.deviceType,//同一个表单区别多个附件上传块
          accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP',//允许上传文件类型
          acceptMsg: '只能传图片',//提示信息
        },
      }
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.loadTeamData();
      this.uploadingshow = false;
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.loadTeamData()
      }
    },
    mounted () {
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
        this.tableHeightNum1=this.$refs.tablebox1.offsetHeight
      })
    },
    methods: {
      loadTeamData () {
        var params = {
          pageSize: this.pageSize,
          pageNum: this.pageIndex,
          company: this.sessionUtil.getCompanyUid(),
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
      uploadings(){
      	this.uploadingshow = !this.uploadingshow
      },
      getLabourData(){
        this.util.restGet('/api_v1/modules/real/entry_exit_his?projUid='+this.$store.state.selectProjectObj.id+'&teamUid='+this.teamUid+'&pageIndex='+this.pageIndex1+'&pageSize='+this.pageSize+'&entryExitFlag='+this.entryExitFlag, null, (res) => {
          if(res.status==200){
            if(res.data!=undefined){
              for(let i=0;i<res.data.length;i++){
                if(res.data[i].entryExitFlag){
                  if(res.data[i].entryExitFlag==1){
                    res.data[i].entryExitFlag='进场'
                  }else{
                    res.data[i].entryExitFlag='退场'
                  }
                }
              }
              this.workList=res.data;
              this.total1=res.totalCount;
            }else{
              this.workList=[]
            }
          }
        })
      },
            
      edit(index,item){
//    	var urls = ''
        this.isType='';
       
//     this.uploadConfig =  item.attachment
      if(item[index].id!=undefined){
      	 console.log("item",item[index])
      	if(item[index].attachment){
      		this.urls = this.util.getBaseUrl() + "/api_v1/files/" + item[index].attachment[0].ID_ + "/download?&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + item[index].attachment[0].ID_ + "&suffix=" + item[index].attachment[0].SUFFIX_ + "&fileName=" + encodeURIComponent(item[index].attachment[0].FILE_NAME_);
      	}
          this.form=item[index];
        }else{
          this.form.id='';
          this.form.workerUid=item[index].workerUid;
        }
        this.dialogUserInfoVisible=true;
      },
      EditSaveData(){
      	
        if(!this.form.entryExitFlag) {
          this.util.error('请选择类型')
          return false;
        } 
        if(!this.form.entryExitTime) {
          this.util.error('请选择日期')
          return false;
        } 
        if(this.isType!='add'){
          var mainData=this.form
          //遍历附件
          if(this.uploadingshow == true && this.uploadConfig.filesList){
//        	 	alert('a2')
          	var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"R_PROJECT_WORKER",filesData: JSON.stringify(this.uploadConfig.filesList),ifSaveWorkflow:false};
//        	console.log("item",	this.uploadConfig.filesList[0] )
//         	this.urls = this.util.getBaseUrl() + "/api_v1/files/" + this.uploadConfig.filesList[0].id + "/download?&access_token=" + this.sessionUtil.getAccessToken() + "&id=" + this.uploadConfig.filesList[0].id + "&suffix=" + this.uploadConfig.filesList[0].suffix + "&fileName=" + encodeURIComponent(this.uploadConfig.filesList[0].fileName);
//         console.log("item",	this.urls)
          }else{
//        	alert('a')
          	var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"R_PROJECT_WORKER",filesData: JSON.stringify([]),ifSaveWorkflow:false};
          }
          params['id']=this.form.id;
          params['businessKey']=this.form.id;
          this.util.mask("正在保存..");
          this.util.restPost("/api_v1/form/business",params,(res)=>{
             this.util.unmask();
              if(res.status==200){
                this.util.success('保存成功');
//              if(!flag) {
//                this.util.warn('保存后，请完善相应的信息')
//              }
//              this.dialogFormVisible=false;
								this.uploadingshow = false;
								
  						this.dialogUserInfoVisible=false;
						 this.$router.go(0)
              }else{
                this.util.error(res.errorMsg)
              }
              
          });
          // let params=[];
          // params.push(this.form);
          // this.util.restPost('/api_v1/modules/real/labor_contract', params, (res) => {
          //   if(res.status==200){
          //     this.getLabourData();
          //     this.dialogFormVisible=false;
          //   }
          // })
        }else{
          this.util.restPost('/api_v1/modules/real/entry_exit_his?ids='+this.ids+'&entryExitFlag='+this.form.entryExitFlag+'&entryExitTime='+new Date(this.form.entryExitTime).format('yyyy-MM-dd'), null, (res) => {
            if(res.status==200){
              this.getLabourData();
              this.dialogFormVisible=false;
              this.util.successToast('设置成功');
            }else{
              this.util.error(res.errorMsg);
            }
          })
        }

      },
      delData(id){
        this.util.restDelete('/api_v1/modules/real/labor_contract/'+id, null, (res) => {
          if(res.status==200){
            this.util.successToast('删除成功');
            this.getLabourData();
          }
        })
      },
      getSingleData(id){   //编辑查询接口
        this.util.restGet('/api_v1/modules/real/labor_contract/'+id, null, (res) => {
          console.debug("labor_contract==",res);
          // if(res.status==200){
          //   this.form=res.data;
          // }
        })
      },
      handleSelectionChange(val){
        this.tablearr=val;
        this.ids='';
        for(let i=0;i<val.length;i++){
          this.ids+=val[i].id+',';
        }
        this.ids=this.ids.slice(0,this.ids.length-1);
        console.log(this.ids)
      },
      changeType(num){
        if(this.teamUid==''||this.teamUid==undefined){
          this.util.failueToast('请选择班组')
          return false
        }
        this.createType=num;
        if(num==0){
          this.entryExitFlag=1;
          this.getLabourData();
        }else{
          this.entryExitFlag=2;
          this.getLabourData();
        }
      },
      handleSizeChange(value){
        // console.log(value)
      },
      handleCurrentChange(value){
        console.log(value)
        this.pageIndex=value;
        this.loadTeamData()
      },
      handleCurrentChange0(val){
        this.pageIndex1=val;
        this.getLabourData();
      },
      handleCurrentclick(val){
        this.teamUid=val.id;
        this.getLabourData();
      },
      remove(index,item){
        console.log(index);
        console.log(item);
      },
      removedel(index,item){
        if(item[index].id!=''||item[index].id!=undefined){
          let id=item[index].id;
          this.delall(id)
        }else{
          this.util.failueToast('没有劳动合同信息');
        }
      },
      delall(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delData(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      openFrom(){
        console.log(this.entryExitFlag)
        if(this.teamUid==''||this.teamUid==undefined){
          this.util.failueToast('请选择班组');
          return false
        }
        if(this.tablearr.length==0){
          this.util.failueToast('请选择需要生成的项');
          return false
        }
       
        this.form={}
        this.isType='add';
        this.dialogFormVisible=true;
      },
      close(){
        this.dialogFormVisible=false;
      },
      btnsbu(){
        this.EditSaveData()
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
  .approach .el-dialog{
    width:360px;
  }
</style>
