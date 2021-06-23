import * as types from './types'
// import * as api from './api'
// import { util } from '@/utils/utils.js'
import {util} from '@/utils/api'
import {getFormAuthsSync} from "../api/form-render"
// import { axiosObj } from '@/axios/axios.js'
export default {
	increment: ({ commit }) => {
        commit(types.INCREMENT);
    },
    getTotalData: ({ commit, state }, param) => { //获取部门总人数
        // axiosObj.post('/org/getTotalData', param, (res)=> {
        // 	util.unmask();
        // 	if(res.status==200){
        // 		var datas=[];
        // 		datas.push(res.data);
        // 		commit('setOrgDatas', datas);
        // 	}
        // });
        param.totalCount = 12;
        state.orgSelected = param;
    },
    //获取部门树数据




    getOrgDatas({ commit, state }, param) {
        util.mask();
        util.restGet('/api_v1/org', param, (res) => {
            // console.log(res);
            util.unmask();
            if (res.status == 200&&res.data!=undefined) {
                if(param.operate=="root"){//首次进入选中根部门
                    state.orgSelected.departUid = res.data.id;
                    state.orgSelected.label = res.data.label;
                }
                var datas = [];
                res.data.checked=1;
                datas.push(res.data);
                commit('setOrgDatas', datas);
            }

        });
    },
    getAllUser: ({ commit, state }, param) => { //获取部门员工数据
        util.mask();
        //是否查询岗位
        param.ifQueryPosition = true;
        //v1.0 util.post('/org/getAllUser', param, (res) => {
            util.restGet('/api_v1/org/users', param, (res) => {
                util.unmask();
            if (res.status == 200) {
                if (res.totalCount != undefined) {
                    state.orgSelected.totalCount = res.totalCount;
                }
                commit('setOrgUserDatas', res.data);
            }

        });
    },
    getPositionList: ({ commit, state }, param) => { //获取岗位数据
        util.mask();
        //util.post('/org/getPositions', param, (res) => {
        if (param['start'] == undefined) {
            param['start'] = 0;
        }
        if (param['pageSize'] == undefined) {
            param['pageSize'] = 100;
        }
        //是否查询直接上级
        param['ifQueryParent'] = true;
        util.restGet('/api_v1/org/positions', param, (res) => {
            if (res.status == 200) {
                commit('setPositionList', res.data);
                // state.positionList=res.data;
            } else {
                util.failueToast("系统错误");
            }
            util.unmask();
        });
    },
  getFormAuths: ({ commit, state }, formKey) => {


    if(state.formAuths[formKey] === undefined) {
      // 调用后台
      let res = getFormAuthsSync(formKey)
    //   console.log(formKey+'-----调用后台-返回结果-------->',res)
      if(res !== null){
        let auths = res

        // console.log('------getFormAuths--------',  formKey, auths)
        commit(types.SET_FORM_AUTHS,  { formKey, auths})
      }
    }
    // console.log('-------state.formAuths[formKey]-------',state.formAuths[formKey])
    return state.formAuths[formKey]
  },
  clearAuth: ({ commit, state }) => {
    // 清楚权限
    console.log('clearAuth============清除权限')
    // commit(state.formAuths, null)
    console.log('clearAuth======1======清除权限')
    // commit(state, {})
    console.log('clearAuth======2======清除权限')
    state.formAuths = null
    state = {}
  }

}
