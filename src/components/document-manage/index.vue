<template>
    <div class="document-wrap">
        <div class="box-style main">
            <div>
                <div class="title-box">
                    <h4 >文档</h4>
                    <div>
                        <button v-show="sessionUtil.isAllowEdit('t_doc_catalog')" @click="editCatalogue()">编辑</button>
                        <button v-show="sessionUtil.isAllowAdd('t_doc_catalog')" @click="addCatalogue()">添加</button>
                        <button v-show="sessionUtil.isAllowDelete('t_doc_catalog')" @click="deleteFolder()">删除</button>
                    </div>
                </div>
                <div style="height:100%;overflow:auto;">
                    <treeItem v-for="(item, index) in rootDatas" :selectNode="selectNode" :parents="item" :key="index" :models="item" :level="0" ></treeItem>
                </div>
            </div>
        </div>
        <modal name="edit-modal" class="theme-modal" height="auto" transition="pop-out" :width="510"  :draggable="true">
            <div class="title">
                <p>文档模板</p>
                <i @click="$modal.hide('edit-modal')" class="el-icon-close"></i>
            </div>
			<div class="modal-content">
                <el-form :model="addPartObj" ref="empForm" label-width="80px">
                    <el-form-item label="文档名称">
                        <el-input v-model="addPartObj.name" placeholder="请输入文档名称"></el-input>
                    </el-form-item>
                    <el-form-item label="类别编码:" prop="code">
                        <el-input v-model="addPartObj.code" placeholder="请输入类别编码"></el-input>
                    </el-form-item>
                    <el-form-item label="排序号:" prop="sort">
                        <el-input v-model="addPartObj.sort" type="number" placeholder="请输入排序号"></el-input>
                    </el-form-item>
                </el-form>
                <dl class="dl-box">
                    <dt>成员权限:</dt>
                    <div class="content">
                        <dd v-for="(item, index) in addPartObj.memberList" :key="index">
                            <i @click.stop="deleteMember(index)"></i>
                            <img :src="item.picture? item.picture:$store.state.defaultLogo" alt="">
                            <span>{{item.userName}}</span>
                        </dd>
                        <dd>
                            <img src="../../assets/indexImg/add.png" @click="addMember" alt="">
                        </dd>
                    </div>
                </dl>
                <dl class="dl-box">
                    <dt>角色权限:</dt>
                    <dd v-for="(item, index) in selectRoles" :key="index">
                        <el-tag style="width: auto;" closable @close="selectRoles.splice(index, 1)">{{item.roleName}}</el-tag>
                    </dd>
                    <dd>
                        <img src="../../assets/indexImg/add.png" style="width:32px;height:32px" @click="selectRoleModels.isShow=true" alt="">
                    </dd>
                </dl>
            </div>
            <div class="modal-footer">
                <el-button size="mini" @click="$modal.hide('edit-modal')">关闭</el-button>
                <el-button size="mini" type="primary" @click="saveMsg">保存</el-button>
            </div>
		</modal>
        
        
        <selectMember :selectMemberModels='selectMemberModels'  :memberList="addPartObj.memberList" ref="selectModule"></selectMember>
        <selectRole class="rolrdiv" style="color:#000" :selectRoleModels="selectRoleModels"></selectRole>
    </div>
</template>

<script>
import selectMember from '../common/selectMember.vue'
import selectRole from '../common/selectRole.vue'
import treeItem from '../common/treeItem.vue'
export default {
    data() {
        return {
            selectRoles:[],
            selectMemberModels:{
                isShow:false,
                selectList:[],
                callBack:this.selectMemberCallBack,
                radioSelectFlags:false,
            },
            selectRoleModels: {
                isShow: false,
                selectList: [],
                callBack: this.selectRoleCallBack,
                radioSelectFlags: false
            },
            rootDatas: [],
            selectNode:{},
            addPartObj:{},
        }
    },
    components:{
        selectMember,selectRole,treeItem
    },
    mounted(){
        this.loadTreeData();
    },
    methods: {
        loadTreeData(node){
            let params={
                parentUid:node? node.id:"root",
                pageIndex:1,
                search:''
            }
            let root = {id:"root",label:"根目录",leaf:true,open:true,children:[]};
            this.util.mask();
            this.util.restGet('/api_v1/business/fileManage/searchDirectoryList', params, (res)=> {
                this.util.unmask();
                if(res.status==200&&res.data){
                    if(node){
                        node.leaf=false;
                        node.open=true;
                        this.$set(node,"children",res.data);
                    }else{
                        root.leaf=false;
                        root.children=res.data;
                        root.total=res.data.length;
                        this.rootDatas=[root];
                    }
                }else{
                    if(node){
                        node.leaf=true;
                        node.open=false;
                    }else{
                        this.rootDatas=[root];
                    }
                    
                }
            });
        },
        //添加成员权限
        addMember(){
            this.selectMemberModels.isShow=true;
        },
        //选择成员回调
        selectMemberCallBack(){
            this.addPartObj.memberList = this.addPartObj.memberList.concat(this.selectMemberModels.selectList);
        },
        //删除成员权限
        deleteMember(index){
            this.addPartObj.memberList.splice(index,1)
        },
        //选择角色回调
        selectRoleCallBack(){
            this.selectRoles = this.selectRoleModels.selectList;
        },
        //编辑目录
        editCatalogue(){
            if(!this.selectNode.data){
                this.util.error('请选择要编辑的目录')
                return ;
            }
            let catalog=this.selectNode.data;
            this.util.restGet(`/api_v1/business/fileManage/catalogue/${catalog.id}`,null,(res)=>{
                if(res.status==200){
                    this.$modal.show('edit-modal');
                    if(res.data) {
                        this.addPartObj={
                            id:res.data.id,
                            name:res.data.label,
                            code:res.data.code,
                            sort:res.data.sort,
                            isEdit:true,
                            memberList:res.data.member||[],
                        }
                        this.selectRoles =res.data.roleMember||[];
                        this.selectRoles.forEach(item=>{
                            item.roleName = item.userName;
                        });
                    }
                    
                }else{
                    this.util.error(res.errorMsg)
                }
                this.util.unmask();
            });
        },
        addCatalogue(){
            let dataRecieve = this.selectNode.data;
            if(!dataRecieve){
                this.util.error('请先选择目录!');
                return ;
            }
            this.$modal.show('edit-modal');
            this.addPartObj={
                title:'文档',
                name:'',
                sort:dataRecieve.total? dataRecieve.total+1:1,
                memberList:[]
            }
            this.selectRoles=[];
        },
        // 删除目录
        deleteFolder(){
            let dataRecieve = this.selectNode.data;
            if(!dataRecieve){
                this.util.error('请先选择要删除的文档');
                return ;
            }
            let deleteMsg =!dataRecieve.leaf? '该节点包含子节点，确定要删除吗？':'确定要删除该文档吗？';
            this.util.confirm(deleteMsg,"提示",()=>{
                this.deleteFill(dataRecieve)
            })
           
        },
        deleteFill(data){
            this.util.restDelete("/api_v1/business/fileManage/catalogue/"+data.id,null,(res)=>{
                if(res.status==200){
                    
                    this.util.success('删除成功');
                    delete this.selectNode.data;
                    this.loadTreeData(this.selectNode.parents);
                }else{
                    this.util.error(res.errorMsg)
                }
                this.util.unmask();
            });
        },
        cancel(){
            this.$modal.hide('edit-modal');
        },
        // 生成文件
        saveMsg(){
            let params={
                parentUid:this.selectNode&&this.selectNode.id? this.selectNode.id:'root',
                fileName:this.addPartObj.name
            }
            this.util.restGet("/api_v1/business/fileManage/checkFileName",params,(res)=>{
                let ifRepe=false;
                if(res.count>0){
                    ifRepe=true;
                }
                let mainData={};
                if(ifRepe){
                    this.util.error('文档名称已存在，请重新输入');
                    return;
                }
                if(!this.validUtil.isNotEmpty(this.addPartObj.name)){
                    this.util.error('请输入文档名称');
                    return
                }
                if(!this.validUtil.isNotEmpty(this.addPartObj.code)){
                    this.util.error('请输入类别编码');
                    return
                }
                mainData.NAME_=this.addPartObj.name
                mainData.CODE_=this.addPartObj.code
                mainData.SORT_=this.addPartObj.sort
                if(!this.addPartObj.isEdit){
                    mainData.PARENT_UID_=this.selectNode&&this.selectNode.id?this.selectNode.id:'root'
                }
                let subFormList=[],memberData=[];
                this.addPartObj.memberList.forEach(item=>{
                    let obj={
                    USER_NAME_:item.userName,
                    USER_UID_:item.id,
                    MEMBER_TYPE_:0,
                    }
                    memberData.push(obj);
                });
                this.selectRoles.forEach(item=>{//角色
                let obj={
                    USER_NAME_:item.roleName,
                    USER_UID_:item.id,
                    MEMBER_TYPE_:1
                }
                memberData.push(obj);
                });
                var memberSubForm ={subFormForeignKey:"PARENT_UID_",subFormTable:"T_DOC_MENBER",data:JSON.stringify(memberData)};
                subFormList.push(memberSubForm);
                var params = {
                    mainFormData:JSON.stringify(mainData),
                    sqlTableName:"T_DOC_CATALOG_", 
                    ifSaveWorkflow:false,
                    subFormData:JSON.stringify(subFormList),
                };
                if(this.validUtil.isNotEmpty(this.addPartObj.id)){
                    params['id']=this.addPartObj.id;
                    params['businessKey']=this.addPartObj.id;
                }
                this.util.restPost("/api_v1/form/business",params,(res)=>{
                    if(res.status==200){
                        this.util.success('保存成功');
                        this.cancel()
                        if(this.addPartObj.id){
                            this.loadTreeData(this.selectNode.parents);
                        }else{
                            this.loadTreeData(this.selectNode.data);
                        }
                        
                    }else{
                        this.util.error(res.errorMsg)
                    }
                    this.util.unmask();
                });
                this.util.unmask();
            });

        },
        
    }
};
</script>

<style scoped lang="scss">
.document-wrap{
    height: 100%;
    .main{
        background:transparent;
        color:#fff;
        height:100%;
        >div{
            padding-top:56px;
            position:relative
        }
        .title-box{
            position:absolute;top:20px;right:20px;left:20px;display:flex;justify-content: space-between;align-items: flex-start;
        }
    }
}
.modal-content{
    max-height: 570px;
    padding: 0px 23px 0px 10px;
    overflow: auto;
}
.dl-box{
    dt{
        padding-bottom: 15px;
        padding-left: 5px;
    }
    .content{
        display: flex;
        flex-wrap: wrap;
    }
    dd{
        // display: table-cell;
        float: left;
        margin: 5px 3px;
        text-align: center;
        position: relative;
        img{
            width: 42px;
            height: 42px;
        }
        span{
            display: block;
            width: 60px;
        }
        i{
            position: absolute;
            cursor: pointer;
            right: 12px;
            top: -6px;
            background: url(../../assets/indexImg/delete.png) no-repeat center;
            width: 12px;
            height: 12px;
            background-size: cover;
        }
    }
    dd:last-child{
        cursor: pointer;
    }
}
.dl-box::after{
    content:"";
    height:0;
    line-height: 0;
    display: block;
    visibility: hidden;
    clear: both;
}
</style>

