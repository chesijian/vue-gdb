<template>
    <div class="proj-box lj_box" :style="{paddingTop:activeStr=='汇报详情'||activeStr=='添加日志'||activeStr=='项目会议'||activeStr=='工作联系单'||activeStr=='添加汇报'?'0':'36px'}">
        <div class="tabs-box" >
            <div class="tabs" style="overflow:hidden">
                <span :class="{active:activeStr=='首页'}" @click="changeIndex('首页')">
                    <router-link active-class="active" to="/page">首页</router-link>
                </span>
                <!-- <span :class="{active:activeStr=='新闻公告'}" v-if="sessionUtil.isAllowMenu('020201')" @click="changeIndex('新闻公告')">新闻公告</span> -->
                <span :class="{active:$route.path=='/page/news'}" v-if="sessionUtil.isAllowMenu('020201')" @click="activeStr='新闻news'">
                    <router-link active-class="active" to="/page/news">新闻公告</router-link>
                </span>
                <span :class="{active:activeStr=='工作汇报'}" v-if="sessionUtil.isAllowMenu('020202')" @click="changeIndex('工作汇报');changeReport('施工日志')">
                    <router-link active-class="active" to="/page/news">项目汇报</router-link>
                </span>
                <span :class="{active:activeStr=='楼栋管理'}" v-if="sessionUtil.isAllowMenu('020203')" @click="changeIndex('楼栋管理')">楼栋管理</span>
                <span :class="{active:activeStr=='工作联系单'}" v-if="sessionUtil.isAllowMenu('020204')||sessionUtil.isAllowBtn('gc1_8:view')" @click="changeIndex('工作联系单')"><router-link  to="/page/form/query/t_work_contact">工作联系单</router-link></span>
            </div>
        </div>

        <div v-if="$route.path=='/page/news'||$route.path=='/page/form/query/t_work_contact'" class="page-proj-index" style="width:100%" :style="{paddingTop:activeStr=='工作联系单'? '46px':'0px'}">
            <router-view :key="$route.path"></router-view>
        </div>


        <div v-if="activeStr=='首页'" class="page-proj-index">
        	
            <div style="width:20%" class="proj-left">
                <div style="min-height:465px;height:100%" class="box-style">
                    <div class="proj-synopsis">
                        <div style="position:absolute;top:10px">
                            <h4 >项目简介</h4>
                            <div class="proj-synopsis-img-box">
                                <div class="proj-synopsis-right-box">
                                    <img :src='this.util.getBaseUrl()+"/api_v1/qr?content=http%3A%2F%2Fqy.zhuzhu.biz%2Fgdb%2Fstatic%2Fwechat%2Findex.html%23%2Fapp%2FprojDetails%3FprojUid="+$store.state.selectProjectObj.id+"&access_token="+this.sessionUtil.getAccessToken()' style="width: 70px;height: 70px;" alt="">
                                    关注项目
                                </div>
                                <div class="proj-synopsis-left-box">
                                    <img :src="util.getBaseUrl() + '/api_v1/files/'+projObj.projectLogo+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" style="width: 100%;height: 100%;margin-bottom:10px" alt="">
                                </div>
                            </div>
                        </div>
                        <!--  -->
                         <div style="width:100%;height:100%;overflow:auto">
                            <ul>
                                <!--<li>项目类型：{{projObj.classify}}</li>-->
                                <li>项目类型：{{classify}}</li>
                                <li>建设性质：{{projObj.construction}}</li>
                                <li>建筑面积：{{projObj.coveredArea}}</li>
                                <li>工程总投资(万)：{{projObj.investment}}</li>
                                <li>工期要求(天)：{{projObj.sj}}</li>
                                <li>工期：{{projObj.date}}</li>
                                <div v-for="(item,key) in unit" :key="key">
                                <li>{{item.unitType}}: {{item.unitName}}</li>
                                </div>
                            </ul>
                         </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
            
            </div>
            <div style="width:60%" class="proj-middle">
                 <div style="min-height:465px;height:100%" class="box-style ">
                    <div>
                        <div ref="projMiddleTop" style="height:100%">
                            <el-carousel :height="carouselHeight+'px'" trigger="click">
                                <el-carousel-item v-for="(item,key) in carouselList" :key="key">
                                    <img @click="editNews(item,1)" :src="util.getBaseUrl() + '/api_v1/files/'+item.fileId+'/look?ifThumb=false&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
                                </el-carousel-item>
                            </el-carousel>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
            
            </div>
            <div  style="width:20%"  class="proj-right">
                <div style="min-height:155px;height:33%;" class="box-style">
                    <div class="progress">
                        <h4>进度</h4>
                        <div style="padding-top:10px">
                            <p> <span v-if="infoObj.flag==true" style="float:left;color:#44d2ff">正常</span> <span v-if="infoObj.flag==false" style="float:left;color:red">超时</span> <span>{{infoObj.schedule}}%</span></p>
                            <el-progress :percentage="infoObj.schedule" :stroke-width="31" :text-inside="true" ></el-progress>
                            <p>施工倒计时：{{infoObj.sj}}天</p>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
         
                <div style="min-height:155px;height:33%;" class="box-style">
                     <div class="statistics">
                        <h4>质量</h4>
                        <div class="circle-left" style="text-align:right;padding-right:20px">
                            <el-progress type="circle" :width="90" :stroke-width="10" :percentage="qualityObj.percentage"></el-progress>
                        </div>
                        <div class="circle-right">
                            <p>问题数<span>{{qualityObj.totalNum}}</span></p>
                            <p>整改数<span>{{qualityObj.completeNum}}</span></p>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
                <div style="min-height:155px;height:33.5%;" class="box-style">
                    <div class="statistics">
                        <h4>安全</h4>
                        <div class="circle-left" style="text-align:right;padding-right:20px">
                            <el-progress type="circle" :width="90" :stroke-width="10" :percentage="safetyObj.percentage"></el-progress>
                        </div>
                        <div class="circle-right">
                            <p>问题数<span>{{safetyObj.totalNum}}</span></p>
                            <p>整改数<span>{{safetyObj.completeNum}}</span></p>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
   
            </div>
            
                 <div style="min-height:155px;height:24%;width: 100%;" class="box-style">
                    <div  class="locale">
                        <h4>现场</h4>
                        <div class="locale-img-box" @mouseover="arrowShow=true" @mouseout="arrowShow=false">
                            <img v-if="localeMsgList.length>0" src="../../assets/indexImg/left_arrow.png" width="20px" style="left:10px" @click="addLeft()"  alt="">
                            <img v-if="localeMsgList.length>0" src="../../assets/indexImg/right_arrow.png" width="20px"  style="right:10px" @click="prveNum()"  alt="">
                            <div  class="locale-msg-box">
                                <div  v-if="localeMsgList.length<=0"  class="no-msg">暂无现场信息</div>
                                <div class="msg-list-box"
                                    v-if="localeMsgList.length>0"
                                    :style="{transform:'translateX('+leftNum+'px)',width:(localeMsgList.length*214+40)+'px'}">
                                    <div v-for="(item,key) in localeMsgList" :key="key" class="msg-list" @click="toLocaleMsg(item)">
                                        <img v-if="item.id!=undefined" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" width="100%" height="100%" alt="">
                                        <i v-if="item.id==undefined"></i>
                                        <p>{{item.content}}</p>
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
        <div v-if="activeStr=='工作汇报'" class="page-report-index">
            <div class="report-header">
                
                <div class="news-tabs  report-tabs" style="width:100%">
                    <h4 style="margin:8px 0 0 0;float:left;margin-right:30px">汇报</h4>
                    <span :class="{active:activeReportStr=='施工日志'}" @click="changeReport('施工日志')">日报</span>
                    <span :class="{active:activeReportStr=='周报'}" @click="changeReport('周报')">周报</span>
                    <span :class="{active:activeReportStr=='月报'}" @click="changeReport('月报')">月报</span>
                </div>
            </div>
            <div class="report-body" style="position:relative" v-show="activeReportStr != '施工日志'">
                <div class="news-tabs " style="position:absolute;top:6px;border:0 none;left:0">
                    <span :class="{active:activeIsUsReportStr=='全部'}" @click="changeIsUsRepor('全部')">全部</span>
                    <span :class="{active:activeIsUsReportStr=='汇报给我'}" @click="changeIsUsRepor('汇报给我')">汇报给我</span>
                    <span :class="{active:activeIsUsReportStr=='我的汇报'}" @click="changeIsUsRepor('我的汇报')">我的汇报</span>
                    <div class="report-header-button">
                        <button @click="addNewReport" v-if="sessionUtil.isAllowAdd('wx_work_report')">新增汇报</button>
                    </div>
                </div>
                <div style="overflow:auto;height:100%;width:100%">
                    <div style="height:80px;" class="box-style" v-for="(item, index) in reportList" @click.stop.prevent="seeReport(item,0)" :key="index" >
                        <div class="report-body-item" >
                            <div class="report-item-img"><img :src="item.userLogo? item.userLogo:defaultLogo" alt=""></div>
                            <div class="report-item-title">
                                <p><span>{{item.title}}</span><br/></p>
                                <span style="width:200px;display:block;margin-top:10px;" v-if="item.type == '月报'">审核状态：{{item.status == 0 ? '不通过' : item.status == 1 ? '通过' : '未审核'}}</span>
                            </div>
                            <div class="item-operate">
                                <span style="color:#fff;padding-right:10px;"> {{item.createTime}}</span>
                                <span style="color:#fff;padding-right:10px;" v-if="item.type=='日报'"> {{item.week}}</span>
                                <img v-if="sessionUtil.isAllowBtn('gc1_2:btn_delete')" style="width:20px;" @click.stop.prevent="delReport(item)" src="../../assets/indexImg/del.png" alt="">
                                <img v-if="item.status != 1"  @click.stop="seeReport(item,1)" src="../../assets/indexImg/chayuan.png" alt="">
                                <p style="color:#fff">
                                    <span class="operate-comment" style="padding-right:0">评论({{item.commentCount}})</span>
                                    <span class="operate-read">已读({{item.lookCount}})</span>
                                    <span class="operate-file" >附件({{item.accessory&&item.accessory.length>0?item.accessory.length:0}})</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="position:absolute;bottom:0px;left:50%;transform:translateX(-50%)">
                    <el-pagination @size-change="changeWorkPageSize($event)"
                        @current-change="changeWorkPageNum($event)" :current-page="workPageIndex"
                        :page-sizes="[10, 25, 50, 100]" :page-size="workPageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="workTotalCount">
                    </el-pagination>
                </div>
            </div>
            
             <div v-show="activeReportStr == '施工日志'" class="page-diary-index" style="padding: 0;">

            <div class="report-body" >
                <div class="tabs" style="position:absolute;top:7px;left:1px;border:0 none;">
                    <span :class="{active:activediaryStr=='1'}" @click="changediary('1')">全部</span>
                    <span :class="{active:activediaryStr=='2'}" @click="changediary('2')">未读</span>
                    <span :class="{active:activediaryStr=='3'}" @click="changediary('3')">我的</span>
                    <div class="diary-button" style="float: right;">
                        <button @click="LogRenderingx()">新增日志</button>
                    </div>
                </div>
                <div style="height:80px;" class="box-style" v-for="(item, index) in diaryList" :key="index" @click.stop="LogRendering(item)">
                    <div class="report-body-item" >
                        <div class="report-item-img"><img :src="item.createUserLogo? item.createUserLogo:defaultLogo" alt=""></div>
                        <div class="report-item-title" >
                            <p><span>{{item.createUserName}}</span><span style="margin-left: 10px;"><button @click.stop="LogRendering(item)">编辑</button></span><br/>
                            <span style="color:#fff">上午：{{item.am_max_t_}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下午：{{item.pm_max_t_}}</span></p>
                        </div>
                        <div class="item-operate">
                            <div>{{item.date_}}&nbsp;&nbsp;{{item.times}}&nbsp;&nbsp;{{item.week}}</div>
                            <p>
                                <span class="operate-comment">评论({{item.commentCount}})</span>
                                <span class="operate-read">已读({{item.lookCount}})</span>
                                <span class="operate-file">附件({{item.accessory&&item.accessory.length>0?item.accessory.length:0}})</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div style="position:absolute;bottom:28px;left:50%;transform:translateX(-50%)">
                    <el-pagination
                        @size-change="changePageSize($event)"
                        @current-change="changePageNum($event)"
                        :current-page="pageIndex"
                        :page-sizes="[10, 25, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </div>
            </div>
        </div>
            
            
        </div>
        <div v-if="activeStr=='施工日志'" class="page-diary-index">
        	<div class="report-header">
                <div class="news-tabs  report-tabs" style="width:100%">
                    <h4 style="margin:8px 0 0 0;float:left;margin-right:30px">汇报</h4>
                    <span :class="{active:activeReportStr=='施工日志'}" @click="changeReport('施工日志')">日报</span>
                    <span :class="{active:activeReportStr=='周报'}" @click="changeReport('周报')">周报</span>
                    <span :class="{active:activeReportStr=='月报'}" @click="changeReport('月报')">月报</span>
                </div>
            </div>
            <div class="report-body" style="position: absolute;top: 60px;">
                <div class="tabs" style="position:absolute;top:14px;left:0;border:0 none;">
                    <span :class="{active:activediaryStr=='1'}" @click="changediary('1')">全部</span>
                    <span :class="{active:activediaryStr=='2'}" @click="changediary('2')">未读</span>
                    <span :class="{active:activediaryStr=='3'}" @click="changediary('3')">我的</span>
                    <div class="diary-button" style="float: right;">
                        <button @click="LogRenderingx()">新增日志</button>
                    </div>
                </div>
                <div style="height:80px;" class="box-style" v-for="(item, index) in diaryList" :key="index" @click.stop="LogRendering(item)">
                    <div class="report-body-item" >
                        <div class="report-item-img"><img :src="item.createUserLogo? item.createUserLogo:defaultLogo" alt=""></div>
                        <div class="report-item-title">
                            <p><span>{{item.createUserName}}</span><span style="margin-left: 10px;"><button @click="LogRendering(item)">编辑</button></span><br/>
                            <span style="color:#fff">上午：{{item.am_max_t_}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;下午：{{item.pm_max_t_}}</span></p>
                        </div>
                        <div class="item-operate">
                            <div>{{item.date_}}&nbsp;&nbsp;{{item.times}}&nbsp;&nbsp;{{item.week}}</div>
                            <p>
                                <span class="operate-comment">评论({{item.commentCount}})</span>
                                <span class="operate-read">已读({{item.lookCount}})</span>
                                <span class="operate-file">附件({{item.accessory&&item.accessory.length>0?item.accessory.length:0}})</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div style="position:absolute;bottom:28px;left:50%;transform:translateX(-50%)">
                    <el-pagination
                        @size-change="changePageSize($event)"
                        @current-change="changePageNum($event)"
                        :current-page="pageIndex"
                        :page-sizes="[10, 25, 50, 100]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </div>
            </div>
        </div>
        <div v-if="activeStr=='汇报详情'" class="page-diary-index" style="padding:0;">
            <div class="box-style" style="height:100%;">
                <div class="add-page" style="padding:66px 0 0 0">
                    <div class="add-page-button">
                        <button @click="back()">返回上一级</button>
                    </div>
                    <div class="add-page-form" style="overflow:auto;width:100%;height:100%;">
                        <div style="width:1094px;margin:0 auto;text-align:center">
                            <p style="position:relative;font-size:18px;margin-bottom:20px;padding-bottom:20px;border-bottom:1px solid rgba(231,231,231,1);">
                                {{addReportObj.TITLE_}}项目
                                <span v-if="addReportObj.TYPE_ == '月报'" style="font-size:14px;position:absolute;right:0;top:0;line-height:24px;">审核状态：{{addReportObj.status == 0 ? '不通过' : addReportObj.status == 1 ? '通过' : '未审核'}}</span>
                            </p>
                            <div class="btn" style="margin-bottom: 20px;" v-if="addReportObj.TYPE_ == '月报' && addReportObj.status != 1 && isApprover(addReportObj.checkMemberList)">
                                <el-button size="small" type="danger" @click="changeStatus(1)">审核通过</el-button>
                                <el-button size="small" type="danger" @click="changeStatus(0)">不通过</el-button>
                            </div>
                            <p style="font-size:18px;margin-bottom:10px;text-align:left;">工作计划</p>
                            <p style="color:#c4c4c4;padding-bottom:20px;text-align:left;text-indent: 37px;">{{addReportObj.workPlan}}</p>
                            <p style="font-size:18px;margin-bottom:10px;text-align:left;">工作记录</p>
                            <p style="color:#c4c4c4;padding-bottom:20px;text-align:left;text-indent: 37px;">{{addReportObj.workRecord}}</p>
                            <p style="font-size:18px;margin-bottom:10px;text-align:left;">工作总结</p>
                            <p style="color:#c4c4c4;padding-bottom:20px;text-align:left;text-indent: 37px;">{{addReportObj.workSummary}}</p>

							<div style="margin-left: 80px;">
                        		  <ul style="display: flex;flex-wrap：wrap;width: 970;">
		                                <li @click="imgdgu(item, index)" v-for="(item, index) in addReportObj.fileList" :key="index" style="ma

                                        rgin:20px 0 20px 20px;flex: 0 0 100px; height: 100px;overflow: hidden;">
		                                    <img style="width:100px;" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" alt="">
                                   </li>
		                            </ul>
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
        <div v-if="activeStr=='添加日志'" class="page-diary-index" style="padding:0;position: absolute;top:0;left:0;box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);">
            <div class="box-style" style="height:100%;">
                <div class="add-page" >
                    <div class="add-page-button">
                        <button  @click="activeStr='施工日志'">返回上一级</button>
                        <button @click="saveJourData">保存</button>
                    </div>
                    <div class="add-page-form" >
                      <div style="margin-bottom: 20px;">
                          <div class="title_text">项目信息</div>
                          <div style="display: flex;margin-bottom: 20px;">
                            <div style="height:38px;width:750px;margin-right: 10px;">
                              <span style="float:left;width:100px;line-height: 38px;">项目名称</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input v-model="$store.state.selectProjectObj.proName" disabled style="height:100%;" placeholder="请输入内容"></el-input>
                              </div>
                            </div>
                            <div style="height:38px;width:320px;">
                              <span style="float:left;width:60px;line-height: 38px;">日期</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <!--<el-date-picker v-model="NotifierObj.DATE_" style="height:100%;" type="date" placeholder="选择日期"></el-date-picker>-->
                                <el-input disabled v-model="getdatas" style="height:100%;" ></el-input>
                              </div>
                            </div>
                             <!--<div style="height:38px;width:200px;">
                              <span style="float:left;width:60px;line-height: 38px;">天气</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input v-model="mainweather"  size="mini"  class="select-msg-ele" style="width:100%;background:#fff;overflow:hidden" placeholder="请输入天气"></el-input>
                              </div>
                            </div>-->
                          </div>
                          <div style="width:1070px;margin-bottom: 20px;">
                            <span style="float:left;width:100px;line-height: 38px;">当日工作情况</span>
                            <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                              <el-input type="textarea" :rows="3" v-model="NotifierObj.CONTENT_" maxlength="800" show-word-limit style="height:100%;" placeholder="请输入内容"></el-input>
                            </div>
                          </div>
                          <div style="width:1070px;margin-bottom: 20px;">
                            <span style="float:left;width:100px;line-height: 38px;">变更情况</span>
                            <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                              <el-input type="textarea" :rows="3" v-model="NotifierObj.ALTERATION_CONDITION_" maxlength="800" show-word-limit style="height:100%;" placeholder="请输入内容"></el-input>
                            </div>
                          </div>
                          <div style="width:1070px;">
                            <span style="float:left;width:100px;line-height: 38px;">项目问题披露</span>
                            <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                              <el-input type="textarea" :rows="3" v-model="NotifierObj.ISSUE_ANNOUNCE_" maxlength="800" show-word-limit style="height:100%;" placeholder="请输入内容"></el-input>
                            </div>
                          </div>
                      </div>
                      <div>
                        <div style="display: flex;margin-bottom: 20px;">
                          <div>
                            <div class="title_text">上午天气</div>
                            <div style="margin-left: 30px;">
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">天气</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input v-model="NotifierObj.AM_WEATHER_" style="height:100%;" placeholder="请输入内容"></el-input>

                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">温度</span>
                              <div style="overflow: hidden;height:100%;display: flex">
                                <div style="border:1px solid #ccc;width:200px;">
                                  <el-input v-model="NotifierObj.AM_MIN_T_" style="height:100%;" placeholder="请输入内容"></el-input>
                                </div>
                                <div style="margin:0 10px;line-height: 38px">~</div>
                                <div style="border:1px solid #ccc;width:200px;">
                                  <el-input v-model="NotifierObj.AM_MAX_T_" style="height:100%;" placeholder="请输入内容"></el-input>
                                </div>
                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">风向</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input v-model="NotifierObj.AM_WDIR_" style="height:100%;" placeholder="请输入内容"></el-input>
                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">风力</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input v-model="NotifierObj.AM_WS" style="height:100%;" placeholder="请输入内容"></el-input>
                              </div>
                            </div>
                             </div>
                          </div>
                          <div>
                            <div class="title_text">下午天气</div>
                            <div  style="margin-left: 30px;">
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">天气</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input v-model="NotifierObj.PM_WEATHER_" style="height:100%;" placeholder="请输入内容"></el-input>
                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">温度</span>
                              <div style="overflow: hidden;height:100%;display: flex">
                                <div style="border:1px solid #ccc;width:200px;">
                                  <el-input v-model="NotifierObj.PM_MIN_T_" style="height:100%;" placeholder="请输入内容"></el-input>
                                </div>
                                <div style="margin:0 10px;line-height: 38px">~</div>
                                <div style="border:1px solid #ccc;width:200px;">
                                  <el-input v-model="NotifierObj.PM_MAX_T_" style="height:100%;" placeholder="请输入内容"></el-input>
                                </div>
                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">风向</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input v-model="NotifierObj.PM_WDIR_" style="height:100%;" placeholder="请输入内容"></el-input>
                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">风力</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input v-model="NotifierObj.PM_WS" style="height:100%;" placeholder="请输入内容"></el-input>
                              </div>
                            </div>
                            </div>
                          </div>
                        </div>
                      </div>
                        <div  class="add-page-form-body" style="margin-bottom:20px;">
                        	<div style="display: flex;">
                        		<div style="flex: 0 0 100px;">
                        			<p class="add-page-form-title" >问题统计</p>
                        		</div>
                        		<div>
                        			<div>
                        				<ul style="display: flex;margin-bottom: 10px;">
                        					<li><span class="li_span" @click.stop="onadd()">增加</span></li>
                        					<!--<li><span class="li_span" >修改</span></li>-->
                        					<!--<li><span class="li_span" @click.stop="ondel()">删除</span></li>-->
                        				</ul>
                        			</div>
                        			<div style="width: 1090px">
                        				  <el-table
										    ref="multipleTable"
										    :data="addlist"
										      border
										    tooltip-effect="dark"
										    style="width: 100%"
										    @selection-change="handleSelectionChange">
										    <el-table-column
										      type="index"

										      width="80">
										      <template slot-scope="scope">
										       <el-button
										          size="mini"
										          type="danger"
										          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
										           </template>
										    </el-table-column>
										    <!--<el-table-column
										      label="序号"
										      width="60">
										    </el-table-column>-->
										    <el-table-column
										      prop="address"
										      label="内控问题类型"
										      width="160"
										      >
										        <template slot-scope="scope">
										      		<el-input type="textarea":rows="1" v-model="scope.row.issueName " placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										     <el-table-column
										      prop="name"
										      label="缺陷&管理提升"
										      width="140">
										        <template slot-scope="scope">
										      		<!--<el-input v-model="scope.row.flawName" placeholder="请输入内容"></el-input>-->
										      		 <el-select v-model="scope.row.flawName" placeholder="请选择">
													    <el-option
													      v-for="item in optionsflawName"
													      :key="item.value"
													      :label="item.label"
													      :value="item.label">
													    </el-option>
													  </el-select>

										      </template>
										    </el-table-column>
										    <el-table-column
										      prop="address"
										      label="区域"
										      width="140"
										     >
										        <template slot-scope="scope">
										      		<el-input type="textarea" :rows="1" v-model="scope.row.areaName" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										      <el-table-column
										      prop="address"
										      label="问题点分布"
										      width="170"
										     >
										        <template slot-scope="scope">
										      		<el-input type="number" v-model="scope.row.troubleSpots" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										     <el-table-column
										      prop="name"
										      label="高风险"
										      width="90">
										        <template slot-scope="scope">
										      		<el-input type="number" v-model="scope.row.highRisk" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										    <el-table-column
										      prop="address"
										      label="中风险"
										      width="90"
										    >
										        <template slot-scope="scope">
										      		<el-input type="number" v-model="scope.row.inTheRisk" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										     <el-table-column
										      prop="name"
										      label="低风险"
										      width="90">
										        <template slot-scope="scope">
										      		<el-input type="number" v-model="scope.row.lowRisk" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										    <el-table-column
										      prop="address"
										      label="备注"
										      width="130">
										        <template slot-scope="scope">
										      		<el-input v-model="scope.row.content" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										  </el-table>

                        			</div>
                        		</div>
                        	</div>
                         </div>


                          <!--问题-->
                          <div>


                        <div  class="add-page-form-body" style="width:1050px;margin-bottom:20px;">
                        	<div style="display: flex;">
                        		<div style="flex: 0 0 100px;">
                        			<p class="add-page-form-title" >质量检查</p>
                        		</div>
                        		<div style="flex: 0 0 920px;">
                        			  <el-table @row-click="editMember" :data="tableData_quality" border style="width: 100%">
									    <el-table-column prop="sn" label="单据编号" width="140">
									    </el-table-column>
									    <el-table-column  prop="projName" label="项目名称" width="180">
									    </el-table-column>
									    <el-table-column prop="inspectItemName" label="检查项" width="120">
									    </el-table-column>
									     <el-table-column
									      prop="checkRequire"
									      label="规范要求"
									      width="220">
									    </el-table-column>
									     <el-table-column
									      label="类别"
									      width="60">
									          <template slot-scope="scope">
									        	{{scope.row.LB_ == 'day' ? '日常' : (scope.row.LB_ == 'week' ? '周检':(scope.row.LB_ == 'month' ? '月检' :(scope.row.LB_ == 'quarter' ? '季检 ' : '')) ) }}
										      </template>
									    </el-table-column>
									     <el-table-column
									      prop="statusName"
									      label="状态 "
									      width="80">
									    </el-table-column>
									     <el-table-column
									      prop="rectifyPrincipal"
									      label="检查人"
									      width="70">
									    </el-table-column>
									     <el-table-column
									      prop="rectifyDeadline"
									      label="检查时间"
									      width="100">
									    </el-table-column>
									        <el-table-column
									      prop="describes"
									      label="描述"
									      width="120">
									    </el-table-column>
									  </el-table>
                        		</div>
                        	</div>
                         </div>
                          <!--安全检查-->
                        <div  class="add-page-form-body" style="width:1050px;margin-bottom:20px;">
                        	<div style="display: flex;">
                        		<div style="flex: 0 0 100px;">
                        			<p class="add-page-form-title" >安全检查</p>
                        		</div>
                        		<div style="flex: 0 0 920px;">
                        			  <el-table @row-click="editMember" :data="tableData_safety" border style="width: 100%">
									    <el-table-column  prop="sn"  label="单据编号"  width="140"></el-table-column>
									    <el-table-column prop="projName" label="项目名称"  width="180">
									    </el-table-column>
									    <el-table-column
									      prop="inspectItemName"
									      label="检查项"
									      width="120">
									    </el-table-column>
									     <el-table-column
									      prop="checkRequire"
									      label="规范要求"
									      width="220">
									    </el-table-column>
									     <el-table-column
									      label="类别"
									      width="60">
									          <template slot-scope="scope">
									        	<!--prop="LB_"-->
									        	{{scope.row.LB_ == 'day' ? '日常' : (scope.row.LB_ == 'week' ? '周检':(scope.row.LB_ == 'month' ? '月检' :(scope.row.LB_ == 'quarter' ? '季检 ' : '')) ) }}
										      </template>
									    </el-table-column>
									     <el-table-column
									      prop="statusName"
									      label="状态 "
									      width="80">
									    </el-table-column>
									     <el-table-column
									      prop="rectifyPrincipal"
									      label="检查人"
									      width="70">
									    </el-table-column>
									     <el-table-column
									      prop="rectifyDeadline"
									      label="检查时间"
									      width="100">
									    </el-table-column>
									        <el-table-column
									      prop="describes"
									      label="描述"
									      width="120">
									    </el-table-column>
									  </el-table>
                        		</div>
                        	</div>
                         </div>

                          <!--实测实量-->
                        <div  class="add-page-form-body" style="width:1050px;margin-bottom:20px;">
                        	<div style="display: flex;">
                        		<div style="flex: 0 0 100px;">
                        			<p class="add-page-form-title" >实测实量</p>
                        		</div>
                        		<div style="flex: 0 0 920px;">
                        			  <el-table @row-click="editMember"  :data="tableData_measured"
									    border
									    style="width: 100%">
									    <el-table-column
									      prop="sn"
									      label="单据编号"
									      width="140">
									    </el-table-column>
									    <el-table-column
									      prop="projName"
									      label="项目名称"
									      width="180">
									    </el-table-column>
									    <el-table-column
									      prop="inspectItemName"
									      label="检查项"
									      width="120">
									    </el-table-column>
									     <el-table-column
									      prop="checkRequire"
									      label="规范要求"
									      width="220">
									    </el-table-column>
									     <el-table-column

									      label="类别"
									      width="60">
									        <template slot-scope="scope">
									        	<!--prop="LB_"-->
									        	{{scope.row.LB_ == 'day' ? '日常' : (scope.row.LB_ == 'week' ? '周检':(scope.row.LB_ == 'month' ? '月检' :(scope.row.LB_ == 'quarter' ? '季检 ' : '')) ) }}
										      </template>
									    </el-table-column>
									     <el-table-column
									      prop="statusName"
									      label="状态 "
									      width="80">
									    </el-table-column>
									     <el-table-column
									      prop="rectifyPrincipal"
									      label="检查人"
									      width="70">
									    </el-table-column>
									     <el-table-column
									      prop="rectifyDeadline"
									      label="检查时间"
									      width="100">
									    </el-table-column>
									        <el-table-column
									      prop="describes"
									      label="描述"
									      width="120">
									    </el-table-column>
									  </el-table>
                        		</div>
                        	</div>
                         </div>
                          <!--工序验收-->
                        <div  class="add-page-form-body" style="width:1050px;margin-bottom:20px;">
                        	<div style="display: flex;">
                        		<div style="flex: 0 0 100px;">
                        			<p class="add-page-form-title" >工序验收</p>
                        		</div>
                        		<div style="flex: 0 0 920px;">
                        			  <el-table @row-click="editMember"
									    :data="tableData_process"
									    border
									    style="width: 100%">
									    <el-table-column
									      prop="sn"
									      label="单据编号"
									      width="140">
									    </el-table-column>
									    <el-table-column
									      prop="projName"
									      label="项目名称"
									      width="180">
									    </el-table-column>
									    <el-table-column
									      prop="inspectItemName"
									      label="检查项"
									      width="120">
									    </el-table-column>
									     <el-table-column
									      prop="checkRequire"
									      label="规范要求"
									      width="220">
									    </el-table-column>
									     <el-table-column
									      label="类别"
									      width="60">
									          <template slot-scope="scope">
									        	<!--prop="LB_"-->
									        	{{scope.row.LB_ == 'day' ? '日常' : (scope.row.LB_ == 'week' ? '周检':(scope.row.LB_ == 'month' ? '月检' :(scope.row.LB_ == 'quarter' ? '季检 ' : '')) ) }}
										      </template>
									    </el-table-column>
									     <el-table-column
									      prop="statusName"
									      label="状态 "
									      width="80">
									    </el-table-column>
									     <el-table-column
									      prop="rectifyPrincipal"
									      label="检查人"
									      width="70">
									    </el-table-column>
									     <el-table-column
									      prop="rectifyDeadline"
									      label="检查时间"
									      width="100">
									    </el-table-column>
									        <el-table-column
									      prop="describes"
									      label="描述"
									      width="120">
									    </el-table-column>
									  </el-table>
                        		</div>
                        	</div>
                         </div>

                          <!--材料验收-->
                        <div  class="add-page-form-body" style="width:1050px;margin-bottom:20px;">
                        	<div style="display: flex;">
                        		<div style="flex: 0 0 100px;">
                        			<p class="add-page-form-title" >材料验收</p>
                        		</div>
                        		<div style="flex: 0 0 920px;">
                        			  <el-table
									    :data="tableData_material"
									    border
									    style="width: 100%">
									    <el-table-column
									      prop="code"
									      label="单据编号"
									      width="140">
									    </el-table-column>
									    <el-table-column
									      prop="projName"
									      label="项目名称"
									      width="180">
									    </el-table-column>
									    <el-table-column
									      prop="name"
									      label="名称"
									      width="120">
									    </el-table-column>
									     <el-table-column
									      prop="specs"
									      label="型号规格"
									      >
									    </el-table-column>
									     <el-table-column
									      label="到货数量"
                                          prop="quantity"
									      width="80">
									    </el-table-column>
									     <el-table-column
									      label="合格数"
                                          prop="passNum"
									      width="80">
									    </el-table-column>
									     <el-table-column
									      label="不合格数 "
                                          prop="notPassNum"
									      width="80">
									    </el-table-column>
									     <el-table-column
									      prop="checkName"
									      label="检查人"
									      width="70">
									    </el-table-column>
									     <el-table-column
									      prop="updateTime"
									      label="检查时间"
                                          width="140"
									      >
									    </el-table-column>
									        <el-table-column
									      prop="content"
									      label="描述"
									      width="120">
									    </el-table-column>
									  </el-table>
                        		</div>
                        	</div>
                         </div>
                        </div>

                      <div style="width:1190px;margin-top: 20px;">
                        <div style="overflow: hidden">
                          <div class="title_text" style="float: left">附件</div>
                          <div style="float: right">
                            <button @click="upLoadIngFill">添加</button>
                          </div>
                        </div>
                        <div style="margin-left: 100px;">
                          <el-table :data="NotifierObj.fileList" border  >
                            <el-table-column prop="fileName" label="文件名称" >
                            </el-table-column>
                            <el-table-column prop="createUserName" label="上传者" >
                            </el-table-column>
                            <el-table-column prop="createTime" label="上传时间">
                            </el-table-column>
                            <el-table-column label="操作" width="65">
                              <template slot-scope="scope">
                                <div>
                                  <img src="../../assets/administrationIcon/remove.png"  style="width:18px" @click="delFile(scope.row)" alt="">
                                  <img v-show="!scope.row.isNewFlag" src="../../assets/administrationIcon/daoru.png"  style="width:18px" @click="downLoadFile(scope.row)" alt="">
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        	<div style="margin-left: 80px;">
                        		  <ul style="display: flex;flex-wrap：wrap;width: 970;">
		                                <li @click="imgdgu(item, index)" v-for="(item, index) in NotifierObj.fileList" :key="index" style="margin:20px 0 20px 20px;flex: 0 0 100px; height: 100px;overflow: hidden;">
		                                    <img style="width:100px;" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=false&access_token='+sessionUtil.getAccessToken()" alt="">
		                                </li>
		                            </ul>
                        	</div>
                      </div>
                      <div class="add-page-form-body"  style="width:1050px;margin-bottom:20px;">
                        <p class="add-page-form-title" >{{sendMessage}}</p>
                        <div class="member-box">
                          <ul class="clear" style="padding-left:100px;box-sizing:border-box">
                            <li v-for="(item, index) in NotifierObj.memberList" :key="index" class="member-item"><i @click.stop.prevent="deleteMember(item)"></i><img :src="item.picture" alt=""><span style="display:block;width:60px">{{item.userName}}</span></li>
                            <li style="margin-left:9px;"><img style="width: 42px;height: 42px;" src="../../assets/indexImg/add.png" @click.stop.prevent="addMember(NotifierObj.memberList)" alt=""></li>
                          </ul>
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
        
        <div v-if="activeStr=='添加汇报'" class="page-diary-index" style="padding:0;">
            <div class="box-style" style="height:100%;">
                <div class="add-page" style="">
                    <div class="add-page-button">
                        <div>
                            <el-button size="small" @click="back()">返回上一级</el-button>
                            <el-button size="small" @click="saveReport">保存</el-button>
                        </div>
                        
                    </div>
                    <div class="add-page-form" >
                        <div style="width:1050px" class="add-page-form-body">
                            <div class="select-msg-box" style="width:100%;margin:0;">
                                <span style="float:left;width:100px">类型</span>
                                <div style="overflow:hidden">
                                    <!--<div style="float:left;margin-right:20px" @click="changeType('日报')">
                                        <input type="radio" v-model="addReportObj.TYPE_" value="日报" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">日报</label>
                                    </div>-->
                                    <div style="float:left;margin-right:20px" @click="changeType('周报')">
                                    <!-- <div style="float:left;margin-right:20px" @click="addReportObj.TYPE_='周报';$forceUpdate();addReportObj.TITLE_=addReportObj.CREATE_USER_+'-'+addReportObj.TYPE_+'-'+addReportObj.projectName+'项目 '+addReportObj.CREATE_TIME_"> -->
                                        <input type="radio" v-model="addReportObj.TYPE_" value="周报" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">周报</label>
                                    </div>
                                    <div style="float:left;margin-right:20px" @click="changeType('月报')">
                                    <!-- <div style="float:left;margin-right:20px" @click="addReportObj.TYPE_='月报';$forceUpdate();addReportObj.TITLE_=addReportObj.CREATE_USER_+'-'+addReportObj.TYPE_+'-'+addReportObj.projectName+'项目 '+addReportObj.CREATE_TIME_"> -->
                                        <input type="radio" v-model="addReportObj.TYPE_" value="月报" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">月报</label>
                                    </div>
                                </div>
                            </div>

                            <div style="width:100%;overflow:hidden">
                                <div class="select-msg-box" style="width:690px;float:left;">
                                    <span style="float:left;width:100px">标题</span>
                                    <div style="overflow:hidden">
                                        <el-input v-model="addReportObj.TITLE_" size="mini"  class="select-msg-ele" style="width:100%;background:#fff;overflow:hidden" placeholder="请输入标题"></el-input>
                                    </div>
                                </div>
                                <div class="select-msg-box" style="width:330px;float:left;margin-left:30px;">
                                    <span style="float:left;width:100px">日期</span>
                                    <div style="overflow:hidden"  v-show="addReportObj.TYPE_=='月报'">
                                        <el-date-picker
                                        style="width:100%;background:#fff;overflow:hidden"
                                        v-model="addReportObj.MOUTHDATE_"
                                        value-format="yyyy-MM"
                                        format="yyyy-MM"
                                        class="select-msg-ele"
                                        :editable="false"
                                        type="month"
                                        placeholder="选择日期">
                                        </el-date-picker>
                                    </div>
                                    <div style="overflow:hidden" v-show="addReportObj.TYPE_=='周报'">
                                        <el-date-picker
                                        v-model="addReportObj.WEEKDATE_"
                                        type="daterange"
                                        style="width:100%;background:#fff;overflow:hidden"
                                        align="right"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy-MM-dd"
                                        unlink-panels
                                        placeholder="选择日期"
                                        class="select-msg-ele"
                                        range-separator="至"
                                        start-placeholder="开始日期"
                                        end-placeholder="结束日期"
                                        :picker-options="pickerOptions">
                                        </el-date-picker>
                                    </div>
                                    <div style="overflow:hidden" v-show="addReportObj.TYPE_=='日报'">
                                        <el-date-picker
                                        style="width:100%;background:#fff;overflow:hidden"
                                        v-model="addReportObj.DAYDATE_"
                                        value-format="yyyy-MM-dd"
                                        format="yyyy-MM-dd"
                                        class="select-msg-ele"
                                        :editable="false"
                                        type="date"
                                        placeholder="选择日期">
                                        </el-date-picker>
                                    </div>
                                </div>
                            </div>
                            <div class="select-msg-box" style="width:100%;margin-top:0;height:auto">
                                <span style="float:left;width:100px">工作计划</span>
                                <div style="overflow:hidden;height:100px;">
                                    <el-input v-model="addReportObj.WORK_PLAN_" rows='3' maxlength="500" show-word-limit type="textarea" size="medium" class="select-msg-ele"
                                     style="height:100px;width:100%;background:#fff;padding:0;overflow-x:hidden;overflow-y:auto" placeholder="请输入工作计划"></el-input>
                                </div>
                            </div>
                            <div class="select-msg-box" style="width:100%;margin-top:0;height:auto">
                                <span style="float:left;width:100px">工作记录</span>
                                <div style="overflow:hidden;height:100px;">
                                    <el-input v-model="addReportObj.WORK_RECORD_" rows='3' maxlength="500" show-word-limit :autosize="true" type="textarea" size="medium" class="select-msg-ele"
                                     style="height:100px;width:100%;background:#fff;padding:0;overflow-x:hidden;overflow-y:auto" placeholder="请输入工作记录"></el-input>
                                </div>
                            </div>
                            <div class="select-msg-box" style="width:100%;margin-top:0;height:auto">
                                <span style="float:left;width:100px">工作总结</span>
                                <div style="overflow:hidden;height:100px;">
                                    <el-input v-model="addReportObj.WORK_SUMMARY_" rows='3' maxlength="500" show-word-limit :autosize="true" type="textarea" size="medium" class="select-msg-ele"
                                     style="height:100px;width:100%;background:#fff;padding:0;overflow-x:hidden;overflow-y:auto" placeholder="请输入工作总结"></el-input>
                                </div>
                            </div>
                        </div>
                        <div  class="add-page-form-body" style="width:1050px;margin-bottom:20px;">
                            <p class="add-page-form-title" >附件
                                <button style="float:right" @click="upLoadIngFill">添加</button>
                            </p>
                            <div style="width:948px;margin-left:100px;">
                                <el-table :data="addReportObj.fileList"  border style="width: 100%" >
                                    <el-table-column type="index" label="序号" width="55">
                                    </el-table-column>
                                    <el-table-column prop="fileName" label="文件名称">
                                    </el-table-column>
                                    <el-table-column prop="createUserName" label="上传者"  width="150">
                                    </el-table-column>
                                    <el-table-column prop="createTime" label="上传时间"  width="160">
                                    </el-table-column>
                                    <el-table-column label="操作" width="65">
                                        <template slot-scope="scope">
                                            <div>
                                                <a v-if="!scope.row.isNewFlag" :href="util.getBaseUrl() + '/api_v1/files/'+scope.row.id+'/download?access_token='+sessionUtil.getAccessToken()"><img src="../../assets/administrationIcon/daoru.png" width="18" alt=""></a>
                                                <img src="../../assets/administrationIcon/remove.png"  style="width:18px" @click="delFile(scope.row)" alt="">
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            	<div style="margin-left: 80px;">
                        		  <ul style="display: flex;flex-wrap：wrap;width: 970;">
		                                <li @click="imgdgu(item, index)" v-for="(item, index) in addReportObj.fileList" :key="index" style="margin:20px 0 20px 20px;flex: 0 0 100px; height: 100px;overflow: hidden;">
		                                    <img style="width:100px;" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=false&access_token='+sessionUtil.getAccessToken()" alt="">
		                                </li>
		                            </ul>
                        	</div>
                        </div>
                         <div class="add-page-form-body" v-show="addReportObj.TYPE_=='月报'" style="width:1050px;margin-bottom:20px;" >
                            <p class="add-page-form-title">审核人</p>
                            <div class="member-box">
                               <ul class="clear" style="padding-left:100px;box-sizing:border-box">
                                    <li v-for="(item, index) in addReportObj.checkMemberList" :key="index" class="member-item"><i @click.stop.prevent="deleteMember(item, 0)"></i><img :src="item.picture" alt=""><span style="display:block;width:60px">{{item.userName}}</span></li>
                                    <li style="margin-left:9px;"><img style="width: 42px;height: 42px;" src="../../assets/indexImg/add.png" @click.stop.prevent="addMember(addReportObj.checkMemberList,0)" alt=""></li>
                                </ul>
                            </div>
                        </div>
                        <div class="add-page-form-body"  style="width:1050px;margin-bottom:20px;">
                            <p class="add-page-form-title">{{sendMessage}}</p>
                            <div class="member-box">
                               <ul class="clear" style="padding-left:100px;box-sizing:border-box">
                                    <li v-for="(item, index) in addReportObj.memberList" :key="index" class="member-item"><i @click.stop.prevent="deleteMember(item, 1)"></i><img :src="item.picture" alt=""><span style="display:block;width:60px">{{item.userName}}</span></li>
                                    <li style="margin-left:9px;"><img style="width: 42px;height: 42px;" src="../../assets/indexImg/add.png" @click.stop.prevent="addMember(addReportObj.memberList,1)" alt=""></li>
                                </ul>
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
        <div v-if="activeStr=='楼栋管理'" class="page-building-index">
            <div class="building-fl">
                <div class="box-style" style="color:#fff;">
                    <div style="padding-top:45px;">
                        <div style="width:100%;position:relative;">
                            <h4 style="position:absolute;width:100%;top:-35px;left:0px;box-sizing:border-box;">区域
                                <div style="float:right">
                                    <button @click="editPart" v-if="sessionUtil.isAllowEdit('t_work_part')">编辑</button>
                                    <button @click="addPart" v-if="sessionUtil.isAllowAdd('t_work_part')">添加</button>
                                    <!-- <button @click="addPart('root')" v-if="sessionUtil.isAllowBtn('gc1_4:area_btn_add')">根目录</button> -->
                                    <button @click="deletePart" v-if="sessionUtil.isAllowDelete('t_work_part')">删除</button>
                                </div>
                            </h4>
                        </div>
                        <div style="width:100%;height:100%;overflow:auto">
                            <aside-item :models="item" style="text-align:left;" :level="0" v-for="(item, index) in models"  :key="index"></aside-item>
                        </div>
                    </div>
                    <i class="box-style-top-left"></i>
                    <i class="box-style-top-right"></i>
                    <i class="box-style-bottom-left"></i>
                    <i class="box-style-bottom-right"></i>
                </div>
            </div>
            <div class="building-fr" >
                <div class="box-style">
                    <div class="building-box">
                        <div class="building-title">
                            <h4>图纸
                                <div style="float:right">
                                    <button @click="loadDrawing"  v-if="sessionUtil.isAllowEdit('t_work_part')">加载图纸</button>
                                    <!-- <button @click="saveDrawingData(1)" v-if="sessionUtil.isAllowBtn('gc1_4:drawing_save')">保存图纸</button> -->
                                    <button @click="deleteDrawing()" v-if="sessionUtil.isAllowDelete('t_work_part')">删除图纸</button>
                                </div>
                            </h4>
                        </div>
                        <div  ref="tops" class="building-drawing">
                            <!-- <remote-script src="../../../static/js/leaflet/lib/leaflet.js"  @load="leafletLoaded = true" ></remote-script>
                            <remote-script v-if="leafletLoaded" src="../../../static/js/leaflet/lib/leaflet.draw.js" @load="loaded();"></remote-script> -->
                            <remote-script src="./js/leaflet/lib/leaflet.js"  @load="leafletLoaded = true" ></remote-script>
                            <remote-script v-if="leafletLoaded" src="./js/leaflet/lib/leaflet.draw.js" @load="loaded();"></remote-script>
                            <div id="map" style="width: 100%; height: 100%; border: 1px solid #ccc"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="add-part-box" v-if="isAddPart" style="z-index:888">
                <div class="add-part" style="min-height: 240px;">
                    <p>部位</p>
                    <div class="select-msg-box" v-show="addPartType==0">
                        <span style="float: left;">楼栋名称</span>
                        <el-input v-model="partName" size="mini" class="select-msg-ele" placeholder="请输入"></el-input>
                        <span style="float: left;">编码</span>
                        <el-input v-model="code" size="mini" class="select-msg-ele" placeholder="请输入"></el-input>
                        <!--<span v-show="isEditFlag" style="float: left;">排序</span>
          	              <el-input v-show="isEditFlag" v-model="partSort" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>-->
						 <span style="float: left;">业态</span>
						 <div style="float: left;margin:0;border: 1px solid #ccc;border-radius: 3px;padding: 0 10px;width: 276px;">
						 	  <el-select v-model="yeTai" size="mini" class="select-ele" placeholder="请选择" style="width: 100%;">
		                            <el-option v-for="(item, index) in listsm " :label="item.label" :value="item.label" :key="index"></el-option>
		                        </el-select>
						 </div>
                    </div>
                        <div class="select-msg-box" v-show="addPartType==1">
                        <span style="float: left;">楼栋名称</span>
                        <el-input v-model="partName" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>
                        <span style="float: left;">编码</span>
                        <el-input v-model="code" size="mini" class="select-msg-ele" placeholder="请输入"></el-input>
                        <!--<span v-show="isEditFlag" style="float: left;">排序</span>
          	              <el-input v-show="isEditFlag" v-model="partSort" size="mini" class="select-msg-ele" placeholder="请选择"></el-input>-->
						 <span style="float: left;">业态</span>
						 <div style="float: left;margin:0;border: 1px solid #ccc;border-radius: 3px;padding: 0 10px;width: 276px;">
						 	  <el-select v-model="yeTai" size="mini" class="select-ele" placeholder="请选择" style="width: 100%;">
		                            <el-option v-for="(item, index) in listsm " :label="item.label" :value="item.label" :key="index"></el-option>
		                        </el-select>
						 </div>

                    </div>
                    

                    <div style="float:right;padding-top:20px">
                        <button style="margin-right:20px;" @click="isAddPart=false">关闭</button>
                        <button @click="savePartData(addPartType)">保存</button>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isUpLoadingShow">
          <div  class="add-part-box" style="z-index:988" @click.stop.prevent="cancelLoading" ></div>
          <div class="add-part" style="z-index:990;min-height:234px;padding-bottom:50px;">
            <p style="margin-bottom:10px;">添加附件</p>
            <div style="max-height:500px;overflow-y:auto;overflow-x:hidden">
                <uploading v-model="uploadingName"   :config="uploadConfig" ref="uploading" ></uploading>
            </div>
            <div style="padding-top:10px;position:absolute;bottom:20px;right: 20px;">
                <button style="margin-right:20px;" @click.stop.prevent="cancelLoading">关闭</button>
                <button @click.stop.prevent="saveFill">保存</button>
            </div>
          </div>
        </div>

      <div v-if="isregion">
        <div  class="add-part-box" style="z-index:991" @click.stop.prevent="isregion=false" ></div>
        <div class="add-part" style="z-index:992;min-height:234px;padding-bottom:50px;">
          <p style="margin-bottom:10px;">选择部位</p>
          <div style="max-height:500px;overflow-y:auto;overflow-x:hidden">
            <asideItem v-for="(item, index) in model"  :key="index" :models="item" :level="0" ></asideItem>
          </div>
          <div style="padding-top:10px;position:absolute;bottom:20px;right: 20px;">
            <button style="margin-right:20px;" @click.stop.prevent="isregion=false">关闭</button>
          </div>
        </div>
      </div>

      <div v-if="isTeam">
        <div  class="add-part-box" style="z-index:991" @click.stop.prevent="isTeam=false" ></div>
        <div class="add-part" style="z-index:992;min-height:234px;padding-bottom:50px;">
          <p style="margin-bottom:10px;">选择班组</p>
          <div style="max-height:500px;overflow-y:auto;overflow-x:hidden">
              <div v-for="(item,index) in TeamList" style="text-align: left;height:30px;line-height: 30px;" :key="index"  @click="Teambtn(item)">
                <span>{{index+1}},班组名称:</span>{{item.name}}
              </div>
          </div>
          <div style="padding-top:10px;position:absolute;bottom:20px;right: 20px;">
            <button style="margin-right:20px;" @click.stop.prevent="isTeam=false">关闭</button>
          </div>
        </div>
      </div>
      <div v-if="isJournal">
        <div  class="add-part-box" style="z-index:988" @click.stop.prevent="isJournal=false" ></div>
        <div class="add-part" style="width:650px;z-index:990;min-height:234px;padding-bottom:50px;">
          <p style="margin-bottom:10px;">添加施工明细</p>
          <div style="max-height:500px;overflow-y:auto;overflow-x:hidden">
            <div style="display: flex;margin-bottom: 20px;">
              <div style="height:38px;width:300px;margin-right: 10px;">
                <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">分项工程</span>
                <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                  <el-input v-model="DetailedObj.SUBJECT_" style="height:100%;" placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div style="height:38px;width:300px;">
                <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">部位</span>
                <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                  <el-input v-model="DetailedObj.PART_NAME_" style="height:100%;" @focus="isregion=true" placeholder="请输入内容"></el-input>
                </div>
              </div>
            </div>
            <div style="display: flex;margin-bottom: 20px;">
              <div style="height:38px;width:300px;margin-right: 10px;">
                <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">班组</span>
                <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                  <el-input v-model="DetailedObj.GROUP_NAME_" style="height:100%;" @focus="isTeam=true"  placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div style="height:38px;width:300px;">
                <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">进度情况</span>
                <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                  <el-input v-model="DetailedObj.SCHEDULE_DESC_" style="height:100%;" placeholder="请输入内容"></el-input>
                </div>
              </div>
            </div>
            <div style="display: flex;margin-bottom: 20px;">
              <div style="height:38px;width:300px;margin-right: 10px;">
                <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">上午人数</span>
                <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                  <el-input v-model="DetailedObj.AM_NNT_" style="height:100%;" placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div style="height:38px;width:300px;">
                <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">下午人数</span>
                <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                  <el-input v-model="DetailedObj.PM_NNT_" style="height:100%;" placeholder="请输入内容"></el-input>
                </div>
              </div>
            </div>
            <div style="display: flex;margin-bottom: 20px;">
              <div style="height:38px;width:300px;margin-right: 10px;">
                <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">晚上人数</span>
                <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                  <el-input v-model="DetailedObj.NIGHT_NNT_" style="height:100%;" placeholder="请输入内容"></el-input>
                </div>
              </div>
              <div style="height:38px;width:300px;">
                <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">加班小时</span>
                <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                  <el-input v-model="DetailedObj.OVER_TIME_" style="height:100%;" placeholder="请输入内容"></el-input>
                </div>
              </div>
            </div>
          </div>
          <div style="padding-top:10px;position:absolute;bottom:20px;right: 20px;">
            <button style="margin-right:20px;" @click.stop.prevent="isJournal=false">关闭</button>
            <button @click.stop.prevent="saveJournal">保存</button>
          </div>
        </div>
      </div>

       <el-dialog
          :title="deleteObj.deleteMsg"
          :visible.sync="deleteObj.dialogVisible"
          width="30%">
          <p>你确定要删除吗？</p>
          <span slot="footer" class="dialog-footer">
          <el-button @click="deleteObj.dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteProj">确 定</el-button>
          </span>
      </el-dialog>

      <el-dialog :visible.sync="recordVisible" width="1000px" >
			  <div style="height: 478px;overflow: auto;">
                  <el-row style="padding-bottom: 15px;">
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">编号：</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.sn"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">类型：</div>
                        <div class="bz_le" style="width: 66%;">
                            <span>{{editMembershow.DATA_TYPE_ == 'record' ? '记录 ': '问题'}}</span>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">状态：</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.statusName"></el-input>
                        </div>
                    </el-col>
                 </el-row>
                 <el-row style="display: flex; padding-bottom: 15px;" >
                    <div style="width:80px">检查项：</div>
                    <div class="bz_le" style="width: 84%;">
                        <el-input :disabled="true" v-model="editMembershow.INSPECT_ITEM_NAME_"></el-input>
                    </div>
                 </el-row>
                 <el-row style="display: flex; padding-bottom: 15px;" >
                    <div style="width:80px">规范要求：</div>
                    <div class="bz_le" style="width: 84%;">
                        <el-input :disabled="true" v-model="editMembershow.checkRequire"></el-input>
                    </div>
                 </el-row>
                 <el-row style="padding-bottom: 15px;">
                    <el-col :span="16" style="display: flex;">
                        <div style="width:80px">检查部位：</div>
                        <div class="bz_le" style="width: 83%;">
                            <el-input :disabled="true" v-model="editMembershow.INSPECT_PART_NAME_"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="8" style="display: flex;">
                        <div style="width:80px">图纸位置：</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.lb"></el-input>
                        </div>
                    </el-col>
                 </el-row>
                 <el-row style="padding-bottom: 15px;">
                    <el-col :span="12" style="display: flex;">
                        <div style="width:80px">检查人</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.createUserName"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="12" style="display: flex;">
                        <div style="width:88px">整改负责人：</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.rectifyPrincipal"></el-input>
                        </div>
                    </el-col>
                 </el-row>
                 <el-row style="padding-bottom: 15px;">
                    
                    <el-col :span="12" style="display: flex;">
                        <div style="width:80px">整改参与人</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.takePartUsers"></el-input>
                        </div>
                    </el-col>
                    <el-col :span="12" style="display: flex;">
                        <div style="width:80px">整改期限</div>
                        <div class="bz_le">
                            <el-input :disabled="true" v-model="editMembershow.RECTIFY_DEADLINE_"></el-input>
                        </div>
                    </el-col>
                 </el-row>
                  <div style="display: flex;align-items: center;padding-bottom: 15px;">
                    <div style="width:80px">
                            描述：
                    </div> 
                    <div style="width: 87%;">
                        <el-input type="textarea" :disabled="true" v-model="editMembershow.DESC_"></el-input>
                    </div>
                </div>
			  	
                <el-popover placement="right-start" width="500" trigger="click">
                <div style="height: 500px;overflow: auto">
                    <el-timeline >
                        <el-timeline-item :timestamp="editMembershow.createTime"  placement="top">
                            <el-card>
                                <div>
                                    <span>{{editMembershow.createUserName+':'+editMembershow.DESC_}}</span>
                                    <span style="float: right;">{{editMembershow.DATA_TYPE_=='record'? '记录':'整改前'}}</span>
                                </div>
                                <p style="text-align: left; width: 100px;">附件:</p>
                                <ul style="display: flex;flex-wrap：wrap;width: 870;">
                                    <el-image style="width: 100px; height: 100px" v-for="(item, index) in editMembershow.imgs" :key="index"
                                        :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" 
                                    fit="cover"></el-image>
                                </ul>
                            </el-card>
                        </el-timeline-item>
                        <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.createTime" placement="top">
                            <el-card>
                                <div>
                                    <span>{{activity.createUserName+':'+(activity.DESC_? activity.DESC_:'')}}</span>
                                    <span style="float: right;">{{activity.status}}</span>
                                </div>
                                <p style="text-align: left; width: 100px;">附件:</p>
                                <ul style="display: flex;flex-wrap：wrap;width: 870;">
                                    <el-image style="width: 100px; height: 100px" v-for="(item, index) in activity.imgs" :key="index"
                                        :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken()" 
                                    fit="cover"></el-image>
                                </ul>
                            </el-card>
                            
                        </el-timeline-item>
                    </el-timeline>
            	</div>
                <el-button slot="reference">查看整改记录</el-button>
                </el-popover>
			  </div>
			  
			</el-dialog>
      <selectMember ref="selectMemberFun" :selectMemberModels='selectMemberModels'></selectMember>


      <div v-show="imgshows" @click.stop="imgshows = false" style="position: fixed;top:0;left: 0;right: 0;bottom: 0;z-index: 9999; background: rgba(0,0,0,.2);">
      	<div style="width: 1070px;margin: 150px auto;">
      		<img width="830px" :src="imgitem" alt="" />
      	</div>
      </div>

    </div>
</template>
<script>
// import { lmap } from '../../../static/js/leaflet/lib/map.js';
import { lmap } from './js/leaflet/lib/map.js';
import $ from 'jquery';
import asideItem from '../common/asideItem.vue'
import uploading from '../common/uploading.vue'
import selectMember from '../common/selectMember.vue'
export default {
    data(){
        return{
            dialogVisibles:true,
            recordVisible:false,
            editMembershow:{},
            activities:[],
            defaultLogo:require('@/assets/sflogo.jpg'),
        	imgitem:'',
        	imgshows:false,
        	classify:'',
        	currentRow:null,
        	mainweather:'',
        	addlist:[],
        	optionsflawName:[
        	    {label:'设计缺陷',value:1},
        		{label:'执行缺陷',value:2},
        		{label:'管理提升',value:3},
        	],
        	 tableData_quality: [],
        	 tableData_safety: [],
        	 tableData_measured: [],
        	 tableData_process: [],
        	 tableData_material: [],
        	getdatas:'',
        	yeTai:'',
        	listsm:[
        		{label:'仓库楼',value:1},
        		{label:'分拣中心',value:2},
        		{label:'办公楼',value:3},
        		{label:'综合楼',value:4},
        		{label:'中转站',value:5},
        	],
        	partName:"",
            code: "",
            pageIndex:1,
            pageSize:10,
            workPageIndex:1,
            workPageSize:10,
            totalCount:0,
            workTotalCount:0,
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
            deleteObj:{dialogVisible:false,deleteMsg:''},
            selectMemberModels:{
                isShow:false,
                selectList:[],
                callBack:this.callBack3,
                radioSelectFlags:false,
                type: ''
            },
            newsObj:{},
            addReportObj:{},
            NotifierObj:{children:[],memberList:[],fileList:[],deleteFilesList:[]},
            arrowShow:false,
            uploadingName:'',
            uploadConfig:{
                limit: 10,
                limitSize: 50048576,
                readOnly: false,
                xtype: "test",
                accept: ".jpg,.jpeg,.png,.JPG,.JPEG,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xlsx",
            },
            isUpLoadingShow:false,
            isAddPart:false,
            models:[],
            model:[],
            activePrveStr:'',
            activeStr:'首页',
            activeNewsStr:'全部',
            activeReportStr:'施工日志',
            activeIsUsReportStr:'全部',
            activediaryStr:'1',
            carouselHeight:0,
            leftNum:0,
            stepNum:0,
            BoxWidth:0,
            // reportObj:{finish:50},
            diaryList:[],
            reportList:[],
            newsList:[],
            localeMsgList:[],
            defaultImg:require('../../assets/indexImg/loading.png'),
            carouselList:[],
            environmentObj:{},
            realObj:{},
            qualityObj:{},
            safetyObj :{},
            infoObj :{},
            buildingNode:{},
            projObj:[],
            deleteFilesList:[],
            projList:[],
            unit:[],
            type:'',
            titleNewsStr:'',
            dataType:3,
            leafletLoaded: false,
            isEditFlag: false,
            addPartType:0, //添加部位类型
            imageUrl:"",
            tempPartObj:{},//当前选择部位
            childPartObj:{},//子部位对象
            currentEntity:{},//当前图层对象
            rectangleData:[],//当前图层数据
            partChildren:[],
            partSort:0, //部位排序号,
            JournalData:[],
            isJournal:false,
            DetailedObj:{},
            isregion:false,
            isTeam:false,
            TeamList:[],
            isCreateEdit:'',   //施工日志是否是编辑状态
            JournalId:'',
            JournalFileArr:[],
            sendMessage: '抄送人',
            memberList: []
        }
    },
    created(){
        this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.$bus.$on('handelDeparts',this.refreshPicture)
        this.changeIndex('首页');
        this.getdatas = new Date().format("yyyy-MM-dd");
//      this.getdatain();
//      this.changeReport('1');


    },
    activated(){
    	this.refreshPicture();
    	this.addlist=[];
    	this.listsm=[];
    	this.yeTai='';
    },
    beforeDestroy(){
        this.$bus.$off('handelDeparts',this.refreshPicture)
    },
    mounted() {
        this.$nextTick(()=>{
            var num=this.$refs.projMiddleTop.offsetHeight;
            this.carouselHeight=num;
        })

        var box=document.querySelector('.locale-msg-box')
        this.BoxWidth=parseInt(window.getComputedStyle(box).width)
        this.$store.state.selectProjectNode={};
    },
    components:{uploading,selectMember,asideItem},
    methods:{
        mouseover() {
            this.activeStr = '项目会议'
        },
    	ruoter(){
    		this.$route.push('projProfile/checkSet')
        },
        back(){
            this.deleteFilesList=[]
            this.newsObj={}
            this.addReportObj={}
            this.changeIndex(this.activePrveStr)
        },
        isApprover(userList){//是否是审核人
            var userUid = this.sessionUtil.getUserUid()
            var index = userList.findIndex(item=>item.id===userUid);
            if(index>=0){
                return true;
            }else{
                return false;
            }
        },
        editMember(item) {
            this.recordVisible = true;
            this.util.mask();
            this.util.restGet('/api_v1/construction/inspect/getCheckRecordById', {id:item.id}, (res)=> {
                this.util.unmask();
                var takePartUsers=res.data.takePartUsers==undefined? []:res.data.takePartUsers;
                res.data.takePartUsers= takePartUsers.map(item=>item.userName).join(",");
                this.editMembershow = res.data;
                this.activities=res.data.descList;
                
            });
            
        },
    	imgdgu(item, index){
    		this.imgshows = !this.imgshows
    		this.imgitem = this.util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=false&access_token='+this.sessionUtil.getAccessToken()

    	},
    	onadd(){
    		var list={}
    		list.issueName = '';		//内控问题类型
			list.flawName	= '';		//缺陷管理提升
			list.areaName	= '';		//区域
			list.troubleSpots	= '';		//问题点
			list.highRisk	= '';		//高风险
			list.inTheRisk = '';			//中风险
			list.lowRisk= '';			//底风险
			list.content= '';			//备注
    		this.addlist.push(list)
    	},
    	handleDelete(index, row) {
            this.addlist.splice(index,1)
        },
        getdatain(){
    		let date = new Date()
    		var Y = date.getFullYear() + '-';
       		var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
       		var D = date.getDate() + ' ';
    		this.getdatas = Y+M+D;

    	},
    	LogRenderingx(){
    		this.addlist=[];
    		this.activeStr='添加日志';
    		this.isCreateEdit='';
    		this.JournalId='';
    		this.NotifierObj={};
    		this.NotifierObj.children=[];
    		this.NotifierObj.fileList=[];
    		this.NotifierObj.deleteFilesList=[]
    		  let params={
              projUid:this.$store.state.selectProjectObj.id,
          }
    		this.util.restGet('/api_v1/business/project/searchReportInspect',params,(res)=>{
                if(res.status==200&&res.data){
                    this.tableData_quality =  res.data.quality;
                    this.tableData_safety =  res.data.safety;
                    this.tableData_measured =  res.data.measured;
                    this.tableData_process =  res.data.process;
                    this.tableData_material =  res.data.material;
                    this.NotifierObj.DATE_=res.data.DATE_;
                    
                }else{
                    this.tableData_quality =  [];
                    this.tableData_safety =  [];
                    this.tableData_measured =  [];
                    this.tableData_process =  [];
                    this.tableData_material =  [];
                    // this.util.error(res.msg)
                }
            })
    	},
      LogRendering(item){
        console.log("查看日志======",item);
        this.JournalFileArr=[];
        this.NotifierObj={};
        this.NotifierObj.children=[];
        this.NotifierObj.fileList=[];
        this.NotifierObj.deleteFilesList=[];
        var tempObj=null;
        this.util.restGet("/api_v1/business/project/searchLogById",{id:item.id},(res)=>{
          this.util.unmask();
          if(res.status==200){
            this.activeStr='添加日志'
            this.isCreateEdit='edit';
            this.JournalId=item.id;

            this.getdatas=res.data.DATE_;
            this.mainweather=res.data.WEATHER_

            tempObj = res.data;
            tempObj.ALTERATION_CONDITION_ =res.data.alterationCondition;
            tempObj.ISSUE_ANNOUNCE_ =res.data.issueAnnounce;


            // this.NotifierObj.DATE_=res.data.DATE_;
            // this.NotifierObj.CONTENT_=res.data.CONTENT_;

      	    // this.NotifierObj.ALTERATION_CONDITION_=res.data.alterationCondition
       		// this.NotifierObj.ISSUE_ANNOUNCE_=res.data.issueAnnounce
            // this.NotifierObj.AM_WEATHER_=res.data.AM_WEATHER_;
            // this.NotifierObj.AM_MAX_T_=res.data.AM_MAX_T_;
            // this.NotifierObj.AM_MIN_T_=res.data.AM_MIN_T_;
            // this.NotifierObj.AM_WDIR_=res.data.AM_WDIR_;
            // this.NotifierObj.AM_WS=res.data.AM_WS;
            // this.NotifierObj.PM_WEATHER_=res.data.PM_WEATHER_;
            // this.NotifierObj.PM_MAX_T_=res.data.PM_MAX_T_;
            // this.NotifierObj.PM_MIN_T_=res.data.PM_MIN_T_;
            // this.NotifierObj.PM_WDIR_=res.data.PM_WDIR_;
            // this.NotifierObj.PM_WS=res.data.PM_WS;
            var members=[];
            // 添加判断是否是操作人打开
            let isCreateUser = (this.sessionUtil.getUserUid() === item.CREATE_USER_ || !item.CREATE_USER_)
            if(res.data.member && isCreateUser){
                res.data.member.forEach(obj=>{
                    members.push({
                        GROUP_UID_:obj.groupId,
                        GROUP_NAME_:obj.groupName,
                        PART_UID_:obj.partId,
                        PART_NAME_:obj.partName,
                    });
                });
              
            }
            tempObj.children=members;
            
            if(res.data.personnel){
              this.memberList = res.data.personnel
              if (isCreateUser){
                tempObj.memberList=res.data.personnel;
              }
            }
            if(res.data.imgs){
                for(var i=0;i< res.data.imgs.length;i++){
                    let obj=res.data.imgs[i];
                    var dates = new Date(obj.createTime).format("yyyy-MM-dd");
                    obj.createTime=dates;
                }
                tempObj.fileList=res.data.imgs;
            }

            this.NotifierObj = tempObj;
            this.sendMessage = isCreateUser ? '抄送人' : '传阅人';
            let params={
              projUid:this.$store.state.selectProjectObj.id,
              id:item.id
            }
    		this.util.restGet('/api_v1/business/project/searchReportInspect',params,(res)=>{
                if(res.status==200){
                    if(res.data){
                    	this.mainweather=res.data.details.weather
						this.addlist=res.data.details.issue? res.data.details.issue:[];
				    	this.tableData_quality =  res.data.quality;
				    	this.tableData_safety =  res.data.safety;
				    	this.tableData_measured =  res.data.measured;
				    	this.tableData_process =  res.data.process;
				    	this.tableData_material =  res.data.material;
				    	this.NotifierObj.DATE_=res.data.DATE_;
                    }
                }else{
                    this.util.error(res.msg)
                }
            })
          }
        });
      },
      Teambtn(item){
        this.isTeam=false;
        this.DetailedObj.GROUP_NAME_=item.name;
        this.DetailedObj.GROUP_UID_=item.id;
      },
      GetList(){
        let params={
          pageSize:100,
          pageNum:1,
          company:this.sessionUtil.getCompanyUid(),
          projUid:this.$store.state.selectProjectObj.id
        };
        this.util.mask();
        this.util.restGet('/api_v1/modules/teams',params,(res)=>{
          this.util.unmask();
          this.TeamList =res.data;
        });
      },
      addList(){
        this.util.restGet('/api_v1/construction/inspect/partTree',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
          if(res.status==200&&res.data!=undefined){
            this.model=res.data;
          }else{
            this.model=[];
          }

        });
      },
      saveJourData(){
        if(this.NotifierObj.memberList==undefined||this.NotifierObj.memberList.length==0){
          this.util.failueToast('请选择' + this.sendMessage);
          return false
        }
        //  if(this.addlist==undefined||this.addlist.length==0){
        //   this.util.failueToast('请添加问题');
        //   return false
        // }
        let mainData={};
        mainData.CONTENT_=this.NotifierObj.CONTENT_
        mainData.AM_WEATHER_=this.NotifierObj.AM_WEATHER_
        mainData.WORK_CONDITION_=this.NotifierObj.WORK_CONDITION_
        mainData.ALTERATION_CONDITION_=this.NotifierObj.ALTERATION_CONDITION_
        mainData.ISSUE_ANNOUNCE_=this.NotifierObj.ISSUE_ANNOUNCE_
        mainData.DATE_=this.getdatas
        mainData.WEATHER_ = this.mainweather
        mainData.AM_MAX_T_=this.NotifierObj.AM_MAX_T_
        mainData.AM_MIN_T_=this.NotifierObj.AM_MIN_T_
        mainData.AM_WDIR_=this.NotifierObj.AM_WDIR_
        mainData.AM_WS=this.NotifierObj.AM_WS
        mainData.PM_MAX_T_=this.NotifierObj.PM_MAX_T_
        mainData.PM_MIN_T_=this.NotifierObj.PM_MIN_T_
        mainData.PM_WDIR_=this.NotifierObj.PM_WDIR_
        mainData.PM_WEATHER_=this.NotifierObj.PM_WEATHER_
        mainData.PM_WS=this.NotifierObj.PM_WS
        mainData.PROJ_UID_=this.$store.state.selectProjectObj.id;
        let linst=[];
        if(this.addlist){
            for (let i = 0; i < this.addlist.length; i++) {
                var list={}
                list.ISSUE_NAME_ = this.addlist[i].issueName;		//内控问题类型
                list.FLAW_NAME_	= this.addlist[i].flawName;		//缺陷管理提升
                list.AREA_NAME_	= this.addlist[i].areaName;		//区域
                list.TROUBLE_SPOTS_	= this.addlist[i].troubleSpots;		//问题点
                list.HIGH_RISK_	= this.addlist[i].highRisk;		//高风险
                list.IN_THE_RISK_= this.addlist[i].inTheRisk;			//中风险
                list.LOW_RISK_= this.addlist[i].lowRisk;			//底风险
                list.CONTENT_= this.addlist[i].content;
                linst.push(list)
            }
        }
        
        var memberSubForm2 ={subFormForeignKey:"PARENT_UID_",subFormTable:"WX_WORK_LOG_ISSUE",data:JSON.stringify(linst)};
        var subFormList =[];
        subFormList.push(memberSubForm2); //明细表
        var memberData =[];
        for (let i=0,len=this.NotifierObj.memberList.length; i<len; i++) {
          var item = {
            USER_NAME_: this.NotifierObj.memberList[i].userName,
            PROJ_UID_:this.$store.state.selectProjectObj.id,
            USER_UID_: this.NotifierObj.memberList[i].id
          }
          memberData.push(item);
        }
        var ids = memberData.map(item=>item.USER_UID_);
        var memberDataStr = JSON.stringify(memberData);
        // 当为传阅人保存时 不修改抄送人列表
        
        if (this.sendMessage === '传阅人' && this.memberList && this.memberList.length > 0) {
            var memberList = []
            for (let i = 0; i < this.memberList.length; i++) {
                 var item = {
                    USER_NAME_: this.memberList[i].userName,
                    PROJ_UID_:this.$store.state.selectProjectObj.id,
                    USER_UID_: this.memberList[i].id
                 }
            }
            memberList.push(item);
            memberDataStr = JSON.stringify(memberList);
        }
        var memberSubForm ={subFormForeignKey:"LOG_UID_",subFormTable:"WX_WORK_LOG_USER",data:memberDataStr};
        subFormList.push(memberSubForm); //抄送人

        var memberData1 =[];
        if(this.NotifierObj.children!=undefined){
          for (let i=0,len=this.NotifierObj.children.length; i<len; i++) {
            var item1 = {
              PM_NNT_:this.NotifierObj.children[i].PM_NNT_,  //下午人数
              NIGHT_NNT_:this.NotifierObj.children[i].NIGHT_NNT_,  //晚上人数
              OVER_TIME_:this.NotifierObj.children[i].OVER_TIME_, //晚上时间
              AM_NNT_:this.NotifierObj.children[i].AM_NNT_,  //上午人数
              SCHEDULE_DESC_:this.NotifierObj.children[i].SCHEDULE_DESC_, //进度情况
              PART_UID_:this.NotifierObj.children[i].PART_UID_, //关联部位id
              GROUP_UID_:this.NotifierObj.children[i].GROUP_UID_,  //关联班组id
              PART_NAME_:this.NotifierObj.children[i].PART_NAME_,  //关联班组id
              SUBJECT_:this.NotifierObj.children[i].SUBJECT_,  //分项工程
              PROJ_UID_:this.$store.state.selectProjectObj.id,
            }
            memberData1.push(item1);
          }
        }

        var memberDataStr1 = JSON.stringify(memberData1);

        var memberSubForm1 ={subFormForeignKey:"LOG_UID_",subFormTable:"WX_WORK_LOG_DET",data:memberDataStr1};
        subFormList.push(memberSubForm1); //明细表
        if(this.JournalId){    //是否是编辑
            // this.NotifierObj.fileList=this.NotifierObj.fileList.filter(item=>{
            //     return item.raw!=undefined
            // })
            this.JournalFileArr=this.JournalFileArr.filter(item=>{
                return item.raw==undefined
            })

            if(this.JournalFileArr.length>0){
              this.JournalFileArr.map((item,index,salf)=>{
                this.NotifierObj.deleteFilesList.push(item.id)
              })
            }

        }

        var filesData = new Array();
        if(this.NotifierObj.fileList){
            for (var i=0;i< this.NotifierObj.fileList.length;i++) {
                var file = this.NotifierObj.fileList[i];
                if(file.raw!=undefined){
                    filesData.push(file);
                }
                
            }
        }

        var params = {ifSaveWorkflow:'false',mainFormData:JSON.stringify(mainData),sqlTableName:"WX_WORK_LOG",
          subFormData:JSON.stringify(subFormList),filesData: JSON.stringify(filesData), deleteFilesData: JSON.stringify(this.NotifierObj.deleteFilesList)};
        if(this.validUtil.isNotEmpty(this.JournalId)){
          params['id']=this.JournalId;
          params['businessKey']=this.JournalId;
        }
        this.util.mask("正在保存..");
        this.util.restPost("/api_v1/form/business",params,(res)=>{
          this.util.unmask();
          if(res.status==200){
            this.activeStr='施工日志'
            this.changeIndex('施工日志')
            this.util.sendMessage(ids.join(","),"["+this.$store.state.selectProjectObj.proName+"]项目日报通知","您有一条项目日报通知请查看",res.data.id,"日报","/Journal/LogAdd");
          }else{
            this.util.unmask();
            this.util.error(res.msg);
          }

        });
      },
      delchildren(data){
        this.NotifierObj.children=this.NotifierObj.children.filter(item=>{
          return item!=data
        })
        this.$forceUpdate();
      },
        saveJournal(){
          let reg=/^[0-9]*$/
          if(reg.test(this.NotifierObj.AM_MIN_T_)&&reg.test(this.NotifierObj.AM_MAX_T_)&&reg.test(this.NotifierObj.PM_MIN_T_)&&reg.test(this.NotifierObj.PM_MAX_T_)){
          }else{
            this.util.failueToast('上午温度，下午温度，请填写数字！');
            return false;
          }
          this.NotifierObj.children.push(this.DetailedObj)
          this.isJournal=false;
        },
        handleSelectionChange(val){
          this.currentRow = val;
        },
        toLocaleMsg(node){
            this.activePrveStr=this.activeStr
            this.activeStr='新闻详情'
            if(node.parents.drawing){
                this.titleNewsStr=node.parents.drawing+' · '+node.parents.createDate+' · '+node.parents.createUserName
            }else{
                this.titleNewsStr=node.parents.createDate+' · '+node.parents.createUserName
            }
            this.newsObj.SUBJECT_=node.parents.partName?node.parents.partName:''
            this.newsObj.CONTENT_=node.parents.content?node.parents.content:''
            this.newsObj.fileList=node.parents.accessory
        },
        changeType(str){
            this.addReportObj.TYPE_=str;
            this.$forceUpdate();
            this.addReportObj.TITLE_=this.addReportObj.CREATE_USER_ ?this.addReportObj.CREATE_USER_:''+'-'+this.addReportObj.TYPE_?this.addReportObj.TYPE_:''+'-'+this.addReportObj.projectName?this.addReportObj.projectName:''+'项目 '+this.addReportObj.CREATE_TIME_?this.addReportObj.CREATE_TIME_:''
        },
        delReport(node){
            this.deleteObj={dialogVisible:true,deleteMsg:'删除汇报',obj:node};
        },
        seeReport(node,num){
             this.util.restGet('/api_v1/business/project/reportDetailsById?id='+node.id,null,(res)=>{
                if(res.status==200){
                    // this.addReportObj.CREATE_TIME_=res.data.CREATE_TIME_
                    // this.addReportObj.CREATE_USER_=res.data.CREATE_USER_
                    // this.addReportObj.projectName=res.data.projectName
                    // this.addReportObj.id=res.data.id
                    // this.addReportObj.TITLE_=res.data.TITLE_
                    // this.addReportObj.TYPE_=res.data.TYPE_
                    // this.addReportObj.flag = res.data.flag
                    // this.addReportObj.status = res.data.status
                    this.addReportObj = res.data
                    this.$set(this.addReportObj,"WORK_PLAN_",res.data.workPlan);
                    this.$set(this.addReportObj,"WORK_RECORD_",res.data.workRecord);
                    this.$set(this.addReportObj,"WORK_SUMMARY_",res.data.workSummary);
                    // this.addReportObj.WORK_PLAN_ = res.data.workPlan;
                    // this.addReportObj.WORK_RECORD_ = res.data.workRecord;
                    // this.addReportObj.WORK_SUMMARY_ = res.data.workSummary;
                    
                    
                    if(res.data.accessory&&res.data.accessory.length>0){
                        for (let i = 0; i < res.data.accessory.length; i++) {
                            res.data.accessory[i].createUserName=res.data.accessory[i].CREATE_USER_
                            res.data.accessory[i].createTime=res.data.accessory[i].CREATE_TIME_
                        }
                        this.addReportObj.fileList=res.data.accessory
                    }else{
                         this.addReportObj.fileList=[]
                    }
                    if(res.data.approver&&res.data.approver.length>0){
                        this.addReportObj.checkMemberList=res.data.approver
                    }else{
                        this.addReportObj.checkMemberList=[]
                    }
                    if(res.data.notifier&&res.data.notifier.length>0){
                        for (let i = 0; i < res.data.notifier.length; i++) {
                            res.data.notifier[i].userName=res.data.notifier[i].USER_NAME_
                            res.data.notifier[i].id=res.data.notifier[i].USER_UID_
                        }
                        this.addReportObj.memberList=res.data.notifier
                        // 储存之前已通知人
                    }else{
                        this.addReportObj.memberList=[]
                    }
                    if(res.data.TYPE_=='月报'){
                        this.addReportObj.MOUTHDATE_=res.data.RECORD_DATE_
                    }else if(res.data.TYPE_=='周报'){
                        this.addReportObj.WEEKDATE_=res.data.RECORD_DATE_? res.data.RECORD_DATE_.split(','):[];
                    }else{
                        this.addReportObj.DAYDATE_=res.data.RECORD_DATE_
                    }
                    this.activePrveStr=this.activeStr
                    this.activeStr=(num==0?'汇报详情':'添加汇报')
                }else{
                    this.util.error(res.errorMsg)
                }
            })


        },
        getProjList(){
              let params={
              search:'',
              projStatus:'',
              pageSize:10,
              pageIndex:1,
          }
          this.util.restGet('/api_v1/business/project/searchProjectList',params,(res)=>{
                if(res.status==200){
                    if(res.data){
                      this.projList=res.data
                      this.addReportObj.projUid=this.$store.state.selectProjectObj.id
                    }else{
                      this.projList=[]
                    }
                }else{
                    this.util.error(res.msg)
                }
            })
        },
        changeStatus(status) {
            this.util.restPut(`/api_v1/business/project/${this.addReportObj.id}/${status}`, null,(res)=>{
                if(res.status == 200) {
                    if(status == 0) {
                        this.util.success('审核不通过')
                    }
                    if(status == 1) {
                        this.util.success('审核通过')
                    }
                    this.activeStr = '工作汇报'
                }
            })
        },
        addNewReport(){
            this.getProjList()
            this.addReportObj.TYPE_=this.activeReportStr;
            this.addReportObj.TITLE_=this.sessionUtil.getUserName()+'-'+this.addReportObj.TYPE_+'-'+this.$store.state.selectProjectObj.proName+'项目'+' '+new Date().format('yyyy-MM-dd')
            this.activePrveStr=this.activeStr
            this.activeStr='添加汇报'
        },
        saveReport(){
            if((this.addReportObj.TYPE_=='月报'&&!this.validUtil.isNotEmpty(this.addReportObj.MOUTHDATE_))
            ||(this.addReportObj.TYPE_=='周报'&&!this.validUtil.isNotEmpty(this.addReportObj.WEEKDATE_))
            ||(this.addReportObj.TYPE_=='日报'&&!this.validUtil.isNotEmpty(this.addReportObj.DAYDATE_))){
                this.util.error('请选择时间');
                return
            }
            if(!this.validUtil.isNotEmpty(this.addReportObj.WORK_PLAN_)){
                this.util.error('请输入工作计划');
                return
            }
            if(!this.validUtil.isNotEmpty(this.addReportObj.WORK_RECORD_)){
                this.util.error('请输入工作记录');
                return
            }
            if(!this.validUtil.isNotEmpty(this.addReportObj.WORK_SUMMARY_)){
                this.util.error('请输入工作总结');
                return
            }
            	
            if(this.addReportObj.TYPE_=='月报' && this.addReportObj.checkMemberList==undefined){
                    this.util.error('请选择审核人')
                    return
            }
            if(this.addReportObj.TYPE_=='周报' && this.addReportObj.memberList==undefined){
                    this.util.error('请选择' + this.sendMessage)
                    return
            }

            let mainData={},subFormList=[],memberData=[],checkMemberData=[],filesList=[],deleteFilesIdList=[];
            mainData.PROJ_UID_=this.$store.state.selectProjectObj.id;
            mainData.TITLE_=this.addReportObj.TITLE_;
            mainData.TYPE_=this.addReportObj.TYPE_;
            mainData.WORK_PLAN_=this.addReportObj.WORK_PLAN_;
            mainData.WORK_RECORD_=this.addReportObj.WORK_RECORD_;
            mainData.WORK_SUMMARY_=this.addReportObj.WORK_SUMMARY_;
            mainData.RECORD_DATE_=this.addReportObj.TYPE_=='月报'?this.addReportObj.MOUTHDATE_:(this.addReportObj.TYPE_=='周报'?this.addReportObj.WEEKDATE_.join(','):this.addReportObj.DAYDATE_);
             if(this.addReportObj.fileList&&this.addReportObj.fileList.length>0){
                 for (let j = 0; j < this.addReportObj.fileList.length; j++) {
                    if(this.addReportObj.fileList[j].isNewFlag){
                        filesList.push(this.addReportObj.fileList[j])
                    }
                }
             }
            for (let u = 0; u < this.deleteFilesList.length; u++) {
                deleteFilesIdList.push(this.deleteFilesList[u].id)
            }
            if(this.addReportObj.checkMemberList&&this.addReportObj.checkMemberList.length>0){

                mainData.APPROVER_ = this.addReportObj.checkMemberList[0].id;

            }
            if(this.addReportObj.memberList&&this.addReportObj.memberList.length>0){
                for (let i = 0; i < this.addReportObj.memberList.length; i++) {
                    let o={}
                    o.USER_NAME_=this.addReportObj.memberList[i].userName
                    o.USER_UID_=this.addReportObj.memberList[i].id
                    memberData.push(o);
                }
                var memberSubForm ={subFormForeignKey:"REPORT_UID_",subFormTable:"WX_WORK_REPORT_USER",data:JSON.stringify(memberData)};
                subFormList.push(memberSubForm);
            }
            var memberDataStr = JSON.stringify(subFormList)
            // 当为传阅人保存时 不修改抄送人列表
            if (this.sendMessage === '传阅人' && this.memberList && this.memberList.length > 0) {
                var memberList = []
                for (let i = 0; i < this.memberList.length; i++) {
                    var item = {
                        USER_NAME_: this.memberList[i].userName,
                        PROJ_UID_:this.$store.state.selectProjectObj.id,
                        USER_UID_: this.memberList[i].id
                    }
                }
                memberList.push(item);
                memberDataStr = JSON.stringify(memberList);
            }
            var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"WX_WORK_REPORT",subFormData:memberDataStr,filesData: JSON.stringify(filesList), deleteFilesData: JSON.stringify(deleteFilesIdList),ifSaveWorkflow:false};

            if(this.validUtil.isNotEmpty(this.addReportObj.id)){
                params['id']=this.addReportObj.id;
                params['businessKey']=this.addReportObj.id;
            }
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                if(res.status==200){
                    var ids = memberData.map(item=>item.USER_UID_);
                    var projName = this.$store.state.selectProjectObj.proName;              
                    this.util.sendMessage(ids.join(","),"["+projName+"]项目"+this.addReportObj.TYPE_+"通知","您有一条项目通知请查看",res.data.id,this.addReportObj.TYPE_,"/report/add");
                    if(mainData.APPROVER_){//给审核人发消息
                        this.util.sendMessage(mainData.APPROVER_,"["+projName+"]项目月报审核通知","您有一条项目月报审核通知，请查看",res.data.id,"月报","/report/add");
                    }
                    this.back()
                    this.util.success('保存成功');
                }else{
                    this.util.error(res.errorMsg)
                }
            });
        },
        deleteProj(){
            if(this.deleteObj.deleteMsg=='删除新闻'){
                this.util.restDelete("/api_v1/business/news/deleteNewsByIds?ids="+this.deleteObj.obj.id,null,(res)=>{
                    if(res.status==200){
                        this.util.success('删除成功');
                        this.deleteObj={dialogVisible:false};
                        this.changeIndex('新闻公告')
                    }else{
                        this.util.error(res.errorMsg)
                    }
                });
            }else if(this.deleteObj.deleteMsg=='删除汇报'){
                 this.util.restDelete("/api_v1/business/project/report/"+this.deleteObj.obj.id,null,(res)=>{
                    if(res.status==200){
                        this.util.success('删除成功');
                        this.deleteObj={dialogVisible:false};
                        this.changeIndex('工作汇报')
                    }else{
                        this.util.error(res.errorMsg)
                    }
                });

            }

        },
        deleteNews(node){
            this.deleteObj={dialogVisible:true,deleteMsg:'删除新闻',obj:node};
        },
        saveNews(){
            if(!this.validUtil.isNotEmpty(this.newsObj.SUBJECT_)){
                this.util.error('请输入标题');
                return
            }
            if(!this.validUtil.isNotEmpty(this.newsObj.CONTENT_)){
                this.util.error('请输入内容');
                return
            }
            if(!this.newsObj.fileList||this.newsObj.fileList.length==0){
                this.util.error('请上传附件');
                return
            }
            let mainData={},subFormList=[],memberData=[],filesList=[],deleteFilesIdList=[];
            mainData.PROJ_UID_=this.$store.state.selectProjectObj.id;
            mainData.SUBJECT_=this.newsObj.SUBJECT_;
            mainData.TOP_=this.newsObj.TOP_;
            mainData.TYPE_=this.newsObj.TYPE_;
            mainData.DATE_=this.newsObj.DATE_;
            mainData.CONTENT_=this.newsObj.CONTENT_;
            for (let j = 0; j < this.newsObj.fileList.length; j++) {
                if(this.newsObj.fileList[j].isNewFlag){
                    filesList.push(this.newsObj.fileList[j])
                }
            }
            for (let u = 0; u < this.deleteFilesList.length; u++) {
                deleteFilesIdList.push(this.deleteFilesList[u].id)
            }
            if(this.newsObj.isOpen==0){
                if(this.newsObj.memberList&&this.newsObj.memberList.length>0){
                    for (let i = 0; i < this.newsObj.memberList.length; i++) {
                    let o={}
                    o.USER_NAME_=this.newsObj.memberList[i].userName
                    o.USER_UID_=this.newsObj.memberList[i].id
                    memberData.push(o);
                    }
                    var memberSubForm ={subFormForeignKey:"NEWS_UID_",subFormTable:"T_NEWS_USER",data:JSON.stringify(memberData)};
                    subFormList.push(memberSubForm);
                    var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"T_NEWS",subFormData:JSON.stringify(subFormList),filesData: JSON.stringify(filesList), deleteFilesData: JSON.stringify(deleteFilesIdList),ifSaveWorkflow:false};
                }else{
                    this.util.error('请选择' + this.sendMessage)
                    return ;
                }
            }else{
                var params = {mainFormData:JSON.stringify(mainData),subFormData:JSON.stringify([{subFormForeignKey:"NEWS_UID_",subFormTable:"T_NEWS_USER",data:null}]),sqlTableName:"T_NEWS",filesData: JSON.stringify(filesList), deleteFilesData: JSON.stringify(deleteFilesIdList),ifSaveWorkflow:false};
            }

            if(this.validUtil.isNotEmpty(this.newsObj.id)){
                params['id']=this.newsObj.id;
                params['businessKey']=this.newsObj.id;
            }
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                if(res.status==200){
                    this.back()
                    this.util.success('保存成功');
                }else{
                    this.util.error(res.errorMsg)
                }
            });
        },
        addMember(userList,type){
            this.$refs.selectMemberFun.reset(userList);
            this.selectMemberModels.selectList=[];
            this.selectMemberModels.isShow=true
            this.selectMemberModels.type = type;
        },
        callBack3(){
            if(this.activeStr=='添加汇报'){
                if(this.selectMemberModels.type == 0) {
                    this.addReportObj.checkMemberList=this.selectMemberModels.selectList;
                }
                if(this.selectMemberModels.type == 1) {
                    this.addReportObj.memberList=this.selectMemberModels.selectList;
                }

            }else if(this.activeStr=='添加新闻'){
                this.newsObj.memberList=this.selectMemberModels.selectList;
            }else if(this.activeStr=='添加日志'){
              this.NotifierObj.memberList=this.selectMemberModels.selectList;
            }
            this.$forceUpdate()
        },
        deleteMember(node,type){
            if(this.activeStr=='添加汇报'){
                if(type == 0) {
                    this.addReportObj.checkMemberList=this.addReportObj.checkMemberList.filter((item)=>{
                        return item.id!=node.id
                    })
                }
                if(type == 1) {
                    this.addReportObj.memberList=this.addReportObj.memberList.filter((item)=>{
                        return item.id!=node.id
                    })
                }

            }else if(this.activeStr=='添加新闻'){
                this.newsObj.memberList=this.newsObj.memberList.filter((item)=>{
                    return item.id!=node.id
                })
            }else if(this.activeStr=='添加日志'){
              this.NotifierObj.memberList=this.NotifierObj.memberList.filter((item)=>{
                return item.id!=node.id
              })
            }
            this.$forceUpdate()
        },
        downLoadFile(node){//下载附件
            window.open(this.util.getBaseUrl()+"/api_v1/files/"+node.id+"/download?access_token="+this.sessionUtil.getAccessToken());

        },
        delFile(node){
            this.deleteFilesList.push(node)
            if(this.activeStr=='添加汇报'){
                 this.addReportObj.fileList=this.addReportObj.fileList.filter((item)=>{
                    return item.id!=node.id
                })
            }else if(this.activeStr=='添加新闻'){
                this.newsObj.fileList=this.newsObj.fileList.filter((item)=>{
                    return item.id!=node.id
                })
            }else if(this.activeStr=='添加日志'){
              if(this.isCreateEdit=='edit'){
                this.JournalFileArr.push(node)
              }
              this.NotifierObj.fileList=this.NotifierObj.fileList.filter((item)=>{
                return item.id!=node.id
              })
            }

            this.$forceUpdate()
        },
        saveFill(){
            this.isUpLoadingShow=false
            for (let i = 0; i < this.uploadConfig.filesList.length; i++) {
                 this.uploadConfig.filesList[i].isNewFlag=true;
            }
            if(this.activeStr=='添加汇报'){
                if(this.addReportObj.fileList){
                    this.addReportObj.fileList = this.addReportObj.fileList.concat(this.uploadConfig.filesList)
                }else{
                    this.addReportObj.fileList=this.uploadConfig.filesList
                }
            }else if(this.activeStr=='添加新闻'){
                if(this.newsObj.fileList){
                    this.newsObj.fileList = this.newsObj.fileList.concat(this.uploadConfig.filesList)
                }else{
                    this.newsObj.fileList=this.uploadConfig.filesList
                }
            }else if(this.activeStr=='添加日志'){
                this.uploadConfig.filesList.forEach(item=>{
                    item.isNewFlag=true;
                });
              if(this.NotifierObj.fileList){
                this.NotifierObj.fileList = this.NotifierObj.fileList.concat(this.uploadConfig.filesList)
              }else{
                this.NotifierObj.fileList=this.uploadConfig.filesList
              }
            }else if(this.activeStr=='楼栋管理'){
                this.saveDrawingData();
            }
        },
        cancelLoading(){
            this.isUpLoadingShow=false
        },
        upLoadIngFill(){
            this.isUpLoadingShow=true
        },
        editNews(node,num){
            this.util.restGet('/api_v1/business/news/searchNewsById?id='+node.id,null,(res)=>{
                if(res.status==200){
                    this.newsObj.id=res.data.id
                    this.newsObj.DATE_=res.data.date;
                    this.newsObj.fabuMan=res.data.createUserName
                    this.newsObj.TOP_=res.data.tops;
                    this.newsObj.SUBJECT_=res.data.subject
                    this.newsObj.CONTENT_=res.data.content
                    this.newsObj.TYPE_=res.data.type
                    this.newsObj.memberList=[]
                    if(res.data.informPerson&&res.data.informPerson.length>0){
                        this.newsObj.isOpen=0;
                        for (let i = 0; i < res.data.informPerson.length; i++) {
                            var o={}
                            o.id = res.data.informPerson[i].userId;
                            o.userName = res.data.informPerson[i].userName;
                            o.picture = res.data.informPerson[i].picture;
                            this.newsObj.memberList.push(o)
                        }
                    }else{
                        this.newsObj.memberList=[];
                        this.newsObj.isOpen=1;
                    }
                    for (let j = 0; j < res.data.picture.length; j++) {
                        res.data.picture[j].createUserName= res.data.picture[j].createUser;
                        res.data.picture[j].createTime= res.data.picture[j].createDate;
                    }
                    this.newsObj.fileList=res.data.picture
                    this.activePrveStr=this.activeStr
                    this.activeStr=(num==0?'添加新闻':(this.sessionUtil.isAllowBtn('gc1_1:view')?'新闻详情':'首页'))
                    this.titleNewsStr=this.sessionUtil.getUserName()+' · '+this.newsObj.DATE_
                }else{
                    this.util.error(res.errorMsg)
                }
            })
        },
        addNews(){
            this.newsObj={
                DATE_:new Date().format('yyyy-MM-dd'),
                isOpen :1,
                TOP_ :1,
                TYPE_ :"news",
                fabuMan:this.sessionUtil.getUserName()
            }
            this.activePrveStr=this.activeStr
            this.activeStr='添加新闻'
        },
        changeReport(type){
        	this.changediary('1');
            	
            this.activeReportStr = type;
            this.type = type;
			
            this.changeIndex('工作汇报')
        },
        changeIsUsRepor(dataType){
            if(dataType == '全部'){
                this.dataType = 3;
            }else if(dataType == '汇报给我'){
                this.dataType =1;
            }else if(dataType == '我的汇报'){
                this.dataType = 2;
            }
            this.activeIsUsReportStr = dataType;
            this.changeIndex('工作汇报')
        },
        changePageSize(value){
            this.pageSize=value;
            this.changeIndex('施工日志');
        },
        changePageNum(value){
            this.pageIndex=value;
            this.changeIndex('施工日志');
        },
        changeWorkPageSize(value){
            this.workPageSize=value;
            this.changeIndex('工作汇报');
        },
        changeWorkPageNum(value){
            this.workPageIndex=value;
            this.changeIndex('工作汇报');
        },
        changeIndex(str){
            this.activeStr=str;
            if(str=='施工日志'){
            	this.activeReportStr = '施工日志';
            	this.activeStr= "工作汇报";
                this.addList();
                this.GetList();
                let params={
                    projUid:this.$store.state.selectProjectObj.id,
                    pageSize:this.pageSize,
                    pageIndex:this.pageIndex,
                    type:this.activediaryStr,
                    search:'',
                }
                this.util.restGet('/api_v1/business/project/searchWorkLogList',params,(res)=>{
                    if(res.status==200){
                        if(res.data&&res.data.length>0){
                            for (let i = 0; i < res.data.length; i++) {
                            let time = new Date(res.data[i].CREATE_TIME_)
                            var hours = time.getHours();
                            var minutes = time.getMinutes();
                            res.data[i].times=hours+':'+minutes
                            if(time.getDay() == 0) res.data[i].week = "星期日"
                            if(time.getDay() == 1) res.data[i].week = "星期一"
                            if(time.getDay() == 2) res.data[i].week = "星期二"
                            if(time.getDay() == 3) res.data[i].week = "星期三"
                            if(time.getDay() == 4) res.data[i].week = "星期四"
                            if(time.getDay() == 5) res.data[i].week = "星期五"
                            if(time.getDay() == 6) res.data[i].week = "星期六"
                            }
                            this.diaryList=res.data
                            this.totalCount = res.totalCount;
                        }else{
                            this.diaryList=[]
                        }
                    }else{
                        this.util.error(res.errorMsg)
                    }
                })
            }else if(str=='新闻公告'){

                let params={
                    projUid:this.$store.state.selectProjectObj.id,
                    pageSize:10,
                    pageIndex:1,
                    type:this.activeNewsStr=='全部'?'':(this.activeNewsStr=='新闻'?'news':(this.activeNewsStr=='通知'?'inform':(this.activeNewsStr=='公告'?'announcement':''))),
                    search:''
                }
                 this.util.restGet('/api_v1/business/news/searchNewsList',params,(res)=>{
                    if(res.status==200){
                        this.newsList=res.data
                    }else{
                        this.util.error(res.errorMsg)
                    }
                })

            }else if(str=='楼栋管理'){
                this.$nextTick(()=>{
                    var num=this.$refs.tops.offsetHeight;
                })
                this.getPartList();
            }else if(str=='首页'){
                var _this = this;
                    this.util.restGet('/api_v1/business/project/searchHomeByProjUid',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
                    	var listst=[];
                    	var constructor='';

                    if(res.status==200){
                    	constructor=res.data.brief.classify
                    	this.classify=res.data.brief.classify
                    	this.$store.commit("projPurpose",res.data.brief.projPurpose)
                        this.projObj=res.data.brief;
                        if(res.data.brief.unit){
                            this.unit = res.data.brief.unit;
                        }else{
                            this.unit=[]
                        }
                        if(res.data.newsList){
                            this.carouselList = res.data.newsList;
                        }else{
                            this.carouselList=[]
                        }
                        if(res.data.photograph&&res.data.photograph[0].accessory){
                            var arr=[]
                            for (let i = 0; i < res.data.photograph.length; i++) {
                                    res.data.photograph[i].accessory[0].content=res.data.photograph[i].content
                                    res.data.photograph[i].accessory[0].parents=res.data.photograph[i]
                                    arr.push(res.data.photograph[i].accessory[0])
                            }
                            this.localeMsgList =arr;
                        }else{
                            this.localeMsgList=[]
                        }
                        if(res.data.dustCheck){
                            this.environmentObj = res.data.dustCheck;
                        }else{
                            this.environmentObj={}
                        }
                        if(res.data.info){
                            this.infoObj = res.data.info;
                        }else{
                            this.infoObj={}
                        }
                        if(res.data.real){
                            this.realObj = res.data.real;
                            if(res.data.real.projWorkerCount==0){
                                this.realObj.percentage=0
                            }else{
                                let a=parseInt((res.data.real.presentCount/res.data.real.projWorkerCount)*100).toFixed(2)
                                this.realObj.percentage = (a-0);
                            }
                        }else{
                            this.realObj={}
                        }
                        if(res.data.qualityObj){
                            this.qualityObj = res.data.qualityObj;
                            if(res.data.qualityObj.totalNum==0){
                                this.qualityObj.percentage=0
                            }else{
                                let a = parseInt((res.data.qualityObj.completeNum/res.data.qualityObj.totalNum)*100).toFixed(2);
                                this.qualityObj.percentage =(a-0);
                            }
                        }else{
                            this.qualityObj={}
                        }
                        if(res.data.safetyObj ){
                            this.safetyObj = res.data.safetyObj ;
                            if(res.data.safetyObj.totalNum==0){
                                this.safetyObj.percentage=0
                            }else{
                                let a = parseInt((res.data.safetyObj.completeNum/res.data.safetyObj.totalNum)*100).toFixed(2);
                                this.safetyObj.percentage = (a-0);
                            }
                        }else{
                            this.safetyObj={}
                        }

							this.util.restGet('/api_v1/dic/20190621/items',null, (rese)=> {
					  				listst =rese.data
					  				listst.forEach((item)=>{
					  					if(item.id == constructor){
					  					 this.classify = item.name
					  					 this.$store.commit("projectName",item.id)

					  					}
					  				})

					  		})




                    }else{
                        this.util.error(res.errorMsg)
                    }
                })
            }else if(str == '工作汇报'){
                let params={
                    projUid:this.$store.state.selectProjectObj.id,
                    pageSize:this.workPageSize,
                    pageIndex:this.workPageIndex,
                    dataType:this.dataType,
                    type:this.type == '' ? '周报' : this.type,
                    search:''
                }
                this.util.mask();
                this.util.restGet('/api_v1/business/project/searchReportList',params,(res)=>{
                    this.util.unmask();
                    if(res.status==200){
                        if(res.data){
                            this.reportList = res.data;
                            this.workTotalCount = res.totalCount;
                        }else{
                            this.reportList = [];
                        }
                    }else{
                        this.util.error(res.errorMsg)
                    }
                })
            }else if(str == '项目会议'){
//          	return
                // var _this =this
         	    // _this.$ruoter.push('/page/form/query/t_gdb_jcbzk')
//          	this.$router.push('/page/library/checkSets')
            }
        },
        changediary(str){
            this.activediaryStr=str;
            
            this.changeIndex('施工日志');
        },
        changeNews(str){
            this.activeNewsStr=str;
            this.changeIndex('新闻公告')
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
        getPartList(){
            this.util.mask();
             this.util.restGet('/api_v1/construction/inspect/partTree',{projUid:this.$store.state.selectProjectObj.id},(res)=>{
                this.util.unmask();
                if(res.status==200&&res.data!=undefined){
                    this.models =[{id:"root",label:"根目录",children:res.data}];
                    // this.models.push(res.data);
                    // this.models = res.data;
                }else{
                    this.models =[{id:"root",label:"根目录",children:[]}];
                }

            });

        },
        getPartFullName(itemObj){
            this.tempList.push(itemObj.label);
            if(itemObj.parents!=undefined){
                this.getPartFullName(itemObj.parents);
            }
        },
        refreshPicture(data) {//刷新图纸
         if(this.activeStr=='添加日志'){
           this.isregion=false;
           this.DetailedObj.PART_UID_=data.id;
           this.DetailedObj.PART_NAME_=data.label;
         }else{
            this.yeTai='';
           this.tempList=[];
           this.getPartFullName(data);
           data.partFullName=this.tempList.reverse().join("-");
           this.tempPartObj=data;
           this.yeTai=data.yeTai;
           this.tempPartSort= this.tempPartObj.childCount;
           this.imageUrl = data.fileId==undefined? "":this.util.getBaseUrl() + '/api_v1/files/'+data.fileId+'/look?ifThumb=false&access_token='+this.sessionUtil.getAccessToken();
           lmap.remove();
           this.loaded(data.mapData);
         }
        },
        editPart(){//编辑部位
        	//this.$bus.$on('handelDeparts',this.refreshPicture)
             if(this.tempPartObj.id==undefined){
                this.util.error("请先选择部位");
                return;
            }
            this.partName=this.tempPartObj.label;
            this.yeTai=this.tempPartObj.yeTai;
            this.code = this.tempPartObj.code;
            this.partSort=this.tempPartObj.sort;
            this.addPartType=0;
            this.isEditFlag=true;
            this.isAddPart=true;

        },
        addPart(type){//添加部位
            if(type=="root"){
                this.tempPartObj={};
            }
            this.partName="";
            this.code = '';
            this.partSort= this.tempPartSort==undefined||type=="root"? this.models.length:this.tempPartSort++;
            this.isAddPart=true;
            this.isEditFlag=false;
            this.yeTai='';
            this.addPartType=0;
        },
        addRootPart(){//添加根目录

        },
        loadDrawing(){
            if(this.tempPartObj.id==undefined||this.tempPartObj.id=="root"){
                this.util.error("请先选择部位");
                return;
            }
            //   if(this.yeTai==undefined || this.yeTai==''){
            //     this.util.error("请选择业态");
            //     return;
            // }
            this.isUpLoadingShow=true
        },
        savePartData(type){//保存部位
            if(!this.validUtil.isNotEmpty(this.partName)){
                this.util.error("请输入部位名称!");
                return;
            }
            if(!this.validUtil.isNotEmpty(this.code)){
                this.util.error("请输入编码!");
                return;
            }
            if(!this.validUtil.isNotEmpty(this.yeTai)){
                this.util.error("请选择业态!");
                return;
            }
            if(type==1){

                if(!this.validUtil.isNotEmpty(this.partName)){
                    this.util.error("请选择部位!");
                    return;
                }
                this.childPartObj = this.partChildren.find(item=>item.id===this.partName);
                this.currentEntity.entity.partUid=this.childPartObj.id;
                this.currentEntity.entity.title=this.childPartObj.label;
                this.currentEntity.entity.uuid=this.childPartObj.id+"_measure";
                this.rectangleData.push(this.currentEntity.entity);
                lmap.updateText(this.currentEntity);
                this.isAddPart=false;
                return;
            }

//          if(type==undefined&&!this.validUtil.isNotEmpty(this.partName)){
//              this.util.error("请填写名称!");
//              return;
//          }
            var mainData={
                NAME_:this.partName,
                YE_TAI_:this.yeTai,
                SORT_:this.partSort,
                CODE_: this.code
            }
            if(!this.isEditFlag){//新增
                mainData.PROJ_UID_ = this.$store.state.selectProjectObj.id;
                mainData.PARENT_UID_ = this.tempPartObj.id==undefined? "root":this.tempPartObj.id;
                // var snNum = this.tempPartSort==undefined? this.models[this.models.length-1].sn:"01";
                var snString = this.models[0].children.length==0? "01":this.models[0].children[this.models[0].children.length-1].sn;
                
                if(this.models[0].children.length==0){
                    snString="01";
                }else if(this.tempPartObj.id&&this.tempPartObj.id!="root"){
                    var snNum =this.tempPartObj.children? parseInt(this.tempPartObj.children[this.tempPartObj.children.length-1].sn.slice(this.tempPartObj.sn.length))+1:1;
                    snString = snNum>9? this.tempPartObj.sn+snNum:this.tempPartObj.sn+"0"+snNum;
                }else{
                    var snStr = this.models[0].children[this.models.length-1].sn;
                    var snNum = parseInt(snStr)+1;
                    snString = snNum>9? snNum:"0"+snNum;
                }
                mainData.SN_ = snString;
            }
            var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"T_WORK_PART",ifSaveWorkflow:false};
            if(this.isEditFlag){//编辑
                params['id']=this.tempPartObj.id;
                params['businessKey']=this.tempPartObj.id;
            }
            this.util.mask("正在保存..");
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                if(res.status==200){
                this.util.successToast('保存成功');
                this.isAddPart=false;
                if(this.tempPartObj.id!=undefined){
                    this.tempPartObj.label=this.partName;
                    this.tempPartObj.yeTai =this.yeTai;
                    this.tempPartObj.code =this.code;
                }

                this.getPartList();

                }
                this.util.unmask();
            });
        },
        saveDrawingData(type){//保存图纸
            var mainData={
                NAME_:this.tempPartObj.label+"图纸",
                PROJ_UID_:this.$store.state.selectProjectObj.id,
                AREA_UID_:this.tempPartObj.id,
                PART_NAME_:this.tempPartObj.partFullName,
                SORT_:this.tempPartObj.childCount +1
            }
            if(type==1){
                var mapData =lmap.getData();
                mainData={MAP_DATA_:JSON.stringify(mapData)};
            }
            var params = {mainFormData:JSON.stringify(mainData),sqlTableName:"T_DRAWING",ifSaveWorkflow:false};
            if(type==undefined){
                params['filesData']=JSON.stringify(this.uploadConfig.filesList);
            }
            if(this.tempPartObj.drawingId!=undefined){
                params['id']=this.tempPartObj.drawingId;
                params['businessKey']=this.tempPartObj.drawingId;
            }
            if(type==undefined&&this.tempPartObj.fileId!=undefined){
                params['deleteFilesData']=JSON.stringify([this.tempPartObj.fileId]);
            }
            this.util.mask("正在保存..");
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.util.successToast('保存成功');
                    this.isAddPart=false;
                    if(type==undefined){
                        this.tempPartObj.fileId=this.uploadConfig.filesList[0].id;
                        this.tempPartObj.drawingId=res.data.id;
                        this.refreshPicture(this.tempPartObj);
                    }

                    this.getPartList();

                }

            });
        },
        deletePart(){//删除部位
            if(this.tempPartObj.id==undefined){
                this.util.error("请选择要删除的部位!");
                return;
            }
            this.util.confirm("确定要删除该部位吗?",null,()=>{
                this.util.mask("正在删除..");
                this.util.restDelete("/api_v1/business/project/delete/"+this.tempPartObj.id,null,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.tempPartObj={};
                    this.tempPartSort=undefined;
                    this.util.successToast('删除成功!');
                    this.getPartList();
                }else{
                    this.util.failueToast('删除失败!');
                }
                });
            });
        },
        deleteDrawing(){
            if(this.tempPartObj.drawingId==undefined){
                this.util.error("改部位尚未上传图纸!");
                return;
            }
            this.util.confirm("确定要删除该图纸吗?",null,()=>{
                this.util.mask("正在删除..");
                this.util.restDelete("/api_v1/business/project/"+this.tempPartObj.drawingId,null,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.util.successToast('删除成功!');
                    this.tempPartObj.fileId="";
                    this.tempPartObj.mapData="[]";
                    this.refreshPicture(this.tempPartObj);
                }else{
                    this.util.failueToast('删除失败!');
                }


                });
            });
        },
        loaded(mapData) {
        var data = mapData==undefined? []:JSON.parse(mapData);
        this.rectangleData = data;
        if (this.leafletLoaded) {
            // var data =  JSON.parse(data);
            var config = {
            tools: {
                polygon:false,//是否允许绘制多边形，不配置默认是允许
                rectangle:false,//是否允许绘制多边形，不配置默认是允许
                marker:false,//是否允许绘制多边形，不配置默认是允许
                save: false,//是否允许保存,不配置默认是允许
                edit: false//是否允许编辑，不配置默认是允许
            },
            listeners: {
                'layer:click' : this.onLmapLayerClick,
                'layer:created' : this.onLmapLayerCreated,
                'save' : this.onLmapSave
            },
            data: data,
            center: [512, 384],
            bounds: [1024, 768], //坐标范围
            imageUrl: this.imageUrl
            };
            if(this.sessionUtil.isAllowBtn('gc1_4:drawing_edit')){
                config.tools.edit=true
                config.tools.rectangle=true
            }
            lmap.$ = $;
            // lmap.getData();
            lmap.init(this,config);
        }
        },
        onLmapLayerClick(layer){
        },
        onLmapLayerCreated(layer){
            // this.currentEntity=layer.entity;
            this.currentEntity=layer;
            this.isAddPart=true;
            this.partName="";
            this.addPartType=1;
            this.partChildren=this.tempPartObj.children.filter(item=>{
                return this.rectangleData.findIndex(obj=>obj.partUid===item.id)<0;
            });
        },onLmapSave(data){
            console.info("======onLmapSave=====");
            this.cookieUtil.set('data',JSON.stringify(data));

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
        color: #44D2FF;
        font-size: 14px;
        padding-top: 36px;
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
        width: 78px;
        float: left;
        height: 26px;
        line-height: 26px;
        margin-top: 4px;
        cursor: pointer;
        color: #fff;
        margin-bottom: 10px;
    }
    .tabs>.active,.news-tabs>.active{
        background: url(../../assets/indexImg/select.png) no-repeat  top center;
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
        height: 75%;
        float: left;
    }
    .proj-left{
        padding-right: 10px;
    }
    .proj-right{
        padding-left: 10px;
    }
    .proj-synopsis{
        position: relative;
        padding-top: 198px
    }
    .proj-synopsis,.environment{
        color: #fff;
    }
    .proj-synopsis li{
        text-align: left;
        margin-top: 5px;
    }
    .proj-synopsis-left-box{
        overflow: hidden;
        height: 154px;
    }
    .proj-synopsis-right-box{
        width: 80px;
        float: right;
        box-sizing: border-box;
        padding: 33px 0 0 10px;
    }
    .environment h4 span{
        float: right;
        font-size: 14px;
        font-weight: normal;
        margin-top: 6px;
    }
    .environment li{
        width: 33.3333333333333333%;
        float: left;
        overflow: hidden;
        height: 45px;
    }
    .environment li p{
        text-align: center;
        font-size: 14px;
        color: #44D2FF;
        height: 45px;
        line-height: 22px;
    }
    .environment li p span{
        color: #fff;
        font-size: 18px;
        display: block;
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
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
    .progress{
        text-align: left;
    }
    .progress p{
        margin: 5px 0;
    }
    .progress p span{
        font-size: 18px;
        color: #FFFFFF;
        float: right;
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
    .page-news-index,.page-diary-index{
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
        padding: 10px 0;
    }
    .page-news-index{
        padding-top: 99px;
    }
    .page-news-index .news-tabs{
        width: 100%;
        position: absolute;
        top: 10px;
        height: 80px;
    }
    .news-content{
        width: 100%;
        height: 100%;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .news-content>div>div{
        width: 25%;
        float: left;
        padding-right: 10px;
        box-sizing: border-box;
    }
    .news-content>div>div:nth-child(4n){
        padding-right: 0;
    }
    .news-tab-item .title,.reading-content{
        white-space: nowrap;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 5px;
        text-align: center;
    }
    .reading-content{
        display: block;
        text-align: left;
        font-size: 12px;
    color: #FFFFFF;
    }
    .news-tab-item .belongs{
       font-size: 12px;
        color: #C4C4C4;
        text-align: left;
        margin-bottom: 5px;
    }
    .news-tab-item>img,
    .news-tab-item>i
    {
        width: 100%;
        height: 160px;
    }
    .news-tab-item>i{
        display: inline-block;
        margin-bottom: 5px;
        background: url(../../assets/indexImg/nonePic.png) no-repeat center ;
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
        background: url('../../assets/indexImg/yuedu.png') no-repeat center;
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
        padding-left: 260px;
        box-sizing: border-box;
    }
    .report-header .report-tabs{
        height: 42px;
        margin-bottom: 10px;
        width: 260px;
        float: left;
        position: absolute;
        top: 0;
        left: 0;
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
        text-align: left;
    }
    .report-body-item>.item-operate{
        text-align: right;
        float: right;
    }
    .item-operate>div{
        margin: 2px 0;
        font-size: 14px;
        padding-right: 10px;
    }
    .item-operate>p{
        margin: 2px 0;
    }
    .item-operate>p span{
        float: right;
        padding: 0 10px 0 18px;
        position: relative;
    }
    .item-operate>p span::before{
        position: absolute;
        content: '';
        width: 16px;
        height: 16px;
        top: 2px;
        left: 0px;
    }
    .item-operate>p .operate-comment::before{
        /* background: #000; */
        background: url('../../assets/indexImg/comment.png') no-repeat center;
    }
    .item-operate>p .operate-read::before{
        /* background: #000; */
        background: url('../../assets/indexImg/read.png') no-repeat center;
    }
    .item-operate>p .operate-file::before{
        /* background: #000; */
        background: url('../../assets/indexImg/file.png') no-repeat center;
    }
    .page-building-index{
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        padding-top: 10px;
    }

    .building-fl{
        width: 300px;
        float: left;
        height: 100%;
    }
    .building-fr{
        overflow:hidden;
        height:100%;
        padding-left: 10px;
        box-sizing: border-box;
    }
    .page-building-index>div>div{
        height: 100%;
    }
    .building-box{
        width: 100%;
        height: 100%;
        padding-top: 55px;
        box-sizing: border-box;
        position: relative;
    }
    .building-box .building-title{
        width: 100%;
        position: absolute;
        width:100%;
        top:10px;
        left:0px;
        box-sizing: border-box;
        padding: 0 10px;
    }
    .building-drawing{
        width: 100%;
        height: 100%;
        background: #fff;
    }
    .add-part-box{
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 80;
    }
    .add-part-box .add-part{
        width: 406px;
        position: absolute;
        top: 50%;
        left: 50%;
        background: #fff;
        height: 156px;
        transform: translate(-50%,-50%);
        padding: 10px 20px;
    }
    .add-part p{
        font-size: 18px;
        color: #333;
        text-align: left
    }
    .select-msg-box{
        color: #333;
        line-height: 38px;
        height: 38px;
        margin: 20px 0;
    }
    .select-msg-ele{
        width: 296px;
        line-height: 38px;
        height: 38px;
        color: #333;
        width: 296px;
        border: 1px solid #ccc;
        border-radius: 1px ;
        box-sizing: border-box;
    }
    .add-part-box button{
        font-size: 14px;
        background: #5C9AD4;min-width: 60px;
        padding: 5px;
        height: 28px;

    }
    .add-page{
        position: relative;
        padding:20px;
        padding-top:66px;
        text-align: left;
        /* color: #fff; */
        background: #fff;
        color: #333;
    }
    .add-page button{
        background: #F08B00;
        color: #fff;
        border:1px solid #F08B00;
    }
    .add-page-button{
        position: absolute;
        top: 20px;
        left: 20px;
        /* display: flex; */
        justify-content: space-between;
        align-items: center;
        width: 1050px;
    }
    .add-page-button>div:nth-of-type(2) button{
        background-color: red;
        border-color: red;
    }
    .add-page-form{
        width:100%;height:100%;overflow:auto
    }
    .add-page-form-title{
        font-size: 18px;
        color: #333;
        text-align: left;
        padding-bottom: 10px;
    }
    .member-box li{
        float: left;
        position: relative;
    }
    .member-box li img{
        width: 42px;
        height: 42px;
    }

    .member-item i{
        position: absolute;
        right: 10px;
        top: -5px;
        background: url(../../assets/indexImg/delete.png) no-repeat center;
        width: 12px;
        height: 12px;
        background-size: cover;
    }
    .clear::after{
        content:"";
        height:0;
        line-height: 0;
        display: block;
        visibility: hidden;
        clear: both;
  }
  .title_text{
    font-size: 18px;
    color:#000;
    margin-bottom: 20px;
  }
    .li_span{
  	padding: 5px 18px;
  	background: #F08B00;
  	border-radius: 3px;
  	color: #fff;
  	margin: 0 10px 0 0 ;

  }
</style>

<style>
	
	
.bg .add-page .el-table, .bg .add-page .el-table thead{
    color: #606266;
    border-color:#ccc;
}
.bg .add-page .el-table--border, .bg .add-page .el-table--group, .bg .add-page .el-table td, .bg .add-page .el-table th.is-leaf{
    border-color:#ccc;
}
.bg .add-page .el-table--border:after, .bg .add-page .el-table--group:after, .bg .add-page .el-table:before{
    background:#ccc;
}
.select-msg-ele.el-select .el-input .el-select__caret.el-input__icon{
    color: #44D2FF;
}

.progress .el-progress-bar .el-progress-bar__inner{
    border-radius: 0 ;
    background-image: linear-gradient(left, #06FCFF 0%, #20A5FF 100%);
}

.el-textarea__inner{
    /*border: 0 none;*/
    min-height:100%!important;
}
.lj_box .el-table .cell, .el-table th div{
	/*text-overflow:clip;*/
}
.lj_box  .el-table .cell{
	/*overflow: auto;*/
}


</style>
<style >
@import "../../../static/js/leaflet/lib/leaflet.css";
@import "../../../static/js/leaflet/lib/leaflet.draw.css";
.tabs a{
	color: #FFF ;
	text-decoration : none;

}
</style>
