<template>
    <div style="width: 100%;height: 100%;">
        <selectUser :selectMemberModels="selectUserModels"></selectUser>

        <div  v-if="ismask">
            <selectQuarters  :models="models" @selectQuarterOut="selectQuarterIn"></selectQuarters>
        </div>
         <!-- <div  v-if="memberOrPost">
            <selectmore  :models="selectmoreObj" @selectQuarterOut="selectMoreIn"></selectmore>
        </div> -->
        <div v-if="isaddPost=='addrolepage'" class="add-people-box">
            <div class="back" @click="isaddPost=''"><button>返回上一级</button></div>
            <div>
                <h4>角色信息</h4>
                 <div style="overflow:hidden;position:relative">
                    <div class="gain" style="margin-bottom:0">
                        <div >角色类型 <span class="Required">*</span></div>
                        <input type="text" v-model="roleObj.roleName" placeholder="请输入角色名称">
                    </div>
                </div>
                <div class="section-footer" style="width:auto;float:right">
                    <button :style="`border-color:${bgColor};background:${bgColor};color:#fff;`" @click="submitRole()">提交</button>
                    <button style="color:#666;background:#fff;" @click="resetRole">重置</button>
                </div>
                <!-- <h4>权限选择
                    <p @click="AllCheck()">
                        <img src="../../../assets/administrationIcon/active.png" v-if="isAllCheck" alt="">
                        <img src="../../../assets/administrationIcon/defult.png" v-if="!isAllCheck" alt="">
                        全选
                    </p>
                    <div class="section-footer" style="width:auto;float:right">
                        <button style="border-color:#F08B00;background:#F08B00;color:#fff;" @click="submitRole()">提交</button>
                        <button style="color:#666;background:#fff;" @click="resetRole">重置</button>
                    </div>
                </h4>
                <div class="jurisdiction-list">
                    <ul>
                        <li v-for="(jurisdictionItem,key) in jurisdictionList" :key="key">
                            <p @click="jurisdictionAll(jurisdictionItem)">
                                <img src="../../../assets/administrationIcon/active.png" v-if="jurisdictionItem.isAll" alt="">
                                <img src="../../../assets/administrationIcon/defult.png" v-if="!jurisdictionItem.isAll" alt="">
                                {{jurisdictionItem.name}}
                            </p>
                            <div style="height:100%;width:100%;overflow:auto;max-height:204px;">
                                <div class="options" v-for="(item,indexs) in jurisdictionItem.children" :key="indexs">
                                    <span>{{item.name}}</span>
                                    <div style="float:right;">
                                        <div class="options-checked" v-for="(obj,index) in item.children" :key="index" @click="handelSelected(obj,jurisdictionItem)">
                                            <img src="../../../assets/administrationIcon/active.png" v-show="ifSelected(obj)" alt="">
                                            <img src="../../../assets/administrationIcon/defult.png" v-show="!ifSelected(obj)" alt="">
                                            {{obj.name}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div> -->
            </div>
             
        </div>
        
        <div v-if="isaddPost==''" class="list-box">
            <div class="unit-left">
                <div>
                    <h4>角色管理
                        <div class="button-list">
                            <div class="search" style="overflow:hidden">
                                <input type="text" v-model="search" @keyup.enter="getRoleList()" placeholder="请输入关键字搜索">
                                <button @click="getRoleList()"></button>
                            </div>
                            <button style="margin-right: 20px;" @click="deleteSome()">删除</button>
                            <button style="background: #3B8CFF;color: #fff;border: 1px solid  #3B8CFF;"  @click="addRoles()">添加角色</button>
                            <!--:style="{background:bgColor,borderColor:bgColor,color:'#fff'}"-->
                        </div>
                    </h4>
                    <div class="unit_com_table" ref="table_box">
                        <el-table 
                            :data="roleList" 
                            border
                            style="height:91%!important"
                            :cell-style="{textAlign:'center'}" 
                            height="91%" 
                            :header-cell-style="headerCell"
                            highlight-current-row  
                            @row-click="getRoleUsers" @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="45"></el-table-column>
                            <el-table-column label="操作" fixed width="80">
                            <template slot-scope="scope">
                                <p class="operation" v-show="scope.row.roleId!='ROLE__1levelLeader'&&scope.row.roleId!='ROLE__companyLeader'&&scope.row.roleId!='ROLE__middleLeader'&&scope.row.roleId!='ROLE__2levelLeader'&&scope.row.roleId!='ROLE__president' ">
                                    <img src="../../../assets/administrationIcon/edit1.png" width="14"  @click="editRole(scope.row)" alt="">
                                    <img src="../../../assets/administrationIcon/remove1.png" width="15"  @click="deleteRole(scope.row)" alt="">
                                </p>
                            </template>
                            </el-table-column>
                            <el-table-column label="角色名称" width="150">
                                <template slot-scope="scope">
                                    <span style="white-space: nowrap;margin-left: 10px">{{scope.row.roleName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="角色描述" >
                                <template slot-scope="scope">
                                    <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.remark}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>

                </div>
            </div>
            <div class="unit-com">
                <div>
                    <h4>所属角色：{{belongRole.roleName}}
                        <div class="button-list">
                            <button style="background: #3B8CFF;color: #fff; border: 1px solid  #3B8CFF;"  @click="addPeople()">添加人员</button>
                        </div>
                    </h4>
                    <div class="table-wrap">
                        <el-table 
                            :data="tableData1"
                            border
                            :cell-style="{textAlign:'center'}" 
                            height="100%" 
                            id="el-table"
                            highlight-current-row  
                            :header-cell-style="headerCell">
                            <el-table-column type="selection" width="45"></el-table-column>
                            <el-table-column label="操作" fixed width="60">
                                <template slot-scope="scope">
                                    <p class="operation">
                                        <img src="../../../assets/administrationIcon/removedepart.png"  @click="deleteRoleUser(scope.row)" alt="">
                                    </p>
                                </template>
                            </el-table-column>
                            <el-table-column label="姓名">
                                <template slot-scope="scope">
                                    <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.userName }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="性别">
                                <template slot-scope="scope">
                                    <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.gender==1? '男':'女' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="账号" >
                                <template slot-scope="scope">
                                    <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.userId}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column label="手机号" >
                                <template slot-scope="scope">
                                    <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.mobileNo}}</span>
                                </template>
                            </el-table-column>
                        </el-table>
                        <!-- <div style="position:absolute;bottom:120px;left:50%;transform:translateX(-50%);z-index: 20;">
                            <el-pagination
                                @size-change="changePageSize($event)"
                                @current-change="changePageNum($event)"
                                :current-page="pageNum"
                                :page-sizes="[10, 25, 50, 100]"
                                :small="true"
                                :page-size="pageSize"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="totalCount">
                            </el-pagination>
                        </div> -->
                    
                    </div>
                    <div class="pagination-wrap">
                        <pagination-com :totalCount="totalCount" :page-size="pageSize" @getCurPage="changePageNum"></pagination-com>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import selectmore  from '../select-more.vue'
import selectUser from '../../../common/select-user/select-user.vue'
import selectQuarters from '../../../common/select-depart/select-depart.vue'
import paginationCom from '../../../common/base/pagination/pagination.vue'
import {tableMixin} from '../../../public/js/mixins.js'

export default {
    mixins:[tableMixin],
    data(){
        return {
            selectUserModels: {
                isShow: false,
                selectList: [],
                callBack: this.selectMoreIn,
                radioSelectFlags: false
            },
            isaddPost:"",
            search:"",
            memberOrPost:false,
            ismask:false,
            isAllCheck:false,
            pageNum: 1,//分页下标
            pageSize: 10,//分页大小
            totalCount: 0,//总记录数
            postList:[],
            belongRole:{},
            selectmoreObj:{},
            bgColor:'',
            identity:'',
            roleObj:{},
            addnode:{sex:'请选择性别'},
            selectList:[],
            models:[],
            jurisdictionList:[],
            jurisdictionLength:0, //权限数组长度
            roleList: [],
            tableData1: [],
            selectJurisdiction:[], //被选中的权限
        }
    },
    computed: {
        ...mapState({
            companyUid: state => state.companyUid,
            // orgUserDatas: state => state.orgUserDatas
        }),
        
    },
    created(){
        this.util.init(this);
        this.fontColor=this.$store.state.themeBG
        this.bgColor=this.$store.state.themeColor;
        this.util.mask()
        // this.axiosObj.all([this.getRoleList(),this.getJurisdictionData()], (res)=> {
        //     this.util.unmask();
        // });
        // this.getRoleList();
        // this.getJurisdictionData();
        
    },
    components:{
        selectmore,selectQuarters,selectUser,paginationCom
    },
    methods:{
        //修改页面大小
      changePageSize (pageSize) {
        this.pageSize = pageSize
        
        // this.loadData()
      },
      //页面跳转
      changePageNum (pageNum) {
        this.pageNum = pageNum
        // this.loadData()
      },
        refreshRoleList(){//刷新数据

        },
        ifSelected(obj){//角色权限是否被选中
            const isSelected = this.selectJurisdiction.find(item => item.resourceId === obj.resourceId);
            if(isSelected!=undefined){
                return true;
            }else{
                return false;
            }
        },
        handelSelected(obj,parent){//选中取消
            const index = this.selectJurisdiction.findIndex(item => item.resourceId === obj.resourceId);
            if(index>-1){
                parent.isAll=false;
                this.isAllCheck=false;
                this.selectJurisdiction.splice(index, 1);
            }else{
                this.selectJurisdiction.push(obj);
                var temp =true;
                parent.children.forEach(item => {
                    for(var i=0;i<item.children.length;i++){
                        const key = this.selectJurisdiction.findIndex(jurObj => jurObj.resourceId === item.children[i].resourceId);
                        if(key==-1){
                            temp=false;
                            break;
                        }
                    }
                });
                if(temp){
                    parent.isAll=true;
                }
                if(this.selectJurisdiction.length==this.jurisdictionLength){
                    this.isAllCheck=true;
                }
                
            }
        },
        getRoleList(){ //获取角色列表
            this.util.mask()
           // this.util.post('/org/getRoles', { companyUid: this.$store.state.companyUid }, (res)=> {
            this.util.restGet('/api_v1/org/roles', { companyUid: this.$store.state.companyUid,start:0,pageSize:100,search:this.search }, (res)=> {
              
                if (res.status == 200) {
                    this.roleList=res.data;
                } else {
                    this.util.error(res.errorMsg);
                }
                this.util.unmask();
            });
        },
        getJurisdictionData(){//获取权限列表
            // this.util.mask();
            this.util.post('/org/resource/findAllAuthorities', { suite_id: window.suite_id ,id:"01"}, (res)=> {
                if(res.status==200){
                    this.jurisdictionList=res.data[0].children;
                    this.jurisdictionLength=0; //计算权限数组长度
                    this.jurisdictionList.forEach(objItem => {
                        objItem.children.forEach(item => {
                            this.jurisdictionLength+=item.children.length;
                        });
                    });
                }else {
                    this.util.error("系统错误");
                }
                // this.util.unmask();
            });
        },
        addRoles(){//添加角色
            this.roleObj={};
            this.selectJurisdiction=[];
            this.isaddPost='addrolepage';
        },
        editRole(node){//编辑角色
            this.roleObj=node;
            // this.util.mask();
            // this.util.post('/org/resource/findAllAuthoritiesByRole', { suite_id:window.suite_id , roleUid:node.id , type:"01" , isSys:node.isSys }, (res)=> {
            //     // console.debug(res);
            //     if(res.status==200){
            //         this.selectJurisdiction=res.data;
            //     }else {
            //         this.util.error("系统错误");
            //     }
            //     this.util.unmask();
            // });
            this.isaddPost='addrolepage';
        },
        deleteRole(obj){
            console.debug(obj);
            return;
            this.util.confirm('确定要删除此角色吗?',null,(result)=>{
                this.util.mask("正在删除..");
                //this.util.post('/org/role/delete', { id:obj.id}, (res)=> {
                    this.util.restDelete('/api_v1/org/roles/{id}', { id:obj.id}, (res)=> {
                    if(res.status==200){
                        this.util.success("删除成功！");
                        const index = this.roleList.findIndex(item => item.id === obj.id);
                        if(this.belongRole.id&&this.belongRole.id==obj.id){
                            this.tableData1=[]
                        }
                        this.roleList.splice(index,1);
                    }else {
                        this.util.error(res.errorMsg);
                    }
                    this.util.unmask();
                });
                
            });
        },
        deleteRoleUser(obj){
            this.util.confirm('确定要删除此员工角色吗?',null,(result)=>{
                this.util.mask("正在删除..");
               // this.util.post('/org/userRole/delete', { userUid:obj.id,roleUid:this.belongRole.id}, (res)=> {
                 this.util.restDelete('/api_v1/org/roles/{roleUid}/users/{userUid}', { userUid:obj.id,roleUid:this.belongRole.id}, (res)=> {
                    if(res.status==200){
                        this.util.success("删除成功！");
                        const index = this.tableData1.findIndex(item => item.id === obj.id);
                        this.tableData1.splice(index,1);
                    }else {
                        this.util.error(res.errorMsg);
                    }
                    this.util.unmask();
                });
                
            });
        },
        jurisdictionAll(objItem){//单项全选
            objItem.isAll=!objItem.isAll;
            if(objItem.isAll){
                objItem.children.forEach(item => {
                    this.selectJurisdiction = this.selectJurisdiction.concat(item.children);
                });
            }else{
                objItem.children.forEach(item => {
                    if(item.children!=undefined){
                        item.children.forEach(obj => {
                            this.selectJurisdiction = this.selectJurisdiction.filter(jurObj => jurObj.resourceId != obj.resourceId);
                        });
                    }
                });
            }
        },
        AllCheck(){ //全选
            this.isAllCheck=!this.isAllCheck
            if(this.isAllCheck){
                this.jurisdictionList.forEach(objItem => {
                    objItem.isAll=this.isAllCheck;
                    objItem.children.forEach(item => {
                        this.selectJurisdiction = this.selectJurisdiction.concat(item.children);
                    });
                });
            }else{
                this.jurisdictionList.forEach(objItem => {
                    objItem.isAll=this.isAllCheck;
                });
                this.selectJurisdiction=[];
            }
        },
        submitRole(){ //保存编辑角色
            this.roleObj.company=this.companyUid;
            if(this.validUtil.isNotEmpty(this.roleObj.id)){//编辑操作
                this.util.mask("正在保存!");
                this.util.restPut('/api_v1/org/roles/{id}', this.roleObj, (res)=> {
                    console.info(res);
                    if(res.status==200){
                        this.util.success("修改成功！");
                        this.isaddPost='';
                        this.getRoleList();
                    }else{
                        this.util.error("系统错误!");
                    }
                    this.util.unmask();
                });
                this.saveRoleJurisdiction(this.roleObj.id);
            }else{
                this.util.mask("正在保存");
                var roleId="ROLE_"+this.$store.state.companyId+"_"+Math.random().toString(36).substr(2);
                //this.util.post('/org/role/create', { roleName: this.roleObj.roleName,roleId:roleId }, (res)=> {
                  this.util.restPost('/api_v1/org/roles', { roleName: this.roleObj.roleName,roleId:roleId,remark: this.roleObj.remark}, (res)=> {
                    if(res.status==200){
                        this.saveRoleJurisdiction(res.data.id);
                        this.util.success("保存成功！");
                        this.isaddPost='';
                        this.getRoleList();
                    }else{
                        this.util.error(res.errorMsg);
                    }
                    
                    this.util.unmask();
                });
            }
            
        },
        saveRoleJurisdiction(roleUid){//保存角色权限
            this.util.post('/org/resource/saveAuthoritiesByRole',{ roleUid:roleUid, suite_id:window.suite_id , type:"01" , data:JSON.stringify(this.selectJurisdiction)} , (res)=>{
               if(res.status==200){
                   
                }else{
                    //this.util.error("保存角色权限失败！");
                }
            });
        },
        resetRole(){
            this.roleObj={};
            this.selectJurisdiction=[];
        },
        selectQuarterIn(data){
            this.postList=data;
        },
        addNew(arr){
            this.moveMemberFlag=false
            this.ismask=true;
            this.qingkongArrSelect(this.postList)
        },
        qingkongArrSelect(arr){
            for(var i= 0;i<arr.length;i++){
                arr[i].select=false
            }
            arr=[];
        },
        selectMoreIn(){//保存人员角色
            var dataList =[],data=this.selectUserModels.selectList;
            data.forEach(item => {
                var obj ={
                    userUid:item.id,
                    roleUid:this.belongRole.id
                };
                dataList.push(obj);
            });
            this.util.mask("正在保存");
             this.util.restPost('/api_v1/org/roles/'+this.belongRole.id+'/users',dataList , (res)=>{
                this.util.unmask()
               if(res.status==200){
                   this.util.success("保存成功！");
                   this.getRoleUsers(this.belongRole);
                }else{
                    this.util.error("保存失败！");
                }
            });
            
        },
        back(){
            this.isaddPost='';
        },
        reset(){
            this.addnode={sex:'请选择性别'}
        },
        handleSelectionChange(data){
            this.selectList=data
        },
        addPeople(){
            if(!this.validUtil.isNotEmpty(this.belongRole.id)){
                this.util.error("请先选择角色!");
                return;
            }
            this.selectUserModels.isShow=true
            // this.memberOrPost=true;
            // this.selectmoreObj={
            //     title:'添加人员',
            //     type:"member",
            //     centerList:this.$store.state.totalUsers,
            //     selectDatas:[]
            // }
        },
         deleteSome(data){   
             this.selectList = this.selectList.filter(item=>{
                 return item.roleId!="ROLE__companyLeader"&&item.roleId!="ROLE__1levelLeader"&&item.roleId!="ROLE__middleLeader"&&item.roleId!='ROLE__2levelLeader'&&item.roleId!='ROLE__president';
             });
             if(this.selectList.length==0){
                this.util.error("请选择需要删除的角色!");
                return;
             }
            this.util.confirm('确定要删除选中的角色吗?','删除角色',(result)=>{
                this.util.mask("正在删除..");
                // var ifSuccess=false;
                // this.selectList.forEach(item => {
                //     this.axiosObj.post('/org/role/delete', { id:item.id}, (res)=> {
                //         if(res.status==200){
                //             const index = this.roleList.findIndex(obj => obj.id === item.id);
                //             this.roleList.splice(index,1);
                //             this.util.success("删除成功！");
                //         }else {
                            
                //             this.util.error(res.errorMsg);
                //         }
                //         this.util.unmask()
                //     });
                // });
                Promise.all([this.selectList.forEach(item => {
                    this.util.restDelete('/api_v1/org/roles/'+item.id, { id:item.id}, (res)=> {});
                })]).then((result) => {
                    this.util.unmask()
                    this.util.success("删除成功！");
                   
                    setTimeout(() => {
                        this.getRoleList();
                    }, 500);
                    
                }).catch((error) => {
                    this.util.unmask()
                    this.util.error(error);
                });
                
            });
        },
        //修改页面大小
        changePageSize(pageSize) {
            this.pageSize = pageSize;
            this.refreshRoleList();
        },
        //页面跳转
        changePageNum(pageNum) {
            this.pageNum = pageNum;
            this.refreshRoleList();
        },
        getRoleUsers(row, event, column){
            this.belongRole=row;
            this.refreshRoleList();
        },
        refreshRoleList(){//刷新数据
            this.util.mask();
            this.util.restGet('/api_v1/org/users', { companyUid: this.$store.state.companyUid ,roleUid:this.belongRole.id,start: this.pageSize * (this.pageNum - 1), pageSize: this.pageSize}, (res)=> {
                // console.log(res);
                if(res.status==200){
                    this.tableData1=res.data;
                    this.totalCount=res.totalCount;
                }else {
                    this.util.error("系统错误");
                }
                this.util.unmask();
            });
        }
        
    },
}
</script>

<style scoped>
.table-wrap {
    height: 81%;
    position: relative;
}
.unit-com > div {
    overflow: hidden;
    height: 100%;
    position: relative;
}
.pagination-wrap {
    padding: 15px 0;
}
.el-table .success-row {
    background: #f0f9eb;
}
.list-box{
    width: 100%;
    height: 100%;
    overflow: hidden;
}
.selectedRow{
    background: #000;
}
.unit-left{
    width: 616px;
}
.unit-left>div{
    width: 100%;
    height: 89%;
    padding: 0 30px;
    box-sizing: border-box;
}
.unit-com{
    position: relative;
    background: #fff;
    height: 100%;
    overflow: auto;
    padding:  0 30px;
    box-sizing: border-box;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10)
}
h4{
    color: #333;
    font-size: 18px;
    font-family: SourceHanSansCN-Medium;
    padding-left: 12px;
    position: relative;
    margin:30px 0;
}
h4 i{
    content: '';
    position: absolute;
    left: 0;
    top: 4px;
    height: 20px;
    width: 2px;
}
.button-list{
    overflow: hidden;
    float: right;
    margin-top: -2px;
}
.button-list>div{
    float: left;
    width: 220px;
    height: 28px;
    padding:0 28px 0 10px;
    box-sizing: border-box;
    position: relative;
    border: 1px solid #e7e7e7;
    background: #fff;
    margin-right: 20px;
}
.button-list>div button{
    width: 26px;
    min-width: 26px;
    border: 0 none;
    height: 26px;
    position: absolute;
    top: 0px;
    right:0px;
    background: url(../../../assets/administrationIcon/search.png) no-repeat center center;
    background-size: 75% 75%;
    margin: 0;
}
.button-list>div input{
    width: 100%;
    height: 20px;
    
}
.button-list button{
    float: left;
    background: #fff;
    height: 28px;
    min-width: 60px;
    border:1px solid #666;
    line-height: 27px;
    box-sizing: border-box;
    padding: 0 10px;color: #666;
}

.editIcon{
    margin-left: 20px;
    position: relative;
}
.editIcon::before{
    content: "";
    position: absolute;
    width: 10px;
    height: 12px;
    background-size: cover;
    left: -13px;
    top: 4px;
}
.delete{
    color:#FF4848;
}
.delete::before{
    background: url(../../../assets/administrationIcon/delete.png) no-repeat ;
}
.editIcon1::before{
    background: url(../../../assets/administrationIcon/editIcon.png) no-repeat ;
}

.back button{
    width: 102px;
    height: 28px;
    line-height: 28px;
    border: 1px solid #666666;
    background: #FFFFFF;
    color: #666;
}
.gain-img{
    width: 120px;
    height: 120px;
    position: absolute;
    left: 570px;
    top: 50px;
    background: red;
}
.gain{
    border-bottom: 1px solid #E7E7E7;
    margin:0 30px 20px 0;
    float: left;
    width: 250px;
    overflow: hidden;
}
.gain input,.gain p,.gain select{
    border:0 none;
    width: 100%;
    margin: 10px 0px;
    height: 15px;
    line-height: 15px;
}
.gain select{
    margin: 0;
    padding:10px 0;
    height: auto;
    border: 0 none;
    outline: 0 none;
}

.gain .gain-button{
    height: 28px;
    text-align: center;
    border: 1px solid #666;
    color: #666;
    background: #fff;
    position: relative;
    padding: 7px 16px;
    width: auto;
    float: left;
    box-sizing: border-box;
    font-size: 14px;
    line-height: 13px;
    margin-right: 20px;
}
.gain-button1::after{
    position: absolute;
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    top: -4px;
    right: -4px;
    background:red;
}
.gain p img{
    width: 6px;
    float: right;
    padding: 5px;
}
.add-people-box{
    background: #fff;
    padding: 30px;
    min-height: 890px;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10);
}
.section-footer{
    height: 28px;
    overflow: hidden;
    box-sizing: border-box;
}
.section-footer button{
    float: right;
    box-sizing: border-box;
    margin-left: 20px;
    border: 2px solid #666666;
    height: 100%;
    width: 60px;
    line-height: 26px;text-align: center;
}
h4 p{
    display: inline-block;
    margin-left: 20px;
    font-size: 14px;
    color: #333333;
    font-weight: 400;
}
h4 p img{
    margin-right: 5px;
    width: 18px;
    float: left;
}
.jurisdiction-list{
    width: 100%;
}
.jurisdiction-list li{
    max-height: 204px;
    margin-bottom: 20px;
    overflow: hidden;
    border: 1px solid #e7e7e7;
    padding-top: 44px;
    position: relative;
}
.jurisdiction-list li p{
    height: 44px;
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid #e7e7e7;
    overflow: hidden;
    box-sizing: border-box;
    position: absolute;top: 0;
    width: 100%;
}

.jurisdiction-list img{
    width: 18px;
}
.options{
    padding:  10px ;
    box-sizing: border-box;
     width: 50%;
    float: left;
    border-right: 1px solid #e7e7e7;
}
.options-checked{
    float: left;
    margin-left: 20px;
}
</style>

<style>
.unit-left .el-checkbox__input.is-checked .el-checkbox__inner,.unit-left .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background: #F08B00;
    border-color: #F08B00;
}
</style>
