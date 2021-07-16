<template>
    <div style="width: 100%;height: 100%;" class="Post-manage-box">
        
         <div  v-if="memberOrPost">
            <selectmore  :models="selectmoreObj" @selectQuarterOut="selectMoreIn"></selectmore>
        </div>
        <modal name="role-modal" class="theme-modal" height="auto" transition="pop-out" :width="700"  :draggable="true">
			<div class="title">
				<p>角色管理(编辑/新增)</p>
                <i @click="$modal.hide('role-modal')" class="el-icon-close"></i>
			</div>
			<div class="modal-content">
				<el-form ref="form" :model="roleObj" label-width="80px">
                    <el-form-item label="角色名称">
                        <el-input type="text" v-model="roleObj.roleName"></el-input>
                    </el-form-item>
                    <el-form-item label="角色描述">
                        <el-input type="textarea" v-model="roleObj.remark"></el-input>
                    </el-form-item>
                </el-form>
			</div>
            <div class="modal-footer">
                <el-button size="mini" @click="$modal.hide('role-modal')">关闭</el-button>
                <el-button size="mini" type="primary" @click="submitRole">提交</el-button>
            </div>
		</modal>
        
        
        <div style="height:100%;width:100%;">
            <div class="list-box">
                <div class="box-style role-list">
                    <div style="padding-top:44px;">
                        <div style="width:100%;position:relative;box-sizing:border-box;">
                            <h4 style="position:absolute;width:100%;top:-34px;left:0;box-sizing:border-box;">角色管理
                                <div class="button-list">
                                    <div class="search" style="overflow:hidden">
                                        <input type="text" v-model="search" @keyup.enter="getRoleList()" placeholder="请输入关键字搜索">
                                        <button @click="getRoleList()"></button>
                                    </div>
                                    <button class="theme-btn theme-delete" @click="deleteSome()" v-if="sessionUtil.isAllowDelete('org_RoleManage')">删除</button>
                                    <button class="theme-btn" @click="addRoles()"  v-if="sessionUtil.isAllowAdd('org_RoleManage')">添加角色</button>
                                </div>
                            </h4>
                        </div>
                        <div ref="tableHeight" style="height:100%;" class="theme-table">
                            <el-table ref="table" :data="roleList" style="width: 100%"  border
                                :header-row-style="{overflow:'hidden',borderColor:'#44d2ff'}" :row-style="{overflow:'hidden',borderColor:'#44d2ff'}"
                                :cell-style="{textAlign:'center',color:'#fff',boxShadow:' 0 0 0 0 #D9D9D9, inset 0 0 0 0 #D9D9D9',borderColor:'#44d2ff'}"
                                :height="tableHeightNum" :header-cell-style="{color:'#fff',borderColor:'#44d2ff',height:'34px',padding:0,textAlign:'center'}"
                                @row-click="getRoleUsers" @selection-change="handleSelectionChange">
                                <el-table-column type="selection" width="45"></el-table-column>
                                <el-table-column label="操作" fixed width="70" v-if="sessionUtil.isAllowEdit('org_RoleManage')||sessionUtil.isAllowDelete('org_RoleManage')">
                                <template slot-scope="scope">
                                    <p class="operation" v-if="!scope.row.isSys">
                                        <span @click="editRole(scope.row)" class="editIcon editIcon1" v-if="sessionUtil.isAllowEdit('org_RoleManage')"></span>
                                        <span class="delete editIcon" @click="deleteRole(scope.row)" v-if="sessionUtil.isAllowDelete('org_RoleManage')"></span>
                                    </p>
                                </template>
                                </el-table-column>
                                <el-table-column label="角色名称" >
                                    <template slot-scope="scope">
                                        <span style="white-space: nowrap;margin-left: 10px">{{scope.row.roleName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="角色描述" width="220">
                                    <template slot-scope="scope">
                                        <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.isSys? '内置角色':scope.row.remark}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                    </div>
                </div>
                <div class="box-style people-list" style="width:auto;"  >
                    <div style="padding-top:44px;padding-bottom:44px;position:relative;">
                        <div style="width:100%;position:relative;box-sizing:border-box;">
                            <h4 style="position:absolute;width:100%;top:-34px;left:0;box-sizing:border-box;">所属角色：{{belongRole.roleName}}
                                <div class="button-list">
                                    <button class="theme-btn" @click="addPeople()" v-if="sessionUtil.isAllowBtn('010104:btn_add_member')" >添加人员</button>
                                </div>
                            </h4>
                        </div>
                        <div style="height:100%;" class="theme-table" ref="tableHeight1">
                            <el-table ref="multipleTable" :data="tableData1" style="width: 100%" :header-row-style="{overflow:'hidden',}"
                                :row-style="{overflow:'hidden',}" border
                                :cell-style="{textAlign:'center',boxShadow:' 0 0 0 0 #D9D9D9, inset 0 0 0 0 #D9D9D9'}"
                                :height="tableHeightNum1" :header-cell-style="{height:'34px',padding:0,textAlign:'center'}">
                                <el-table-column type="selection" width="45"></el-table-column>
                                <el-table-column label="操作" fixed width="60">
                                    <template slot-scope="scope"  v-if="sessionUtil.isAllowBtn('010104:btn_delete_member')">
                                        <p class="operation">
                                            <span class="delete  editIcon" @click="deleteRoleUser(scope.row)"></span>
                                        </p>
                                    </template>
                                </el-table-column>
                                <el-table-column label="姓名" width="150">
                                    <template slot-scope="scope">
                                        <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.userName }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="性别" width="100">
                                    <template slot-scope="scope">
                                        <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.gender==1? '男':'女' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="账号" >
                                    <template slot-scope="scope">
                                        <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.userId}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="手机号" width="150">
                                    <template slot-scope="scope">
                                        <span style="white-space: nowrap;margin-left: 10px">{{ scope.row.mobileNo}}</span>
                                    </template>
                                </el-table-column>
                                
                            </el-table>
                        </div>
                        <div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);z-index: 20;">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from 'vuex'
import  selectmore  from './selectmore.vue'
export default {
    data(){
        return {
            search:"",
            memberOrPost:false,
            pageNum: 1,//分页下标
            pageSize: 10,//分页大小
            totalCount: 0,//总记录数
            tableHeightNum1: 0,
            tableHeightNum: 0,
            belongRole:{},
            selectmoreObj:{},
            bgColor:'',
            roleObj:{},
            addnode:{sex:'请选择性别'},
            selectList:[],
            models:[],
            roleList: [],
            tableData1: [],
        }
    },
    computed: {
        ...mapState({
            companyUid: state => state.companyUid,
            // orgUserDatas: state => state.orgUserDatas
        }),
        
    },
    created(){
        this.fontColor=this.$store.state.themeBG
        this.bgColor=this.$store.state.themeColor;
        
    },
    mounted() {
        this.$nextTick(()=>{
            this.tableHeightNum=this.$refs.tableHeight.offsetHeight
            this.tableHeightNum1=this.$refs.tableHeight1.offsetHeight
        })
        this.getRoleList();
    },
    components:{
        selectmore
    },
    methods:{
        getRoleList(){ //获取角色列表
            this.util.mask()
           this.util.restGet('/api_v1/org/roles', {start:0,pageSize:100,search:this.search,ifContainCommon:true }, (res)=> {
            // this.util.restGet('http://api.com', null, (res)=> {
                if (res.status == 200) {
                    this.roleList=res.data;
                } else {
                    this.util.error(res.errorMsg);
                }
                this.util.unmask();
            });
        },
        addRoles(){//添加角色
            this.roleObj={};
            this.$modal.show('role-modal');
        },
        editRole(node){//编辑角色
            this.roleObj=node;
            
        },
        deleteRole(obj){
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
        submitRole(){ //保存编辑角色
            this.roleObj.company=this.companyUid;
            if(this.validUtil.isNotEmpty(this.roleObj.id)){//编辑操作
                this.util.mask("正在保存!");
                this.util.restPut('/api_v1/org/roles/{id}', this.roleObj, (res)=> {
                    if(res.status==200){
                        this.util.success("修改成功！");
                        this.getRoleList();
                    }else{
                        this.util.error("系统错误!");
                    }
                    this.util.unmask();
                });
            }else{
                this.util.mask("正在保存");
                var roleId="ROLE_"+this.$store.state.companyId+"_"+Math.random().toString(36).substr(2);
                //this.util.post('/org/role/create', { roleName: this.roleObj.roleName,roleId:roleId }, (res)=> {
                  this.util.restPost('/api_v1/org/roles', { roleName: this.roleObj.roleName,roleId:roleId,remark: this.roleObj.remark}, (res)=> {
                    if(res.status==200){
                        this.util.success("保存成功！");
                        this.getRoleList();
                    }else{
                        this.util.error(res.errorMsg);
                    }
                    
                    this.util.unmask();
                });
            }
            
        },
        selectMoreIn(data){//保存人员角色
            var dataList =[];
            data.forEach(item => {
                var obj ={
                    userUid:item.id,
                    roleUid:this.belongRole.id
                };
                dataList.push(obj);
            });
            this.util.mask("正在保存");
            //this.util.post('/org/insertUserRoleBatch',{ data:JSON.stringify(dataList)} , (res)=>{
             this.util.restPost('/api_v1/org/roles/'+this.belongRole.id+'/users',dataList , (res)=>{
                this.util.unmask()
                console.log(res)
               if(res.status==200){
                   this.util.success("保存成功！");
                   this.getRoleUsers(this.belongRole);
                }else{
                    this.util.error("保存失败！");
                }
            });
            
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
            this.memberOrPost=true;
            this.selectmoreObj={
                title:'添加人员',
                type:"member",
                centerList:this.$store.state.totalUsers,
                selectDatas:[]
            }
        },
         deleteSome(data){   
             
             this.selectList = this.selectList.filter(item=>!item.isSys);
             if(this.selectList.length==0){
                this.util.error("请选择要删除的角色!内置角色除外");
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
                    console.log(this.selectList)
                //     });
                // });
                Promise.all([this.selectList.forEach(item => {
                   // this.util.post('/org/role/delete', { id:item.id}, (res)=> {});
                    this.util.restDelete('/api_v1/org/roles/{id}', { id:item.id}, (res)=> {
                        console.log(res)
                    });
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
            this.$refs.table.toggleRowSelection(row,true)
            this.belongRole=row;
            this.refreshRoleList();
        },
        refreshRoleList(){//刷新数据
            this.util.mask();
            this.util.restGet('/api_v1/org/users', { companyUid: this.$store.state.companyUid ,roleUid:this.belongRole.id,start: this.pageSize * (this.pageNum - 1), pageSize: this.pageSize}, (res)=> {
                console.log(res);
                if(res.status==200){
                    this.tableData1=res.data;
                    this.totalCount=res.totalCount;
                }else {
                    this.util.error("系统错误");
                }
                this.util.unmask();
            });
        }
        
    }
}
</script>

<style scoped>

.modal-content{
    height: 230px;
    padding: 20px;
}
.el-table .success-row {
    background: #f0f9eb;
  }
.list-box{
    width: 100%;height: 100%;
}
.selectedRow{
    background: #000;
}
.role-list{
    width: 557px;
    padding-right: 10px;
    float: left;
    height: 100%;
    box-sizing: border-box;
}
.role-list>div{
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    overflow: hidden;
}
.people-list{
    overflow: hidden;
    height: 100%;
    box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10)
}

input{
    border:  0 none;
    outline: 0 none;
  }
.button-list{
    overflow: hidden;
    float: right;
    margin-top: -2px;
    color: #fff;
}
.button-list>div{
    float: left;
    width: 220px;
    height: 28px;
    padding:0 28px 0 10px;
    box-sizing: border-box;
    position: relative;
    border: 1px solid #44d2ff;
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
    background: url(../../assets/administrationIcon/search.png) no-repeat center center;
    background-size: 50% 50%;
    margin: 0;
}
.button-list>div input{
    width: 100%;
    height: 20px;
    color: #fff;
    background: transparent;
}
/* .button-list button{
    float: left;
    height: 28px;
    min-width: 60px;
    line-height: 27px;
    box-sizing: border-box;
    padding: 0 10px;
} */
.people-list{
    box-sizing: border-box;
}
.editIcon{
    margin-left: 20px;
    position: relative;
}
.editIcon::before{
    content: "";
    position: absolute;
    width: 14px;
    height: 14px;
    left: -13px;
    top: 4px;
}
.delete{
    color:#FF4848;
}
.delete::before{
    background: url(../../assets/administrationIcon/delete.png) no-repeat ;
    height: 16px;
    margin-top: -1px;
    background-size: 100%
}
.editIcon1::before{
    background: url(../../assets/administrationIcon/edit.png) no-repeat ;
    background-size: 100%
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
.role-list .el-checkbox__input.is-checked .el-checkbox__inner,.role-list .el-checkbox__input.is-indeterminate .el-checkbox__inner{
    background: #F08B00;
    border-color: #F08B00;
}
/* .bg .Post-manage-box .el-table--border, .bg .Post-manage-box .el-table--group, .bg .Post-manage-box .el-table td, .bg .Post-manage-box .el-table th.is-leaf{
  border-color:#ccc;
  color:#333;
  } */
  .bg .Post-manage-box .el-table--border:after, .bg .Post-manage-box .el-table--group:after, .bg .Post-manage-box .el-table:before{
    background: #44d2ff;
  }
  .bg .Post-manage-box .el-table__fixed-right:before,.bg .Post-manage-box  .el-table__fixed:before{
    background: #44d2ff;
  }
 
</style>
