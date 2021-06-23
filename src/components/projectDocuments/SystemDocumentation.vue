<template>
  <div class="Documents-class">
    <div class="conter clear">
      <div class="conter_left" style="padding-bottom:50px;box-sizing: border-box;">
        <div class="conter_left_title clear">
          <div class="title_left">
            <h4>目录</h4>
          </div>
          <div style="float:right;">
              <button @click="importVisable=true" v-if="sessionUtil.isAllowExport('t_doc_ProjDocument_File')">导入</button>
              <button @click="editCatalogue()" v-if="sessionUtil.isAllowEdit('t_doc_ProjDocument_File')">编辑</button>
              <button @click="addCatalogue()" v-if="sessionUtil.isAllowAdd('t_doc_ProjDocument_File')">添加</button>
              <button @click="deleteFolder()" v-if="sessionUtil.isAllowDelete('t_doc_ProjDocument_File')">删除</button>
            </div>
        </div>
        <div class="aside-box" style="height:100%;overflow: auto;">
          <asideItem v-for="(item, index) in models"  :key="index" :models="item" :level="0" ></asideItem>
        </div>
      </div>
      <div class="conter_right" style="height:100%;box-sizing: border-box;">
        <div class="conter_right_box">
          <div class="conter_right_title clear" >
            <h4 style="float:left;">文件</h4>
            <div style="float:right;padding-right:10px;box-sizing:border-box">
              <div class="search-box" style="float:left;margin-right:20px">
                <input type="text" v-model="searchText" @keydown.enter="loadContentData()">
                <i></i>
                <button @click="loadContentData">搜索</button>
              </div>
              <button style="float:left;margin-right:20px;" @click="addFill"  v-if="sessionUtil.isAllowAdd('t_doc_ProjDocument_File')">添加</button>
              <button style="float:left;margin-right:20px;" @click="deleteFile()" v-if="sessionUtil.isAllowDelete('t_doc_ProjDocument_File')">删除</button>
              <button style="float:left;margin-right:20px;" @click="showMoveHadel">转移目录</button>
              <button style="float:left;" @click="setPermission()">批量设置权限</button>
            </div>
          </div>
          <div class="aside-box" ref="tablebox" style="height:100%;">
            <el-table :data="tableData" :height="tableHeightNum" border @selection-change="handleSelectionChange">
              <el-table-column  label="选择" width="60" type="selection">
              </el-table-column>
              <el-table-column prop="fileName" label="文件名称" >
              </el-table-column>
              <el-table-column prop="createUserName" label="上传人" width="90">
              </el-table-column>
              <el-table-column prop="createDate" label="上传时间" width="160">
              </el-table-column>
              <el-table-column  label="操作" width="150"  >
                <template slot-scope="scope" class="operation">
                  <a @click="loading(scope.row)" v-if="sessionUtil.isAllowEdit('t_doc_ProjDocument_File')">
                <img src="../../assets/indexImg/daoru.png" width="18" alt=""></a>
                  <span @click="seeFile(scope.row)" v-if="sessionUtil.isAllowEdit('t_doc_ProjDocument_File')"><img src="../../assets/indexImg/chayuan.png" width="18" alt=""></span>
                  <span @click="deleteFile(scope.row)" v-if="sessionUtil.isAllowDelete('t_doc_ProjDocument_File')"><img src="../../assets/indexImg/del.png" width="18" alt=""></span>
                  <span @click="QRcode(scope.row)" ><img src="../../assets/indexImg/erma.png" width="18" alt=""></span>
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: right;">
              <el-pagination  @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>


    <div v-if="isAddPart">
      <div  class="add-part-box" @click.stop.prevent="cancel" ></div>
      <div class="add-part" style="width:438px;overflow: auto;max-height: 600px;">
          <p>{{addPartObj.title}}</p>
          <div v-if="!addPartObj.isSetting">
            <div class="select-msg-box">
              <span style="float:left">{{addPartObj.nameTitle}}</span>&nbsp;&nbsp;
              <el-input v-model="addPartObj.name" size="mini" class="select-msg-ele" placeholder="请输入" style="padding-left: 10px;overflow: hidden;"></el-input>
              <div class="add-flag" v-if="addFlag">
                <span >目录名称已存在，请重新输入</span>
              </div>
            </div>
            <div class="select-msg-box" v-if="addPartObj.title=='文件'">
              <span style="float:left">文件编号</span>&nbsp;&nbsp;
              <el-input v-model="addPartObj.code" size="mini" class="select-msg-ele" placeholder="请输入" style="padding-left: 10px;overflow: hidden;"></el-input>
            </div>
            <div class="select-msg-box" v-if="addPartObj.title=='目录'">
              <span style="float:left">类别编码</span>&nbsp;&nbsp;
              <el-input v-model="addPartObj.code" size="mini" class="select-msg-ele" placeholder="请输入类别编码" style="padding-left: 10px;overflow: hidden;"></el-input>
            </div>
            <div class="select-msg-box" v-if="addPartObj.title=='目录'">
              <span style="float:left">排序号</span>&nbsp;&nbsp;
              <el-input v-model="addPartObj.sort" size="mini" class="select-msg-ele" placeholder="请输入排序号" style="padding-left: 10px;overflow: hidden;"></el-input>
            </div>
            <div class="doc-wrap" v-if="addPartObj.title == '文件'">
              <!-- <p>文档列表:</p> -->
              <p class="add-page-form-title" style="color:#333;overflow:hidden;" >
                文档列表
                <uploading v-model="uploadingName"  :config="uploadConfig" ref="uploading" addbtn="true"></uploading>
              </p>
              <ul>
                <li v-for="(item, index) in currentFileList" :key="index">
                  <span>{{item.fileName}}</span>
                  <div class="file-box">
                    <a v-if="!item.isNewFlag" :href="util.getBaseUrl() + '/api_v1/files/'+item.fileId+'/download?access_token='+sessionUtil.getAccessToken()">
                      <img src="../../assets/administrationIcon/daoru.png" width="18" alt="">
                    </a>
                    <img @click="deleteSingleFile(item)" v-if="sessionUtil.isAllowBtn('gc9:btn_delete')" src="../../assets/administrationIcon/remove.png" width="16" alt="">
                    <img src="../../assets/asideIcon/preview.png" @click="util.onPreview(item)" alt="">
                  </div>
                  
                </li>
              </ul>
            </div>
            <div style="padding-bottom: 15px;">
              <span>是否合并</span>
              <el-switch v-model="addPartObj.ifmerge" ></el-switch>
            </div>
          </div>
            
          <div class="select-member-box">
              <span>成员权限</span>&nbsp;&nbsp;<br/>
              <ul class="clear" style="margin-left:6px">
                <li v-for="(item, index) in addPartObj.memberList" :key="index" @click.stop.prevent="addMember" class="member-item">
                  <i @click.stop.prevent="deleteMember(item)"></i>
                  <img :src="item.picture? item.picture:$store.state.defaultLogo" alt="">
                  <span style="display:block;width:60px">{{item.userName}}</span>
                </li>
                <li style="margin-left:9px;"><img src="../../assets/indexImg/add.png" @click.stop.prevent="addMember" alt=""></li>
              </ul>
          </div>
          <div class="select-member-box" style="padding-top: 10px;">
              <span>角色权限</span>&nbsp;&nbsp;<br/>
              <ul class="clear" style="margin-left:6px">
                <li v-for="(item,index) in selectRoles" :key="index" style="padding-right: 10px;">
                  <el-tag style="width: auto;" closable @close="selectRoles.splice(index, 1)">{{item.roleName}}</el-tag>
                </li>
                <li style="margin-left:9px;">
                  <img style="width: 32px;height: 32px;" src="../../assets/indexImg/add.png" @click="selectRoleModels.isShow=true" alt="">
                </li>
              </ul>
          </div>
          
          <div style="float:right;padding-top:10px">
              <button style="margin-right:20px;" @click.stop.prevent="cancel">关闭</button>
              <button @click.stop.prevent="saveMsg">保存</button>
          </div>
      </div>
    </div>
    <div v-if="isUpLoadingShow">
      <div  class="add-part-box" style="z-index:98" @click.stop.prevent="cancelLoading" ></div>
        <div class="add-part" style="min-height:340px;z-index:99">
          <p style="margin-bottom:10px;">添加文件</p>
          <uploading v-model="uploadingName"  :config="uploadConfig" ref="uploading" ></uploading>
          <div style="float:right;padding-top:10px;position:absolute;bottom:20px;right: 20px;">
              <button style="margin-right:20px;" @click.stop.prevent="cancelLoading">关闭</button>
              <button @click.stop.prevent="saveFill">保存</button>
          </div>
        </div>
    </div>
    <div v-if="isQRcodeShow">
      <div  class="add-part-box" style="z-index:98" @click.stop.prevent="QRcodeCancel()" ></div>
      <div class="add-part QR-code" style="width:300px;height:376px;z-index:99">
        <p><i></i>筑筑<s  @click.stop.prevent="QRcodeCancel()"></s></p>
        <div class="QR-code-content">
          <div class="QR-code-content-title" style="width:220px;height:30px;line-height:30px;font-size:17px;border-radius:15px;text-align: center;">{{$store.state.selectProjectObj.proName}}</div>
          <div class="QR-code-img" style="width:168px;height:159px;border-radius:15px;padding:5px;box-sizing:border-box"><img :src="util.getBaseUrl()+'/api_v1/qr?content='+QRcodeObj.url+'&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt=""></div>
          <div class="QR-code-img" style="background:transparent;color:#fff;padding-left: 10px;">{{QRcodeObj.fileName}}</div>
        </div>
        <div style="text-align:right;padding:5px 10px 0 0;box-sizing:border-box;">
          <span>{{QRcodeObj.createUserName}}</span>
        </div>
      </div>
    </div>
    <el-dialog  :title="deleteObj.deleteMsg1" :visible.sync="dialogVisible" width="30%">
      <p>{{deleteObj.deleteMsg2}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteFill">确 定</el-button>
      </span>
    </el-dialog>

    <div v-show="importVisable" >
        <div class="add-part" style="height: 90%;overflow: hidden;padding:40px  20px;box-sizing:border-box;">
          <p style="position:absolute;top:10px;left:20px;">导入文档模板</p>
            <div style="height:100%;width:100%;position:relative;overflow-y:auto;">
              <el-tree show-checkbox node-key="id" :data="tempDatas" :default-expanded-keys="['root']" :props="defaultProps" ref="tree">
            </el-tree>
            </div>
            <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
                <button style="margin-right:20px;" @click="importVisable=false">关闭</button>
                <button @click="saveImportData()">保存</button>
            </div>
        </div>
    </div>
    <!-- 移动 -->
    <div v-show="showMovePagel" >
        <div class="add-part" style="height: 90%;overflow: hidden;padding:40px  20px;box-sizing:border-box;">
          <p style="position:absolute;top:10px;left:20px;">移动</p>
            <div style="height:100%;width:100%;position:relative;overflow-y:auto;">
              <el-tree node-key="id" :data="models" :props="defaultProps" @node-click="handleNodeClick" highlight-current ref="moveTree">
            </el-tree>
            </div>
            <div style="float:right;padding-top:10px;position:absolute;bottom:10px;right:20px;">
                <button style="margin-right:20px;" @click="showMovePagel=false">关闭</button>
                <button @click="moveConfirm()">保存</button>
            </div>
        </div>
    </div>
    <selectRole class="rolrdiv" style="color:#000" :selectRoleModels="selectRoleModels"></selectRole>
    <selectMember :selectMemberModels='selectMemberModels'  :memberList="addPartObj.memberList" ref="selectModule"></selectMember>
  </div>
</template>

<script>
  import asideItem from '../common/asideItem.vue'
  import FilePopUp from '../common/FilePopUp.vue'
  import selectMember from '../common/selectMember.vue'
  import uploading from '../common/uploading.vue'
  import selectRole from '../common/selectRole.vue'
  export default {
    data(){
      return{
        showMovePagel:false,
        catalogFormKey:"t_doc_ProjCatalog",
        fileFormKey:"t_doc_ProjDocument_File",
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        selectRoleModels: {
					isShow: false,
					selectList: [],
					callBack: this.selectRoleCallBack,
					radioSelectFlags: false
				},
        uploadConfig:{
          limit: 50,
          limitSize: 500485760,
          readOnly: false,
          xtype: "test",
          formKey:this.fileFormKey,
          // accept: ".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.pdf,.PDF,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xlsx,.zip,.rar,.txt",
        },
        uploadingName:'',
        deleteObj:{},
        searchText:'',
        isUpLoadingShow:false,
        dialogVisible:false,
        isAddPart:false,
        addFlag:false,
        selectNode:{},
        addPartObj:{},
        selectMemberModels:{
          isShow:false,
          selectList:[],
          callBack:this.callBack3,
          radioSelectFlags:false,
        },
        models:[],
        tableData: [],
        QRcodeObj:{},
        isQRcodeShow:false,
        deleteFileList:[],
        pageSize:15,
        pageIndex:1,
        total:0,
        currentPage:0,
        tableHeightNum:0,
        currentFileList: [],
        importVisable: false,
        importData:[],
        selectRoles:[],//选中的角色
        tempDatas:[]
      }
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.$bus.on('handelDeparts',this.changeTable)//选中目录
      this.$bus.on("selectNoded",this.selectNodeCallback);
      this.loadData();
    },
    beforeDestroy(){
      this.$bus.off('handelDeparts',this.changeTable)
      this.$bus.off('selectNoded', this.selectNodeCallback);
    },
    watch:{
       '$store.state.selectProjectObj.id':function(val,oldVal){
            this.loadData()
        }
    },
    mounted(){
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
      })
      this.loadDirectoryTemplates();
    },
    methods:{
      selectRoleCallBack(data){
        this.selectRoles = this.selectRoleModels.selectList;
        
      },
      //批量设置权限
      setPermission(){
        if(this.deleteFileList.length==0){
          this.util.error("请选择需要设置的文件!");
          return;
        }
        this.isAddPart=true;
        this.addPartObj={
          title:'权限设置',
          name:'',
          isSetting:true,
          memberList:[],
        }
        this.selectRoles=[];
        this.currentFileList=[];
      },
      showMoveHadel(){
        if(this.deleteFileList.length==0){
          this.util.error("请选择需要移动的文件!");
          return;
        }
        this.showMovePagel=true;
      },
      handleNodeClick(data){
        this.selectCatalog = data;
      },
      moveConfirm(){
        if(!this.selectCatalog){
          this.util.error("请选择目录");
          return;
        }
        // let ids = this.deleteFileList.map(item=>item.id);
        let ids=[];
        this.deleteFileList.forEach(item=>{
          if(item.fileUid){
            ids.push(item.fileUid);
          }else{
            ids.push(item.id);
          }
        });
        let params={checkedId:ids.join(","),moveId:this.selectCatalog.id};
        this.util.mask("正在转移..");
        this.util.restGet("/api_v1/business/fileManage/moveFile",params,(res)=>{	//请求数据data
          this.util.unmask();
          if(res.status == 200){
            this.util.successToast("移动成功！");
            this.showMovePagel=false;
            this.loadContentData();

          }else{
            this.util.successToast("移动失败！");
          }
          
        });
      },
      //获取文档目录模板
      loadDirectoryTemplates(){
        // this.util.mask();
          this.util.restGet('/api_v1/business/fileManage/documentDirectoryTemplate', null, (res)=> {
              // this.util.unmask();
              if(res.status==200&&res.data){
                  this.tempDatas=[{id:"root",label:"全部",children:res.data}];
              }else{
                  this.tempDatas=[];
              }
          });
      },
      loadTemplate(node,resolve){//加载文档模板
          var data = node==undefined? node:node.data;
          let params={
              parentUid:data==undefined? "root":data.id,
              pageIndex:1,
              search:''
          }
          this.util.mask();
          this.util.restGet('/api_v1/business/fileManage/searchDirectoryList', params, (res)=> {
              this.util.unmask();
              if(res.status==200&&res.data){
                  resolve(res.data);
              }else{
                  resolve([]);
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
      saveImportData(){//导入模板
        let dataRecieve = this.$refs.tree.getCheckedNodes();
        let recieve = this.$refs.tree.getHalfCheckedNodes();//半选中
        
        var dataList = dataRecieve.concat(recieve);
        if(dataList.length==0){
          this.util.failueToast("请选择需要导入的模板!");
          return;
        }
        var resultList = [];
        dataList.forEach(item=>{
          resultList.push({
            tempUid:item.id,
            parentUid:item.parentUid,
            code:item.code,
            label:item.label,
            sort:item.sort,
            projUid:this.$store.state.selectProjectObj.id
          });
        });
        
        let parentId = "root";//this.selectNode.id==undefined? "root":this.selectNode.id
        
        this.util.mask("正在导入");
          this.util.restPost(`/api_v1/construction/business/CatalogTemplate/${parentId}`, {_list: resultList}, (res)=> {
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
      selectNodeCallback(data) {
          if(data.selected){
	          this.selectCheckNode(data.parents);
          }else{
            if(data.children!=undefined){
              this.cancelCheckNode(data.children);
            }
          }
      },
      selectCheckNode(node){
	        this.$set(node,"selected",true);
          if(node.parents!=undefined&&node.parents!=""){
              this.selectCheckNode(node.parents);
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
      // 切换页数
      handleCurrentChange(val){
        this.pageIndex=val;
        this.loadContentData();
      },
      // 文件二维码关闭
      QRcodeCancel(){
        this.isQRcodeShow=false;
        this.QRcodeObj={};
      },
      // 文件二维码显示
      QRcode(node){
        this.isQRcodeShow=true;
        this.QRcodeObj=node;
        let fileUid = node.fileUid? node.fileUid:node.id;
        // this.QRcodeObj.url=encodeURIComponent(this.util.getBaseUrl() + '/share/'+this.QRcodeObj.fileIdList[0].fileId+'/download?fileName='+node.fileName+'&id='+this.QRcodeObj.id)
        this.QRcodeObj.url=encodeURIComponent(this.util.getBaseUrl() + '/static/wechat/index.html#/ewm?id='+ fileUid + '&projUid=' + this.$store.state.selectProjectObj.id);
      },
      // 删除单个文件
      deleteSingleFile(node) {
        if(node){
          this.deleteFileList.push(node.fileId)
        }
        this.currentFileList.splice(this.currentFileList.findIndex(item => item.fileId === node.fileId), 1)
      },
      // 删除目录
      deleteFolder(){
        if(!this.selectNode.id||this.selectNode.id=="root"){
          this.util.error('请先选择要删除的目录');
          return ;
        }
        if(this.selectNode.children){
          this.util.warn("该目录下包含子目录，不能删除!");
          return;
        }
        this.deleteObj.isFolder=true;
        this.deleteObj.deleteMsg1=this.selectNode.children? '该目录下有子目录，确定要删除吗?':'确定要删除该目录吗？';
        this.deleteObj.deleteMsg2='目录中的文件夹与文件会一并删除,无法恢复，请谨慎操作';
        this.dialogVisible = true
      },
      // 添加文件
      addFill(){
        if(!this.validUtil.isNotEmpty(this.selectNode.id)){
          this.util.error('请选择目录')
          return ;
        }
        var proj = this.$store.state.selectProjectObj;
        this.isAddPart=true;
        this.addPartObj={
          title:'文件',
          nameTitle:'文档名称',
          name:'',
          ifmerge:false,
          code:proj.proNum+"-"+this.selectNode.code+"-"+(this.total+1),
          memberList:[],
        }
        this.selectRoles=[];
        this.currentFileList=[];
      },
      // 上传文件
      upLoadIngFill(){
        this.isUpLoadingShow=true;
      },
      // 保存文件信息
      saveFill(){
        this.isUpLoadingShow=false
        this.addPartObj.file=this.uploadConfig.filesList
        // this.addPartObj.name=this.uploadConfig.filesList[0].fileName
        this.uploadConfig.filesList.forEach(item=>{
          item.isNewFlag = true;
          if(!this.currentFileList) {
            this.currentFileList = []
          }
          this.currentFileList.unshift(item);
        });
      },
      addCatalogue(){
        if(!this.selectNode.id){
          this.util.error('请先选择目录');
          return;
        }
        this.addFlag=false
        this.isAddPart=true;
        this.addPartObj={
          title:'目录',
          nameTitle:'目录名称',
          name:'',
          code:'',
          sort:this.selectNode.children? this.selectNode.children.length+1:1,
          memberList:[],
        }
        this.selectRoles=[];
      },
      // 生成文件
      saveMsg(){
        this.addPartObj.file=this.uploadConfig.filesList;
        let mainData={},subFormList=[],memberData=[];
        if(this.addPartObj.memberList&&this.addPartObj.memberList.length>0){//成员
          this.addPartObj.memberList.forEach(item=>{
            let obj={
              USER_NAME_:item.userName,
              USER_UID_:item.id,
              MEMBER_TYPE_:0,
            }
            memberData.push(obj);
          });
        }
        this.selectRoles.forEach(item=>{//角色
          let obj={
            USER_NAME_:item.roleName,
            USER_UID_:item.id,
            MEMBER_TYPE_:1
          }
          memberData.push(obj);
        });
        if(this.addPartObj.title=='目录'){
          let params={
            parentUid:this.selectNode.id?this.selectNode.id:'root',
            fileName:this.addPartObj.name
          }
          if(params.parentUid=='root'){
            params.projUid=this.$store.state.selectProjectObj.id;
          }
          this.util.restGet("/api_v1/business/fileManage/checkFileName",params,(res)=>{
            if(res.count==0){
                this.addFlag=false
            }else{
                this.addFlag=true
            }
            if(this.addFlag){
              this.util.error('目录名称已存在，请重新输入');
                return;
            }
            if(!this.validUtil.isNotEmpty(this.addPartObj.name)){
                this.util.error('请输入目录名称');
              return
            }
            mainData.NAME_=this.addPartObj.name;
            mainData.CODE_=this.addPartObj.code;
            mainData.SORT_=this.addPartObj.sort;
            mainData.PROJ_UID_=this.$store.state.selectProjectObj.id
            if(!this.addPartObj.isEdit){
              mainData.PARENT_UID_=this.selectNode.id? this.selectNode.id:'root'
            }
            var memberSubForm ={subFormForeignKey:"PARENT_UID_",subFormTable:"T_DOC_MENBER",data:JSON.stringify(memberData)};
            subFormList.push(memberSubForm);
            var params = {formKey:this.catalogFormKey,mainFormData:JSON.stringify(mainData),sqlTableName:"T_DOC_DOCUMENT_",subFormData:JSON.stringify(subFormList), ifSaveWorkflow:false};
            if(this.validUtil.isNotEmpty(this.addPartObj.id)){
              params['id']=this.addPartObj.id;
              params['businessKey']=this.addPartObj.id;
            }
            this.util.restPost("/api_v1/form/business",params,(res)=>{
              if(res.status==200){
                this.loadData();
                this.cancel()
                this.util.success('保存成功');
              }else{
                this.util.error(res.errorMsg)
              }
              this.util.unmask();
            });
          });
            
          }else if(this.addPartObj.title=='文件'){
            if(!this.addPartObj.name&&this.addPartObj.ifmerge){
              this.util.error('请输入文档名');
              return
            }
            if(!this.addPartObj.isEdit){
              if(this.validUtil.isNotEmpty(this.addPartObj.file)&&this.addPartObj.file.length==0){
                this.util.error('请上传文件');
                return
              }
              mainData.ID_=this.addPartObj.file[0].id
            }
            //遍历附件
            var filesData = [];
            if(this.currentFileList) {
              for (var i=0; i<this.currentFileList.length;i++) {
                var file = this.currentFileList[i];
                if (file.isNewFlag) {
                  filesData.push(file);
                }
              }
            }
            if(this.addPartObj.file) {
              for (var i=0; i<this.addPartObj.file.length;i++) {
                var file = this.addPartObj.file[i];
                filesData.push(file);
              }
            }
            if(this.addPartObj.ifmerge){
              mainData.IF_MERGE_=this.addPartObj.ifmerge
              mainData.FILE_NAME_=this.addPartObj.name
              mainData.FILE_CODE_=this.addPartObj.code
              mainData.PARENT_UID_=this.selectNode.id?this.selectNode.id:'root'
              mainData.PROJ_UID_=this.$store.state.selectProjectObj.id
              this.util.mask("正在保存...");
              this.executeApi({mainData,filesData,memberData,id:this.addPartObj.id},[]);
            }else{
              this.addPartObj.isEdit=false;
              let executeQueue=[];
              filesData.forEach(item=>{
                let obj={
                  mainData:{
                    FILE_NAME_:item.fileName,
                    FILE_CODE_:this.addPartObj.code,
                    PARENT_UID_:this.selectNode.id?this.selectNode.id:'root',
                    PROJ_UID_:this.$store.state.selectProjectObj.id
                  },
                  filesData:[item],
                  memberData
                }
                executeQueue.push(obj);
                
              });
              //新增
              if(executeQueue.length>0){
                let executeItem = executeQueue.shift();
                this.util.mask("正在保存...");
                this.executeApi(executeItem,executeQueue);
              }
              if(this.addPartObj.id){
                mainData.IF_MERGE_=this.addPartObj.ifmerge
                mainData.FILE_NAME_=this.addPartObj.name
                mainData.FILE_CODE_=this.addPartObj.code
                this.util.mask("正在保存...");
                this.executeApi({mainData,filesData,memberData,id:this.addPartObj.id},[]);
              }
            }
          }else{
            let dataList=[];
            this.deleteFileList.forEach(item=>{
              if(item.fileUid){
                dataList.push(item.fileUid);
              }else{
                dataList.push(item.id);
              }
            });
            let results = [...new Set(dataList)];
            let executeQueue=[];
            results.forEach(item=>{
              let obj={
                // mainData:{
                //   FILE_NAME_:item.fileName,
                //   FILE_CODE_:item.fileCode,
                // },
                filesData:[],
                memberData,
                id:item
              }
              executeQueue.push(obj);
            });
            let executeItem = executeQueue.shift();
            this.util.mask("正在保存...");
            this.executeApi(executeItem,executeQueue);

          }
          
      },
      executeApi(item,executeQueue){
          this.saveFile(item.mainData,item.filesData,item.memberData,item.id).then(( res )=>{
                if(executeQueue.length==0){//全部推送完
                    this.util.success('保存成功');
                    this.util.unmask();
                    this.loadContentData();
                    this.cancel()
                }else{
                    let executeItem = executeQueue.shift();
                    this.executeApi(executeItem,executeQueue);
                }
                
            },( err )=>{
                this.util.error(err)
                if(executeQueue.length==0){//全部推送完
                    this.util.unmask();
                    this.loadContentData();
                    this.cancel()
                }else{
                    let executeItem = executeQueue.shift();
                    this.executeApi(executeItem,executeQueue);
                }
                
                
            })
      },
      saveFile(mainData,filesData,memberData,id){
        let subFormList=[];
        var memberSubForm ={subFormForeignKey:"PARENT_UID_",subFormTable:"T_DOC_MENBER",data:JSON.stringify(memberData)};
        subFormList.push(memberSubForm);
        var params = {
          formKey:this.fileFormKey,
          // mainFormData:JSON.stringify(mainData),
          sqlTableName:"T_FILE",
          subFormData:JSON.stringify(subFormList),
          filesData: JSON.stringify(filesData), 
          deleteFilesData: JSON.stringify(this.deleteFileList),
          ifSaveWorkflow:false
        };
        if(mainData){
          params.mainFormData=JSON.stringify(mainData);
        }
        if(id){
          params['id']=id;
          params['businessKey']=id;
        }
        let $this=this;
        return new Promise(function(reslove,reject) {
            $this.util.restPost("/api_v1/form/business",params,(res)=>{
                if (res.status == 200) {
                    reslove(res)
                }else{
                    reject(res.errorMsg);
                }
            });
        });
        
      },
      loading(item) {
        if(item.fileCode=="attachment"){
          window.open(`${this.util.getBaseUrl()}/api_v1/files/${item.id}/download?access_token=${this.sessionUtil.getAccessToken()}`);
        }else{
          window.open(`${this.util.getBaseUrl()}/share/downloadZipFile?id=${item.id}&name=${item.fileName}`);
          // window.location.href= this.util.getBaseUrl()+"/share/downloadZipFile?id="+item.id;
        }
         
      },
      cancelLoading(){
        this.isUpLoadingShow=false
        
      },
      deleteMember(node){
        for (let i = 0; i < this.addPartObj.memberList.length; i++) {
          if(node.id== this.addPartObj.memberList[i].id){
             this.addPartObj.memberList.splice(i,1)
          }
        }
      },
      // 删除文件
      deleteFile(node){
        if(node){
          this.deleteFileList=[]
          this.deleteFileList.push(node)
        }
        this.deleteObj.isFolder=false;
        this.deleteObj.deleteMsg1='确定要删除该文件吗？';
        this.deleteObj.deleteMsg2='此操作不可逆，请谨慎操作';
        this.dialogVisible = true
      },
      deleteFill(){
        if(this.deleteObj.isFolder){
            this.util.restDelete("/api_v1/business/fileManage/"+this.selectNode.id,{formKey:this.catalogFormKey},(res)=>{
            if(res.status==200){
                this.loadData();
                this.selectNode={};
                this.dialogVisible=false
                this.util.success('删除成功');
            }else{
              this.util.error(res.errorMsg)
            }
            this.util.unmask();
          });
        }else{
          
          let deleteFileIds = this.deleteFileList.filter(item=>item.fileCode!="attachment");
          let deleteAttIds = this.deleteFileList.filter(item=>item.fileCode=="attachment");
          if(deleteFileIds.length>0){
            let ids = deleteFileIds.map(item=>item.id);
            this.util.restDelete("/api_v1/business/fileManage/file/ids?ids="+ids.join(","),{formKey:this.fileFormKey},(res)=>{
              if(res.status==200){
                  this.loadContentData();
                  this.deleteFileList=[]
                  this.selectNode={};
                  this.dialogVisible=false
                  this.util.success('删除成功');
              }else{
                this.util.error(res.errorMsg)
              }
              this.util.unmask();
            });
          }
          if(deleteAttIds.length>0){
            deleteAttIds.forEach(item=>{
              var params= {businessKey:item.id,tableName: "T_ATTACHMENT"};
              this.util.mask("正在删除");
              this.util.restDelete('/api_v1/form/data', params, (res)=> {  
                this.util.unmask();
                if (res.status == 200) {
                    this.util.success("操作成功！");
                    this.loadContentData();
                    this.deleteFileList=[]
                    this.selectNode={};
                    this.dialogVisible=false
                }
              });
            });
          }
           
        }
      },
      callBack3(){
        
        var allArr = [];
        var arr = this.addPartObj.memberList.concat(this.selectMemberModels.selectList);

        arr.forEach((item, index) => {
          var flag = true;
          if(allArr.length > 0) {
              allArr.forEach((n, it) => {
                if(allArr[it].id == arr[index].id) {
                  flag = false
                }
              })
          }
          if(flag) {
            allArr.push(arr[index])
          }
        });
        this.addPartObj.memberList = allArr;
      },
      addMember(){
        this.selectMemberModels.isShow=true
        this.$nextTick(()=>{
          this.$refs.selectModule.reset()
          // this.selectMemberModels.selectList=[]
        })
        
      },
      cancel(){
        this.isAddPart=false;
        this.selectMemberModels.selectList=[]
      },
      editCatalogue(){
        if(!this.validUtil.isNotEmpty(this.selectNode.id)){
          this.util.error('请选择要编辑的目录')
          return ;
        }
         this.util.restGet("/api_v1/business/fileManage/updateFolder?id="+this.selectNode.id,null,(res)=>{
          if(res.status==200){
            this.addFlag=false
            this.isAddPart=true;
            this.addPartObj={
              title:'目录',
              id:res.data.id,
              name:res.data.NAME_,
              code:res.data.CODE_,
              sort:res.data.SORT_,
              isEdit:true,
              nameTitle:'目录名称',
              memberList:res.data.member==undefined? []:res.data.member,
            }
            this.selectRoles =res.data.roleMember? res.data.roleMember:[];
            
            this.selectRoles.forEach(item=>{
              item.roleName = item.userName;
            });
          }else{
            this.util.error(res.errorMsg)
          }
          this.util.unmask();
        });

      },
      seeFile(node){
        let fileUid = node.fileCode=="attachment"? node.fileUid:node.id;
        this.util.restGet("/api_v1/business/fileManage/updateFile?id="+fileUid,null,(res)=>{
          if(res.status==200){
            this.isAddPart=true;
            this.addPartObj={
              title:'文件',
              id:res.data.id,
              nameTitle:'文档名称',
              name:res.data.fileName,
              code:res.data.fileCode,
              ifmerge:node.fileCode=="attachment"? false:true,
              isEdit:true,
              memberList:res.data.member==undefined? []:res.data.member,
            }
            this.selectRoles =res.data.roleMember? res.data.roleMember:[];
            this.currentFileList = res.data.fileIdList;
            this.selectRoles.forEach(item=>{
              item.roleName = item.userName;
            });
          }else{
            this.util.error(res.errorMsg)
          }
          this.util.unmask();
        });

      },
      //选中目录
      changeTable(data){
        this.selectNode=data;
        if(data.hasOwnProperty('PARENT_UID_')){
          this.pageIndex=1;
          this.loadContentData()
        }
      },
      loadContentData(){
        let params={
            id:this.selectNode.id?this.selectNode.id:'root',
            pageIndex:this.pageIndex,
            pageSize:this.pageSize,
            search:this.searchText
        }
        if(params.id=='root'){
          params.projUid=this.$store.state.selectProjectObj.id;
        }
        this.util.mask();
        this.util.restGet("/api_v1/business/fileManage/searchAccessoryByFolderId",params,(res)=>{	//请求数据data
        this.util.unmask();
         if(res.status==200){
            if(res.data){
              this.tableData=res.data
              this.total=res.totalCount;
            }else{
              this.tableData=[];
              this.total = 0;
            }
          }else{
            this.util.error(res.errorMsg)
           
          }
        });
      },
      loadData(){
         let params={
                projUid:this.$store.state.selectProjectObj.id,
                parentUid:'root',
                pageIndex:1,
                search:''
              }
            this.util.restGet('/api_v1/business/fileManage/searchFolderRecursion',params,(res)=>{
              if(res.status==200){
                  if(res.data){
                    this.models=[{id:"root",label:"主页",children:res.data}];
                    this.$forceUpdate()
                    if(this.selectNode.id){
                      this.getChildrenById(this.models,this.selectNode.id);
                      this.loadContentData()
                    }
                    
                  }else{
                    this.models=[{id:"root",label:"主页"}];
                  }
                    // this.loadContentData()
              }else{
                  this.util.error(res.errorMsg)
              }
            })


      },
      getChildrenById(dataList,id){
            for(var i=0;i<dataList.length;i++){
                let item=dataList[i];
                if(item.id==id){
                    this.selectNode =item;
                    return;
                }else if(item.children&&item.children.length>0){
                    this.getChildrenById(item.children,id);
                }
            }
        },
      handleSelectionChange(val){
        this.deleteFileList = val
      }
    },
    components:{
      asideItem,
      selectMember,
      uploading,
      FilePopUp,
      selectRole
    }
  }
</script>

<style scoped lang="scss">
.file-box{
  img{
    cursor: pointer;
    width: 18px;
    padding: 0px 5px;
  }
}
  .Documents-class{
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    color: #fff;
    font-size: 14px;
    padding-top: 10px;
    position: relative;
  }
  /* .Documents .add-part-box span {
    width: 14px;
  } */
  .conter{
    height:100%;
    padding:10px 0;
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
    left:2px;
    min-height: 100%;
    height: 100%;
  }
  .conter_right{
    /*width:100%;*/
    overflow: hidden;
    box-sizing: border-box;
    height: 100%;
    padding-left: 10px;
  }
  .conter_right_box{
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    box-sizing: border-box;
    padding:10px 0 85px 14px;
    width:100%;
    height:100%;
  }
  .clear::after{
    content:"";
    height:0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
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
  }
  .conter_right_title{
    margin-bottom: 23px;
  }
  .conter_right_title h4{
    margin-bottom: 0;

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
  .operation span,.operation a{
    margin:0 5px;
    display: inline-block;
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
    .add-part{
        width: 406px;
        position: fixed;
        top: 50%;
        left: 50%;
        color: #333;
        background: #fff;
        transform: translate(-50%,-50%);
        z-index: 81;
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
        position: relative;
    }
    .select-msg-box s{
      position: absolute;
      top: 50%;
      right: 16px;
      width: 16px;
      height: 16px;
      background: url(../../assets/indexImg/sheng.png) no-repeat center;
      background-size: 100%;
      transform: translateY(-50%)
    }
    .add-flag{
        position: absolute;
      bottom: -34px;
      left: 99px;
      font-size: 12px;
      white-space: nowrap;
      color: red;
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

    .add-part span{
      width: 80px;
      display: inline-block;
    }
    .add-part button{
      background: #5C9AD4;
    }
    .select-member-box>span{
      text-align: left;
      width: 100%;
    }

    .select-member-box li{
      float: left;
      position: relative;
    }
    .select-member-box li img{
      width: 42px;
      height: 42px;
    }
    .member-item i{
      position: absolute;
      right: 12px;
      top: -6px;
      background: url(../../assets/indexImg/delete.png) no-repeat center;
      width: 12px;
      height: 12px;
      background-size: cover;
    }
    .QR-code{
      padding: 0;
      box-sizing: border-box;
    }
    .QR-code p{
      font-size: 28px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      position: relative;
    }
    .QR-code p i{
      display: inline-block;
      width: 32px;
      height: 32px;
      background: url(../../assets/indexImg/Bitmap.png) no-repeat center;
      vertical-align: sub;
      margin-right: 3px;
      border-radius: 50%;
      background-size: 100%;
    }
    .QR-code>.QR-code-content{
      width: 100%;
      height: 284px;
      background: #5C9AD4;
      padding-top: 30px;
      box-sizing: border-box;
    }
    .QR-code p s{
      background: url(../../assets/indexImg/cancel.png) no-repeat center;
      width: 12px ;
      height: 12px;
      background-size: 100%;
      position: absolute;
      top: 5px;
      right: 5px;
    }
    .QR-code-content>div{
      margin: 0 auto;
      margin-bottom: 20px;
      background: #fff;
    }
    .Documents >>> .el-upload-list {
      max-height: 210px;
      overflow: auto;
    }
    .Documents >>> .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name {
      height: 70px;
     }
    .Documents >>> .el-upload-list__item-name span {
      overflow: hidden;
      height: 70px;
      white-space: nowrap;
      text-overflow: ellipsis;
      float: left;
      margin-right: 0;
      width: 20%!important;
    }
    .Documents >>> .el-upload-list__item-name span:nth-of-type(1) {
      width: 40%!important;
    }
    .doc-wrap ul{
      max-height: 150px;
      overflow: auto;
    }
    .doc-wrap p {
      font-size: 14px;
      margin: 12px 0;
    }
    .doc-wrap li {
      text-align: left;
      margin-bottom: 6px;
      padding-bottom: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(212,212,212,1);
      position: relative;
    }
    .doc-wrap li span {
      width: auto;
    }
    .doc-wrap .del {
      position: absolute;
      text-align: right;
      right: 20px;
    }
    
    .doc-wrap li:nth-last-of-type(1) {
      margin-bottom: 0;
    }
    .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
        background-color: red;
    }
</style>

<style>
  .Documents-class .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
      background-color: rgb(92,154,212);
      color: #fff;
  }
  .Documents-class .el-table th div, .Documents .el-table--border th:first-child .cell{
    text-align: center;
     color:rgba(68,210,255,1);
  }
   .Documents.el-table__row td{
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
