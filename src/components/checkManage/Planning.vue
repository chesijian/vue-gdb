<template>
  <div class="ProcessTask">
    <div class="ProcessTask_head ">
      <div class="parcess_head">
        <!-- <div class="item_head"><h4 style="margin-bottom: 0;">查询</h4></div> -->
        <div class="item_head">
          <el-tag @click="dataType=2" :effect="dataType==2? 'dark':'plain'">已发布</el-tag>
          <el-tag @click="dataType=1" :effect="dataType==1? 'dark':'plain'">未发布</el-tag>
          <el-tag @click="dataType=0" :effect="dataType==0? 'dark':'plain'">全部</el-tag>
          <!-- <span>检查状况</span>
          <span>
            <el-select v-model="examineStatus"  placeholder="请选择" size="mini" class="select-ele">
              <el-option label="检查未开始" value="0"></el-option>
              <el-option label="检查中" value="1"></el-option>
              <el-option label="检查完成" value="2"></el-option>
            </el-select>
          </span> -->
        </div>
        <div class="item_head">
          <span>计划状态</span>
          <span>
            <el-select v-model="constructionStatus"  placeholder="请选择" size="mini" class="select-ele">
              <el-option label="施工未开始" value="0"></el-option>
              <el-option label="施工中" value="1"></el-option>
              <el-option label="报验" value="2"></el-option>
              <el-option label="待检验" value="3"></el-option>
              <el-option label="已完成" value="4"></el-option>
              <el-option label="需返工" value="5"></el-option>
            </el-select>
          </span>
        </div>
        
        <div class="item_head">
          <span>计划类型</span>
          <span>
            <el-select v-model="principalUid"  placeholder="请选择" size="mini" class="select-ele">
                <el-option v-for="(item,index) in cities" :key="item.value" :label="item.label" :value="item.id">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
            </el-select>
          </span>
          
        </div>
        <div style="float:left"  class="search-box">
            <input type="text" v-model="searchValue" @keyup.enter="loadData()">
            <i></i>
            <button @click="loadData">搜索</button>
        </div>
        <!-- <div class="item_head">
          <button @click="searchfun">搜索</button>
        </div> -->

        <div style="margin-left: auto;">
          <button @click="generate"  v-if="sessionUtil.isAllowBtn('gc3_3:btn_create')">新增周计划</button>
          <button @click="BatchRelease"  v-if="sessionUtil.isAllowBtn('gc3_3:btn_assign')">新增月计划</button>
          <button @click="deleteAll"  v-if="sessionUtil.isAllowBtn('gc3_3:btn_delete')">删除</button>
          <button>调整</button>
        </div>
      </div>
      <div  style="height:100%;" ref="tablebox">
        <el-table :data="tableData" :height="tableHeightNum" @selection-change="handleSelectionChange" border style="width: 100%">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column  label="操作" width="80">
            <template slot-scope="scope" class="operation"  v-if="sessionUtil.isAllowBtn('gc3_3:btn_edit')||sessionUtil.isAllowBtn('gc3_3:btn_delete')">
              <span @click="edit(scope.$index,tableData)"  v-if="sessionUtil.isAllowBtn('gc3_3:btn_edit')"><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
              <span @click="deletes(scope.$index,tableData)"  v-if="sessionUtil.isAllowBtn('gc3_3:btn_delete')"><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="编号" >
          </el-table-column>
          <el-table-column prop="status" label="计划名称" >
          </el-table-column>
          <el-table-column prop="areaFullName" label="计划状态">
          </el-table-column>
          <el-table-column prop="processName" label="计划开始时间">
          </el-table-column>
          <el-table-column prop="constructionStatus" label="计划结束时间">
          </el-table-column>
          <el-table-column prop="enable" label="计划类型">
          </el-table-column>
          <el-table-column prop="principal" label="计划编制人">
            <template slot-scope="scope">
              <div>{{scope.row.principal}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="inspect" label="编制日期">
            <template slot-scope="scope">
              <div>{{scope.row.inspect}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="spot" label="说明">
            <template slot-scope="scope">
              <div>{{scope.row.spot}}</div>
            </template>
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

      <div class="add-part-box" v-show="importVisable" >
        <div class="add-part " style="height: 90%;width:800px;overflow: hidden;padding-bottom:150px;box-sizing:border-box;">
          <div style="margin-bottom: 10px;">
            <p style="margin-bottom: 10px;">实测实量计划编制</p>
            <p style="font-size: 12px;text-align: right;">
              <el-button type="primary" icon="el-icon-edit">提交发布</el-button>
              <el-button type="primary" icon="el-icon-share">保存草稿</el-button>
              <el-button type="primary" icon="el-icon-delete">关闭</el-button>
            </p>
          </div>

          <div style="height:100%;overflow: auto;">

            <div style="box-sizing: border-box">
              <el-form >
                <el-form-item>
                  <el-row>
                    <el-col :span="12" style="text-align: left;">
                      <span>单据编号</span>
                      <el-input v-model="mainData.NAME_" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>
                    </el-col>
                    <el-col :span="12" style="text-align: left;">
                      <span>编制人</span>
                      <el-input v-model="mainData.NAME_" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item>
                  <el-row>
                    <el-col :span="12" style="text-align: left;">
                      <span>计划名称</span>
                      <el-input v-model="mainData.NAME_" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>
                    </el-col>
                    <el-col :span="12" style="text-align: left;">
                      <span>计划类型</span>
                      <el-select v-model="mainData.LB_" size="mini" class="select-msg-ele" placeholder="请选择">
                        <el-option label="分部" value="分部"></el-option>
                        <el-option label="子分部" value="子分部"></el-option>
                        <el-option label="子项" value="分项"></el-option>
                    </el-select>
                    </el-col>
                  </el-row>
                </el-form-item>

              </el-form>
                
              
            </div>
            <div style="width:400px;box-sizing: border-box;">
              <div style="text-align: left;font-size: 18px;color:#000;">选择工序</div>
              <div >
                <selectTrees v-for="(item, index) in tempCheckItems"  :key="index" :models="item" :level="0" ></selectTrees>
              </div>
              <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
                <button style="margin-right:20px;" @click="importVisable=false">关闭</button>
                <button @click="saveImportData()">保存</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <selectProjMember :selectProjMemberModels='selectProjMemberModels'></selectProjMember>


        <div class="add-part-box add-partss" v-if="dialogFormVisible" >
          <div class="add-part" style="height:350px;width:300px">
            <el-form :model="form">
              <el-form-item label="施工负责人" :label-width="formLabelWidth">
                <el-select v-model="form.principal"  class="item_date addbernum" multiple collapse-tags  placeholder="请选择">
                  <el-option v-for="(item,index) in cities" :key="item.value" :label="item.label" :value="item.id">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="检查人员" :label-width="formLabelWidth">
                <el-select v-model="form.inspect" class="item_date addbernum" multiple collapse-tags placeholder="请选择">
                  <el-option v-for="item in cities1" :key="item.value" :label="item.label" :value="item.id">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                  </el-option>
                </el-select>
                <!--<el-input v-model="form.inspect" @focus="addnumber('检查人员')" class="item_content" placeholder="请输入内容"></el-input>-->
              </el-form-item>
              <el-form-item label="抽查人员" :label-width="formLabelWidth">
                <el-select v-model="form.spot" multiple collapse-tags class="item_date addbernum" placeholder="请选择">
                  <el-option v-for="item in cities2" :key="item.value" :label="item.label" :value="item.id">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                  </el-option>
                </el-select>
                <!--<el-input v-model="form.spot" @focus="addnumber('抽查人员')" class="item_content" placeholder="请输入内容"></el-input>-->
              </el-form-item>
              <el-form-item label="计划开始" :label-width="formLabelWidth">
                <el-date-picker class="item_date" v-model="form.startDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="计划完成" :label-width="formLabelWidth">
                <el-date-picker class="item_date" v-model="form.endDate" type="date" placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-form>

            <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
              <button style="margin-right:20px;" @click="dialogFormVisible=false">关闭</button>
              <button @click="btnsubSave()">保存</button>
            </div>
          </div>
        </div>

        <div class="add-part-box add-partss" v-if="dialogFormVisible1" >
        <div class="add-part" style="width:600px">
          <el-form :model="form1">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="编号" :label-width="formLabelWidth1">
                  <el-input v-model="form1.CODE_" disabled="disabled"  class="item_content" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="区域" :label-width="formLabelWidth1">
                  <el-input v-model="form1.AREA_FULL_NAME_" disabled="disabled" class="item_content" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="检验批" :label-width="formLabelWidth1">
                  <el-input v-model="form1.CHECKOUT_NAME_" disabled="disabled" class="item_content" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="工序名称" :label-width="formLabelWidth1">
                  <el-input v-model="form1.PROCESS_NAME_"  disabled="disabled" class="item_content" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="施工负责人" :label-width="formLabelWidth1">
              <el-select v-model="form1.PRINCIPAL_" class="item_date addbernum" multiple collapse-tags  placeholder="请选择">
                <el-option v-for="item in cities" :key="item.value" :label="item.label" :value="item.id">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="检查人员" :label-width="formLabelWidth1">
              <el-select v-model="form1.INSPECT_" class="item_date addbernum" multiple collapse-tags placeholder="请选择">
                <el-option v-for="item in cities1" :key="item.value" :label="item.label" :value="item.id">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="抽查人员" :label-width="formLabelWidth1">
              <el-select v-model="form1.SPOT_" multiple collapse-tags class="item_date addbernum" placeholder="请选择">
                <el-option v-for="item in cities2" :key="item.value" :label="item.label" :value="item.id">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计划开始" :label-width="formLabelWidth1">
              <!--<span>{{form1.START_DATE_}}</span>-->
              <el-date-picker class="item_date" @blur="changetime(form1.START_DATE_)" v-model="form1.START_DATE_" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="计划完成" :label-width="formLabelWidth1">
              <el-date-picker class="item_date" @blur="changetime1(form1.END_DATE_)" v-model="form1.END_DATE_" type="date" placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="启动" id="ssss" :label-width="formLabelWidth1">
              <el-switch v-model="form1.ENABLE_" active-color="#13ce66" @change="switchs" inactive-color="#ff4949">
              </el-switch>
            </el-form-item>
          </el-form>
          <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
            <button style="margin-right:20px;" @click="dialogFormVisible1=false">关闭</button>
            <button @click="editsave()">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import asideItems from '@/components/common/asideItem.vue'
  import selectTree from '@/components/common/selectRegion.vue'
  import selectTrees from '@/components/common/selectRegion.vue'
  import selectProjMember from '@/components/common/selectProjMember.vue'
  export default {
    data(){
      return{
        searchValue:"",//搜索
        dataType:0,
        mainData:{},
        selectProjMemberModels:{
          isShow:false,
          selectList:[],
          callBack:this.callBack3,
          radioSelectFlags:false,
        },
        status:'',
        tableData:[],
        deviceArr:[],
        tableHeightNum:0,
        currentPage:1,
        formLabelWidth:'90px',
        formLabelWidth1:'90px',
        form:{principal:[],inspect:[],spot:[]},
        form1:{PRINCIPAL_:[],INSPECT_:[],SPOT_:[]},
        tempCheckItem:[],
        tempCheckItems:[],
        dialogFormVisible:false,
        dialogFormVisible1:false,
        createIsShow:false,
        importVisable:false,
        models:[],
        searchName:'请选择',
        arr:[],
        arr1:[],
        pageIndex:1,
        pageSize:10,
        total:0,
        examineStatus:'',
        constructionStatus:'',
        partUid:'',
        principalName:'请选择',
        principalUid:'',
        selcetNumber:'',
        batchArr:[],
        principalId:'',
        inspectId:'',
        spotId:'',
        cities: [],
        cities1: [],
        cities2: [],
      }
    },
    created(){
      this.$bus.on('handelDeparts', this.handelDeparts);
      this.$bus.on("selectNode",this.selectNodeCallback);
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.addList();
      this.getInspectionData();
      this.getworkData();
      this.getProcessTaskData();
      this.loadData();
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.addList();
        this.getInspectionData();
        this.getworkData();
        this.getProcessTaskData();
        this.loadData();
      }
    },
    beforeDestroy(){
      this.$bus.off('handelDeparts', this.handelDeparts);
      this.$bus.off('selectNode', this.selectNodeCallback);
    },
    mounted(){
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
      })
    },
    methods:{
      loadData(){
        this.cities=[];
        this.cities1=[];
        this.cities2=[];
        var param={
          projUid:this.$store.state.selectProjectObj.id,
        }
        this.util.restGet('/api_v1/business/project/getMemberByProjUid',param,(res)=>{
          if(res.status==200){
            console.log(res)
            if(res.data){
              for(let i=0;i<res.data.member.length;i++){
                let obj={};
                obj.label=res.data.member[i].userName
                obj.value=res.data.member[i].position
                obj.id=res.data.member[i].id;
                obj.projUid=res.data.member[i].projUid
                this.cities.push(obj)
                this.cities1.push(obj)
                this.cities2.push(obj)
              }
            }else{
              this.cities=[]
            }
          }else{
            this.util.error(res.errorMsg)
          }
        })
      },
      switchs(val){
        this.ENABLE_=val;
        this.$forceUpdate();
      },
      changetime(val){
        this.form1.START_DATE_=val;
        this.$forceUpdate();
      },
      changetime1(val){
        this.form1.END_DATE_=val;
        this.$forceUpdate();
      },
      editsave(){

        if(this.form1.INSPECT_.length>0){
          this.form1.INSPECT_=this.form1.INSPECT_.join(',')
        }else{
          this.form1.INSPECT_=''
        }
        if(this.form1.PRINCIPAL_.length>0){
          this.form1.PRINCIPAL_=this.form1.PRINCIPAL_.join(',')
        }else{
          this.form1.PRINCIPAL_=''
        }
        if(this.form1.SPOT_.length>0){
          this.form1.SPOT_=this.form1.SPOT_.join(',')
        }else{
          this.form1.SPOT_=''
        }
        if(this.form1.START_DATE_){
          this.form1.START_DATE_=new Date(this.form1.START_DATE_).format('yyyy-MM-dd')
        }else{
          this.form1.START_DATE_=''
        }
        if(this.form1.END_DATE_){
          this.form1.END_DATE_=new Date(this.form1.END_DATE_).format('yyyy-MM-dd')
        }else{
          this.form1.END_DATE_=''
        }
        if(this.form1.ENABLE_==true){
          this.form1.ENABLE_=1
        }else{
          this.form1.ENABLE_=0
        }

        var params = {mainFormData:JSON.stringify(this.form1),sqlTableName:"T_PROCESS_TASK",ifSaveWorkflow:false};
          params['id']=this.form1.ID_;
          params['businessKey']=this.form1.ID_;
        this.util.restPost("/api_v1/form/business",params,(res)=>{
          if(res.status==200){
            this.util.success('保存成功');
            this.getProcessTaskData();
            this.dialogFormVisible1=false;
          }else{
            this.util.error(res.errorMsg);
          }
        });
      },
      deleteAll(){
        if(this.batchArr.length==0){
          this.util.successToast('请选择删除的项');
          return false
        }
        let ids='';
        for(let i=0;i<this.batchArr.length;i++){
          ids+=this.batchArr[i].id+','
        }
        ids=ids.slice(0,ids.length-1);
        this.delType(ids)
      },
      deletes(index,arr){
        let id=arr[index].id
        this.delType(id)
      },
      deletefun(id){
          this.util.restDelete('/api_v1/business/process/task/ids?ids='+id,null,res=>{
            if(res.status==200){
              this.util.successToast('删除成功');
              this.getProcessTaskData();
            }
          })
      },
      delType(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deletefun(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      edit(index,arr){
        this.form1={PRINCIPAL_:[],INSPECT_:[],SPOT_:[]}
        let id=arr[index].id;
        this.util.restGet('/api_v1/business/process/task/'+id+'/?id='+id,null,res=>{
          if(res.status==200){
            console.log(res)
            this.form1.CODE_=res.data.code
            this.form1.AREA_FULL_NAME_=res.data.areaFullName
            this.form1.AREA_UID_=res.data.areaUid
            this.form1.CHECKOUT_NAME_=res.data.checkoutName
            this.form1.CHECKOUT_UID_=res.data.checkoutUid
            this.form1.CONSTRUCTION_STATUS_=res.data.constructionStatus
            if(res.data.enable==1){
              this.form1.ENABLE_=true
            }else{
              this.form1.ENABLE_=false
            }

            this.form1.ID_=res.data.id
            if(res.data.inspect){
              for(let i=0;i<res.data.inspect.length;i++){
                console.log(this.form1.INSPECT_)
                this.form1.INSPECT_.push(res.data.inspect[i].id)
              }
            }
           if(res.data.principal){
             for(let i=0;i<res.data.principal.length;i++){
               this.form1.PRINCIPAL_.push(res.data.principal[i].id)
             }
           }
            if(res.data.spot){
              for(let i=0;i<res.data.spot.length;i++){
                this.form1.SPOT_.push(res.data.spot[i].id)
              }
            }

            this.form1.PROCESS_NAME_=res.data.processName
            this.form1.PROCESS_UID_=res.data.processUid
            this.form1.PROJ_UID_=res.data.projUid
            this.form1.STATUS_=res.data.status
            this.form1.START_DATE_=res.data.startDate
            this.form1.END_DATE_=res.data.endDate
            this.dialogFormVisible1=true;
            this.$forceUpdate();
          }else{
            this.util.error(res.errorMsg)
          }
        })
      },

      BatchRelease(){
        if(this.batchArr.length==0){
          this.util.failueToast('请选择批量下达任务的项');
          return false;
        }
        this.form={}
        this.dialogFormVisible=true;
      },
      btnsubSave(){
        if(this.form.inspect.length>0){
          this.form.inspect=this.form.inspect.join(',');
        }else{
          this.form.inspect=''
        }
        if(this.form.principal.length>0){
          this.form.principal=this.form.principal.join(',');
        }else{
          this.form.principal=''
        }
        if(this.form.spot.length>0){
          this.form.spot=this.form.spot.join(',');
        }else{
          this.form.spot=''
        }
        let arr=[];
        for(let i=0;i<this.batchArr.length;i++){
          let obj={}
          obj.principal=this.form.principal;
          obj.inspect=this.form.inspect;
          obj.spot=this.form.spot;
          if(this.form.startDate){
            obj.startDate=new Date(this.form.startDate).format('yyyy-MM-dd');
          }
          if(this.form.endDate){
            obj.endDate=new Date(this.form.endDate).format('yyyy-MM-dd');
          }

          obj.areaFullName=this.batchArr[i].areaFullName;
          obj.code=this.batchArr[i].code;
          obj.id=this.batchArr[i].id;
          obj.areaUid=this.batchArr[i].areaUid;
          obj.checkoutName=this.batchArr[i].checkoutName;
          obj.checkoutUid=this.batchArr[i].checkoutUid;
          obj.processName=this.batchArr[i].processName;
          obj.processUid=this.batchArr[i].processUid;
          obj.projUid=this.batchArr[i].projUid;
          if(this.batchArr[i].enable){
            if(this.batchArr[i].enable=='启用'){
              this.batchArr[i].enable=1
            }else{
              this.batchArr[i].enable=0
            }
          }
          if(this.batchArr[i].status){
            if(this.batchArr[i].status=='检查未开始'){
              this.batchArr[i].status=0
            }else if(this.batchArr[i].status=='检查中'){
              this.batchArr[i].status=1
            }else{
              this.batchArr[i].status=2
            }
          }
          if(this.batchArr[i].constructionStatus){
            if(this.batchArr[i].constructionStatus=='施工未开始'){
              this.batchArr[i].constructionStatus=0
            }else if(this.batchArr[i].constructionStatus=='施工中'){
              this.batchArr[i].constructionStatus=1
            }else if(this.batchArr[i].constructionStatus=='待检验'){
              this.batchArr[i].constructionStatus=2
            }else if(this.batchArr[i].constructionStatus=='已完成'){
              this.batchArr[i].constructionStatus=3
            }else if(this.batchArr[i].constructionStatus=='需返工'){
              this.batchArr[i].constructionStatus=4
            }
          }
          obj.enable=this.batchArr[i].enable;
          obj.status=this.batchArr[i].status;
          obj.constructionStatus=this.batchArr[i].constructionStatus;
          arr.push(obj)
        }
        this.util.restPost('/api_v1/business/process/task/save',{task:arr},res=>{
          if(res.status==200){
            this.util.successToast('批量下达任务成功');
            this.dialogFormVisible=false;
            this.getProcessTaskData();
          }else{
            this.util.error(res.errorMsg)
          }
        })
      },
      searchfun(){
        this.getProcessTaskData();
      },
      // addnumber(type){
      //     this.selcetNumber=type
      //     this.selectProjMemberModels.isShow=true
      // },
      callBack3(){
        console.log(this.selectProjMemberModels.selectList);
        // if(this.selectProjMemberModels.selectList.length>0){
        //   if(this.selcetNumber=='施工负责人'){
        //     this.principalName=this.selectProjMemberModels.selectList[0].userName;
        //     this.principalUid=this.selectProjMemberModels.selectList[0].id;
        //   }else if(this.selcetNumber=='负责人'){
        //     this.form1.PRINCIPAL_=this.selectProjMemberModels.selectList[0].userName;
        //     this.form.principal=this.selectProjMemberModels.selectList[0].userName;
        //     this.principalId=this.selectProjMemberModels.selectList[0].id;
        //     this.$forceUpdate();
        //   }else if(this.selcetNumber=='检查人员'){
        //     this.form1.INSPECT_=this.selectProjMemberModels.selectList[0].userName;
        //     this.form.inspect=this.selectProjMemberModels.selectList[0].userName;
        //     this.inspectId=this.selectProjMemberModels.selectList[0].id;
        //     this.$forceUpdate();
        //   }else if(this.selcetNumber=='抽查人员'){
        //     this.form1.SPOT_=this.selectProjMemberModels.selectList[0].userName;
        //     this.form.spot=this.selectProjMemberModels.selectList[0].userName;
        //     this.spotId=this.selectProjMemberModels.selectList[0].id;
        //     this.$forceUpdate();
        //   }
        // }
        // this.selectProjMemberModels.isShow=false
      },
      generate(){
        this.tempCheckItem=[];
        this.tempCheckItems=[];
        this.getworkData();
        this.getInspectionData();
        this.arr=[];
        this.arr1=[];
        this.importVisable=true
      },
      handelDeparts(data){
        this.partUid=data.id;
        this.searchName=data.label;
        this.createIsShow=false;
      },
      selectNodeCallback(data){
        if(data.sign2){
          if(data.check){
            this.selectNodeloop(data)
          }else {
            data.selected=false;
            this.util.failueToast('只能选择检验批');
            return false
          }
        }else{
          this.workingloop(data)
        }

      },
      selectNodeloop(data){
        var arr=[]
        function selectloop(data) {
          arr.push(data)
          if(data.parents){
            selectloop(data.parents)
          }else{
            return
          }
        }
        selectloop(data);
        if(data.selected){
          this.arr.push(data)
        }else{
          this.arr=this.arr.filter(item=>{
            return item.id!=data.id
          })
        }
        console.log(this.arr)
      },
      workingloop(data){
        var arr=[]
        function selectloopNode(data) {
          arr.push(data)
          if(data.parents){
            selectloopNode(data.parents)
          }else{
            return
          }
        }
        selectloopNode(data);
        if(data.selected){
          this.arr1.push(data)
        }else{
          this.arr1=this.arr1.filter(item=>{
            return item.id!=data.id
          })
        }
        console.log('arr1')
        console.log(this.arr1)
      },
      saveImportData(){
        if(this.arr.length==0){
          this.util.failueToast('请选择检验批')
          return false
        }
        if(this.arr1.length==0){
          this.util.failueToast('请选择工序');
          return false
        }
        var arr3=[]
        for(let i=0;i<this.arr.length;i++){
          for(let j=0;j<this.arr1.length;j++){
            let obj={};
            obj.projUid=this.$store.state.selectProjectObj.id;
            obj.areaUid=this.arr[i].partUid;
            obj.areaFullName=this.arr[i].name;
            obj.checkoutUid=this.arr[i].id;
            obj.checkoutName=this.arr[i].label;
            obj.processUid=this.arr1[j].id;
            obj.processName=this.arr1[j].label;
            arr3.push(obj)
          }
        }

        this.util.restPost('/api_v1/business/process/task/save',{task:arr3},res=>{
          if(res.status==200){
            this.util.successToast('批量生成任务成功');
            this.importVisable=false;
            this.getProcessTaskData();
          }else{
            this.util.error(res.errorMsg)
          }
        })
      },
      getProcessTaskData(){
        let params={
          projUid:this.$store.state.selectProjectObj.id,
          pageSize:this.pageSize,
          pageIndex:this.pageIndex,
          exStatus:this.examineStatus,
          constructionStatus:this.constructionStatus,
          partUid:this.partUid,
          principalUid:this.principalUid,
        };
        this.util.restGet('/api_v1/business/process/searchProcessTaskList',params,res=>{
          // console.log(res)
          if(res.status==200&&res.data!=undefined){
            for(let i=0;i<res.data.length;i++){
                if(res.data[i].status==0){
                  res.data[i].status='检查未开始'
                }else if(res.data[i].status==1){
                  res.data[i].status='检查中'
                }else{
                  res.data[i].status='检查完成'
                }
                if(res.data[i].constructionStatus==0){
                  res.data[i].constructionStatus='施工未开始'
                }else if(res.data[i].constructionStatus==1){
                  res.data[i].constructionStatus='施工中'
                }else if(res.data[i].constructionStatus==2){
                  res.data[i].constructionStatus='待检验'
                }else if(res.data[i].constructionStatus==3){
                  res.data[i].constructionStatus='已完成'
                }else if(res.data[i].constructionStatus==4){
                  res.data[i].constructionStatus='需返工'
                }
                if(res.data[i].enable==1){
                  res.data[i].enable='启用'
                }else{
                  res.data[i].enable='禁用'
                }
                if(res.data[i].inspect!=undefined&&res.data[i].inspect!=""){
                  var inspectArr = res.data[i].inspect.map(item=>item.label);
                  res.data[i].inspect=inspectArr.join(",");
                }
                if(res.data[i].principal!=undefined&&res.data[i].principal!=""){
                  var principalArr = res.data[i].principal.map(item=>item.label);
                  res.data[i].principal=principalArr.join(",");
                }
                if(res.data[i].spot!=undefined&&res.data[i].spot!=""){
                  var spotArr = res.data[i].spot.map(item=>item.label);
                  res.data[i].spot=spotArr.join(",");
                }

              }
              this.tableData=res.data;
              this.total=res.totalCount

          }else{
            this.tableData=[];
          }
        })
      },
      getworkData(){
        let params={
          projUid:this.$store.state.selectProjectObj.id
        };
        this.util.restGet('/api_v1/business/process/searchProcessList',params,res=>{
          if(res.status==200){
            if(res.data!=undefined){
              this.tempCheckItems=res.data.data;
            }else{
              this.tempCheckItems=[];
            }
          }else{
            this.util.error(res.errorMsg);
          }
        })
      },
      InspectionDataloop(data){
        let arr=[];
        for(let i=0;i<data.length;i++){
          if(data[i].children2&&data[i].children){
            data[i].children=data[i].children.concat(data[i].children2);
          }
          if(data[i].children){
            this.InspectionDataloop(data[i].children)
          }
        }
      },
      getInspectionData(){
        this.util.restGet('/api_v1/business/process/processTaskTree',{projUid:this.$store.state.selectProjectObj.id},res=>{
          if(res.status==200){
            if(res.data!=undefined){
              this.InspectionDataloop(res.data.data);
              console.log(res.data.data)
              this.tempCheckItem=res.data.data;
            }else{
              this.tempCheckItem=[];
            }
          }else{
            this.util.error(res.errorMsg);
          }
        });
      },
      addList(){
        this.util.restGet('/api_v1/construction/inspect/partTree',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
          if(res.status==200&&res.data!=undefined){
            // this.tempCheckItem=res.data;
            console.log('123')
            console.log(res)
            this.models=res.data;
          }else{
            // this.tempCheckItem=[];
            this.models=[];
          }

        });
      },
      selectShow(){
        this.createIsShow=!this.createIsShow;
      },
      handleSelectionChange(val){
        this.batchArr=val;
      },
      handleSizeChange(val){
        console.log(val);
      },
      handleCurrentChange(val){
        this.pageIndex=val;
        this.getProcessTaskData();
      },
    },
    components:{
      asideItems,selectTree,selectTrees,selectProjMember
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
    width:100px;
  }
  .parcess_head .el-input--mini .el-input__inner{
    height:26px;
  }
  .parcess_model .el-dialog{
    width:375px;
  }
  .ProcessTask .el-date-editor.el-input{
    /* width:100%; */
  }
  .add-partss span{
    width:25px !important;
  }
  .addbernum span{
    width:auto !important;
  }
  #ssss span{
    width:40px !important;
  }
  #ssss .el-form-item__content{
    text-align: left;
  }
  /*.add-partss .el-switch__core:after{*/
    /*!*color:*!*/
  /*}*/
</style>
