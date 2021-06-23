<template>
    <div class="authorization" style="display: flex;">
        <div class="aside document-wrap" style="width: 20%;border: 1px solid #44d2ff;height: 600px;overflow: auto;">
            <div class="aside-title" style="padding-top: 10px;">
                <h4>检查分组</h4>
            </div>
            <div class="aside-wrap">
				<el-tree style="background-color:transparent;color:#fff" highlight-current default-expand-all :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
            </div>
        </div>
        <div class="content" style="width: 79%;border: 1px solid #44d2ff;height: 603px;overflow: auto;margin-left: 10px;">
            <div class="uintCom-top">
				<h4 class="nav-bar">
					<span :class="{act: navIndex == 0}" @click="navIndex=0">角色权限</span>
					<span :class="{act: navIndex == 1}" @click="navIndex=1">人员权限</span>
				</h4>
				<div class="operation-wrap">
					<el-button size="small" :class="{act: navIndex ==  0}" @click="addRoles">添加角色</el-button>
					<el-button size="small" :class="{act: navIndex ==  1}" @click="addPeople">添加人员</el-button>
					<!-- <el-button size="small" @click="deleteItem">删除</el-button> -->
				</div>
            </div>
			<div class="unit_com_table" ref="table_box">
				<div v-show="navIndex==0">
					<el-tag v-for="item in roleList" :key="item" closable @close="handleClose(item)"  style="margin-right:10px">
						{{item}}
					</el-tag>
				</div>
				<!-- <div v-show="navIndex==1" style="display: flex;">
					
					<div v-for="(item,index) in tableData" :key="index" style="padding-right:20px;position: relative;">
						<i @click="deleteUser(item)" style="color: red;position: absolute;right: 8px;" class="el-icon-circle-close"></i>
						<el-avatar :size="45">
							<img :src="item.picture? item.picture:defaultLogo"/>
						</el-avatar>
						<p style="color:#fff;text-align: center;">{{item.userName}}</p>
					</div>
				</div> -->
				<el-table v-show="navIndex==1" :data="tableData" border height="100%" id="el-table"
				:cell-style="{textAlign:'center'}" highlight-current-row>
					<!-- <el-table-column type="selection" label="选择"></el-table-column> -->
					<el-table-column label="头像">
						<template slot-scope="scope">
							<img style="width: 40px;height: 40px;border-radius: 50%;" :src="scope.row.picture? scope.row.picture:defaultLogo"/>
						</template>
					</el-table-column>
					<el-table-column label="姓名">
						<template slot-scope="scope">
							<span>{{ scope.row.userName }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作">
						<template slot-scope="scope">
							<el-button size="mini" type="danger" @click="deleteUser(scope.row)">删除</el-button>
						</template>
					</el-table-column>
					<!-- <el-table-column  label="角色类型" width="260" >
						<template  slot-scope="scope">
						<div>
							<el-select v-model="scope.row.roleType" @change="updateUserRole(scope.row)" placeholder="请选择">
							<el-option label="员工" value="employee"></el-option>
							<el-option label="中层领导" value="middleLeader"></el-option>
							<el-option label="高层领导" value="highLeader"></el-option>
							<el-option label="一级管理员" value="firstLeader"></el-option>
							</el-select>
						</div>
						</template>
					</el-table-column> -->
				</el-table>
			</div>
			<!-- <div class="pagination-wrap">
				<pagination-com :totalCount="totalCount" @getCurPage="getCurPage"></pagination-com>
			</div> -->
        </div>
		<el-dialog title="选择角色" :visible.sync="dialogVisible" width="30%">
			<el-checkbox-group v-model="checkedCities" >
				<div v-for="(city,index) in projRoleLst" :key="index" style="padding-bottom: 10px;">
					<el-checkbox  :label="city.name" >{{city.name}}</el-checkbox>
				</div>
			</el-checkbox-group>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveRoleData(checkedCities)">确 定</el-button>
			</span>
		</el-dialog>

		<selectMember ref="selectMemberSel" :selectProjMemberModels="selectMemberModels"></selectMember>
    </div>
</template>

<script>
	import {mapState, mapGetters, mapActions} from 'vuex'
	import selectMember from '../../common/selectProjMember.vue'

  	export default {
		data(){
			return {
				dialogVisible:false,
				defaultLogo:require('@/assets/sflogo.jpg'),
				checkedCities:[],
				projRoleLst:[],
				roleList: [],
				data: [{
					label: '质量',
					children: [
						{label: '检查负责人',type:"inspect",userType:"checkPrincipal"},
						{label: '整改负责人',type:"inspect",userType:"principal"},
						{label: '整改参与人',type:"inspect",userType:"player"},
					]
				}, {
				label: '安全',
				children: [
					// {label: '检查负责人',type:"inspect",userType:"safetyCheckPrincipal"},
					{label: '整改负责人',type:"inspect",userType:"safetyPrincipal"},
					{label: '整改参与人',type:"inspect",userType:"safetyPlayer"},
					]
				}, {
				label: '工序',
				children: [
					{label: '施工负责人',type:"process",userType:"principal"}, 
					{label: '检查负责人',type:"process",userType:"player"},
					{label: '抽查人员',type:"process",userType:"rummager"}
					]
				}, {
				label: '实测',
				children: [
					{label: '负责人',type:"measured",userType:"principal"}, 
					{label: '整改人',type:"measured",userType:"player"},
					{label: '测量人',type:"measured",userType:"measurer"},
					{label: '复查人',type:"measured",userType:"rummager"}
					]
				}],
				defaultProps: {
				children: 'children',
				label: 'label'
				},
				navIndex: 0,
				btnTxt: '',
				selectProjectNode: {
					id: ''
				},
				models:[],
				selectMemberModels:{
					isShow:false,
					selectList:[],
					callBack:this.selectUserCallBack,
					radioSelectFlags:false,
				},
				selectedRoles: [],
				tableData: [],
				selectedNode: {},
				multipleSelection: '',
				totalCount: 0,
				pageIndex: 1,
				currentProj:{},
				tempId:""
			}
		},
		components:{
			selectMember,
		},
		created(){
			this.bgColor = this.$store.state.themeColor
			this.getRoleList()
		},
		mounted() {
			var projObj =JSON.parse(this.cookieUtil.get('projectNode'));
			this.currentProj = projObj;
		},
		methods:{
			handleNodeClick(data){
				this.selectedNode = data;
				if(data.userType==undefined){
					return;
				}
				this.getTableData()
			},
			deleteUser(item){
				this.tableData.splice(this.tableData.indexOf(item), 1);
				this.selectUserCallBack(1);
			},
			getRoleList(){
				this.util.restGet('/api_v1/dic/SYS_PROJECT_ROLE/items',null, (res)=> {
					this.projRoleLst=res.data
				});
			},
			handleClose(tag) {//移除角色
				this.roleList.splice(this.roleList.indexOf(tag), 1);
				this.saveRoleData(this.roleList);
			},
			addRoles() {
				if(!this.selectedNode.userType) {
					this.util.warn('请先选择权限分组！')
					return;
				}
				this.dialogVisible=true;
				this.navIndex = 0;
			},
			handleSelectionChange(val) {
				let str = [];
				val.forEach(function(value, i) {
					str.push(value.id)
				})
				this.multipleSelection = str.join(',');
			},
			getTableData() {
				var params = {
					projUid :this.currentProj.id,
					type:this.selectedNode.type,
					userType:this.selectedNode.userType
				}
				
				this.util.mask("正在加载..");
				this.util.restGet('/api_v1/construction/inspect/permissionUser',params,(res)=>{
					this.util.unmask();
					this.tempId="";
					if(res.status==200&&res.data){
						this.tableData = res.data.data;
						this.roleList=res.data.roleArr==undefined? []:res.data.roleArr.split(",");
						this.tempId = res.data.id;
						if(res.totalcount) {
							this.totalCount = res.totalcount
						}
						
						
					}else{
						this.tableData=[];
						this.roleList=[];
					}
				})
			},
			selectUserCallBack(type) {
				var dataList = type==1? this.tableData:this.selectMemberModels.selectList;
				var userNameArr = dataList.map(item=> item.userName);
				var userUidArr = dataList.map(item=> item.id);
				
				this.mainData={
					USER_UID_ARR_:userUidArr.join(","),
					USER_NAME_ARR_:userNameArr.join(","),
					PROJ_UID_:this.currentProj.id,
					USER_TYPE_:this.selectedNode.userType,
					GROUP_NAME_:this.selectedNode.groupName,
					TYPE_ :this.selectedNode.type
				}
				this.saveData();

			},
			saveRoleData(roleList){//保存角色
				this.mainData = {
					PROJ_UID_:this.currentProj.id,
					USER_TYPE_:this.selectedNode.userType,
					ROLE_ARR_:roleList.join(","),
					TYPE_ :this.selectedNode.type
				}
				this.saveData();
			},
			saveData(){//保存数据
				var params = {mainFormData:JSON.stringify(this.mainData),sqlTableName:"T_INSPECT_USER",ifSaveWorkflow:false};
				if(this.tempId!=""){
					params['id']=this.tempId;
					params['businessKey']=this.tempId;
				}
				this.util.mask("正在保存..");
				this.util.restPost("/api_v1/form/business",params,(res)=>{
					this.util.unmask();
					if(res.status==200){
						this.dialogVisible=false;
						this.getTableData();
					}
			
				});
						
			},
			addPeople(){
				this.navIndex = 1;
				if(!this.selectedNode.userType) {
					this.util.warn('请先选择权限分组！')
					return false;
				}
				var userList=this.tableData? [...this.tableData]:[];
				this.selectMemberModels.selectList = userList;
				this.$refs.selectMemberSel.initData();
				this.selectMemberModels.isShow=true
			},
		}
  	}
</script>

<style scoped>
	.authorization {
		overflow: hidden;
	}
	.uintCom-top {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20px;
	}
	.operation-wrap .el-button{
		border-radius: 0;
	}
	.operation-wrap .el-button.act {
		background-color: rgba(59,140,255,1);
		color: #fff;
	}
	.nav-bar {
		margin: 0;
	}
	h4>span {
		font-size: 18px;
		line-height: 18px;
		padding: 6px;
		font-family: SourceHanSansCN;
		border-bottom: 1px solid #fff;
		margin-left: 10px;
		cursor: pointer;
	}
	h4>span::before {
		content: '';
		width: 1px;
		height: 28px;
		background: #C4C4C4;
		position: absolute;
		left: -15px;
		top: 3px;
		display: none;
	}
	h4>span:nth-of-type(2) {
		margin-left: 25px;
	}
	h4>span.act {
		color: rgba(59,140,255,1);
		border-bottom-color: rgba(59,140,255,1);
	}
	.content >>> .el-checkbox {
		margin-bottom: 5px;
	}
	.content{
		box-sizing: border-box;
		/* background: #fff; */
		box-shadow: 0 2px 5px 0 rgba(0,0,0,0.10);
		height: 100%;
		padding: 20px 20px 120px;
		position: relative;
		overflow: hidden;
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

