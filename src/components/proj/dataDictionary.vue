<template>
    <div style="position:relative;padding-left:310px" class="manage-box">
        <message :models="deleteMsg"></message>
        <div v-if="isAddFormShow">
            <div class="mask" @click.stop.prevent="cancel"></div>
            <div class="box">
                <h4 style="margin:20px 0;color:#333">{{title}}字典</h4>
                <div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">字典名称</div>
                            <div class="add-from-input" >
                                <input type="text" v-model="addObject.name">
                            </div>
                        </div>
                        <div class="add-from-right">
                            <div class="add-from-label">所属应用</div>
                            <div class="add-from-input "  @click="AsideParent"  style="position:relative">
                                <i></i> <span>{{addObject.parentText}}</span>
                            </div>
                        </div>
                   </div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">编码</div>
                            <div class="add-from-input ">
                                <input type="text"  v-model="addObject.dicId">
                            </div>
                        </div>
                        <div class="add-from-right">
                            <div class="add-from-label">说明</div>
                            <div class="add-from-input ">
                                <input type="text" v-model="addObject.description">
                            </div>
                        </div>
                   </div>
                   <div class="add-from">

                        <div class="add-from-left">
                            <div class="add-from-label">是否系统</div>
                            <div style="box-sizing: border-box;padding-top: 9px;">
                                <el-switch
                                    v-model="addObject.value" 
                                    :active-color="bgColor"
                                    >
                                </el-switch>
                            </div>
                        </div>
                   </div>
                    
                </div>
                <div class="footer">
                    <el-button @click="cancel" size="small">关闭</el-button>
                    <el-button type="warning" size="small" @click="success" style="background:#e6a23c;">确定</el-button>
                </div>
            </div>
        </div>
        <div v-if="isAddSonFormShow">
            <div class="mask" @click.stop.prevent="cancelSon"></div>
            <div class="box">
                <h4 style="margin:20px 0;color:#333">{{titleSon}}字典</h4>
                <div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">字典名称</div>
                            <div class="add-from-input" >
                                <input type="text" v-model="addSonObject.name">
                            </div>
                        </div>
                        <div class="add-from-right">
                            <div class="add-from-label">编码</div>
                            <div class="add-from-input  " >
                                <input type="text" v-model="addSonObject.value">
                            </div>
                        </div>
                   </div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">排序</div>
                            <div class="add-from-input" >
                                <input type="text" v-model="addSonObject.sort">
                            </div>
                        </div>
                        <div class="add-from-right">
                            <div class="add-from-label">说明</div>
                            <div class="add-from-input " >
                                <input type="text" v-model="addSonObject.description">
                            </div>
                        </div>
                   </div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">是否启用</div>
                            <div style="box-sizing: border-box;padding-top: 9px;">
                                <el-switch
                                    v-model="addSonObject.enable" 
                                    :active-color="bgColor"
                                    >
                                </el-switch>
                            </div>
                        </div>
                   </div>
                </div>
                <div class="footer">
                    <el-button @click="cancelSon" size="small">关闭</el-button>
                    <el-button type="warning" size="small" @click="successSon" style="background:#e6a23c;">确定</el-button>
                </div>
            </div>
        </div>
         <div v-if="isAddAsideShow">
            <div class="mask" @click.stop.prevent="isAddAsideShow=false;addAsideObject={}"></div>
            <div class="box">
                <h4 style="margin:20px 0;"><i></i>{{addAsideObject.title}}应用</h4>
                <div style="overflow: hidden;margin-bottom: 34px;">
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">应用名称</div>
                            <div class="add-from-input" >
                                <input type="text" v-model="addAsideObject.text">
                            </div>
                        </div>
                        <div class="add-from-right">
                            <div class="add-from-label">编码</div>
                            <div class="add-from-input  " >
                                <input type="text" v-model="addAsideObject.value">
                            </div>
                        </div>
                   </div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">排序</div>
                            <div class="add-from-input" >
                                <input type="text" v-model="addAsideObject.sort">
                            </div>
                        </div>
                        <div class="add-from-right">
                            <div class="add-from-label">类型</div>
                            <div class="add-from-input " style="padding: 4px 0;" :style="{background:!!addAsideObject.type?'#f5f7fa':'#fff'}">
                                <el-select v-model="AsideObjectType"  :disabled="!!addAsideObject.type" size="mini" placeholder="请选择">
                                    <el-option label="系统数据字典树" value="1"></el-option>
                                    <el-option label="业务数据字典树" value="2"></el-option>
                                </el-select>
                            </div>
                        </div>
                   </div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">上级</div>
                            <div class="add-from-input" @click="AsideParent" style="position:relative">
                                <i></i><span >{{addAsideObject.parentText}}</span>
                            </div>
                        </div>
                        <div class="add-from-right">
                            <div class="add-from-label">说明</div>
                            <div class="add-from-input " >
                                <input type="text" v-model="addAsideObject.remark">
                            </div>
                        </div>
                   </div>
                   <div class="add-from">
                        <div class="add-from-left">
                            <div class="add-from-label">是否启用</div>
                            <div style="box-sizing: border-box;padding-top: 9px;">
                                <el-switch
                                    v-model="addAsideObject.enable"
                                    :active-color="bgColor"
                                    >
                                </el-switch>
                            </div>
                        </div>
                   </div>

                </div>
                <div class="footer">
                    <el-button @click="isAddAsideShow=false;addAsideObject={}" size="small">关闭</el-button>
                    <el-button type="warning" size="small" @click="SaveAsiede">确定</el-button>
                </div>
            </div>
        </div>
        <div class="aside box-style" style="background:transparent;color:#fff;">
            <div style="padding-top:46px;position:relative">
                <h4 style="position:absolute;top:10px;">应用分类 <img  v-if="sessionUtil.isCompanyAdmin()" style="width:12px;float:right;margin:6px 10px;" @click="AsideAdd()" src="../../assets/administrationIcon/add.png" alt=""></h4>
                <div style="height:100%;overflow:auto;">
                    <asideItem  v-for="(item, index) in models"  :key="index" :models="item" :level="0"></asideItem>
                </div>
            </div>
        </div>
        <div class="content box-style" style="padding:1px 1px 10px;background:transparent;height:100%;">
            <div style="height:100%;">
                <div style="height:100%;">
                    <div class="top" style="height:50%;overflow:hidden;padding-top:51px;box-sizing:border-box;">
                        <div style="position:relative;width:100%;">
                            <h5 style="margin: 0px 0;height:31px;position:absolute;top:-41px;right:0;width:100%"> 
                                <div class="content-button">
                                    <div class="input" style="padding-right:34px;border-color:#44d2ff;"><input style="width:100%;" type="text" @keydown.enter="loadData()" v-model="searchText" placeholder="搜索"><button style="margin:0" @click="loadData()"></button></div>
                                    <div style="float:right;">
                                        <button class="theme-btn"  @click="addWorkflow">添加字典</button>
                                        <button class="theme-btn"  @click="editWorkflow">修改字典</button>
                                        <button class="theme-btn"  @click="deleteWorkflow">删除字典</button>
                                    </div>
                                </div>
                            </h5>
                        </div>
                        <div class="manu-table theme-table" ref="tableHeight2" style="height:100%;">
                            <el-table ref="multipleTable" :data="manuList"  style="width: 100%" :height="tableHeightNum2"
                                :header-row-style="{overflow:'hidden',color:'#fff',}"  border  highlight-current-row class="highlight-current-row"
                                :row-style="{overflow:'hidden',color:'#fff',}" :cell-style="{textAlign:'center',}"  @current-change='nodeLIstShow'
                                :header-cell-style="{height:'34px',padding:0,textAlign:'center',color:'#fff',fontWeight:'400'}"
                                >
                                
                                    <el-table-column  fixed label="字典名称" >
                                        <template slot-scope="scope">
                                            <div  style="white-space: nowrap;text-align:left;color:#fff;">
                                                <span>{{scope.row.dicName}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  fixed label="编码" >
                                        <template slot-scope="scope">
                                            <div  style="white-space: nowrap;text-align:left;color:#fff;">
                                                <span>{{scope.row.dicId}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  fixed label="所属应用" >
                                        <template slot-scope="scope">
                                            <div  style="white-space: nowrap;text-align:left;color:#fff;">
                                                <span>{{scope.row.parentText}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  fixed label="是否系统" width="80">
                                        <template slot-scope="scope">
                                                <el-switch
                                                    v-model="scope.row.type" 
                                                    :active-color="bgColor"
                                                    :disabled="true"
                                                    >
                                                </el-switch>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  fixed label="说明" >
                                        <template slot-scope="scope">
                                            <div  style="white-space: nowrap;text-align:left;color:#fff;">
                                                <span>{{scope.row.description}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                        </div>
                    </div>
                    <div class="" style="height:50%;overflow:hidden;padding-top:51px;box-sizing:border-box;" >
                        <div style="position:relative;width:100%;" class="title clearfix ">
                            <h5 style="margin: 0;position:absolute;top:-41px;right:0;width:100%">
                                <div style="float:right;">
                                    <button class="theme-btn"  @click="addNode">添加字典</button>
                                    <button class="theme-btn" @click="saveNode">修改字典</button>
                                    <button class="theme-btn" @click="deleteNode">删除字典</button>
                                </div>
                            </h5>
                            <div>
                            
                            </div>
                        </div>
                        <div class="manu-table theme-table" ref="tableHeight1" style="height:100%;">
                            <el-table ref="multipleTable" :data="nodeList" :height="tableHeightNum1"
                                :header-row-style="{overflow:'hidden',color:'#fff',}"  border  highlight-current-row class="highlight-current-row"
                                :row-style="{overflow:'hidden',color:'#fff',}" :cell-style="{textAlign:'center',}"   @current-change='nodeSelect'
                                :header-cell-style="{height:'34px',padding:0,textAlign:'center',color:'#fff',fontWeight:'400'}"
                            >
                                    <el-table-column type="index" fixed width="50"  label="序号" ></el-table-column>
                                    <el-table-column  fixed label="字典名称" >
                                        <template slot-scope="scope">
                                            <div  style="white-space: nowrap;text-align:left;color:#fff;">
                                                <span>{{scope.row.name}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  fixed label="编码" >
                                        <template slot-scope="scope">
                                            <div  style="white-space: nowrap;text-align:left;color:#fff;">
                                                <span>{{scope.row.value}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  fixed label="排序" >
                                        <template slot-scope="scope">
                                            <div  style="white-space: nowrap;text-align:left;color:#fff;">
                                                <span>{{scope.row.sort}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    
                                    <el-table-column  fixed label="是否启用" width="80">
                                        <template slot-scope="scope">
                                                <el-switch
                                                    v-model="scope.row.enable" 
                                                    :active-color="bgColor"
                                                    :disabled="true"
                                                    >
                                                </el-switch>
                                        </template>
                                    </el-table-column>
                                    <el-table-column  fixed label="说明" >
                                        <template slot-scope="scope">
                                            <div  style="white-space: nowrap;text-align:left;color:#fff;">
                                                <span>{{scope.row.description}}</span>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                        </div>
                    </div>
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
                <el-button type="primary" @click="dialogVisible = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import asideItem from './asideItem.vue'
import message from '../common/message.vue'
export default {
    data(){
        return {
            defaultProps: {
                label: 'text',
                children: 'children',
                isLeaf: 'leaf'
            },
            dialogVisible:false,
            selectNode:{},
            searchText:'',
            addObject:{},
            addSonObject:{},
            addAsideObject:{},
            isEdit:false,
            isAddAsideShow:false,
            tableHeightNum2:0,
            tableHeightNum1:0,
            isAddFormShow:false,
            isAddSonFormShow:false,
            title:'',
            titleSon:'',
            deleteMsg:{
                show:false,
                title:'',
                content:'',
                callback:this.callback,
            },
            manuList:[],
            nodeList:[],
            models:[],
            user:{},
            nodeSelectNode:{},
            manuSelectNode:{},
            deleteFlag:0,
            AsideObjectType:'',
        }
    },
    mounted() {
        this.$nextTick(()=>{
            this.tableHeightNum2=parseInt(this.$refs.tableHeight2.offsetHeight)-1
            this.tableHeightNum1=parseInt(this.$refs.tableHeight1.offsetHeight)-1
        })
    },
    components:{
        asideItem,message
    },
    created(){
        this.bgColor = this.$store.state.themeColor
        this.fontColor = this.$store.state.themeBG
        this.$bus.on('handelDepart', this.addOrEditDepart);
        // this.loadData();
        this.loadAsideData()
        this.user=this.sessionUtil.getUser();
    },
    beforeDestroy () {
      this.$bus.off('handelDepart', this.addOrEditDepart)
    },
    computed:{
        ...mapState({
            companyUid:state => state.companyUid
        })
    },
    methods:{
        handleSelectNodeClick(node){
            // console.info(node);
            if(this.isAddFormShow){
                if(node.id != this.addObject.id){
                    this.addObject.parentId = node.id;
                    this.addObject.parentText = node.text;
                }
            }else if(this.isAddAsideShow){
                if(node.id != this.addAsideObject.id){
                    this.addAsideObject.parentId = node.id;
                    this.addAsideObject.parentText = node.text;
                }
            }
            this.dialogVisible = false;
        },
        AsideParent(){
            this.dialogVisible = true;
        },
        SaveAsiede(){
            if(!this.addAsideObject.text) {
                this.util.warn('请输入应用名称！')
                return false;
            }
            if(!this.addAsideObject.value) {
                this.util.warn('请输入应用编码！')
                return false;
            }
            if(!this.addAsideObject.sort) {
                this.util.warn('请输入应用排序！')
                return false;
            }

            if(this.addAsideObject.title=='添加'){
            var param={
                code:this.addAsideObject.value,
                text:this.addAsideObject.text,
                remark:this.addAsideObject.remark,
                enable:this.addAsideObject.enable?1:0,
                sort:this.addAsideObject.sort,
                type:this.AsideObjectType,
            }
            if(this.addAsideObject.parentId){
                param.parentId=this.addAsideObject.parentId
            }
            this.util.restPost('/api_v1/sys/tree',param,(res)=>{
                 if(res.status==200){
                     this.loadAsideData()
                     this.isAddAsideShow=false;
                     this.addAsideObject={}
                 }else{
                     this.util.error(res.errorMsg)
                 }
             })
            }else{
            var param={
                code:this.addAsideObject.value,
                text:this.addAsideObject.text,
                remark:this.addAsideObject.remark,
                enable:this.addAsideObject.enable?1:0,
                sort:this.addAsideObject.sort,
                parentId:this.addAsideObject.parentId,
                type:this.addAsideObject.type,
            }
            this.util.restPut('/api_v1/sys/tree/'+this.addAsideObject.id,param,(res)=>{
                 if(res.status==200){
                     this.loadAsideData()
                     this.isAddAsideShow=false;
                     this.addAsideObject={}
                 }else{
                     this.util.error(res.errorMsg)
                 }
             })
            }
        },
        loadAsideData(){
             this.util.restGet('/api_v1/sys/tree',{ifContainChild:true},(res)=>{
                 console.log(res)
                 if(res.status==200){
                     if(res.data){
                         this.models=res.data
                     }else{
                         this.models=[]
                     }
                 }else{
                     this.util.error(res.errorMsg)
                 }
             })
        },
        cancelSon(){
            this.addSonObject={};
            this.isAddSonFormShow=false
        },
        cancel(){
            this.addObject={};
            this.isAddFormShow=false
        },
        success(){
            if(this.title=='添加'){
                var o={
                    dicId: this.addObject.dicId,
                    parentId:this.addObject.parentId,
                    dicName: this.addObject.name,
                    sort: this.manuList.length+1,
                    type: this.addObject.value?1:0,
                    description: this.addObject.description,
                }
            this.util.restPost('/api_v1/dic',o,(res)=>{
                // console.log(res)
                if(res.status==200){
                    this.util.success('保存成功')
                    this.loadData()
                    this.nodeList=[]
                    // this.loadSonData()
                    this.cancel()
                }else{
                    this.util.error(res.errorMsg)
                }
            })
            }else{
                var o={
                    parentId:this.addObject.parentId,
                    dicId: this.addObject.dicId,
                    dicName: this.addObject.name,
                    sort: this.manuList.length+1,
                    type: this.addObject.value?1:0,
                    description: this.addObject.description,
                    id:this.manuSelectNode.id
                }
                this.util.restPut('/api_v1/dic/{id}',o,(res)=>{
                    console.log(res)
                    if(res.status==200){
                        this.util.success('修改成功')
                        this.loadSonData()
                        this.loadData()
                        this.cancel()
                    }else{
                        this.util.error(res.errorMsg)
                    }
                })
            }
        },
        successSon(){
            if(this.titleSon=='添加'){
                var o={
                    parentId: this.manuSelectNode.id,
                    name: this.addSonObject.name,
                    sort: this.addSonObject.sort,
                    value: this.addSonObject.value,
                    enable: this.addSonObject.enable?1:0,
                    description: this.addObject.description,
                }
            this.util.restPost('/api_v1/dic/items',o,(res)=>{
                console.log(res)
                if(res.status==200){
                    this.util.success('保存成功')
                    // this.nodeList=[]
                    this.loadSonData()
                    this.cancelSon()
                }else{
                    this.util.error(res.errorMsg)
                }
            })
            }else{
                var o={
                    parentId: this.manuSelectNode.id,
                    name: this.addSonObject.name,
                    sort: this.addSonObject.sort,
                    value: this.addSonObject.value,
                    enable: this.addSonObject.enable?1:0,
                    description: this.addObject.description,
                    id:this.nodeSelectNode.id
                }
                this.util.restPut('/api_v1/dic/items/{id}',o,(res)=>{
                    console.log(res)
                    if(res.status==200){
                        this.util.success('修改成功')
                        this.loadSonData()
                        this.cancelSon()
                    }else{
                        this.util.error(res.errorMsg)
                    }
                })
            }
        },
        nodeLIstShow(node){
            if(node){
                this.manuSelectNode=node;
                this.loadSonData()
            }
         
        },
        loadSonData(){
            this.util.restGet('/api_v1/dic/'+this.manuSelectNode.dicId+'/items',null,(res)=>{
            //   this.util.restGet('/api_v1/dic/'+this.manuSelectNode.value+'/items',null,(res)=>{
                if(res.status==200){
                    if (res.data&&res.data.length) {
                        for (var index = 0; index < res.data.length; index++) {
                        if(res.data[index].enable==1){
                            res.data[index].enable=true
                        }else{
                            res.data[index].enable=false
                        }
                    }
                    this.nodeList=res.data
                    }else{
                        this.nodeList=[]
                    }                    
                    
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        nodeSelect(node){
            this.nodeSelectNode=node;
        },
        addOrEditDepart(data){
             if(data.handleFlag=='deleteNode'){
                this.AsideDelete(data.data)
            }else if(data.handleFlag=='edit'){
                this.AsideEdit(data.data)
            }else if(data.handleFlag=='add'){
                this.AsideAdd(data.data)
            }else{
                this.selectNode=data;
                this.loadData()
            }
        },
        AsideDelete(node){
            this.deleteFlag=2
            this.deleteMsg.show=true;
            this.deleteMsg.title='删除应用';
            this.deleteMsg.content='此操作为不可恢复操作，请确认是否删除本应用；是，请点击【确定】，否，请点击【取消】';
            this.deleteMsg.obj=node
        },
        AsideAdd(node){
            if(node){
                this.addAsideObject.parentId=node.id
                this.addAsideObject.parentText=node.text
                this.addAsideObject.sort=node.children?node.children.length+1:1
                this.addAsideObject.type=node?node.type:''
                this.addAsideObject.enable=false
                this.AsideObjectType=this.addAsideObject.type+''
            }else{
                this.addAsideObject={}
                this.addAsideObject.sort=this.models.length+1
            }
            this.addAsideObject.title='添加'
            this.isAddAsideShow=true
        },
        AsideEdit(node){
            this.addAsideObject=node
             this.util.restGet('/api_v1/sys/tree/'+node.id,null,(res)=>{
                    if(res.status==200){
                        console.log(res.data)
                        this.addAsideObject=res.data
                        this.addAsideObject.enable=res.data.enable==1?true:false;
                        this.addAsideObject.value=res.data.code
                        this.addAsideObject.parentText=node.parentText
                        this.addAsideObject.title='编辑'
                        this.isAddAsideShow=true
                    }else{
                        this.util.error(res.errorMsg)
                    }
                })

        },
        callback(){  
            if(this.deleteFlag==1){
                 this.util.restDelete('/api_v1/dic/'+this.manuSelectNode.id,null,(res)=>{
                    if(res.status==200){
                        this.util.success('删除成功')
                        this.loadData()
                        this.nodeList=[]
                    }else{
                        this.util.error(res.errorMsg)
                    }
                })
            }else if(this.deleteFlag==0){
                this.util.restDelete('/api_v1/dic/items/'+this.nodeSelectNode.id,null,(res)=>{
                    if(res.status==200){
                        this.util.success('删除成功')
                        this.loadSonData()
                    }else{
                        this.util.error(res.errorMsg)
                    }
                })
            }else if(this.deleteFlag==2){
                if(this.deleteMsg.obj.children&&this.deleteMsg.obj.children.length>0){
                    this.util.error('请先删除下级')
                    return
                }
                this.util.restDelete('/api_v1/sys/tree/'+this.deleteMsg.obj.id,null,(res)=>{
                    if(res.status==200){
                        this.util.success('删除成功')
                        if(this.selectNode.id==this.deleteMsg.obj.id){
                            this.selectNode={}
                            this.nodeList=[]
                            this.loadData()
                            // this.loadSonData()
                        }
                        this.loadAsideData()
                        this.deleteMsg.obj={}
                    }else{
                        this.util.error(res.errorMsg)
                    }
                })
            }
        },
        loadData(){
            console.log('this.companyUid')
            console.log(this.companyUid)
           var param={
                companyUid:this.companyUid,
                search:this.searchText
            }
            if(this.selectNode.id){
                param.parentId=this.selectNode.id
            }
            if(this.sessionUtil.isCompanyAdmin()){
                param.type=2
            }
                console.log(this.selectNode)
            this.util.restGet('/api_v1/dic',param,(res)=>{
            // this.util.restGet('/api_v1/dic/{companyUid}/dics',param,(res)=>{
                console.log(res)
                if(res.status==200){
                    if(res.data&&res.data.length>0){
                        for (var i = 0; i < res.data.length; i++) {
                         res.data[i].type==0?res.data[i].type=false:res.data[i].type=true;
                        }
                    this.manuList=res.data
                     }else{
                        this.manuList=[]
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        addWorkflow(){
            if(!this.selectNode.id){
                this.util.error('请先选择应用')
                return 
            }
            this.title='添加';
            this.isAddFormShow=true
            this.addObject.parentText=this.selectNode.text
            this.addObject.parentId=this.selectNode.id?this.selectNode.id:''
        },
        editWorkflow(){
             if(!this.selectNode.id){
                this.util.error('请先选择应用')
                return 
            }
            if(!this.manuSelectNode.id){
                this.util.error('请选择要修改的字典')
                return
            }
  
            this.addObject={
                dicId:this.manuSelectNode.dicId,
                name:this.manuSelectNode.dicName,
                value:this.manuSelectNode.type,
                description:this.manuSelectNode.description,
                parentText:this.selectNode.text,
                parentId:this.selectNode.id,
            }
            this.isAddFormShow=true
            this.title='修改';
        },
       
        deleteWorkflow(){
            // if(!this.selectNode.id){
            //     this.util.error('请先选择应用')
            //     return 
            // }
            if(!this.manuSelectNode.id){
                this.util.error('请选择要删除的字典')
                return
            }
            this.deleteFlag=1
            this.deleteMsg.show=true;
            this.deleteMsg.title='删除字典';
            this.deleteMsg.content='此操作为不可恢复操作，请确认是否删除本字典；是，请点击【确定】，否，请点击【取消】';
        },
        addNode(){
             if(!this.manuSelectNode.id){
                this.util.error('请选择字典')
                return
            }
            if(!this.nodeList){
                this.nodeList=[]
            }
            this.addSonObject.sort=this.nodeList.length+1
            this.isAddSonFormShow=true
            this.titleSon='添加';
        },
        saveNode(){
             if(!this.manuSelectNode.id){
                this.util.error('请选择字典')
                return
            }
             if(JSON.stringify(this.nodeSelectNode)=='{}'){
                this.util.error('请选择要修改的字典子项')
                return
            }
            this.addSonObject= this.nodeSelectNode;
            this.isAddSonFormShow=true
            this.titleSon='修改';
        },
        deleteNode(){
             if(JSON.stringify(this.nodeSelectNode)=='{}'){
                this.util.error('请选择要删除的字典子项')
                return
            }
           
            this.deleteFlag=0
            this.deleteMsg.show=true;
            this.deleteMsg.title='删除字典子项';
            this.deleteMsg.content='此操作为不可恢复操作，请确认是否删除本字典；是，请点击【确定】，否，请点击【取消】';
        },
    }
}
</script>
<style scoped>
.manage-box{
    color: #333;
    text-align: left;
    height:100%;box-sizing: border-box;
}
input{
    border: 0 none;
    outline: 0 none;
    background: transparent;
    color: #fff;
    
}
/* button{
    padding: 0;
    background: #fff;
} */
.footer button{
    padding: 9px 15px;
}
.aside{
    width: 300px;
    background: #FFFFFF;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10);
    overflow: hidden;
    float: left;
    position: absolute;
    left: 0;
    height: 100%;
    /* padding-top: 44px;
    box-sizing: border-box; */
}
.aside>p{
    background: #FDEED9;
    box-shadow: 0 0 0 0 #D9D9D9, inset 0 0 0 0 #D9D9D9;
    width: 100%;
    height: 44px;
    line-height: 44px;
    box-sizing: border-box;
    padding-left: 20px;
    font-size: 14px;
    color: #333;
    border-bottom: 1px solid #d7d7d7;
    /* position: absolute;
    top: 0; */
}
.content{
    overflow: hidden;
    box-sizing: border-box;
    background: #fff;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10);
    padding: 0 20px ;
}
.content-button{
    float: right;
    margin-top: -5px;
}
.content-button>.input{
    padding:8px 5px 10px;
    margin-right: 20px;
    border: 1px solid #e7e7e7;
    border-radius: 1px;
    font-size: 12px;
    width: 190px;
    position: relative;
    height: 36px;
    box-sizing: border-box;
}
.content-button>.input>button{
    position: absolute;
    width:36px ;
    height:36px ;
    background: url(../../assets/administrationIcon/search.png) no-repeat center;
    right: 0;
    top: 0;
    border: 0 none;
    border-left: 1px solid 
}
.content-button>div button{
    box-sizing: border-box;
    margin: 5px 0 5px 4px;
}

.content-button>input, 
.content-button>div,
.content-button>div button{
    vertical-align: middle;
    float: left;
} 
.content-button>div button:nth-child(2){
    border-left: 0 none;
    border-right: 0 none;
}
.title{
    position: relative;
}
.tab{
    position: absolute;top: 0;
    left: 10px;
    z-index: 2;
}
.tab>div{
    float: left;
    padding: 0 10px;
}
.active{
    position: relative;
}
.active::after{
    content: '';
    position: absolute;
    width: 100%;
    bottom: -6px;
    left: 0;
    height: 2px;
    background: #F08B00;
}
.operation span{
    cursor: pointer;
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
.box{
    width: 812px;
    transform: translate(-50%,-50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px ;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    /* height: 274px; */
    z-index: 99;
    overflow: hidden;
    padding: 0 20px ;
    box-sizing: border-box;
}
.footer{
    position: absolute;
    bottom: 10px;
    right: 20px;
}
.add-from{
    overflow: hidden;
    margin-bottom: 20px;
}
.add-from .add-from-left{
    float: left;
}
.add-from .add-from-right{
    float: right;
}
.add-from>div>div{
    float: left;
}
.add-from-input{
    width: 296px;
    height: 38px;
    border: 1px solid #d4d4d4;
    border-radius: 1px;
    box-sizing: border-box;
    padding: 6px 0 10px 5px;
    font-size: 14px;
    color: #333333;
}
.add-from-input input{
    color: #333;
    width: 100%;
}
.add-from-input.add-from-disable{
    background: #F4F4F4;
}
.add-from-label{
    height: 38px;
    line-height: 38px;
    width: 70px;
    text-align: left;
}
.add-from-input i{
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
</style>
<style>
.manu-table .el-table__body tr.hover-row>td{
    background: transparent;
}

.add-from-input .el-select{
    width: 100%;
}
.add-from-input .el-select .el-input__inner{
    border: 0 none;
    padding-left:5px ;
}

/* .bg .manage-box .el-table--border, .bg .manage-box .el-table--group, .bg .manage-box .el-table td, .bg .manage-box .el-table th.is-leaf{
  border-color:#ccc;
  color:#333;
  }
  .bg .manage-box .el-table--border:after, .bg .manage-box .el-table--group:after, .bg .manage-box .el-table:before{
    background: #ccc;
  }
  .bg .manage-box .el-table__body tr.current-row>td{
    background: #f6f6f6;
  } */
</style>
