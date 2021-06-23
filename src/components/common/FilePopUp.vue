<template>
  <div class="popup">
    <div class="mask"></div>
    <div class="pop_Text">
      <div class="pop_Text_title">目录</div>
      <div class="pop_Text_con clear">
        <span class="titie">文件名称</span>
        <span class="con_text"><input type="text"></span>
        <span class="open_btn"><img src="../../assets/indexImg/sheng.png" width="14px" alt=""></span>
      </div>
      <div class="Jurisdiction">成员权限</div>

      <div class="foot">
        <button>关闭</button>
        <button>保存</button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data(){
      return{

      }
    }
  }
</script>

<style scoped>
.popup{
  position: absolute;
  width:100%;
  height:119%;
  z-index: 99;
  left:0;
  top:-104px;
}
.mask{
  width:100%;
  height:100%;
  z-index: 100;
  opacity: 0.7;
  background: rgba(0,0,0,1);
}
.pop_Text{
  width:420px;
  height:272px;
  box-sizing: border-box;
  position: absolute;
  top:0;
  left:0;
  bottom:0;
  right:0;
  margin: auto;
  box-shadow: 0 0 15px 0 rgba(68,210,255,1);
  background-color: rgba(255,255,255,0.2);
  padding:10px 20px;
  text-align: left;
}
.pop_Text_title{
  font-size: 18px;
  line-height: 25px;
  color:rgba(68,210,255,1);
  margin-bottom: 19px;
}
.clear::after{
  content:"";
  height:0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.open_btn{

}
.pop_Text_con{
  margin-bottom: 29px;
  position: relative;
}
.pop_Text_con .open_btn{
  position: absolute;
  right:5px;
  top:10px;
}
.titie{
  display: inline-block;
  padding-top: 10px;
  color:#fff;
  font-size: 14px;
}
.con_text{
  float: right;
  display: inline-block;
}
.con_text input{
  width:290px;
  height:36px;
  border:none;
}
.Jurisdiction{
  font-size: 14px;
  color:#fff;
}
.foot button{
  margin-left: 20px;
}
.foot{
  text-align: right;
  margin-top: 90px;
}
</style>
