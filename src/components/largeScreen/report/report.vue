<template>
    <div class="news-box lj_box" style="padding-top:0px;position: relative;">
        <div class="page-report-index">
            <div class="report-header">
                <div class="news-tabs  report-tabs" style="width:100%">
                    <h4 style="margin-right:30px;margin-top:8px">统计报表</h4>
                    <template v-for="(item,index) in tabList"  >
                        <span :key="index" v-if="sessionUtil.isAllowMenu(item.menu)" :class="{active:activeReport==item.value}" @click="changeReport(item)">{{item.name}}</span>
                    </template>
                    <el-button style="position: absolute;right: 10px;" size="mini" type="primary" @click="exportExcel">导出Excel</el-button>
                </div>
            </div>
            
            <div class="page-index" style="padding: 0;height:100%;">
                <!-- 实测实量 -->
                <div class="report-body" style="line-height: 36px;" v-if="activeReport=='measure'">
                    <div class="tabs" style="position:absolute;top:7px;left:1px;border:0 none;">
                        <div class="diary-button" style="float: right;">
                            <div class="elect-boxs" style="float:left;">
                                <span>项目名称</span>
                                <el-select @change="getMeasureNumCollect" v-model="measureProjUid" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                                    <el-option  label="全部" value=""></el-option>
                                    <el-option v-for="(item,index) in projLists" :key="index" :label="item.proName" :value="item.id"></el-option>
                                </el-select>
                            </div>
                            <div class="elect-boxs" style="float:left;" >
                                <span>按日期</span>
                                <el-date-picker @change="getMeasureNumCollect"
                                        v-model="measureSearchDate"
                                        type="daterange" style="color:#fff;" align="right"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy-MM-dd"
                                        unlink-panels
                                        placeholder="选择日期"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions">
                                        </el-date-picker>
                            </div>
                            <!-- <div style="float:left;"  class="search-box">
                                <input style="margin-top: 4px;" type="text" v-model="searchValue" @keyup.enter="changeIndex('施工日志')">
                                <i style="top:3px;"></i>
                                <button @click="changeIndex('施工日志')">搜索</button>
                            </div> -->
                        </div>
                    </div>
                    <div style="height:100%;width:100%;" ref="tableHeight">
                        <el-table class="table__wordWraped" :data="measureList" ref="multipleTable" border  :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                        style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);" 
                        @row-click="showProjReport"  :show-overflow-tooltip="true">
                            <el-table-column prop="projName" width="357" label="项目名称"></el-table-column>
                            <el-table-column prop="totalNum"  label="测量点" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="hadCheckNum" label="已测点" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="passNum"  label="合格点" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="problemNum" label="问题点"></el-table-column>
                            <el-table-column prop="passPercent" label="合格率"> </el-table-column>
                            <el-table-column prop="hasRectifyNum" label="已整改"> </el-table-column>
                            <el-table-column prop="finishPercent" label="整改完成率"> </el-table-column>
                        </el-table>
                    </div>
                    <div style="position:absolute;bottom:28px;left:50%;transform:translateX(-50%)">
                        <el-pagination  @current-change="changeMeasurePage($event)" :current-page="measurePageIndex" :page-size="pageSize"
                            layout="prev, pager, next"
                            :total="measureTotalCount">
                        </el-pagination>
                    </div>
                </div>
                <!-- 任务跟进 -->
                <div class="report-body" style="line-height: 36px;" v-else-if="activeReport=='conferenceTask'">
                    <div class="tabs" style="position:absolute;top:7px;left:1px;border:0 none;">
                        <span :class="{active:taskStatus=='1'}" @click="changeTaskStatus('1')">全部</span>
                        <span :class="{active:taskStatus=='2'}" @click="changeTaskStatus('2')">未执行</span>
                        <span style="width: 100px;" :class="{active:taskStatus=='3'}" @click="changeTaskStatus('3')">已执行(进行中)</span>
                        <span style="width: 100px;" :class="{active:taskStatus=='4'}" @click="changeTaskStatus('4')">已执行(结束)</span>
                        <div class="diary-button" style="float: right;">
                            <div class="elect-boxs" style="float:left;">
                                <span>项目名称</span>
                                <el-select @change="changeTaskPage(1)" v-model="taskProjUid" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                                    <el-option  label="全部" value=""></el-option>
                                    <el-option v-for="(item,index) in projLists" :key="index" :label="item.proName" :value="item.id"></el-option>
                                </el-select>
                            </div>
                            
                            <div style="float:left;"  class="search-box">
                                <input placeholder="按负责人搜索" style="margin-top: 4px;" type="text" v-model="taskSearch" @keyup.enter="getTaskCollect()">
                                <i style="top:3px;"></i>
                                <button @click="getTaskCollect()">搜索</button>
                            </div>
                        </div>
                    </div>
                    <div style="height:100%;width:100%;" ref="tableHeight">
                        <el-table class="table__wordWraped" :data="taskList" ref="multipleTable" border  :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                        style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);"  :show-overflow-tooltip="true">
                            <el-table-column prop="projName" width="357" label="项目名称"></el-table-column>
                            <el-table-column prop="meetingTitle"  label="会议主题" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="subject" label="任务主题" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="principalName"  label="负责人" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="statusName" label="执行情况"></el-table-column>
                            <el-table-column prop="endDate" label="完成期限"> </el-table-column>
                            <el-table-column prop="actFinishDate" label="实际完成"> </el-table-column>
                        </el-table>
                    </div>
                    <div style="position:absolute;bottom:28px;left:50%;transform:translateX(-50%)">
                        <el-pagination  @current-change="changeTaskPage($event)" :current-page="taskPageIndex" :page-size="pageSize"
                            layout="prev, pager, next"
                            :total="taskTotalCount">
                        </el-pagination>
                    </div>
                </div>
                <!-- 问题检查项 -->
                <div class="report-body" style="line-height: 36px;" v-else-if="activeReport=='checkItem'">
                    <div class="tabs" style="position:absolute;top:7px;left:1px;border:0 none;">
                        <span :class="{active:checkTypeFlag==''}" @click="changeCheckType('')">全部</span>
                        <span :class="{active:checkTypeFlag=='quality'}" @click="changeCheckType('quality')">质量</span>
                        <span :class="{active:checkTypeFlag=='safety'}" @click="changeCheckType('safety')">安全</span>
                        <span :class="{active:checkTypeFlag=='measure'}" @click="changeCheckType('measure')">实测</span>
                        <span :class="{active:checkTypeFlag=='procedure'}" @click="changeCheckType('procedure')">工序</span>
                    </div>
                    <div style="height:100%;width:100%;" ref="tableHeight">
                        <el-table class="table__wordWraped" :data="checkItemList" ref="multipleTable" border  :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                        style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);"  :show-overflow-tooltip="true">
                            <el-table-column prop="projName" width="357" label="项目名称"></el-table-column>
                            <el-table-column prop="checkType"  label="类型" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="planNum" label="计划检查" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="checkNum"  label="实际检查" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="passNum" label="合格项"></el-table-column>
                            <el-table-column prop="rectifyNum" label="整改项"> </el-table-column>
                            <el-table-column prop="hadRectifyNum" label="已整改"> </el-table-column>
                            <el-table-column prop="notRectifyNum" label="未整改"> </el-table-column>
                            <el-table-column prop="hadReviewNum" label="已复查"> </el-table-column>
                            <el-table-column prop="waitingReviewNum" label="未复查"> </el-table-column>
                        </el-table>
                    </div>
                    <div style="position:absolute;bottom:28px;left:50%;transform:translateX(-50%)">
                        <el-pagination  @current-change="changeCheckItemPage($event)" :current-page="checkItemPageIndex" :page-size="pageSize"
                            layout="prev, pager, next"
                            :total="checkItemTotalCount">
                        </el-pagination>
                    </div>
                </div>
                <!-- 问题楼栋分布 -->
                <div class="report-body" style="line-height: 36px;" v-else-if="activeReport=='recordArea'">
                    <div class="tabs" style="position:absolute;top:7px;left:1px;border:0 none;">
                        <span :class="{active:areaCheckType==''}" @click="changeAreaCheckType('')">全部</span>
                        <span :class="{active:areaCheckType=='quality'}" @click="changeAreaCheckType('quality')">质量</span>
                        <span :class="{active:areaCheckType=='safety'}" @click="changeAreaCheckType('safety')">安全</span>
                        <span :class="{active:areaCheckType=='measure'}" @click="changeAreaCheckType('measure')">实测</span>
                        <span :class="{active:areaCheckType=='procedure'}" @click="changeAreaCheckType('procedure')">工序</span>
                    </div>
                    <div style="height:100%;width:100%;" ref="tableHeight">
                        <el-table class="table__wordWraped" :data="areaProblemList" ref="multipleTable" border  :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                        @row-click="showProjAreaReport"  style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);"  :show-overflow-tooltip="true">
                            <el-table-column prop="projName" width="357" label="项目名称"></el-table-column>
                            <el-table-column prop="checkType"  label="类型" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="officNum" label="办公楼" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="warehouseNum"  label="仓库楼" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="edcsNum" label="分拣中心"></el-table-column>
                            <el-table-column prop="complexNum" label="综合楼"> </el-table-column>
                            <el-table-column prop="transferNum" label="中转站"> </el-table-column>
                        </el-table>
                    </div>
                    <div style="position:absolute;bottom:28px;left:50%;transform:translateX(-50%)">
                        <el-pagination  @current-change="changeAreaPage($event)" :current-page="areaPageIndex" :page-size="pageSize"
                            layout="prev, pager, next"
                            :total="areaTotalCount">
                        </el-pagination>
                    </div>
                </div>
                <div v-else-if="activeReport=='application'" style="height:100%;width:100%;overflow: auto;" ref="tableHeight">
                    <el-table class="table__wordWraped" :data="applicationList" ref="multipleTable" border  :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                    style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);" @row-click="showApplication" :show-overflow-tooltip="true">
                        <el-table-column prop="name" width="357" label="菜单模块"></el-table-column>
                        <el-table-column prop="totalNum"  label="累计数据记录量(条)"> </el-table-column>
                        <el-table-column prop="weekNum" label="本周新增数据记录量(条)"> </el-table-column>
                        
                    </el-table>
                </div>
                <!-- 查看应用详情 -->
                <div v-else-if="activeReport=='moduleInfo'" style="height:100%;width:100%;overflow: auto;" ref="tableHeight">
                    <div style="display: flex;margin-bottom: 8px;">
                        <button @click="goBack">返回上一级</button>
                        <p style="padding-left:10px">{{moduleName.name}}数据统计{{moduleName.projName? `>${moduleName.projName}`:''}}</p>
                    </div>
                    <div v-if="moduleName.projName">
                        <el-table class="table__wordWraped" :data="pojectDataList" ref="multipleTable" border  :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                        style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);" :show-overflow-tooltip="true">
                            <el-table-column v-for="(item,index) in columnList" :key="index" :prop="item.field" :label="item.name"></el-table-column>
                            <el-table-column prop="createDate"  label="创建时间"> </el-table-column>
                            <el-table-column prop="createUser" label="创建人"> </el-table-column>
                        </el-table>
                        <div style="position:absolute;bottom:53px;left:50%;transform:translateX(-50%)">
                            <el-pagination  @current-change="changeProjPageNum($event)"  :current-page="projPageIndex"
                                :page-size="projPageSize"  layout="prev, pager, next"
                                :total="projTotalCount">
                            </el-pagination>
                        </div>
                    </div>
                    <div v-else>
                        <el-table class="table__wordWraped" :data="moduleDataList" ref="multipleTable" border  :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                        style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);" @row-click="showProjecDet" :show-overflow-tooltip="true">
                            <el-table-column prop="projName" width="357" label="项目名称"></el-table-column>
                            <el-table-column prop="totalNum"  label="累计录入数据(条)"> </el-table-column>
                            <el-table-column prop="weekNum" label="本周新增录入数据(条)"> </el-table-column>
                            
                        </el-table>
                    </div>
                </div>
                <!-- 项目应用 -->
                <projApp v-else-if="activeReport=='projApp'" ref="projApp"></projApp>
                <reportForLease v-else-if="activeReport=='leaseReport'" ref="reportForLease"></reportForLease>
                <leaseProgress v-else-if="activeReport=='leaseProgress'" ref="leaseProgress"></leaseProgress>
                <div class="report-body" style="line-height: 36px;" v-else>
                    <div class="tabs" style="position:absolute;top:7px;left:1px;border:0 none;">
                        <div class="diary-button" style="float: right;">
                            <div class="elect-boxs" style="float:left;">
                                <span>项目名称</span>
                                <el-select @change="getCheckNumCollect" v-model="checkProjUid" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                                    <el-option  label="全部" value=""></el-option>
                                    <el-option v-for="(item,index) in projLists" :key="index" :label="item.proName" :value="item.id"></el-option>
                                </el-select>
                            </div>
                            <!-- <div class="elect-boxs" style="float:left;">
                                <span>计划类型</span>
                                <el-select v-model="projUid" size="mini" class="select-ele" placeholder="请选择" style="width: 100px;">
                                    <el-option  label="全部" value=""></el-option>
                                    <el-option  label="全部" value=""></el-option>
                                </el-select>
                            </div> -->
                            <div class="elect-boxs" style="float:left;" >
                                <span>按日期</span>
                                <el-date-picker @change="getCheckNumCollect"
                                        v-model="searchDate"
                                        type="daterange"
                                        style="color:#fff;"
                                        align="right"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy-MM-dd"
                                        unlink-panels
                                        placeholder="选择日期"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions">
                                        </el-date-picker>
                            </div>
                            <div style="float:left;"  class="search-box">
                                <!-- <input style="margin-top: 4px;" type="text" v-model="searchValue" @keyup.enter="changeIndex('施工日志')">
                                <i style="top:3px;"></i> -->
                                <button @click="changeIndex('施工日志')">搜索</button>
                            </div>
                        </div>
                    </div>
                    <div style="height:100%;width:100%;" ref="tableHeight">
                        <el-table class="table__wordWraped" :data="checkNumList" ref="multipleTable" border  :header-row-style="{fontWeight:'400',color:'rgba(68,210,255,1)'}"
                        style="width: 100%;background-color: rgba(68,210,255,0.2);color:rgba(255,255,255,1);"
                            @row-click="showProjReport"    :show-overflow-tooltip="true">
                            <el-table-column prop="projName" width="357" label="项目名称"></el-table-column>
                            <el-table-column prop="checkNum"  label="检查项数量" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="passNum" label="合格项数量" :show-overflow-tooltip="true"> </el-table-column>
                            <el-table-column prop="problemNum"  label="问题项" :show-overflow-tooltip="true"></el-table-column>
                            <el-table-column prop="waitingRectifyNum" label="未整改数量"> </el-table-column>
                            <el-table-column prop="hadRectifyNum" label="已整改数量"></el-table-column>
                            <el-table-column prop="finishNum" label="已复检数量"> </el-table-column>
                            <el-table-column prop="waitingReviewNum" label="未复检数量"> </el-table-column>
                            
                        </el-table>
                    </div>
                    <div style="position:absolute;bottom:28px;left:50%;transform:translateX(-50%)">
                        <el-pagination
                            @current-change="changePageNum($event)"
                            :current-page="pageIndex"
                            :page-size="pageSize"
                            layout="prev, pager, next"
                            :total="totalCount">
                        </el-pagination>
                    </div>
                </div>
            </div>
            
        </div>

        <!-- 报表导出表单 -->
        <form v-show="false" ref="exportform" :action="`${this.util.getBaseUrl()}/api_v1/modules/statistics/exportReport`" method="post" target="newWin">
            <input type="text" name="fileName" :value="activeName" />
            <input type="text" name="dataType" :value="activeReport" />
            <input type="text" name="params" :value="JSON.stringify(queryObj)" />
            <input type="text" name="access_token" :value="sessionUtil.getAccessToken()" />
        </form>
        
        
    <el-dialog :title="areaProj.projName" :visible.sync="dialogTableVisible"  class="proj-dialog">
            <div style="padding-bottom: 10px;">
                <el-row>
                    <span style="color:#cdddf7;margin-right: 10px;">类型</span>
                    <el-button size="mini" @click="changeProjCheckType('')" :type="projCheckType==''? 'primary':''">全部</el-button>
                    <el-button size="mini" @click="changeProjCheckType('quality')" :type="projCheckType=='quality'? 'primary':''">质量</el-button>
                    <el-button size="mini" @click="changeProjCheckType('safety')" :type="projCheckType=='safety'? 'primary':''">安全</el-button>
                    <el-button size="mini" @click="changeProjCheckType('procedure')" :type="projCheckType=='procedure'? 'primary':''">工序</el-button>
                    <el-button size="mini" @click="changeProjCheckType('measure')" :type="projCheckType=='measure'? 'primary':''">实测</el-button>
                </el-row>

                <el-row style="padding-top: 10px;">
                    <span style="color:#cdddf7;margin-right: 10px;">业态</span>
                    <el-button size="mini" @click="changeProjYetai('')" :type="projYeTai==''? 'primary':''">全部</el-button>
                    <el-button size="mini" @click="changeProjYetai('办公楼')" :type="projYeTai=='办公楼'? 'primary':''">办公楼</el-button>
                    <el-button size="mini" @click="changeProjYetai('仓库楼')" :type="projYeTai=='仓库楼'? 'primary':''">仓库楼</el-button>
                    <el-button size="mini" @click="changeProjYetai('分拣中心')" :type="projYeTai=='分拣中心'? 'primary':''">分拣中心</el-button>
                    <el-button size="mini" @click="changeProjYetai('综合楼')" :type="projYeTai=='综合楼'? 'primary':''">综合楼</el-button>
                    <el-button size="mini" @click="changeProjYetai('中转站')" :type="projYeTai=='中转站'? 'primary':''">中转站</el-button>
                   
                </el-row>
                
            </div>
            <div style="height: 405px;padding-bottom: 10px;overflow: auto;" class="main_table">

                <!-- <el-table :data="projAreaItemList" style="width: 100%;background-color: rgba(68,210,255,0.2);color:#FFF;">
                    <el-table-column property="inspectPartName" label="区域" width="150"></el-table-column>
                    <el-table-column property="chekNum" label="检查项合计" width="200"></el-table-column>
                    <el-table-column property="principalName" label="负责人"></el-table-column>
                    <el-table-column property="startDate" label="开工日期"></el-table-column>
                    <el-table-column property="endDate" label="竣工日期"></el-table-column>
                    <el-table-column property="proStatus" label="项目状态"></el-table-column>
                </el-table> -->
                
                <table>
                    <thead>
                    <tr>
                        <th style="width: 85px;">区域</th>
                        <th style="width: 70px;">检查项合计</th>
                        <th>检查项</th>
                    </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,index) in projAreaItemList" :key="index">
                            <td>{{item.inspectPartName}}</td>
                            <td>{{item.chekNum}}</td>
                            <td>
                                <table>
                                    <thead>
                                    <tr>
                                        <th v-for="(title,x) in item.checkItems" :key="x">{{title.INSPECT_ITEM_NAME_}}</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td v-for="(obj,y) in item.checkItems" :key="y">{{obj.NUM_}}</td>
                                        </tr>
                                        
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        
                    </tbody>
                </table>
            </div>

            
        </el-dialog>

    </div>
</template>
<script>
import reportForLease from './reportForLease.vue'
import leaseProgress from './leaseProgress.vue'
import projApp from './projApp.vue'
import { operationMixin } from './mixin.js'
import { mapMutations } from 'vuex'
export default {
    mixins: [operationMixin],
    data(){
        return{
            queryObj:{},
            activeReport:"quality",
            activeName:"质量中心",
            searchValue:"",
            checkProjUid:"",
            pickerOptions: {
                shortcuts: [{
                    text: '最近一周',
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                },],
            },
            checkNumList:[], //检查
            searchDate:null, //查询时间
            isCreateUser:false //是否是创建人
        }
    },
    
    computed: {
        ifCopyUser:function(){
            var userUid = this.sessionUtil.getUserUid()
            var index =this.copyUsersList.findIndex(item=>item.id===userUid);
            if(index>=0){
                return true;
            }else{
                return false;
            }
        }
    },
    components:{reportForLease,leaseProgress,projApp},
    mounted() {
        this.getCheckNumCollect();
        this.$nextTick(()=>{
            this.tableHeightNum=this.$refs.tableHeight.offsetHeight
        })
    },
    methods:{
        ...mapMutations([
        'setFormConfig'
        ]),
        changePageNum(value){
            this.pageIndex=value;
            this.getCheckNumCollect();
        },
        getCheckNumCollect(){
            let params={
                projUid:this.checkProjUid,
                pageIndex:this.pageIndex,
                pageSize:this.pageSize,
                checkType:this.activeReport
            }
            if(this.searchDate){
                params['startDate']=this.searchDate[0];
                params['endDate']=this.searchDate[1];
            }
            this.util.mask();
             this.util.restGet('/api_v1/modules/statistics/checkNumCollect',params,(res)=>{
                 this.util.unmask();
                 this.totalCount = res.totalCount;
                if(res.status==200&&res.data){
                    this.checkNumList = res.data;
                }else{
                    this.checkNumList=[];
                }
            })

        },
        exportExcel(){
            let params="";
            if(this.activeReport=='projApp'){
                let queryObj = this.$refs.projApp.queryObj;
                params=`${queryObj.district||'@'},${queryObj.projType||'@'},${queryObj.year||'@'}`
            }else if(this.activeReport=='leaseReport'){
                let queryObj = this.$refs.reportForLease.queryObj;
                params=`${queryObj.assignee||'@'},${queryObj.status||'@'},${queryObj.projType||'@'},${queryObj.projUids||'@'},${queryObj.startDate||'@'},${queryObj.endDate||'@'}`
            }else if(this.activeReport=='leaseProgress'){
                let queryObj = this.$refs.leaseProgress.queryObj;
                params=`${queryObj.district||'@'},${queryObj.projType||'@'},${queryObj.projUids||'@'}`

            }
            if(this.activeReport=='moduleInfo'){
                let param=`tableName=${this.moduleName.table}&param=${this.moduleName.param? this.moduleName.param:''}&fileName=${this.moduleName.name}数据统计`;
                window.open(`${this.util.getBaseUrl()}/api_v1/modules/statistics/exportApplicationInfo?${param}&access_token=${this.sessionUtil.getAccessToken()}`);
            }else{
                
                let param=`dataType=${this.activeReport}&fileName=${this.activeName}&params=${params}`
                window.open(`${this.util.getBaseUrl()}/api_v1/modules/statistics/exportReport?${param}&access_token=${this.sessionUtil.getAccessToken()}`);
                // this.$refs.exportform.submit();
                // this.openPostWindow(`${this.util.getBaseUrl()}/api_v1/modules/statistics/exportReport`)
            }
            
        },
        openPostWindow(url) {
            // <input type="text" name="fileName" :value="activeName" />
            // <input type="text" name="dataType" :value="activeReport" />
            // <input type="text" name="params" :value="JSON.stringify(queryObj)" />
            // <input type="text" name="access_token" :value="sessionUtil.getAccessToken()" />
            //-----
            console.log("openPostWindow========>");
            var tempForm = document.createElement("form");
            tempForm.id = "tempForm1";
            tempForm.method = "post";
            tempForm.action = url;
            tempForm.target = "_blank"; //打开新页面
            var hideInput1 = document.createElement("input");
            hideInput1.type = "hidden";
            hideInput1.name = "fileName"; //后台要接受这个参数来取值
            hideInput1.value = this.activeName; //后台实际取到的值
            var hideInput2 = document.createElement("input");
            hideInput2.type = "hidden";
            hideInput2.name="dataType";
            hideInput2.value = this.activeReport;  
            var hideInput3 = document.createElement("input");
            hideInput3.type = "hidden";
            hideInput3.name="params";
            hideInput3.value = JSON.stringify(this.queryObj);  
            var hideInput4 = document.createElement("input");
            hideInput4.type = "hidden";
            hideInput4.name="access_token";
            hideInput4.value = this.sessionUtil.getAccessToken();  
            tempForm.appendChild(hideInput1);
            tempForm.appendChild(hideInput2);
            tempForm.appendChild(hideInput3);
            tempForm.appendChild(hideInput4);
            if (document.all) {
                tempForm.attachEvent("onsubmit", function () { });        //IE
            } else {
                var subObj = tempForm.addEventListener("submit", function () { }, false);    //firefox
            }
            document.body.appendChild(tempForm);
            if (document.all) {
                tempForm.fireEvent("onsubmit");
            } else {
                tempForm.dispatchEvent(new Event("submit"));
            }
            tempForm.submit();
            document.body.removeChild(tempForm);
        }
        
        
       
    }
}
</script>

<style scoped>
.main_table th{
    font-size: 12px;
    font-weight: 600;
    color:#61d2f7;
    text-align: center;
    padding-left: 5px;
    min-width: 63px;
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
    background: rgb(7, 41, 83);
        border-top: 1px solid #0e94ea;
}
.main_table tbody tr{
    background-color: #072951;
    box-shadow:-10px 0px 15px #2C58A6 inset,   /*左边阴影*/
    10px 0px 15px #2C58A6 inset;  /*右边阴影*/
}
    .text-style{
        width: 1138px;
        overflow: hidden; 
        text-overflow:ellipsis; 
        white-space: nowrap;
        line-height: 1.7;
    }
    .news-box{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding: 0px ;
        color: #44D2FF;
        font-size: 14px;
        position: relative;
    }
    .tabs-box{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        padding: 0 10px;
        box-sizing: border-box;
    }

    .news-tabs,
    .tabs{
        width: 100%;
        height: 36px;
        border: 1px solid #44D2FF ;
        box-sizing: border-box;
        padding: 0 10px;
        text-align: center;
    }

    .news-tabs>span,
    .tabs>span{
        min-width: 78px;
        padding: 0px 5px;
        float: left;
        height: 26px;
        line-height: 26px;
        margin-top: 4px;
        cursor: pointer;
        color: #fff;
        margin-bottom: 10px;
    }
    
    .page-proj-index{
        width: 100%;
        height: 100%;
        padding-top: 10px;
        overflow: hidden;
        box-sizing: border-box;
    }
    .page-proj-index>div{
        box-sizing: border-box;
        height: 95%;
        float: left;
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
    .page-index{
       width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
        padding: 0px;
    }
    .page-diary-index{
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
        padding:0;position: absolute;
        top:0;left:0;
        box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    }
   
    
    .reading-num{
        display: block;
        text-align: left;
        font-size: 12px;
        color: #FFFFFF;
        padding-left: 16px;
        float: left;
        position: relative;
    }
    .reading-num::after{
        width: 16px;
        height: 16px;
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        /* background: url('../../assets/indexImg/yuedu.png') no-repeat center; */
    }
    .page-report-index{
        width: 100%;
        height: 100%;
        padding: 62px 0 10px;
        box-sizing: border-box;
        position: relative;
    }

    .report-header{
        position: absolute;
        top: 10px;
        width: 100%;
        overflow: hidden;
        height: 80px;
        /* box-sizing: border-box; */
        /* display: flex;
        justify-content: space-between;
        align-items: center; */
    }
    .report-header .report-tabs{
        height: 42px;
        margin-bottom: 10px;
        float: left;
        position: absolute;
        top: 0;
        left: 0;
        align-items: center;
        display: flex;
    }
    .report-header .report-tabs>span{
        margin : 8px 0;
    }
    .report-header-statistics{
        height: 100%;
        border: 1px solid #44D2FF;
        border-left: 0 none;
        box-sizing: border-box;
        padding: 10px 0 0 10px
    }
    .report-header-statistics p{
        float: left;
        width: 89px;
        font-size: 14px;
        color: #44D2FF;
        text-align: left;
        margin-top: 5px;
    }
    .report-header-statistics p span{
        color: #FFFFFF;
        display: block;
    }
    .report-header-button button,.diary-button button{
        float: right;
        margin-left: 10px;
        margin-top: 5px;
    }
    .report-body{
        width: 100%;
        height: 100%;
        overflow: auto;
        border: 1px solid #44D2FF;
        box-sizing: border-box;
        padding: 44px 10px 10px 10px
    }
    .report-body-item>div{
        float: left;
    }
    .report-body-item>div:nth-child(2) {
        float: none;
        overflow: hidden;
    }
    .report-item-img{
        width: 50px;
        height: 50px;
        padding: 0 10px;
    }
    .report-item-img img{
        width: 100%;
        height: 100%;
        border-radius: 50%
    }
    .report-item-title p span{
        float: left;
        margin: 2px 0;
        font-size: 14px;
    }
    .report-item-title{
        /* text-align: left; */
        overflow: hidden;
    }
    .report-body-item>.item-operate{
        text-align: right;
        float: right;
    }
    
.elect-boxs{
    margin-right: 10px;
}
.elect-boxs .el-input__inner {
    /* background: transparent; */
    border: 0 none;
    height: 32px;
    color: #fff;
    font-size: 14px;
}
</style>

<style>
.elect-boxs .el-date-editor .el-range-separator {
    color: #44d2ff;
}
.proj-dialog .el-dialog__body{
    padding: 3px 20px 15px;
}
.proj-dialog .el-dialog{
    width: 68%;
    background: rgb(12,26,44);
}
.proj-dialog .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #cdddf7;
    border-left: 5px solid rgb(5,149,235);
    padding-left: 5px;
}
.bg02 .el-table th, .el-table tr {
    background: transparent;
}

.select-msg-ele.el-select .el-input .el-select__caret.el-input__icon{
    color: #44D2FF;
}

.el-textarea__inner{
    /*border: 0 none;*/
    min-height:100%!important;
}

.tabs a{
	color: #FFF ;
	text-decoration : none;

}
</style>

