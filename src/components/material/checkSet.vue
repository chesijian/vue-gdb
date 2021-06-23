<template>
  <div class="Documents">
    <div class="conter clear">
      <div class="conter_left" style="padding-bottom: 55px;box-sizing: border-box;">
        <div class="conter_left_title clear">
          <div class="title_left">
            <h4>目录</h4>
          </div>
          <div class="title-button">
                <button @click="editCheckCatalog" v-if="sessionUtil.isAllowBtn('gc2_2:catalog_btn_edit')">编辑</button>
                <button @click="addCheckCatalog" v-if="sessionUtil.isAllowBtn('gc2_2:catalog_btn_add')">添加</button>
                <button @click="deleteCatalog(0)" v-if="sessionUtil.isAllowBtn('gc2_2:catalog_btn_delete')">删除</button>
              </div>
        </div>
        <div class="aside-box" style="height:100%;">
          <asideItem v-for="(item, index) in models"  :key="index" :models="item" :level="0" ></asideItem>
        </div>
      </div>
      <div class="conter_right">
        <div class="conter_right_box">
          <div class="conter_right_title" style="overflow:hidden">
            <h4 style="float:left">检查项</h4>
            <div class="title-button" style="padding-right:20px;">
              <button @click="addCheckItem()" v-if="sessionUtil.isAllowBtn('gc2_2:btn_add')">添加</button>
              <button @click="deleteCatalog(1)" v-if="sessionUtil.isAllowBtn('gc2_2:btn_delete')">删除</button>
              <button @click="importVisable=true" v-if="sessionUtil.isAllowBtn('gc2_2:exprot')">导入</button>
            </div>
          </div>
          <div class="aside-box" style="height:100%;" ref="tablebox">
            <el-table :data="tableData" :height="tableHeightNum" border @selection-change="handleSelectionChange">
              <el-table-column  label="选择" width="50" type="selection"></el-table-column>
              <el-table-column prop="" label="操作" width="80">
                <template slot-scope="scope"  v-if="sessionUtil.isAllowBtn('gc2_2:btn_edit')">
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
              <el-table-column prop="typeName" label="类型" width="80">
              </el-table-column>
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

    <div class="add-part-box" v-if="importVisable" >
        <div class="add-part" style="height: 90%;overflow: hidden;padding:40px  20px;box-sizing:border-box;">
          <p style="position:absolute;top:10px;left:20px;">企业检查项</p>
            <div style="height:100%;width:100%;position:relative;overflow-y:auto;">
                <selectTree v-for="(item, index) in tempCheckItem"  :key="index" :models="item" :level="0" ></selectTree>
            </div>
            <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
                <button style="margin-right:20px;" @click="importVisable=false">关闭</button>
                <button @click="saveImportData()">保存</button>
            </div>
        </div>
    </div>

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
                </el-select>
            </div>
              <div class="select-msg-box">
                <span>类别</span>&nbsp;&nbsp;
                <el-select v-model="mainData.LB_" size="mini" class="select-msg-ele" placeholder="请选择">

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
  import asideItem from '../common/asideItem.vue'
  import selectTree from '../common/selectTree.vue'
  import FilePopUp from '../common/FilePopUp.vue'
  export default {
    data(){
      return{
        items:[],
        importVisable:false,
        isAddPart:false,
        isAddCatalog:false,
        editFlag:false,
        mainData:{},
        creatType:0,
        models:[],
        importData:[],
        tempCheckItem:[], //检查项导入模板
        tableData: [],
        itemParentObj:{},//选中的目录
        selectedList:[],//选中的检查项
        totalCount:0,
        pageSize:10,
        pageIndex:1,
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
    	console.log(this.$store.state.projectName)
    	console.log(this.$store.state.projPurpose)
      this.$bus.on("handelDeparts",this.loadCheckItemList);
      this.$bus.on("selectNoded",this.selectNodeCallback);
      this.$bus.on("loadChildren",this.addList);

    },
    beforeDestroy() {
          this.$bus.off('handelDeparts', this.loadCheckItemList);
          this.$bus.off('selectNoded', this.selectNodeCallback);
          this.$bus.off('loadChildren', this.addList);
    },
    mounted(){
        var projObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.$store.state.selectProjectObj =projObj;
        this.itemParentObj={};
        this.pageIndex=1;
        this.loadData();
        this.addList();
        this.$nextTick(()=>{
          this.tableHeightNum=this.$refs.tablebox.offsetHeight
        })
    },
    methods:{
      changeType(num){
        this.creatType=num
      },
//    addList(data) {
//        if(data!=undefined&&data.children!=undefined){
//          return;
//        }
////        var parentUid = data==undefined? "root":data.id;
//        var list = {}
//        list.parentUid = data==undefined? "root":data.sign;
//        list.moduleType= 'measure'// 模块类别
//        list.projType= this.$store.state.projectName;//项目类型
//        list.projPurpose=this.$store.state.projPurpose;// 业态
//        this.util.mask();
////        this.util.restGet('/api_v1/construction/inspect/checkItemStandards', {parentUid:parentUid}, (res)=> {
//        	this.util.restGet('/api_v1/construction/inspect/getCheckItemEnterprise', list, (res)=> {
//            this.util.unmask();
//            console.log('res123123213',res)
//            if(data==undefined){
//              this.tempCheckItem=res.data;
//            }else{
//              this.$set(data,"children",res.data);
//            }
//
//
//        });
//    },
      addList(data) {
          if(data!=undefined&&data.children!=undefined){
            return;
          }
//        var list = {}
//        list.parentUid = data==undefined? "root":data.sign;
//        list.moduleType= 'measure'// 模块类别
//        list.projType= this.$store.state.projectName;//项目类型
//        list.projPurpose=this.$store.state.projPurpose;// 业态
          this.util.mask();
               var parentUid = data==undefined? "root":data.id;
          this.util.restGet('/api_v1/construction/inspect/checkItemStandards', {parentUid:parentUid}, (res)=> {
//        	this.util.restGet('/api_v1/construction/inspect/getCheckItemEnterprise', list, (res)=> {
              this.util.unmask();
              console.log('res123123213',res)
              if(data==undefined){
                this.models=res.data;
              }else{
                this.$set(data,"children",res.data);
              }
          });
      },
      handleSelectionChange(value){
          this.selectedList = value;
      },
      deleteCatalog(type){
        //0删除目录，1删除检查项
        if(type==0&&this.itemParentObj.children!=undefined){
          this.util.error("该目录包含下级不能删除!");
          return;
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
        this.util.confirm("确定要删除该数据吗?","提示",(res)=>{
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
        this.mainData={TYPE_:this.itemParentObj.type,SORT_:this.totalCount+1};
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
        this.mainData={TYPE_:this.itemParentObj.type};
        this.isAddCatalog=true;
      },
      loadData(){
          this.util.mask();
          this.util.restGet('/api_v1/construction/inspect/checkItemCatalog', {projUid:this.selectProjectObj.id,formType:'material'}, (res)=> {
              console.log(res);
              this.util.unmask();
              if(res.status==200){
                res.data[0].id="root_quality";
                res.data[1].id="root_safety";
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
          this.mainData.FORM_TYPE_  = 'material'
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
      saveImportData(){//导入
        this.importData=[];
        // console.log(this.tempCheckItem);
        this.selectImportData(this.tempCheckItem);
        var resultList = [];
        this.importData.forEach(item=>{
            // delete item.parents
            // delete item.children
            
            
            resultList.push({
              flag: item.flag,
              id: item.id,
              itemName:item.itemName,
              lb: item.lb,
              minSample:item.minSample,
              parentUid: item.parentUid,
              projType: item.projType,
              sign: item.sign,
              sort: item.sort,
              type: item.type,
              formType : 'material',
              projUid : this.selectProjectObj.id
              
            });
        });
        
        this.util.mask("正在导入");
//        this.util.restPost('/api_v1/construction/inspect/'+this.selectProjectObj.id+'/checkItem/T_INSPECT_ITEM', {_list: resultList}, (res)=> {
	 this.util.restPost('/api_v1/construction/inspect/checkItem/T_INSPECT_ITEM', {_list: resultList}, (res)=> {
              if (res.status == 200) {
                  this.util.successToast("导入成功！");
                  this.importVisable=false;
                  this.loadData();
              }else if(res.status==500102){
                this.util.failueToast("导入数据过多，请分批导入!");
              } else {
                  this.util.failueToast(res.errorMsg);
              }
              this.util.unmask();
          });
      },

    },
    components:{
      asideItem,
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
</style>
