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
              <!--<el-table-column  label="操作">-->
                <!--<template slot-scope="scope" class="operation">-->
                  <!--<span><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>-->
                  <!--<span @click.stop="remove(scope.$index, tableData)"><img src="../../assets/indexImg/del.png" alt=""></span>-->
                <!--</template>-->
              <!--</el-table-column>-->
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
                  <span @click="changeType(0)" :class="{active:createType==0}">全部</span>
                  <span @click="changeType(1)" :class="{active:createType==1}">进场</span>
                  <span @click="changeType(2)" :class="{active:createType==2}">退场</span>
                </div>
                <div class="context_text_head_right">
                  <button @click="openFrom" v-if="sessionUtil.isAllowBtn('gc7_3:btn_batch')">批量生成</button>
                </div>
              </div>
            </div>
          <div >
            <div class="worktable" ref="tablebox1" style="width: 100%;height: 100%;box-sizing: border-box;">
              <el-table :data="workList" :height="tableHeightNum" class="highlight-current-row" border style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column  label="操作" width="80" v-if="sessionUtil.isAllowBtn('gc7_3:btn_delete')||sessionUtil.isAllowBtn('gc7_3:btn_edit')">
                  <template slot-scope="scope" class="operation">
                    <span @click.stop="edit(scope.$index, workList)" v-if="sessionUtil.isAllowBtn('gc7_3:btn_edit')"><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
                    <span @click.stop="removedel(scope.$index, workList)" v-if="sessionUtil.isAllowBtn('gc7_3:btn_delete')"><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span>
                  </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名">
                </el-table-column>
                <el-table-column prop="cellphone" width="110" label="手机号码">
                </el-table-column>
                <el-table-column prop="birthPlaceCode" width="180" label="身份证号码" >
                </el-table-column>
                <el-table-column prop="workTypeCode" label="工种">
                </el-table-column>
                <el-table-column prop="code" width="150" label="合同编号">
                </el-table-column>
                <el-table-column prop="term" label="合同期限">
                </el-table-column>
                <el-table-column prop="startTime" width="100" label="开始日期">
                </el-table-column>
                <el-table-column prop="endTime" width="100" label="结束日期">
                </el-table-column>
                <el-table-column prop="salaryMethod" label="计薪方式">
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

    <el-dialog title="劳动合同信息" class="piliang" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-row :gutter="20">
          <el-col :span="12" v-if="form.id!=undefined">
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input v-model="form.name"  placeholder="请输入姓名" class="item_content" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同编号" :label-width="formLabelWidth">
              <el-input v-model="form.code"  placeholder="请输入合同编号" class="item_content" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="合同类型" :label-width="formLabelWidth">
              <el-select v-model="form.type" class="item_date" placeholder="请选择合同类型">
                <el-option label="固定期限合同" value="1"></el-option>
                <el-option label="以完成一定工作为期限的" value="2"></el-option>
              </el-select>
            </el-form-item>
            <span class="required">*</span>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生效日期" :label-width="formLabelWidth">
              <el-date-picker v-model="form.startTime" class="item_date" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="失效日期" :label-width="formLabelWidth">
              <el-date-picker v-model="form.endTime" class="item_date" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计薪方式" :label-width="formLabelWidth">
              <el-select v-model="form.salaryMethod" class="item_date" placeholder="请选择计薪方式">
                <el-option label="按日" value="1"></el-option>
                <el-option label="按月" value="2"></el-option>
              </el-select>
            </el-form-item>
            <span class="required">*</span>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单位" :label-width="formLabelWidth">
              <el-select v-model="form.unitOfMeasurement" class="item_date" placeholder="请选择计量单位">
                <el-option label="工日" value="1"></el-option>
              </el-select>
            </el-form-item>
            <span class="required">*</span>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计量单价" :label-width="formLabelWidth">
              <el-input class="item_content" type="number" v-model="form.unitPriceOfMeasurement" ></el-input>
            </el-form-item>
            <span class="required">*</span>
          </el-col>
          <el-col :span="24" v-show="form.id!=undefined">
            <el-form-item label="上传图片" :label-width="formLabelWidth">
              <uploading ref="seeLoadFile" :config="uploadConfig"></uploading>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
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
        selectTime:'',
        tableData:[],
        workList:[],
        createType:0,
        currentPage:1,
        currentPage1:1,
        dialogFormVisible:false,
        formLabelWidth:'120px',
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
        entryExitFlag:'',
        tablearr:[],
        uploadConfig: {
          limit: 2,//限制附件上传个数
          limitSize: 52428800,//50mb单个附件上传大小
          readOnly: false,//是否只读
          multiple: false,//是否允许多选
          xtype: 'laborContract',//同一个表单区别多个附件上传块
          accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP',//允许上传文件类型
          acceptMsg: '只能传图片',//提示信息
        },
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
      getLabourData(){
        var params = {
          pageSize: this.pageSize1,
          pageIndex: this.pageIndex1,
          entryExitFlag:this.entryExitFlag,
          projUid: this.$store.state.selectProjectObj.id,
          teamUid:this.teamUid
        }
        this.util.restGet('/api_v1/modules/real/labor_contract', params, (res) => {
          if(res.status==200){
            if(res.data!=undefined){
              for(let i=0;i<res.data.length;i++){
                if(res.data[i].startTime&&res.data[i].endTime){
                  let start=new Date(res.data[i].startTime).getTime()
                  let end=new Date(res.data[i].endTime).getTime()
                  res.data[i].term=(Number.parseInt(end)-Number.parseInt(start))/1000/60/60/24
                }
                if(res.data[i].salaryMethod){
                  if(res.data[i].salaryMethod==1){
                    res.data[i].salaryMethod='按日'
                  }else{
                    res.data[i].salaryMethod='按月'
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
        console.debug("index====="+index);
      	console.log('item',item)
        this.isType='';
        if(item[index].id!=undefined){
          let id=item[index].id;
          let name=item[index].name;
          this.getSingleData(id,name)
        }else{
          this.isType='add';
          this.form={
            id:"",
            name:item[index].name,
            workerUid:item[index].workerUid
          }
          this.tablearr = [item[index]];
          console.debug("this.tablearr====",this.tablearr);

        }
       this.dialogFormVisible=true;
      },
      EditSaveData(){
        if(this.isType!='add'){//编辑
          if(this.form.startTime){
            this.form.startTime=new Date(this.form.startTime).format('yyyy-MM-dd');
          }else{
            this.form.startTime=''
          }
          if(this.form.endTime){
            this.form.endTime=new Date(this.form.endTime).format('yyyy-MM-dd');
          }else{
            this.form.endTime=''
          }
          var mainData={
            START_TIME_:this.form.startTime,
            END_TIME_:this.form.endTime,
            SALARY_METHOD_:this.form.salaryMethod,
            TYPE_:this.form.type,
            CODE_:this.form.code,
            UNIT_OF_MEASUREMENT_:this.form.unitOfMeasurement,
            UNIT_PRICE_OF_MEASUREMENT_:this.form.unitPriceOfMeasurement,
          }
          //遍历附件
          
          var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"R_LABOR_CONTRACT",filesData: JSON.stringify(this.uploadConfig.filesList),ifSaveWorkflow:false};
          params['id']=this.form.id;
          params['businessKey']=this.form.id;
          this.util.mask("正在保存..");
          this.util.restPost("/api_v1/form/business",params,(res)=>{
             this.util.unmask();
              if(res.status==200){
                this.util.success('保存成功');
                this.getLabourData();
                this.dialogFormVisible=false;
              }else{
                this.util.error(res.errorMsg)
              }
              
          });

          // let params=[];
          // this.util.restPost('/api_v1/modules/real/labor_contract', params, (res) => {
          //   if(res.status==200){
          //     this.getLabourData();
          //     this.dialogFormVisible=false;
          //   }
          // })
        }else{
        var params=[];
          for(let i=0;i<this.tablearr.length;i++){
            let obj={};
            if(this.tablearr[i].id!=undefined||this.tablearr[i].id!=''){
              obj.id=this.tablearr[i].id;
            }else{
              obj.id='';
            }
            obj.code=this.form.code
            obj.salaryMethod=this.form.salaryMethod
            obj.type=this.form.type
            obj.unitOfMeasurement=this.form.unitOfMeasurement
            obj.unitPriceOfMeasurement=this.form.unitPriceOfMeasurement
            if(this.form.startTime){
              obj.startTime=new Date(this.form.startTime).format('yyyy-MM-dd');
            }else{
              // obj.startTime=''
            }
            if(this.form.endTime){
              obj.endTime=new Date(this.form.endTime).format('yyyy-MM-dd');
            }else{
              // obj.endTime=''
            }
            obj.workerUid=this.tablearr[i].workerUid;
            obj.teamUid=this.teamUid;
            obj.projUid=this.$store.state.selectProjectObj.id;
            params.push(obj)
          }
          this.util.restPost('/api_v1/modules/real/labor_contract', params, (res) => {
            if(res.status==200){
              this.getLabourData();
              this.util.success('生成成功')
              this.dialogFormVisible=false;
            }
          })
        }

      },
      deepCopy(obj) {
          var result = Array.isArray(obj) ? [] : {};
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              if (typeof obj[key] === 'object') {
                result[key] = deepCopy(obj[key]);   //递归复制
              } else {
                result[key] = obj[key];
              }
            }
          }
          return result;
      },
      delData(id){
        this.util.restDelete('/api_v1/modules/real/labor_contract/'+id, null, (res) => {
          if(res.status==200){
            this.util.successToast('删除成功');
            this.getLabourData();
          }
        })
      },
      getSingleData(id,name){   //编辑查询接口
        this.util.restGet('/api_v1/modules/real/labor_contract/'+id, null, (res) => {
          console.debug("labor_contract==",res);
          if(res.status==200){
            this.form=res.data;
            this.form.name=name;
          }
        })
      },
      handleSelectionChange(val){
        console.log(val)
        this.tablearr=val;
      },
      changeType(num){
        if(this.teamUid==''||this.teamUid==undefined){
          this.util.failueToast('请选择班组')
          return false
        }
        this.createType=num;
        if(num==1){
          this.entryExitFlag=1;
          this.getLabourData();
        }else if(num==2){
          this.entryExitFlag=2;
          this.getLabourData();
        }else{
          this.entryExitFlag='';
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
        this.teamUid=val.id
        this.getLabourData();
      },
      remove(index,item){
        console.log(item);
      },
      removedel(index,item){
        if(item[index].id==''||item[index].id==undefined){
          this.util.failueToast('没有劳动合同信息');
          return false;
        }else{
          let id=item[index].id;
          this.delall(id)
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
        if(this.teamUid==''||this.teamUid==undefined){
          this.util.failueToast('请选择班组')
          return false
        }
        if(this.tablearr.length==0){
          this.util.failueToast('请选择需要生成的项')
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
        if(!this.form.type) {
          this.util.error('请选择合同类型')
          return false
        }
        if(!this.form.salaryMethod) {
          this.util.error('请选择计薪方式')
          return false
        }
        if(!this.form.unitOfMeasurement) {
          this.util.error('请选择计量单位')
          return false
        }
        if(!this.form.unitPriceOfMeasurement) {
          this.util.error('请输入计量单价')
          return false
        }
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
  .el-form-item {
    width: 95%;
  }
  .el-col-12 {
    display: flex;
    align-items: flex-start;
  }
  .required {
    line-height: 40px;
    margin-left: 10px;
  }
</style>

<style>
/*.piliang .el-input{*/
  /*border:1px solid rgba(212,212,212,1);*/
/*}*/
  /*.piliang .el-input__inner{*/
    /*color:rgba(51,51,51,1) !important;*/
  /*}*/
  .piliang .el-date-editor.el-input{
    width:100%;
  }
  /*.piliang .el-select .el-input .el-select__caret.el-input__icon{*/
    /*color:#000;*/
  /*}*/
.LaborContract .el-dialog{
width:900px ;
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

</style>
