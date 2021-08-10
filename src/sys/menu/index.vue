<template>
    <div style="position:relative;" class="menu-wrap">
        <div class="aside">
            <div class="aside-title">
                <h4>菜单管理</h4>
            </div>
            <div class="aside-wrap">
                <treeItem  v-for="(item, index) in models"  :key="index" :models="item" rootId="02" :level="0"  :selectProjectNode="selectProjectNode"></treeItem>
            </div>
        </div>
        <div class="unit-com">
            <el-dialog title="选择菜单图标" :visible.sync="uploadFlag" width="350px">
                <div class="menu-pic">
                    <upload
                    :config="uploadConfig"
                    ref="uploading"
                    ></upload>
                    <div class="btn-wrap">
                        <el-button size="small" @click="getMenuIcon">确定</el-button>
                    </div>
                </div>
            </el-dialog>

            <div class="top">
                <h4 style="margin: 20px 0 10px;height:31px;" >
                   <el-button size="mini" type="primary" @click="save">保存</el-button>
                   <el-button size="mini" @click="addMenu">添加菜单</el-button>
                   <el-button size="mini" @click="removeMenu">删除菜单</el-button>
                </h4>
                <div class="theme-from">
                   <div class="">
                        <el-form :inline="true" :model="ruleForm"  ref="ruleForm" label-width="100px">
                            <el-form-item label="菜单名称">
                                <el-input v-model="ruleForm.title"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单代号">
                                <el-input v-model="ruleForm.code"></el-input>
                            </el-form-item>
                            <el-form-item label="启用">
                                <div style=" width:202px">
                                    <el-switch
                                        v-model="ruleForm.enable"
                                        :active-color="bgColor"
                                        >
                                    </el-switch>
                                </div>
                            </el-form-item>
                            <el-form-item label="上级菜单" class="click-checked">
                                <!-- <el-select v-model="ruleForm.parentTitle"  placeholder="请选择上级菜单" style=" width:202px">
                                    <el-option :label="item.title" v-for="(item, index) in parentList" :key="index" :value="item.id"></el-option>
                                </el-select> -->
                                <p ><span><i @click="dialogVisible = true"></i>{{ruleForm.parentName}}</span></p>
                            </el-form-item>
                            <el-form-item label="上级菜单主键" class="click-checked" style="display:none;">

                                <el-input v-model="ruleForm.parentId"></el-input>
                            </el-form-item>
                            <el-form-item label="菜单图标" class="click-checked">
                                <p ><span><i @click="uploadFlag = true"></i><el-input v-model="ruleForm.icon" class="icon-input"></el-input></span></p>
                                <!-- <el-input v-model="ruleForm.icon"></el-input> -->
                                <!-- <p ><span><i></i>{{ruleForm.icon}}</span></p> -->
                            </el-form-item>
                            <el-form-item label="顺序">
                                <el-input v-model="ruleForm.sort"></el-input>
                            </el-form-item>
                          <el-form-item label="关联表单" class="click-checked">
                            <p ><span><i @click="selectFormVisible = true"></i>{{ruleForm.formTitle}}</span></p>
                          </el-form-item>
                          <el-form-item label="关联formKey" class="click-checked" style="display:none;">
                            <p ><span>{{ruleForm.formKey}}</span></p>
                          </el-form-item>
                          <el-form-item label="路由参数" class="click-checked">
                            <el-input v-model="ruleForm.params"></el-input>
                          </el-form-item>
                          <el-form-item label="菜单类型">
                            <el-select v-model="ruleForm.type"  placeholder="请选择菜单类型" style=" width:202px">
                              <el-option label="首页" value="index"></el-option>
                              <el-option label="项目" value="project"></el-option>
                              <!-- <el-option label="应用" value="application"></el-option>
                              <el-option label="模块" value="module"></el-option>
                              <el-option label="分组" value="group"></el-option> -->
                            </el-select>
                          </el-form-item>
                            <el-form-item label="前端路由">
                                <el-input v-model="ruleForm.path"></el-input>
                            </el-form-item>
                          <el-form-item label="移动端路由">
                            <el-input v-model="ruleForm.mobilePath"></el-input>
                          </el-form-item>
                            <el-form-item label="后端地址">
                                <el-input v-model="ruleForm.uri"></el-input>
                            </el-form-item>
                            <el-form-item label="说明">
                                <el-input v-model="ruleForm.description"></el-input>
                            </el-form-item>
                            <el-form-item label="应用类型">
                                <el-select v-model="ruleForm.app"  placeholder="请选择应用类型" style=" width:202px">
                                <el-option label="工地宝" value="工地宝"></el-option>
                                <el-option label="施工宝" value="施工宝"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>

                   </div>
                </div>
            </div>
            <div id="menu-btn" class="">
                 <div style="margin: 18px 0 10px; height:31px" class="title clearfix ">
                        <div class="content-button">
                            <button class="theme-btn" @click="addNode">添加按钮</button>
                            <button class="theme-btn" @click="addNode(1)">生成标准按钮</button>
                        </div>
                </div>
                <div class="theme-table" >
                     <el-table ref="multipleTable" :data="ruleForm.authList"
                        border
                        height="405"
                        :cell-style="{textAlign:'center'}"
                        highlight-current-row
                       >
                            <el-table-column label="操作" width="110">
                                <template slot-scope="scope">
                                    <p class="operation">
                                       <img src="../../assets/administrationIcon/edit1.png" width="14px" @click="edit(scope.row)" alt="">
                                       <img src="../../assets/administrationIcon/remove1.png" width="15px" @click="deleteNode(scope.$index)" alt="">
                                    </p>
                                </template>
                            </el-table-column>
                             <el-table-column  label="按钮名称"  width="150">
                                <template slot-scope="scope">
                                    <div >
                                        <input style="white-space: nowrap;text-align:left;background:#fff;" :disabled="!scope.row.isEdit" v-model="scope.row.title">
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column   label="代号" width="150">
                                <template slot-scope="scope">
                                    <div >
                                        <input style="white-space: nowrap;text-align:left;background:#fff;" :disabled="!scope.row.isEdit" v-model="scope.row.code">
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column   label="请求方式"  width="150">
                                <template slot-scope="scope">
                                    <div >
                                        <el-select class="menu-btn-select" v-model="scope.row.method" style="color: #000000" :disabled="!scope.row.isEdit" >
                                            <el-option label="get" value="get"></el-option>
                                            <el-option label="post" value="post"></el-option>
                                            <el-option label="put" value="put"></el-option>
                                            <el-option label="delete" value="delete"></el-option>
                                        </el-select>

                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column   label="图标" width="100">
                                <template slot-scope="scope">
                                    <div >
                                        <input style="white-space: nowrap;text-align:left;background:#fff;" :disabled="!scope.row.isEdit" v-model="scope.row.icon">
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column   label="后端地址" >
                                <template slot-scope="scope">
                                      <div >
                                        <input style="white-space: nowrap;text-align:left;background:#fff;" :disabled="!scope.row.isEdit" v-model="scope.row.uri">
                                    </div>
                                </template>
                            </el-table-column>
                       <el-table-column   label="鉴权参数" >
                         <template slot-scope="scope">
                           <div >
                             <input style="white-space: nowrap;text-align:left;background:#fff;" :disabled="!scope.row.isEdit" v-model="scope.row.authParams">
                           </div>
                         </template>
                       </el-table-column>
                            <el-table-column   label="排序" width="50px;">
                                <template slot-scope="scope">
                                    <div >
                                        <input style="white-space: nowrap;text-align:left;background:#fff;" :disabled="!scope.row.isEdit" v-model="scope.row.sort">
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                </div>
            </div>
        </div>

        <el-dialog
            title="选择上级菜单"
            :visible.sync="dialogVisible"
            width="350px" >
            <div style="height:300px;overflow:auto;">
                <el-tree :data="models" :props="defaultProps" @node-click="handleSelectNodeClick"></el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="closeDialog">确定</el-button>
            </span>
        </el-dialog>

      <div v-if="selectFormVisible" >
        <div class="mask" ></div>
        <div class="boxs"  :style="{width:'600px',height:'550px'}">
          <h4 style="margin:10px 0;"><i></i>选择表单</h4>
          <form-view   :select-form-key="selectFormKey" :single-select="true" ref="select-form"></form-view>
          <div style="text-align: right;padding: 5px 0px;">
            <el-button style=""  type="info" size="mini" @click="selectFormVisible = !selectFormVisible" >取消</el-button>
            <el-button  type="warning" size="mini" @click="confirmSelect()" >确定</el-button>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
import {mapState} from 'vuex'
import treeItem from '@/components/common/treeItem.vue'
import {tableMixin} from '../../public/js/mixins.js'
// import upload from '@/components/common/upload/upload'
import upload from '@/components/common/uploading'
export default {
    mixins:[tableMixin],
    data(){
        return {
          selectFormVisible: false, // 显示关联表单
          selectFormKey: 'form-select',
            defaultProps: {
                label: 'title',
                children: 'children',
                isLeaf: 'leaf'
            },
            selectProjectNode: {
				id: ''
			},
            selectNode:{},
            ruleForm:{},
            parentList:[],
            dialogVisible:false,
            title:'',
            manuList:[],
            models:[],
            user:{},
            uploadConfig: {
                limit: 1,
                limitSize: 50048576,
                readOnly: false,
                xtype: "test",
                accept: ".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP",
                acceptMsg: "只能传图片"
            },
            uploadFlag: false,
        }
    },
    components:{
        treeItem,
        upload
    },
    created(){
        this.bgColor = this.$store.state.themeColor
        this.fontColor = this.$store.state.themeBG
        this.$bus.on('handelDepart', this.addOrEditDepart);
        this.loadAsideData();
        this.user=this.sessionUtil.getUser();
    },
    beforeDestroy () {
      this.$bus.off('handelDepart', this.addOrEditDepart)
    },
    computed:{
        ...mapState({
            companyUid:companyUid => state.companyUid
        })
    },
    methods:{
        loadAsideData(node){
            // var parentId= this.sessionUtil.getAppId()
            this.util.restGet('/api_v1/org/menus',{parentId:"root",isDeep: true,isFilter:false},(res)=>{
                if(res.status==200){
                    this.digui(res.data)
                    if(node){
                        this.selectNode=node
                    }
                    this.models=res.data
                }else{
                    this.util.error(res.msg)
                }
            })
        },
        handleSelectNodeClick(node){
            if(node.id != this.ruleForm.id){
                this.ruleForm.parentId = node.id;
                this.ruleForm.parentName = node.title;
            }
            this.dialogVisible = false;
        },
        closeDialog() {
            this.dialogVisible = false;
        },
        confirmSelect(){ // 关联表单确认
            let data = this.$refs['select-form'].getSelectedData();
            if(data){
            let item = data[0];
            this.ruleForm.formKey = item['FORM_KEY_'];
            this.ruleForm.formTitle = item['TITLE_']?item['TITLE_']:item['NAME_'];
            this.selectFormVisible = false;
            }else{
            this.util.warn('请选择一个表单！');
            }
        },
        digui(arr){
            var _this=this
            function digui1(arr){
                if(arr.length&&arr.length>0){
                    for (let index = 0; index < arr.length; index++) {
                        if(arr[index].type=='application'){
                            _this.parentList.push(arr[index])
                        }
                        arr[index].label=arr[index].title
                        if(arr[index].children&&arr[index].children.length>0){
                            digui1(arr[index].children)
                        }
                    }
                }else{
                    return
                }
            }
            digui1(arr)
        },
        getMenuIcon() {
            this.uploadFlag = false;
            if(this.uploadConfig.filesList.length > 0) {
                let data = this.uploadConfig.filesList[0];
                this.ruleForm.icon = data.id;
            }
        },
        addOrEditDepart(data){
            this.selectNode=data;
            this.loadData()
        },
        addMenu(){
            if(!this.ruleForm.title) {
                this.util.warn('请输入菜单名称！')
                return false;
            }
            if(!this.ruleForm.code) {
                this.util.warn('请输入菜单代号！')
                return false;
            }
            if(!this.ruleForm.enable) {
                this.util.warn('请启用菜单！')
                return false;
            }
            if(!this.ruleForm.sort) {
                this.util.warn('请输入顺序！')
                return false;
            }
            if(!this.ruleForm.app) {
                this.util.warn('请选择应用类型！')
                return false;
            }
            if(!this.ruleForm.parentId) {
                this.ruleForm.parentId = 'root'
            }
            var _this = this;
            _this.util.mask();
            var arr=[]
            if(this.ruleForm.authList) {
                for (var i = 0; i < this.ruleForm.authList.length; i++) {
                    var o={
                        code:this.ruleForm.authList[i].code,
                        description:this.ruleForm.authList[i].description,
                        method:this.ruleForm.authList[i].method,
                        path:this.ruleForm.authList[i].path,
                        mobilePath:this.ruleForm.authList[i].mobilePath,
                        sort:this.ruleForm.authList[i].sort,
                        title:this.ruleForm.authList[i].title,
                        type:this.ruleForm.authList[i].type,
                        uri:this.ruleForm.authList[i].uri,
                      authParams:this.ruleForm.authList[i].authParams,
                        icon: this.ruleForm.authList[i].icon,
                    }
                    arr.push(o)
                }
            }

            var params={
                code:this.ruleForm.code,
                title:this.ruleForm.title,
                app:this.ruleForm.app,
                path:this.ruleForm.path,
                mobilePath:this.ruleForm.mobilePath,
                uri:this.ruleForm.uri,
                description:this.ruleForm.description,
                enable:this.ruleForm.enable==false?0:1,
                formKey:this.ruleForm.formKey,
                parentId:this.ruleForm.parentId,
                sort:this.ruleForm.sort,
                type:this.ruleForm.type,
                authList:arr,
                saveAuths:true,
                app: this.ruleForm.app,
                icon: this.ruleForm.icon,
            }
            this.util.restPost('/api_v1/org/menus',params,(res)=>{
                if(res.status==200){
                    _this.util.success('添加成功')
                    params.id=res.data
                    _this.loadAsideData(params)
                }else{
                    _this.util.error(res.msg)
                }
                _this.util.unmask();
            })
        },
        save(){
            if(!this.selectNode.id) {
                return false;
            }
            var _this = this;
            _this.util.mask();
            var arr=[]
            if(this.ruleForm.authList!=undefined){
                for (var i = 0; i < this.ruleForm.authList.length; i++) {
                    var o={
                        id:this.ruleForm.authList[i].id,
                        code:this.ruleForm.authList[i].code,
                        description:this.ruleForm.authList[i].description,
                        method:this.ruleForm.authList[i].method,
                        path:this.ruleForm.authList[i].path,
                        mobilePath:this.ruleForm.authList[i].mobilePath,
                        sort:this.ruleForm.authList[i].sort,
                        title:this.ruleForm.authList[i].title,
                        type:this.ruleForm.authList[i].type,
                        uri:this.ruleForm.authList[i].uri,
                      authParams:this.ruleForm.authList[i].authParams,
                        icon: this.ruleForm.authList[i].icon,
                    }
                    arr.push(o)
                }
            }

            var params={
                code:this.ruleForm.code,
                title:this.ruleForm.title,
                app:this.ruleForm.app,
                path:this.ruleForm.path,
                mobilePath:this.ruleForm.mobilePath,
                uri:this.ruleForm.uri,
                description:this.ruleForm.description,
                enable:this.ruleForm.enable==true?1:0,
                formKey:this.ruleForm.formKey,
                params:this.ruleForm.params,
                parentId:this.ruleForm.parentId,
                sort:this.ruleForm.sort,
                type:this.ruleForm.type,
                authList:arr,
                saveAuths:true,
                app: this.ruleForm.app,
                icon: this.ruleForm.icon,
            }
            if(this.ruleForm.parentId == this.sessionUtil.getCompanyId()) {
                params.type = 'module'
            }
           this.util.restPut('/api_v1/org/menus/'+this.selectNode.id,params,(res)=>{
                if(res.status==200){
                    _this.util.success('保存成功')
                    _this.loadAsideData()
                }else{
                    _this.util.error(res.msg)
                }
            })
             _this.util.unmask();
        },
        removeMenu(){
            if(!this.selectNode.id) {
                this.util.warn('请选择需要删除的菜单！')
                return false;
            }
            console.log(this.selectNode)
            var _this = this;
            this.util.confirm('您确定要删除吗？','提示',function(){
                console.info("------------");
                _this.util.restDelete('/api_v1/org/menus/'+_this.selectNode.id,{},(res)=>{
                    if(res.status==200){
                        _this.util.success('删除成功')
                        _this.loadAsideData();
                    }else{
                        _this.util.error(res.msg)
                    }
                });
            });
        },
        deepTree(nodeList,parentId){
            if(nodeList != undefined && nodeList != null){
                for(var i = 0;i<nodeList.length;i++){
                    var node  = nodeList[i];
                    if(node.id == parentId){
                        return node.title;
                    }else{
                        //递归查找子部门
                        if(node.children != undefined){
                            var result = this.deepTree(node.children,parentId);
                            if(result != ''){
                                return result;
                            }
                        }
                    }
                }
            }
            return '';
        },
        loadData(){
            var _this = this;
            this.util.restGet('/api_v1/org/menus/'+this.selectNode.id,null,(res)=>{
                if(res.status==200){
                    if(res.data) {
                        res.data.enable==0?res.data.enable=false:res.data.enable=true;
                        if(res.data.authList){
                          res.data.authList.forEach(item=>{
                            item.isEdit = true
                          })
                        }
                        _this.ruleForm=res.data;
                    }
                    var parentName = '';
                    if(_this.validUtil.isNotEmpty(_this.ruleForm.parentId)){
                        if(_this.ruleForm.parentId == 'root'){
                            parentName = '根节点';
                        }else{
                            //递归查找
                            parentName = _this.deepTree(_this.models,_this.ruleForm.parentId);
                        }
                    }else{
                        parentName = '根节点';
                        _this.ruleForm.parentId = 'root';
                    }
                  if(_this.ruleForm.formKey){
                    if(_this.ruleForm.formTitle === undefined){
                      _this.ruleForm.formTitle = _this.ruleForm.title
                    }
                  }
                    _this.ruleForm.parentName =parentName;
                    _this.$forceUpdate()
                }else{
                    _this.util.error(res.msg)
                }
            })
        },
        addNode(num){
            if(!this.selectNode.id){
                this.util.error('请选择菜单')
                return;
            }
            if(!this.ruleForm.authList) {
                this.$set(this.ruleForm, 'authList', [])
            }
            if(num==1){
                var arr=[
                    {
                        code: "btn_add",
                        description: "新增",
                        method: "post",
                        path: "/menuManager",
                        sort: this.ruleForm.authList&&this.ruleForm.authList.length>1?this.ruleForm.authList.length+1:1,
                        title: "新增",
                        type: "button",
                        isEdit:true,
                        uri: "/api_v1/menus"
                    },
                    {
                        code: "btn_edit",
                        description: "编辑",
                        method: "put",
                        path: "/menuManager",
                        sort: this.ruleForm.authList&&this.ruleForm.authList.length>1?this.ruleForm.authList.length+2:2,
                        title: "编辑",
                        type: "button",
                      isEdit:true,
                        uri: "/api_v1/menus"
                    },
                    {
                        code: "btn_delete",
                        description: "删除",
                        method: "delete",
                        path: "/menuManager",
                        sort: this.ruleForm.authList&&this.ruleForm.authList.length>1?this.ruleForm.authList.length+3:3,
                        title: "删除",
                        type: "button",
                        uri: "/api_v1/menus"
                    },
                ]
                this.ruleForm.authList=this.ruleForm.authList.concat(arr)
            }else{
                this.ruleForm.authList.push({sort:this.ruleForm.authList.length+1,isEdit:true})
            }
            console.log(this.ruleForm)
        },
        deleteNode(index){
            this.ruleForm.authList.splice(index,1)
        },
        edit(node){
            node.isEdit=true;
            this.$forceUpdate()
        },
    }
}
</script>
<style scoped lang="scss">
  .menu-wrap{
    display: flex;
  }
  .aside{
    width: 30%;
  }
  .unit-com{
    width: 70%;
  }

.operation {
    padding-bottom: 10px;
}
.unit-com h4 {
    border:  none;
}
.content-button{
    float: right;
    margin-top: -2px;
}

.title{
    position: relative;
}

.click-checked p{
    position: relative;
    box-sizing: border-box;
    width:202px;
    height:40px;
    border:1px solid #dcdfe6;
    border-radius: 4px;
    padding:0 30px 0 15px ;
}
.click-checked span{
    display: block;width: 100%;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
}
.click-checked i{
    content:'';
    position: absolute;
    top: 50%;
    right: 10px;
    color: #999;
    transform: translateY(-50%);
    background: url(../../assets/common/more.png) no-repeat center;
    z-index: 1;
    cursor: pointer;
    font-style: normal;
    width: 16px;
    height: 16px;
}


.mask {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 98;
  background: rgba(0, 0, 0, 0.6);
}

.boxs {
  width: 900px;
  transform: translate(-50%, -50%);
  position: fixed;
  left: 50%;
  top: 50%;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
  height: 600px;
  z-index: 99;
  overflow: hidden;
  padding: 0 15px;
  display: flex;
  flex-flow: column;
  box-sizing: border-box;
}
.menu-pic {
    padding-bottom: 50px;
}
.btn-wrap {
    margin-top: 20px;
    float: right;
}


</style>

<style>

.unit-com .el-input--suffix .el-input__inner {
    border: 1px solid #DCDFE6;
    height: 40px!important;
    line-height: 40px!important;
    border-radius: 4px;
}
.menu-wrap .el-form--inline .el-form-item__content {
    width: 202px;
}
.icon-input .el-input__inner{
    border: none!important;
}
.menu-btn-select .el-input__inner {
  background: transparent;
  border: 0 none;
  height: 32px;
  color: #000000!important;
  font-size: 14px;
  width: 100%;
  height: 100%;
  padding: 0;
}

</style>
