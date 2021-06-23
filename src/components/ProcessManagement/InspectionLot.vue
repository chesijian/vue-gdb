<template>
  <div class="ProcessTask">
    <div class="ProcessTask_head ">
      <div class="parcess_head">
        <div class="item_head"><h4 style="margin-bottom: 0;">查询</h4></div>
        <div class="item_head" style="position: relative">
          <span>区域</span>
          <span @click="selectShow" style="text-align: left;line-height: 26px;display: inline-block;width:120px;height:26px;background-color: rgba(255,255,255,.1);color:#ccc;">
            {{searchName}}  <i style="position: absolute;right: 5px;top: 7px;" v-if="createIsShow" class="el-icon-arrow-up"></i>
            <i style="position: absolute;right: 5px;top: 7px;" v-if="!createIsShow" class="el-icon-arrow-down"></i>
          </span>
          <div :class="{selcetData:createIsShow==false}" style="color:#000;z-index: 999;overflow: auto;position: absolute;top:26px;left:27px;width:250px;height:250px;text-align: left;background-color: #fff;">
            <div @click="closeShow" style="text-align: right">全部</div>
            <asideItems v-for="(item, index) in models"  :key="index" :models="item" :level="0" ></asideItems>
          </div>
        </div>
        <div class="item_head">
          <button @click="getInspectionData">搜索</button>
        </div>
        <div style="margin-left: auto;">
          <button @click="addInspection" v-if="sessionUtil.isAllowAdd('t_InspectProcedure_Batch')">添加检验批</button>
          <button @click="deleteAll" v-if="sessionUtil.isAllowDelete('t_InspectProcedure_Batch')">删除</button>
        </div>
      </div>
      <div  style="height:100%;" ref="tablebox">
        <el-table :data="tableData" :height="tableHeightNum" @selection-change="handleSelectionChange" border >
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column  label="操作" width="80" v-if="sessionUtil.isAllowEdit('t_InspectProcedure_Batch')||sessionUtil.isAllowDelete('t_InspectProcedure_Batch')">
            <template slot-scope="scope" class="operation">
              <span @click="editdata(scope.$index,tableData)" v-if="sessionUtil.isAllowEdit('t_InspectProcedure_Batch')"><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
              <span @click="deletedata(scope.$index,tableData)" v-if="sessionUtil.isAllowDelete('t_InspectProcedure_Batch')"><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="编号" >
          </el-table-column>
          <el-table-column prop="name" width="250" label="检验批名称" >
          </el-table-column>
          <el-table-column prop="areaFullName" label="区域">
          </el-table-column>
          <el-table-column prop="remark" label="说明">
          </el-table-column>
          <el-table-column prop="processCount" label="对应工序数">
          </el-table-column>
          <el-table-column prop="taskCount" label="对应任务数">
          </el-table-column>
          <el-table-column prop="issueAndRecordCount" label="问题及记录数">
          </el-table-column>
        </el-table>
        <div style="text-align: right;">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            layout=" prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
      </div>

      <div class="add-part-box" v-if="importVisable" >
        <div class="add-part" style="height: 90%;width:600px;overflow: hidden;padding-bottom:220px;box-sizing:border-box;">
          <div style="margin-bottom: 10px;">
            <p style="margin-bottom: 10px;">生成检验批</p>
            <div style="display: flex;margin-bottom: 10px;">
              <div style="line-height: 38px;margin-right: 10px;">检验批生成原则</div>
              <div style="margin-right: 10px;">
                <el-select class="item_date" v-model="value" placeholder="请选择">
                  <el-option  label="区域" value="区域"></el-option>
                </el-select>
              </div>
              <div>
                <el-input class="item_content" v-model="input" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <div style="display: flex;margin-bottom: 10px;">
              <div style="line-height: 38px;margin-right: 70px;">说明</div>
              <div style="width:405px;">
                <el-input class="item_content" v-model="remark" placeholder="请输入内容"></el-input>
              </div>
            </div>
            <p style="font-size: 12px;">
              检验批名字示例：区域 检验批&#91自定义名称] 如：地下室>负一层>一区 检验批&#91墙、柱]；地下室>负一层>一区 检验批 注意：每次一个区域生成一个检验批；为了单次快速生成检验批，一次可批量勾选20个或以内的区域生成检验批。
            </p>
          </div>
          <p >区域</p>
          <div style="height:100%;overflow: auto">
            <div>
              <selectTree v-for="(item, index) in tempCheckItem"  :key="index" :models="item" :level="0" ></selectTree>
            </div>
            <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
              <button style="margin-right:20px;" @click="importVisable=false">关闭</button>
              <button @click="saveImportData()">保存</button>
            </div>
          </div>
        </div>
      </div>

      <el-dialog title="编辑检验批" class="parcess_model" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="编号" :label-width="formLabelWidth">
            <el-input v-model="form.CODE_" disabled="disabled" class="item_content" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="区域" :label-width="formLabelWidth">
            <el-input v-model="form.AREA_FULL_NAME_" disabled="disabled"  class="item_content" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="检验批名称" :label-width="formLabelWidth">
            <el-input v-model="form.NAME_" class="item_content" placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="说明" :label-width="formLabelWidth">
            <el-input v-model="form.REMARK_" class="item_content" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editsave">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import selectTree from '@/components/common/selectRegion.vue'
  import asideItems from '@/components/common/asideItem.vue'
  export default {
    data(){
      return{
        status:'',
        tableData:[],
        deviceArr:[],
        tableHeightNum:0,
        currentPage:1,
        pageSize:10,
        pageIndex:1,
        total:0,
        formLabelWidth:'100px',
        form:{},
        dialogFormVisible:false,
        importVisable:false,
        tempCheckItem:[],
        value:'区域',
        input:'',
        arr:[],
        arrs:[],
        arrs1:[],
        search:'',
        remark:'',
        models:[],
        createIsShow:false,
        searchName:'请选择',
        editid:'',
        idsid:'',
        idsidAll:'',
        sult:''
      }
    },
    created(){
      this.$bus.on("selectNode",this.selectNodeCallback);
      // this.$bus.on("loadChildren",this.addList);
      this.$bus.on('handelDeparts', this.handelDeparts);
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.addList();
      this.getInspectionData();
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.getInspectionData();
      }
    },
    mounted(){
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
      })
    },
    beforeDestroy(){
      this.$bus.off('selectNode', this.selectNodeCallback);
      this.$bus.off('handelDeparts', this.handelDeparts);
      // this.$bus.off('loadChildren', this.addList);
    },
    methods:{
      deleteAll(){
        if(this.idsidAll==''||this.idsidAll==undefined){
          this.util.failueToast('请选择要删除的项');
          return false;
        }
        this.delAll();
      },
      delAllfun(){
        this.util.restDelete('/api_v1/business/process/checkout/ids?ids='+this.idsidAll,null,res=>{
          if(res.status==200){
            this.util.successToast('删除成功');
            this.getInspectionData();
          }
        })
      },
      delAll(){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delAllfun();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      handleSelectionChange(val){
        this.idsidAll=''
        for(let i=0;i<val.length;i++){
          this.idsidAll+=val[i].id+','
        }
        this.idsidAll=this.idsidAll.slice(0,this.idsidAll.length-1);
      },
      deletedata(index,arr){
        this.idsid=arr[index].id;
        this.delType()
      },
      delfun(){
        this.util.restDelete('/api_v1/business/process/checkout/ids?ids='+this.idsid,null,res=>{
          if(res.status==200){
            this.util.successToast('删除成功');
            this.getInspectionData();
          }
        })
      },
      delType(){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delfun();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      editdata(index,arr){
        // this.form={};
        let id=arr[index].id
        this.editdatafun(id)
      },
      editdatafun(id){
        this.util.restGet('/api_v1/business/process/checkout/'+id+'?id='+id,null,res=>{
          if(res.status==200){
            this.form={
              NAME_:res.data.name,
              AREA_FULL_NAME_:res.data.areaFullName,
              CODE_:res.data.code,
              REMARK_:res.data.remark,
            };
            // this.form.NAME_=res.data.name;
            // this.form.AREA_FULL_NAME_=res.data.areaFullName;
            // this.form.CODE_=res.data.code;
            // this.form.REMARK_=res.data.remark;
            this.editid=res.data.id;
            this.dialogFormVisible=true;
          }
        })
      },
      editsave(){
        this.form.projUid=this.$store.state.selectProjectObj.id;
        var params = {mainFormData:JSON.stringify(this.form),sqlTableName:"T_PROCESS_CHECKOUT",ifSaveWorkflow:false};
          params['id']=this.editid;
          params['businessKey']=this.editid;
        this.util.restPost("/api_v1/form/business",params,(res)=>{
          if(res.status==200){
            this.util.success('保存成功');
            this.getInspectionData();
            this.dialogFormVisible=false;
          }else{
            this.util.error(res.errorMsg);
          }
        });
      },
      closeShow(){
        this.createIsShow=false;
        this.search='';
        this.searchName='全部';
        this.getInspectionData()
      },
      selectShow(){
        this.createIsShow=!this.createIsShow;
      },
      addInspection(){
        this.value='';
        this.input='';
        this.remark='';
        this.arr=[];
        this.addList();
        this.importVisable=true
      },
      handelDepartsloop(data){
        this.sult+=data.label+'>'
        if(data.parents){
          this.handelDepartsloop(data.parents)
        }
      },
      handelDepartschange(){
        this.sult=this.sult.slice(0,this.sult.length-1);
        let arr=this.sult.split('>');
        let arr1=[];
        // console.log(arr)
        for(let i=0;i<arr.length;i++){
          arr1.unshift(arr[i])
        }
        let str1=arr1.join('>')
        return str1
      },
      handelDeparts(data){
        console.log(data)
        this.sult='';
        this.handelDepartsloop(data);
        let str=this.handelDepartschange();
        this.searchName=str;
        this.search=data.id;
        this.createIsShow=false;
        this.getInspectionData();
      },
      selectCheckNode(data,dataid){
        var arr=[]
        function selectCheckNodeLoop(data) {
          arr.push(data)
          if(data.parents){
            // data.parents.selected=true
            selectCheckNodeLoop(data.parents)
          }else{
            return;
          }
        }
        selectCheckNodeLoop(data)

        var str=''
        for( let i = 0;i<arr.length;i++){
          str+=arr[i].label+'>';
        }
        if(data.selected){
          let obj={};
          obj.name=str;
          obj.partUid=dataid;
          this.arr.push(obj)
        }else{
          this.arr=this.arr.filter((item)=>{
            return item.name!=str;
          })
        }
      },
      selectNodeCallback(data){
        this.selectCheckNode(data,data.id);
      },
      addList(data){
        this.util.restGet('/api_v1/construction/inspect/partTree',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
          if(res.status==200&&res.data!=undefined){
            this.tempCheckItem=res.data;
            this.models=res.data;
          }else{
            this.tempCheckItem=[];
            this.models=[];
          }

        });
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
      getInspectionData(){
        let params={
          projUid:this.$store.state.selectProjectObj.id,
          pageIndex:this.pageIndex,
          pageSize:this.pageSize,
          search:this.search
        }
        this.util.restGet('/api_v1/business/process/searchProcessCheckout',params,res=>{
          if(res.status==200){
            if(res.data!=undefined){
              this.tableData=res.data;
              this.total=res.totalCount;
            }else{
              this.tableData=[]
            }
          }else{
            this.util.error(res.errorMsg)
          }
        })
      },
        saveImportData(){
        this.arrs1=[];
        // let sss=this.deepCopy(this.arr)
        this.arrs=this.arr
       let mainData={};
       let str='';
       for(let i=0;i<this.arrs.length;i++){
         let obj={};
         let str3='';
         let str1='';
         str1=this.arrs[i].name;
         str1=str1.slice(0,str1.length-1);
         let Arr=[];
         Arr=str1.split('>');
         let Arr2=[];
         for(let i=Arr.length;i>-1;i--){
           Arr2.push(Arr[i])
         }
         str3=Arr2.join('>');
         str3=str3.slice(1,str3.length);

         obj.areaFullName=str3;
         obj.partUid=this.arrs[i].partUid;
         obj.name=str3+'>'+this.input;
         obj.remark=this.remark;
         obj.projUid=this.$store.state.selectProjectObj.id;
         this.arrs1.push(obj)
       }
       this.util.mask("正在保存..");
        this.util.restPost('/api_v1/business/process/save', {processcheck:this.arrs1}, (res)=> {
          this.util.unmask();
          if(res.status==200){
            this.util.successToast('新增成功');
            this.getInspectionData();
            this.importVisable=false;
          }
        });
      },
      handleSizeChange(val){
        console.log(val);
      },
      handleCurrentChange(val){
        this.pageIndex=val;
        this.getInspectionData();
      },
    },
    components:{
      selectTree,asideItems
    }
  }
</script>

<style scoped>
  .selcetData{
    display: none;
    transition: all 0.5s;
  }
  .ProcessTask{
    width:100%;
    height:100%;
    box-sizing: border-box;
    color:#fff;
    font-size: 12px;
  }
  .ProcessTask_head{
    width:100%;
    height:100%;
    padding-bottom: 100px;
    box-sizing: border-box;
  }
  .parcess_head{
    width:100%;
    padding:13px 14px;
    border:1px solid rgba(68,210,255,1);
    box-sizing: border-box;
    display: flex;
    margin-bottom: 10px;
  }
  .parcess_head .item_head{
    margin-right: 20px;
  }
</style>

<style>
  .parcess_head .el-select{
    background-color: rgba(255,255,255,0.2);
    width:130px;
  }
  .parcess_head .el-input--mini .el-input__inner{
    height:26px;
  }
  .parcess_model .el-dialog{
    width:375px;
  }
  .parcess_model .el-date-editor.el-input{
    width:100%;
  }
</style>
