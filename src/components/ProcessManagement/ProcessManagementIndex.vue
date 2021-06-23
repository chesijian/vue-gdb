<template>
  <div class="proj-box">
    <div class="page-content-h-3">
      <div style="width:339px;float:left;padding-right:10px;box-sizing:border-box">
        <div class="box-style" style="height:100%">
          <div class="statistics">
            <h4 style="margin-bottom:12px">施工率</h4>
            <div class="circle-left" style="text-align:right;padding-right:20px">
              <el-progress type="circle" :width="90" :stroke-width="10" :percentage="statisticCountObj.totalPercent"></el-progress>
            </div>
            <div class="circle-right">
              <p>施工任务总数<span>{{statisticCountObj.totalNum0}}</span></p>
              <p>已施工<span>{{statisticCountObj.completeNum}}</span></p>
            </div>
          </div>
          <i class="box-style-top-left"></i>
          <i class="box-style-top-right"></i>
          <i class="box-style-bottom-left"></i>
          <i class="box-style-bottom-right"></i>
        </div>
      </div>
      <div style="width:339px;float:left;padding-right:10px;box-sizing:border-box">
        <div class="box-style" style="height:100%;">
          <div class="statistics" >
            <h4 style="margin-bottom:12px">施工合格率</h4>
            <div class="circle-left" style="text-align:right;padding-right:20px">
              <el-progress type="circle" :width="90" :stroke-width="10" :percentage="statisticCountObj.onTimePercent1"></el-progress>
            </div>
            <div class="circle-right">
              <p>完成施工任务数<span>{{statisticCountObj.totalNum1}}</span></p>
              <p>已验收<span>{{statisticCountObj.completeOnTimeNum}}</span></p>
            </div>
          </div>
          <i class="box-style-top-left"></i>
          <i class="box-style-top-right"></i>
          <i class="box-style-bottom-left"></i>
          <i class="box-style-bottom-right"></i>
        </div>
      </div>
        <div class="box-style" style="width:329px;float:left">
          <div class="statistics">
            <h4 style="margin-bottom:12px">检查整改完结率</h4>
            <div class="circle-left" style="text-align:right;padding-right:20px">
              <el-progress type="circle" :width="90" :stroke-width="10" :percentage="statisticCountObj.onTimePercent"></el-progress>
            </div>
            <div class="circle-right">
              <p>问题数<span>{{statisticCountObj.totalNum2}}</span></p>
              <p>整改数<span>{{statisticCountObj.completeOnTimeNum2}}</span></p>
            </div>
          </div>
          <i class="box-style-top-left"></i>
          <i class="box-style-top-right"></i>
          <i class="box-style-bottom-left"></i>
          <i class="box-style-bottom-right"></i>
        </div>

      <div class="selectTime" style="text-align: right;">
        <span style="width:50px;">
          <el-select v-model="selectType">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </span>
        <span>
          <span v-if="selectType=='月'">
            <el-date-picker @change="loadStatisticData"
                            v-model="statisticsDate"
                            type="month"
                            style="background:transparent"
                            :editable="false"
                            :clearable="false"
                            prefix-icon="none"
                            clear-icon="none"
                            size="mini"
                            value-format="yyyy-MM"
                            placeholder="今天">
            </el-date-picker>
          </span>
            <span class="yearSty" v-if="selectType=='年'">
              <el-date-picker
                @change="loadStatisticData"
                v-model="statisticsDate"
                type="year"
                placeholder="选择年">
            </el-date-picker>
            </span>
        </span>
      </div>
    </div>
    <div class="page-content-h-4" style="height:70%;">
      <div class="box-style">
        <div class="content-box">
          <div class="ChartHead">
            <div><i style="background: rgba(240,139,0,1)"></i><span>施工任务总数</span></div>
            <div><i style="background: red"></i><span>验收合格任务数</span></div>
            <div><i style="background: rgba(68,210,255,1)"></i><span>整改完结数</span></div>
          </div>
          <div style="height:100%;width:100%;">
            
            <!-- <div id="myChart" style="height:100%;width:100%"></div> -->
            <ve-line :grid="grid" :colors="colors" :data="chartData" :extend="extend" :legend-visible="false" ></ve-line>
          </div>
        </div>
        <i class="box-style-top-left"></i>
        <i class="box-style-top-right"></i>
        <i class="box-style-bottom-left"></i>
        <i class="box-style-bottom-right"></i>
      </div>
    </div>
    <!--<div class="page-content-h-3" style="height:35%;">-->
      <!--<div class="box-style">-->
        <!--<div class="content-box" style="padding-top: 46px;">-->
          <!--<div class="header_tong">-->
            <!--<h4>-->
              <!--<span style="float:left">区域统计</span>-->
            <!--</h4>-->
            <!--<div class="header_status">-->
              <!--<div><i style="background: rgba(240, 139, 0,1)"></i><span>未施工</span></div>-->
              <!--<div><i style="background: rgba(242, 109, 95,1)"></i><span>施工中</span></div>-->
              <!--<div><i style="background: rgba(91, 198, 201,1)"></i><span>完成施工</span></div>-->
              <!--<div><i style="background: rgba(92, 154, 212,1)"></i><span>验收</span></div>-->
            <!--</div>-->
          <!--</div>-->

          <!--<div class="Statistics">-->
            <!--<div class="Statistics_textall">-->
              <!--<div style="width:100%;display: flex"  v-for="item in Statis">-->
                <!--<div>-->
                  <!--<span style="text-align: center;width:50px;display: inline-block;font-size: 11px;" @click="btnchild(item)">{{item.partName}}</span>-->
                <!--</div>-->

                <!--<div class="Statistics_con" :style="{borderBottom:item.border}">-->
                  <!--<span v-for="child in item.children" :style="{background:child.backColor}">{{child.name}}</span>-->
                <!--</div>-->
              <!--</div>-->
              <!--</div>-->
          <!--</div>-->
        <!--</div>-->
        <!--<i class="box-style-top-left"></i>-->
        <!--<i class="box-style-top-right"></i>-->
        <!--<i class="box-style-bottom-left"></i>-->
        <!--<i class="box-style-bottom-right"></i>-->
      <!--</div>-->
    <!--</div>-->
  </div>
</template>
<script>
  export default {
    data(){
      this.extend = {
            'xAxis.0.axisLabel.color': 'rgba(68,210,255,0.5)',//x轴文本颜色
            'yAxis.0.axisLabel.color': "rgba(68,210,255,0.5)",
            'yAxis.0.axisLine.lineStyle.color': "rgba(68,210,255,0.5)",
        }
        this.grid = {
            // show: true,
            top: 38,
            left: 10,
        }
      return {
        chartData: {},
        colors: ["rgba(240,139,0,1)", "red", "rgba(68,210,255,1)"],
        activeChartStr:'percent',
        activeTableStr:'percent',
        statisticsDate:new Date().format("yyyy-MM"),
        statisticCountObj:{},
        overviewObj:{
          taskNum:10,
          problemNum:20,
          recordNum:10,
        },
        options: [{
          value: '月',
          label: '月'
        },{
          value: '年',
          label: '年'
        }],
        selectType:'月',
        dateArr: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        ConstructionRate:[120, 200, 150, 80, 70, 110, 130],
        PassRate:[140, 200, 150, 80, 70, 110, 130],
        RectificationRate:[100, 200, 150, 80, 70, 110, 130],
        numberArr:[],
        percentArr:[],
        projObj:{},
        tableHeightNum:0,
        Statis:[
        ],
        valueArr:[120, 200, 150, 80, 70, 110, 130],
        areaObjId:'',
        dataArr:[]
      }
    },
    created(){

    },
    mounted(){
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.loadStatisticData();
      this.loadgetTrackData();
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.loadStatisticData();
        this.loadgetTrackData();
      }
    },
    methods:{
      loadStatisticChartsData(){

        if(this.selectType=='月'){
          this.statisticsDate=new Date(this.statisticsDate).format("yyyy-MM")
        }else{
          this.statisticsDate=new Date(this.statisticsDate).format("yyyy")
        }
        let params={
          projUid:this.$store.state.selectProjectObj.id,
          date:this.statisticsDate
        };
        this.dateArr=[];
        this.ConstructionRate=[];
        this.PassRate=[];
        this.RectificationRate=[];
        this.statisticCountObj={};
        this.util.restGet('/api_v1/business/process/searchHomeMessageByProjUid',params,res=>{
          if(res.status==200){
            if(res.data){
              this.statisticCountObj.totalPercent=res.data.constructionRates;
              this.statisticCountObj.totalNum0=res.data.construction;
              this.statisticCountObj.completeNum=res.data.alreadyConstruction;

              this.statisticCountObj.onTimePercent1=res.data.qualifiedRates;
              this.statisticCountObj.totalNum1=res.data.accompConstruction;
              this.statisticCountObj.completeOnTimeNum=res.data.checkCount;

              this.statisticCountObj.onTimePercent=res.data.abarbeitungRates;
              this.statisticCountObj.totalNum2=res.data.issueCount;
              this.statisticCountObj.completeOnTimeNum2=res.data.abarbeitungCount;
              let rows=[];
              for(let k in res.data.list){
                this.dateArr.push(k)
                let num=0
                let num1=0
                let num2=0
                for(let i=0;i<res.data.list[k].length;i++){
                  let arr=res.data.list[k];
                    num++;
                  if(arr[i].status==3){
                    num1++
                  }else if(arr[i].abarbe=='abarbe'){
                    num--
                    num2++
                  }
                }
                let rowObj={
                  '日期':k,
                  '施工任务总数':num,
                  '验收合格任务数':num1,
                  '整改完结数':num2,
                }
                rows.push(rowObj);
                // console.log(num1)
                // this.ConstructionRate.push(num)
                // this.PassRate.push(num1)
                // this.RectificationRate.push(num2)
              }
              this.chartData ={
                columns: ['日期', '施工任务总数', '验收合格任务数', '整改完结数'],
                rows: rows
              }
              this.$forceUpdate();
            }
          }
        },null,false);
        // this.drawCharts();
      },
      loadStatisticData(){//获取统计数据
        this.loadStatisticChartsData();

      },
      drawCharts(){
        var myChart = this.$echarts.init(document.getElementById('myChart'))
        var option = {
          xAxis: {
            type: 'category',
            data:this.dateArr,
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
            height:'85%',
            backgroundColor:"transparent",
            borderColor:"#fff",
            tooltip:{                        //坐标系特定的 tooltip 设定
              backgroundColor:"transparent",        //标题背景色
              borderColor:"#ccc",         //边框颜色
            },
          }],
          series: [{
            data: this.ConstructionRate,
            type: 'line',
            barMaxWidth:55,
            color:['rgba(240,139,0,1)']
          },{
            data: this.PassRate,
            type: 'line',
            barMaxWidth:55,
            color:['red']
          },{
            data: this.RectificationRate,
            type: 'line',
            barMaxWidth:55,
            color:['rgba(68,210,255,1)']
          }]
        }
        myChart.setOption(option)
      },
      btnchild(item){
        console.log(item)
        if(item.parentUid=='root'){
          this.areaObjId=item.id;
          this.getTrackData();
        }else{
          return
        }
      },
      getTrackData(){
        this.Statis=[]
        let params={
          id:this.areaObjId
        };
        this.util.restGet('/api_v1/business/processWeChat/searchAreaProcess',params,res=>{
          if(res.status==200){
            for(let i in res.data.data){
              let obj={};
              obj.partName=i;
              res.data.data[i].map(item=>{
                if(item.status==0){
                  item.backColor='rgba(240, 139, 0,1)'
                }else if(item.status==1){
                  item.backColor='rgba(242, 109, 95,1)'
                }else if(item.status==3){
                  item.backColor='rgba(91, 198, 201,1)'
                }else if(item.status==2){
                  item.backColor='rgba(92, 154, 212,1)'
                }else{
                  item.backColor='#ccc'
                }
              })
              obj.children=res.data.data[i];
              this.Statis.push(obj);
            }
            this.Statis.map((item,index,salf)=>{
              salf[salf.length-1].border='1px solid rgba(68,210,255,0.5)'
            })
            console.log(this.Statis)
          }
        })
      },
      loadgetTrackData(){
        this.Statis=[]
        let params={
          projUid:this.$store.state.selectProjectObj.id
        };
        this.util.restGet('/api_v1/business/processWeChat/searchProcessStatistics',params,res=>{
          if(res.status==200){
            for(let i in res.data.data){
              let obj={};
              let arr=i.split(',');
              obj.id=arr[0];
              obj.partName=arr[1];
              obj.parentUid=arr[2];

              res.data.data[i].map(item=>{
                if(item.status==0){
                  item.backColor='rgba(240, 139, 0,1)'
                }else if(item.status==1){
                  item.backColor='rgba(242, 109, 95,1)'
                }else if(item.status==3){
                  item.backColor='rgba(91, 198, 201,1)'
                }else if(item.status==2){
                  item.backColor='rgba(92, 154, 212,1)'
                }else{
                  item.backColor='#ccc'
                }
              })
              obj.children=res.data.data[i];
              this.Statis.push(obj);
            }
            this.Statis.map((item,index,salf)=>{
              salf[salf.length-1].border='1px solid rgba(68,210,255,0.5)'
            })
          }
        },null,false)
      },
    }
  }
</script>
<style scoped>
  .proj-box{
    padding:10px 0 0 0  ;
  }
  .page-content-h-4{
    height: 35%;
    box-sizing: border-box;
  }
  .page-content-h-4>div,.page-content-h-3>div{
    height: 100%;
  }
  .page-content-h-3{
    height: 30%;
    box-sizing: border-box;
  }
  .statistics>div{
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
  .select-mouth{
    width: 90px;

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
  .tabs>span{
    margin-top: 0;
  }

.selectTime span{
  display: inline-block;
  width:90px;
  height:24px;
  line-height: 24px;
  background: rgba(255,255,255,0.2);
  text-align: right;
}
  .content-box{
    position: relative;
  }
  .content-box h4{

  }
  .header_tong{
    position: absolute;
    top: 10px;
    left: 15px;;
  }
  .header_tong h4{
    float: left;
  }
   .header_status{
     float:left;
     display: flex;
     margin-left: 10px;
     height:24px;
     line-height: 24px;
   }
   .header_status div{
     margin:0 5px;
   }
  .header_status i{
    display: inline-block;
    width:14px;
    height:14px;
    background: red;
    margin-right: 5px;
    position: relative;
    top:2px;
  }
  .ChartHead{
    display: flex;
    padding-left: 14px;
  }
  .ChartHead div{
    margin-right: 20px;
  }
  .ChartHead i{
    display: inline-block;
    width:14px;
    height:14px;
    position: relative;
    top:2px;
    margin-right: 10px;
  }
  .content-box{
    padding-left:0;
    padding-bottom: 25px;
  }
  .Statistics{
    width:100%;
    height:100%;
    box-sizing: border-box;
    text-align: left;
    overflow: auto;
  }
  .Statistics_textall{
    width:100%;
    box-sizing: border-box;
    overflow: auto;
    height:100%;
    white-space: nowrap;
  }
  .Statistics_con{
    padding-left: 30px;
    padding-bottom: 5px;
    box-sizing: border-box;
    border-left:1px solid rgba(68,210,255,0.5);
    width:100%;
    /*overflow: auto;*/
    /*white-space: nowrap;*/
  }
  .Statistics_con span{
    width:50px;
    height:20px;
    display: inline-block;
    background-color: rgba(91,198,201,1);
    margin-right: 15px;
    margin-bottom: 5px;
    line-height: 20px;
    font-size: 11px;
    color:#fff;
    text-align: center;
  }
  .statis_Title{
    width:37px;
    text-align: center;
    color:rgba(196,196,196,1);
    font-size: 17px;
    position: relative;
    height:fit-content;
  }
  .statis_Title p{
    line-height: 25px;
  }
  .statis_foot{
    text-align: left;
    padding-left: 67px;
    box-sizing: border-box;
  }
  .statis_foot span{
    width:50px;
    display: inline-block;
    margin-right: 50px;
    text-align: center;
    color:rgba(196,196,196,1);
  }
</style>
<style>
  .yearSty .el-input__prefix{
    top:-8px !important;
  }
</style>
