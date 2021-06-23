<template>
    
<!--main-->
<div class="data_content" style="padding-top:20px;color: #fff;font-size: 14px;">
    <!-- <div class="data_time">
        温馨提示: 点击模块后跳转至详情页面。        
    </div> -->

    <div class="data_main">
        <div class="main_left fl">
            <div class="left_1 t_btn6" style="cursor: pointer;">
                <!--左上边框-->
                <div class="t_line_box">
                    <i class="t_l_line"></i> 
                    <i class="l_t_line"></i> 
                </div> 
                <!--右上边框-->
                <div class="t_line_box">
                    <i class="t_r_line"></i> 
                    <i class="r_t_line"></i> 
                </div> 
                <!--左下边框-->
                <div class="t_line_box">
                    <i class="l_b_line"></i> 
                    <i class="b_l_line"></i> 
                </div> 
                    <!--右下边框-->
                    <div class="t_line_box">
                    <i class="r_b_line"></i> 
                    <i class="b_r_line"></i> 
                </div> 
                <div class="main_title" @click="loadProjData('all')">
                    <img src="../static/picture/t_1.png" alt="">
                  项目信息
                </div>
                <div class="current-year-proj">
                    <p class="cf">{{projectObj.projName}}</p>
                    <div>
                        <span>项目类型<i>{{projectObj.classify}}</i></span>
                        <span>合同工期<i>{{projectObj.duration}}天</i></span>
                    </div>
                    <div>
                        <span>开工日期<i>{{projectObj.startDate? projectObj.startDate:'空'}}</i></span>
                        <span>竣工日期<i>{{projectObj.endDate? projectObj.endDate:'空'}}</i></span>
                    </div>
                </div>
                <div class="area-proj">
                    <p>项目负责人: <span>{{projectObj.principalName}}</span></p>
                    <p>管理公司: <span>{{initUnitName('管理公司')}}</span></p>
                    <p>监理单位: <span>{{initUnitName('监理单位')}}</span></p>
                    <p>设计单位: <span>{{initUnitName('设计单位')}}</span></p>
                    <p>施工单位: <span>{{initUnitName('施工单位')}}</span></p>
                </div>
                
            </div>
            <div class="left_2" style="cursor: pointer;margin-top: 30px;height: 300px;">
                <div class="t_line_box">
                    <i class="t_l_line"></i> 
                    <i class="l_t_line"></i> 
                </div> 
                <div class="t_line_box">
                    <i class="t_r_line"></i> 
                    <i class="r_t_line"></i> 
                </div> 
                <div class="t_line_box">
                    <i class="l_b_line"></i> 
                    <i class="b_l_line"></i> 
                </div> 
                    <div class="t_line_box">
                    <i class="r_b_line"></i> 
                    <i class="b_r_line"></i> 
                </div> 
                <div class="main_title" style="padding-left: 15px;">
                    <img src="../static/picture/t_2.png" alt="">
                    进度情况
                </div>
                <div id="chart_2" class="chart t_btn9" style="width:100%;height: 280px;padding-top: 30px;">
                    <div style="padding-top: 5px;text-align: right;">
                        <span>累计完成进度<span style="padding-left:5px;color:green">{{totalSchedule}}%</span></span>
                    </div>
                    <ve-line :grid="grid" :colors="colors1" :settings="progressChartSettings" :data="chartData" :extend="extend" height="280px"></ve-line>
                </div>
            </div>
        </div>
        <div class="main_center fl">
            <div class="center_text" style="position: relative;">
                <!--左上边框-->
                <div class="t_line_box">
                    <i class="t_l_line"></i> 
                    <i class="l_t_line"></i> 
                </div> 
                <!--右上边框-->
                <div class="t_line_box">
                    <i class="t_r_line"></i> 
                    <i class="r_t_line"></i> 
                </div> 
                <!--左下边框-->
                <div class="t_line_box">
                    <i class="l_b_line"></i> 
                    <i class="b_l_line"></i> 
                </div> 
                 <!--右下边框-->
                 <div class="t_line_box">
                    <i class="r_b_line"></i> 
                    <i class="b_r_line"></i> 
                </div> 
                <div class="main_title" style="width: 230px;">
                    <img src="../static/picture/t_3.png" alt="">
                    楼栋总览
                </div>
                <div class="tabs tab-wrap" style="border: none;padding: 15px 15px 5px;position: relative;">
                    <span :class="{active:areaFlag == 'procedure'}" @click="changeAreaFlag('procedure')">工序进度</span>
                    <span :class="{active:areaFlag == 'quality'}" @click="changeAreaFlag('quality')">质量汇总</span>
                    <span :class="{active:areaFlag == 'safety'}" @click="changeAreaFlag('safety')">安全汇总</span>
                    <span :class="{active:areaFlag == 'measure'}" @click="changeAreaFlag('measure')">实测实量</span>
                </div>
                
                <div style="width:100%;padding-top: 30px;">
                    <div v-if="areaFlag=='procedure'" style="height: calc(100% - 40px);position: absolute;overflow: hidden;width: 100%;">
                        <div class="header_status">
                            <div><i style="background: rgb(204, 204, 204)"></i><span>无任务</span></div>
                            <div><i style="background: #FFA74D"></i><span>未施工</span></div>
                            <div><i style="background: #FF4949"></i><span>进行中</span></div>
                            <div><i style="background: #4BF0FF"></i><span>已完成</span></div>
                        </div>
                        <div class="Statistics_textall" :class="{rollStyle:noRoll}" ref="PA">
                            <div ref="A">
                                <div style="vertical-align: bottom;width:100px;display: inline-block; position:relative;"  v-for="(item,index) in Statis" :key="index">
                                    <div class="xAxis-label">
                                        <span style="text-align: center;width:50px;display: inline-block;font-size: 11px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;" @click="btnchild(item)">{{item.name}}</span>
                                    </div>

                                    <div class="Statistics_con">
                                        <span v-for="child in item.children" :style="{background:initBackground(child)}">{{child.name}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="parcess_head">
                            <div class="item_head">
                                <span>按区域:</span>
                                <span>
                                    <el-select @change="changeAreaFlag()" v-model="areaValue" size="mini" class="select-ele" placeholder="请选择">
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
                                        <el-option :label="item.itemName" :value="item.itemName" v-for="(item,index) in queryCheckItemList" :key="index"></el-option>
                                    </el-select>
                                </span>
                            </div>
                            <div class="item_head">
                                <span>检查状态:</span>
                                <span>
                                    <el-select @change="changeAreaFlag()" v-model="checkStatus" placeholder="请选择" size="mini" class="select-ele">
                                    <el-option label="全部" value=""></el-option>
                                    <el-option label="记录" value="0"></el-option>
                                    <el-option label="待指派" value="1"></el-option>
                                    <el-option label="待整改" value="2"></el-option>
                                    <el-option label="待销项" value="3"></el-option>
                                    <el-option label="已销项" value="4"></el-option>
                                    </el-select>
                                </span>
                            </div>
                        </div>
                        <div>
                            <div class="collect collect-part1 main_table">
                                <div class="tabs tab-wrap">
                                    <span class="active">问题分类</span>
                                </div>
                                <ve-pie :colors="colors" :settings="pieChartSettings" :data="areaChartData"  :legend-visible="false" height="193px"  ></ve-pie>
                                <div style="padding: 5px;">
                                    <span>共{{CheckItemTotalCount}}个</span>
                                </div>
                                <table>
                                    <tbody>
                                        <tr v-for="(item,index) in CheckItemList" :key="index">
                                            <td>{{item.itemName}}</td>
                                            <td>共{{item.count}}个,占{{item.percent}}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                            </div>
                            <div class="collect monitoring-part2 main_table">
                                <div class="tabs tab-wrap">
                                    <span class="active">状态分类</span>
                                </div>
                                <ve-pie :colors="colors" :settings="pieChartSettings" :data="statusChartData"  :legend-visible="false" height="193px"  ></ve-pie>
                                <div style="padding: 5px;">
                                    <span>共{{statusTotalCount}}个</span>
                                </div>
                                <table>
                                    <tbody>
                                        <tr v-for="(item,index) in statusList" :key="index">
                                            <td>{{item.statusName}}</td>
                                            <td>共{{item.countNum}}个,占{{item.percent}}%</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- <div class="double-style" v-for="(item,index) in statusList" :key="index">
                                    <span>{{item.statusName}}</span>
                                    <span>共{{item.countNum}}个,占{{item.percent}}%</span>
                                </div> -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- <ul class="ranking-box">
                    <li><span></span>
                        <p>省份</p>
                        <p>数量</p>
                    </li>
                    <li v-for="(item,index) in projDistrList" :key="index">
                        <span>{{index+1}}</span><p>{{item.province}}</p><p>{{item.projNum}}(个)</p>
                    </li>
                </ul> -->
            </div>
        </div>
 
        <div class="main_right fr data_bottom" style="width: 24%;margin-left: 0px;">
            <div class="right_1" style="margin-bottom: 30px;height: 609px;">
                <!--左上边框-->
                <div class="t_line_box">
                    <i class="t_l_line"></i> 
                    <i class="l_t_line"></i> 
                </div> 
                <!--右上边框-->
                <div class="t_line_box">
                    <i class="t_r_line"></i> 
                    <i class="r_t_line"></i> 
                </div> 
                <!--左下边框-->
                <div class="t_line_box">
                    <i class="l_b_line"></i> 
                    <i class="b_l_line"></i> 
                </div> 
                    <!--右下边框-->
                    <div class="t_line_box">
                    <i class="r_b_line"></i> 
                    <i class="b_r_line"></i> 
                </div> 
                <div class="main_title" style="width:220px;">
                    <img src="../static/picture/t_4.png" alt="">
                    问题统计
                </div>
                <div class="main_table t_btn2" style="margin-top: 0px;text-align: center;">
                    
                    <div class="tabs tab-wrap" style="border: none;padding-top: 30px;margin-bottom: 0px;">
                        <span :class="{active:problemFlag == 'month'}" @click="problemFlag ='month';getCheckNumRanking()">本月</span>
                        <span :class="{active:problemFlag == 'year'}" @click="problemFlag ='year';getCheckNumRanking()">本年</span>
                        <span :class="{active:problemFlag == 'all'}" @click="problemFlag ='all';getCheckNumRanking()">全部</span>
                    </div>
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th>问题数</th>
                            <th>完结率</th>
                            <th>按时完结率</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>质量</td>
                                <td>{{qualityNumObj.totalCount}}</td>
                                <td>{{qualityNumObj.finishPercent}}%</td>
                                <td>{{qualityNumObj.onTimePercent}}%</td>
                            </tr>
                            <tr>
                                <td>安全</td>
                                <td>{{safetyNumObj.totalCount}}</td>
                                <td>{{safetyNumObj.finishPercent}}%</td>
                                <td>{{safetyNumObj.onTimePercent}}%</td>
                            </tr>
                            <tr>
                                <td>工序</td>
                                <td>{{procedureNumObj.totalCount}}</td>
                                <td>{{procedureNumObj.finishPercent}}%</td>
                                <td>{{procedureNumObj.onTimePercent}}%</td>
                            </tr>
                            <tr>
                                <td>实测</td>
                                <td>{{measureNumObj.totalCount}}</td>
                                <td>{{measureNumObj.finishPercent}}%</td>
                                <td>{{measureNumObj.onTimePercent}}%</td>
                            </tr>
                            <tr>
                                <td>总计</td>
                                <td>{{totalNumObj.totalCount}}</td>
                                <td>{{(totalNumObj.finishPercent*100).toFixed(1)}}%</td>
                                <td>{{(totalNumObj.onTimePercent*100).toFixed(1)}}%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- <div id="chart_3" class="echart t_btn7" style="width:100%;height: 607px;"></div> -->
                <div style="position: relative;padding-top: 15px;" class="echart t_btn7">
                    <!-- <span style="position: absolute;top: 61px;left: 138px;font-size: 13px;">{{problemFlag == 'month'? '本月问题分布':'本年问题分布'}}</span> -->
                    <ve-ring :colors="colors" :title="problmtitle" :data="problemChartData" :extend="extend" :settings="chartSettings"  height="263px" ></ve-ring>
                </div>
            </div>
            
        </div>
    </div>
    <div class="data_bottom">
        <div class="bottom_1 fl t_btn5" style="cursor: pointer;">
            <div class="t_line_box">
                <i class="t_l_line"></i> 
                <i class="l_t_line"></i> 
            </div> 
            <div class="t_line_box">
                <i class="t_r_line"></i> 
                <i class="r_t_line"></i> 
            </div> 
            <div class="t_line_box">
                <i class="l_b_line"></i> 
                <i class="b_l_line"></i> 
            </div> 
                <div class="t_line_box">
                <i class="r_b_line"></i> 
                <i class="b_r_line"></i> 
            </div>
           <div class="main_title" style="padding-left: 15px;">
                <img src="../static/picture/t_7.png" alt="">
                质量
            </div>
            <div class="main_table t_btn8">
                <div style="padding: 10px;">
                    <div class="tabs tab-wrap">
                        <span :class="{active:qualityFlag == 'month'}" @click="qualityFlag='month';getCheckNumStatistics('quality')">本月</span>
                        <span :class="{active:qualityFlag == 'year'}" @click="qualityFlag='year';getCheckNumStatistics('quality')">本年</span>
                        <span :class="{active:qualityFlag == 'all'}" @click="qualityFlag='all';getCheckNumStatistics('quality')">全部</span>
                    </div>
                    <div class="progress" style="margin-bottom: 98px;">
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
                
            </div>
            
        </div>
        <div class="bottom_center fl">
            <div class="bottom_2 fl">
                <div class="t_line_box">
                    <i class="t_l_line"></i> 
                    <i class="l_t_line"></i> 
                </div> 
                <div class="t_line_box">
                    <i class="t_r_line"></i> 
                    <i class="r_t_line"></i> 
                </div> 
                <div class="t_line_box">
                    <i class="l_b_line"></i> 
                    <i class="b_l_line"></i> 
                </div> 
                    <div class="t_line_box">
                    <i class="r_b_line"></i> 
                    <i class="b_r_line"></i> 
                </div>
                <div class="main_title" style="width:300px;left:40%;">
                    <img src="../static/picture/t_7.png" alt="">
                    工序
                </div>
                
                <div class="main_table t_btn8" style="text-align: center;">
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th>本月</th>
                            <th>上月</th>
                            <th>本年</th>
                            <th>全部</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>计划施工数</td>
                            <td>{{procedureCountObj.monthPlanNum? procedureCountObj.monthPlanNum:0}}</td>
                            <td>{{procedureCountObj.lastMonthPlanNum? procedureCountObj.lastMonthPlanNum:0}}</td>
                            <td>{{procedureCountObj.yearPlanNum? procedureCountObj.yearPlanNum:0}}</td>
                            <td>{{procedureCountObj.allPlanNum? procedureCountObj.allPlanNum:0}}</td>
                        </tr>
                        <tr>
                            <td>实际施工数</td>
                            <td>{{procedureCountObj.monthActNum? procedureCountObj.monthActNum:0}}</td>
                            <td>{{procedureCountObj.lastMonthActNum? procedureCountObj.lastMonthActNum:0}}</td>
                            <td>{{procedureCountObj.yearActNum? procedureCountObj.yearActNum:0}}</td>
                            <td>{{procedureCountObj.allActNum? procedureCountObj.allActNum:0}}</td>
                        </tr>
                        <tr>
                            <td>施工合格数</td>
                            <td>{{procedureCountObj.monthPassNum? procedureCountObj.monthPassNum:0}}</td>
                            <td>{{procedureCountObj.lastMonthPassNum? procedureCountObj.lastMonthPassNum:0}}</td>
                            <td>{{procedureCountObj.yearPassNum? procedureCountObj.yearPassNum:0}}</td>
                            <td>{{procedureCountObj.allPassNum? procedureCountObj.allPassNum:0}}</td>
                        </tr>
                        <tr>
                            <td>施工合格率</td>
                            <td>{{procedureCountObj.monthPassPercent}}%</td>
                            <td>{{procedureCountObj.lastMonthPassPercent}}%</td>
                            <td>{{procedureCountObj.yearPassPercent}}%</td>
                            <td>{{procedureCountObj.allPassPercent}}%</td>
                        </tr>
                        <tr>
                            <td>问题数</td>
                            <td>{{procedureCountObj.monthProblemNum? procedureCountObj.monthProblemNum:0}}</td>
                            <td>{{procedureCountObj.lastMonthProblemNum? procedureCountObj.lastMonthProblemNum:0}}</td>
                            <td>{{procedureCountObj.yearProblemNum? procedureCountObj.yearProblemNum:0}}</td>
                            <td>{{procedureCountObj.allProblemNum? procedureCountObj.allProblemNum:0}}</td>
                        </tr>
                        <tr>
                            <td>完结数</td>
                            <td>{{procedureCountObj.monthFinishNum? procedureCountObj.monthFinishNum:0}}</td>
                            <td>{{procedureCountObj.lastMonthFinishNum? procedureCountObj.lastMonthFinishNum:0}}</td>
                            <td>{{procedureCountObj.yearFinishNum? procedureCountObj.yearFinishNum:0}}</td>
                            <td>{{procedureCountObj.allFinishNum? procedureCountObj.allFinishNum:0}}</td>
                        </tr>
                        <tr>
                            <td>整改完结率</td>
                            <td>{{procedureCountObj.monthFinishPercent}}%</td>
                            <td>{{procedureCountObj.lastMonthFinishPercent}}%</td>
                            <td>{{procedureCountObj.yearFinishPercent}}%</td>
                            <td>{{procedureCountObj.allFinishPercent}}%</td>
                        </tr>
                        </tbody>
                    </table>
                    
                </div>
                
            </div>
            <div class="bottom_3 fl">
                <div class="t_line_box">
                    <i class="t_l_line"></i> 
                    <i class="l_t_line"></i> 
                </div> 
                <div class="t_line_box">
                    <i class="t_r_line"></i> 
                    <i class="r_t_line"></i> 
                </div> 
                <div class="t_line_box">
                    <i class="l_b_line"></i> 
                    <i class="b_l_line"></i> 
                </div> 
                    <div class="t_line_box">
                    <i class="r_b_line"></i> 
                    <i class="b_r_line"></i> 
                </div>
                <div class="main_title" style="width:260px;left:45%;">
                    <img src="../static/picture/t_7.png" alt="">
                   实测实例
                </div>
                <div class="main_table t_btn2" style="text-align: center;">
                    
                    <table>
                        <thead>
                        <tr>
                            <th></th>
                            <th>本月</th>
                            <th>上月</th>
                            <th>本年</th>
                            <th>全部</th>
                        </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>计划检查数</td>
                            <td>{{measureCountObj.monthPlanNum? measureCountObj.monthPlanNum:0}}</td>
                            <td>{{measureCountObj.lastMonthPlanNum? measureCountObj.lastMonthPlanNum:0}}</td>
                            <td>{{measureCountObj.yearPlanNum? measureCountObj.yearPlanNum:0}}</td>
                            <td>{{measureCountObj.allPlanNum? measureCountObj.allPlanNum:0}}</td>
                        </tr>
                        <tr>
                            <td>实际检查数</td>
                            <td>{{measureCountObj.monthActNum? measureCountObj.monthActNum:0}}</td>
                            <td>{{measureCountObj.lastMonthActNum? measureCountObj.lastMonthActNum:0}}</td>
                            <td>{{measureCountObj.yearActNum? measureCountObj.yearActNum:0}}</td>
                            <td>{{measureCountObj.allActNum? measureCountObj.allActNum:0}}</td>
                        </tr>
                        <tr>
                            <td>测量合格数</td>
                            <td>{{measureCountObj.monthPassNum? measureCountObj.monthPassNum:0}}</td>
                            <td>{{measureCountObj.lastMonthPassNum? measureCountObj.lastMonthPassNum:0}}</td>
                            <td>{{measureCountObj.yearPassNum? measureCountObj.yearPassNum:0}}</td>
                            <td>{{measureCountObj.allPassNum? measureCountObj.allPassNum:0}}</td>
                        </tr>
                        <tr>
                            <td>测量合格率</td>
                            <td>{{measureCountObj.monthPassPercent}}%</td>
                            <td>{{measureCountObj.lastMonthPassPercent}}%</td>
                            <td>{{measureCountObj.yearPassPercent}}%</td>
                            <td>{{measureCountObj.allPassPercent}}%</td>
                        </tr>
                        <tr>
                            <td>问题数</td>
                            <td>{{measureCountObj.monthProblemNum? measureCountObj.monthProblemNum:0}}</td>
                            <td>{{measureCountObj.lastMonthProblemNum? measureCountObj.lastMonthProblemNum:0}}</td>
                            <td>{{measureCountObj.yearProblemNum? measureCountObj.yearProblemNum:0}}</td>
                            <td>{{measureCountObj.allProblemNum? measureCountObj.allProblemNum:0}}</td>
                        </tr>
                        <tr>
                            <td>完结数</td>
                            <td>{{measureCountObj.monthFinishNum? measureCountObj.monthFinishNum:0}}</td>
                            <td>{{measureCountObj.lastMonthFinishNum? measureCountObj.lastMonthFinishNum:0}}</td>
                            <td>{{measureCountObj.yearFinishNum? measureCountObj.yearFinishNum:0}}</td>
                            <td>{{measureCountObj.allFinishNum? measureCountObj.allFinishNum:0}}</td>
                        </tr>
                        <tr>
                            <td>整改完结率</td>
                            <td>{{measureCountObj.monthFinishPercent}}%</td>
                            <td>{{measureCountObj.lastMonthFinishPercent}}%</td>
                            <td>{{measureCountObj.yearFinishPercent}}%</td>
                            <td>{{measureCountObj.allFinishPercent}}%</td>
                        </tr>
                        </tbody>
                    </table>
                    
                </div>
                
            </div>
        </div>
        <div class="bottom_4 fr" style="height: 377px;">
            <div class="t_line_box">
                <i class="t_l_line"></i> 
                <i class="l_t_line"></i> 
            </div> 
            <div class="t_line_box">
                <i class="t_r_line"></i> 
                <i class="r_t_line"></i> 
            </div> 
            <div class="t_line_box">
                <i class="l_b_line"></i> 
                <i class="b_l_line"></i> 
            </div> 
                <div class="t_line_box">
                <i class="r_b_line"></i> 
                <i class="b_r_line"></i> 
            </div>
            <div class="main_title">
                <img src="../static/picture/t_7.png" alt="">
                安全
            </div>
            <div class="main_table t_btn3 table_zdy" style="text-align: center;">
                <div class="tabs tab-wrap">
                    <span :class="{active:safetyFlag == 'month'}" @click="safetyFlag='month';getCheckNumStatistics('safety')">本月</span>
                    <span :class="{active:safetyFlag == 'year'}" @click="safetyFlag='year';getCheckNumStatistics('safety')">本年</span>
                    <span :class="{active:safetyFlag == 'all'}" @click="safetyFlag='all';getCheckNumStatistics('safety')">全部</span>
                </div>
                <div class="progress" style="margin-bottom: 98px;">
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
            legend: {
                textStyle: {
                    color: "#fff", //图例字体颜色
                }
            },
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
            radius: [60, 90],
            offsetY: 130,
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
            problmtitle: {},
            noRoll:false,//是否有滚动条
            colors1:['#FF4949','#FFA74D','#FFEA51'],
            colors: ['#4BF0FF','#44AFF0','#4E82FF','#584BFF','#BE4DFF','#F845F1'],
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
                return "#FFA74D";
            }else if(child.numObj.totalNum==child.numObj.finishNum){//已完成
                return "#4BF0FF";
            }else{//施工中
                return "#FF4949";
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
                    this.$nextTick(()=>{
                        if(this.$refs.PA) {
                            this.$refs.PA.scrollTop = 100000;
                        }
                        if(this.$refs.A) {
                            if(this.$refs.A.offsetHeight > this.$refs.PA.offsetHeight) {
                                // 有滚动条
                                this.noRoll=false;
                            } else {
                                // 无滚动条
                                this.noRoll =true;
                            }
                        }
                    });
                    
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
                        duration:res.data.sj,
                    }
                    // projInfo.duration=this.getDuration(projInfo.startDate,projInfo.endDate);
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
        getDuration(startDate,endDate){
            if(!startDate||!endDate){
                return "";
            }else{
                let data1=new Date(startDate)
                let data2=new Date(endDate)
                let iDays= Date.parse(data2)-Date.parse(data1)
                let Daynum=Math.floor(iDays / (24 * 3600 * 1000))
                return Daynum+1;
            }
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

 <style >

.screen-page .el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    color: #61d2f7;
}
.progress .el-progress__text {
    font-size: 13px!important;
    color: #fff;
}
</style>      
<style scoped lang="scss">
@import "../static/css/base.css";
@import "../static/css/index.css";
.rollStyle{
    position: relative;
}
.rollStyle>div:nth-child(1){
    position: absolute;
    bottom: 20px;
    left: 10px;
}
.data_content .data_bottom {
    width: calc(100% - 40px);
    height: 358px;
    margin-left: 20px;
}
.data_content .data_bottom .fl{
    height: 377px
}
.main_table th{
    font-size: 12px;
    font-weight: 600;
    color:#61d2f7;
    text-align: center;
}

.main_table table{
    width: 100%;
}
.main_table td{
    color:#fff;
    font-size: 10px;
    text-align: center;
}
.main_table tr{
    height: 42px;
}
.main_table tbody tr:nth-child(1),
.main_table tbody tr:nth-child(3),
.main_table tbody tr:nth-child(5),
.main_table tbody tr:nth-child(7){
    background-color: #072951;
    box-shadow:-10px 0px 15px #2C58A6 inset,   /*左边阴影*/
    10px 0px 15px #2C58A6 inset;  /*右边阴影*/
}
.tabs{
    border: none;
}
.tabs>span{
    color:#61d2f7;
}
.tabs>.active{
    background: url(../../../assets/indexImg/select.png) no-repeat  top center;
    background-size: cover;
    color: #fff;
    // padding: 5px 10px;
}
.pagination__dark{
    position: absolute;
    bottom: 0px;
    z-index: 888;
    width: 100%;
}

.screen-page{
    position: absolute;
    border: 1px solid #0E94EA;
    z-index: 888;
    top: 18px;
    right: 0px;
}
.current-year-proj {
    padding: 3px 8px;
    border-bottom: 1px solid rgba(255,255,255,0.3);
    max-height: 89px;
    overflow: auto;
    margin-top: 26px;
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
.area-proj{
    padding: 3px 8px;
}
.area-proj p {
    padding: 3px 0;
}
.header_status{
    float:left;
    display: flex;
    margin-left: 10px;
    height:24px;
    line-height: 24px;
    position: absolute;top: 0;left: 0;z-index: 2;
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

.Statistics_textall{
    width:100%;
    box-sizing: border-box;
    overflow: auto;
    height: calc(95% - 40px);
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
    border-bottom:1px solid rgba(68,210,255,0.5)
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
.xAxis-label {
    position: absolute;
    width:100%;
    bottom:-20px;
    text-align:center;
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
    display: flex;
}
.item_head span:nth-child(1){
    line-height: 28px;
}
.item_head span:nth-child(2){
    flex: 1;
    line-height: 28px;
    padding-left: 5px;
}
.collect {
    width: 50%;
    float: left;
    box-sizing: border-box;
    height: 491px;
}
 .collect-part1 {
    border-right: 1px solid rgba(255,255,255,0.3); 
    
}

.progress-list {
    overflow: hidden;
}
.progress-bar {
    float:right;
    width:60px;
}
.progress {
    // background: rgba(68,210,255,0.2);
    background-color: #072951;
    box-shadow:-10px 0px 15px #2C58A6 inset,   /*左边阴影*/
    10px 0px 15px #2C58A6 inset;  /*右边阴影*/
    height: 83px;
    overflow: hidden;
    width: 100%;
    padding: 12px 0;
    box-sizing: border-box;
    margin-bottom: 25px;
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
.table-title{
    height: 42.4px;
    line-height: 42.4px;
    font-size: 12px;
    font-weight: 600;
    color: #61d2f7;
    text-align: center;
}
.table-title span{
    padding:5px 10px;
}

.info {
        position: absolute;
        left: 5px;
        top: 5px;
        background: #2c58a6;
        color: #fff;
        z-index: 99;
        width: 257px;
        height: auto;
        box-sizing: border-box;
        text-align: left;
        border-radius: 6px;
    }
    .info .info-top {
        padding: 10px 10px 0;
        border-bottom: 1px solid rgba(163,165,168,0.2);
    }
    .info h5 {
        font-size: 18px;
        // color: rgba(51,51,51,1);
        color: #fff;
        margin: 0;
    }
    .info img {
        width: 237px;
        height: 121px;
        display: block;
        background: #fff;
        margin: 10px auto;
    }
    .info .proj-progress {
        color: #fff;
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
        color: #fff;
        margin-right: 20px;
    }
    .info-bottom .btn-wrap .home-btn {
        background: rgba(92,154,212,1);
        color: #fff;
    }
.t_title{
    width: 100%;
    height: 100%;
    text-align: center;
    font-size: 2.5em;
    line-height: 80px;
    color: #fff;
}
#chart_map{
    cursor: pointer;
}
.t_show{
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 2px;
    background: #2C58A6;
    padding: 2px 5px;
    color: #fff;
    cursor: pointer;
}
.linshi_zdy{
    position: absolute;
    right: 16px;
    top: 5px;
    z-index: 888;
}

</style>



