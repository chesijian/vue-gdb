import Vue from 'vue'
import $ from 'jquery';
import { Loading, Message, MessageBox } from 'element-ui';
// import { Message } from 'element-ui';
Date.prototype.formatWeek = function() {
    if (this.getDay() == 5) { var days = '五' };
    if (this.getDay() == 6) { var days = '六' };
    if (this.getDay() == 1) { var days = '一' };
    if (this.getDay() == 2) { var days = '二' };
    if (this.getDay() == 3) { var days = '三' };
    if (this.getDay() == 4) { var days = '四' };
    if (this.getDay() == 0) { var days = '日' };
    return days
}
Date.prototype.format = function(fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//获取url中参数
export const getArgFromHref = function(argName) {
    var shref = window.location.href.split("#")[0];
    var args = shref.split("?");
    var retval = "";
    //参数为空
    if (args[0] == shref) {
        return retval;
    }
    var str = args[1];
    args = str.split("&");
    for (var i = 0; i < args.length; i++) {
        str = args[i];
        var arg = str.split("=");
        if (arg.length <= 1) continue;
        if (arg[0] == argName) retval = arg[1];
    }
    return retval;
}


export const Cookies = function() {
    this.getSession = function() {
        return sessionUtil.getSession();
    };
    /**
     * 验证
     */
    this.validToken = function() {
        var session = sessionUtil.getSession();
        //console.info(typeof session);
        //console.info(session);
        if (session != null && session.access_token) {

            var createTimeStr = session['create_time'];
            var expire = session['expire'];
            var createTime = new Date(createTimeStr);

            var nowTime = new Date();
            var times = nowTime.getTime() - createTime.getTime();

            var expireTimes = (parseInt(expire) - 30 * 60) * 1000; //允许误差30分钟
            //console.info(times + "=====" + times >= expireTimes + "======" + expireTimes);
            if (times < expireTimes) {
                return true;
            }
            // util.login();
        }
        return false;
        // util.login();
    };
    this.clearSession = function() {
        sessionUtil.removeSession()
        return;

    };
    this.setCookie= function(name, value, expire) {
    var Days = 30
    var exp = new Date();
    exp.setTime(exp.getTime() + expire*1000)
    document.cookie = name + "="+ value + ";expires=" + exp.toGMTString()
  }
    this.set = function(name, value, expire) {
        //alert(name+"---"+value);
        //console.info(name + "=====set=====" + value + "==========" + expire);
        var data = { value: value, _expire: expire == undefined ? 7200 : expire, _createTime: new Date() };
        window.localStorage.setItem(name, JSON.stringify(data));
        return null;

    };

    this.get = function(name) {
        var data = window.localStorage.getItem(name);
        //console.info("Cookies======" + name + "=====get=====" + data);
        if (data == null) {
            return null;
        }
        try { data = JSON.parse(data); } catch (e) {
            //console.info("Cookies=====get=====cache=====" + e);
            return null;
        }
        //console.info(data);
        var expire = data._expire;
        if (expire != undefined) {
            //判断是否超时
            var createTime = new Date(data._createTime);
            var nowTime = new Date();
            var times = nowTime.getTime() - createTime.getTime();
            var expireTimes = expire * 1000;
            if (times < expireTimes) {
                //console.info("-------正常-------" + data.value);
                //说明没有超时
                return data.value;
            } else {
                //说明超时，则返回null
                //console.info("Cookies=====get=====cache=====" + e);
                this.clear(name);
                return null;
            }
        }
        return data;
    };

    this.clear = function(name) {
        localStorage.removeItem(name)
        return;
    };
    this.clearAll = function() {
        localStorage.clear();
    };
}
export const cookieUtil = new Cookies();


export const Util = function(res) {
    this.defaultCorpId = "wx464b5d94f5edf957";
    this.amapKey = "82c91102377a644ef3af68a674c6e8bb";
    this.vue = null;
    this.init = function(obj) {
        this.vue = obj;
        this.unmask();
    };
    /**
     * 判断按钮是否有权限
     */
    this.isAllowBtn = function(code) {
        var resourceId = this.vue.$route.path + ":" + code;
        //console.info("isAllowBtn============" + resourceId);
        return sessionUtil.isAllowBtn(resourceId);
    };
    // vue中json对象克隆
    this.jsonClone = function(source) {
            return JSON.parse(JSON.stringify(source))
        }
        /**
         * 判断按钮是否有权限
         */
    this.isAllowBtn = function(code) {
        var resourceId = this.vue.$route.path + ":" + code;
        //console.info("isAllowBtn============" + resourceId);
        return true;
        return sessionUtil.isAllowBtn(resourceId);
    };
    this.clone = function(source, dest) {
            if (source == undefined || source == null) {
                return dest;
            }
            if (dest == undefined || dest == null) {
                dest = new Object();
            }
            for (var p in source) {
                var name = p; //属性名称
                if (name == 'ID_' || name == 'children') {
                    continue;
                }
                var value = source[p]; //属性对应的值
                dest[name] = value;
            }
        },

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

    this.successToast = function(msg) {
        Message.success(msg);
    };
    this.failueToast = function(msg) {
        Message.error(msg);
    };

    this.getUrlParam = function(argName) {
        var reg = new RegExp("(^|\\?|&)" + argName + "=([^&]*)(\\s|&|$)", "i");
        if (reg.test(window.location.href))
            return unescape(RegExp.$2.replace(/\+/g, " "));
        return "";
    };
    this.success = function(msg) {
        //Message.success(msg);
        Message.success({
            message: msg,
            showClose: true,
            duration: '2000',
            customClass: 'alert-Message-customClass',
            type: "success"
        });
    };
    this.error = function(msg) {
        Message.error({
            message: msg == undefined ? '数据返回异常!' : msg,
            showClose: true,
            customClass: 'alert-Message-customClass',
            duration: '2000',
            type: "success"
        });
    };
    this.warn = function(msg) {
        Message({
            message: msg,
            showClose: true,
            customClass: 'alert-Message-customClass',
            duration: '2000',
            type: 'warning'
        });
    };
    this.info = function(msg) {
        Message(msg);
    };
    this.alert = function(msg) {
        Message.error(msg);
    };
    this.confirm = function(msg, title, callBack) {
        MessageBox.confirm(msg, title == undefined ? "提示" : title, {
            type: "warning"
        }).then(() => {
            callBack();
        }).catch(() => {

        });
    };
    this.getAccessSecurt = function() {

        var corp_id = this.getUrlParam("corp_id");

        var userUid = cookieUtil.get("access_securt" + "@" + corp_id);
        return userUid;
    };

    this.clearCookie = function() {

            // var userUid = cookieUtil.get("access_securt"+"@"+corp_id);
            cookieUtil.clear("access_securt" + "@" + window.corp_id);
            cookieUtil.clear("access_session" + "@" + window.corp_id);
            // cookieUtil.clearAll();
            // this.alert(cookieUtil.get("access_securt") + "---access_securt---" + cookieUtil.get("access_session"));
        },
        this.refreshSession = function() {
            var suite_id = this.getUrlParam("suite_id");
            var corp_id = this.getUrlParam("corp_id");
            var code = this.getUrlParam("code");
            var userUid = this.getAccessSecurt();
            return this.getSessionDataFromServer(suite_id, corp_id, code, userUid, true);
        };

    this.deleteData = function(msg,tableName,id,callBack){
        var _this = this;
        var params= {businessKey:id,tableName: tableName};
        this.confirm(msg==null? '确定要删除该数据吗?':msg,function(){
            _this.restDelete('/api_v1/form/data', params, function(res) {  //柯焱修复删除机械使用单界面删除需要变动接口
            // _this.post('/form/deleteData', params, function(res) {
            if (res != undefined && res != null) {
                if (res.status == 200) {
                _this.successToast("操作成功！");
                if (callBack != undefined && callBack != null) (callBack());
                } else {
                _this.alert("操作失败：" + res.errorMsg);
                }
            }
    
            _this.unmask();
            });
        });
    
    
        };    
    
    this.ajax = function(method, url, param, callBack, errorCallback, async) {
        if (param == null) {
            param = {};
        }

        let access_token = sessionUtil.getAccessToken();
        //console.info("======post======" + param['access_token']);
        var _this = this;
        $.ajax({
            url: this.getBaseUrl() + url,
            timeout: 60000,
          headers: {
            "Authorization": access_token
          },
            async: async,
            type: method,
            dataType: 'json',
            contentType: 'application/json',
            data: method != "GET" ? JSON.stringify(param) : param,
            success: function(result) {
                if (result != null) {
                    //表示有人该账号挤下线
                    if (result.status == 403002) {
                        _this.alert("用户在另外一个设备登录，请您重新登录！");
                        _this.vue.$router.push({ path: '/login' });
                        return;
                    }
                }else if (result.status == 403001 && result.errorMsg.startsWith( 'invalid access_token')) {
                  // 表示没有权限
                  _util.error('您的令牌失效，请您重新登录！')
                  _this.vue.$router.push({ path: '/login' })
                }
                else if (result.status == 403004) {
                  // 表示token不存在
                  _util.error('您的令牌无效，请您重新登录！')
                  _this.vue.$router.push({ path: '/login' })
                } else if (result.status == 500004 && result.errorMsg.indexOf('JWT') > -1) {
                  // 表示token不存在
                  _util.error('您的令牌过期，请您重新登录！')
                  _this.vue.$router.push({ path: '/login' })
                } else {
                  if (callBack != undefined && callBack != null) {
                    callBack(result)
                  }
                }

                if (callBack != undefined && callBack != null) { callBack(result) };
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (errorCallback != undefined && errorCallback != null) {
                    errorCallback(result)
                } else {
                    _this.unmask();
                };
            }
        });
    };
    this.post = function(url, param, callBack, errorCallback) {
        if (param == null) {
            param = {};
        }
        this.ajax("POST", url, param, callBack, errorCallback, true);
    };
    this.postSync = function(url, param, callBack, errorCallback) {
        if (param == null) {
            param = {};
        }
        this.ajax("POST", url, param, callBack, errorCallback, false);
    };
    this.get = function(url, param, callBack, errorCallback) {
        this.ajax("GET", url, param, callBack, errorCallback, true);
    };
    this.getByUrl = function(url, param, callBack) {
        var _this = this;

        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function(data) {
                callBack(data)
            },
            error: function(data) {
                callBack(data)
            }
        });
    };

    this.getSync = function(url, param, callBack, errorCallback) {

        this.ajax("GET", url, param, callBack, errorCallback, false);
    };
    /**
     * @description restful风格请求封装
     */
    this.request = function(method, url, param, callBack, errorCallback, async) {
        //console.log(method != "GET" ? JSON.stringify(param) : param);
        if (param == null) {
            param = {};
        }
        // console.info(param)
        //替换restful参数
        var newParam = null;
        //如果不是数组
        if (!Array.isArray(param)) {
            newParam = {};
            for (var key in param) {
                if (url.indexOf("{" + key + "}") > -1) {
                    url = url.replace("{" + key + "}", param[key]);
                } else {
                    newParam[key] = param[key];
                }
            }
            param = newParam;
            if (method == 'POST' || method == 'PUT') {
                //如果是post方法如果controller接受参数是一个list集合，则不需要设置参数
                if (newParam['_list'] != undefined && newParam['_list'] != null) {
                    param = newParam['_list'];
                }
            }
            if (method == 'DELETE') {
                //把参数更新到url后面
                for (var key in param) {
                    if (url.indexOf("?") > -1) {
                        url = url + "&" + key + "=" + param[key];
                    } else {
                        url = url + "?" + key + "=" + param[key];
                    }
                }
            }
        }
      var access_token = ''
      if (url != '/api_v1/token' && url != '/api_v1/verificationCode' && url != '/api_v1/registerOrg'&& url != '/share/appDownloadUrl') {
            access_token = sessionUtil.getAccessToken();
            if (access_token == null) {
                //表示token过期
                this.error("您的令牌已经失效，请您重新登录！");
                this.vue.$router.push({ path: '/login' });
                return
            }
          if (url.indexOf("?") > -1) {
            url = url + "&_n=" + new Date();
          } else {
            url = url + "?_n=" + new Date();
          }
            /*if (url.indexOf("?") > -1) {
                url = url + "&access_token=" + access_token;
            } else {
                url = url + "?access_token=" + access_token;
            }*/

            if (validUtil.isNotEmpty(sessionUtil.getCorpId())) {
                url = url + "&corp_id=" + sessionUtil.getCorpId();
            }
            if (validUtil.isNotEmpty(sessionUtil.getAgentId())) {
                url = url + "&agent_id=" + sessionUtil.getAgentId();
            }
        } else {
            if (url.indexOf("?") > -1) {
                url = url + "&_n=" + new Date();
            } else {
                url = url + "?_n=" + new Date();
            }
        }

        if (validUtil.isNotEmpty(sessionUtil.getAppId())) {
            url = url + "&app_id=" + sessionUtil.getAppId();
        }
        // console.log(sessionUtil.getAppId() + '----------url---------' + url)
        // console.log(param)
        var _this = this;
        var _util = util;
        //console.info("============================================");
        //console.log(method != "GET" ? JSON.stringify(param) : param);
        $.ajax({
            url: this.getBaseUrl() + url,
            timeout: 60000,
            async: async == undefined ? true : async,
            headers: {
                "Authorization": access_token
            },
            /*beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Chenxizhang")
            },*/
            type: method,
            dataType: 'json',
            contentType: 'application/json',
            data: method != "GET" ? JSON.stringify(param) : param,
            success: function(result) {
                if (validUtil.isNotEmpty(result)) {
                    if (result.status == 403002) {
                        //表示有人该账号挤下线
                        _util.error("用户在另外一个设备登录，请您重新登录！");
                        _this.vue.$router.push({ path: '/login' });
                        return;
                    }
                    else if (result.status == 403001 && result.errorMsg.startsWith( 'invalid access_token')) {
                      // 表示没有权限
                      _util.error('您的令牌失效，请您重新登录！')
                      _this.vue.$router.push({ path: '/login' })
                    }
                    else if (result.status == 403004) {
                      // 表示token不存在
                      _util.error('您的令牌无效，请您重新登录！')
                      _this.vue.$router.push({ path: '/login' })
                    } else if (result.status == 500004 && result.errorMsg.indexOf('JWT') > -1) {
                      // 表示token不存在
                      _util.error('您的令牌过期，请您重新登录！')
                      _this.vue.$router.push({ path: '/login' })
                    } else {
                      if (callBack != undefined && callBack != null) {
                        callBack(result)
                      }
                    }

                } else {
                    if (callBack != undefined && callBack != null) { callBack(result) };
                }


            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                if (errorCallback != undefined && errorCallback != null) {
                    errorCallback(result)
                } else {
                    _this.unmask();
                };
            }
        });
    };

    this.gotoLogin = function() {
        this.error("您的令牌无效，请您重新登录！");
        if (this.vue != null) {
            this.vue.$router.push({ path: '/login' });
        }

    };
    this.restPost = function(url, param, callBack, errorCallback, async) {
        this.request("POST", url, param, callBack, errorCallback, async);
    };
    this.restPut = function(url, param, callBack, errorCallback, async) {
        this.request("PUT", url, param, callBack, errorCallback, async);
    };
    /**
     * @description restful风格GET请求封装
     * @example
     * this.restGet('/api_v1/book',{id:1},function(res){
     * });
     */
    this.restGet = function(url, param, callBack, errorCallback, async) {
        this.request("GET", url, param, callBack, errorCallback, async);
    };
    this.restDelete = function(url, param, callBack, errorCallback, async) {
        this.request("DELETE", url, param, callBack, errorCallback, async);
    };
    this.loadDic = function(param, callBack) {
        this.post('/sys/dic/findDicItem', param, function(result) {
            if (result != null) {
                if (result['status'] == 200) {
                    callBack(result['data']);
                } else {
                    callBack(null);
                }
            } else {
                callBack(null);
            }
        });
    };
    /**
     * 加载数据字典
     */
    this.getDicItems = function(dicId, callback) {
        this.restGet('/api_v1/dic/' + dicId + '/items', null, (res) => {
            if (res.status == 200) {
                callback(res.data)
            } else {
                callback(null)
            }
        }, null)
    };
    this.initUrlParam = function(obj) {
        var isReadOnlyParam = this.getUrlParam("isReadOnly");
        obj.isReadOnly = (validUtil.isNotEmpty(isReadOnlyParam) && isReadOnlyParam == "true") ? true : false;
        obj.procDefId = this.getUrlParam("_procDefId");
        obj.procInstId = this.getUrlParam("_procInstId");
        obj.taskId = this.getUrlParam("_taskId");
        obj.currentActId = this.getUrlParam("_currentActId");
        obj.taskType = this.getUrlParam("_taskType");
        obj.status = this.getUrlParam("_taskStatus");
        obj.id = this.getUrlParam("id");

    };
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
    //   return "http://ecip-esms.sf-express.com/gdb";//顺丰
        return 'http://chesijian.uicp.vip/gdb';
        return 'http://localhost:8085/shunfen'; //斯剑
        return "https://gdb.zhuzhu.biz";
        // return 'http://ecip-esms.sit.sf-express.com:45499/gdb';
        
    }
    this.setTemp = function(_this, obj) {
        _this.$store.state.temp = obj;
    };
    this.getTemp = function(_this) {
        return _this.$store.state.temp;
    };
    this.onPreview= function(file) {
        // console.log("file=====",file);
        var url = null
        let id = file.id||file.fileId
        if (file.isNewFlag) {
            url = this.getBaseUrl() + '/api_v1/files/temp/' + id + '/look?&access_token=' + sessionUtil.getAccessToken() + '&id=' + id + '&suffix=' + file.suffix + '&fileName=' + encodeURIComponent(file.fileName)
        } else {
            url = this.getBaseUrl() + '/api_v1/files/' + id + '/look?&access_token=' + sessionUtil.getAccessToken() + '&id=' + id + '&suffix=' + file.suffix + '&fileName=' + encodeURIComponent(file.fileName)
        }
        window.open(url)
    }
    this.sendMessage = function(sendMsgUserIds, title, description, businessKey, type, url) {
        var params = {
            assignee: sendMsgUserIds,
            subject: title,
            content: description,
            params: { id: businessKey },
            type: type,
            url: url
        };
        this.restPut('/api_v1/business/messages/sendMessage/' + sendMsgUserIds, params, (res) => {
            if (res != undefined && res != null) {
                if (res.status == 200) {

                } else {
                    // this.failueToast("抄送人消息发送失败!" + res.errorMsg);
                }
            }
        });
    };
    this.saveMsg = function(mainData, suFormbData) { //向主页推送信息
        var subFormList = [{ subFormForeignKey: "PARENT_UID_", subFormTable: "T_MSG_USER", data: JSON.stringify(suFormbData) }];
        var params = { mainFormData: JSON.stringify(mainData), sqlTableName: "T_MSG", subFormData: JSON.stringify(subFormList), ifSaveWorkflow: false };

        this.restPost("/api_v1/form/business", params, (res) => {
            if (res.status == 200) {}

        });
    };
    /**
     * 微信接口授权
     */
    this.initWxJsSdkConfig = function(vue, wxurl, jsApiList) {
        //wx/getWxPageConfig
        var _this = this;
        this.post("/wx/getWxJsSdkConfig", { url: wxurl }, function(result) {
            vue.wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: _this.isNotEmpty(window.corp_id) ? window.corp_id : _this.defaultCorpId, // 必填，企业号的唯一标识，此处填写企业号corpid
                timestamp: result.data.timestamp, // 必填，生成签名的时间戳
                nonceStr: result.data.nonceStr, // 必填，生成签名的随机串
                signature: result.data.signature, // 必填，签名，见附录1
                jsApiList: jsApiList // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        });
    };
    this.initWxJsSdk = function(vue) {
        var wxurl = window.location.href.split("#")[0];
        this.initWxJsSdkConfig(vue, wxurl, ['hideOPtionMenu', 'getLocation', 'chooseImage', 'uploadImage', 'previewImage', 'scanQRCode', 'startRecord', 'stopRecord', 'uploadVoice', 'previewFile']);
    };
    this.cardTypeList = [{
            label: '身份证',
            value: '1',
        },
        {
            label: '军官证',
            value: '2',
        },
        {
            label: '护照',
            value: '3',
        },
        {
            label: '台湾居民身份证',
            value: '4',
        },
        {
            label: '香港永久性居民身份证',
            value: '5',
        },
        {
            label: '警官证',
            value: '6',
        },
        {
            label: '其他',
            value: '9',
        },
    ];
    this.filterNone = (data) => { //过滤undefined、null、''
        if (typeof(data) === 'undefined' || data === null) {
            return '';
        } else {
            return data;
        }
    }
    this.companyDic = [];
    this.getAllDic = () => { //获取公司名下所有字典
            util.post('/sys/dic/findAllDic?companyUid=' + sessionUtil.getCompanyUid() + '&access_token=' + sessionUtil.getAccessToken(), null, (res) => {
                util.companyDic = res.data;
            })
        }
        // this.getDicByDicId=(key)=>{
        //   console.log(util.companyDic.length)
        //   for (var i in util.companyDic) {
        //     console.log(i)
        //     // if (util.companyDic[i].value==key){
        //     //   if (util.companyDic.children!=null) {
        //     //     return util.companyDic.children;
        //     //   }else {
        //     //     return [];
        //     //   }
        //     // }
        //   }
        // }
    this.numToCn = function(money) { // 数字转中文
            // 汉字的数字
            var cnNums = new Array(
                    '零',
                    '壹',
                    '贰',
                    '叁',
                    '肆',
                    '伍',
                    '陆',
                    '柒',
                    '捌',
                    '玖'
                )
                // 基本单位
            var cnIntRadice = new Array('', '拾', '佰', '仟')
                // 对应整数部分扩展单位
            var cnIntUnits = new Array('', '万', '亿', '兆')
                // 对应小数部分单位
            var cnDecUnits = new Array('角', '分', '毫', '厘')
                // 整数金额时后面跟的字符
            var cnInteger = '整'
                // 整型完以后的单位
            var cnIntLast = '元'
                // 最大处理的数字
            var maxNum = 999999999999999.9999
                // 金额整数部分
            var integerNum
                // 金额小数部分
            var decimalNum
                // 输出的中文金额字符串
            var chineseStr = ''
                // 分离金额后用的数组，预定义
            var parts
            if (money == '') {
                return ''
            }
            money = parseFloat(money)
            if (money >= maxNum) {
                // 超出最大处理数字
                return ''
            }
            if (money == 0) {
                chineseStr = cnNums[0] + cnIntLast + cnInteger
                return chineseStr
            }
            // 转换为字符串
            money = money.toString()
            if (money.indexOf('.') == -1) {
                integerNum = money
                decimalNum = ''
            } else {
                parts = money.split('.')
                integerNum = parts[0]
                decimalNum = parts[1].substr(0, 4)
            }
            // 获取整型部分转换
            if (parseInt(integerNum, 10) > 0) {
                var zeroCount = 0
                var IntLen = integerNum.length
                for (var i = 0; i < IntLen; i++) {
                    var n = integerNum.substr(i, 1)
                    var p = IntLen - i - 1
                    var q = p / 4
                    var m = p % 4
                    if (n == '0') {
                        zeroCount++
                    } else {
                        if (zeroCount > 0) {
                            chineseStr += cnNums[0]
                        }
                        // 归零
                        zeroCount = 0
                        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
                    }
                    if (m == 0 && zeroCount < 4) {
                        chineseStr += cnIntUnits[q]
                    }
                }
                chineseStr += cnIntLast
            }
            // 小数部分
            if (decimalNum != '') {
                var decLen = decimalNum.length
                for (var i = 0; i < decLen; i++) {
                    var n = decimalNum.substr(i, 1)
                    if (n != '0') {
                        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
                    }
                }
            }
            if (chineseStr == '') {
                chineseStr += cnNums[0] + cnIntLast + cnInteger
            } else if (decimalNum == '') {
                chineseStr += cnInteger
            }
            return chineseStr
        }
        /**
         * 获取今天是今年的第几周
         * @returns {number}
         */
    this.getYearWeek = function() {
        /*
        date1是当前日期
        date2是当年第一天
        d是当前日期是今年第多少天
        用d + 当前年的第一天的周差距的和在除以7就是本年第几周
        */
        var date1 = new Date(),
            date2 = new Date(date1.getFullYear(), 0, 1),
            d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
        return Math.ceil((d + ((date2.getDay() + 1) - 1)) / 7);
    }
    this.getNextMonday = function() { // 获取下周一
        var Stamp;
        Stamp = new Date();
        var num = 7 - Stamp.getDay() + 1;
        Stamp.setDate(Stamp.getDate() + num);

        var year = Stamp.getFullYear(); //获取完整的年份(4位,1970-????)
        var month = Stamp.getMonth() + 1; //获取当前月份(0-11,0代表1月)
        var mvar = '';
        if (month < 10) {
            mvar = '0' + month;
        } else {
            mvar = month + '';
        }
        var day = Stamp.getDate();
        var dvar = '';
        if (day < 10) {
            dvar = '0' + day;
        } else {
            dvar = day + '';
        }
        return year + "-" + this.getFormatDate(mvar) + '-' + this.getFormatDate(dvar)
    }
    this.addDays = function(date, days) {
        if (days == undefined || days == '') {
            days = 1;
        }
        if (date === undefined || date === '') {
            return ''
        }
        var date = new Date(date);
        date.setDate(date.getDate() + days);
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return date.getFullYear() + '-' + this.getFormatDate(month) + '-' + this.getFormatDate(day);
    }
    this.getFormatDate = function(arg) { // 日期月份/天的显示，如果是1位数，则在前面加上'0'
            if (arg == undefined || arg == '') {
                return '';
            }

            var re = arg + '';
            if (re.length < 2) {
                re = '0' + re;
            }

            return re;
        }
        /**
         * 实现获取当前时间是本月第几周和年的第几周的方法
         * @param a
         * @param b
         * @param c
         * @returns {{getMonth: number, getYear: number, getWeek: number}}
         */
    this.getMonthWeek = function(a, b, c) {
            /**
             * a = d = 当前日期
             * b = 6 - w = 当前周的还有几天过完(不算今天)
             * a + b 的和在除以7 就是当天是当前月份的第几周
             */
            var date = new Date(a, parseInt(b) - 1, c),
                w = date.getDay(),
                d = date.getDate();
            if (w == 0) {
                w = 7;
            }
            var config = {
                getMonth: date.getMonth() + 1,
                getYear: date.getFullYear(),
                getWeek: Math.ceil((d + 6 - w) / 7),
            }
            return config;
        }
        /**
         * 获取本月第一天
         * @returns {Date}
         */
    this.getCurrentMonthFirst = function() {
            return this.getMonthFirst(new Date())
        }
        /**
         * 获取本月最后一天
         * @returns {Date}
         */
    this.getCurrentMonthLast = function() {
            return this.getMonthLast(new Date())
        }
        /**
         * 获取下月第一天
         * @returns {Date}
         */
    this.getNextMonthFirst = function() {
            var time = new Date()
            var year = time.getFullYear()
                // var year = 1900; //用于测试
            var month = time.getMonth() + 1;
            // var month = 0 + 2; //用于测试
            if (month > 12) {
                month = month - 12
                year = year + 1
            }
            let nextFirstDate = new Date(year, month, 1)
            return nextFirstDate.format('yyyy-MM-dd')
        }
        /**
         * 获取本月最后一天
         * @returns {Date}
         */
    this.getNextMonthLast = function() {
            return this.getMonthLast(new Date(this.getNextMonthFirst()))
        }
        /**
         * 获取月第一天
         * @returns {Date}
         */
    this.getMonthFirst = function(date) {
            date.setDate(1)
            return date.format('yyyy-MM-dd')
        }
        /**
         * 获取月最后一天
         * @returns {Date}
         */
    this.getMonthLast = function(date) {
        var currentMonth = date.getMonth()
        var nextMonth = ++currentMonth
        var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1)
        var oneDay = 1000 * 60 * 60 * 24
        return new Date(nextMonthFirstDay - oneDay).format('yyyy-MM-dd')
    }
}
export const util = new Util();

export const SessionUtil = function() {
    this.refreshTokenCount = 0;
    this.authCacheKey = "cache-auths";
    this.menuCacheKey = "cache-menus";
    this.menuCodeCacheKey = 'cache-menus-code'
    this.btnCacheKey = "cache-btns";
    this.roleCacheKey = "cache-roles";
    this.sessionCacheKey = "cache-session";
    this.oldAuthCacheKey = "cache-old-auths";
    this.initSession = function(res) {
        var roleList = res.data.roleList;
        var auths = res.auths;
        delete res.data.roleList;
        cookieUtil.set(this.roleCacheKey, roleList, 7200);
        window.cache_roles = roleList;
        // if (roleList != undefined && roleList != null) {
        //     delete res.data.roleList;
        //     cookieUtil.set(this.roleCacheKey, roleList, 7200);
        //     window.cache_roles = roleList;
        // }
        if (auths != undefined && auths != null) {
            delete res.auths;
            this.initAuths(auths);
        } else {
            this.initAuths([]);
        }
        res.data['access_token'] = res['access_token'];
        res.data['create_time'] = res['create_time'];
        res.data['expire'] = res['expire'];
        res.data['over_time'] = res['over_time'];
        cookieUtil.set(this.sessionCacheKey, res.data, res.data['expire']);
        // cookieUtil.set(this.sessionCacheKey, res.data['access_token'], res.data['expire']);
      cookieUtil.setCookie(this.sessionCacheKey, res.data, res.data['expire'])
        window.cache_session = res.data;
    };
    this.getSession = function() {
        // var data = window.cache_session != undefined ? window.cache_session : null;
        // if (data == undefined || data == null) {
        //     return cookieUtil.get(this.sessionCacheKey);
        // }
        // return data;
        let data={
            company:{
                departName:"广州建软",
                departId:"001"
            },
            user:{
                id:"0000111",
                userUid:"0000999",
                userName:"车斯剑"
            }
        }
        return data;
    };
    this.removeSession = function() {
        cookieUtil.clear(this.sessionCacheKey);

        window.cache_session = null;
        window.cache_menus = null;
        window.cache_menus_code = null;
        window.cache_btns = null;
        window.cache_auths = null;
    };
    /**
     * 登陆后设置权限信息
     */
    this.initAuths = function(data) {
        cookieUtil.set(this.authCacheKey, data, 7200);
        window.cache_auths = data;
        this.initMenus(data);
    };
    this.getAuths = function(data) {
        var data = window.cache_auths != undefined ? window.cache_auths : null;
        if (data == undefined || data == null) {
            return cookieUtil.get(this.authCacheKey);
        }
        return data;
    };
    /**
     * 递归菜单
     */
    this.deepMenu = function(menuMap, menuCodeMap, resourceMap, parent, data) {

        var _this = this;
        data.forEach(function(item, index) {
            // if (item.resourceType == 3) {
            if (item.formKey) {
                //说明是菜单
                if (validUtil.isNotNull(item.path)) {
                    menuMap[item.path] = item

                } else {
                    // 判断是否配置表单
                }
                menuCodeMap[item.code] = item
                // if (item.children !== undefined) {
                //     _this.deepMenu(menuMap, menuCodeMap, resourceMap, item, item.children);
                // }
            } else if (item.resourceType == 4) {
                if (validUtil.isNotEmpty(parent.path)) {
                    //说明是按钮
                    resourceMap[parent.code + ':' + item.code] = item;
                }
            }
            if (item.children != undefined) {
                _this.deepMenu(menuMap, menuCodeMap, resourceMap, item, item.children);
            }

        });
    };
    /**
     * 初始化菜单和按钮到缓存
     */
    this.initMenus = function(data) {
        if (data !== undefined) {
            var menuCodeMap = {}
            var menuMap = {};
            var resourceMap = {};
            this.deepMenu(menuMap, menuCodeMap, resourceMap, null, data);
            cookieUtil.set(this.menuCacheKey, menuMap, 7200);
            cookieUtil.set(this.btnCacheKey, resourceMap, 7200);
            cookieUtil.set(this.menuCodeCacheKey, menuCodeMap, 7200);
            window.cache_menus = menuMap;
            window.cache_menus_code = menuCodeMap;
            window.cache_btns = resourceMap;
        } else {
            cookieUtil.remove(this.menuCacheKey);
            cookieUtil.remove(this.menuCodeCacheKey);
            cookieUtil.remove(this.btnCacheKey);
            window.cache_menus = null;
            window.cache_menus_code = null
            window.cache_btns = null;
        }
    };
    /**
     * 获取缓存的菜单
     */
    this.getMenus = function() {
        var data = window.cache_menus != undefined ? window.cache_menus : null;
        if (data == undefined || data == null) {
            return cookieUtil.get(this.menuCacheKey);
        }
        return data;
    };
    /**
     * 获取缓存的菜单编码
     */
    this.getMenuCodes = function() {
        var data = window.cache_menus_code != undefined ? window.cache_menus_code : null;
        if (data == undefined || data == null) {
            return cookieUtil.get(this.menuCodeCacheKey);
        }
        return data;
    }
    this.getRoles = function() {
        var data = window.cache_roles != undefined ? window.cache_roles : null;
        if (data == undefined || data == null) {
            return cookieUtil.get(this.roleCacheKey);
        }
        return data;
    };
    this.getBtns = function() {
        var data = window.cache_btns != undefined ? window.cache_btns : null;
        if (data == undefined || data == null) {
            return cookieUtil.get(this.btnCacheKey);
        }
        return data;
    };

    this.getAccessToken = function(vue) { //获取token
        if (window.location.href.indexOf("/login") != -1) {
            return null;
        }
        if (!cookieUtil.validToken() && !cookieUtil.get('register')) {
            util.vue.$router.push({ path: '/login' });
            return null;
        }
        var session = this.getSession();
        if (session != null) {
            return session.access_token;
        } else {
            //说明过期了
            util.gotoLogin();
        }
        return null;
    };
    this.getCorpId = function() {
        var session = this.getSession();
        if (session != null) {
            return session.corpId;
        }
        return null;
    }
    this.getAgentId = function() {

        return window.agent_id;
    }
    this.getAppId = function() { // 获取系统所属应用id

        return window.app_id;
    }
    this.getCompanyUid = function(vue) { //当前登录人所属组织编码
        var session = this.getSession();
        if (session != null) {
            return session.company.id;
        }
        return null;
    };
    this.getCompanyId = function(vue) { //当前登录人所属组织编码
        var session = this.getSession();
        if (session != null) {
            return session.company.departId;
        }
        return null;
    };
    this.getCompanyName = function(vue) { //当前登录人所属组织编码
        var session = this.getSession();
        if (session != null) {
            return session.company.departName;
        }
        return null;
    };
    this.getUser = function(vue) { //当前登录人人
        var session = this.getSession();
        if (session != null) {
            return session.user;
        }
        return null;
    };
    this.getUserId = function(vue) { //当前登录人编码
        var session = this.getSession();
        if (session != null) {
            return session.user.userId;
        }
        return null;
    };
    this.getUserUid = function(vue) { //当前登录人主键
        var session = this.getSession();
        if (session != null) {
            return session.user.id;
        }
        return null;
    };
    this.getUserName = function(vue) { //当前登录人名称
        var session = this.getSession();
        // console.info(session);
        if (session != null) {
            return session.user.userName;
        }
        return null;
    };
    this.getDepartUid = function(vue) { //当前登录人部门主键
        var session = this.getSession();
        if (session != null) {
            return session.depart.id;
        }
    };
    this.getDepartId = function(vue) { //当前登录人部门编码
        var session = this.getSession();
        if (session != null) {
            return session.depart.departId;
        }
    };
    this.getDepartName = function(vue) { //当前登录人部门名称
        var session = this.getSession();
        if (session != null) {
            return session.depart.departName;
        }

    };
    this.isAllowMenu = function(resourceId) { //是否有菜单权限
        return true;
        if ('/page/index' == resourceId) {
            return true;
        }
        //判断是否公司管理员
        //console.info("======isAllowMenu=====" + this.isCompanyAdmin());
        if (this.isAdmin()) {
            return true;
        }
        if (this.isCompanyAdmin()) {
            return true;
        }
        let data = {}
            // 判断是否是路由
        if (resourceId.startsWith('/')) {
            //判断某个资源路由是否有权限
            data = this.getMenus()
                // console.log(resourceId+'=========isAllowMenu========', data)
            if (data && data[resourceId]) {
                return true
            }

        } else {
            // 菜单编码
            data = this.getMenuCodes()
        }
        if(resourceId=="0201"){
            console.log(resourceId+'=========isAllowMenu========', data)
        }
        // console.log(resourceId+'=========isAllowMenu========', data)
        if (data != undefined && data != null) {
            if (data[resourceId] != undefined && data[resourceId] != null) {
                return true;
            }
        }
        return false
    };
    this.isAllowBtn = function(formKey, resourceId) { //是否有按钮权限
        return this.isAllow(formKey, resourceId)
    };
    this.isAllowAdd = function(formKey) { //是否有新增按钮权限
        return this.isAllow(formKey, 'btnAdd')
    }
    this.isAllowEdit = function(formKey) { //是否有编辑按钮权限
        return this.isAllow(formKey, 'btnEdit')
    }
    this.isAllowDelete = function(formKey) { //是否有删除按钮权限
        return this.isAllow(formKey, 'btnDelete')
    }
    this.isAllowExport = function(formKey) { //是否有导出按钮权限
        return this.isAllow(formKey, 'btnExport')
    }
        /**
         * 兼容旧的做法
         * @param resourceId
         * @returns {boolean}
         */
    this.isAllow = (formKey, resourceId) => {
        return true;
        if (this.isAdmin()) {
            return true
        }
        if (this.isCompanyAdmin()) {
            return true
        }
        if (resourceId) {
            let vm = util.vue || Vue
            if (validUtil.isNotNull(formKey)) {
                try {
                    vm.$store.dispatch('getFormAuths', formKey)
                    let auths = vm.$store.state.formAuths[formKey]
                    // console.log('-----isAllow----auths--->>',auths )
                    if (auths && auths[resourceId]) {
                        return true
                    } else {
                        return false
                    }
                } catch (error) {
                    return false
                }

            }
        }
        // console.log('----------isAllow------end----')
        return false;
    };
    this.containRole = function(key) { //是否包含角色
        var data = this.getRoles();
        if (data != undefined && data != null) {
            for (var i = 0; i < data.length; i++) {
                var role = data[i].roleId;
                if (role == key) {
                    return true;
                }
            }
        }
        return false;
    };
    this.isAdmin = function() { //公司管理员
        if (this.containRole('ROLE_ADMIN')) {
            return true;
        }
        return false;
    };
    this.isCompanyAdmin = function() { //公司管理员
        if (this.containRole('ROLE_COMPANY_ADMIN')) {
            return true;
        }
        return false;
    };
    this.isPm = function() { //项目经理
        if (this.containRole('ROLE_COMPANY_PM')) {
            return true;
        }
        return false;;
    };
    this.isHr = function() { //HR
        if (this.containRole('ROLE_COMPANY_HR')) {
            return true;
        }
        return false;;
    };
    this.isCm = function() { //合同专员
        if (this.containRole('ROLE_COMPANY_CM')) {
            return true;
        }
        return false;;
    };
    this.isCashier = function() { //出纳
        if (this.containRole('ROLE_COMPANY_CASHIER')) {
            return true;
        }
        return false;;
    };
}
export const sessionUtil = new SessionUtil();
export const ValidUtil = function() {
    /*
     * 用途：检查输入手机号码是否正确 输入： s：字符串 返回： 如果通过验证返回true,否则返回false
     */
    this.isMobile = function(s) {
        //console.info(s);
        // var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
        var myreg = /^(0|86|17951)?(1[3-8][0-9])[0-9]{8}$/;
        if (s == "") {
            return false;
        } else if (s.length != 11) {
            return false;

        } else if (!myreg.test(s)) {
            return false;

        }
        return true;
    };
    this.isNotEmpty = function(res) {
        if (res !== undefined && res !== "" && res !== null) {
            return true;
        } else {
            return false;
        }
    };
    this.isNotNull = function(res) {
        if (res !== undefined && res !== '' && res !== null) {
            return true
        } else {
            return false
        }
    }
    this.isNull = function(res) {
        return !this.isNotNull(res)
    };
    this.compareDateTime = function(date1, date2) {
        var oDate1 = new Date(date1);
        var oDate2 = new Date(date2);
        if (oDate1.getTime() >= oDate2.getTime()) {
            return true;
        } else {
            return false;
        }
    };
    this.emptyObj = function(obj) {
        for (let key in obj) {
            return false //非空
        }
        return true
    }
    this.contains = function(arr, obj) {
        var i = arr.length;
        while (i--) {
            if (arr[i] === obj) {
                return true;
            }
        }
        return false;
    };
    this.num = function(obj) {
        obj.value = obj.value.replace(/[^\d.]/g, ""); //清除"数字"和"."以外的字符
        obj.value = obj.value.replace(/^\./g, ""); //验证第一个字符是数字
        obj.value = obj.value.replace(/\.{2,}/g, "."); //只保留第一个, 清除多余的
        obj.value = obj.value.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
        obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
    }
}

export const validUtil = new ValidUtil();
