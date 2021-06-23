<template>
    <div class="proj-box home-page">
        <div class="box-left">
            <div class="box-style left-top">
                <div>
                    <div class="proj-synopsis">
                        <h4 >项目信息</h4>
                        <div class="current-year-proj">
                            <p class="cf">{{projectObj.projName}}</p>
                            <div>
                                <span>项目类型<i>{{projectObj.classify}}</i></span>
                                <span>合同工期<i>空</i></span>
                            </div>
                            <div>
                                <span>开工日期<i>{{projectObj.startDate? projectObj.startDate:'空'}}</i></span>
                                <span>竣工日期<i>{{projectObj.endDate? projectObj.startDate:'空'}}</i></span>
                            </div>
                        </div>
                        <div class="area-proj" style="border-bottom: 1px solid hsla(0,0%,100%,.3);">
                            <p>项目负责人: <span>{{projectObj.principalName}}</span></p>
                            <p>管理公司: <span>{{initUnitName('管理公司')}}</span></p>
                            <p>监理单位: <span>{{initUnitName('监理单位')}}</span></p>
                            <p>设计单位: <span>{{initUnitName('设计单位')}}</span></p>
                            <p>施工单位: <span>{{initUnitName('施工单位')}}</span></p>
                        </div>

                        <div>
                            <div class="double-style" style="padding-top: 5px;">
                                <span class="cf">进度情况</span>
                                <span>累计完成进度<span style="padding-left:5px;color:green">{{totalSchedule}}%</span></span>
                            </div>
                            <ve-line :grid="grid" :settings="progressChartSettings" :data="chartData" :extend="extend" :legend-visible="false" height="220px"></ve-line>
                        </div>
                    </div>
                </div>
                <i class="box-style-top-left"></i>
                <i class="box-style-top-right"></i>
                <i class="box-style-bottom-left"></i>
                <i class="box-style-bottom-right"></i>
            </div>
            <div class="box-style left-bottom">
                <div>
                    <div class="double-style">
                        <h4 style="width: 118px;">质量</h4>
                        <div class="tabs tab-wrap">
                            <span :class="{active:qualityFlag == 'month'}" @click="qualityFlag='month';getCheckNumStatistics('quality')">本月</span>
                            <span :class="{active:qualityFlag == 'year'}" @click="qualityFlag='year';getCheckNumStatistics('quality')">本年</span>
                        </div>
                    </div>
                    
                    <div class="progress">
                        <div class="progress-bar">
                            <template>
                                <el-progress type="circle" :width="52" :stroke-width="10" :percentage="Number(qualityCheckObj.planPercent)"></el-progress>
                            </template>
                        </div>
                        <div class="progress-list">
                            <p>计划检查数<span> {{qualityCheckObj.planTotalNum}}</span></p>
                            <p>实际检查数<span class="cf"> {{qualityCheckObj.hadCheckNum}}</span></p>
                        </div>
                    </div>
                    <div class="progress">
                        <div class="progress-bar">
                            <template>
                                <el-progress type="circle" :width="52" :stroke-width="10" :percentage="Number(qualityCheckObj.problemPercent)"></el-progress>
                            </template>
                        </div>
                        <div class="progress-list">
                            <p>问题数<span> {{qualityCheckObj.problemNum}}</span></p>
                            <p>销项数<span class="cf"> {{qualityCheckObj.finishNum}}</span></p>
                        </div>
                    </div>
                </div>
                <i class="box-style-top-left"></i>
                <i class="box-style-top-right"></i>
                <i class="box-style-bottom-left"></i>
                <i class="box-style-bottom-right"></i>
            </div>
        </div>
        <div class="box-center ">
            <div class="center-top box-style">
                <div>
                    <div class="double-style">
                        <h4>楼栋总览</h4>
                        <div class="tabs tab-wrap" style="width: auto;">
                            <span :class="{active:areaFlag == 'procedure'}" @click="changeAreaFlag('procedure')">工序进度</span>
                            <span :class="{active:areaFlag == 'quality'}" @click="changeAreaFlag('quality')">质量汇总</span>
                            <span :class="{active:areaFlag == 'safety'}" @click="changeAreaFlag('safety')">安全汇总</span>
                            <span :class="{active:areaFlag == 'measure'}" @click="changeAreaFlag('measure')">实测实量</span>
                        </div>
                    </div>
                    <div v-if="areaFlag=='procedure'" style="height: calc(100% - 40px);overflow: hidden;position: relative;">
                        <div class="header_status" style="position: absolute;top: 0;left: 0;z-index: 2;">
                            <div><i style="background: rgb(204, 204, 204)"></i><span>无任务</span></div>
                            <div><i style="background: rgba(240, 139, 0,1)"></i><span>未施工</span></div>
                            <div><i style="background: rgba(242, 109, 95,1)"></i><span>进行中</span></div>
                            <div><i style="background: rgba(91, 198, 201,1)"></i><span>已完成</span></div>
                        </div>
                        <div class="Statistics_textall">
                            <div style="width:100px;display: inline-block; position:relative;"  v-for="(item,index) in Statis" :key="index">
                                <div class="xAxis-label">
                                    <span style="text-align: center;width:50px;display: inline-block;font-size: 11px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" @click="btnchild(item)">{{item.name}}</span>
                                </div>

                                <div class="Statistics_con" style="border-bottom:1px solid rgba(68,210,255,0.5)">
                                    <span v-for="child in item.children" :style="{background:initBackground(child)}">{{child.name}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="parcess_head">
                            <div class="item_head">
                                <span>按区域:</span>
                                <span>
                                    <el-select @change="changeAreaFlag()" v-model="areaValue" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                                        <el-option  label="全部" value=""></el-option>
                                        <el-option v-for="(item, index) in partList " :label="item.partName" :value="item.id" :key="index"></el-option>
                                    </el-select>
                                </span>
                            </div>
                            <div class="item_head">
                                <span>检查项:</span>
                                <span>
                                    <el-select @change="changeAreaFlag()" v-model="checkItemVal" placeholder="请选择" size="mini" class="select-ele">
                                        <el-option  label="全部" value=""></el-option>
                                        <el-option :label="item.itemName" :value="item.itemName" v-for="(item,index) in checkItemList" :key="index"></el-option>
                                    </el-select>
                                </span>
                            </div>
                            <div class="item_head">
                                <span>检查状态:</span>
                                <span>
                                    <el-select @change="changeAreaFlag()" v-model="checkStatus" placeholder="请选择" size="mini" class="select-ele">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="待指派" value="1"></el-option>
                                    <el-option label="待整改" value="2"></el-option>
                                    <el-option label="待销项" value="3"></el-option>
                                    <el-option label="已销项" value="4"></el-option>
                                    </el-select>
                                </span>
                            </div>
                        </div>
                        <div>
                            <div class="collect collect-part1">
                                <div class="tabs tab-wrap">
                                    <span class="active">问题分类</span>
                                </div>
                                <ve-pie :settings="pieChartSettings" :data="areaChartData"  :legend-visible="false" height="193px"  ></ve-pie>
                                <div>
                                    <span>共{{CheckItemTotalCount}}个</span>
                                </div>
                                <div class="double-style" v-for="(item,index) in CheckItemList" :key="index">
                                    <span>{{item.itemName}}</span>
                                    <span>共{{item.count}}个,占{{item.percent}}%</span>
                                </div>
                            </div>
                            <div class="collect monitoring-part2">
                                <div class="tabs tab-wrap">
                                    <span class="active">状态分类</span>
                                </div>
                                <ve-pie :settings="pieChartSettings" :data="statusChartData"  :legend-visible="false" height="193px"  ></ve-pie>
                                <div>
                                    <span>共{{statusTotalCount}}个</span>
                                </div>
                                <div class="double-style" v-for="(item,index) in statusList" :key="index">
                                    <span>{{item.statusName}}</span>
                                    <span>共{{item.countNum}}个,占{{item.percent}}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div class="box-style center-bottom" style="display: flex;">
                <div style="height:100%;margin-right:10px">
                    <h4>工序
                        <p class="box-title">
                            <span>本月</span>
                            <span>上月</span>
                            <span>本年</span>
                        </p>
                    </h4>
                    <div class="monitoring" style="height:138px;overflow: auto;">
                        <template>
                            <p>
                                <span>计划施工数</span>
                                <span>{{procedureCountObj.monthPlanNum? procedureCountObj.monthPlanNum:0}}</span>
                                <span>{{procedureCountObj.lastMonthPlanNum? procedureCountObj.lastMonthPlanNum:0}}</span>
                                <span>{{procedureCountObj.yearPlanNum? procedureCountObj.yearPlanNum:0}}</span>
                            </p>
                            <p>
                                <span>实际施工数</span>
                                <span>{{procedureCountObj.monthActNum? procedureCountObj.monthActNum:0}}</span>
                                <span>{{procedureCountObj.lastMonthActNum? procedureCountObj.lastMonthActNum:0}}</span>
                                <span>{{procedureCountObj.yearActNum? procedureCountObj.yearActNum:0}}</span>
                            </p>
                            <p>
                                <span>施工合格数</span>
                                <span>{{procedureCountObj.monthPassNum? procedureCountObj.monthPassNum:0}}</span>
                                <span>{{procedureCountObj.lastMonthPassNum? procedureCountObj.lastMonthPassNum:0}}</span>
                                <span>{{procedureCountObj.yearPassNum? procedureCountObj.yearPassNum:0}}</span>
                            </p>
                            <p>
                                <span>施工合格率</span>
                                <span>{{procedureCountObj.monthPassPercent}}%</span>
                                <span>{{procedureCountObj.lastMonthPassPercent}}%</span>
                                <span>{{procedureCountObj.yearPassPercent}}%</span>
                            </p>
                            <p>
                                <span>问题数</span>
                                <span>{{procedureCountObj.monthProblemNum? procedureCountObj.monthProblemNum:0}}</span>
                                <span>{{procedureCountObj.lastMonthProblemNum? procedureCountObj.lastMonthProblemNum:0}}</span>
                                <span>{{procedureCountObj.yearProblemNum? procedureCountObj.yearProblemNum:0}}</span>
                            </p>
                            <p>
                                <span>完结数</span>
                                <span>{{procedureCountObj.monthFinishNum? procedureCountObj.monthFinishNum:0}}</span>
                                <span>{{procedureCountObj.lastMonthFinishNum? procedureCountObj.lastMonthFinishNum:0}}</span>
                                <span>{{procedureCountObj.yearFinishNum? procedureCountObj.yearFinishNum:0}}</span>
                            </p>
                            <p>
                                <span>整改完结率</span>
                                <span>{{procedureCountObj.monthFinishPercent}}%</span>
                                <span>{{procedureCountObj.lastMonthFinishPercent}}%</span>
                                <span>{{procedureCountObj.yearFinishPercent}}%</span>
                            </p>
                        </template>
                    </div>
                    
                </div>
                <div style="height:100%">
                    <h4>实测实量
                        <p class="box-title">
                            <span>本月</span>
                            <span>上月</span>
                            <span>本年</span>
                        </p>
                    </h4>
                    <div class="monitoring monitoring-part2" style="height:138px;overflow: auto;">
                        <template>
                            <p>
                                <span>计划检查数</span>
                                <span>{{measureCountObj.monthPlanNum? measureCountObj.monthPlanNum:0}}</span>
                                <span>{{measureCountObj.lastMonthPlanNum? measureCountObj.lastMonthPlanNum:0}}</span>
                                <span>{{measureCountObj.yearPlanNum? measureCountObj.yearPlanNum:0}}</span>
                            </p>
                            <p>
                                <span>实际检查数</span>
                                <span>{{measureCountObj.monthActNum? measureCountObj.monthActNum:0}}</span>
                                <span>{{measureCountObj.lastMonthActNum? measureCountObj.lastMonthActNum:0}}</span>
                                <span>{{measureCountObj.yearActNum? measureCountObj.yearActNum:0}}</span>
                            </p>
                            <p>
                                <span>测量合格数</span>
                                <span>{{measureCountObj.monthPassNum? measureCountObj.monthPassNum:0}}</span>
                                <span>{{measureCountObj.lastMonthPassNum? measureCountObj.lastMonthPassNum:0}}</span>
                                <span>{{measureCountObj.yearPassNum? measureCountObj.yearPassNum:0}}</span>
                            </p>
                            <p>
                                <span>测量合格率</span>
                                <span>{{measureCountObj.monthPassPercent}}%</span>
                                <span>{{measureCountObj.lastMonthPassPercent}}%</span>
                                <span>{{measureCountObj.yearPassPercent}}%</span>
                            </p>
                            <p>
                                <span>问题数</span>
                                <span>{{measureCountObj.monthProblemNum? measureCountObj.monthProblemNum:0}}</span>
                                <span>{{measureCountObj.lastMonthProblemNum? measureCountObj.lastMonthProblemNum:0}}</span>
                                <span>{{measureCountObj.yearProblemNum? measureCountObj.yearProblemNum:0}}</span>
                            </p>
                            <p>
                                <span>完结数</span>
                                <span>{{measureCountObj.monthFinishNum? measureCountObj.monthFinishNum:0}}</span>
                                <span>{{measureCountObj.lastMonthFinishNum? measureCountObj.lastMonthFinishNum:0}}</span>
                                <span>{{measureCountObj.yearFinishNum? measureCountObj.yearFinishNum:0}}</span>
                            </p>
                            <p>
                                <span>整改完结率</span>
                                <span>{{measureCountObj.monthFinishPercent}}%</span>
                                <span>{{measureCountObj.lastMonthFinishPercent}}%</span>
                                <span>{{measureCountObj.yearFinishPercent}}%</span>
                            </p>
                        </template>
                    </div>
                </div>
                <i class="box-style-top-left"></i>
                <i class="box-style-top-right"></i>
                <i class="box-style-bottom-left"></i>
                <i class="box-style-bottom-right"></i>
            </div>
        </div>
        <div class="box-right">
            <div class="box-style right-top">
                <div>
                    <h4>问题统计</h4>
                    <div class="tabs tab-wrap">
                        <span :class="{active:problemFlag == 'month'}" @click="problemFlag ='month';getCheckNumRanking()">本月</span>
                        <span :class="{active:problemFlag == 'year'}" @click="problemFlag ='year';getCheckNumRanking()">本年</span>
                    </div>
                    <!-- <i class="more" @click="openPopUp('projList')" v-if="data.projList && data.projList.length > 30">更多</i> -->
                    <div class="monitoring">
                        <p>
                            <span class="cf">&emsp;</span>
                            <span>问题数</span>
                            <span>完结率</span>
                            <span>按时完结率</span>
                        </p>
                       
                        <template>
                            <p>
                                <span>质量</span>
                                <span>{{qualityNumObj.totalCount}}</span>
                                <span>{{qualityNumObj.finishPercent}}%</span>
                                <span>{{qualityNumObj.onTimePercent}}%</span>
                            </p>
                            <p>
                                <span>安全</span>
                                <span>{{safetyNumObj.totalCount}}</span>
                                <span>{{safetyNumObj.finishPercent}}%</span>
                                <span>{{safetyNumObj.onTimePercent}}%</span>
                            </p>
                            <p>
                                <span>工序</span>
                                <span>{{procedureNumObj.totalCount}}</span>
                                <span>{{procedureNumObj.finishPercent}}%</span>
                                <span>{{procedureNumObj.onTimePercent}}%</span>
                            </p>
                            <p>
                                <span>实测</span>
                                <span>{{measureNumObj.totalCount}}</span>
                                <span>{{measureNumObj.finishPercent}}%</span>
                                <span>{{measureNumObj.onTimePercent}}%</span>
                            </p>
                            <p>
                                <span>总计</span>
                                <span>{{totalNumObj.totalCount}}</span>
                                <span>{{(totalNumObj.finishPercent*100).toFixed(1)}}%</span>
                                <span>{{(totalNumObj.onTimePercent*100).toFixed(1)}}%</span>
                            </p>
                        </template>
                    </div>

                    <div style="position: relative;clear:both;">
                        <span style="position: absolute;top: 61px;left: 98px;font-size: 13px;">{{problemFlag == 'month'? '本月问题分布':'本年问题分布'}}</span>
                        <ve-ring :data="problemChartData"  :settings="chartSettings" :legend-visible="false" height="133px" ></ve-ring>
                    </div>
                    
                    
                </div>
                <i class="box-style-top-left"></i>
                <i class="box-style-top-right"></i>
                <i class="box-style-bottom-left"></i>
                <i class="box-style-bottom-right"></i>
            </div>
            <div class="box-style right-bottom">
                <div class="sercurity">
                   
                    <div class="double-style">
                        <h4 style="width: 118px;">安全</h4>
                        <div class="tabs tab-wrap">
                            <span :class="{active:safetyFlag == 'month'}" @click="safetyFlag='month';getDataType('month')">本月</span>
                            <span :class="{active:safetyFlag == 'year'}" @click="safetyFlag='year';getDataType('year')">本年</span>
                        </div>
                    </div>
                    <div class="progress">
                        <div class="progress-bar">
                            <template>
                                <el-progress type="circle" :width="52" :stroke-width="10" :percentage="Number(safetyCheckObj.planPercent)"></el-progress>
                            </template>
                        </div>
                        <div class="progress-list">
                            <p>计划检查数<span> {{safetyCheckObj.planTotalNum}}</span></p>
                            <p>实际检查数<span class="cf"> {{safetyCheckObj.hadCheckNum}}</span></p>
                        </div>
                    </div>
                    <div class="progress">
                        <div class="progress-bar">
                            <template>
                                <el-progress type="circle" :width="52" :stroke-width="10" :percentage="Number(safetyCheckObj.problemPercent)"></el-progress>
                            </template>
                        </div>
                        <div class="progress-list">
                            <p>问题数<span> {{safetyCheckObj.problemNum}}</span></p>
                            <p>销项数<span class="cf"> {{safetyCheckObj.finishNum}}</span></p>
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
</template>

<script>

import { operationMixin } from './mixin.js'
// import { mapMutations } from 'vuex'
export default {
    mixins: [operationMixin],
    data() {
        this.extend = {
            'xAxis.0.axisLabel.color': '#fff',//x轴文本颜色
            'yAxis.0.axisLabel.color': "#fff",
            'yAxis.0.axisLine.lineStyle.color': "rgba(68,210,255,0.5)",
        }
        this.grid = {
            // show: true,
            top: 38,
            left: 0,
            // borderColor: '#000'
        }
        this.progressChartSettings = {
            yAxisName: ['数量']
        }
        this.pieGrid = {
            show: false,
            top: 10,
            left: 0,
            borderColor: '#000'
        }
        this.chartSettings = {
            radius: [40, 60],
            offsetY: 70,
            hoverAnimation:false,
            label:{
                show:false
            }
        }
        this.pieChartSettings = {
            radius: 60,
            offsetY: 90
        }
        return {
            Statis:[],
            qualityFlag:'month',
            areaFlag:'procedure',
            safetyFlag:'month',
            totalSchedule:0,//累计进度
            qualityCheckObj:{},//质量数量统计对象
            safetyCheckObj:{},//安全数量统计对象
            unitList:[],//参建单位列表
            checkItemVal:"",
            pageIndex:1,
            CheckItemTotalCount:0,
            CheckItemList:[],
            chartData: {},
            statusChartData: {},
            problemChartData: {},//问题统计图表
            areaChartData: {},//楼栋总览检查项图表
            workFlag: "month",
            projectObj:{},
            lf: {},
            projUid: '',//当前项目id
        }
    },
    mounted() {
        
        this.projUid=this.$route.query.projUid;
        
        this.initDatas()
    },
    methods: {
        // ...mapMutations([
        // 'setFormConfig'
        // ]),
        initDatas(projUid){
            if(projUid){
                this.projUid=projUid;
            }
            this.loadgetTrackData();
            this.getProjectData(this.projUid);
            this.getProgressChart();
            this.getCheckNumStatistics("quality");
            this.getCheckNumStatistics("safety");
            this.getCheckNumRanking();//获取问题统计数据
            this.getProcedureCount();//获取工序数量统计数据
            this.getMeasureCount();//获取实测数量统计数据
        },
        initBackground(child){
            if(!child.numObj||child.numObj.totalNum==0){
                return "rgb(204, 204, 204)";//无任务
            }else if(child.numObj.totalNum==child.numObj.notConstructionCount){//未施工
                return "rgba(240, 139, 0,1)";
            }else if(child.numObj.totalNum==child.numObj.finishNum){//已完成
                return "rgba(91, 198, 201,1)";
            }else{//施工中
                return "rgba(242, 109, 95,1)";
            }
            
        },
        getCheckObj(checkType){
            let obj = this.checkNumList.find(item=>item.checkType===checkType);
            if(obj){
                return obj;
            }else{
                return {
                    totalCount:0,
                    finishPercent:0,
                    onTimePercent:0
                };
            }
        },
         // 获取进度图表数据
        getProgressChart(){
            let params ={
                projUid:this.projUid
            }
            this.util.restGet('/api_v1/modules/statistics/progressChart', params,(res)=>{
                if(res.status == 200&&res.data){
                    this.totalSchedule = res.data.totalSchedule;
                    this.chartData={
                        columns:['monthNum','计划','实际'],
                        rows:res.data.dataList
                    }
                }else{
                    
                }
            })
        },
        loadgetTrackData(){
            this.Statis=[]
            let params={
                projUid:this.projUid,
                parentUid:"root"
            };
            this.util.mask();
            this.util.restGet('/api_v1/business/processWeChat/searchProcessStatistics',params,res=>{
                this.util.unmask();
                if(res.status==200&&res.data){
                    this.Statis = res.data.data;
                    
                }
            });
        },
        initCheckName(checkType){
            if(checkType=='quality'){
                return "质量";
            }else if(checkType=='safety'){
                return "安全";
            }else if(checkType=='measure'){
                return "实测";
            }else if(checkType=='procedure'){
                return "工序";
            }
        },
        changeAreaFlag(value){
            if(value){
                this.areaFlag = value;
            }
            if(value!="procedure"||!value){
                this.getCheckItemData();
                this.getCheckStatus();
                this.getParData();
                this.getRecordCheckItems();
            }
            
        },
        // 获取项目信息数据
        getProjectData(projUid) {
            var params = {
                id: projUid
            }
            this.$parent.selectProj =projUid;
            this.util.restGet("/api_v1/business/project/getProjectById",params,(res)=>{
                if(res.status==200&&res.data){
                    let projInfo={
                        id:res.data.id,
                        projName:res.data.XMMC_,
                        proName:res.data.XMMC_,
                        startDate:res.data.START_DATE_,
                        endDate:res.data.END_DATE_,
                        classify:res.data.CLASSIFY_,
                        principalName:res.data.PRINCIPAL_NAME_,
                    }
                    this.unitList = res.data.unit? res.data.unit:[];
                    // this.$store.commit("projectName",res.data.XMMC_)
                    // this.cookieUtil.set('projectNode',JSON.stringify(projInfo));
                    // this.setFormConfig({formKey:'_session_proj' + this.sessionUtil.getUser().id, data:projInfo})
                    // window.localStorage.setItem('_session_proj' + this.sessionUtil.getUser().id, JSON.stringify(projInfo))
                    // this.cookieUtil.set('sessionProj', projInfo)

                    // this.$store.state.selectProjectObj=projInfo
                    this.projectObj = projInfo;
                }
                this.util.unmask();
            });
        },
        initUnitName(value){
            let unitObj =this.unitList.find(item=>item.UNIT_TYPE_===value);
            if(unitObj){
                return unitObj.UNIT_NAME_;
            }else{
                return "";
            }
        },
        // 获取检查数量统计数据
        getCheckNumStatistics(checkType) {
            var params = {
                checkType: checkType,
                projUid:this.projUid,
                dateTime:checkType=='quality'? this.qualityFlag:this.safetyFlag
            }
            this.util.mask();
            this.util.restGet('/api_v1/modules/statistics/checkCount', params,(res)=>{
                this.util.unmask();
                if(res.status == 200&&res.data){
                    res.data.planPercent=res.data.planTotalNum==0? 0:((res.data.hadCheckNum/res.data.planTotalNum)*100).toFixed(1)
                    res.data.problemPercent=res.data.problemNum==0? 0:((res.data.finishNum/res.data.problemNum)*100).toFixed(1)
                    if(checkType=="quality"){
                        this.qualityCheckObj = res.data;
                    }else{
                        this.safetyCheckObj = res.data;
                    }
                }
            })
        },
        // 获取检查项分布数据
        getCheckItemData() {
            var params = {
                projUid:this.projUid,
                checkType: this.areaFlag,
                areaUid:this.areaValue,
                status:this.checkStatus,
                checkItemUid:this.checkItemVal,
                pageIndex:this.pageIndex,
                pageSize:10
            }
            this.util.restGet('/api_v1/modules/statistics/checkItemRanking', params,(res)=>{
                this.CheckItemTotalCount = res.totalCount;
                if(res.status == 200&&res.data){
                    res.data.forEach(item=>{
                        item.percent = res.totalCount==0? 0:(item.count*100/res.totalCount).toFixed(1)
                    });
                    this.CheckItemList = res.data;
                    this.areaChartData={
                        columns: ['itemName', 'count'],
                        rows: res.data
                    }
                }else{
                    this.CheckItemList=[];
                }
            })
        },
    },
}
</script>

<style scoped>
.box-title{
    float: right;
    font-size: 14px;
    color: #fff;
    padding-top: 3px;
}
.box-title span{
    flex: 1;
    padding-right: 78px;
}
.collect {
    width: 50%;
    float: left;
    box-sizing: border-box;
}
 .collect-part1 {
        border-right: 1px solid rgba(255,255,255,0.3); 
        padding-right: 10px;
    }
.parcess_head{
    width:100%;
    padding:3px 13px;
    border-bottom:1px solid rgba(68,210,255,1);
    box-sizing: border-box;
    display: flex;
    margin-bottom: 10px;
  }
  .parcess_head .item_head{
    margin-right: 20px;
  }
.Statistics_textall{
    width:100%;
    box-sizing: border-box;
    overflow: auto;
    height: calc(100% - 40px);
    white-space: nowrap;
    color:#fff;
    clear:left;
    margin-top: 40px;
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
    display: block;
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



     .header_status{
        float:left;
        display: flex;
        margin-left: 10px;
        height:24px;
        line-height: 24px;
    }
    .header_status div{
        margin:0 5px;
        color:#fff;
    }
    .header_status span{
        color:#fff;
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
    .info {
        position: absolute;
        left: 0;
        top: 0;
        background: #fff;
        color: #000;
        z-index: 99;
        width: 257px;
        height: auto;
        box-sizing: border-box;
        text-align: left;
    }
    .info .info-top {
        padding: 10px 10px 0;
        border-bottom: 1px solid rgba(163,165,168,0.2);
    }
    .info h5 {
        font-size: 18px;
        color: rgba(51,51,51,1);
        margin: 0;
    }
    .info img {
        width: 237px;
        height: 121px;
        display: block;
        background: #000;
        margin: 10px auto;
    }
    .info .proj-progress {
        color: rgba(51,51,51,1);
        font-size: 14px;
    }
    .info .proj-progress p i {
        display: inline-block;
        vertical-align: top;
        width: 14px;
        height: 19px;
        background: url(../../../assets/image/indexImg/site.png) no-repeat 0 0;
        background-size: contain;
        margin-right: 10px;
    }
    .info .proj-progress p {
        margin-bottom: 10px;
        line-height: 19px;
    }
    .info-bottom {
        padding: 10px;
        font-size: 14px;
    }
    .info-bottom .proj-details  span {
        color: rgba(245,166,35,1);
        display: block;
        margin-bottom: 10px;
    }
    .info-bottom .btn-wrap {
        display: flex;
        justify-content: flex-end;
    }
    .info-bottom .btn-wrap span {
        width: 60px;
        height: 28px;
        line-height: 28px;
        box-sizing: border-box;
        text-align: center;
    }
    .info-bottom .btn-wrap .close-btn {
        border: 1px solid #ccc;
        color: rgba(102,102,102,1);
        margin-right: 20px;
    }
    .info-bottom .btn-wrap .home-btn {
        background: rgba(92,154,212,1);
        color: #fff;
    }
    .map-wrap {
        position: relative;
    }
    .map-wrap >>> .amap-toolbar {
        right: 10px;
        left: auto!important;
        top: auto!important;
        bottom: 10px;
    }
    .map-wrap >>> .el-carousel__indicators {
        bottom: 8px;
    }
    .map-item > div {
        width: 100%; 
        height: 100%
    }
    .mychart {
        height: 85%;
        width: 100%;
    }
    #myChart {
        height: 100%;
        width: 100%;
    }
    .sercurity-tab {
        position: relative;
        width: 100%;
    }
    .sercurity {
        height: 100%;
        margin-bottom: 10px;
    }
    .right-bottom {
        height: 30%;
    }
    .right-top {
        height: 70%;
    }
    
    .monitoring-part2 {
        padding-left: 10px;
    }
    .center-bottom {
        height: 30%;
    }
    .map-item {
        height: 100%;
        width: 100%;
        padding-bottom: 50px;
        box-sizing :border-box;
    }
    .map-wrap {
        height: 100%;
    }
    .center-top {
        height: 70%;
    }
    .progress-list {
        overflow: hidden;
    }
    .progress-bar {
        float:right;
        width:60px;
    }
    .left-top {
        height: 70%;
    }
    .left-top > div,
    .right-top > div {
        height: 100%;
    }
    .left-bottom {
        height: 30%;
    }
    #mapChart canvas{
        height: 300px;
        width: 100%;
    }
    .home-page {
        padding: 0;
    }
    .home-page h4 {
        color: rgba(68,210,255,1);
    }
    .box-left {
        width: 20%;
        height: 100%;
    }
    .box-center {
        width: 60%;
        height: 100%;
    }
    .box-right {
        width: 20%;
        height: 100%;
    }
    .proj-box>div {
        float: left;
        padding-right: 10px;
        box-sizing: border-box;
    }
    .cf {
        color: #F5A623;
    }
    .tab-wrap {
        margin-top: 0;
        border: none;
        padding-left: 0;
    }
    .progress {
        background: rgba(68,210,255,0.2);
        height: 63px;
        overflow: hidden;
        width: 100%;
        padding: 7px 0;
        box-sizing: border-box;
        margin-bottom: 5px;
    }
    .progress > div p {
        padding: 0 0 13px 18px;
        text-align: left
    }
    .progress > div p span {
        padding-left: 22px;
    }
    .progress > div p .cf {
        font-size: 18px;
    }
    .monitoring {
        width: 100%;
        float: left;
        box-sizing: border-box;
    }
    .monitoring > p {
        margin-bottom: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
    }
    .monitoring > p span {
        flex: 1;
    }
    .page-proj-index, .proj-left {
        height: 100%;
    }
    .proj-synopsis {
        color: #fff;
        font-size: 14px;
        text-align-last: left;
        height: 100%;
        position: relative;
    }
    .current-year-proj {
        border-bottom: 1px solid rgba(255,255,255,0.3);
        max-height: 89px;
        overflow: auto;
    }
    .current-year-proj > div {
        padding: 3px 0;
        display: flex;
        justify-content: space-between;
    }
    .current-year-proj > div i {
        color: #F5A623;
        padding-left: 5px;
    }
    .area-proj p {
        padding: 3px 0;
    }
    .area-list {
        width: 100%;
        position: absolute;
        left: 0;
        top: 126px;
        bottom: 0;
        margin: auto;
        height: auto;
        overflow-y: auto;
    }
    .area-list > button:nth-of-type(1n) {
        float: left;
    }
    .area-list > button:nth-of-type(2n) {
        float: right;
    }
    i {
        font-style: normal;
    }
    .area-list > button {
        width: 40%;
        height: 20px;
        line-height: 20px;
        background: rgba(68,210,255,0.2);
        margin-top: 12px;
        padding: 0 10px;
        display: inline-flex;
        justify-content: space-between;
    }
    .area-list > button i {
        color: rgba(245,166,35,1);
    }
    .home-page >>> .el-carousel__button {
        width: 10px;
        height: 10px;
        border-radius: 50%;
    }
    .tabs1 {
        display: flex;
        border: 0 none;
        padding: 0;
    }
    .proj-list {
        display: flex;
        height: 10%;
        font-size: 16px;
        line-height: 16px;
    }
    .proj-list i {
        width: 16px;
        height: 16px;
        font-size: 14px;
        background: #fff;
        color: rgba(0,0,18,1);
        border-radius: 20px;
        margin-right: 15px;
    }   
    .proj-list:nth-of-type(1) {
        margin-top: 2px;
    }
    .proj-list:nth-of-type(1) i {
        background-color: rgba(255,14,0,1);
    }
    .proj-list:nth-of-type(2) i {
        background-color: rgba(250,83,48,1);
    }
    .proj-list:nth-of-type(3) i {
        background-color: rgba(255,138,96,1);
    }
    .container >>> .el-pagination {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        bottom: 20px;
    }
    .container >>> .el-pager li {
        color: #fff;
        width: 10px;
        height: 10px;
        margin-right: 28px;
        padding: 0;
        min-width: auto;
        overflow: hidden;
    }
    .container >>> .el-pager li.active {
        color: #F5A623;
        background: #F5A623;
    }
    .container {
        height: 100%;
        position: relative;
    }
    .dot-wrap {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 20px;
        text-align: center;
    }
    .dot-wrap span{
        width: 10px;
        height: 10px;
        background: #fff;
        display: inline-block;
        margin-right: 20px;
        cursor: pointer;
        border-radius: 50%;
    }
    .dot-wrap span.act {
        background-color: rgba(245,166,35,1);
    }
    .proj-con {
        height: 85%;
        overflow: hidden;
    }
    .noResult {
        position: absolute;
        left: 0;
        right: 0;
        margin: auto;
        color: #ccc;
        top: 45%;
        text-align-last: center;
    }
    .right-top .more {
        position: absolute;
        right: 10px;
        top: 20px;
        font-size: 14px;
        cursor: pointer;
    }
    .popUp-wrap {
        position: fixed;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: 400px;
        height: 440px;
        background: #fff;
        z-index: 100;
        color: rgba(51,51,51,1);
        padding: 10px;
        box-sizing: border-box;
    }
    .popUp-wrap span {
        display: block;
        font-size: 18px;
        text-align: left;
    }
    .popUp-wrap p {
        font-size: 14px;
        line-height: 14px;
    }
    .popUp-wrap i {
        background:  rgba(216,216,216,1);
    }
    .popUp-wrap .proj-list:nth-of-type(1) {
        margin-top: 10px;
    }
    .popUp-wrap .btn-wrap {
        text-align: right;    
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
    .popUp-wrap .btn-wrap button {
        width: 60px;
        height: 28px;
        display: inline-block;
        margin-right: 20px;
        border: 1px solid #ccc;
        font-size: 14px;
        line-height: 28px;
        text-align: center;
        cursor: pointer;
        background: #fff;
        color: rgba(102,102,102,1);
        padding: 0;
    }
    .popUp-wrap .btn-wrap button.preDis {
        background: #ddd;
    }
    .popUp-wrap .btn-wrap button.nextDis {
        background: #ddd;
    }
    .popUp-wrap .btn-wrap button:hover {
        background: rgba(92,154,212,1);
        color: #fff;
    }
    .popUp-wrap .btn-wrap button.preDis:hover,
    .popUp-wrap .btn-wrap button.nextDis:hover {
        background: #ddd;
        color: rgba(102,102,102,1);
    }
    .popUp-wrap .btn-wrap button:last-of-type {
        margin-right: 0;
    }
    .xAxis-label {
        position: absolute;
        width:100%;
        bottom:-20px;
        text-align:center;
    }
</style>

<style>
    .progress .el-progress-bar .el-progress-bar__inner {
        border-radius: 0 ;
        background-image: linear-gradient(left, #06FCFF 0%, #20A5FF 100%);
    }
    .bg .progress .el-progress__text {
        font-size: 14px!important;
    }
</style>

