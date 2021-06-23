<template>
<div id="jqContent" style="text-align: left;opacity: 1;">
  <div class="box">
        
        <div id="mainCss">
            <div id="mainInner">
                <div id="box">
                  <div class="survey" style="margin:0px auto;">
                    <div class="surveyhead" style="border: 0px;">
                      <div style="position:relative;">
                        <h1>筑筑智慧工地申请试用</h1><span style="position:absolute; right:-10px; top:6px;"><a href="javascript:;" onclick="showData(event,this,&quot;https://www.wjx.top/m/34587676.aspx&quot;,0);" style="display:inline-block;width:50px;height:50px;background:url(&quot;//down.wjx.com/handler/qrcode.ashx?chs=50x50&amp;chl=https%3a%2f%2fwww.wjx.top%2fm%2f34587676.aspx&quot;) no-repeat;"></a></span>
                      </div>  
                      <div >
                        
                      </div>
                      <div style="clear: both;"></div>
                      <div class="surveydescription">
                            <span style="vertical-align: middle;">互联网+智能硬件+工地宝APP打造的智慧工地，推动施工项目实现精细化、信息化。让你的工地一步实现智慧工地,助力项目提质增效！咨询电话:020-87723083
                              <div align="center"><img width="304px" height="222px" src="../assets/register/info.jpg" alt=""><br>
                            </div></span>
                      </div>
                      <div style="clear: both;"></div>
                    </div>  

                    <div class="surveycontent">
                      <el-form class="login-container" label-position="left" label-width="0px" v-loading="loading">
                        <el-form-item prop="account">
                          <div class="div_title_question_all">
                            <div class="div_topic_question">1.</div>
                            <div id="divTitle2" class="div_title_question">手机号<span class="req">*</span></div>
                          </div>
                          <el-input type="text" v-model="loginForm.mobileNo" auto-complete="off" placeholder="输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item prop="account">
                          <div class="div_title_question_all">
                            <div class="div_topic_question">2.</div>
                            <div id="divTitle2" class="div_title_question">
                              验证码<span class="req">*</span>
                              <el-button type="primary" style="width: 20%"  @click="getVerificationCode">{{count_text}}</el-button>
                            </div>
                          </div>
                          <el-input type="text" v-model="loginForm.verCode" auto-complete="off" placeholder="输入验证码"></el-input>
                        </el-form-item>
                        <el-form-item prop="account">
                          <div class="div_title_question_all">
                            <div class="div_topic_question">3.</div>
                            <div id="divTitle2" class="div_title_question">姓名<span class="req">*</span></div>
                          </div>
                          <el-input type="text" v-model="loginForm.userName" auto-complete="off" placeholder="输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item prop="account">
                          <div class="div_title_question_all">
                            <div class="div_topic_question">3.</div>
                            <div id="divTitle2" class="div_title_question">账号<span class="req">*</span></div>
                          </div>
                          <el-input type="text" v-model="loginForm.userId" auto-complete="off" placeholder="输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item prop="account">
                          <div class="div_title_question_all">
                            <div class="div_topic_question">4.</div>
                            <div id="divTitle2" class="div_title_question">密码<span class="req">*</span></div>
                          </div>
                          <el-input type="password" v-model="loginForm.pwd" auto-complete="off" placeholder="输入密码"></el-input>
                        </el-form-item>
                        <el-form-item prop="account">
                          <div class="div_title_question_all">
                            <div class="div_topic_question">5.</div>
                            <div id="divTitle1" class="div_title_question">确认密码<span class="req">*</span></div>
                            <div style="clear:both;"></div>
                          </div>
                          <el-input type="password" v-model="loginForm.confirmPassword" auto-complete="off" placeholder="确认密码"></el-input>
                        </el-form-item>
                        
                        <el-form-item prop="account">
                          <div class="div_title_question_all">
                            <div class="div_topic_question">6.</div>
                            <div id="divTitle2" class="div_title_question">单位名称<span class="req">*</span></div>
                          </div>
                          <el-input type="text" v-model="loginForm.name" auto-complete="off" placeholder="输入单位名称"></el-input>
                        </el-form-item>
                       
                       
                      </el-form>

                      <div style="padding-top: 6px;clear:both; padding-bottom:10px;" id="submit_div">
                          <div id="submit_table" style="margin: 20px auto;text-align: center;">
                              <el-button type="primary" style="width: 50%" @click="submitClick">提交</el-button>
                          </div>
                      </div>
                  
                  </div>

                  </div>
                </div>
              </div> 
          </div>   
      </div>   
    
    
    
  </div>
  
</template>
<script>
  export default{
    data(){
      return {
      		time:60,
				count_text:'获取验证码',
					canSMS:true,//判断验证码按钮状态
				isGetSMS:true,//已点击获取验证码按钮
        rules: {
          account: [{required: true, message: '请输入用户名', trigger: 'blur'}],
          checkPass: [{required: true, message: '请输入密码', trigger: 'blur'}]
        },
        loginForm: {
          username: '',
          password: ''
        },
        loading: false,
        verCode:""
      }
    },
    mounted(){
    	
    },
    methods: {
    	countDown() {
				let that = this
				that.count_text = that.time + '秒'
				if(that.time === 0) {
					that.count_text = '获取验证码'
					that.time = 60
					that.canSMS = true
				} else {
					that.count_text = (that.time--) + '秒'
					setTimeout(that.countDown, 1000);
				}
			},
      getVerificationCode(){
          console.debug("获取验证码===");
          var phoneReg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
          if(this.canSMS){
		        if (!phoneReg.test(this.loginForm.mobileNo)) {
		            this.util.error('手机号码不合法')
		          return
		        }
		        this.canSMS = false;
		        debugger
		          this.util.restGet('/api_v1/verificationCode',{mobile:this.loginForm.mobileNo},(res)=>{
		            console.debug("verificationCode===",res);
		            if(res.status==200){
		                this.verCode=res.data;
		                  this.countDown();
		            }else{
		                this.util.error(res.errorMsg)
		                this.canSMS = true;
		            }
		        })
          }
     
      },
      submitClick: function () {
      	if(!this.validUtil.isNotEmpty(this.loginForm.verCode)){
      		 this.util.error('请输入验证码')
				    return false;
      	}else if(!this.validUtil.isNotEmpty(this.loginForm.verCode!=this.verCode)){
      		 this.util.error('验证码不正确')
				    return false;
      	}else if(!this.validUtil.isNotEmpty(this.loginForm.userName)){
      		 this.util.error('请输入姓名')
				   return false;
      	}else if(!this.validUtil.isNotEmpty(this.loginForm.userId)){
      		 this.util.error('请输入账号')
				   return false;
      	}else if(!this.validUtil.isNotEmpty(this.loginForm.pwd)){
      		 this.util.error('请输入密码')
				    return false;
      	}else if(!this.validUtil.isNotEmpty(this.loginForm.confirmPassword)){
      		 this.util.error('请输入确认密码')
				    return false;
      	}else if(this.loginForm.confirmPassword != this.loginForm.pwd){
      		 this.util.error('密码不一致！请输入一致密码')
				    return false;
      	}else if(!this.validUtil.isNotEmpty(this.loginForm.name)){
      		 this.util.error('请输入单位名称')
				   return false;
      	}else{
      		    this.util.mask("正在注册..");
		        this.util.restPost('/api_v1/registerOrg',this.loginForm,(res)=>{
              console.debug("registerOrg===",res);
		          this.util.unmask();
		            if(res.status==200){
		                this.util.success('注册成功，重新登录')
		                
		            }else{
		                this.util.error(res.errorMsg)
		            }
		        })
      	}
    
      }
    }
  }
</script>
<style>
body{
  background-image: url("../assets/register/bg.jpg");
  background-color: #F3F6FA;
  background-repeat: repeat-x;
  background-size: 1px 300px;
}
#jqContent {
    width: 920px;
    background: url("../assets/register/background.jpg") no-repeat top center;
    background-size: auto;
    background-size: 910px 144px;
    padding-top: 120px;
    margin: 0 auto;
}
.box {
    box-shadow: 0px 1px 6px 0px rgba(205,220,245,1);
}
#headerCss {
    position: relative;
    background: white no-repeat;
    width: 920px;
    margin: 0 auto;
}
#mainCss {
    background: white;
    width: 920px;
    margin: 0 auto;
}
.survey {
    width: 780px;
    line-height: 20px;
    word-wrap: break-word;
    padding: 0;
    margin: 0 auto;
}
.surveyhead {
    line-height: 20px;
    text-align: center;
    width: 96%;
    padding: 40px 2% 30px;
}
.surveyhead h1 {
    font-size: 24px !important;
    font-weight: bold;
    color: #5A83E5;;
    vertical-align: middle;
    margin: 0;
    padding: 15px 0;
    line-height: 24px;
}
.surveycontent {
    margin: 0;
    width: 100%;
}

.div_question {
    border: 2px solid white;
    padding: 4px;
    clear: both;
    margin: 2px auto 10px;
    width: 96%;
    height: auto;
}
.div_title_question_all {
    padding-top: 2px;
    font-size: 15px;
    color: #444444;
    font-weight: bold;
    height: auto;
    line-height: 20px;
    position: relative;
}
.div_topic_question {
    width: 28px;
    float: left;
}
.div_title_question {
    overflow: hidden;
    zoom: 1;
}
.div_table_radio_question {
    clear: both;
    padding-top: 5px;
    padding-left: 24px;
    padding-bottom: 2px;
    border-bottom: 1px solid #EFEFEF;
    font-size: 15px;
    color: #333333;
    padding-left: 27px;
}
.div_table_clear_top {
    clear: both;
    margin-top: 4px;
}
.div_table_radio_question .inputtext {
    line-height: 22px;
    height: 22px;
    font-size: 16px;
}
.div_table_clear_bottom {
    clear: both;
    margin-bottom: 10px;
}
</style>
