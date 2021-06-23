<template>
  <div :class="theme">
    <div class="header">
      <div class="top">
        <div class="top-date" style="padding-right:10px;">
          <span><img src="" alt=""></span>
          <span>{{date}}</span>
          <div style="float: right;width: 32px;height: 32px;" @mouseover="selectShow=true" @mouseout="selectShow=false">
            <img class="buddha" :src="sessionUtil.getUser().picture? sessionUtil.getUser().picture:defaultLogo" alt="">
          </div>
        </div>
         <div v-show="selectShow"  @mouseover="selectShow=true"  @mouseout="selectShow=false" class="select-show" :style="{opcity:selectShow?'1':'0',}">
          <div style="text-align:left;">
            <div style="width:100%;height:100%;position:relative;box-sizing:border-box">
              <div @click="changepswPicture.dialogVisible=true" class="buddha1" style="overflow:hidden;">
                <img  :src="sessionUtil.getUser().picture? sessionUtil.getUser().picture:defaultLogo" width="100%" height="100%" alt="">
              </div>
              <p style="margin-left:6px;font-size: 14px;color: #333333;font-family: PingFangSC-Medium;padding-top:12px">{{sessionUtil.getUserName()}}</p>
              <p style="margin-left:6px;font-size: 14px;color: #999;padding-top:2px;font-size:12px;">{{sessionUtil.getUser().userId}}</p>
              <i style="position:absolute;height:1px;width:100%;background:#E7E7E7;bottom:0;left:0px;"></i>
            </div>
          </div>
          <div style="cursor:pointer;" @click="changepsw()">
            <div style="width:100%;height:100%;position:relative;box-sizing:border-box;line-height:60px;padding-left:6px">
              修改密码
              <i style="position:absolute;height:1px;width:100%;background:#E7E7E7;bottom:0;left:0px;"></i>
            </div>
          </div>
           <div v-if="sessionUtil.isAdmin()" style="cursor:pointer;" @click="redirectLog()">
             <div style="width:100%;height:100%;position:relative;box-sizing:border-box;line-height:60px;padding-left:6px">
               查看日志
               <i style="position:absolute;height:1px;width:100%;background:#E7E7E7;bottom:0;left:0px;"></i>
             </div>
           </div>
          <div style="cursor:pointer;line-height:60px;padding-left:20px" @click="loginOut()">退出登录</div>
        </div>
        <h1>{{title}}</h1>
      </div>
      <div class="tabss">
        <div class="tabs-left">
          <div v-if="sessionUtil.isAllowMenu('0301')" ><router-link tag="span" active-class="active"  to="/proj/largeScreen">集团大屏</router-link></div>
          <div v-if="sessionUtil.isAllowMenu('0501')"><router-link tag="span" active-class="active"  to="/proj/report">集团报表</router-link></div>
          <div v-if="sessionUtil.isAllowMenu('0201')"><router-link tag="span" :class="{active:$route.path=='/proj'}" to="/proj">项目</router-link></div>
          <div v-if="sessionUtil.isAllowMenu('SYS_08')||sessionUtil.isAllowMenu('SYS_07')" ><router-link tag="span"  :class="{active:$route.path.substring(0,13)=='/proj/library'}"  to="/proj/library/form/query/t_gdb_jcbzk">企业库</router-link></div>
      		<!-- <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_09')"  style="width: 110px;backgroundSize: 110px 25px;"  :class="{active:$route.path=='/proj/form/query/t_gt_project_sgjhmb'}"  to="/proj/form/query/t_gt_project_sgjhmb">进度计划模板</router-link></div> -->
      		<div v-if="sessionUtil.isAllowMenu('SYS_09')"><router-link tag="span"  style="width: 110px;backgroundSize: 110px 25px;"  active-class="active"  to="/proj/documentManage">文档模板管理</router-link></div>

        </div>
        <div class="tabs-right">
          <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_01')"  active-class="active" to="/proj/enterprisesSet" >组织架构</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_90')" active-class="active"  to="/proj/dataDictionary">数据字典</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_05')"  active-class="active"  to="/sys/org/auth-config">角色授权</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_05')"  active-class="active"  to="/proj/form/query/t_product_type">产品类型</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_05')"  active-class="active"  to="/form/query/t_setup_project">项目立项</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAdmin()" active-class="active"  to="/form/view/form-list">表单管理</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAdmin()" active-class="active"  to="/sys/menu/manage">菜单管理</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAdmin()"  active-class="active" to="/sys/wf/manage" >流程配置</router-link></div>
        </div>
      </div>
    </div>
    
    <div class="page-box">
      <router-view :key="$route.path"></router-view>
    </div>

    <changepsw :models="changepswObj"></changepsw>
    <companyInfo ref="corpInfoSel" :models="companyObj"></companyInfo>
    <changePicture :models="changepswPicture"></changePicture>

  </div>
</template>

<script>
import changepsw from './changePsw.vue'
import changePicture from './changePicture.vue'
import companyInfo from './companyInfo.vue'
import { Transform } from 'stream'
import { mapMutations } from 'vuex'
export default {
  name: 'index',
  components:{changepsw,companyInfo,changePicture},
  data () {
    return {
      theme:'bg',
      changepswObj:{
        dialogVisible:false,
      },
      changepswPicture:{
        dialogVisible:false,
      },
      companyObj:{
        dialogVisible:false,
      },
      selectShow:false,
      date:'',
      title:'',
    }
  },
  computed:{
      defaultLogo:function(){
        return this.$store.state.defaultLogo
      }
  },
  created(){
    this.title=this.sessionUtil.getCompanyName();
    let dates=new Date()
    this.date=dates.getFullYear()+'年'+(dates.getMonth()+1)+'月'+dates.getDate()+'日'+' 星期'+dates.formatWeek()
  },
  // watch: {
  //   $route(newVal) {
  //     if(newVal.path == '/proj') {
  //       this.activeStr='项目';
  //     }
  //   }
  // },
  methods:{
    ...mapMutations([
      'setFormConfig'
    ]),
    redirectLog(){
      let url = this.util.getBaseUrl() + '/api_v1/modules/log/content/all?access_token=' + this.sessionUtil.getAccessToken()
      window.open(url)
    },
    changepsw(){
      this.changepswObj.dialogVisible=true;
    },
    editCorpInfo(){
      this.companyObj.dialogVisible=true;
    },
      loginOut(){
        this.cookieUtil.clearSession();
        this.cookieUtil.clearAll();
        // 清除window.cache_session
				this.sessionUtil.removeSession();
        this.$router.push({ path: '/login' });
        this.$store.commit('resetState')
        // window.location.reload()
        // this.$store.commit('clearAuth')
        // this.$store.dispatch('clearAuth')
        // this.$router.push({ path: '/login' });
      },
  }
}
</script>

<style scoped>
.page-box{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 10px ;
  font-size: 14px;
  padding-top:0;
  overflow: auto;
  position: relative;
}
.bg{
  width: 100%;
  height: 100%;
  background: url(../assets/indexImg/background.png) no-repeat top center;
  position: relative;
  background-size: cover;
  padding-top: 104px;
  box-sizing: border-box;
  min-width: 1300px;
  max-width: 1920px;
  min-height: 768px;
}
.bg02 {
  width: 100%;
  /* height: 100%; */
  background: url(../assets/image/indexImg/bg.jpg) no-repeat top center;
  position: relative;
  background-size: cover;
  padding-top: 104px;
  box-sizing: border-box;
  min-width: 1300px;
  max-width: 1920px;
  min-height: 768px;
}
 .tabs-box{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 10px;
        box-sizing: border-box;
    }
.header{
  height: 104px;
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
}
.top{
  height: 50px;
  overflow: hidden;
  color: #000;
}

h1{
  font-size: 28px;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-image: linear-gradient(top, #06FCFF 40%, #20A5FF 60%);
  line-height: 50px;
  text-align: center;
  width: 500px;
  margin: 0 auto;
}
.top-date{
  float: right;
  line-height: 50px;
    color: #fff;
}
.buddha{
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.tabss{
  height: 54px;
  background: url(../assets/indexImg/title.png) repeat-x top center;
  position: relative;
  border: 0 none;
  /* background-size: cover; */
  text-align: center;
}
span{
    color: #fff;
}
.tabsspan{
	width: 100px !important;
}
.tabss .tabs-left{
  position: absolute;left: 10px;
  z-index: 1;
}
.tabss .tabs-right{
  position: absolute;right: 10px;
  z-index: 1;

}

.tabss .tabs-left>div{
  font-size: 14px;
  float: left;
}
.tabss .tabs-right>div{
  font-size: 14px;
  float: right;
}

.tabss>div>div span{
  display: block;
  margin: 5px 0;
  padding: 3px 11px;
  width: 78px;
  box-sizing: border-box;
}

.tabss .tabs-left>div .active{
  background: url(../assets/indexImg/tabs-left.png) no-repeat  top center;
}
 .actives{
  background: url(../assets/indexImg/select.png) no-repeat  top center;
  background-size: 100px 27px !important;
}
.tabss .tabs-right>div .active{
  background: url(../assets/indexImg/tabs-right.png) no-repeat  top center
}
a,a:active{
  color: #fff;
  text-decoration: none;
}


.select-show{
  position: absolute;
  right: 0px;
  top:38px;
  background: #fff;
  z-index: 999;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  transition: all 0.5s;
}
.select-show>div{
  width: 180px;
  height: 60px;
  padding:0 14px;
  box-sizing: border-box;
  text-align:left;
}
.select-show>div:hover{
  background: #e7e7e7;
}
.select-show>div:first-child:hover{
  background: #fff;
}
.buddha1{
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 6px;
  float: left;
  margin-top: 9px;
}
.date-picker >>> .el-input__icon {
    line-height: 20px;
}
</style>

