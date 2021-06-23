<template>
    <div class="proj-box">
        <div style="height:100%;padding-bottom:0" class="box-style">
            <div class="statistics">
                <div>
                    <h4 style="margin-bottom:14px">检查概况</h4>
                    <p class="num-statistics">
                        <span>任务数：{{overviewObj.taskNum}}</span>
                        <span>问题数：{{overviewObj.problemNum}}</span>
                        <span>记录数：{{overviewObj.recordNum}}</span>
                    </p>
                    <div class="draw-circle">
                        <div class="draw-circle-left">
                            <div id="myChart" style="height:100%;width:100%"></div>
                        </div>
                        <div class="draw-circle-right">
                            <div id="myChart1" style="height:100%;width:100%"></div>
                        </div>
                    </div>
                </div>
                <div>
                    <h4 style="margin-bottom:14px">人员情况</h4>
                    <div class="draw-circle">
                        <div class="draw-circle-left">
                            <div id="myChart2" style="height:90%;width:100%"></div>
                            <div>检查人员：2人</div>
                        </div>
                        <div class="draw-circle-right">
                            <div id="myChart3" style="height:90%;width:100%"></div>
                            <div>整改人员：2人</div>
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
</template>
<script>
export default {
    data(){
        return {
            overviewObj:{
                taskNum:10,
                problemNum:20,
                recordNum:10,
            }
        }
    },
    mounted(){
        this.init()
    },
    methods:{
        init(){
            this.drawCircleCharts()
            this.drawCircleCharts1()
            this.drawCircleCharts2()
            this.drawCircleCharts3()
        },
        drawCircleCharts(){
            var myChart = this.$echarts.init(document.getElementById('myChart'))
            var _this=this
            var option = {

                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '50%'],
                            data:[
                                {value:335, name:'待指派'},
                                {value:310, name:'已销项'},
                                {value:234, name:'待修复'},
                                {value:135, name:'待销项'},
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,

                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
            }
            myChart.setOption(option)
        },
        drawCircleCharts1(){
        var myChart = this.$echarts.init(document.getElementById('myChart1'))
        var _this=this
        var option = {

          tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          series : [
            {
              name: '访问来源',
              type: 'pie',
              radius : '55%',
              center: ['50%', '50%'],
              data:[
                {value:350, name:'待指派'},
                {value:290, name:'已销项'},
                {value:504, name:'待修复'},
                {value:235, name:'待销项'},
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,

                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        myChart.setOption(option)
      },
        drawCircleCharts2(){
            var myChart = this.$echarts.init(document.getElementById('myChart2'))
            var _this=this
            var option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'shadow'
                }
              },
              legend: {
                data: ['销售数量', '记录数量','问题数量'],
                textStyle:{
                  fontSize: 18,//字体大小
                  color: 'rgba(68,210,255,1)'//字体颜色
                },
              },
              grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
              },
              xAxis: {
                type: 'value',
                boundaryGap: [0, 0.01],
                show:false,

              },
              grid:[{
                left:'50px',
              }],
              yAxis: {
                type: 'category',
                data: ['巴西','印尼'],
                axisLine:{
                  lineStyle:{
                    color:"rgba(68,210,255,0.5)"
                  }
                }
              },
              series: [
                {
                  name: '销售数量',
                  type: 'bar',
                  data: [15203, 19489]
                },
                {
                  name: '记录数量',
                  type: 'bar',
                  data: [19325, 23438]
                },
                {
                  name: '问题数量',
                  type: 'bar',
                  data: [13345, 15786]
                }
              ]
            };
            myChart.setOption(option)
        },
        drawCircleCharts3(){
            var myChart = this.$echarts.init(document.getElementById('myChart3'))
            var _this=this
          var option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow'
              }
            },
            legend: {
              data: ['销售数量', '记录数量','问题数量'],
              textStyle:{
                fontSize: 18,//字体大小
                color: 'rgba(68,210,255,1)'//字体颜色
              },
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              boundaryGap: [0, 0.01],
              show:false,

            },
            yAxis: {
              type: 'category',
              data: ['巴西','印尼'],
              axisLine:{
                lineStyle:{
                  color:"rgba(68,210,255,0.5)"
                }
              }
            },
            grid:[{
              left:'120px',
            }],
            series: [
              {
                name: '销售数量',
                type: 'bar',
                data: [15203, 19489]
              },
              {
                name: '记录数量',
                type: 'bar',
                data: [19325, 23438]
              },
              {
                name: '问题数量',
                type: 'bar',
                data: [13345, 15786]
              }
            ]
          };
            myChart.setOption(option)
        },

    }
}
</script>
<style scoped>
.proj-box{
    padding:10px 0 0 0  ;
}
.statistics{
    padding: 14px;
    overflow:auto;
}
.num-statistics{
    text-align: left;
}
.num-statistics span{
    margin-right: 56px;
}
.box-style .box-style-bottom-right,.box-style .box-style-bottom-left{
    bottom: 0
}
.draw-circle{
    overflow: hidden;
}
.draw-circle>div{
    width: 550px;
    height: 340px;
    float: left;
}
</style>
