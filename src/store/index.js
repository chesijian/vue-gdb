import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

import actions from './actions'
import mutations from './mutations'
import getters from './getters'

const state = {
	session:null,
	routers:[],
	defaultLogo:require('@/assets/sflogo.jpg'),
	temp:null,
	departName: '',
	departId:'',
	departUid:'',
	userName: '', //当前用户姓名
	companyUid:'',
	companyName:'',
	companyId:'',
	userUid: '',     //用户36位id
	userLogo: '',  //用户头像
	avatar:'',
	// themeBG:"rgba(68,210,255,0.2)",
  formAuths: {}, // 表单权限
	themeBG:"#fff",
	themeColor:"#F08B00",
	loading:false,
	totalUsers:[], //公司员工集合
	orgDatas:[], //部门数集合
	editDepart:Object,
	orgSelected:Object,//选中的部门
	orgUserDatas:[],
	positionList:[], //岗位集合
	  roleDatas:[], //角色集合
	selectProjectNode:{},
	memberSearchText:'',
	selectProjectObj:{},
	projectName:window.localStorage.getItem('projectName'),//项目类型
	projPurpose:window.localStorage.getItem('projPurpose'),//业态
	formSelectData:{}, // 表单弹框选择之后存储的数据，key为formKey,data为选中行
	  formConfig:{}
};

var copyState = deepClone(state) // 拷贝state对象
function deepClone (obj) {
  var newObj = obj instanceof Array ? [] : {}
  for (var i in obj) {
    newObj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i]
  }
  return newObj
}
window.copyState = copyState

export default new Vuex.Store({
	state,
	mutations,
	actions,
	getters
});
