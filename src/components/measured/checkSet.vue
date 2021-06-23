<template>
  <div class="Documents">
    <div class="conter clear">
      <div class="conter_left" style="padding-bottom: 55px;box-sizing: border-box;">
        <div class="conter_left_title clear">
          <div class="title_left">
            <h4>目录</h4>
          </div>
          <div class="title-button">
                <button @click="editCheckCatalog" v-if="sessionUtil.isAllowEdit('t_InspectMeasure_SET')">编辑</button>
                <button @click="addCheckCatalog" v-if="sessionUtil.isAllowAdd('t_InspectMeasure_SET')">添加</button>
                <button @click="deleteCatalog(0)" v-if="sessionUtil.isAllowDelete('t_InspectMeasure_SET')">删除</button>
              </div>
        </div>
        <div class="aside-box" style="height:100%;">
          <!-- <asideItem v-for="(item, index) in models"  :key="index" :models="item" :level="0" ></asideItem> -->
          <selectTree v-for="(item, index) in tempCheckItem"  :key="index" :models="item" :level="0" ></selectTree>
        </div>
      </div>
      <div class="conter_right">
        <div class="conter_right_box">
          <div class="conter_right_title" style="overflow:hidden">
            <h4 style="float:left">检查项</h4>
            <div class="title-button" style="padding-right:20px;">
              <button @click="addCheckItem()" v-if="sessionUtil.isAllowAdd('t_InspectMeasure_SET')">添加</button>
              <button @click="deleteCatalog(1)" v-if="sessionUtil.isAllowDelete('t_InspectMeasure_SET')">删除</button>
              <button @click="exportIn" v-if="sessionUtil.isAllowExport('t_InspectMeasure_SET')">导入</button>
            </div>
          </div>
          <div class="aside-box" style="height:100%;" ref="tablebox">
            <el-table :data="tableData" :height="tableHeightNum" border @selection-change="handleSelectionChange">
              <el-table-column  label="选择" width="50" type="selection"></el-table-column>
              <el-table-column prop="" label="操作" width="80">
                <template slot-scope="scope"  v-if="sessionUtil.isAllowEdit('t_InspectMeasure_SET')">
                    <span>
                      <i style="color: rgba(68,210,255,1);width: 15px;" class="el-icon-edit"  @click="editMember(scope.row)"></i>
                    </span>
                </template>
              </el-table-column>
              <el-table-column prop="itemName"  label="检查项" ></el-table-column>
              <el-table-column prop="checkRequire" label="规范要求"></el-table-column>
              <el-table-column prop="minSample" label="最小抽样量" width="110"></el-table-column>
              <el-table-column prop="projTypeName" label="项目类型" width="110">
              </el-table-column>
              <!-- <el-table-column prop="typeName" label="类型" width="80"></el-table-column> -->
              <el-table-column prop="lb" label="类别" width="80">
              </el-table-column>
            </el-table>
            <div style="text-align: right">
              <el-pagination
                @size-change="changePageSize($event)"
                @current-change="changePageNum($event)"
                :current-page="pageIndex"
                :page-sizes="[10, 25, 50, 100]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
              </el-pagination>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div  v-if="importVisable" >
      <div class="add-part" style="height: 90%;overflow: hidden;padding: 40px 20px 120px;box-sizing:border-box;">
        <p style="position:absolute;top:10px;left:20px;">企业检查项</p>
        <div style="height:100%;width:100%;position:relative;overflow-y:auto;">
          <el-tree :data="importTreeData" show-checkbox node-key="id" :load="loadCompanyItem" v-loading="loading"  :props="defaultProps" ref="tree">
          </el-tree>

        </div>
        <div class="remark">
          <p >导入须知：</p>
          <p class="remark-content">
            • 选中的数据中不包含半选节点
            <br >
            • 导入的节点数据会根据节点名称去重
            <br >
          </p>
        </div>
        <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">

          <button style="margin-right:20px;" @click="importVisable=false">关闭</button>
          <button @click="saveImportData()">保存</button>
        </div>
      </div>
    </div>

    <el-dialog title="选择业态" :visible.sync="selectedPurposeVisible" width="30%">
      <div class="openDialog">
        <!--<el-radio  v-for="(item, index) in projPurposeList" :key="index" v-model="selectedProjPurpose" :label="item.ID_" style="margin-bottom: 10px;">{{item.NAME_}}</el-radio><br/>-->
        <el-table
          highlight-current-row
          @current-change="handleCurrentChange"
          :data="projPurposeList"
          style="width: 100%">
          <el-table-column
            prop="PROJ_LX"
            label="项目类型"
            width="80">
          </el-table-column>
          <el-table-column
            prop="DEK_"
            label="库编码"
            width="100">
          </el-table-column>
          <el-table-column
            prop="PROJ_PURPOSE"
            label="业态"
            width="80">
          </el-table-column>
          <el-table-column
            prop="NAME_"
            label="库名称"
            width="100">
          </el-table-column>
        </el-table>


      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="selectedPurposeVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlerConfirmSelectPurpose">确 定</el-button>
      </div>
    </el-dialog>


    <div class="add-part-box" v-if="isAddCatalog">
        <div class="add-part">
            <p>检查项</p>
              <div class="select-msg-box">
                <span>名称</span>&nbsp;&nbsp;
                <el-input v-model="mainData.NAME_" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>
              </div>
              <div class="select-msg-box">
                <span>类别</span>&nbsp;&nbsp;
                <el-select v-model="mainData.LB_" size="mini" class="select-msg-ele" placeholder="请选择">
                    <el-option label="分部" value="分部"></el-option>
                    <el-option label="子分部" value="子分部"></el-option>
                    <el-option label="子项" value="分项"></el-option>
                </el-select>
            </div>
              <div class="select-msg-box">
                <span>类型</span>&nbsp;&nbsp;
                <el-select v-model="mainData.TYPE_" disabled size="mini" class="select-msg-ele" placeholder="请选择">
                    <el-option label="质量" value="quality"></el-option>
                    <el-option label="安全" value="safety"></el-option>
                    <el-option label="实测" value="measure"></el-option>
                </el-select>
            </div>
            <div style="float:right;padding-top:10px">
                <button style="margin-right:20px;" @click="isAddCatalog=false">关闭</button>
                <button @click="saveData(0)">保存</button>
            </div>
        </div>
    </div>
    <!--<FilePopUp></FilePopUp>-->
     <div class="add-part-box" v-if="isAddPart">
        <div class="add-part">
            <p>检查项</p>
              <div class="select-msg-box">
                <span>项目类型</span>&nbsp;&nbsp;
                <el-select v-model="mainData.PROJ_TYPE_" size="mini" class="select-msg-ele" placeholder="请选择">
                    <el-option label="主控项目" :value="1"></el-option>
                    <el-option label="一般项目" :value="0"></el-option>
                </el-select>
            </div>
              <div class="select-msg-box">
                <span>检查项</span>&nbsp;&nbsp;
                <el-input v-model="mainData.NAME_" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>
            </div>
              <div class="select-msg-box">
                <span>规范要求</span>&nbsp;&nbsp;
                <el-input v-model="mainData.CHECK_REQUIRE_" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>
            </div>
              <div class="select-msg-box">
                <span>最小抽样量</span>&nbsp;&nbsp;
                <el-input v-model.number="mainData.MIN_SAMPLE_" type="number" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>
            </div>
              <div class="select-msg-box">
                <span>类型</span>&nbsp;&nbsp;
                <el-select v-model="mainData.TYPE_" disabled size="mini" class="select-msg-ele" placeholder="请选择">
                    <el-option label="质量" value="quality"></el-option>
                    <el-option label="安全" value="safety"></el-option>
                    <el-option label="实测" value="measure"></el-option>
                </el-select>
            </div>
              <div class="select-msg-box">
                <span>类别</span>&nbsp;&nbsp;
                <el-select v-model="mainData.LB_" disabled size="mini" class="select-msg-ele" placeholder="请选择">

                    <el-option label="实测项" value="实测项"></el-option>
                    <el-option label="检查项" value="检查项"></el-option>
                </el-select>
            </div>
            <div style="float:right;padding-top:10px">
                <button style="margin-right:20px;" @click="isAddPart=false">关闭</button>
                <button @click="saveData(1)">保存</button>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
  // import asideItem from '../common/asideItem.vue'
  import selectTree from '../common/selectTree.vue'
  import FilePopUp from '../common/FilePopUp.vue'
import {getByApi} from "../../api/api";
import {getConfig,getTreeData,copyTreeData} from "../../api/form-render";
  export default {
    data(){
      return{
        defaultProps: {
          children: 'children',
          label: 'NAME_'
        },
        loading:false,
        desFormInfoId:'',
        currentSelectedPurpose:null, // 选中的业态
        selectedPurposeVisible: false,
        selectedProjPurpose:'', // 导入时弹框选中的业态
        importTreeData:[],
        projPurposeList: [],
        items:[],
        importVisable:false,
        isAddPart:false,
        isAddCatalog:false,
        editFlag:false,
        mainData:{},
        creatType:0,
        models:[],
        importData:[],
        tempCheckItem:[], //检查项目录
        tableData: [],
        itemParentObj:{},//选中的目录
        selectedList:[],//选中的检查项
        totalCount:0,
        pageSize:10,
        pageIndex:1,
        checkType: 'measure',
        tableHeightNum:0

      }
    },
    computed: {
        ...mapState({
            userUid: state => state.userUid,
            selectProjectObj: state => state.selectProjectObj
        }),
      },
    created(){
      this.$bus.on("handelDeparts",this.loadCheckItemList);
      this.$bus.on("selectNoded",this.selectNodeCallback);
      this.$bus.on("loadChildren",this.loadData);
      getConfig('t_inspect_item', this).then(config=>{
        let desFormInfo = config.forms.find(form=>{
          return this.validUtil.isNull(form.parentId)
        })
        this.desFormInfoId = desFormInfo.id
      })
    },
    beforeDestroy() {
          this.$bus.off('handelDeparts', this.loadCheckItemList);
          this.$bus.off('selectNoded', this.selectNodeCallback);
          this.$bus.off('loadChildren', this.loadData);
    },
    watch:{
       '$store.state.selectProjectObj.id':function(val,oldVal){
            this.itemParentObj={};
            this.$store.state.selectProjectNode = {};
            this.pageIndex=1;
            this.loadData();
        }
    },
    mounted(){
        var projObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.$store.state.selectProjectObj =projObj;
        this.itemParentObj={};
        this.$store.state.selectProjectNode = {};
        this.pageIndex=1;
        this.loadData();
        this.$nextTick(()=>{
          this.tableHeightNum=this.$refs.tablebox.offsetHeight
        })
    },
    methods:{
      changeType(num){
        this.creatType=num
      },
      exportIn() {
        if(!this.itemParentObj.id) {
          this.util.warn('请先选择目录！')
          return false;
        }
        // this.importVisable=true
        this.handlerOpenSelectPurpose()
      },
      loadCompanyItem(node,resolve){//加载企业库
        this.loading = true
        let row = this.currentSelectedPurpose
        let formKey = 't_gdb_jcbz_company'
        getConfig(formKey, this).then(res=>{
          let forms = res.forms
          let form = forms.find(form=>{
            return this.validUtil.isNull(form.parentId)
          })
          // console.log('--------',form)
          let params = {
            formKey: formKey,
            id: form.id,
            queryParams: [
              {key: "PARENT_ID_", value: row.id} ,
              {key: "PROJ_PURPOSE", value:row.PROJ_PURPOSE},
              {key: "PROJ_LX", value: row.PROJ_LX},
              {key: "ItemNO", value: row.ItemNO},
              {key: "DEK_", value: row.DEK_},
              {key: "TYPE_", value: row.TYPE_}]
          }
          getTreeData(params, this).then(data=>{
            // console.log('------data-----',data)
            this.importTreeData = data
            this.loading = false
            // resolve(data);
          }).catch(e=>{
            this.importTreeData = []
            this.loading = false
            // resolve([]);
          })
        }).catch(e=>{
          // resolve([]);
          this.importTreeData = []
          this.loading = false
        })

      },
      handleSelectionChange(value){
          this.selectedList = value;
      },
      deleteCatalog(type){
        var deleteStr = "确定要删除该数据吗？";
        //0删除目录，1删除检查项
        if(type==0&&this.itemParentObj.children!=undefined){
          deleteStr ="该目录包含下级,确定要删除吗？";
        }
        if(type==0&&this.tableData.length>0){
          this.util.error("该目录包含检查项不能删除!");
          return;
        }
        if(type==0&&this.itemParentObj.id==undefined){
          this.util.error("请先选择要删除的数据!");
          return;
        }
        if(type==1&&this.selectedList.length==0){
          this.util.error("请先选择要删除的数据!");
          return;
        }
        this.util.confirm(deleteStr,"提示",(res)=>{
            this.util.mask("正在删除..");
            var deleteId="";
            if(type==0){
                deleteId=this.itemParentObj.id;
            }else{
                deleteId = this.selectedList.map(item=>item.id).join(",");
            }
//          this.util.restDelete("/api_v1/construction/inspect/batchDeleteCheckItem?ids="+deleteId,null,(res)=>{
            	 this.util.restDelete("/api_v1/construction/inspect/batchDeleteCheckItem/"+deleteId+'/'+'T_INSPECT_ITEM',null,(res)=>{

                this.util.unmask();
                if(res.status==200){
                    this.util.successToast('删除成功!');
                    if(type==0){
                      this.loadData();
                    }else{
                      this.loadCheckItemList(this.itemParentObj);
                    }

                }else{
                    this.util.failueToast('删除失败!');
                }

            });
        });


      },
      editMember(item){//编辑检查项
        this.mainData={id:item.id,TYPE_:item.type,SORT_:item.sort,NAME_:item.itemName,
          PROJ_TYPE_:item.projType,LB_:item.lb,CHECK_REQUIRE_:item.checkRequire,MIN_SAMPLE_:item.minSample};
          this.isAddPart=true;
      this.editFlag=false
      },
      addCheckItem(){//新增检查项
        if(this.itemParentObj.id==undefined){
          this.util.alert("请先选择分项!");
          return;
        }
        this.mainData={TYPE_:this.itemParentObj.type,SORT_:this.totalCount+1,LB_:"实测项"};
        this.isAddPart=true;
      this.editFlag=false
      },
      editCheckCatalog(){//编辑目录
        if(this.itemParentObj.id==undefined){
          this.util.alert("请选择需要编辑的分项!");
          return;
        }
        if(this.itemParentObj.id.substring(0,4)=="root"){
          this.util.error("根目录不可编辑");
          return;
        }
        this.mainData={TYPE_:this.itemParentObj.type,id:this.itemParentObj.id,LB_:this.itemParentObj.lb,NAME_:this.itemParentObj.label};
        this.editFlag=true
        this.isAddCatalog=true;
      },
      addCheckCatalog(){//添加目录
        if(this.itemParentObj.id==undefined){
          this.util.alert("请先选择分项!");
          return;
        }
        this.editFlag=false
        this.mainData={TYPE_:"measure"};
        this.isAddCatalog=true;
      },
      loadData(node,loadType){//加载检查项目录
          // this.tempNode = node;
          if(node==undefined){
            this.tempCheckItem = [{id:"root",label:"实测",children:[]}];
            this.$forceUpdate();
            return;
          }
          if(node!=undefined&&node.children!=undefined&&node.children.length>0&&loadType!="reload"){
            return;
          }
          let params={
              parentUid:node==undefined? "root":node.id,
              projUid:this.selectProjectObj.id,
              formType:'measure',
              // type:this.checkType
          }
          this.util.mask();
          this.util.restGet('/api_v1/construction/inspect/inspectItemCatalog', params, (res)=> {
              this.util.unmask();
              if(node==undefined){
                this.tempCheckItem=res.data;
              }else{
                this.$set(node,"children",res.data);
              }
          });

      },
      loadData_bak(){
          this.util.mask();
          this.util.restGet('/api_v1/construction/inspect/checkItemCatalog', {projUid:this.selectProjectObj.id,formType:'measure'}, (res)=> {
              console.log(res);
              this.util.unmask();
              if(res.status==200){
                this.models=res.data;
              }else{
                this.models=[];
              }
              this.$forceUpdate();
          });
      },
      changePageSize(value){
          this.pageSize=value;
          this.loadCheckItemList(this.itemParentObj);
      },
      changePageNum(value){
          this.pageIndex=value;
          this.loadCheckItemList(this.itemParentObj);
      },
      loadCheckItemList(data){
          this.itemParentObj =data;

          var params = {
              projUid:this.selectProjectObj.id,
              parentUid:data.id.substring(0,4)=="root"? "root":data.id,
              type:data.type,
              pageSize:this.pageSize,
              pageIndex: this.pageIndex
          };
          this.util.mask();
          this.util.restGet('/api_v1/construction/inspect/getCheckItemData', params, (res)=> {
              this.util.unmask();
              if(res.status==200&&res.data!=undefined){
                this.tableData=res.data;
                this.totalCount=res.totalCount;
              }else{
                this.tableData=[];
              }
          });
      },
      saveData(type){
          if(!this.validUtil.isNotEmpty(this.mainData.NAME_)){
              this.util.error("请填写名称!");
              return;
          }
          if(!this.validUtil.isNotEmpty(this.mainData.LB_)){
              this.util.error("请选择类别!");
              return;
          }
          this.mainData.PROJ_UID_=this.selectProjectObj.id;
          if(!this.editFlag){
            this.mainData.PARENT_ID_=this.itemParentObj.id.substring(0,4)=="root"? "root":this.itemParentObj.id;
          }
            this.mainData.FORM_TYPE_  = 'measure'
          var params = {mainFormData:JSON.stringify(this.mainData),sqlTableName:"T_INSPECT_ITEM",ifSaveWorkflow:false};
          if(this.validUtil.isNotEmpty(this.mainData.id)){
            params['id']=this.mainData.id;
            params['businessKey']=this.mainData.id;
          }
          this.util.mask("正在保存..");
          this.util.restPost("/api_v1/form/business",params,(res)=>{
            if(res.status==200){
              this.util.successToast('保存成功');
              if(type==0){
                this.isAddCatalog=false;
                this.loadData();
              }else{
                this.isAddPart=false;
                this.loadCheckItemList(this.itemParentObj);
              }

            }
            this.util.unmask();
          });
      },
      selectCheckNode(node){
	        this.$set(node,"selected",true);
          if(node.parents!=undefined&&node.parents!=""){
              this.selectCheckNode(node.parents);

          }
      },
      selectNodeCallback(data) {
          if(data.selected){
	          this.selectCheckNode(data.parents);

          }else{
            if(data.children!=undefined){
              this.cancelCheckNode(data.children);
            }

          }
      },
      cancelCheckNode(nodeList){
          nodeList.forEach(item=>{
              this.$set(item,"selected",false);
              if(item.children!=undefined&&item.children.length>0){
                  this.cancelCheckNode(item.children);

              }

          });
      },
      selectImportData(dataList){
          dataList.forEach(item=>{
              if(item.selected){
                this.importData.push(item);
              }
              if(item.children!=undefined&&item.children.length>0){
                this.selectImportData(item.children)
              }

          });
      },
      _deepTreeData(selectedData,parentColumn){ // 递归组装数据
        let result = []
        selectedData.forEach(item=>{
          let id = item['id'] || item['ID_']
          let itemParentId = item[parentColumn]
          let isTop = true // 判断是否选中的第一层

          // console.log('-----item----1--',item.NAME_)
          selectedData.forEach(child=>{
            let childId = child['id'] || child['ID_']
            let parentId = child[parentColumn]

            if(this.validUtil.isNotNull(itemParentId)){
              // 在选中节点中能找到上级，所以不是顶层
              if(itemParentId === childId){
                isTop = false
              }
            }
          })
          // console.log('-----item----2--',item.children)

          if(isTop){
            result.push(item)
          }
        })
        return result
      },
      saveImportData(){//导入
        // this.importData=[];
        // this.selectImportData(this.tempCheckItem);

        let selectedData = this.$refs.tree.getCheckedNodes();
        // let recieve = this.$refs.tree.getHalfCheckedNodes();//半选中
        // console.log('-------selectedData-------', selectedData)
        let srcData = this._deepTreeData(selectedData, 'parentId')
        // console.log('-------srcData-------', srcData)
        let srcFormKey = 't_gdb_jcbz_company'
        let desFormKey = 't_inspect_item'
        let desFormInfoId = this.desFormInfoId // 'd8c44258ad5f49ee92c33b5c97879a90'  // 项目检查库目录
        let desRootId = 'root'
        let desId = this.itemParentObj.id.indexOf('root_')>-1?'root':this.itemParentObj.id
        let desParentId = null
        let desParams = {
          TYPE_: this.checkType,
          PROJ_UID_: this.selectProjectObj.id,
          FORM_TYPE_: this.util.getUrlParam('formType')
        }
        let desQueryParams = [{
          key: 'TYPE_',
          value: this.checkType
        },{
          key: 'PROJ_UID_',
          value: this.selectProjectObj.id
        }]

        let params = {srcFormKey, srcData, desFormKey, desFormInfoId, desRootId, desId, desParentId, desParams, desQueryParams, delete: false}
        // console.log('-------params-------',params)
        // return
        // return
        // console.log('--------params-------',params)
        copyTreeData(params, this).then(res => {
          // console.log('--------copyTreeData-------',res)
          // this.cascade = false
          this.util.successToast("导入成功！");
          this.importVisable=false;
          this.loadData();
        })
      },
      handlerOpenSelectPurpose() { // 选择业态
        // console.log('---this.selectProjectObj---',this.selectProjectObj)
        let params = {
          'PROJ_LX_': this.selectProjectObj.classify,
          'TYPE_': this.checkType,
          'PROJ_UID_': this.selectProjectObj.id,
          pageIndex:1,
          pageSize:1000
        }
        getByApi('t_inspect_mulu',params).then(data=>{
          if(!data){
            this.util.error("企业库未设置，请先设置企业库检查项!");
            return;
          }
          this.projPurposeList = data
          if(data ){
            if( data.length === 1){
              this.currentSelectedPurpose = data[0]
              this.handlerConfirmSelectPurpose()
            }else{
              this.selectedPurposeVisible=true
            }

          }else{
            this.util.warn('您没有配置对应企业库！')
          }
          // console.log('----handlerOpenSelectPurpose-----',data)
        })
      },
      handleCurrentChange(val){ // 选中业态
        this.currentSelectedPurpose = val;
      },
      handlerConfirmSelectPurpose() { // 选择业态
        this.selectedPurposeVisible = false
        // console.log('handlerConfirmSelectPurpose===',this.currentSelectedPurpose)
        this.importVisable = true
        this.loadCompanyItem()
      }

    },
    components:{
      // asideItem,
      selectTree,
      FilePopUp
    }
  }
</script>

<style scoped>
  .Documents{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 10px 0 0 0 ;
    color: #44D2FF;
    font-size: 14px;
    position: relative;
  }
  .tabs-box{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 10px;
    box-sizing: border-box;
  }
  .tabs{
    width: 100%;
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
  }
  .tabs>.active{
    background: url(../../assets/indexImg/select.png) no-repeat  top center;
  }
  .conter{
    height:100%;
    box-sizing: border-box;
    overflow: auto;
  }
  .conter_left{
    float: left;
    width:320px;
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    padding:13px 0 13px 14px;
    box-sizing: border-box;
    position: relative;
    min-height: 100%;
  }
  .conter_right{
    box-sizing: border-box;
    height: 100%;
    overflow: hidden;
    padding-left: 10px;
  }
  .conter_right_box{
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    box-sizing: border-box;
    padding:10px 0 85px 14px;
    height:100%;
    width:100%;
  }
  .clear::after{
    content:"";
    height:0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
  }
  .tables{
    border-color: rgba(68,210,255,1);
  }
  .title_left{
    float: left;
  }
  .title_left h4{
    margin-bottom: 0;
  }
  .title_right{
    float: right;
  }
  .title_right button{
    padding:4px 10px;
  }
  .conter_left_title{
    margin-bottom: 14px;
    padding-right: 14px;
  }
  .aside-box {
    text-align: left;
    box-sizing: border-box;
    padding:0 10px 0 0px;
  }
  .conter_right_title{
    margin-bottom: 23px;
  }
  .conter_right_title h4{
    margin-bottom: 0;
  }
  .operation span{
    margin:0 5px;
    display: inline-block;
  }

  .title-button{
    float: right;
  }
  .add-part-box{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 80;
    }
    .add-part-box .add-part{
        width: 406px;
        position: absolute;
        top: 50%;
        left: 50%;
        background: #fff;
        transform: translate(-50%,-50%);
        padding: 10px 20px;
    }
    .add-part p{
        font-size: 18px;
        color: #333;
        text-align: left
    }
    .select-msg-box{
        color: #333;
        line-height: 38px;
        height: 38px;
        margin: 20px 0;
    }
    .select-msg-ele{
        width: 296px;
        line-height: 38px;
        height: 38px;
        color: #333;
        width: 296px;
        border: 1px solid #ccc;
        border-radius: 1px ;
        box-sizing: border-box;
    }
    .add-part-box button{
        font-size: 14px;
        background: #5C9AD4;min-width: 60px;
        padding: 5px;
        height: 28px;

    }
    .add-part-box span{
      width: 80px;
      display: inline-block;
    }

  .remark{
    position:absolute;
    bottom:38px;
    text-align: left;
    padding-left: 27px;
    margin-top: 10px;
  }
  .remark p{
    color: #808080;
    font-size: 12px;
    line-height: 2;
    color: #999;
    text-align: left;
    font-size: 13px;
  }
  .remark-content{
    color: #808080;
    font-size: 12px;
    line-height: 2;
    color: #999;
    text-align: left;
    font-size: 13px;
  }
</style>
<style>
  .Documents .el-table th div,.Documents  .el-table--border th:first-child .cell{
    text-align: center;
     color:rgba(68,210,255,1);
  }
 .Documents .el-table__row td{
    color:#fff;
  }
   .bg .Documents .el-table--enable-row-transition .el-table__body td:first-child{
     text-align: center;
   }
   .bg .Documents .el-table--enable-row-transition .el-table__body td:last-child{
     text-align: center;
   }
   .bg .Documents .el-table--enable-row-transition .el-table__body td:last-child span{
     margin:0 3px;
   }
  .Documents .openDialog .el-table__row td {
    color: #2b1d1d;
  }
</style>
