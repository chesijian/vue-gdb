/**
 *
 * chesijian create @ 2019/06/1
 *
 */
import { util } from '@/utils/utils.js'
let PROJ_UID = "";//项目id
let TEAM_IDS = ""; //班组id集合
let TEAM_UID = ""; //班组id
let WORKER_IDS = ""; //工人id集合
let platformName_ = ""; //平台名称
let apiKey_ //API_KEY_: 
let url_  //系统地址:
let port_  //端口: 
let ifPass= false; //是否通过


export const  executePlatformPort=(projUid,teamIds,teamUid,workerIds,platformName,apiKey,url,port)=> {
    platformName_ = platformName;
    apiKey_ = apiKey;
    url_ = url;
    port_ = port;
    PROJ_UID = projUid;
    console.debug("platformName===="+platformName_);
    console.debug("apiKey===="+apiKey_);
    console.debug("url===="+url_);
    console.debug("port===="+port_);
    console.debug("PROJ_UID===="+PROJ_UID);
    // return;
    
    // return;
    TEAM_IDS = teamIds;
    TEAM_UID = teamUid;
    WORKER_IDS = workerIds;
    var _this = this;
    var p = new Promise(function(resolve, reject){
        //做一些异步操作
        util.mask("正在推送..");
        uploadCorpInfo(); //上传企业信息
        uploadProject(); //上传项目信息
        if(ifPass){
            uploadParticipation(); //上传参建单位信息
            console.log("ifPass1=====" + ifPass);
            if(ifPass){
                UpdateParticipateInfo(); //修改参建单位信息
                UploadTeamInfo();//上传班组信息
                UpdateTeamInfo();//修改班组信息
            }
            if(ifPass){
                console.log("ifPass2=====" + ifPass);
                UploadRosterInfo();//上传项目工人信息
                UpdateRosterInfo();//修改项目工人信息
            }
            if(ifPass){
                console.log("ifPass3=====" + ifPass);
                UploadEntryExitInfo();//上传人员进退场
                UploadContract(); //上传劳动合同
                UploadAttendance();//上传考勤信息
                UploadPayroll();//上传项目工资单信息
                UploadPayrollDetail();//上传项目工资单详细信息
                UploadTrainInfo();//上传项目培训课程信息
                UploadTrainWorkerInfo();//上传项目培训课程人员信息
            }
            
            
        }
        
        setTimeout(function(){
            util.unmask();
            util.success('执行完成!');
            
        }, 5000);
    });
    return p;
    
    
}


/**
 * 上传企业信息
 * @returns {number}
 */
export const  uploadCorpInfo=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/uploadCorp', {projUid:PROJ_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            // obj = JSON.parse(res.errorMsg);
            // util.error(obj.detail_message);
            // ifPass=true;
            // obj = JSON.parse(res.errorMsg);
            // if(window.confirm(obj.detail_message + '-继续执行推送吗?')){
            //     ifPass=true;
            // }else{
            //     ifPass=false;
            // }
            obj = JSON.parse(res.errorMsg);
            confirm("<上传企业信息>" + obj.detail_message);
            ifPass=true;
        }
    },null,false);
}

/**
 * 上传项目信息
 * @param key
 * @param companyUid
 */
export const uploadProject=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/uploadProject', {projUid:PROJ_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            // obj = JSON.parse(res.errorMsg);
            // if(res.status == 500){
            //     if(window.confirm(obj.detail_message + '-继续执行推送吗?')){
            //         ifPass=true;
            //      }else{
            //         ifPass=false;
            //     }
            // }
            obj = JSON.parse(res.errorMsg);
            confirm("<上传项目信息>" + obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 上传参建单位信息
 * @param projUid
 * @returns {*} 
 */
export const uploadParticipation=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/uploadParticipation', {projUid:PROJ_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<上传参建单位>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 修改参建单位信息
 * @param key
 * @returns {*}
 */
export const UpdateParticipateInfo=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UpdateParticipateInfo', {projUid:PROJ_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<修改参建单位>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 上传班组信息
 * @returns {*}（json string）
 */
export const UploadTeamInfo=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UploadTeamInfo', {projUid:PROJ_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<上传班组信息>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 修改班组信息
 * @returns {*}token(string)
 */
export const UpdateTeamInfo=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UpdateTeamInfo', {projUid:PROJ_UID,teamIds:TEAM_IDS,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<修改班组信息>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 上传项目工人信息
 * @param enable
 * @returns {boolean}
 */
export const UploadRosterInfo=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UploadRosterInfo', {projUid:PROJ_UID,teamUid:TEAM_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<上传项目工人信息>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 修改项目工人信息
 */
export const UpdateRosterInfo=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UpdateRosterInfo', {projUid:PROJ_UID,workerIds:WORKER_IDS,projUid:PROJ_UID,teamUid:TEAM_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<修改项目工人信息>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 上传考勤信息
 * @param tel
 * @param content
 * @returns {boolean}
 */
export const UploadAttendance=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UploadAttendance', {projUid:PROJ_UID,teamUid:TEAM_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<上传考勤信息>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 上传人员进退场
 * @param projUid 项目id
 * @param teamUid 班组id
 * @param callbackFun 回调方法
 */
export const UploadEntryExitInfo=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UploadEntryExitInfo', {projUid:PROJ_UID,teamUid:TEAM_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<上传人员进退场>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 上传劳动合同
 * @param projUid 项目id
 * @param teamUid 班组id
 * @returns {boolean}
 */
export const UploadContract=(url,title)=> {
    var obj = {};
    util.restGet('/api_v1/ext/UploadContract', {projUid:PROJ_UID,teamUid:TEAM_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<上传劳动合同>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 上传项目工资单信息
 * @param projUid 项目id
 * @param teamUid 班组id
 * @returns {boolean}
 */
export const UploadPayroll=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UploadPayroll', {projUid:PROJ_UID,teamUid:TEAM_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<上传项目工资单信息>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}


/**
 * 上传项目工资单详细信息
 * @param projUid 项目id
 * @param teamUid 班组id
 * @returns {boolean}
 */
export const UploadPayrollDetail=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UploadPayrollDetail', {projUid:PROJ_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<上传项目工资单详细信息>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 上传项目培训课程信息
 * @param projUid 项目id
 * @param teamUid 班组id
 * @returns {boolean}
 */
export const UploadTrainInfo=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UploadTrainInfo', {projUid:PROJ_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<上传项目培训课程信息>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

/**
 * 上传项目培训课程人员信息
 * @param projUid 项目id
 * @param teamUid 班组id
 * @returns {boolean}
 */
export const UploadTrainWorkerInfo=()=> {
    var obj = {};
    util.restGet('/api_v1/ext/UploadTrainWorkerInfo', {projUid:PROJ_UID,platformName:platformName_,apiKey:apiKey_,url: url_, port: port_}, (res) => {
        if (res.status == 200) {
            ifPass=true;
        }else{
            obj = JSON.parse(res.errorMsg);
            confirm("<上传项目培训课程人员信息>"+obj.detail_message);
            ifPass=false;
        }
    },null,false);
}

var eventMap = new Map();



