<template>
  <div class="CreditRecord" style="height:100%;padding-bottom: 70px;box-sizing: border-box">
    <div class="tabs-boxs">
      <div class="tabs">
        <div class="tabs" style="border:none;width:70%;float:left;">
          <span @click="changeType(0)" :class="{active:createType==0}" >不良记录</span>
          <span @click="changeType(1)" :class="{active:createType==1}" >黑名单</span>
        </div>
        <div class="tabs_right">
          <button @click="addCred"  v-if="sessionUtil.isAllowBtn('gc7_7:btn_add')">添加</button>
          <!--<button>导出</button>-->
        </div>
      </div>
    </div>
    <div class="table" style="height:100%;box-sizing: border-box" ref="tablebox">
      <el-table :data="tableData"  :height="tableHeightNum"  highlight-current-row class="highlight-current-row" @cell-click="handleCurrentclick" border style="width: 100%">
        <el-table-column  label="操作" width="80" v-if="sessionUtil.isAllowBtn('gc7_7:btn_edit')||sessionUtil.isAllowBtn('gc7_7:btn_delete')">
        <template slot-scope="scope" class="operation">
          <span @click.stop="edit(scope.$index, tableData)" v-if="sessionUtil.isAllowBtn('gc7_7:btn_edit')"><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
          <span @click.stop="removedel(scope.$index, tableData)" v-if="sessionUtil.isAllowBtn('gc7_7:btn_delete')"><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span>
        </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名">
        </el-table-column>
        <el-table-column prop="cellphone" label="手机号码">
        </el-table-column>
        <el-table-column prop="idcardNumber" label="身份证号码">
        </el-table-column>
        <el-table-column prop="workTypeCode" label="工种">
        </el-table-column>
        <el-table-column prop="creditDate" label="征信日期">
        </el-table-column>
        <el-table-column prop="blacklistReasons" label="征信记录">
        </el-table-column>
      </el-table>
      <div style="text-align: right">
        <el-pagination
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-size="pageSize"
          layout="prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog title="征信记录" class="credit" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-row>
          <el-col :span="24">
            <el-form-item label="类型" :label-width="formLabelWidth">
              <div style="display: flex;">
                <div  @click="changeradio('1')"><input v-model="form.creditType" name="radio" type="radio" value="1"/><label>不良记录</label></div>
                <div @click="changeradio('2')"><input  v-model="form.creditType" name="radio" type="radio"  value="2"/><label>黑名单</label></div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" :label-width="formLabelWidth">
              <el-input  v-model="form.name" disabled="disabled" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身份证号" :label-width="formLabelWidth">
              <el-input  v-model="form.idcardNumber" disabled="disabled" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="日期" :label-width="formLabelWidth">
              <el-input  v-model="form.creditDate" disabled="disabled" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="记录人" :label-width="formLabelWidth">
              <el-input  v-model="form.noteTaker" disabled="disabled" autocomplete="off"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="黑名单原因" :label-width="formLabelWidth">
              <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="form.blacklistReasons"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="btnsub">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        createType:0,
        dialogFormVisible:false,
        formLabelWidth:'80px',
        form:{},
        tableData:[],
        creditType:1,
        currentPage:1,
        pageSize:10,
        pageIndex:1,
        total:0,
        listData:{},
        tableHeightNum:0,
        createNow:''
      }
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.getCreditRecordData();
    },
    mounted () {
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
      })
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.getCreditRecordData();
      }
    },
    methods:{
      changeradio(num){
        this.form.creditType=num;
        this.$forceUpdate();
      },
      getCreditRecordData(){
        let params={
          projUid:this.$store.state.selectProjectObj.id,
          creditType:this.creditType,
          pageIndex:this.pageIndex,
          pageSize:this.pageSize
        };
        this.util.restGet('/api_v1/modules/credit_recode',params,res=>{
          if(res.status==200){
            if(res.data!=undefined||res.data!=''){
              this.tableData=res.data;
              this.total=res.totalCount;
            }else{
              this.tableData=[];
            }
          }else{
            this.util.error(res.errorMsg);
          }
        })
      },
      edit(index,arr){
        if(arr[index].creditRecordUid==undefined||arr[index].creditRecordUid==''){
          this.util.failueToast('没有征信记录不能编辑');
          return false;
        }
        this.createNow='edit'
        this.dialogFormVisible=true;
        let id=arr[index].creditRecordUid;
        this.form.name=arr[index].name;
        this.form.idcardNumber=arr[index].idcardNumber;
        this.editfun(id)
      },
      editfun(id){
        this.util.restGet('/api_v1/modules/credit_recode/'+id,null,res=>{
          if(res.status==200){
            console.log(res)
            this.form.workerUid=res.data.workerUid;
            this.form.noteTaker=res.data.noteTaker;
            this.form.creditDate=res.data.creditDate;
            this.form.creditType=res.data.creditType;
            this.form.blacklistReasons=res.data.blacklistReasons;
            this.form.id=res.data.id;
            this.$forceUpdate();
          }
        })
      },
      removedel(index,arr){
        if(arr[index].creditRecordUid==undefined||arr[index].creditRecordUid==''){
          this.util.failueToast('没有征信记录不能删除');
          return false;
        }
        let id=arr[index].creditRecordUid;
        this.open2(id);
      },
      removefun(id){
        this.util.restDelete('/api_v1/modules/credit_recode/'+id,null,res=>{
          if(res.status==200){
            this.util.successToast('删除成功');
            this.getCreditRecordData();
          }
        })
      },
      btnsub(){
        if(this.form.creditType==''||this.form.creditType==undefined){
          this.util.failueToast('请选择征信类型');
          return false
        }
        if(this.form.blacklistReasons==''||this.form.blacklistReasons==undefined){
          this.util.failueToast('请填写黑名单原因');
          return false
        }
        if(this.createNow!='edit'){
          this.form.projUid=this.$store.state.selectProjectObj.id;
          this.util.restPost('/api_v1/modules/credit_recode',this.form,res=>{
            if(res.status==200){
              this.getCreditRecordData();
              this.util.successToast('新增成功');
              this.dialogFormVisible=false;
            }else{
              this.util.error(res.errorMsg)
            }
          })
        }else{
          this.form.projUid=this.$store.state.selectProjectObj.id;
          this.util.restPut('/api_v1/modules/credit_recode/'+this.form.id,this.form,res=>{
            if(res.status==200){
              this.getCreditRecordData();
              this.util.successToast('编辑成功');
              this.dialogFormVisible=false;
            }else{
              this.util.error(res.errorMsg)
            }
          })
        }

      },
      handleCurrentclick(val){
        console.log(val)
        this.listData=val;
      },
      changeType(num){
        this.createType=num;
        if(this.createType==0){
          this.creditType=1;
          this.getCreditRecordData();
        }else{
          this.creditType=2;
          this.getCreditRecordData();
        }
      },
      handleCurrentChange(val){
        this.pageIndex=val;
        this.getCreditRecordData();
      },
      addCred(){
        if(JSON.stringify(this.listData)=='{}'){
          this.util.failueToast('请选择添加的项');
          return false;
        }
        this.createNow='';
        this.form={};
        this.dialogFormVisible=true;
        console.log(this.listData)
        this.form.name=this.listData.name;
        this.form.idcardNumber=this.listData.idcardNumber;
        this.form.workerUid=this.listData.workerUid;
        this.form.noteTaker=this.sessionUtil.getUserName();
        this.form.creditDate=new Date().format('yyyy-MM-dd');
        this.$forceUpdate();
      },
      open2(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.removefun(id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    }
  }
</script>

<style scoped>
  .tabs-boxs{
    box-sizing: border-box;
    width:100%;
  }
  .table{
    /*height: 100%;*/
    /*position: absolute;*/
    /*box-sizing: border-box;*/
    padding-top: 10px;
    /*width:100%;*/
  }
  .tabs{
    height: 36px;
    border: 1px solid #44D2FF ;
    box-sizing: border-box;
    padding: 0 10px;
    text-align: center;
  }
  .tabs>span{
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
  .tabs>.active{
    background: url(../../assets/indexImg/select.png) no-repeat  top center;
  }
  .active{
    background: url(../../assets/indexImg/select.png) no-repeat  top center;
  }
  .tabs_right{
    float:right;
    padding-top:5px;
  }
  .add-part{
    width:700px;
  }
</style>
<style>
  .CreditRecord .el-table--border td:first-child .cell,.CreditRecord .el-table--border th:first-child .cell,.CreditRecord .el-table .cell,.CreditRecord .el-table th div{
    text-align: center !important;
  }
  .CreditRecord .el-table--border td:first-child .cell,.CreditRecord .el-table--border th:first-child .cell,.CreditRecord .el-table .cell,.CreditRecord .el-table th div{
    text-align: center !important;
  }
  .credit .el-dialog{
    width:720px;
  }
  .credit .el-input{
    border:1px solid rgba(212,212,212,1) !important;
    width:250px;
  }
  .credit  .el-input__inner{
    color:#000 !important;
  }
  .credit .el-form-item__content{
    text-align: left;
  }
  .credit .el-textarea__inner{
    width:593px;
    border:1px solid rgba(212,212,212,1);
  }
  .credit .el-form-item__label{
    text-align: left !important;
  }
  .credit .el-input.is-disabled .el-input__inner{
    height:40px !important;
  }
</style>
