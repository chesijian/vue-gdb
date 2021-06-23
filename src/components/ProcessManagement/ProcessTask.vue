<template>
  <div class="ProcessTask">
    <div class="ProcessTask_head ">
      <div class="parcess_head">
        <div class="item_head"><h4 style="margin-bottom: 0;">查询</h4></div>
        <div class="item_head">
          <span>检查状况</span>
          <span>
            <el-select v-model="examineStatus" @change="getProcessTaskData" placeholder="请选择" size="mini" class="select-ele">
              <el-option label="全部" value=""></el-option>
              <el-option label="检查未开始" value="0"></el-option>
              <el-option label="检查中" value="1"></el-option>
              <el-option label="检查完成" value="2"></el-option>
            </el-select>
          </span>
        </div>
        <div class="item_head">
          <span>施工状态</span>
          <span>
            <el-select v-model="constructionStatus" @change="getProcessTaskData" placeholder="请选择" size="mini" class="select-ele">
              <el-option label="全部" value=""></el-option>
              <el-option label="施工未开始" value="0"></el-option>
              <el-option label="施工中" value="1"></el-option>
              <el-option label="待检验" value="2"></el-option>
              <el-option label="已完成" value="3"></el-option>
              <el-option label="需返工" value="4"></el-option>
            </el-select>
          </span>
        </div>
        <div class="item_head" style="position:relative;">
          <span>区域</span>
          <span @click="selectShow" style="text-align: left;line-height: 26px;display: inline-block;width:120px;height:26px;background-color: rgba(255,255,255,.1);color:#ccc;">
            {{searchName}}  <i style="position: relative;left:60px;" v-if="createIsShow" class="el-icon-arrow-up"></i>
            <i style="position: relative;left:60px;" v-if="!createIsShow" class="el-icon-arrow-down"></i>
          </span>
          <div :class="{selcetData:createIsShow==false}" style="color:#000;z-index: 999;overflow: auto;position: absolute;text-align: left;top:26px;left:27px;width:250px;height:250px;background-color: #fff;">
            <div @click="handelDeparts({label:'全部'})" style="color: #44d2ff;padding-top: 10px;padding-left: 21px;">全部</div>
            <asideItems v-for="(item, index) in models"  :key="index" :models="item" :level="0" ></asideItems>
          </div>
        </div>
        <div class="item_head">
          <span>施工负责人</span>
          <span>
            <el-select v-model="principalUid" @change="getProcessTaskData" placeholder="请选择" size="mini" class="select-ele">
                <el-option v-for="(item,index) in cities" :key="index" :label="item.label" :value="item.id">
                  <span style="float: left">{{ item.label }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                </el-option>
            </el-select>
          </span>
          <!--<span @click="addnumber('施工负责人')" style="text-align: left;line-height: 26px;display: inline-block;width:120px;height:26px;background-color: rgba(255,255,255,.1);color:#ccc;">-->
            <!--{{principalName}} <i style="float: right;padding-right: 10px;line-height: 26px;"  class="el-icon-arrow-down"></i>-->
          <!--</span>-->
        </div>
        <div class="item_head">
          <button @click="searchfun">搜索</button>
        </div>

        <div style="margin-left: auto;">
          <button @click="generate"  v-if="sessionUtil.isAllowAdd('t_InspectProcedure_Task')">批量生成任务</button>
          <button @click="BatchRelease"  v-if="sessionUtil.isAllowEdit('t_InspectProcedure_Task')">批量下达任务</button>
          <button @click="deleteAll"  v-if="sessionUtil.isAllowDelete('t_InspectProcedure_Task')">删除</button>
          <!--<button>导出</button>-->
        </div>
      </div>
      <div  style="height:100%;" ref="tablebox">
        <el-table :data="tableData" :height="tableHeightNum" @selection-change="handleSelectionChange" border >
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column  label="操作" width="80">
            <template slot-scope="scope" class="operation"  v-if="sessionUtil.isAllowEdit('t_InspectProcedure_Task')||sessionUtil.isAllowDelete('t_InspectProcedure_Task')">
              <span @click="edit(scope.$index,tableData)"  v-if="sessionUtil.isAllowEdit('t_InspectProcedure_Task')"><img src="../../assets/administrationIcon/edit1.png" width="20" height="20" alt=""></span>
              <span @click="deletes(scope.$index,tableData)"  v-if="sessionUtil.isAllowDelete('t_InspectProcedure_Task')"><img width="17px" height="17px" src="../../assets/indexImg/del.png" alt=""></span>
            </template>
          </el-table-column>
          <el-table-column prop="code" label="编号" >
          </el-table-column>
          <el-table-column prop="status" label="检查状态" >
          </el-table-column>
          <el-table-column prop="areaFullName" label="区域">
          </el-table-column>
          <el-table-column prop="processName" label="工序名称" width="300">
          </el-table-column>
          <el-table-column prop="constructionStatus" label="施工状态">
          </el-table-column>
          <el-table-column prop="enable" label="是否启用">
          </el-table-column>
          <el-table-column prop="principal" label="施工负责人">
            <template slot-scope="scope">
              <div>{{scope.row.principal}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="inspect" label="检查人员">
            <template slot-scope="scope">
              <div>{{scope.row.inspect}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="spot" label="抽查人员">
            <template slot-scope="scope">
              <div>{{scope.row.spot}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="issueCount" label="问题数">
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

      <div  v-show="importVisable" >
        <div class="add-part " v-loading="loading" style="height: 90%;width:988px;overflow: hidden;padding-bottom:150px;box-sizing:border-box;">
          <div style="margin-bottom: 10px;">
            <p style="margin-bottom: 10px;">生成工序任务</p>
            <p style="font-size: 12px;">
                    检验批名字示例：区域 检验批&#91自定义名称] 如：地下室-负一层-一区 检验批&#91墙、柱]；地下室-负一层-一区 检验批 注意：每次一个区域生成一个检验批；为了单次快速生成检验批，一次可批量勾选20个或以内的区域生成检验批。
            </p>
          </div>
          <div style="font-size: 17px;padding-bottom: 5px;">
            <span>业态:</span>
            <el-dropdown >
              <el-button size="mini">
                {{yetaiValue}}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="yetaiValue=item.name;initData()" v-for="item in dicData" :key="item.name">{{item.name}}</el-dropdown-item>
                <!-- <el-dropdown-item @click.native="dataSource='企业库'">企业库</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <!-- <el-select v-model="yetaiValue" @change="initData()" placeholder="请选择">
              <el-option v-for="item in dicData" :key="item.name" :label="item.name" :value="item.name">
              </el-option>
            </el-select> -->
          </div>
          <div style="height:100%;overflow: auto;display: flex">

            <div style="width:320px;box-sizing: border-box;border: 1px solid #44d2ff;padding: 5px;margin-right: 5px;overflow: auto;">
                 <div style="text-align: left;font-size: 18px;color:#000;">选择检验批</div>
                <div >
                  <selectTree v-for="(item, index) in tempCheckItem"   :key="index" :models="item" :level="0" ></selectTree>
                </div>
            </div>
            <div style="width:330px;box-sizing: border-box;border: 1px solid #44d2ff;padding: 5px;margin-right: 5px;height: 100%;overflow: auto;">
              <div style="text-align: left;font-size: 18px;color:#000;">
                <span style="margin-right: 10px;">选择工序</span>
                <el-dropdown >
                  <el-button type="primary" size="mini">
                    {{dataSource}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="dataSource='项目库'">项目库</el-dropdown-item>
                    <el-dropdown-item @click.native="dataSource='企业库'">企业库</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div v-show="dataSource=='项目库'">
                <!-- <selectTrees v-for="(item, index) in tempCheckItems"  :key="index" :models="item" :level="0" ></selectTrees> -->
                <el-tree check-strictly show-checkbox node-key="id" :load="loadProjCheckItem" lazy :props="defaultProps" ref="projTree"></el-tree>
              </div>
              <div v-show="dataSource=='企业库'" style="margin-top: 10px;">
                <el-tree show-checkbox :expand-on-click-node="false" check-strictly highlight-current node-key="id" :load="loadEnterpriseList" lazy :props="defaultProps" ref="tree"></el-tree>
              </div>
              
            </div>
            <div style="width:280px;box-sizing: border-box;text-align: left;border: 1px solid #44d2ff;padding: 5px;">
              <div style="font-size: 18px;color:#000;">下达任务</div>
              <el-form :model="form">
                <el-form-item label="施工负责人" label-position="left" :label-width="formLabelWidth">
                  <el-select v-model="form.principal"  class="item_date addbernum" multiple collapse-tags  placeholder="请选择">
                    <el-option v-for="(item,index) in cities" :key="index" :label="item.label" :value="item.id">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="检查人员" label-position="left" :label-width="formLabelWidth">
                  <el-select v-model="form.inspect" class="item_date addbernum" multiple collapse-tags placeholder="请选择">
                    <el-option v-for="(item,index) in cities1" :key="index" :label="item.label" :value="item.id">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="抽查人员" :label-width="formLabelWidth">
                  <el-select v-model="form.spot" multiple collapse-tags class="item_date addbernum" placeholder="请选择">
                    <el-option v-for="(item,index) in cities2" :key="index" :label="item.label" :value="item.id">
                      <span style="float: left">{{ item.label }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="计划开始" :label-width="formLabelWidth">
                  <el-date-picker class="item_date" value-format="yyyy-MM-dd" v-model="form.startDate" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="计划完成" :label-width="formLabelWidth">
                  <el-date-picker class="item_date" value-format="yyyy-MM-dd" v-model="form.endDate" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </el-form>
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
                <el-select v-model="form.principal"  class="item_date addbernum" multiple placeholder="请选择">
                  <el-option v-for="(item,index) in cities" :key="index" :label="item.label" :value="item.id">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="检查人员" :label-width="formLabelWidth">
                <el-select v-model="form.inspect" class="item_date addbernum" multiple placeholder="请选择">
                  <el-option v-for="(item,index) in cities1" :key="index" :label="item.label" :value="item.id">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                  </el-option>
                </el-select>
                <!--<el-input v-model="form.inspect" @focus="addnumber('检查人员')" class="item_content" placeholder="请输入内容"></el-input>-->
              </el-form-item>
              <el-form-item label="抽查人员" :label-width="formLabelWidth">
                <el-select v-model="form.spot" multiple class="item_date addbernum" placeholder="请选择">
                  <el-option v-for="(item,index) in cities2" :key="index" :label="item.label" :value="item.id">
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
  //  import selectTree from '../common/selectTree.vue'
  import selectTrees from '@/components/common/selectRegion.vue'
  import selectProjMember from '@/components/common/selectProjMember.vue'
  export default {
    data(){
      return{
        dataSource:"企业库",
        yetaiValue:"",//业态值
        dicData:[],
        selectProjMemberModels:{
          isShow:false,
          selectList:[],
          callBack:this.callBack3,
          radioSelectFlags:false,
        },
        defaultProps: {
                    children: 'children',
                    label: 'itemName',
                    isLeaf:'leaf'
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
        loading:false,// 加载中
        models:[],
        searchName:'请选择',
        arr:[],
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
        enterpriseItems:[],
        rootNode:0,
        rootResolve:{},
      }
    },
    created(){
      this.$bus.on('handelDeparts', this.handelDeparts);
      this.$bus.on("selectNode",this.selectNodeCallback);
      // this.$bus.on("loadChildren",this.getEnterpriseList);
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.loadDicData();//获取字典
      this.addList();
      this.getInspectionData();
      this.getProcessTaskData();
      this.loadData();
      // this.getEnterpriseList();
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.addList();
        this.getInspectionData();
        this.getProcessTaskData();
        this.loadData();
      }
    },
    beforeDestroy(){
      this.$bus.off('handelDeparts', this.handelDeparts);
      this.$bus.off('selectNode', this.selectNodeCallback);
      
      // this.$bus.off("loadChildren",this.getEnterpriseList);
    },
    mounted(){
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
      })
    },
    methods:{
      loadDicData(){
        var param={
          projUid:this.$store.state.selectProjectObj.id,
        }
        this.util.restGet('/api_v1/construction/inspect/areaPurpose',param,(res)=>{
          if(res.status==200&&res.data){
            this.dicData=res.data;
            this.yetaiValue=res.data[0].name;
          }else{
            this.dicData=[]
          }
        },null,false)
      },
      initData(){
        this.getInspectionData();
        this.rootNode.childNodes = [] // 这里把子节点清空，是因为再次调用 loadNode 的时候会往 childNodes 里 push 节点，所以会有节点重复的情况。
        this.loadEnterpriseList(this.rootNode, this.rootResolve);
      },
      loadEnterpriseList(node,resolve){//加载企业库
          
           if(node.level==0){
              this.rootResolve =resolve;
              this.rootNode =node;
            }
          // var data = resolve==undefined? node:node.data;
          var data = node.data? node.data:null;
          var params = {
            type : "procedure",
            id : data? data.id:"root",
            projType:this.$store.state.projectName,
            projPurpose:this.yetaiValue
          }
          
          this.util.mask();
          this.util.restGet('/api_v1/construction/inspect/getCheckItemEnterprise', params, (res)=> {
              this.util.unmask();
              if(res.status==200&&res.data){
                  res.data = res.data.filter(item=>item.lb!="检查项");
                  res.data.forEach(item=>{
                    item.parentStr=node.data==undefined? "":node.data.parentStr+node.data.itemName+">";
                  });

                  if(resolve==undefined){
                      
                  }else{
                      resolve(res.data);
                  }
                  
              }else{
                  resolve([]);
              }
          });
          
      },
      loadProjCheckItem(node,resolve){//加载项目库
        var params ={
          ifCatalog:true,
          projUid:this.$store.state.selectProjectObj.id,
          formType:"procedure",
          parentUid:node.data==undefined? "root":node.data.id,
          type:"procedure",
          itemLb:"检查项",
          pageSize:100,
          pageIndex :1
        };
        this.loadIteming=true;
        this.util.restGet('/api_v1/construction/inspect/getCheckItemData', params, (res)=> {
            this.loadIteming=false;
            if(res.status==200&&res.data){
              var dataList = res.data.filter(obj=>{
                return obj.lb !="检查项";
              });
              dataList.forEach(item=>{
                item.parentStr=node.data==undefined? "":node.data.parentStr+node.data.itemName+">";
              });
              resolve(dataList);
            }else{
              resolve([]);
                
            }
            // this.$forceUpdate();
        });
      },
      getEnterpriseList(node) {
          
          if(node!=undefined&&node.children!=undefined){
            return;
          }
          var data = node==undefined? this.itemParentObj:node;
          var list = {
            type : "procedure",
            id : node==undefined? "root":node.id,
            projType:this.$store.state.projectName,
          }
          this.util.mask();
          	this.util.restGet('/api_v1/construction/inspect/getCheckItemEnterprise', list, (res)=> {
              this.util.unmask();
              if(node==undefined){
                this.enterpriseItems=res.data;
              }else{
                this.$set(node,"children",res.data);
              }


          });
      },
      loadData(){
        this.cities=[];
        this.cities1=[];
        this.cities2=[];
        var param={
          projUid:this.$store.state.selectProjectObj.id,
        }
        this.util.restGet('/api_v1/business/project/getMemberByProjUid',param,(res)=>{
          if(res.status==200){
            if(res.data){
              res.data.member.forEach(item=>{
                let obj={
                  label:item.userName,
                  value:item.position,
                  id:item.id,
                  projUid:item.projUid
                };
                this.cities.push(obj)
                this.cities1.push(obj)
                this.cities2.push(obj)
              });
              
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
        this.getTaskMembers();
        this.dialogFormVisible=true;
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
        this.$refs.tree.setCheckedKeys([]);
        this.getInspectionData();
        this.arr=[];
        
        this.getTaskMembers();//获取任务配置人员
        this.importVisable=true
      },
      getTaskMembers() {
        this.form={};
				var params = {
					projUid: this.$store.state.selectProjectObj.id,
					roleType: "ProcessConstruct,proChecker,ProcessCheck,ProcessReview"
				}
				this.util.restGet("/api_v1/construction/inspect/authorityMember",params,(res)=>{
					 if(res.status==200&&res.data){
             var constructArr=[]; //施工负责人
             var checkerArr=[]; //检查负责人
             var reviewArr=[]; //抽查人
             res.data.forEach(item=>{
               var roleIds = item.roleId.split(",");
               if(roleIds.findIndex(role=>role==="ProcessConstruct")>=0){
                 constructArr.push(item);
               }
               if(roleIds.findIndex(role=>role==="proChecker")>=0||roleIds.findIndex(role=>role==="ProcessCheck")>=0){
                 checkerArr.push(item);
               }
               if(roleIds.findIndex(role=>role==="ProcessReview")>=0){
                 reviewArr.push(item);
               }
             });
            
             this.form={
               principal:constructArr.map(item=>item.id),
               inspect:checkerArr.map(item=>item.id),
               spot:reviewArr.map(item=>item.id),
             };
           }
				});
			},
      handelDeparts(data){
        this.partUid=data.id;
        this.searchName=data.label;
        this.createIsShow=false;
        this.getProcessTaskData();
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
        
      },
      saveImportData(){
        var projItemArr = this.$refs.projTree.getCheckedNodes();//项目库数据
        projItemArr.forEach(obj=>{
          obj.inspectType="0";
        });
        let dataRecieve = this.$refs.tree.getCheckedNodes();//企业库数据
        
        let checkItemList = projItemArr.concat(dataRecieve);
        
        if(this.arr.length==0){
          this.util.failueToast('请选择检验批')
          return false
        }
        if(checkItemList.length==0){
          this.util.failueToast('请选择工序');
          return false
        }
        
        if(this.form.inspect&&this.form.inspect.length>0){
          this.form.inspect=this.form.inspect.join(',');
        }else{
          this.form.inspect=''
        }
        if(this.form.principal&&this.form.principal.length>0){
          this.form.principal=this.form.principal.join(',');
        }else{
          this.form.principal=''
        }
        if(this.form.spot&&this.form.spot.length>0){
          this.form.spot=this.form.spot.join(',');
        }else{
          this.form.spot=''
        }
        var arr3=[]
        for(let i=0;i<this.arr.length;i++){
          for(let j=0;j<checkItemList.length;j++){
            let checkObj=checkItemList[j];
            let obj={
              principal:this.form.principal,
              inspect:this.form.inspect,
              spot:this.form.spot,
              startDate:this.form.startDate,
              endDate:this.form.endDate,
            }
            obj.projUid=this.$store.state.selectProjectObj.id;
            obj.areaUid=this.arr[i].partUid;
            obj.areaFullName=this.arr[i].name;
            obj.checkoutUid=this.arr[i].id;
            obj.checkoutName=this.arr[i].label;
            obj.processUid=checkObj.id;
            obj.processName=checkObj.label? checkObj.label:checkObj.parentStr+checkObj.itemName;
            obj.inspectType=checkObj.inspectType? "0":"1";
            arr3.push(obj)
          }
        }
        console.log("arr3====",arr3);
        this.loading=true;
        this.util.restPost('/api_v1/business/process/task/save',{task:arr3},res=>{
          this.loading=false;
          if(res.status==200){
            this.util.successToast('批量生成任务成功');
            this.importVisable=false;
            this.getProcessTaskData();
          }else{
            this.util.error(res.errorMsg)
          }
        })
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
          var item=this.batchArr[i];
          let obj={
            principal:this.form.principal,
            inspect:this.form.inspect,
            spot:this.form.spot,
            inspectType:item.inspectType,
          }
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
        this.util.mask();
        this.util.restGet('/api_v1/business/process/searchProcessTaskList',params,res=>{
          this.util.unmask();
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
              this.tempCheckItems=res.data;
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
        var params={
          purpose:this.yetaiValue,
          projUid:this.$store.state.selectProjectObj.id
        }
        this.util.restGet('/api_v1/business/process/processTaskTree',params,res=>{
          if(res.status==200){
            if(res.data!=undefined){
              this.InspectionDataloop(res.data.data);
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
    width:100%;
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
