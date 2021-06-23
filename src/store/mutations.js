import {
	INCREMENT,
	SHOW,
	XZKM,
	selectProj,
  SET_FORM_AUTHS

} from './types'
 // import getters from './getters'
import Vue from 'vue'
// import axios from 'axios'
// Vue.prototype.$http = axios;
export default {
	[INCREMENT](state) {
		state.count++;
	},
	[SHOW](state,list) {
		list.see= !list.see;
	},
	[XZKM](state,{list,data}) {
		list.popupVisible1 = true;
		if(data.length>0){
			state.kmList=data;
		}
	},
	setOrgUserDatas(state, data) {
 		state.orgUserDatas = data
 	},
	setOrgDatas(state, data) {
		state.orgDatas = data
	},
	setPositionList(state, data) {
		state.positionList = data
	},
	projectName(state, data) {
		state.projectName = data
		window.localStorage.setItem('projectName',data)
	},
	setRoleDatas(state, data) {
    state.roleDatas = data
  },
		projPurpose(state, data) {
		state.projPurpose = data
		window.localStorage.setItem('projPurpose',data)
	},
	  setFormConfig(state,data){
    if(data && data.formKey){}
      state.formConfig[data.formKey] = data
  },
    setFormSelectData(state,{formKey,data}){
    state.formSelectData[formKey] = data
  },
  [SET_FORM_AUTHS](state, {formKey, auths}) {
    // console.log('------SET_FORM_AUTHS-------',formKey, auths)
    state.formAuths[formKey] = auths;
  },
  resetState (state) {
    console.log('------resetState-------', window.copyState)
	  if(window.copyState){
      for (var i in window.copyState) {
        state[i] = window.copyState[i] // 递归赋值
      }
    }

  }
};
 // export default {
 // 	mutations,
 // 	getters
 // }
