import axios from 'axios';
import { Loading,Message } from 'element-ui';
import router from '../router'
import store from '../store'
import {sessionUtil} from './sessionUtil'

axios.interceptors.response.use(success=>{//响应拦截器
    if(success.status&&success.status==200&success.data.status==200){
        if(success.data.errorMsg){
            Message.success({message:success.data.errorMsg});
        }
    }else{
        if(success.data.errorMsg){
            Message.error({message:success.data.errorMsg});
        }
        // return;
    }
    
    return success.data;
},error=>{
    if(error.response.status==504||error.response.status==404){
        Message.error({message:"服务器被吃了"});
        return;
    }else if(error.response.status==403){
        Message.error({message:"权限不足，请联系管理员！"});
        return;
    }else if(error.response.status==401){
        Message.error({message:"尚未登录，请登录"});
        router.replace('/');
        return;
    }else{
        if (error.response.data.errorMsg) {
            Message.error({message: error.response.data.errorMsg})
        } else {
            Message.error({message: '未知错误!'})
        }
    }
});
let baseUrl='';
export const Api=function(){
    this.restPostKeyValue=(url,params,callBack)=>{
        let access_token = sessionUtil.getAccessToken();
        console.log("restPostKeyValue========>",access_token);
        axios({
            method:'post',
            url:`${baseUrl}${url}`,
            data:params,
            transformRequest:[function(data){
                let ret=''
                for(let i in data){
                    ret+=encodeURIComponent(i)+'='+encodeURIComponent(data[i])+"&"
                }
                return ret;
            }],
            headers:{
                'Authorization': access_token,
                'Content-Type':'application/x-www-form-urlencoded'
            }
        }).then(res=>{
            if (callBack) {
                callBack(res)
              }
        });;
    }
    
    this.restGet=(url,params,callBack)=>{
        // this.request('get',url,params,callBack);
        let access_token = sessionUtil.getAccessToken();
        console.log("access_token======888==>",access_token);
        axios({
            method:"get",
            url:`${baseUrl}${url}`,
            params,
            headers: {
                'Authorization': access_token,
            },
        }).then(res=>{
            if(res.status==403004){
                sessionUtil.removeSession();
                store.commit('initLogininfo',null)
                router.push({path: '/login', query: {redirect: this.vue.$route.path}});
            }
            if (callBack) {
                callBack(res)
            }
        });
    }

    this.restPost=(url,params,callBack)=>{
        this.request('post',url,params,callBack);
    }

    this.restPut=(url,params,callBack)=>{
        this.request('put',url,params,callBack);
    }
    this.restDelete=(url,params)=>{
        return axios({
            method:'delete',
            url:`${baseUrl}${url}`,
            data:params
        });
    }
    /**
     * @description restful风格请求封装
     */
    this.request = function (method, url, params, callBack, async) {
        
        let access_token = sessionUtil.getAccessToken();
        axios({
            method,
            url:`${baseUrl}${url}`,
            data:params,
            headers: {
                'Authorization': access_token,
            },
        }).then(res=>{
            console.log("res======>",res);
            if (res.status == 403004) {
                // 表示token不存在
                // Message.error('您的令牌无效，请您重新登录！')
                sessionUtil.removeSession();
                store.commit('initLogininfo',null)
                router.push({ path: '/login' })
            }else{
                if (callBack) {
                    callBack(res)
                }
            }
            
        });
    }

    this.getBaseUrl = function() {
        // 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
        var curWwwPath = window.document.location.href;
        //console.info("curWwwPath--" + curWwwPath);
        // 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
        var pathName = window.document.location.pathname;
        //console.info("pathName--" + pathName);
        var pos = curWwwPath.indexOf(pathName);
        // 获取主机地址，如： http://localhost:8083
        var localhostPaht = curWwwPath.substring(0, pos);
        //console.info("localhostPaht--" + localhostPaht);
        // 获取带"/"的项目名，如：/uimcardprj
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
      if (process.env.NODE_ENV === 'production') {
        // console.log('production');
        return localhostPaht + projectName
      }
      return "http://ecip-esms.sf-express.com/gdb";//顺丰
        // return 'http://localhost:88/jrsoft-core';
        return 'http://localhost:8085/shunfen'; //斯剑
        return "https://gdb.zhuzhu.biz";
        // return 'http://ecip-esms.sit.sf-express.com:45499/gdb';
        
    }

    this.mask = function(msg) {
        let loadingInstance = Loading.service({
            lock: true,
            // target:document.querySelector('#appContent'),
            text: msg == null || msg == '' ? '正在加载...' : msg,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
        });
        return loadingInstance;
    };

    this.unmask = function() {
        this.mask().close()
    }
    
}

export const util = new Api();