<template>
    <div class="login-box" @keydown="keyLogin()">
        <img src="../assets/image/login/bg.png" width="100%" height="100%" alt="">
        <div class="login">
            
            <div class="deng">
                <p>顺丰智慧工程管理平台</p>
                <div class="deng1">
                    <i class="icon"></i>
                    <input type="text" v-model="userName" v-focus placeholder="请输入您的用户名">
                </div>
                <div class="deng2">
                    <i class="icon"></i>
                    <input type="password" v-model="passworld" placeholder="请输入您的密码">
                </div>
              <div class="deng2">
                <input type="text" name="vCode"  v-model="code" placeholder="请输入验证码"  style="width: 200px;padding-left: 10px;border-top-right-radius: 0;border-bottom-right-radius: 0"/>
                <img  :src="vcodeUrl" @click="changeVCode()">
              </div>
                <!-- <el-form ref="form" :model="form" size="mini" class="form-wrap">
                    <el-form-item>
                        <el-checkbox-group v-model="form.type">
                            <el-checkbox label="记录用户名" name="type"></el-checkbox>
                            <el-checkbox label="记录密码" name="type"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-form> -->
                <div class="deng2 login-btn">
                    <button @click="login">登&nbsp;&nbsp;&nbsp;&nbsp;录</button>
                </div>
               
            </div>
            <div class="erweima">
                <p>扫码下载APP应用</p>
                <div class="erweima-panel">
                    <div>
                        <img :src="`${util.getBaseUrl()}/share/qr?content=${QRcodeUrl}`" alt="" class="ewm">
                    </div>
                    
                </div>
                <div class="erweima-item">
                    <p @click="changeQrCode('android')" :class="{tabactive:tabItem=='android'}">安卓(android)版</p>
                    <p @click="changeQrCode('ios')" :class="{tabactive:tabItem=='ios'}">苹果(ios)版</p>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
  import {encrypt} from "../plugins/crypto-js";
  import {getUUID} from "../utils/uuid";


  export default {
    data() {
        return {
            QRcodeUrl:'',
            code:'',
            random:'',
            vcodeUrl:'',
            userName: '',
            passworld: '',
            loginType:0,
            form: {
                type: [],
            },
            tabItem: 'android',
        }
    },
    created() {
        this.changeQrCode(this.tabItem);
    },
    mounted() {
        
        this.changeVCode()
    },
    directives: {//自动获取焦点
        focus: {
            inserted: function (el) {
                el.focus()
            }
        }
    },
    methods: {
        changeQrCode(value){
            this.tabItem = value;
            this.util.restGet('/share/appDownloadUrl', {appType:value}, (res) => {
                if(res.status==200){
                    if(value=='ios'){
                        this.QRcodeUrl=encodeURIComponent(res.data);
                    }else{
                        this.QRcodeUrl=encodeURIComponent(`${this.util.getBaseUrl()}/share/${res.data}/download`);
                    }
                    
                }
                
            });
        },
        changeVCode(){ // 切换验证码
            this.random = getUUID()
            this.vcodeUrl = this.util.getBaseUrl()+'/api_v1/vcode?random='+this.random
        },
        applyTry(){
            // window.open("https://www.wjx.top/jq/34587676.aspx");
            console.debug("申请试用====");
            this.$router.push({ path: '/register' })
        },
        keyLogin() {
            if (event.keyCode == 13) {
                this.login()
            }  //回车键的键值为13
            //调用登录按钮的登录事件
        },
        addFavorite() {
            var url = window.location;
            var title = document.title;
            var ua = navigator.userAgent.toLowerCase();
            if (ua && ua.indexOf("msie 8") > -1) {
                external.AddToFavoritesBar(url, title, '');//IE8
            } else {
                try {
                    window.external.addFavorite(url, title);
                } catch (e) {
                    try {
                        window.sidebar.addPanel(title, url, "");//firefox
                    } catch (e) {
                        alert("加入收藏失败，请使用Ctrl+D进行添加");
                    }
                }
            }
        },
        setHome() {
            var obj = window
            var url = window.location.href
            try {
                obj.style.behavior = 'url(#default#homepage)';
                obj.setHomePage(url);
            } catch (e) {
                if (window.netscape) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    } catch (e) {
                        alert("抱歉，此操作被浏览器拒绝！\n\n请在浏览器地址栏输入“about:config”并回车然后将[signed.applets.codebase_principal_support]设置为'true'");
                    }
                } else {
                    alert("抱歉，您所使用的浏览器无法完成此操作。\n\n您需要手动将【" + url + "】设置为首页。");
                }

            }
        },
        login() {
            if (!this.validUtil.isNotEmpty(this.userName)) {
                this.util.error("请输入用户名!");
                return;
            }
            if (!this.validUtil.isNotEmpty(this.passworld)) {
                this.util.error("请输入密码!");
                return;
            }
        //   if (!this.validUtil.isNotEmpty(this.code)) {
        //     this.util.error("请输入验证码!");
        //     return;
        //   }
          var params = {
              random:this.random,
            code:this.code,
            ifContainAuth:true,
            // userId: encrypt(this.userName),
            // password: encrypt(this.passworld),
            userId: this.userName,
            password: this.passworld,
            signType: 1,
            loginType: 0,
          }
            this.getToken(params);
        },
        getToken(params) {
            this.util.mask("正在登陆...");
            this.util.restPostKeyValue('/doLogin', params, (res) => {
                console.log("登录请求返回=====",res);
                this.util.unmask();
                if (res.status == 200) {
                    this.cookieUtil.clear('LoginOut');
                    /*if(res.auths != null){
                        var auths = res.auths;
                        _this.sessionUtil.initAuths(auths);
                    }*/
                    this.sessionUtil.initSession(res);
                    // var session = _this.sessionUtil.getSession();
                    // _this.$store.state.userName = _this.sessionUtil.getUserName();
                    // _this.$store.state.userUid = _this.sessionUtil.getUserUid();
                    // _this.$store.state.userId = _this.sessionUtil.getUserId();
                    // _this.$store.state.companyUid = _this.sessionUtil.getCompanyUid();
                    if(this.loginType==0){
                        this.$router.push({ path: '/index/project' })

                        // window.location.href="http://yun.zhuzhu.biz:8081/gdb/static/platform/index.html#/proj"
                    }else{
                        window.location.href=this.util.getBaseUrl()+"/static/jgb/index.html#/proj"
                    }

                } else {
                    this.changeVCode();
                    this.util.error(res.errorMsg)
                }
                
            })
        }
    }
}
</script>

<style scoped lang="scss">
.form-wrap {
    margin-bottom: 0;
    height: 28px;
    overflow: hidden;
}
.login-box > img {
    position: absolute;
    bottom:0;
    left: 0;
}
.login-btn {
    margin-top: 0;
}
.login-box {
    width: 100%;
    height: 100%;
    position: relative;
    background: linear-gradient(#092757 , #0F548E);
    overflow: hidden;
}
.login {
    display: flex;
    position: absolute;
    top: 50%;
    left: 65%;
    transform: translate(-50%, -50%);
    background: rgba(0,0,0,0.3);
    /* box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.05); */
}

.erweima>p {
    font-family: SourceHanSansCN-Regular;
    font-size: 14px;
    color: #fff;
    padding: 10px;
}
.erweima-panel {
    padding: 30px 60px;
    box-sizing: border-box;
    position: relative;
    >div{
        width: 196px;
        height: 200px;
        background: #fff;
        align-items: center;
        justify-content: center;
        display: flex;
    }
}
.erweima-item{
    display: flex;
    color: #fff;
    padding: 10px;
}
.erweima-item>p{
    width: 50%;
    text-align: center;
    cursor: pointer;
}
.erweima-item>.tabactive {
    color: rgb(68,210,255);
}
.box {
    width: 240px;
    height: 240px;
    background: red;
    margin-bottom: 12px;
}

.deng {
    width: 360px;
    height: 100%;
    float: right;
}
.deng > h3 {
    font-size: 20px;
    color: #0063c1;
    text-align: center;
    margin-top: 90px;
    font-family: "microsoft yahei";
    font-weight: 400;
    margin-bottom: 10px;
}
.deng > div {
    width: 300px;
    margin: 0px auto 28px;
    overflow: hidden;
    border-radius: 4px;
    display: flex;
}
.deng > div h3 {
    font-size: 14px;
    color: #666666;
    margin-bottom: 12px;
    text-align: left;
}
.deng > div input {
    height: 48px;
    line-height: 48px;
    width: 250px;
    border: 0;
    box-sizing: border-box;
    font-size: 16px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background-color: rgb(232, 240, 254);
}
input:focus {
    outline: none;
}
.deng > div button {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background: rgba(3,94,167,1);
    border-radius: 2px;
    font-size: 16px;
    color: rgba(221,221,221,1);
    border-radius: 4px;
    cursor: pointer;
}
.el-checkbox-group {
    width: 300px;
    display: flex;
    margin: 0 auto;
    justify-content: space-between;
}

.deng>p {
    padding: 20px 31px;
    font-size: 22px;
    color: rgb(68,210,255);
    text-align: center;
}
.deng > div span {
    font-size: 12px;
    color: #999999;
    cursor: pointer;
}
.deng1 .icon {
    height: 48px;
    width: 48px;
    background: url('../assets/image/login/account.png') no-repeat 10px 10px rgb(232, 240, 254);
}
.deng2 .icon {
    height: 48px;
    width: 48px;
    background: url('../assets/image/login/password.png') no-repeat 10px 8px rgb(232, 240, 254);
}
.login .tu_deng p {
    position: absolute;
    top: -37px;
    right: 32%;
    font-size: 16px;
    color: rgba(221,221,221,1);
}
.login .tu_tab p {
    position: absolute;
    top: 65px;
    right: 27%;
    font-size: 16px;

    color: rgba(221,221,221,1);
}
.el-checkbox-group >>> .el-checkbox__label {
    font-size: 16px;
    color: rgba(221,221,221,1);
}
.tabss {
    position: absolute;
    top: 0px;
    right: 0;
    width: 360px;
    font-size: 16px;
    color: rgba(221,221,221,1);
    cursor: pointer;
    font-family: "微软雅黑";
    text-align: center;
}
.tabss > div {
    width: 50%;
    float: left;
    text-align: center;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    /* box-shadow: 2px -2px 5px 0 rgba(0, 0, 0, 0.03) inset; */
}
.tabss .tab1 {
    /* box-shadow: -2px -2px 5px 0 rgba(0, 0, 0, 0.03) inset; */
}


.login-box >>> .input:-internal-autofill-selected {
    background-color: #fff !important;
}
</style>

