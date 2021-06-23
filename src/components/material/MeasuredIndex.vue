<template>
    <div class="proj-box">
        <div class="page-content-h-3">
          <div style="width:339px;float:left;padding-right:10px;box-sizing:border-box">
            <div class="box-style" style="height:100%">
              <div class="statistics">
                <h4 style="margin-bottom:30px">测量率</h4>
                <div class="circle-left" style="text-align:right;padding-right:20px">
                    <el-progress type="circle" :width="90" :stroke-width="10" :percentage="statisticCountObj.totalPercent"></el-progress>
                </div>
                <div class="circle-right">
                    <p>测量点<span>{{statisticCountObj.totalNum}}</span></p>
                    <p>已测点<span>{{statisticCountObj.measuredNum}}</span></p>
                </div>
              </div>
              <i class="box-style-top-left"></i>
              <i class="box-style-top-right"></i>
              <i class="box-style-bottom-left"></i>
              <i class="box-style-bottom-right"></i>
            </div>
          </div>
          <div class="box-style" style="width:329px;float:left;padding-right:10px;">
             <div class="statistics">
                <h4 style="margin-bottom:30px">实测合格率</h4>
                <div class="circle-left" style="text-align:right;padding-right:20px">
                    <el-progress type="circle" :width="90" :stroke-width="10" :percentage="statisticCountObj.passPercent"></el-progress>
                </div>
                <div class="circle-right">
                    <p>已测点<span>{{statisticCountObj.measuredNum}}</span></p>
                    <p>合格点<span>{{statisticCountObj.passNum}}</span></p>
                    
                </div>
              </div>
             <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div>
          <div class="box-style" style="width:329px;float:left">
             <div class="statistics">
                <h4 style="margin-bottom:30px">整改完结率</h4>
                <div class="circle-left" style="text-align:right;padding-right:20px">
                    <el-progress type="circle" :width="90" :stroke-width="10" :percentage="statisticCountObj.rectifyPercent"></el-progress>
                </div>
                <div class="circle-right">
                    <p>问题数<span>{{statisticCountObj.rectifyNum}}</span></p>
                    <p>整改数<span>{{statisticCountObj.completeNum}}</span></p>
                </div>
              </div>
             <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div>
          <div class="select-mouth" style="float:right;height: 24px;">
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
            </div>
        </div>
        <div class="page-content-h-4">
           <div class="box-style">
            <div class="content-box">
              <h4>
                <span style="float:left">指标分析</span>
                <div class="tabs" style="overflow:hidden;border:0 none;float:left;width:auto;margin-left:10px;">
                  <span :class="{active:activeChartStr=='percent'}" @click="changeChart('percent')">测量率</span>
                  <span :class="{active:activeChartStr=='passPercent'}" @click="changeChart('passPercent')">实测合格率</span>
                  <span :class="{active:activeChartStr=='number'}" @click="changeChart('number')">问题数</span>
                </div>
              </h4>
              <div>
                <div id="myChart" style="height:100%;width:100%"></div>
              </div>
            </div>
             <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div>
        </div>
        <div class="page-content-h-3">
           <div class="box-style">
            <div class="content-box">
              <h4>
                <span style="float:left">区域统计</span>
                <div class="tabs" style="overflow:hidden;border:0 none;float:left;width:auto;margin-left:10px;">
                  <span :class="{active:activeTableStr=='percent'}" @click="changeStatistics('percent')">实测合格率</span>
                  <span :class="{active:activeTableStr=='rectify'}" @click="changeStatistics('rectify')">整改完结率</span>
                  <span style="padding-left: 15px;width: 90px;" :class="{active:activeTableStr=='number'}" @click="changeStatistics('number')">整改/问题数</span>
                </div>
              </h4>
              <div style="height:100%;width:100%" ref="tableHeight">
              <el-table :data="tableData" border :height="tableHeightNum"
                :header-row-style="{fontWeight:'400',color:'#fff',textAlign:'center'}" :show-summary='false'
                style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);">
                    <el-table-column prop="partName" width="200" label="区域"></el-table-column>
                    <el-table-column
                    :prop="activeTableStr=='percent'? 'totalPercent':(activeTableStr=='rectify'? 'rectifyPercent':'numStr')"
                    width="300" label="合计"></el-table-column>
                    <el-table-column
                    :prop="activeTableStr=='percent'? 'generalPercent':activeTableStr=='rectify'? 'generalrectify':'generalNumStr'"
                    width="300" label="基础工程">
                    </el-table-column>
                    <el-table-column
                    :prop="activeTableStr=='percent'? 'primaryPercent':activeTableStr=='rectify'? 'primaryPercent':'primaryNumStr'"
                    label="主体工程">
                    </el-table-column>
                </el-table>
              </div>
            </div>
             <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
          activeChartStr:'percent',
          activeTableStr:'percent',
          statisticsDate:new Date().format("yyyy-MM"),
          statisticCountObj:{},
          tableData:[],
          overviewObj:{
              taskNum:10,
              problemNum:20,
              recordNum:10,
          },
          dateArr:[],
          valueArr:[],
          numberArr:[],
          percentArr:[],
          passPercentArr:[],
          projObj:{},
          tableHeightNum:0
        }
    },
    mounted(){
      this.projObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.loadStatisticData();
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tableHeight.offsetHeight
      })
    },
    methods:{
      changeChart(str){
        this.activeChartStr=str
        this.drawCharts();
        
      },
      changeStatistics(str){
        this.activeTableStr=str
      },
      loadStatisticCountData() {//获取数量图表数据
          var params = {
              projUid:this.projObj.id,
              statisticsDate:this.statisticsDate
          };
          this.util.mask();
          this.util.restGet('/api_v1/construction/inspect/measureCountData', params, (res)=> {
              this.util.unmask();
            if(res.status==200){
              this.statisticCountObj=res.data;
              this.statisticCountObj.totalPercent =parseFloat(this.statisticCountObj.totalNum==0? 0:(parseFloat(this.statisticCountObj.measuredNum/this.statisticCountObj.totalNum)*100).toFixed(2));
              this.statisticCountObj.passPercent =parseFloat(this.statisticCountObj.measuredNum==0? 0:(parseFloat(this.statisticCountObj.passNum/this.statisticCountObj.measuredNum)*100).toFixed(2));
              this.statisticCountObj.rectifyPercent =parseFloat(this.statisticCountObj.rectifyNum==0? 0:(parseFloat(this.statisticCountObj.completeNum/this.statisticCountObj.rectifyNum)*100).toFixed(2));
                    
            }else{
              this.statisticCountObj={};
            }
          });

      },
      loadStatisticChartsData(){//获取图表数据
         this.util.mask();
         this.dateArr=[];
         this.numberArr=[];
         this.percentArr=[];
         this.passPercentArr=[];
          var params = {
              projUid:this.projObj.id,
              formType:"measured",
              statisticsDate:this.statisticsDate
          };
          this.util.restGet('/api_v1/construction/inspect/measureChartsData', params, (res)=> {
              this.util.unmask();
              if(res.status==200&&res.data!=undefined){
                res.data.forEach(item=>{
                  this.dateArr.push(item.dataDate);
                  this.numberArr.push(item.rectifyNum);
                  this.percentArr.push(item.measuredNum*100/item.totalNum);
                  this.passPercentArr.push(item.passNum*100/item.measuredNum);
                });
              }else{
                this.dateArr=[];
                this.numberArr=[];
                this.percentArr=[];
                this.passPercentArr=[];
              }
            
          },null,false);
      },
      loadStatisticTableData() {//获取统计表格数据
          var params = {
              projUid:this.projObj.id,
              statisticsDate:this.statisticsDate
          };
          this.util.mask();
          this.util.restGet('/api_v1/construction/inspect/measureTableData', params, (res)=> {
              this.util.unmask();
            if(res.status==200&&res.data!=undefined){
              res.data.forEach(item=>{
                  item.totalPercent=item.measuredNum==0? 0+"%":((item.measuredPassNum/item.measuredNum)*100).toFixed(2)+"%";
                  item.rectifyPercent=item.totalNum==0? 0+"%":((item.totalCompleteNum/item.totalNum)*100).toFixed(2)+"%";
                  item.numStr=item.totalCompleteNum+"/"+item.totalNum;

                  item.generalPercent=item.generalMeasuredNum==0? 0+"%":((item.generalMeasuredPassNum/item.generalMeasuredNum)*100).toFixed(2)+"%";
                  item.generalrectify=item.generalTotalNum==0? 0+"%":((item.generalCompleteNum/item.generalTotalNum)*100).toFixed(2)+"%";
                  item.generalNumStr=item.generalCompleteNum+"/"+item.generalTotalNum;

                  item.primaryPercent=item.primaryMeasuredNum==0? 0+"%":((item.primaryMeasuredPassNum/item.primaryMeasuredNum)*100).toFixed(2)+"%";
                  item.primaryPercent=item.primaryTotalNum==0? 0+"%":((item.primaryCompleteNum/item.primaryTotalNum)*100).toFixed(2)+"%";
                  item.primaryNumStr=item.primaryCompleteNum+"/"+item.primaryTotalNum;
                  
                });
              this.tableData=res.data;
            }else{
              this.tableData=[];
            }
            this.activeTableStr="percent";
          });

      },
      loadStatisticData(){//获取统计数据
          this.loadStatisticCountData();
          this.loadStatisticTableData();
          this.loadStatisticChartsData();
          this.activeChartStr="percent";
          this.drawCharts();
      },
      drawCharts(){
          if(this.activeChartStr=="percent"){
              this.valueArr=this.percentArr;
          }else if(this.activeChartStr=="passPercent"){
              this.valueArr=this.passPercentArr;
          }else{
            this.valueArr=this.numberArr;
          }
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
              height:'70%',
              backgroundColor:"transparent",
              borderColor:"#fff",
              tooltip:{                        //坐标系特定的 tooltip 设定
                backgroundColor:"transparent",        //标题背景色
                borderColor:"#ccc",         //边框颜色
              },
            }],
            series: [{
              data: this.valueArr,
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
      }
    }
}
</script>
<style scoped>
.proj-box{
    padding:10px 0 0 0  ;
}
.page-content-h-4{
  height: 40%;
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
    .content-box{
      padding-top: 46px;
      position: relative;
    }
    .content-box h4{
      position: absolute;
      top: 10px;
      left: 10px;;
    }
    .content-box>div{
      width: 100%;
      height: 100%;
    }
    
</style>
<style>
.content-box .el-table__footer-wrapper tbody td{
  background:rgba(68, 210, 255, 0.2);
}
</style>
