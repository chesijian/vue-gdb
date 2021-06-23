<template>
  <div class="bg">
    <div class="header">
      <div class="top">
        <div class="select-proj" v-if="showPictures">
          <el-select v-model="selectProj" @change="chengeProj"  placeholder="" size="mini" style="background:transparent">
              <el-option
                v-for="item in boxList"
                :key="item.id"
                :label="item.proName"
                :value="item.id">
              </el-option>
          </el-select>
        </div>
        <div class="top-date" style="padding-right:10px;">
          <button style="backround:rgba(68,210,255,0.5);width:90px;height:32px;border-radius:18px;" @click="$router.replace({path:'/proj'})">
            <img width="18px" height="18px" style="margin-right:0px;vertical-align: middle;" src="../../../assets/indexImg/home.png" alt="">
            <span style="vertical-align: middle;">主页</span>
          </button>
          <span><img src="" alt=""></span>
          <span>{{date}}</span>
          <span @mouseover="selectShow=true"  @mouseout="selectShow=false"><img class="buddha"  :src="sessionUtil.getUser().picture? sessionUtil.getUser().picture:defaultLogo" alt=""></span>
        </div>
        <div  @mouseover="selectShow=true"  @mouseout="selectShow=false" class="select-show" :style="{height:selectShow?'180px':'0',opcity:selectShow?'1':'0',}">
          <div style="text-align:left;">
            <div style="width:100%;height:100%;position:relative;box-sizing:border-box">
              <div @click="changePic" class="buddha1" style="overflow:hidden">
                <img :src="sessionUtil.getUser().picture? sessionUtil.getUser().picture:defaultLogo" width="100%" height="100%" alt="">
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
          <div style="cursor:pointer;line-height:60px;padding-left:20px" @click="loginOut()">退出登录</div>
        </div>
        <h1>{{title}}</h1>
      </div>
      <div class="tabs">
        <div class="tabs-left">
          
        </div>
        <div class="tabs-right">
         
        </div>
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import {  mapMutations } from 'vuex'
export default {
  name: 'index',
  data () {
    return {
      defaultLogo:require('@/assets/sflogo.jpg'),
      showPictures:true,
       date:'',
        selectShow:false,
        title:'',
       boxList: [],
        selectProj: ''
    }
  },
  created(){
    if(JSON.parse(this.cookieUtil.get('projectNode'))) {
      this.selectProj=JSON.parse(this.cookieUtil.get('projectNode')).id
    }
    this.title=this.sessionUtil.getCompanyName();
    let dates=new Date()
    this.date=dates.getFullYear()+'年'+(dates.getMonth()+1)+'月'+dates.getDate()+'日'+' 星期'+dates.formatWeek()
    this.loadData()
  },
  methods:{
    ...mapMutations([
      'setFormConfig'
    ]),
    changepsw(){
      this.changepswObj.dialogVisible=true;
    },
    changePic(){
      this.changepswPicture.dialogVisible=true;
    },
    loginOut(){
      this.cookieUtil.clearSession();
      this.cookieUtil.clearAll();
      this.$router.push({ path: '/login' });
    },
    chengeProj(value){
      this.$children[1].initDatas(value);
    },
     loadData(){
          let params={
              search:'',
              projStatus:'',
              pageSize:1000,
              pageIndex:1,
          }
          this.util.restGet('/api_v1/business/project/searchProjectList',params,(res)=>{
                if(res.status==200){
                    if(res.data){
                      this.boxList=res.data
                    }else{
                      this.boxList=[]
                    }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        }
  }
}
</script>

<style scoped>
.bg{
  width: 100%;
  /* height: 100%; */
  /* background: url(../../../assets/indexImg/background.png) no-repeat top center; */
  background: url(../../../assets/image/indexImg/bg.jpg) no-repeat top center;
  position: relative;
  background-size: cover;
  padding-top: 104px;
  box-sizing: border-box;
  min-width: 1300px;
  max-width: 1920px;
  min-height: 768px;
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
.select-proj{
  float: left;
  width: 180px;
  height: 32px;
  margin:10px;
  padding-left:2px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background-image: linear-gradient(left, rgba(20,60,121,0.90) 0%, rgba(3,31,60,0.40) 99%);
}
.select-proj::before{
    position: absolute;
    content: '';
    height: 100%;
    width: 2px;
    background: #44D2FF;
    left: 0px;
    top: 0;
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
.buddha1{
  width: 42px;
  height: 42px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 6px;
  float: left;
  margin-top: 9px;
}
.tabs{
  height: 54px;
  background: url(../../../assets/indexImg/1.png) repeat-x top center;
  background-size: 75% 75%;
  position: relative;
  border: 0 none;
}
.tabs .after,.tabs .before{
  content: '';
  position: absolute;
  width: 300px;
  height: 100%;
  top: 0;left: 0;
  background:  url(../../../assets/indexImg/title.png) no-repeat top left;
  overflow: hidden;
  z-index: 0;

}
.tabs .after{
  left: auto;
  right: 0;
}
.tabs .tabs-left{
  position: absolute;left: 10px;
  z-index: 1;
}
.tabs .tabs-right{
  position: absolute;right: 10px;
  z-index: 1;
}

.tabs .tabs-left>div{
  font-size: 14px;
  float: left;
}
.tabs .tabs-right>div{
  font-size: 14px;
  float: right;
}

.tabs>div>div a{
  display: block;
  margin: 5px 0;
  padding: 3px 11px;
  /* width: 78px; */
  box-sizing: border-box;
}

.tabs .tabs-left>div .active{
  background: url(../../../assets/indexImg/tabs-left.png) no-repeat  top center
}
.tabs .tabs-right>div .active{
  background: url(../../../assets/indexImg/tabs-right.png) no-repeat  top center
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
</style>
<style>
.select-proj .el-input__inner{
    background: transparent;
    border: 0 none;
    height: 32px;
    color: #fff;
    font-size: 14px;
    padding-left:20px;
}
.select-proj .el-select .el-input .el-select__caret{
    color: #fff;
    /* line-height:-1px; */
    margin-top:0px;
}
  .select-proj .el-select>.el-input{
      height:100%;
      width: 100%;
  }
</style>
