<template>
    <div class="proj-box">
        <div class="page-content-h-3">
          <div style="width:339px;float:left;padding-right:10px;box-sizing:border-box">
            <div class="box-style" style="height:100%">
              <div class="statistics">
                <h4 style="margin-bottom:12px">全部整改完结率
                    <!-- <div class="" style="float:right;width: 80px;">
                        <el-select @change="loadStatisticCountData" v-model="checkType" size="mini" class="select-ele" placeholder="请选择">
                            <el-option  label="全部" value=""></el-option>
                            <el-option  label="质量" value="quality"></el-option>
                            <el-option  label="安全" value="safety"></el-option>
                        </el-select>
                    </div> -->
                </h4>
                <div class="circle-left" style="text-align:right;padding-right:20px">
                    <el-progress type="circle" :width="90" :stroke-width="10" :percentage="statisticCountObj.totalPercent"></el-progress>
                </div>
                <div class="circle-right">
                    <p>问题数<span>{{statisticCountObj.totalNum}}</span></p>
                    <p>整改完结数<span>{{statisticCountObj.completeNum}}</span></p>
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
                <h4 style="margin-bottom:12px">按时整改完结率</h4>
                <div class="circle-left" style="text-align:right;padding-right:20px">
                    <el-progress type="circle" :width="90" :stroke-width="10" :percentage="statisticCountObj.onTimePercent"></el-progress>
                </div>
                <div class="circle-right">
                    <p>问题数<span>{{statisticCountObj.totalNum}}</span></p>
                    <p>整改完结数<span>{{statisticCountObj.completeOnTimeNum}}</span></p>
                </div>
              </div>
             <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div>
          <!-- <div class="box-style" style="width:329px;float:left">
             <div class="statistics">
                <h4 style="margin-bottom:30px">数据统计</h4>
                <div class="circle-right">
                    <p>记录数{{statisticCountObj.totalNum}}></p>
                    <p>计划任务数{{statisticCountObj.completeOnTimeNum}}</p>
                </div>
              </div>
             <i class="box-style-top-left"></i>
            <i class="box-style-top-right"></i>
            <i class="box-style-bottom-left"></i>
            <i class="box-style-bottom-right"></i>
          </div> -->
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
                  <span :class="{active:activeChartStr=='percent'}" @click="changeChart('percent')">整改完结率</span>
                  <span :class="{active:activeChartStr=='number'}" @click="changeChart('number')">问题数</span>
                </div>
              </h4>
              <div>
                <!-- <div id="myChart" style="height:100%;width:100%"></div> -->
                <div style="height:100%;width:100%">
                  <ve-histogram :data="chartData" :extend="chartExtend" :colors="colors" :grid="grid" :legend-visible="false" height="220px"></ve-histogram>
                </div>
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
                <span style="float:left">统计</span>
                <div class="tabs" style="overflow:hidden;border:0 none;float:left;width:auto;margin-left:10px;">
                  <span :class="{active:activeTableStr=='percent'}" @click="changeStatistics('percent')">整改完结率</span>
                  <span style="margin-left: 15px;width: 127px;" :class="{active:activeTableStr=='number'}" @click="changeStatistics('number')">整改完结数/问题数</span>
                </div>
              </h4>
              <div style="height:100%;width:100%" ref="tableHeight">
              <el-table :data="tableData" border :height="tableHeightNum"
                :header-row-style="{fontWeight:'400',color:'#fff',textAlign:'center'}" :show-summary='false'
                style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);">
                    <el-table-column prop="partName" width="200" label="区域"></el-table-column>
                    <el-table-column :prop="activeTableStr=='percent'? 'totalPercent':'totalNumStr'"
                      width="300" label="合计">
                    </el-table-column>
                    <el-table-column v-for="(item,index) in itemNameList" :key="index"
                    :prop="activeTableStr=='percent'? item.itemParentUid+'percent':item.itemParentUid+'numStr'"
                    width="300" :label="item.itemName">
                    </el-table-column>
                    <!-- <el-table-column
                    :prop="activeTableStr=='percent'? 'generalPercent':'generalNumStr'"
                    width="300" label="基础工程">
                    </el-table-column> -->
                    <!-- <el-table-column
                    :prop="activeTableStr=='percent'? 'primaryPercent':'primaryNumStr'"
                    label="主体工程">
                    </el-table-column> -->
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
        this.chartExtend = {
          series: {
            barMaxWidth: 55
          },
          tooltip: {
            trigger: 'none'
          },
          'xAxis.0.axisLabel.color': 'rgba(68,210,255,0.5)',//x轴文本颜色
          'yAxis.0.axisLabel.color': "rgba(68,210,255,0.5)"
        }
        return {
          chartData: {},
          numberChartData:{},
          percentChartData:{},
          colors:['rgba(32,165,255,1)'],
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
          activeChartStr:'percent',
          activeTableStr:'percent',
          statisticsDate:new Date().format("yyyy-MM"),
          checkType:'',
          statisticCountObj:{},
          tableData:[],
          itemNameList:[],
          overviewObj:{
              taskNum:10,
              problemNum:20,
              recordNum:10,
          },
          dateArr:[],
          valueArr:[],
          numberArr:[],
          percentArr:[],
          projObj:{},
          tableHeightNum:0
        }
    },
    mounted(){
      this.projObj =JSON.parse(this.cookieUtil.get('projectNode'));
      // this.checkType=this.$route.params.checkType;
      this.checkType = this.util.getUrlParam("checkType");
      this.loadStatisticData();
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tableHeight.offsetHeight
      })
    },
    watch:{
       '$store.state.selectProjectObj.id':function(val,oldVal){
          this.projObj =JSON.parse(this.cookieUtil.get('projectNode'));
           this.loadStatisticData();
            
        }
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
              checkType:this.checkType,
              projUid:this.projObj.id,
              formType:"inspect",
              statisticsDate:this.statisticsDate
          };
          this.util.mask();
          this.util.restGet('/api_v1/construction/inspect/statisticCountData', params, (res)=> {
              
              this.util.unmask();
            if(res.status==200){
              this.statisticCountObj=res.data;
              this.statisticCountObj.totalPercent =parseFloat(this.statisticCountObj.totalNum==0? 0:(parseFloat(this.statisticCountObj.completeNum/this.statisticCountObj.totalNum)*100).toFixed(2));
              this.statisticCountObj.onTimePercent =parseFloat(this.statisticCountObj.totalNum==0? 0:(parseFloat(this.statisticCountObj.completeOnTimeNum/this.statisticCountObj.totalNum)*100).toFixed(2));
                    
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
          var params = {
              checkType:this.checkType,
              projUid:this.projObj.id,
              formType:"inspect",
              statisticsDate:this.statisticsDate
          };
          this.util.restGet('/api_v1/construction/inspect/statisticChartsData', params, (res)=> {
              console.log("statisticChartsData=====",res);
              this.util.unmask();
              if(res.status==200&&res.data!=undefined){
                res.data.forEach(item=>{
                  item.percent = item.totalNum==0? 0:item.completeNum*100/item.totalNum;
                });
                this.numberChartData= {
                  columns: ['dataDate', 'totalNum'],
                  rows: res.data
                }
                this.percentChartData= {
                  columns: ['dataDate', 'percent'],
                  rows: res.data
                }
                // res.data.forEach(item=>{
                //   this.dateArr.push(item.dataDate);
                //   this.numberArr.push(item.totalNum);
                //   this.percentArr.push(item.completeNum*100/item.totalNum);
                // });
              }else{
                // this.dateArr=[];
                // this.numberArr=[];
                // this.percentArr=[];
              }
            
          },null,false);
      },
      loadStatisticTableData() {//获取统计表格数据
          var params = {
              projUid:this.projObj.id,
              checkType:this.checkType,
              statisticsDate:this.statisticsDate
          };
          this.util.mask();
          this.util.restGet('/api_v1/construction/inspect/statisticTableData', params, (res)=> {
              this.util.unmask();
            if(res.status==200&&res.data!=undefined){
              // res.data.forEach(item=>{
              //     item.totalPercent=((item.completeNum/item.totalNum)*100).toFixed(2)+"%";
              //     item.totalNumStr=item.completeNum+"/"+item.totalNum;
              //     item.generalPercent=item.generalNum==0? 0+"%":((item.generalCompleteNum/item.generalNum)*100).toFixed(2)+"%";
              //     item.generalNumStr=item.generalCompleteNum+"/"+item.generalNum;

              //     item.primaryPercent=item.primaryNum==0? 0+"%":((item.primaryCompleteNum/item.primaryNum)*100).toFixed(2)+"%";
              //     item.primaryNumStr=item.primaryCompleteNum+"/"+item.primaryNum;
                  
              //   });
              res.data.dataList.forEach(item=>{
                  item.totalPercent=((item.completeNum/item.totalNum)*100).toFixed(2)+"%";
                  item.totalNumStr=item.completeNum+"/"+item.totalNum;
                  // item.generalPercent=item.generalNum==0? 0+"%":((item.generalCompleteNum/item.generalNum)*100).toFixed(2)+"%";
                  // item.generalNumStr=item.generalCompleteNum+"/"+item.generalNum;

                  // item.primaryPercent=item.primaryNum==0? 0+"%":((item.primaryCompleteNum/item.primaryNum)*100).toFixed(2)+"%";
                  // item.primaryNumStr=item.primaryCompleteNum+"/"+item.primaryNum;
                  
                });
              this.tableData=res.data.dataList;
              this.itemNameList=res.data.itemNameList;
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
          if(this.activeChartStr=="number"){
              // this.valueArr=this.numberArr;
              this.chartData=this.numberChartData;
          }else{
            // this.valueArr=this.percentArr;
            this.chartData=this.percentChartData;
          }
          return;
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
