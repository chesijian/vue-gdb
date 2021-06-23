<template>
    <div style="height:100%;" class="document-wrap">
        <div class="aside box-style" style="background:transparent;color:#fff;height:100%;">
            <div style="padding-top:56px;position:relative">
                <div style="position:absolute;top:20px;right:20px;left:20px;display:flex;justify-content: space-between;align-items: flex-start;">
                    <h4 >文档</h4>
                    <div>
                        <button v-show="sessionUtil.isAllowEdit('t_doc_catalog')" @click="editCatalogue()">编辑</button>
                        <button v-show="sessionUtil.isAllowAdd('t_doc_catalog')" @click="addCatalogue()">添加</button>
                        <button v-show="sessionUtil.isAllowDelete('t_doc_catalog')" @click="deleteFolder()">删除</button>
                    </div>
                </div>
                <div style="height:100%;overflow:auto;">
                    <el-tree style="background-color:transparent;color:#fff" highlight-current node-key="id" :load="loadData" lazy :props="defaultProps" ref="tree"></el-tree>
                    <!-- <selectTree v-for="(item, index) in models" :selectFlag="false" :key="index" :models="item" :level="0" ></selectTree> -->
                </div>
            </div>
        </div>
        <div v-if="isAddPart">
            <div  class="add-part-box" @click.stop.prevent="cancel" ></div>
            <div class="add-part">
                <p>文档</p>
                <div class="select-msg-box">
                    <span style="float:left">文档名称</span>&nbsp;&nbsp;
                    <el-input v-model="addPartObj.name" size="mini" class="select-msg-ele" placeholder="请输入文档名称" style="padding-left: 10px;overflow: hidden;"></el-input>
                    <div class="add-flag" v-if="addFlag">
                        <span >文档名称已存在，请重新输入</span>
                    </div>
                </div>
                <div class="select-msg-box">
                    <span style="float:left">类别编码</span>&nbsp;&nbsp;
                    <el-input v-model="addPartObj.code" size="mini" class="select-msg-ele" placeholder="请输入类别编码" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                
                <div class="select-msg-box">
                    <span style="float:left">排序号</span>&nbsp;&nbsp;
                    <el-input v-model.number="addPartObj.sort" size="mini" type="number" class="select-msg-ele" placeholder="请输入排序号" style="padding-left: 10px;overflow: hidden;"></el-input>
                </div>
                <div style="float:right;padding-top:10px">
                    <button style="margin-right:20px;" @click.stop.prevent="cancel">关闭</button>
                    <button @click.stop.prevent="saveMsg">保存</button>
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
    </div>
</template>

<script>
    export default {
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'label',
                    // isLeaf:'leaf'
                },
                models: [],
                selectNode:{},
                addFlag:false,
                isAddPart:false,
                addPartObj:{},
                deleteObj:{},
                dialogVisible: false,
                rootNode:null,
                rootResolve:null,
                
            }
        },
        methods: {
            loadData(node,resolve){//加载文档模板
                if(node.level==0){
                    resolve([{id:"root",label:"根目录"}])
                    return;
                }
                
                node.resolve = resolve;
                // console.log("node=====",node);
                this.rootNode = node.parent;
                this.rootResolve = node.parent.resolve;
                var data = resolve==undefined? node:node.data;
                let params={
                    parentUid:data==undefined? "root":data.id,
                    pageIndex:1,
                    search:''
                }
                
                this.util.mask();
                this.util.restGet('/api_v1/business/fileManage/searchDirectoryList', params, (res)=> {
                    this.util.unmask();
                    if(res.status==200&&res.data){
                        if(node.data){
                            node.data.total=res.data.length;
                        }else{
                            node.total=res.data.length;
                        }
                        
                        if(resolve==undefined){
                            if(node){
                                
                                this.$refs.tree.updateKeyChildren(node.id,res.data);
                            }else{
                                this.$refs.tree.updateKeyChildren(this.currentNode.id,res.data);
                            }
                            
                        }else{
                            resolve(res.data);
                        }
                        
                    }else{
                        resolve([]);
                    }
                });
                
            },
            editCatalogue(){
                let dataRecieve = this.$refs.tree.getCurrentNode();
                if(dataRecieve== null){
                 this.util.error('请选择要编辑的目录')
                    return ;
                }
                this.selectNode=dataRecieve;
                if(!this.validUtil.isNotEmpty(this.selectNode.id)){
                    this.util.error('请选择要编辑的目录')
                    return ;
                }
                this.util.restGet(`/api_v1/business/fileManage/catalogue/${this.selectNode.id}`,null,(res)=>{
                    if(res.status==200){
                        this.addFlag=false
                        this.isAddPart=true;
                        if(res.data) {
                            this.addPartObj={
                                title:'文档',
                                id:res.data.id,
                                name:res.data.label,
                                code:res.data.code,
                                sort:res.data.sort,
                                isEdit:true,
                                nameTitle:'文档名称',
                            }
                        }
                        
                    }else{
                        this.util.error(res.errorMsg)
                    }
                    this.util.unmask();
                });
            },
            addCatalogue(){
                let dataRecieve = this.$refs.tree.getCurrentNode();
                this.selectNode=dataRecieve;
                if(!this.selectNode){
                    this.util.error('请先选择目录!');
                    return ;
                }
                this.addFlag=false
                this.isAddPart=true;
                this.addPartObj={
                    title:'文档',
                    nameTitle:'文档名称',
                    name:'',
                    sort:dataRecieve.total? dataRecieve.total+1:1
                }
            },
            // 删除目录
            deleteFolder(){
                let dataRecieve = this.$refs.tree.getCurrentNode();
                this.selectNode=dataRecieve;
                if(!this.selectNode.id){
                    this.util.error('请先选择要删除的文档');
                    return ;
                }
                // if(!this.selectNode.leaf){
                //     this.util.error('该节点包含子节点，不能删除!');
                //     return ;
                // }
                this.deleteObj.isFolder=true;
                this.deleteObj.deleteMsg1=!this.selectNode.leaf? '该节点包含子节点，确定要删除吗？':'确定要删除该文档吗？';
                this.deleteObj.deleteMsg2='此操作不可逆，请谨慎操作';
                this.dialogVisible = true
            },
            cancel(){
                this.isAddPart=false;
            },
            // 生成文件
            saveMsg(){
                let params={
                    parentUid:this.selectNode&&this.selectNode.id? this.selectNode.id:'root',
                    fileName:this.addPartObj.name
                }
                this.util.restGet("/api_v1/business/fileManage/checkFileName",params,(res)=>{
                    if(res.count==0){
                        this.addFlag=false
                    }else{
                        this.addFlag=true
                    }
                    let mainData={},str='';

                    if(this.addFlag){
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
                    // console.debug("mainData====",mainData);
                    var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"T_DOC_CATALOG_", ifSaveWorkflow:false};
                    if(this.addPartObj.isEdit){
                        if(this.validUtil.isNotEmpty(this.addPartObj.id)){
                            params['id']=this.addPartObj.id;
                            params['businessKey']=this.addPartObj.id;
                        }
                    }
                    this.util.restPost("/api_v1/form/business",params,(res)=>{
                        if(res.status==200){
                            this.loadData(this.rootNode, this.rootResolve)
                            // if(this.selectNode){
                            //     this.loadData(this.selectNode);
                            // }else{
                               
                                
                            // }
                            this.cancel()
                            this.util.success('保存成功');
                        }else{
                            this.util.error(res.errorMsg)
                        }
                        this.util.unmask();
                    });
                    this.util.unmask();
                });

            },
            deleteFill(){
                this.util.restDelete("/api_v1/business/fileManage/catalogue/"+this.selectNode.id,null,(res)=>{
                    if(res.status==200){
                        // this.loadData(this.selectNode);
                        this.$refs.tree.remove(this.selectNode);
                        this.selectNode={};
                        this.dialogVisible=false
                        this.util.success('删除成功');
                    }else{
                        this.util.error(res.errorMsg)
                    }
                    this.util.unmask();
                });
            },
        }
    };
</script>


<style  scoped>
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
.add-flag{
    position: absolute;
    bottom: -30px;
    left: 99px;
    font-size: 12px;
    white-space: nowrap;
    color: red;
}
.add-part span{
    width: 80px;
    display: inline-block;
}
.add-part button{
    background: #5C9AD4;
}

</style>
<style>
.document-wrap .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
    background-color: rgba(68,210,255,.2);
}
.document-wrap .el-tree-node__content:hover{
    background-color: rgba(68,210,255,.2);
}
</style>

