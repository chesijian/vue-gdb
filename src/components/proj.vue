<template>
  <div :class="theme">
    <div class="header">
      <div class="header-top">
        <div class="user-info">
          <span>{{date}}</span>
          <div @mouseover="selectShow=true" @mouseout="selectShow=false">
            <img :src="currentUser.picture? currentUser.picture:defaultLogo" alt="">
          </div>
        </div>
         <div v-show="selectShow"  @mouseover="selectShow=true"  @mouseout="selectShow=false" class="select-show" :style="{opcity:selectShow?'1':'0',}">
          <div class="picture">
            <div>
              <div @click="changepswPicture.dialogVisible=true" class="buddha1">
                <img  :src="currentUser.picture? currentUser.picture:defaultLogo" width="100%" height="100%" alt="">
              </div>
              <p style="color: #333333;font-family: PingFangSC-Medium;padding-top:12px">{{sessionUtil.getUserName()}}</p>
              <p style="color: #999;padding-top:2px;font-size:12px;">{{currentUser.userId}}</p>
              <i></i>
            </div>
          </div>
          <div class="password" @click="changepsw()">
            <div>
              修改密码
              <i></i>
            </div>
          </div>
           <div class="password" v-if="sessionUtil.isAdmin()" @click="redirectLog()">
             <div>
               查看日志
               <i></i>
             </div>
           </div>
          <div style="cursor:pointer;line-height:60px;padding-left:20px" @click="loginOut()">退出登录</div>
        </div>
        <h1>{{title}}</h1>
      </div>
      <div class="tabss">
        <div class="tabs-left">
          <div v-if="sessionUtil.isAllowMenu('0301')" ><router-link tag="span" active-class="active"  to="/index/largeScreen">集团大屏</router-link></div>
          <div v-if="sessionUtil.isAllowMenu('0501')"><router-link tag="span" active-class="active"  to="/index/report">集团报表</router-link></div>
          <div v-if="sessionUtil.isAllowMenu('0201')"><router-link tag="span" :class="{active:$route.path=='/index/project'}" to="/index/project">项目</router-link></div>
          <div v-if="sessionUtil.isAllowMenu('SYS_08')||sessionUtil.isAllowMenu('SYS_07')" ><router-link tag="span"  :class="{active:$route.path.substring(0,13)=='/proj/library'}"  to="/proj/library/form/query/t_gdb_jcbzk">企业库</router-link></div>
      		<div v-if="sessionUtil.isAllowMenu('SYS_09')"><router-link tag="span"  style="width: 110px;backgroundSize: 110px 25px;"  active-class="active"  to="/proj/documentManage">文档模板管理</router-link></div>

        </div>
        <div class="tabs-right">
          <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_01')"  active-class="active" to="/index/enterprisesSet" >组织架构</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_90')" active-class="active"  to="/index/dataDictionary">数据字典</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_05')"  active-class="active"  to="/sys/org/auth-config">角色授权</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_05')"  active-class="active"  to="/proj/form/query/t_product_type">产品类型</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAllowMenu('SYS_05')"  active-class="active"  to="/form/query/t_setup_project">项目立项</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAdmin()" active-class="active"  to="/form/view/form-list">表单管理</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAdmin()" active-class="active"  to="/index/menu/manage">菜单管理</router-link></div>
          <div><router-link tag="span" v-if="sessionUtil.isAdmin()"  active-class="active" to="/sys/wf/manage" >流程配置</router-link></div>
        </div>
      </div>
    </div>
    
    <div class="page-box">
      <router-view :key="$route.path"></router-view>
    </div>

    <changepsw :models="changepswObj"></changepsw>
    <changePicture :models="changepswPicture"></changePicture>

  </div>
</template>

<script>
import changepsw from './changePsw.vue'
import changePicture from './changePicture.vue'
import { mapMutations } from 'vuex'
export default {
  name: 'index',
  components:{changepsw,changePicture},
  data () {
    return {
      theme:'bg',
      currentUser:{},//当前用户
      changepswObj:{
        dialogVisible:false,
      },
      changepswPicture:{
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
    this.currentUser=this.sessionUtil.getUser();
    this.title=this.sessionUtil.getCompanyName();
    let dates=new Date()
    this.date=dates.getFullYear()+'年'+(dates.getMonth()+1)+'月'+dates.getDate()+'日'+' 星期'+dates.formatWeek()
  },
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

<style scoped lang="scss">
.header{
  height: 104px;
  position: absolute;
  top: 0;
  width: 100%;
  left: 0;
  &-top{
    height: 50px;
    overflow: hidden;
    color: #000;
    .user-info{
      float: right;
      line-height: 50px;
      color: #fff;
      padding-right:10px;
      >div{
        float: right;
        width: 32px;
        height: 32px;
      }
      img{
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
    }
  }
}

.tabss{
  height: 54px;
  background: url(../assets/indexImg/title.png) repeat-x top center;
  position: relative;
  border: 0 none;
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
  i{
    position:absolute;height:1px;width:100%;background:#E7E7E7;bottom:0;left:0px;
  }
  >div{
    width: 180px;
    height: 60px;
    padding:0 14px;
    box-sizing: border-box;
    text-align:left;
  }
  >div:hover{
    background: #e7e7e7;
  }
  >div:first-child:hover{
    background: #fff;
  }
  .picture{
    >div{
      width:100%;height:100%;position:relative;box-sizing:border-box
    }
    p{
      margin-left:6px;
      font-size: 14px;
    }
  }
  .password{
    cursor:pointer;
    >div{
      width:100%;height:100%;position:relative;box-sizing:border-box;line-height:60px;padding-left:6px
    }
  }
}

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


.buddha1{
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 6px;
  float: left;
  margin-top: 9px;
  overflow:hidden;
}
.date-picker >>> .el-input__icon {
    line-height: 20px;
}
</style>

