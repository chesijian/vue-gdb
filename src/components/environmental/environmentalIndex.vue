<template>
    <div class="proj-box" :style="{paddingTop:createType==1||createType==2?'46px':'336px'}">
        <div class="tabs-box">
            <div class="tabs head_tabs">
                <span @click="changeType(0)" :class="{active:createType==0}">首页</span>
                <span @click="changeType(1)" :class="{active:createType==1}" v-if="sessionUtil.isAllowBtn('sb3_1:view')">检测数据</span>
                <span @click="changeType(2)" :class="{active:createType==2}" v-if="sessionUtil.isAllowBtn('sb3_2:view')">监测点管理</span>
            </div>
        </div>
      <!--//首页-->
        <div  v-if="createType==0" style="height:100%;">
          <div class="num-box">
            <div  class="box-style box-style1">
              <div>
                <h4 >温度</h4>
                <div class="numerical">
                  <div>
                    <img src="../../assets/indexImg/temperature.png" alt="">
                  </div>
                  <span style="margin-left:0">{{boxObj.temp?boxObj.temp:0}}℃</span>
                </div>
              </div>
              <i class="box-style-top-left"></i>
              <i class="box-style-top-right"></i>
              <i class="box-style-bottom-left"></i>
              <i class="box-style-bottom-right"></i>
            </div>
            <div  class="box-style box-style1">
              <div>
                <h4 >PM10(ug/m3)</h4>
                <div class="numerical">
                  <div>
                    <img src="../../assets/indexImg/pm10.png" alt="">
                  </div>
                  <span>{{boxObj.pm10?boxObj.pm10:0}}</span>
                </div>
              </div>
              <i class="box-style-top-left"></i>
              <i class="box-style-top-right"></i>
              <i class="box-style-bottom-left"></i>
              <i class="box-style-bottom-right"></i>
            </div>
            <div  class="box-style box-style1">
              <div>
                <h4 >PM2.5(ug/m3)</h4>
                <div class="numerical">
                  <div>
                    <img src="../../assets/indexImg/pm2.5.png" alt="">
                  </div>
                  <span>{{boxObj.pm25?boxObj.pm25:0}}</span>
                </div>
              </div>
              <i class="box-style-top-left"></i>
              <i class="box-style-top-right"></i>
              <i class="box-style-bottom-left"></i>
              <i class="box-style-bottom-right"></i>
            </div>
            <div  class="box-style box-style1">
              <div>
                <h4 >湿度(%)</h4>
                <div class="numerical">
                  <div>
                    <img src="../../assets/indexImg/humidity.png" alt="">
                  </div>
                  <span>{{boxObj.hum?boxObj.hum:0}}</span>
                </div>
              </div>
              <i class="box-style-top-left"></i>
              <i class="box-style-top-right"></i>
              <i class="box-style-bottom-left"></i>
              <i class="box-style-bottom-right"></i>
            </div>
            <div  class="box-style box-style1">
              <div>
                <h4 >风向</h4>
                <div class="numerical">
                  <div>
                    <img src="../../assets/indexImg/direction.png" alt="">
                  </div>
                  <span style="font-size: 26px;">{{boxObj.wd}}</span>
                </div>
              </div>
              <i class="box-style-top-left"></i>
              <i class="box-style-top-right"></i>
              <i class="box-style-bottom-left"></i>
              <i class="box-style-bottom-right"></i>
            </div>
            <div  class="box-style box-style1">
              <div>
                <h4 >风速(m/s)</h4>
                <div class="numerical">
                  <div>
                    <img src="../../assets/indexImg/RH.png" alt="">
                  </div>
                  <span >{{boxObj.ws?boxObj.ws:0}}</span>
                </div>
              </div>
              <i class="box-style-top-left"></i>
              <i class="box-style-top-right"></i>
              <i class="box-style-bottom-left"></i>
              <i class="box-style-bottom-right"></i>
            </div>
            <div  class="box-style box-style1">
              <div>
                <h4 >TSP(ug/m3)</h4>
                <div class="numerical">
                  <div>
                    <img src="../../assets/indexImg/TSP.png" alt="">
                  </div>
                  <span>{{boxObj.tsp?boxObj.tsp:0}}</span>
                </div>
              </div>
              <i class="box-style-top-left"></i>
              <i class="box-style-top-right"></i>
              <i class="box-style-bottom-left"></i>
              <i class="box-style-bottom-right"></i>
            </div>
            <div  class="box-style box-style1">
              <div>
                <h4 >大气压</h4>
                <div class="numerical">
                  <div>
                    <img src="../../assets/indexImg/atmosphere.png" alt="">
                  </div>
                  <span>{{boxObj.bp?boxObj.bp:0}}</span>
                </div>
              </div>
              <i class="box-style-top-left"></i>
              <i class="box-style-top-right"></i>
              <i class="box-style-bottom-left"></i>
              <i class="box-style-bottom-right"></i>
            </div>
          </div>
          <div class="chart-box">
            <div  class="box-style" style="height:100%;">
              <div style="padding-top:46px;">
                <div style="width:100%;box-sizing:border-box;position:relative;">
                  <div style="overflow:hidden;position:absolute;top:-36px;width:100%">
                    <h4 style="margin-right:20px;float:left">环境分析</h4>
                    <div class="tabs tabs1" style="border:0 none;float:left;width:auto">
                      <span :class="{active:activeStr=='温度'}" @click="changeChart('温度')">温度</span>
                      <span :class="{active:activeStr=='PM10'}" @click="changeChart('PM10')">PM10</span>
                      <span :class="{active:activeStr=='PM2.5'}" @click="changeChart('PM2.5')">PM2.5</span>
                      <span :class="{active:activeStr=='湿度'}" @click="changeChart('湿度')">湿度</span>
                    </div>
                    <div class="select-mouth" style="float:right">
                      <el-date-picker
                        v-model="mouthValue"
                        type="month"
                        style="background:transparent"
                        :editable="false"
                        :clearable="false"
                        prefix-icon="none"
                        clear-icon="none"
                        size="mini"
                        value-format="yyyy-MM"
                        @change="changeChart()"
                        :placeholder="todaystr">
                      </el-date-picker>
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
      <!--//监测数据-->
        <div v-show="createType==1" class="box-style" style="height:100%;">
          <div style="height:100%;padding-bottom: 80px;box-sizing: border-box;">
            <div class="mon_head clear">
              <div class="mon_head_t"><h4>监测点</h4></div>
              <div style="margin-right: 30px;" class="select-box">
                <el-select v-model="value" placeholder="请选择" size="mini" class="select-ele"  @change="changeTypess">
                  <el-option v-for="item in deviceArr"  :key="item.id" :label="item.addressName" :value="item.id">
                  </el-option>
                </el-select>
              </div>
              <div>
                <div style="padding-top: 2px;color:rgba(68,210,255,1);margin-right: 6px;">时间选择</div>
                <div style="width:140px;background-color: rgba(255,255,255,0.2);overflow: hidden;">
                   <el-date-picker
                      v-model="startDate"
                      type="date"
                      style="background:transparent"
                      :editable="false"
                      :clearable="false"
                      prefix-icon="none"
                      clear-icon="none"
                      size="mini"
                      value-format="yyyy-MM-dd"
                      @change="changeType(1)"
                      >
                    </el-date-picker>
                </div>
                <div style="margin:0 10px;padding-top: 5px;">~</div>
                <div style="width:140px;background-color: rgba(255,255,255,0.2);    overflow: hidden;">
                   <el-date-picker
                      v-model="endDate"
                      type="date"
                      style="background:transparent"
                      :editable="false"
                      :clearable="false"
                      prefix-icon="none"
                      clear-icon="none"
                      size="mini"
                      value-format="yyyy-MM-dd"
                      @change="changeType(1)"
                     >
                    </el-date-picker>
                </div>
              </div>
              <button style="float:right;" @click="loadFile()" v-if="sessionUtil.isAllowBtn('sb3_1:export')">导出</button>
            </div>
            <div class="tabls_com" ref="tablebox"  style="height:100%;">
              <el-table :data="tableData" :height="tableHeightNum" border >
                <el-table-column prop="createTime" label="时间"  width="141px">
                </el-table-column>
                <el-table-column prop="pm25" label="PM2.5(ug/m3)" >
                </el-table-column>
                <el-table-column prop="pm10" label="PM10(ug/m3)" >
                </el-table-column>
                <el-table-column prop="noise" label="噪声值(dB)" >
                </el-table-column>
                <el-table-column prop="temp" label="温度(℃)" >
                </el-table-column>
                <el-table-column prop="hum" label="湿度(%)"  >
                </el-table-column>
                <el-table-column prop="wd" label="风向" >
                </el-table-column>
                <el-table-column prop="ws" label="风速(m/s)" >
                </el-table-column>
                <el-table-column prop="tsp" label="TSP(ug/m3)" >
                </el-table-column>
                <el-table-column prop="bp" label="大气压(mbar)" >
                </el-table-column>
              </el-table>
              <div>
                <div style="text-align: right;">
                  <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page.sync="currentPage"
                    :page-size="pageSize"
                    layout="prev, pager, next, jumper"
                    :total="total">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
          <i class="box-style-top-left"></i>
          <i class="box-style-top-right"></i>
          <i class="box-style-bottom-left"></i>
          <i class="box-style-bottom-right"></i>
        </div>

        <div v-if="createType==2"  style="height:100%;width:100%;">
            <gateBrake :equipmentList='equipmentList' @msgOut='loadEquipmentData' :deviceType='1'></gateBrake>
        </div>

    </div>
</template>
<script>
import gateBrake from '../common/gateBrake.vue'
export default {
    data(){
        return {
            equipmentList:[],
            startDate:'',
            deviceUid:'04d30252e69a42c7a57c198c2af4cd80',
            endDate:'',
            todaystr:'',
            mouthValue:'',
            activeStr:'温度',
            createType:0,
            value:'',
            value3:'',
            boxObj:{
                ws:0,
                temp:0,
                hum:0,
                pm10:0,
                pm25:0,
                wd:0,
                tsp:0,
                bp:0,
            },
          tableData: [],
          deviceArr: [],
          pageSize:10,
          pageIndex:1,
          total:0,
          tableHeightNum:0,
          currentPage:1
        }
    },
    components:{
      gateBrake
    },
    created(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'))
      let date=new Date()
      var sd=date.format('yyyy-MM')
      this.startDate=sd+'-01'
      this.endDate=date.format('yyyy-MM-dd')
    },
    mounted(){
        var date=new Date()
        this.todaystr=date.format('yyyy-MM')
        this.mouthValue=date.format('yyyy-MM')
        this.loadData()

    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
            this.changeType(this.createType)
        }
    },
    computed:{
    },
    methods:{
       loadFile(){
        window.open(this.util.getBaseUrl()+'/api_v1/modules/dust/exportDustRecords?projUid='+this.$store.state.selectProjectObj.id+'&deviceUid='+this.deviceUid+'&startDate='+this.startDate+'&endDate='+this.endDate+'&type=1&access_token='+this.sessionUtil.getAccessToken())
      },
      handleCurrentChange(val){
        this.pageIndex=val;
        this.jianceshuju();
      },
      loadEquipmentData(){
        this.changeType(this.createType)
      },
      pipeiwind(obj){
        var arr1=[
          {num:0,str:'东北偏北'},
          {num:1,str:'东北'},
          {num:2,str:'东北偏东'},
          {num:3,str:'正东'},
          {num:4,str:'东南偏东'},
          {num:5,str:'东南'},
          {num:6,str:'东南偏南'},
          {num:7,str:'正南'},
          {num:8,str:'西南偏南'},
          {num:9,str:'西南'},
          {num:10,str:'西南偏西'},
          {num:11,str:'正西'},
          {num:12,str:'西北偏西'},
          {num:13,str:'西北'},
          {num:14,str:'西北偏北'},
          {num:15,str:'正北'},
          {num:16,str:''},
          ]
          for (let i = 0; i < arr1.length; i++) {
              if(obj.wd==arr1[i].num){
                obj.wd=arr1[i].str
              }
          }
      },
      changeTypess(id){
        this.deviceUid=id
        this.value=id
        this.jianceshuju()
      },
      changeChart(str){
        if(str){
          this.activeStr=str;
        }
        var times=this.mouthValue==''?this.todaystr:this.mouthValue
          let params={
                projUid:this.$store.state.selectProjectObj.id,
                type:this.activeStr=='温度'?'temp':(this.activeStr=='PM10'?'pm10':(this.activeStr=='PM2.5'?'pm25':'hum')),
                month:times
            }
            this.util.restGet('/api_v1/modules/dust/records/report',params,(res)=>{
              console.log(res)
                if(res.status==200){
                  if(res.data){
                    this.drawCharts(res.data)
                  }else{
                    this.drawCharts([])
                  }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
      },
      changeType(num){
        this.createType=num;
        if(num==0){
          let params={
                projUid:this.$store.state.selectProjectObj.id,
            }
            this.util.restGet('/api_v1/modules/dust/records/last',params,(res)=>{
                if(res.status==200){
                   if(res.data){
                    this.changeChart('温度')
                    this.pipeiwind(res.data)
                    this.boxObj=res.data
                   }else{
                      this.changeChart('温度')
                      this.pipeiwind(res.data)
                      this.boxObj=res.data
                   }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        }else if(num==1){
          this.$nextTick(()=>{
            this.tableHeightNum=this.$refs.tablebox.offsetHeight
            console.log(this.tableHeightNum)
          })
            this.util.restGet('/api_v1/modules/dust/records/address',{projUid:this.$store.state.selectProjectObj.id,},(res)=>{
                console.log(res)
                if(res.status==200){
                  if(res.data){
                    this.deviceArr=res.data
                    this.deviceUid=res.data[0].id
                    this.value=res.data[0].id
                  }else{
                    this.deviceArr=[]
                    this.deviceUid=''
                    this.value=''
                  }
                    this.jianceshuju()
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        }else if(num==2){
        let params = {
          type: '1',
          pageNum: 1,
          pageSize: 100000,
        }
        params.projUid = this.$store.state.selectProjectObj.id;
        var _this = this
        this.util.restGet('/api_v1/modules/check_devices', params, (res) => {
          console.log(res)
          if (res.status == 200) {
           if(res.data&&res.data.length>0){
              for (let i = 0; i < res.data.length; i++) {
                res.data[i].enable==1?res.data[i].enable=true:res.data[i].enable=false
              }
              this.equipmentList=res.data
           }else{
              this.equipmentList=[]
           }
          } else {
            this.util.error(res.errorMsg)
          }
        })
        }
      },
      jianceshuju(){
         let params={
                projUid:this.$store.state.selectProjectObj.id,
                deviceUid:this.deviceUid,
                startDate:this.startDate,
                endDate:this.endDate,
                pageSize:this.pageSize,
                pageIndex:this.pageIndex,
            }
            this.util.restGet('/api_v1/modules/dust/records',params,(res)=>{
                if(res.status==200){
                  if(res.data){
                    for (let i = 0; i < res.data.length; i++) {
                    this.pipeiwind(res.data[i])
                  }
                    this.tableData=res.data;
                    this.total=res.totalCount;
                  }else{
                    this.tableData=[]
                  }

                }else{
                    this.util.error(res.errorMsg)
                }
            })
      },
        loadData(){
            this.changeType(0)
        },
        drawCharts(arr){
          var dateArr=[]
          var valueArr=[]
        if(arr&&arr.length>0){
          for (let i = 0; i < arr.length; i++) {
            if(arr[i].DATE_){
              dateArr.push(arr[i].DATE_);
            }else{
              dateArr.push('');
            }
            if(arr[i].VALUE_){
              valueArr.push(arr[i].VALUE_);
            }else{
              valueArr.push('');
            }
          }
        }
        // console.log(dateArr)
        // console.log(valueArr)
            var myChart = this.$echarts.init(document.getElementById('myChart'))
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
                height:'70%',
                backgroundColor:"transparent",
                borderColor:"#fff",
                tooltip:{                        //坐标系特定的 tooltip 设定
                  backgroundColor:"transparent",        //标题背景色
                  borderColor:"#ccc",         //边框颜色
                },
              }],
              series: [{
                data: valueArr,
                type: 'line',
                color:['white'],
              }]
            }
            myChart.setOption(option)
      }
    }
}
</script>

<style scoped>
    .proj-box{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0 10px ;
        color: #fff;
        font-size: 14px;
        padding-top: 336px;
        position: relative;
        overflow: auto;
    }
    .head_tabs span{
      margin-right: 12px;
    }
    .tabs-box{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 10px;
        box-sizing: border-box;
    }
    .tabs{
        width: 100%;
        height: 36px;
        border: 1px solid #44D2FF ;
        box-sizing: border-box;
        padding: 0 10px;
        text-align: center;
    }
     .tabs>span{
        width: 78px;
        float: left;
        height: 26px;
        line-height: 26px;
        margin-top: 4px;
        cursor: pointer;
        margin-bottom: 10px;
    }
    .tabs>.active{
        background: url(../../assets/indexImg/select.png) no-repeat  top center;
    }
    .box-style1{
        height:145px;width:25%;padding-right:11px;float: left;
    }
    .box-style1:nth-child(4n){
        padding-right:0;
    }
    .box-style1 .box-style-top-right,.box-style1 .box-style-bottom-right{
        right: 10px;
    }
    .box-style1:nth-child(4n) .box-style-top-right,.box-style1:nth-child(4n) .box-style-bottom-right{
        right: 0;
    }
   .box-style1 .numerical{
       height: 72px;
       line-height: 72px;
   }
   .box-style1 .numerical >div{
       width: 50%;
       float: left;
       text-align: right;
       box-sizing: border-box;
       padding-right: 10px;
   }
   .box-style1 .numerical span{
        font-size: 40px;
        color: #FFFFFF;
        vertical-align: middle;
        float: left;
        margin-left: 10px
   }
   .num-box{
       overflow: hidden;
       position: absolute;
       top: 46px;
       width: 100%;
       left: 0;
       padding: 0 10px;
       box-sizing: border-box;
   }
   .chart-box{
       width: 100%;
       height: 100%;
   }
   .tabs1 span{
       margin-top: 0;
   }
   .select-mouth{
        width: 90px;
        height: 24px;
        overflow: hidden;
        padding: 0;
        box-sizing: border-box;
        background: rgba(255,255,255,0.20);
        position: relative;
   }
    .select-mouth::after{
        content: '';
        position: absolute;
        background: url(../../assets/indexImg/more.png) no-repeat  top center;
        width: 7px;
        height: 4px;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        z-index: 0;
    }

  /*//检测数据style*/
    .monitoring{
      width:100%;
      height:100%;
      box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
      box-sizing: border-box;
      padding:10px 14px;
    }
    .mon_head{
      margin-bottom: 15px;
    }
    .mon_head div{
      float: left;
    }
    .mon_head_t{
      margin-right: 20px;
    }
    .mon_head_t h4{
      margin-bottom: 0;
    }
    .clear::after{
      content:"";
      height:0;
      line-height: 0;
      display: block;
      visibility: hidden;
      clear: both;
    }


  .stration_title_left{
    float: left;
  }
    .stration_title_right{
      float: right;
    }
  .stration_title_right button{
    margin-left: 10px;
  }
  .stration_text_l{
    float: left;
  }
  .stration_text_l div{
    line-height: 24px;
  }
  .Namekey div{
    color:rgba(68,210,255,1);
  }
    .stration_text_r{
      float: right;
    }
  .information{
    text-align: left;
    color:#fff;
    font-size: 14px;
    padding-top: 1px;
    margin-left: 10px;
    width: 198px;
  }
  .information div{
    line-height: 24px;
  }

</style>

<style>

/* .el-input{
  width:140px;
  height:24px;
}
.el-select .el-input.is-focus .el-input__inner{
  height:24px;
}

.el-select>.el-input{
  background-color: rgba(255,255,255,0.2);
}
.el-input__prefix, .el-input__suffix{
  top:8px;
}
.el-input__inner{
  height:24px;
  color:rgba(68,210,255,1);
}
.bg .el-table th.is-leaf{
  color:rgba(68,210,255,1);
  text-align: center;
}
.bg .el-table td{
  text-align: center;
  color:rgba(255,255,255,1);
}
.el-switch.is-checked .el-switch__core{
  background-color: rgba(68,210,255,1);
} */
</style>
