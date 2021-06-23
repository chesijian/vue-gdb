<template>
    
<!--main-->
<div class="data_content">
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
                <div class="main_title">
                    <img src="../static/picture/t_1.png" alt="">
                  项目分布
                </div>
                <div class="current-year-proj">
                    <p>本年度施工项目汇总
                        <el-button @click="loadProjData('all')" type="info" size="mini" style="float: right;height: 23px;line-height: 8px;background:#2c58a6">项目看板</el-button>
                    </p>
                    <div>
                        <span>共 <i>{{distributionObj.totalCount ? distributionObj.totalCount : 0}}</i></span>
                        <span  v-for="(item,index) in distributionObj.dataList" :key="index">{{item.classify}} <i>{{item.numCount ? item.numCount : 0}}</i></span>
                    </div>
                </div>
                <div class="chart" style="width:100%;height: 320px;">
                    <div>
                        <ve-histogram :colors="colors" :grid="grid" :extend="chartExtend" :yAxis="yAxis" :data="distributionChartData" height="230px"></ve-histogram>
                    </div>
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
                    业态分析
                    <img class="line-img" src="../static/images/line-blue.png" alt="">
                    <button @click="yeTaiScreen=!yeTaiScreen"><img src="../static/picture/screen_icon.png" alt="">筛选</button>
                </div>
                <div class="yetai-screen" v-show="yeTaiScreen" >
                    <span>
                        <el-select @change="getYeTaiAnalyze()" v-model="yeTaiCheckType" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;color: #fff;">
                            <el-option  label="全部" value=""></el-option>
                            <el-option  label="质量" value="quality"></el-option>
                            <el-option  label="安全" value="safety"></el-option>
                            <el-option  label="工序" value="procedure"></el-option>
                            <el-option  label="实测" value="measure"></el-option>
                        </el-select>
                    </span>
                </div>
                <div id="chart_2" class="chart t_btn9" style="width:100%;height: 280px;padding-top: 30px;">
                    <ve-histogram :colors="colors" :data="yeTaiChartData" :grid="yetaiGrid" :yAxis="yetaiYAxis" :extend="chartExtend"  :settings="chartSettings" height="320px"></ve-histogram>
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
                    项目地图
                </div>
                <div class="linshi_zdy search-box">
                    <input type="text" v-model="mapSearch" @keyup.enter="handelSearchProj()">
                    <i></i>
                    <button @click="handelSearchProj()">搜索</button>
                </div>
                <div style="width:100%;height:610px;">
                      <div id="mapChart" style="height:100%;"></div>
                    <!-- <ve-map :after-config="afterConfig" :settings="mapChartSettings" :after-set-option="getChart" height="610px" :events="chartEvents" /> -->
                    <div class="info" id="text" v-show="mapModel.showInfo">
                        <div class="info-top">
                            <h5>{{mapModel.currentObj.projName}}</h5>
                            <div style="width: 237px;height: 121px;background: #fff;">
                                <img v-if="mapModel.currentObj.projectLogo" :src="util.getBaseUrl()+'/api_v1/files/'+ mapModel.currentObj.projectLogo+'/look?access_token=' + sessionUtil.getAccessToken()" alt="">
                                <img style="height: 85px;width: auto;padding-top: 18px;" v-else :src="defaultLogo" alt="">
                            </div>
                            <div class="proj-progress">
                                <p><i></i>{{mapModel.currentObj.address}}</p>
                            </div>
                            <div class="double-style" style="padding-bottom: 10px;">
                                <p>项目进度:{{mapModel.scheduleObj.schedule? mapModel.scheduleObj.schedule:0}}%</p>
                                <el-tag  type="warning" size="mini" effect="plain"> {{mapModel.currentObj.classify}}</el-tag>
                            </div>
                        </div>
                        <div class="info-bottom">
                            <div class="proj-details">
                                <span>工期:{{mapModel.scheduleObj.planStart+'~'+mapModel.scheduleObj.planEnd}}</span>
                                <span>工期剩余:{{mapModel.scheduleObj.sj}}天</span>
                            </div>
                            <div class="btn-wrap">
                                <el-button @click="mapModel.showInfo = false" size="small">关闭</el-button>
                                <el-button @click="showProject(mapModel.currentObj)" size="small" type="primary">项目主页</el-button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="back" @click="backMap" v-show="parentInfo.length>1">
                    返回
                </div>
                
                <ul class="ranking-box">
                    <li><span></span>
                        <p>省份</p>
                        <p>数量</p>
                    </li>
                    <li v-for="(item,index) in projDistrList" :key="index">
                        <span>{{index+1}}</span><p>{{item.province}}</p><p>{{item.projNum}}(个)</p>
                    </li>
                </ul>
            </div>
        </div>
 
        <div class="main_right fr data_bottom" style="width: 24%;margin-left: 0px;">
            <div class="right_1" style="margin-bottom: 30px;height: 289px;" >
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
                    进度指标
                </div>
                <div class="main_table t_btn2" style="margin-top: 0px;text-align: center;">
                    <div class="tabs tab-wrap" style="border: none;padding-top: 30px;margin-bottom: 0px;">
                        <span style="font-size:12px" :class="{active:progressFlag == 'percent'}" @click="changeProgressFlag('percent')">逾期任务率</span>
                        <span style="font-size:12px" :class="{active:progressFlag == 'finishPercent'}" @click="changeProgressFlag('finishPercent')">累计完成率</span>
                        <span style="font-size:12px" :class="{active:progressFlag == 'progress'}" @click="changeProgressFlag('progress')">累计进度</span>
                    </div>
                    <table>
                        <tbody v-if="progressFlag == 'progress'">
                            <tr v-for="(item,index) in progressList" :key="index" @click="showProject(item)">
                                <td>{{item.projName}}</td>
                                <td>{{item.percent}}%</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="(item,index) in progressDatas" :key="index" @click="showProject(item)">
                                <td>{{item.projName}}</td>
                                <td>{{item[progressFlag]}}%</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pages-div" v-show="showProgressPagination">
                        <button class="prev" @click="currentChange('prev',progressFlag=='progress'? 'progress':'progressPercent')"></button>
                        <p id="page">
                            <span>{{progressFlag=='progress'? progressPageIndex:pageIndex}}</span>/
                            <span>{{progressFlag=='progress'? progressTotalCount:progressPercentTotalCount}}</span>
                        </p>
                        <button class="next" @click="currentChange('next',progressFlag=='progress'? 'progress':'progressPercent')"></button>
                    </div>
                </div>
                <!-- <div id="chart_3" class="echart t_btn7" style="width:100%;height: 607px;"></div> -->
            </div>
            <div class="right_2" style="height: 289px;">
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
                <div class="main_title" style="width:200px;">
                    <img src="../static/picture/t_5.png" alt="">
                    检查项分布
                </div>
                <div class="main_table t_btn2" style="margin-top: 0px;text-align: center;" >
                    <table >
                        <div class="tabs tab-wrap" style="border: none;margin-top: 30px;margin-bottom: 0px;">
                            <span style="font-size:12px" :class="{active:checkItemFlag == 'qualityCheckItem'}" @click="checkItemFlag='qualityCheckItem'">质量问题</span>
                            <span style="font-size:12px" :class="{active:checkItemFlag == 'safetyCheckItem'}" @click="checkItemFlag='safetyCheckItem'">安全问题</span>
                        </div>
                        <tbody v-if="checkItemFlag=='qualityCheckItem'">
                            <tr v-for="(item,index) in qualityCheckItems" :key="index">
                                <td>{{item.itemName}}</td>
                                <td>{{item.count}}个</td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr v-for="(item,index) in safetyCheckItems" :key="index">
                                <td>{{item.itemName}}</td>
                                <td>{{item.count}}个</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pages-div" v-show="showCheckItemPagination">
                        <button class="prev" @click="currentChange('prev',checkItemFlag)"></button>
                        <p id="page">
                            <span>{{checkItemFlag=='qualityCheckItem'? qualityCheckItemPageIndex:safetyCheckItemPageIndex}}</span>/
                            <span>{{checkItemFlag=='qualityCheckItem'? qualityCheckItemTotalCount:safetyCheckItemTotalCount}}</span>
                        </p>
                        <button class="next" @click="currentChange('next',checkItemFlag)"></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="data_bottom">
        <div class="bottom_1 fl t_btn5" style="cursor: pointer;" >
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
            <!-- <div class="title-box">
                <h6><img src="./picture/t_7.png" alt="">质量指标</h6>
                <img class="line-img" src="./images/line-blue.png" alt="">
                <button @click="showScreen=!showScreen" id="filBtn"><img src="./picture/screen_icon.png" alt="">筛选</button>
            </div> -->
           <div class="main_title" style="padding-left: 15px;">
                <img src="../static/picture/t_quality.png" alt="">
                质量指标
                <img class="line-img" src="../static/images/line-blue.png" alt="">
                <button @click="showScreen=!showScreen"><img src="../static/picture/screen_icon.png" alt="">筛选</button>
            </div>
            <div class="screen-page" v-show="showScreen">
                <span>
                    <el-select @change="getCheckRanking('quality')" v-model="qualityClassify" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;color: #fff;">
                        <el-option  label="全部" value=""></el-option>
                        <el-option  label="自购地" value="自购地"></el-option>
                        <el-option  label="租赁" value="租赁"></el-option>
                    </el-select>
                </span>
            </div>
            <div class="main_table t_btn8" style="text-align: center;">
                <table>
                    <div class="tabs tab-wrap" style="border: none;">
                        <span style="font-size:12px" :class="{active:qualityFlag == 'percent'}" @click="changeQualityFlag('percent')">整改完结率</span>
                        <span style="font-size:12px" :class="{active:qualityFlag == 'totalNum'}" @click="changeQualityFlag('totalNum')">问题数</span>
                        <span style="font-size:12px" :class="{active:qualityFlag == 'checkPercent'}" @click="changeQualityFlag('checkPercent')">检查率</span>
                    </div>
                    <tbody>
                    <tr v-for="(item,index) in qualityRanking" :key="index" @click="showProject(item)">
                        <td>{{item.projName}}</td>
                        <td>{{item[qualityFlag]}}{{qualityFlag =='totalNum'? '个':'%'}}</td>
                    </tr>
                    
                    </tbody>
                </table>
                <div class="pages-div" v-show="showPagination">
                    <button class="prev" @click="currentChange('prev','qualityIndicator')"></button>
                    <p id="page">
                        <span>{{qualityRankingPageIndex}}</span>/<span>{{qualityRankingTotalCount}}</span>
                    </p>
                    <button class="next" @click="currentChange('next','qualityIndicator')"></button>
                </div>
            </div>
            
        </div>
        <div class="bottom_center fl">
            <div class="bottom_2 fl" >
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
                    <img src="../static/picture/t_safety.png" alt="">
                    安全指标
                    <img class="line-img" src="../static/images/line-blue.png" alt="">
                    <button @click="showSafetyScreen=!showSafetyScreen"><img src="../static/picture/screen_icon.png" alt="">筛选</button>
                </div>
                <div class="screen-page" v-show="showSafetyScreen">
                    <span>
                        <el-select @change="getCheckRanking('safety')" v-model="safetyClassify" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;color: #fff;">
                            <el-option  label="全部" value=""></el-option>
                            <el-option  label="自购地" value="自购地"></el-option>
                            <el-option  label="租赁" value="租赁"></el-option>
                        </el-select>
                    </span>
                </div>
                
                <div class="main_table t_btn8" style="text-align: center;">
                    <table>
                        <div class="tabs tab-wrap" style="border: none;">
                            <span style="font-size:12px" :class="{active:safetyFlag == 'percent'}" @click="changeSafetyFlag('percent')">整改完结率</span>
                            <span style="font-size:12px" :class="{active:safetyFlag == 'totalNum'}" @click="changeSafetyFlag('totalNum')">问题数</span>
                        </div>
                        <tbody>
                        <tr v-for="(item, index) in safetyRanking" :key="index" @click="showProject(item)">
                            <td>{{item.projName}}</td>
                            <td>{{item[safetyFlag]}}{{safetyFlag =='totalNum'? '个':'%'}}</td>
                        </tr>
                        </tbody>
                    </table>
                    <div class="pages-div" v-show="showSafetyPagination">
                        <button class="prev" @click="currentChange('prev','safetyIndicator')"></button>
                        <p id="page">
                            <span>{{safetyRankingPageIndex}}</span>/<span>{{safetyRankingTotalCount}}</span>
                        </p>
                        <button class="next" @click="currentChange('next','safetyIndicator')"></button>
                    </div>
                </div>
                
            </div>
            <div class="bottom_3 fl" >
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
                    <img src="../static/picture/t_procedure.png" alt="">
                   工序指标
                   <img class="line-img" src="../static/images/line-blue.png" alt="">
                    <button @click="showProcedureScreen=!showProcedureScreen"><img src="../static/picture/screen_icon.png" alt="">筛选</button>
                </div>
                <div class="screen-page" v-show="showProcedureScreen">
                    <span>
                        <el-select @change="getCheckRanking('procedure')" v-model="procedureClassify" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;color: #fff;">
                            <el-option  label="全部" value=""></el-option>
                            <el-option  label="自购地" value="自购地"></el-option>
                            <el-option  label="租赁" value="租赁"></el-option>
                        </el-select>
                    </span>
                </div>
                <div class="main_table t_btn2" style="text-align: center;">
                    <table>
                        <div class="tabs tab-wrap" style="border: none;">
                            <span style="font-size:12px" :class="{active:procedureFlag == 'percent'}" @click="changeProcedureFlag('percent')">整改完结率</span>
                            <span style="font-size:12px" :class="{active:procedureFlag == 'passPercent'}" @click="changeProcedureFlag('passPercent')">施工合格率</span>
                            <span style="font-size:12px" :class="{active:procedureFlag == 'workPercent'}" @click="changeProcedureFlag('workPercent')">施工率</span>
                        </div>
                        <tbody>
                            <tr v-for="(item,index) in procedureRanking" :key="index" @click="showProject(item)">
                                <td>{{item.projName}}</td>
                                <td>{{item[procedureFlag]}}%</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="pages-div" v-show="showprocedurePagination">
                        <button class="prev" @click="currentChange('prev','procedureIndicator')"></button>
                        <p id="page">
                            <span>{{procedurePageIndex}}</span>/<span>{{procedureTotalCount}}</span>
                        </p>
                        <button class="next" @click="currentChange('next','procedureIndicator')"></button>
                    </div>
                </div>
                
            </div>
        </div>
        <div class="bottom_4 fr" >
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
                实测指标
                <img class="line-img" src="../static/images/line-blue.png" alt="">
                <button @click="showmeasureScreen=!showmeasureScreen"><img src="../static/picture/screen_icon.png" alt="">筛选</button>
            </div>
            <div class="screen-page" v-show="showmeasureScreen">
                <span>
                    <el-select @change="getCheckRanking('measure')" v-model="measureClassify" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;color: #fff;">
                        <el-option  label="全部" value=""></el-option>
                        <el-option  label="自购地" value="自购地"></el-option>
                        <el-option  label="租赁" value="租赁"></el-option>
                    </el-select>
                </span>
            </div>
            <div class="main_table t_btn3 table_zdy" style="text-align: center;">
                <table>
                    <div class="tabs tab-wrap" style="border: none;">
                        <span style="font-size:12px" :class="{active:measureFlag == 'percent'}" @click="changeMeasureFlag('percent')">整改完结率</span>
                        <span style="font-size:12px" :class="{active:measureFlag == 'workPercent'}" @click="changeMeasureFlag('workPercent')">测量率</span>
                        <span style="font-size:12px" :class="{active:measureFlag == 'passPercent'}" @click="changeMeasureFlag('passPercent')">合格率</span>
                        
                    </div>
                    <tbody>
                    <tr v-for="(item, index) in measureRanking" :key="index" @click="showProject(item)">
                        <td>{{item.projName}}</td>
                        <td>{{item[measureFlag]}}%</td>
                    </tr>
                    </tbody>
                </table>
                <div class="pages-div" v-show="showMeasurePagination">
                    <button class="prev" @click="currentChange('prev','measureIndicator')"></button>
                    <p id="page">
                        <span>{{measurePageIndex}}</span>/<span>{{measureTotalCount}}</span>
                    </p>
                    <button class="next" @click="currentChange('next','measureIndicator')"></button>
                </div>
            </div>
            
        </div>
    </div>
</div>
</template>

<script>
import AMapUI from 'AMapUI'
import { operationMixin } from './mixin.js'
import china from "./china.json";
// import 'echarts/map/js/china.js'
// import 'echarts/map/js/province/guangdong.js';
import { getDataByApi } from '@/api/api'
var dmtData = [];
var parentJson = null

export default {
    mixins: [operationMixin],
    data() {
        this.mapChartSettings = {
            mapOrigin: china,
            position: "china",
        }
        this.chartSettings = {
            labelMap: {
                'YE_TAI_': '业态',
                'zigoudiNum': '自购地',
                'zuliNum': '租赁',
                'totalNum': '全部',
                'zigouPercent': '自购地完结率',
                'ziliPercent': '租赁完结率',
            },
            showLine: ['zigouPercent','ziliPercent'],
            axisSite: { right: ['zigouPercent','ziliPercent'] },
            yAxisType: ['normal', 'percent'],
            yAxisName: ['问题数', '完结率']
        }
        this.chartEvents = {
            click:  (e)=> {
                this.showProjInfo(e.data);
            }
        }
        this.chartExtend = {
          'xAxis.0.axisLabel.color': 'rgba(68,210,255,0.5)',//x轴文本颜色
          'yAxis.0.axisLabel.color': "rgba(68,210,255,0.5)",
          'yAxis.1.axisLabel.color': "rgba(68,210,255,0.5)",
          'yAxis.0.axisLine.lineStyle.color': "rgba(68,210,255,0.5)",
          'yAxis.1.axisLine.lineStyle.color': "rgba(68,210,255,0.5)",
            legend: {
                textStyle: {
                    color: "#fff", //图例字体颜色
                }
            },
            
        }
        this.grid = {
            top: 38,
            left: 10,
            borderColor: '#000'
        }
        this.yetaiGrid = {
            top: 48,
            left: 10,
            borderColor: '#000'
        }
        return {
            parentInfo:[{
                cityName: '全国',
                level: 'china',
                code: 100000
            }],
            colors: ['#FFA74D','#584BFF','#FF4949','#4BF0FF','#4E82FF','#584BFF','#BE4DFF','#F845F1'], // 颜色的配置
            qualityClassify:"",
            showPagination:false,
            showScreen:false,
            yAxis: [
                {
                    splitLine: {     //网格线
                        show: true,
                        lineStyle:{
                            color: ['#315070'],
                            width: 1,
                            type: 'solid'
                        }
                    }
                }
            ],
            yetaiYAxis: [
                {
                    splitLine: {     //网格线
                        show: true,
                        lineStyle:{
                            color: ['#315070'],
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                {
                    splitLine: {     //网格线
                        show: true,
                        lineStyle:{
                            color: ['#315070'],
                            width: 1,
                            type: 'solid'
                        }
                    }
                }
            ],
            yeTaiChartData: {},
            mapDatas:[],
            mapEcharts:{},//地图图表对象
            defaultLogo:require('@/assets/sflogo.jpg'),
            qualityFlag: "percent",//质量指标
            safetyFlag: "percent",//安全指标
            searchValue:"",//项目搜索
            projType:"",//项目类型
            classifyList:[],
            dialogTableVisible:false,
            projTotalCount:0,
            pageSize:5,
            pageIndex:1,
            projList: [],
            purchaseChartData:{},//自购地图表数据
            leaseChartData: {
                columns: ['STATUS_', 'numCount'],
                rows: []
            },
            qualityRanking:[],
            qualityRankingTotalCount:0,//质量指标完结率总数
            qualityRankingPageIndex:1,//质量指标完结率当前页数
            safetyRanking:[],
            safetyRankingTotalCount:0,//质量指标完结率总数
            safetyRankingPageIndex:1,//质量指标完结率当前页数
            qualityCheckItems:[],
            qualityCheckItemTotalCount:0,
            qualityCheckItemPageIndex:1,
            safetyCheckItems:[],
            safetyCheckItemTotalCount:0,
            safetyCheckItemPageIndex:1
        }
    },
    beforeRouteLeave(to, from, next) {
        this.$parent.theme='bg';
        next();
    },
    mounted() {
        this.$parent.theme='bg02'
        this.$nextTick(()=> {
            this.getData();//获取项目分布数据
            this.getCheckRanking('quality');//获取质量指标
            this.getCheckRanking('safety');//获取安全指标
            this.getCheckRanking('procedure');//获取工序指标
            this.getCheckRanking('measure');//获取实测指标

            this.getCheckItemData("quality");
            this.getCheckItemData("safety");
            this.getProgressData()//获取进度指标数据
           
        });
        this.getYeTaiAnalyze();
        this.getProjMapData(this.parentInfo[0]);
        // this.$echarts.registerMap('Map', china);
        // this.initMapChart();
        
    },
    methods: {
        backMap(){
            if (this.parentInfo.length === 1) {
                return;
            }
            this.parentInfo.pop();
            let showMap = this.parentInfo[this.parentInfo.length - 1];
            this.getProjMapData(showMap);
        },
        getGeoJson(adcode) {
            let $this=this;
            AMapUI.loadUI(['geo/DistrictExplorer'], DistrictExplorer => {
                var districtExplorer = new DistrictExplorer()
                districtExplorer.loadAreaNode(adcode, function(error, areaNode) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    let Json = areaNode.getSubFeatures()
                    if (Json.length > 0) {
                        parentJson = Json
                    } else if (Json.length === 0) {
                        Json = parentJson.filter(item => {
                            if (item.properties.adcode == adcode) {
                                return item
                            }
                        })
                        if (Json.length === 0) return
                    }
                    //去获取数据
                    $this.initMapChart(Json)
                });
            })
        },
        initMapChart(Json){
            let options=this.getOptions(Json);
            this.$echarts.init(document.getElementById('mapChart')).dispose();
            var mapChart = this.$echarts.init(document.getElementById('mapChart'));
            mapChart.setOption(options);
            mapChart.on('click', (params)=>{
                let projData = params.data? params.data.projData:null;   
                // console.log("params=====chart==>",params);  
                if(projData){
                    this.showProjInfo(projData);
                }else{
                    //如果当前是最后一级，那就直接return
                    if (this.parentInfo[this.parentInfo.length - 1].code == params.region.cityCode) {
                        return
                    }
                    let data = params.region
                    let newMap={
                        cityName: data.name,
                        level: data.level,
                        code: data.cityCode,
                    }
                    this.parentInfo.push(newMap)
                    this.getProjMapData(newMap);
                }
                

                
            });
           
        },
        //end=======
        getYeTaiAnalyze() {//获取业态分析数据
            this.util.restGet('/api_v1/modules/statistics/yeTaiAnalyze',{checkType:this.yeTaiCheckType}, (res)=> {//项目类型
                if(res.status==200&&res.data){
                    //业态分析
                    var yeTaiList = res.data;
                    yeTaiList.forEach(item=>{
                        item.zigouPercent=item.zigoudiNum==0? 0:(item.zigoudiFinshNum/item.zigoudiNum).toFixed(1);
                        item.ziliPercent=item.zuliNum==0? 0:(item.zuliFinshNum/item.zuliNum).toFixed(1);
                    });
                    this.yeTaiChartData= {
                        columns: ['YE_TAI_', 'zigoudiNum', 'zuliNum', 'totalNum','zigouPercent','ziliPercent'],
                        rows: yeTaiList
                    }
                }
                this.classifyList=res.data
            })
        },
        //搜索
        handelSearchProj(){
            this.parentInfo = [{
                cityName: '全国',
                level: 'china',
                code: 100000
            }];
            this.getProjMapData(this.parentInfo[0]);
        },
        // 获取项目地图数据
        getProjMapData(item) {
            if(item.level == "district"){
                this.getGeoJson(item.code);
                return;
            }
            let privince=item.level=="province"? item.cityName:"";
            let city=item.level=="city"? item.cityName:"";
            let params={
                pageIndex:1,
                pageSize:1000,
                keyWork:this.mapSearch,
                privince,
                city
            }
            getDataByApi("api-getProjectsForChart",params).then(res => {
                dmtData=[];
                if(res.status == 200 && res.data){
                    res.data.forEach(item=>{
                        if(item.location){
                            var positions = item.location.split(",");
                            item.longitude=positions[0];
                            item.latitude=positions[1];
                            dmtData.push(item);
                        }
                    });
                }
                
                this.getGeoJson(item.code)
            });
            // let params={
            //     search:this.mapSearch,
            //     pageSize:1000,
            //     pageIndex:1,
            // }
            // this.util.restGet('/api_v1/business/project/searchProjectList', params, (res)=>{
            //     dmtData=[];
            //     pointData=[];
            //     if(res.status == 200 && res.data){
            //         res.data.forEach(item=>{
            //             if(item.location){
            //                 var positions = item.location.split(",");
            //                 item.longitude=positions[0];
            //                 item.latitude=positions[1];
            //                 dmtData.push(item);
            //                 pointData.push({
            //                     value:positions
            //                 });
            //             }
            //         });
            //     }else{
            //         this.mapModel.positionArr=[];
            //     }
            // },null,false);
            // if(type=="search"){
            //     let newOption =this.getOptions();
            //     //重新渲染地图数据
            //     this.mapEcharts.setOption(newOption,true)
            // }
        },
        getChart(data){
            this.mapEcharts=data;
        },
        afterConfig(options) {
            this.getProjMapData();
            // options = {...this.config}
            options=this.getOptions();
            return options;
        },
        getOptions(Json){
            let mapData = Json.map(item => {
                return ({
                    name: item.properties.name,
                    value: Math.random() * 10,
                    level: item.properties.level,
                    cityCode: item.properties.adcode
                })
            })
            
            let mapJson = {}
            //geoJson必须这种格式
            mapJson.features = Json
            //去渲染echarts
            this.$echarts.registerMap('Map', mapJson);
            let geo= {
                    // map: 'china',
                    type: "map",
                    map: "Map",
                    zoom:1.2, 
                    show: true,
                    roam: true,
                    regions:mapData,
                    label: {
                        normal: {
                            show : true,
                            textStyle:{color:"#4bf316"}
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                color: '#fff'
                            }
                        }, 
                    },
                    itemStyle: {                        
                        normal: {
                            borderColor: 'rgba(147, 235, 248, 1)',
                            borderWidth: 2,
                            areaColor: {
                                type: 'radial',
                                x: 0.5,
                                y: 0.5,
                                r: 0.8,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(175,238,238, 0)' // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: 'rgba(   47,79,79, .2)' // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            shadowColor: 'rgba(128, 217, 248, 1)',
                            shadowOffsetX: -2,
                            shadowOffsetY: 2,
                            shadowBlur: 10
                        },
                        emphasis: {
                            areaColor: '#389BB7',
                            borderWidth: 0
                        }
                    }
            }
            
            let options= {
                geo,
                series: [{
                    name: '门店',
                    type: 'effectScatter',
                    coordinateSystem: 'geo',
                    data: dmtData.map(function (itemOpt) {
                        return {
                            value: [
                                itemOpt.longitude,
                                itemOpt.latitude,
                            ],
                            projData:itemOpt,
                            label: {
                                emphasis: {
                                position: 'right',
                                show: false
                                }
                            },
                            itemStyle: {
                                normal: {
                                    // color: itemOpt.color //色值
                                        color: '#F62157'
                                    }
                                }
                        };
                        
                    }),
                    symbolSize: 10,
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke',
                    },
                }]
            };
            return options;
        },
        loadProjData(){
            let Logistics= this.$router.resolve({
                path:'/projLargeIndex/distribution',
                // query:{
                //     projUid:"hhhhh"
                // }
            })
            window.open(Logistics.href, '_blank');
            
        },
        // 获取检查指标数据
        getCheckRanking(checkType) {
            var pageIndex = 1;
            let classify="";
            let orderType="";
            if(checkType=="quality"){
                pageIndex=this.qualityRankingPageIndex;
                classify=this.qualityClassify;
                orderType=this.qualityFlag;
            }else if(checkType=="safety"){
                pageIndex=this.safetyRankingPageIndex;
                classify=this.safetyClassify;
                orderType=this.safetyFlag;
            }else if(checkType=="procedure"){
                pageIndex=this.procedurePageIndex;
                classify=this.procedureClassify;
                orderType=this.procedureFlag;
            }else{
                pageIndex=this.measurePageIndex;
                classify=this.measureClassify;
                orderType=this.measureFlag;
            }
            var params = {
                classify:classify,
                checkType: checkType,
                orderType: orderType,
                pageIndex:pageIndex,
                pageSize:5
            }
            this.util.mask();
            this.util.restGet('/api_v1/modules/statistics/checkRanking', params,(res)=>{
                this.util.unmask();
                if(checkType=="quality"){
                    this.qualityRankingTotalCount = Math.ceil(res.totalCount/5);
                }else if(checkType=="safety"){
                    this.safetyRankingTotalCount = Math.ceil(res.totalCount/5);
                }else if(checkType=="procedure"){
                    this.procedureTotalCount = Math.ceil(res.totalCount/5);
                }else{
                    this.measureTotalCount = Math.ceil(res.totalCount/5);
                }
                if(res.status == 200&&res.data){
                    if(checkType=="quality"){
                        this.qualityRanking = res.data;
                    }else if(checkType=="safety"){
                        this.safetyRanking = res.data;
                    }else if(checkType=="procedure"){
                        this.procedureRanking = res.data;
                    }else{
                        this.measureRanking = res.data;
                    }
                }else{
                    if(checkType=="quality"){
                        this.qualityRanking = [];
                    }else if(checkType=="safety"){
                        this.safetyRanking = [];
                    }else if(checkType=="procedure"){
                        this.procedureRanking = [];
                    }else{
                        this.measureRanking = [];
                    }
                }
            })
        },
        // 获取检查项分布数据
        getCheckItemData(checkType) {
            var pageIndex = 1;
            if(checkType=="quality"){
                pageIndex = this.qualityCheckItemPageIndex;
            }else{
                pageIndex = this.safetyCheckItemPageIndex;
            }
            var params = {
                checkType: checkType,
                pageIndex:pageIndex,
                pageSize:5
            }
            this.util.restGet('/api_v1/modules/statistics/checkItemRanking', params,(res)=>{
                
                if(checkType=="quality"){
                    this.qualityCheckItemTotalCount = Math.ceil(res.totalCount/5);
                }else{
                    this.safetyCheckItemTotalCount = Math.ceil(res.totalCount/5);
                }
                if(res.status == 200&&res.data){
                    if(checkType=="quality"){
                        this.qualityCheckItems = res.data;
                    }else{
                        this.safetyCheckItems = res.data;
                    }
                }else{
                    if(checkType=="quality"){
                        this.qualityCheckItems = [];
                    }else{
                        this.safetyCheckItems = [];
                    }
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
.yetai-screen .el-input--mini .el-input__inner {
    height: 28px;
    line-height: 28px;
    color: #fff;
}
</style>      
<style scoped lang="scss">
@import "../static/css/base.css";
@import "../static/css/index.css";
.back{
    position: absolute;
    top:25px;
    left: 17px;
    color: rgb(222,222,222);
    cursor:pointer;
}
.yetai-screen{
    position: absolute;
    z-index: 888;
    top: -15px;right: -49px;
    border-radius: 6px;
    background: #4E82FF;
    border: 1px solid #4E82FF;
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
    border-bottom: 1px solid rgba(255,255,255,0.3);
    padding: 30px 10px 0px;
    position: relative;
}
.current-year-proj > div {
    padding: 12px 0;
    display: flex;
    justify-content: space-between;
}
.current-year-proj > div i {
    color: #F5A623;
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
        background: rgba(44,88,166,0.8);
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
        padding-top: 10px;
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



