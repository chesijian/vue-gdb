<template>
  <div class="proj-box" style="padding: 10px 0 0 0">
    <div class="proj-box" style="padding:0 ;">
      <div style="height:30%;width:100%">
        <div style="height:100%;width:33.3333%;padding-right:10px;box-sizing:border-box;float:left;">
          <div class="box-style" style="height:100%;">
            <div class="today" style="position:relative;padding-top:34px;">
              <h4 style="position:absolute;top:10px;left:10px;">今日</h4>
              <div style="display: table;height:100%;width:100%;">
                <div style="display: table-cell;vertical-align: middle;width:100%;">
                  <p class="time">{{time}}</p>
                  <p class="toDate">{{toDate}}</p>
                </div>
              </div>
            </div>
            <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div>
        </div>
        <div style="height:100%;width:33.3333%;padding-right:10px;box-sizing:border-box;float:left;">
          <div class="box-style" style="height:100%;">
            <div class="check-in" style="position:relative;padding-top:34px;">
              <h4 style="position:absolute;top:10px;left:10px;">出勤</h4>
              <div style="display: table;height:100%;width:100%;">
                <div style="display: table-cell;vertical-align: middle;width:100%;">
                   <p style="margin-top:0px;"><span></span><span>进场</span><span>在场</span><span>退场</span></p>
                  <p><span>今日</span><span>{{veiwObj.tIn}}</span><span>{{(veiwObj.tIn-0)-(veiwObj.tOut-0)}}</span><span>{{veiwObj.tOut}}</span></p>
                  <p><span>昨日</span><span>{{veiwObj.yIn}}</span><span>{{(veiwObj.yIn-0)-(veiwObj.yOut-0)}}</span><span>{{veiwObj.yOut}}</span></p>
                </div>
              </div>
            </div>
            <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div>
        </div>
        <div style="height:100%;width:33.3333%;box-sizing:border-box;float:left;">
          <div class="box-style" style="height:100%;">
           <div class="statistics" style="position:relative;padding-top:34px;">
              <h4 style="position:absolute;top:10px;left:10px;">人数</h4>
              <div style="display: table;height:100%;width:100%;">
                <div style="display: table-cell;vertical-align: middle;width:100%;">
                  <div class="circle-left" style="text-align:right;padding-right:20px">
                      <el-progress type="circle" :width="90" :stroke-width="10" :percentage="veiwObj.percentage"></el-progress>
                  </div>
                  <div class="circle-right">
                      <p>现场实时人数<span>{{(veiwObj.tIn-0)-(veiwObj.tOut-0)}}</span></p>
                      <p>项目施工人数<span>{{veiwObj.projWorkerCount}}</span></p>
                  </div>
                </div>
              </div>
              
          </div>
            <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div>
        </div>
      </div>
      <div style="height:35%;width:100%">
          <div class="box-style" style="height:100%;width:100%">
             <div class="locale">
                <h4>考勤</h4>
                <div class="locale-img-box" @mouseover="arrowShow=true" @mouseout="arrowShow=false">
                    <img v-if="arrowShow&&localeMsgList.length>0" src="../../assets/indexImg/left_arrow.png" width="20px" style="left:10px" @click="addLeft()"  alt="">
                    <img v-if="arrowShow&&localeMsgList.length>0" src="../../assets/indexImg/right_arrow.png" width="20px"  style="right:10px" @click="prveNum()"  alt="">
                    <div  class="locale-msg-box">
                        <div  v-if="localeMsgList.length<=0"  class="no-msg">暂无现场信息</div>
                        <div class="msg-list-box" 
                            v-if="localeMsgList.length>0"
                            :style="{transform:'translateX('+leftNum+'px)',width:(localeMsgList.length*214+40)+'px'}">
                            <div v-for="(item,key) in localeMsgList" :key="key" class="msg-list" >
                                <img v-if="item.id!=undefined" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
                                <i v-if="item.id==undefined"></i>
                                <p>{{item.name}}&nbsp;{{item.workTypeCode}}&nbsp;{{item.direction==1?'进场':'出场'}}{{item.time}}</p>
                            </div>
                            <!-- <div class="msg-more">点击了解更多</div> -->
                        </div>
                    </div>
                </div>
            </div>
            <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div>
      </div>
      <div style="height:35%;width:100%">
          <div class="box-style" style="height:100%;width:100%">
            <div style="padding-top:46px;">
                <div style="width:100%;box-sizing:border-box;position:relative;">
                  <div style="overflow:hidden;position:absolute;top:-36px;width:100%">
                    <h4 style="margin-right:20px;float:left">人员分析</h4>
                    <div class="tabs tabs1" style="border:0 none;float:left;width:auto">
                      <span :class="{active:activeStr=='进场'}" @click="changeChart('进场')">进场</span>
                      <span :class="{active:activeStr=='在场'}" @click="changeChart('在场')">在场</span>
                      <span :class="{active:activeStr=='退场'}" @click="changeChart('退场')">退场</span>
                    </div>
                  </div>
                </div>
                <div style="height:100%;width:100%">
                  <div id="myChart" style="height:100%;width:100%"></div>
                </div>
              </div>
            <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        arrowShow:false,
        activeStr:'进场',
        leftNum:0,
        stepNum:0,
        BoxWidth:0,
        time:'',
        toDate:'',
        veiwObj:{},
        localeMsgList:[],
      }
    },
     watch:{
        '$store.state.selectProjectObj.id':function(val,oldVal){
            this.loadData()
        }
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.getMyTime();
    },
    mounted () {
      var box=document.querySelector('.locale-msg-box')
      this.BoxWidth=parseInt(window.getComputedStyle(box).width)
      this.loadData()
    },
    methods: {
      changeChart(str){
        this.activeStr=str;
        var dateArr=[]
        var valueArr=[]
        if(this.veiwObj.personnelAnalysisList&&this.veiwObj.personnelAnalysisList.length>0){
          var arr=this.veiwObj.personnelAnalysisList;
          for (let i = 0; i < arr.length; i++) {
            dateArr.push(arr[i].workTypeCode)
            if(str=='进场'){
              valueArr.push(arr[i].inCount)
            }else if(str=='在场'){
              valueArr.push(arr[i].onCount)
            }else if(str=='退场'){
              valueArr.push(arr[i].outCount)
            }
          }
        }
        var myChart = this.$echarts.init(document.getElementById('myChart'))
        console.log(this.$echarts.graphic)
            var option = {
              xAxis: {
                type: 'category',
                data:dateArr,
                axisLine:{
                  lineStyle:{
                    color:"rgba(68,210,255,0.5)"
                  }
                }
              },
              yAxis: {
                type: 'value',
                minInterval: 1,
                axisLine:{
                  lineStyle:{
                    color:"rgba(68,210,255,0.5)"
                  }
                }
              },
              grid:[{
                top:'10px',
                left:'30px',
                right:'auto',
                width:'97%',
                height:'80%',
                backgroundColor:"transparent",
                borderColor:"#fff",
                tooltip:{                        //坐标系特定的 tooltip 设定
                  backgroundColor:"transparent",        //标题背景色
                  borderColor:"#ccc",         //边框颜色
                },
              }],
              series: [{
                data: valueArr,
                type: 'bar',
                barMaxWidth:55,
                itemStyle:{
                  normal:{
                     color:new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: 'rgba(6,252,255,1)'},{offset: 1, color: 'rgba(32,165,255,1)'}]),
                  }
                },
               
              }]
            }
            myChart.setOption(option)
      },
        addLeft(){
            var box1=document.querySelector('.msg-list-box')
            if(this.BoxWidth>parseInt(window.getComputedStyle(box1).width)){
                return
            }
            if(this.stepNum==0){
                return
            }
            var num=Math.round(this.BoxWidth/214)
             if(this.stepNum<((-this.localeMsgList.length)+num)){
                this.stepNum=this.stepNum+2
                this.leftNum=this.stepNum*214 
            }else{
                this.stepNum++
                this.leftNum=this.stepNum*214 
            }
            //   console.log(this.stepNum)
        },
        prveNum(){
              var box1=document.querySelector('.msg-list-box')
            if(this.BoxWidth>parseInt(window.getComputedStyle(box1).width)){
                return
            }
            var num=Math.round(this.BoxWidth/214)
            if(this.stepNum<((-this.localeMsgList.length)+num+2)){
                this.stepNum=(-this.localeMsgList.length)+2
                this.leftNum=-(this.localeMsgList.length*214)+this.BoxWidth
            }else{
                this.stepNum--
                this.leftNum=this.stepNum*214
            }
        },
     getMyTime(){
       var _this=this
       setInterval(function(){
         var times=new Date()
         var hour=times.getHours()
         var minutes=times.getMinutes()
         var Seconds=times.getSeconds()
         if(hour<10) hour='0'+hour
         if(minutes<10) minutes='0'+minutes
         if(Seconds<10) Seconds='0'+Seconds
         if(hour==0) hour='00'
         if(minutes==0) minutes='00'
         if(Seconds==0) Seconds='00'
         _this.time=hour+':'+minutes+':'+Seconds;
        var date=new Date()
        _this.toDate=date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'+'星期'+date.formatWeek();
       },1000)
     },
      loadData () {
        var params={
          projUid:this.$store.state.selectProjectObj.id
        }
         this.util.restGet('/api_v1/modules/real/home_page',params,(res)=>{
            if(res.status==200){
              // console.log(res.data)
              if(res.data){
                if((res.data.tIn-0)-(res.data.tOut-0)==0){
                    res.data.percentage=0
                }else{
                    let a=parseInt((((res.data.tIn-0)-(res.data.tOut-0))/res.data.projWorkerCount)*100).toFixed(2)
                    res.data.percentage = (a-0);
                }
                this.veiwObj=res.data
                if(this.veiwObj.workerAttendanceList){
                  this.localeMsgList=this.veiwObj.workerAttendanceList
                }else{
                  this.localeMsgList=[]
                }
                this.changeChart(this.activeStr)
              }else{
                this.veiwObj={}
              }
            }else{
                this.util.error(res.errorMsg)
            }
        })
      },
    }
  }
</script>

<style scoped>
  .proj-box {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 10px;
    color: #fff;
    font-size: 14px;
    padding-top: 46px;
    position: relative;
    overflow: auto;
  }
  .today{
    color: #fff;

  }
  .today .time{
    font-size: 50px;
    margin-bottom: 6px;
  }
   .today .toDate{
     font-size: 18px;
   }
  .check-in p span{
    width: 81px;
    display: inline-block;
    margin-bottom: 20px;
    font-size: 18px;
  }
  .check-in p span{
    text-align: center;
    margin-right: 19px;
  }

  .check-in p span:first-child{
    text-align: right;
    margin-right: 0;
  }
   .statistics .circle-left, .statistics .circle-right{
        float: left;
        width: 50%;
        text-align: left;
        box-sizing: border-box;
    }
    .circle-right p span{
        font-size: 18px;
        color: #FFFFFF;
        display: block;
        margin-top: 5px;
    }
       .locale {
        padding-top: 44px;
        position: relative;
    }
    .locale  h4{
        position: absolute;top: 10px;
    }
    .locale-img-box{
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
    .locale-img-box>img{
        position: absolute;
        top: 50%;
        z-index: 2;
    }
    .locale-msg-box{
        width:100%;overflow:hidden;height:100%
    }
      .no-msg{
        width:100%;color:#fff;font-size:26px;text-align:center;height:100%
    }
    .msg-more{
        background:#ECECEC;
        height:100%;padding:10px;float:left;width:40px;box-sizing:border-box;text-align:center;color:#999;
    }
    .msg-list-box{
        height: 100%;
        transition:all 0.5s;
    }
    .msg-list {
        height: 100%;
        width: 200px;
        margin-right: 14px;
        float: left;
        position: relative;
    }
    .msg-list p{
        background:rgba(68,210,255,0.5);
        font-size: 14px;
        height: 24px;
        line-height: 24px;
        color: #FFFFFF;
        position: absolute;
        width: 100%;
        bottom: 0;
    }
    .msg-list i{
        width: 100%;
        height: 100%;
        background: #e7e7e7 ;
        display: inline-block;
        position: relative;
    }
    .msg-list i::after{
        background: url(../../assets/indexImg/nonePic.png) no-repeat center ;
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
</style>

<style>
  /* .select-mouth .el-input__inner {
    background: transparent;
    border: 0 none;
    height: 32px;
    color: #44D2FF;
    font-size: 14px;
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .select-mouth .el-select .el-input .el-select__caret {
    color: #44D2FF;
    line-height: 20px;
  }

  .el-checkbox__inner {
    display: inline-block;
    position: relative;
    border: 1px solid rgba(68, 210, 255, 1);
    border-radius: 2px;
     -webkit-box-sizing: border-box;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: rgba(68, 210, 255, 0.2);
    z-index: 1;
     -webkit-transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
    transition: border-color .25s cubic-bezier(.71, -.46, .29, 1.46), background-color .25s cubic-bezier(.71, -.46, .29, 1.46);
  }

  .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: rgba(68, 210, 255, 0.2);
    border-color: rgba(68, 210, 255, 1);
  }

  .el-checkbox__input.is-disabled .el-checkbox__inner {
    background-color: rgba(68, 210, 255, 0.2);
    border-color: rgba(68, 210, 255, 1);
    cursor: not-allowed;
  } */
</style>
