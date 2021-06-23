<template>
    <div class="news-box lj_box" style="padding-top:0px;position: relative;">
        
        <div class="page-report-index">
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
                    <div class="report-header-button" style="float: right;">
                        <div class="elect-boxs" style="float:left;" >
                            <span>按日期</span>
                            <el-date-picker @change="changeIndex('工作汇报')"
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
                            <input style="margin-top: 4px;" type="text" v-model="searchValue" @keyup.enter="changeIndex('工作汇报')">
                            <i style="top:3px;"></i>
                            <button @click="changeIndex('工作汇报')">搜索</button>
                        </div>
                        <button @click="addNewReport" v-if="sessionUtil.isAllowAdd('t_weeklyReport')">新增汇报</button>
                    </div>
                </div>
                <div style="overflow:auto;height:100%;width:100%">
                    <div style="overflow: hidden;" class="box-style" v-for="(item, index) in reportList" @click.stop.prevent="seeReport(item,0)" :key="index" >
                        <div class="report-body-item" >
                            <div class="report-item-img"><img :src="item.userLogo? item.userLogo:defaultLogo" alt=""></div>
                            <div class="report-item-title">
                                <div>
                                    <span>{{item.title}}&nbsp;&nbsp;&nbsp;</span>
                                    <span v-if="item.type == '周报'">({{item.recordDate.replace(',','到')}})</span>
                                    <span v-else>审核状态：{{item.status == 0 ? '不通过' : item.status == 1 ? '通过' : '未审核'}}</span>
                                    <div style="float:right;">
                                        <span style="color:#fff;padding-right:10px;"> {{item.createTime}}</span>
                                        <span style="color:#fff;padding-right:10px;" v-if="item.type=='日报'"> {{item.week}}</span>
                                        <img v-if="sessionUtil.isAllowDelete('t_weeklyReport')" style="width:20px;" @click.stop.prevent="delReport(item)" src="../../assets/indexImg/del.png" alt="">
                                        <img v-if="item.status != 1"  @click.stop="seeReport(item,1)" src="../../assets/indexImg/chayuan.png" alt="">
                                    </div>
                                </div>
                                
                                <div class="text-style" style="color:#fff">
                                    <span><strong>工作计划：</strong>{{item.workPlan}}</span>
                                </div>
                                <div class="text-style" style="color:#fff">
                                    <span><strong>工作记录：</strong>{{item.workRecord}}</span>
                                </div>
                                <div class="text-style" style="color:#fff">
                                    <span><strong>工作总结：</strong>{{item.workSummary}}</span>
                                </div>
                                <div class="item-operate">
                                    <p style="color:#fff;">
                                        <span class="operate-comment" style="padding-right:0">评论({{item.commentCount}})</span>
                                        <span class="operate-read">已读({{item.lookCount}})</span>
                                        <span class="operate-file" >附件({{item.accessory&&item.accessory.length>0?item.accessory.length:0}})</span>
                                    </p>
                                </div>
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
            
            <div v-show="activeReportStr == '施工日志'" class="page-index" style="padding: 0;">

                <div class="report-body" >
                    <div class="tabs" style="position:absolute;top:7px;left:1px;border:0 none;">
                        <span :class="{active:activediaryStr=='1'}" @click="changediary('1')">全部</span>
                        <!-- <span :class="{active:activediaryStr=='2'}" @click="changediary('2')">未读</span> -->
                        <span :class="{active:activediaryStr=='3'}" @click="changediary('3')">我发起的</span>
                        <span :class="{active:activediaryStr=='4'}" @click="changediary('4')">与我相关的</span>
                        <div class="diary-button" style="float: right;">
                            <div class="elect-boxs" style="float:left;" >
                                <span>按日期</span>
                                <el-date-picker
                                        v-model="searchDate"
                                        @change="changeIndex('施工日志')"
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
                                <input style="margin-top: 4px;" type="text" v-model="searchValue" @keyup.enter="changeIndex('施工日志')">
                                <i style="top:3px;"></i>
                                <button @click="changeIndex('施工日志')">搜索</button>
                            </div>
                            <button v-if="sessionUtil.isAllowAdd('t_datelyReport')" @click="LogRenderingx()">新增日志</button>
                        </div>
                    </div>
                    <div style="overflow: hidden;" class="box-style" v-for="(item, index) in diaryList" :key="index" @click.stop="LogRendering(item)">
                        <div class="report-body-item" style="overflow:hidden;" >
                            <div class="report-item-img"><img :src="item.createUserLogo? item.createUserLogo:defaultLogo" alt=""></div>
                            <div class="report-item-title">
                                <div style="margin-bottom:5px;">
                                    <div style="float:right;">{{item.date_}}&nbsp;&nbsp;{{item.times}}&nbsp;&nbsp;{{item.week}}</div>
                                    <span>{{item.createUserName}}</span>
                                    <span v-if="sessionUtil.isAllowEdit('t_datelyReport')" style="margin-left: 10px;"><button @click.stop="LogRendering(item)">编辑</button></span>
                                    <span v-if="sessionUtil.isAllowDelete('t_datelyReport')" style="margin-left: 10px;"><button @click.stop="deleteDiary(item)">删除</button></span>
                                </div>
                                <div>
                                    <span style="color:#fff"><strong>上午：</strong>天气{{item.am_weather_}}，温度{{item.am_min_t_}}~{{item.am_max_t_}}，风向{{item.am_wdir_}}，风力{{item.am_ws}}级</span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span style="color:#fff"><strong>下午：</strong>天气{{item.pm_weather_}}，温度{{item.pm_min_t_}}~{{item.pm_max_t_}}，风向{{item.pm_wdir_}}，风力{{item.pm_ws}}级</span>
                                </div>
                                <div class="text-style">
                                    <span style="color:#fff"><strong>本日工作情况：</strong>{{item.content_}}</span>
                                </div>
                                <div class="text-style">
                                    <span style="color:#fff"><strong>变更情况：</strong>{{item.alterationCondition}}</span>
                                </div>
                                <div class="text-style">
                                    <span style="color:#fff"><strong>项目问题披露：</strong>{{item.issueAnnounce}}</span>
                                </div>
                                <div class="item-operate" style="float:right;">
                                    <p>
                                        <span class="operate-comment">评论({{item.commentCount}})</span>
                                        <span class="operate-read">已读({{item.lookCount}})</span>
                                        <span class="operate-file">附件({{item.accessory&&item.accessory.length>0?item.accessory.length:0}})</span>
                                    </p>
                                </div>
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
        
        <div v-if="activeStr=='汇报详情'" class="page-diary-index" >
            <div class="box-style" style="height:100%;">
                <div class="add-page" style="padding:66px 0 0 0">
                    <div class="add-page-button">
                        <button @click="activeStr=''">返回上一级</button>
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
        <div v-if="activeStr=='添加日志'" class="page-diary-index" >
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
                                <el-input disabled v-model="NotifierObj.DATE_" style="height:100%;" ></el-input>
                              </div>
                            </div>
                             
                          </div>
                          <div style="width:1070px;margin-bottom: 20px;">
                            <span style="float:left;width:100px;line-height: 38px;">当日工作情况</span>
                            <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                              <el-input type="textarea" :rows="3" :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.CONTENT_" maxlength="800" show-word-limit style="height:100%;" placeholder="请输入内容"></el-input>
                            </div>
                          </div>
                          <div style="width:1070px;margin-bottom: 20px;">
                            <span style="float:left;width:100px;line-height: 38px;">变更情况</span>
                            <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                              <el-input type="textarea" :rows="3" :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.ALTERATION_CONDITION_" maxlength="800" show-word-limit style="height:100%;" placeholder="请输入内容"></el-input>
                            </div>
                          </div>
                          <div style="width:1070px;">
                            <span style="float:left;width:100px;line-height: 38px;">项目问题披露</span>
                            <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                              <el-input type="textarea" :rows="3" :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.ISSUE_ANNOUNCE_" maxlength="800" show-word-limit style="height:100%;" placeholder="请输入内容"></el-input>
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
                                <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.AM_WEATHER_" style="height:100%;" placeholder="请输入内容"></el-input>

                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">温度</span>
                              <div style="overflow: hidden;height:100%;display: flex">
                                <div style="border:1px solid #ccc;width:200px;">
                                  <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.AM_MIN_T_" style="height:100%;" placeholder="请输入内容"></el-input>
                                </div>
                                <div style="margin:0 10px;line-height: 38px">~</div>
                                <div style="border:1px solid #ccc;width:200px;">
                                  <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.AM_MAX_T_" style="height:100%;" placeholder="请输入内容"></el-input>
                                </div>
                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">风向</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.AM_WDIR_" style="height:100%;" placeholder="请输入内容"></el-input>
                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">风力</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.AM_WS" style="height:100%;" placeholder="请输入内容"></el-input>
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
                                <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.PM_WEATHER_" style="height:100%;" placeholder="请输入内容"></el-input>
                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">温度</span>
                              <div style="overflow: hidden;height:100%;display: flex">
                                <div style="border:1px solid #ccc;width:200px;">
                                  <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.PM_MIN_T_" style="height:100%;" placeholder="请输入内容"></el-input>
                                </div>
                                <div style="margin:0 10px;line-height: 38px">~</div>
                                <div style="border:1px solid #ccc;width:200px;">
                                  <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.PM_MAX_T_" style="height:100%;" placeholder="请输入内容"></el-input>
                                </div>
                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">风向</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.PM_WDIR_" style="height:100%;" placeholder="请输入内容"></el-input>
                              </div>
                            </div>
                            <div style="height:38px;width:500px;margin-right: 10px;margin-bottom: 20px;">
                              <span style="float:left;width:60px;line-height: 38px;margin-right: 10px;">风力</span>
                              <div style="overflow: hidden;height:100%;border:1px solid #ccc;">
                                <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="NotifierObj.PM_WS" style="height:100%;" placeholder="请输入内容"></el-input>
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
                        			<div v-show="isCreateUser||!isCreateEdit">
                        				<ul style="display: flex;margin-bottom: 10px;">
                        					<li><span class="li_span" @click.stop="onadd()">增加</span></li>
                        				</ul>
                        			</div>
                        			<div style="width: 1090px">
                        				  <el-table ref="multipleTable" :data="addlist" border
										    tooltip-effect="dark" style="width: 100%"  @selection-change="handleSelectionChange">
										    <el-table-column type="index" width="80">
										        <template slot-scope="scope">
                                                    <el-button  size="mini"  type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                                                </template>
										    </el-table-column>
										    <el-table-column  prop="address"  label="内控问题类型" width="160">
										        <template slot-scope="scope">
										      		<el-input :readonly="!isCreateUser&&isCreateEdit" type="textarea" :rows="1" v-model="scope.row.issueName " placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										     <el-table-column prop="name"  label="缺陷&管理提升" width="140">
										        <template slot-scope="scope">
										      		 <el-select v-model="scope.row.flawName" :disabled="!isCreateUser&&isCreateEdit" placeholder="请选择">
													    <el-option
													      v-for="item in optionsflawName"
													      :key="item.value"
													      :label="item.label"
													      :value="item.label">
													    </el-option>
													  </el-select>
										      </template>
										    </el-table-column>
										    <el-table-column prop="address"  label="区域" width="140">
										        <template slot-scope="scope">
										      		<el-input :readonly="!isCreateUser&&isCreateEdit" type="textarea" :rows="1" v-model="scope.row.areaName" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										    <el-table-column prop="address" label="问题点分布" width="170">
										        <template slot-scope="scope">
										      		<el-input :readonly="!isCreateUser&&isCreateEdit" type="number" v-model="scope.row.troubleSpots" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										     <el-table-column  prop="name" label="高风险" width="90">
										        <template slot-scope="scope">
										      		<el-input :readonly="!isCreateUser&&isCreateEdit" type="number" v-model="scope.row.highRisk" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										    <el-table-column  prop="address"  label="中风险" width="90">
										        <template slot-scope="scope">
										      		<el-input :readonly="!isCreateUser&&isCreateEdit" type="number" v-model="scope.row.inTheRisk" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										     <el-table-column  prop="name" label="低风险" width="90">
										        <template slot-scope="scope">
										      		<el-input :readonly="!isCreateUser&&isCreateEdit" type="number" v-model="scope.row.lowRisk" placeholder="请输入内容"></el-input>
										      </template>
										    </el-table-column>
										    <el-table-column  prop="address" label="备注" width="130">
										        <template slot-scope="scope">
										      		<el-input :readonly="!isCreateUser&&isCreateEdit" v-model="scope.row.content" placeholder="请输入内容"></el-input>
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
									    <el-table-column  prop="inspectItemName"  label="检查项" width="120">
									    </el-table-column>
									     <el-table-column  prop="checkRequire" label="规范要求" width="220">
									    </el-table-column>
									     <el-table-column label="类别" width="60">
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
									     <el-table-column prop="checkRequire"  label="规范要求"  width="220">
									    </el-table-column>
									     <el-table-column label="类别" width="60">
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
                        			  <el-table @row-click="editMember"  :data="tableData_process" border style="width: 100%">
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
                                  <!-- <el-table-column
                                    label="类别"
                                    width="60">
                                        <template slot-scope="scope">
                                        {{scope.row.LB_ == 'day' ? '日常' : (scope.row.LB_ == 'week' ? '周检':(scope.row.LB_ == 'month' ? '月检' :(scope.row.LB_ == 'quarter' ? '季检 ' : '')) ) }}
                                      </template>
                                  </el-table-column> -->
                                  <el-table-column  prop="statusName" label="状态 " width="80"></el-table-column>
                                  <el-table-column  prop="rectifyPrincipal" label="检查人"  width="70"></el-table-column>
                                  <el-table-column  prop="rectifyDeadline" label="检查时间"  width="100"></el-table-column>
                                  <el-table-column prop="describes" label="描述" width="120"></el-table-column>
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
                        			  <el-table  :data="tableData_material" border style="width: 100%">
                                  <el-table-column  prop="code" label="单据编号" width="140"></el-table-column>
                                  <el-table-column prop="projName" label="项目名称" width="180"></el-table-column>
                                  <el-table-column  prop="name" label="名称" width="120"></el-table-column>
                                  <el-table-column prop="specs" label="型号规格" ></el-table-column>
                                  <el-table-column  label="到货数量"  prop="quantity" width="80"></el-table-column>
                                  <el-table-column label="合格数"  prop="passNum" width="80"></el-table-column>
                                  <el-table-column label="不合格数"  prop="notPassNum" width="80"></el-table-column>
                                  <el-table-column prop="checkName" label="检查人" width="70"></el-table-column>
                                  <el-table-column prop="updateTime" label="检查时间"  width="140"></el-table-column>
                                  <el-table-column  prop="content" label="描述" width="120"></el-table-column>
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
                            <el-table-column label="操作" width="110">
                              <template slot-scope="scope">
                                <div class="handel-icon">
                                  <img v-show="isCreateUser||scope.row.isNewFlag" src="../../assets/administrationIcon/remove.png" @click="delFile(scope.row)" alt="">
                                  <img v-show="!scope.row.isNewFlag" src="../../assets/administrationIcon/daoru.png" @click="downLoadFile(scope.row)" alt="">
                                  <img v-show="!scope.row.isNewFlag" src="../../assets/asideIcon/preview.png" @click="util.onPreview(scope.row)" alt="">
                                </div>
                              </template>
                            </el-table-column>
                          </el-table>
                        </div>
                        <div style="margin-left: 80px;">
                            <ul style="display: flex;flex-wrap：wrap;width: 970;">
                                <li @click="imgdgu(item, index)" v-for="(item, index) in NotifierObj.fileList" :key="index" style="margin:20px 0 20px 20px;flex: 0 0 100px; overflow: hidden;">
                                    <img style="width:100px;" :src="util.getBaseUrl() + '/api_v1/files/'+item.id+'/look?ifThumb=false&access_token='+sessionUtil.getAccessToken()" alt="">
                                </li>
                            </ul>
                        </div>
                      </div>
                      <div class="add-page-form-body"  style="width:1050px;margin-bottom:20px;">
                        <p class="add-page-form-title" >抄送人</p>
                        <div class="member-box">
                          <ul class="clear" style="padding-left:100px;box-sizing:border-box">
                            <li v-for="(item, index) in copyUsersList" :key="index" class="member-item">
                                <i v-if="isCreateUser||!isCreateEdit" @click.stop.prevent="deleteMember(index,copyUsersList)"></i>
                                <img :src="item.picture? item.picture:defaultLogo" alt="">
                                <span style="display:block;width:60px">{{item.userName}}</span>
                            </li>
                            <li v-if="isCreateUser||!isCreateEdit" style="margin-left:9px;"><img style="width: 42px;height: 42px;" src="../../assets/indexImg/add.png" @click.stop.prevent="addMember(copyUsersList,'copy')" alt=""></li>
                          </ul>
                        </div>
                      </div>
                      <div class="add-page-form-body"  style="width:1050px;margin-bottom:20px;" v-if="isCreateEdit&&(passUsersList.length>0||ifCopyUser)">
                        <p class="add-page-form-title">传阅人</p>
                        <div class="member-box">
                          <ul class="clear" style="padding-left:100px;box-sizing:border-box">
                            <li v-for="(item, index) in passUsersList" :key="index" class="member-item">
                                <i v-if="ifCopyUser" @click.stop.prevent="deleteMember(index,passUsersList)"></i>
                                <img :src="item.picture? item.picture:defaultLogo" alt="">
                                <span style="display:block;width:60px">{{item.userName}}</span>
                            </li>
                            <li v-if="ifCopyUser" style="margin-left:9px;"><img style="width: 42px;height: 42px;" src="../../assets/indexImg/add.png" @click.stop.prevent="addMember(passUsersList,'pass')" alt=""></li>
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
        
        <div v-if="activeStr=='添加汇报'" class="page-diary-index">
            <div class="box-style" style="height:100%;">
                <div class="add-page" style="">
                    <div class="add-page-button">
                        <div>
                            <el-button size="small" @click="activeStr=''">返回上一级</el-button>
                            <el-button size="small" @click="saveReport">保存</el-button>
                        </div>
                        
                    </div>
                    <div class="add-page-form" >
                        <div style="width:1050px" class="add-page-form-body">
                            <div class="select-msg-box" style="width:100%;margin:0;">
                                <span style="float:left;width:100px">类型</span>
                                <div style="overflow:hidden">
                                    
                                    <div style="float:left;margin-right:20px" @click="changeType('周报')">
                                        <input type="radio" v-model="addReportObj.TYPE_" value="周报" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">周报</label>
                                    </div>
                                    <div style="float:left;margin-right:20px" @click="changeType('月报')">
                                        <input type="radio" v-model="addReportObj.TYPE_" value="月报" style="vertical-align: middle;">
                                        <label style="vertical-align: middle;">月报</label>
                                    </div>
                                </div>
                            </div>

                            <div style="width:100%;overflow:hidden">
                                <div class="select-msg-box" style="width:690px;float:left;">
                                    <span style="float:left;width:100px">标题</span>
                                    <div style="overflow:hidden">
                                        <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="addReportObj.TITLE_" size="mini"  class="select-msg-ele" style="width:100%;background:#fff;overflow:hidden" placeholder="请输入标题"></el-input>
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
                                <span style="float:left;width:100px">工作计划<i style="color:red">*</i></span>
                                <div style="overflow:hidden;height:100px;">
                                    <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="addReportObj.WORK_PLAN_" rows='3' maxlength="500" show-word-limit type="textarea" size="medium" class="select-msg-ele"
                                     style="height:100px;width:100%;background:#fff;padding:0;overflow-x:hidden;overflow-y:auto" placeholder="请输入工作计划"></el-input>
                                </div>
                            </div>
                            <div class="select-msg-box" style="width:100%;margin-top:0;height:auto">
                                <span style="float:left;width:100px">工作记录<i style="color:red">*</i></span>
                                <div style="overflow:hidden;height:100px;">
                                    <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="addReportObj.WORK_RECORD_" rows='3' maxlength="500" show-word-limit :autosize="true" type="textarea" size="medium" class="select-msg-ele"
                                     style="height:100px;width:100%;background:#fff;padding:0;overflow-x:hidden;overflow-y:auto" placeholder="请输入工作记录"></el-input>
                                </div>
                            </div>
                            <div class="select-msg-box" style="width:100%;margin-top:0;height:auto">
                                <span style="float:left;width:100px">工作总结<i style="color:red">*</i></span>
                                <div style="overflow:hidden;height:100px;">
                                    <el-input :readonly="!isCreateUser&&isCreateEdit" v-model="addReportObj.WORK_SUMMARY_" rows='3' maxlength="500" show-word-limit :autosize="true" type="textarea" size="medium" class="select-msg-ele"
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
                                    <el-table-column label="操作" width="110">
                                        <template slot-scope="scope">
                                            <div class="handel-icon">
                                                <a v-if="!scope.row.isNewFlag" :href="util.getBaseUrl() + '/api_v1/files/'+scope.row.id+'/download?access_token='+sessionUtil.getAccessToken()"><img src="../../assets/administrationIcon/daoru.png" alt=""></a>
                                                <img v-show="isCreateUser||scope.row.isNewFlag" src="../../assets/administrationIcon/remove.png" @click="delFile(scope.row)" alt="">
                                                <img v-show="!scope.row.isNewFlag" src="../../assets/asideIcon/preview.png" @click="util.onPreview(scope.row)" alt="">
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
                                    <li v-for="(item, index) in addReportObj.checkMemberList" :key="index" class="member-item"><i @click.stop.prevent="deleteMember(index, addReportObj.checkMemberList)"></i><img :src="item.picture? item.picture:defaultLogo" alt=""><span style="display:block;width:60px">{{item.userName}}</span></li>
                                    <li style="margin-left:9px;"><img style="width: 42px;height: 42px;" src="../../assets/indexImg/add.png" @click.stop.prevent="addMember(addReportObj.checkMemberList,0)" alt=""></li>
                                </ul>
                            </div>
                        </div>
                        <div class="add-page-form-body"  style="width:1050px;margin-bottom:20px;">
                            <p class="add-page-form-title">抄送人</p>
                            <div class="member-box">
                               <ul class="clear" style="padding-left:100px;box-sizing:border-box">
                                    <li v-for="(item, index) in copyUsersList" :key="index" class="member-item">
                                        <i v-show="isCreateUser||!isCreateEdit" @click.stop.prevent="deleteMember(index, copyUsersList)"></i>
                                        <img :src="item.picture? item.picture:defaultLogo" alt="">
                                        <span style="display:block;width:60px">{{item.userName}}</span>
                                    </li>
                                    <li v-if="isCreateUser||!isCreateEdit" style="margin-left:9px;"><img style="width: 42px;height: 42px;" src="../../assets/indexImg/add.png" @click.stop.prevent="addMember(copyUsersList,'copy')" alt=""></li>
                                </ul>
                            </div>
                        </div>
                        <div class="add-page-form-body"  style="width:1050px;margin-bottom:20px;" v-if="isCreateEdit&&(passUsersList.length>0||ifCopyUser)">
                            <p class="add-page-form-title">传阅人</p>
                            <div class="member-box">
                            <ul class="clear" style="padding-left:100px;box-sizing:border-box">
                                <li v-for="(item, index) in passUsersList" :key="index" class="member-item"><i @click.stop.prevent="deleteMember(index,passUsersList)"></i><img :src="item.picture? item.picture:defaultLogo" alt=""><span style="display:block;width:60px">{{item.userName}}</span></li>
                                <li v-if="ifCopyUser" style="margin-left:9px;"><img style="width: 42px;height: 42px;" src="../../assets/indexImg/add.png" @click.stop.prevent="addMember(passUsersList,'pass')" alt=""></li>
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
			  <div style="overflow: auto;">
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
                                    <span style="float: right;">{{initDescStatus(activity.status)}}</span>
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
import asideItem from '../common/asideItem.vue'
import uploading from '../common/uploading.vue'
import selectMember from '../common/selectMember.vue'
import $ from 'jquery';
export default {
    data(){
        return{
            datelyFromKey:"t_datelyReport",
            weeklyFromKey:"t_weeklyReport",
            monthlyFromKey:"t_monthlyReport",
            dialogVisibles:true,
            recordVisible:false,
            editMembershow:{},
            activities:[],
            defaultLogo:require('@/assets/sflogo.jpg'),
        	imgitem:'',
        	imgshows:false,
            searchValue:'',//搜索
            searchDate:[],
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
        	yeTai:'',
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
            // uploadConfig:{
            //     limit: 10,
            //     limitSize: 50048576,
            //     readOnly: false,
            //     xtype: "test",
            //     accept: ".jpg,.jpeg,.png,.JPG,.JPEG,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xlsx",
            // },
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
            isEditFlag: false,
            imageUrl:"",
            JournalData:[],
            isJournal:false,
            DetailedObj:{},
            isregion:false,
            isTeam:false,
            TeamList:[],
            isCreateEdit:false,   //施工日志是否是编辑状态
            JournalId:'',
            JournalFileArr:[],
            sendMessage: '抄送人',
            memberList: [],
            copyUsersList:[], //抄送人
            passUsersList:[], //传阅人
            isCreateUser:false //是否是创建人
        }
    },
    created(){
        this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
        this.changeIndex('工作汇报');
        this.changeReport('施工日志')

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
        },
        uploadConfig:function(){
            let obj={
                limit: 10,
                limitSize: 50048576,
                readOnly: false,
                xtype: "test",
                accept: ".jpg,.jpeg,.png,.JPG,.JPEG,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xlsx",
            }
            let formKey="";
            if(this.activeReportStr=="施工日志"){
                formKey=this.datelyFromKey;
            }else if(this.activeReportStr=="周报"){
                formKey = this.weeklyFromKey;
            }else if(this.activeReportStr=="月报"){
                formKey = this.monthlyFromKey;
            }
            obj.formKey=formKey;
            return obj;
            // limit: 10,
            // limitSize: 50048576,
            // readOnly: false,
            // xtype: "test",
            // accept: ".jpg,.jpeg,.png,.JPG,.JPEG,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.xlsx",
        },
    },
    watch:{
       '$store.state.selectProjectObj.id':function(val,oldVal){
            this.changeIndex('工作汇报');
            this.changeReport('施工日志')
            
        }
    },
    activated(){
    	this.addlist=[];
        this.yeTai='';
        this.userName = this.sessionUtil.getUserName();
    },
    mounted() {
        this.$store.state.selectProjectNode={};
    },
    components:{uploading,selectMember,asideItem},
    methods:{
        deleteDiary(item){//删除日志
            this.util.confirm("确定要删除该数据吗?","提示",()=>{
                this.util.mask("正在删除..");
                this.util.restDelete("/api_v1/business/project/log/"+item.id,null,(res)=>{
                this.util.unmask();
                if(res.status==200){
                    this.util.success('删除成功!');
                    this.changeReport('施工日志')
                }else{
                    this.util.error('删除失败!');
                }
                });
            });
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
        initDescStatus(status){
            //when '0' then '记录' when '1' then '未指派' when '2' then '整改前' when '3' then '整改后' when '4' then '复查后' when '5' then '复查后' else '' end
            if(status==0){
                return "记录";
            }else if(status==1){
                return "未指派";
            }else if(status==2){
                return "整改前";
            }else if(status==3){
                return "整改后";
            }else if(status==4){
                return "复查后";
            }else if(status==5){
                return "复查后";
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
    	LogRenderingx(){
    		this.addlist=[];
    		this.activeStr='添加日志';
    		this.isCreateEdit=false;
            this.JournalId='';
    		this.NotifierObj={
                DATE_:new Date().format("yyyy-MM-dd"),
                children:[],
                fileList:[],
                deleteFilesList:[],
                
            };
            this.copyUsersList=[];
            this.passUsersList=[];
            if(this.$store.state.selectProjectObj.location){
                this.getAdcode(this.$store.state.selectProjectObj.location);
            }
    		let params={
              projUid:this.$store.state.selectProjectObj.id,
              dataDate:new Date().format("yyyy-MM-dd")
            }
            this.util.restGet('/api_v1/business/project/searchReportInspect',params,(res)=>{
                if(res.status==200&&res.data){
                    this.tableData_quality =  res.data.quality;
                    this.tableData_safety =  res.data.safety;
                    this.tableData_measured =  res.data.measured;
                    this.tableData_process =  res.data.process;
                    this.tableData_material =  res.data.material;
                    
                }else{
                    this.tableData_quality =  [];
                    this.tableData_safety =  [];
                    this.tableData_measured =  [];
                    this.tableData_process =  [];
                    this.tableData_material =  [];
                }
            })
        },
        getAdcode(location) {
            var _this = this;
            var url = "http://restapi.amap.com/v3/geocode/regeo?key=" + this.util.amapKey + "&output=json&location=" + location + "&radius=1000&extensions=base";
            $.ajax({
            url: url,
            timeout: 60000,
            async: false,
            type: "GET",
            dataType: 'json',
            data: null,
            success: function(result) {
                if (result) {
                    if (result.info == "OK") {
                        var adcode = result.regeocode.addressComponent.adcode;
                        _this.getWeather(adcode);
                    }
                }

            }
            });
        },
        getWeather(adcode) {
            var _this = this;
            var url = "http://restapi.amap.com/v3/weather/weatherInfo?city=" + adcode + "&key=" + this.util.amapKey;
            $.ajax({
            url: url,
            timeout: 60000,
            async: false,
            type: "GET",
            dataType: 'json',
            data: null,
            success: function(result) {
                if (result) {
                if (result.info == "OK") {
                    _this.NotifierObj.AM_WEATHER_=result.lives[0].weather;
                    _this.NotifierObj.AM_MAX_T_=result.lives[0].temperature;
                    _this.NotifierObj.AM_MIN_T_=result.lives[0].temperature;
                    _this.NotifierObj.AM_WDIR_=result.lives[0].winddirection;
                    _this.NotifierObj.AM_WS=result.lives[0].windpower;

                    _this.NotifierObj.PM_WEATHER_=result.lives[0].weather;
                    _this.NotifierObj.PM_MAX_T_=result.lives[0].temperature;
                    _this.NotifierObj.PM_MIN_T_=result.lives[0].temperature;
                    _this.NotifierObj.PM_WDIR_=result.lives[0].winddirection;
                    _this.NotifierObj.PM_WS=result.lives[0].windpower;
                }
                }

            }
            });
        },
      LogRendering(item){
        this.JournalFileArr=[];
        var tempObj=null;
        this.isCreateEdit=true;
        this.util.restGet("/api_v1/business/project/searchLogById",{id:item.id},(res)=>{
          this.util.unmask();
          if(res.status==200){
            this.activeStr='添加日志'
            
            this.JournalId=item.id;

            this.mainweather=res.data.WEATHER_

            tempObj = res.data;
            tempObj.ALTERATION_CONDITION_ =res.data.alterationCondition;
            tempObj.ISSUE_ANNOUNCE_ =res.data.issueAnnounce;


            var members=[];
            // 添加判断是否是操作人打开
            this.isCreateUser = (this.sessionUtil.getUserUid() === res.data.CREATE_USER_)
            // if(res.data.member && isCreateUser){
            //     res.data.member.forEach(obj=>{
            //         members.push({
            //             GROUP_UID_:obj.groupId,
            //             GROUP_NAME_:obj.groupName,
            //             PART_UID_:obj.partId,
            //             PART_NAME_:obj.partName,
            //         });
            //     });
              
            // }
            this.copyUsersList = res.data.personnel? res.data.personnel:[];
            this.passUsersList = res.data.passPersonnel? res.data.passPersonnel:[];

            tempObj.children=members;
            
            if(res.data.imgs){
                for(var i=0;i< res.data.imgs.length;i++){
                    let obj=res.data.imgs[i];
                    var dates = new Date(obj.createTime).format("yyyy-MM-dd");
                    obj.createTime=dates;
                }
                tempObj.fileList=res.data.imgs;
            }

            this.NotifierObj = tempObj;
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
				    	// this.NotifierObj.DATE_=res.data.DATE_;
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
        if(this.copyUsersList==undefined||this.copyUsersList.length==0){
          this.util.failueToast('请选择抄送人!');
          return false
        }
        
        let mainData={};
        mainData.CONTENT_=this.NotifierObj.CONTENT_
        mainData.AM_WEATHER_=this.NotifierObj.AM_WEATHER_
        mainData.WORK_CONDITION_=this.NotifierObj.WORK_CONDITION_
        mainData.ALTERATION_CONDITION_=this.NotifierObj.ALTERATION_CONDITION_
        mainData.ISSUE_ANNOUNCE_=this.NotifierObj.ISSUE_ANNOUNCE_
        mainData.DATE_=this.NotifierObj.DATE_
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
        //抄送人
        var memberData = [];
        this.copyUsersList.forEach(item => {
            var obj = {
                USER_NAME_: item.userName,
                USER_UID_: item.id,
                TYPE_: 0
            }
            memberData.push(obj);
        });
        //传阅人
        this.passUsersList.forEach(item=>{
            var obj = {
                USER_NAME_: item.userName,
                PROJ_UID_:this.projUid,
                USER_UID_: item.id,
                TYPE_:1
            }
            memberData.push(obj);
        });

        // for (let i=0,len=this.NotifierObj.memberList.length; i<len; i++) {
        //   var item = {
        //     USER_NAME_: this.NotifierObj.memberList[i].userName,
        //     PROJ_UID_:this.$store.state.selectProjectObj.id,
        //     USER_UID_: this.NotifierObj.memberList[i].id,
        //   }
        //   if (this.sendMessage === '传阅人'){
        //     item.PASS_USER_UID_ = this.sessionUtil.getUserUid()
        //   }
        //   memberData.push(item);
        // }
        // 当为传阅人保存时 不修改抄送人列表
        // if (this.sendMessage === '传阅人') {
            
        //     var passMemberSubForm = {subFormForeignKey:"LOG_UID_",subFormTable:"WX_WORK_LOG_USER_PASS",data:memberDataStr};
        //     subFormList.push(passMemberSubForm) //传阅人
        //     if (this.memberList && this.memberList.length > 0){
        //         var memberList = []
        //         for (let i = 0; i < this.memberList.length; i++) {
        //             var item = {
        //                 USER_NAME_: this.memberList[i].userName,
        //                 PROJ_UID_:this.$store.state.selectProjectObj.id,
        //                 USER_UID_: this.memberList[i].id
        //             }
        //             memberList.push(item);
        //         }
        //         memberDataStr = JSON.stringify(memberList);
        //     }
        // }
        

        var memberSubForm ={subFormForeignKey:"LOG_UID_",subFormTable:"WX_WORK_LOG_USER",data:JSON.stringify(memberData)};
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
                if(file.isNewFlag){
                    filesData.push(file);
                }
                
            }
        }

        var params = {formKey:this.datelyFromKey,ifSaveWorkflow:'false',mainFormData:JSON.stringify(mainData),sqlTableName:"WX_WORK_LOG",
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
            var projName = this.$store.state.selectProjectObj.proName;
            if(!this.validUtil.isNotEmpty(this.JournalId)){//新增
                //保存到app首页信息
                var mainData={
                  PROJ_UID_:this.$store.state.selectProjectObj.id,
                  BUSINESS_KEY_:res.data.id,
                  FORM_TYPE_:"日志",
                  FROM_USER_:this.sessionUtil.getUserUid(),
                  BUSINESS_URL_:"/api_v1/business/project/searchLogById",
                  FORM_URL_:"Journal/LogAdd"
                };
                var msgMemberList =[];
                this.copyUsersList.forEach(item => { //抄送人
                    var obj = {
                      VALUE_TYPE_: "user",
                      USER_UID_: item.id
                    }
                    msgMemberList.push(obj);
                });
                this.util.saveMsg(mainData,msgMemberList);
                //console.log("发送日志抄送通知===");
                var ids  = this.copyUsersList.map(obj=>obj.id);
                this.util.sendMessage(ids.join(","),"["+this.$store.state.selectProjectObj.proName+"]项目日报抄送通知","您有一条项目日报通知请查看",res.data.id,"日报","/Journal/LogAdd");
            }
            if(this.passUsersList.length>0){
                var msgTitle ="["+projName+"]日报传阅通知";
                var description = this.userName+"有一条日报已经传阅给您，点击查看";
                var ids  = this.passUsersList.map(obj=>obj.id);
                this.util.sendMessage(ids.join(","),msgTitle,description,res.data.id,"日报","/Journal/LogAdd");
            }
            
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
        changeType(str){
            this.addReportObj.TYPE_=str;
            this.addReportObj.TITLE_=this.sessionUtil.getUserName()+'-'+str+'-'+this.$store.state.selectProjectObj.proName+'项目'+' '+new Date().format('yyyy-MM-dd')
            this.$forceUpdate();
        },
        delReport(node){
            this.deleteObj={dialogVisible:true,deleteMsg:'删除汇报',obj:node};
        },
        seeReport(node,num){
            this.isCreateEdit=true;
             this.util.restGet('/api_v1/business/project/reportDetailsById?id='+node.id,null,(res)=>{
                if(res.status==200){
                    
                    this.addReportObj = res.data
                    this.$set(this.addReportObj,"WORK_PLAN_",res.data.workPlan);
                    this.$set(this.addReportObj,"WORK_RECORD_",res.data.workRecord);
                    this.$set(this.addReportObj,"WORK_SUMMARY_",res.data.workSummary);

                     this.isCreateUser = (this.sessionUtil.getUserUid() === res.data.createUser)
                    
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
                    if(res.data.notifier != undefined) {
                        this.copyUsersList = res.data.notifier.filter(item=>item.type==0);
                        this.passUsersList = res.data.notifier.filter(item=>item.type==1);
                    }
                    // if(res.data.notifier&&res.data.notifier.length>0){
                    //     for (let i = 0; i < res.data.notifier.length; i++) {
                    //         res.data.notifier[i].userName=res.data.notifier[i].USER_NAME_
                    //         res.data.notifier[i].id=res.data.notifier[i].USER_UID_
                    //     }
                    //     this.addReportObj.memberList=res.data.notifier
                    //     // 储存之前已通知人
                    // }else{
                    //     this.addReportObj.memberList=[]
                    // }
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
                    this.changeIndex('工作汇报');
                    this.activeStr = '工作汇报'
                }
            })
        },
        addNewReport(){
            this.getProjList()
            this.addReportObj={
              TYPE_:this.activeReportStr,
              TITLE_:this.sessionUtil.getUserName()+'-'+this.activeReportStr+'-'+this.$store.state.selectProjectObj.proName+'项目'+' '+new Date().format('yyyy-MM-dd'),
            }
            if(this.activeReportStr=="周报"){
                this.addReportObj.WEEKDATE_=[this.getWeekStartDate(),new Date().format("yyyy-MM-dd")];
            }
            
            this.copyUsersList=[];
            this.passUsersList=[];
            this.isCreateEdit=false;
            this.activePrveStr=this.activeStr
            this.activeStr='添加汇报'
        },
        //获得本周的开始日期
        getWeekStartDate() {
            var now = new Date(); //当前日期
			let nowDayOfWeek = now.getDay(); //今天本周的第几天
			let nowDay = now.getDate(); //当前日
			let nowMonth = now.getMonth(); //当前月
			let nowYear = now.getFullYear(); //当前年 
            let weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek+1);
            return weekStartDate.format("yyyy-MM-dd");
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
            if(this.addReportObj.TYPE_=='周报' && this.copyUsersList.length==0){
                    this.util.error('请选择抄送人')
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
            //抄送人
            var userData = [];
            this.copyUsersList.forEach(item => {
                var obj = {
                    USER_NAME_: item.userName,
                    USER_UID_: item.id,
                    TYPE_: 0
                }
                userData.push(obj);
            });
            //传阅人
            this.passUsersList.forEach(item=>{
                var obj = {
                    USER_NAME_: item.userName,
                    PROJ_UID_:this.projUid,
                    USER_UID_: item.id,
                    TYPE_:1
                }
                userData.push(obj);
            });
           
            var memberSubForm ={subFormForeignKey:"REPORT_UID_",subFormTable:"WX_WORK_REPORT_USER",data:JSON.stringify(userData)};
            subFormList.push(memberSubForm);
            let formKey = this.addReportObj.TYPE_=='月报'? this.monthlyFromKey:this.weeklyFromKey;
            var params = {formKey:formKey,mainFormData:JSON.stringify(mainData),sqlTableName:"WX_WORK_REPORT",subFormData:JSON.stringify(subFormList),filesData: JSON.stringify(filesList), deleteFilesData: JSON.stringify(deleteFilesIdList),ifSaveWorkflow:false};

            if(this.validUtil.isNotEmpty(this.addReportObj.id)){
                params['id']=this.addReportObj.id;
                params['businessKey']=this.addReportObj.id;
            }
            this.util.restPost("/api_v1/form/business",params,(res)=>{
                if(res.status==200){
                    var projName = this.$store.state.selectProjectObj.proName;  
                    if(!this.isCreateEdit){//新增
                        //保存到app首页信息
                        // var mainData={
                        // PROJ_UID_:this.$store.state.selectProjectObj.id,
                        // BUSINESS_KEY_:res.data.id,
                        // FORM_TYPE_:this.mainData.TYPE_,
                        // FROM_USER_:this.sessionUtil.getUserUid(),
                        // BUSINESS_URL_:"/api_v1/business/project/reportDetailsById",
                        // FORM_URL_:"report/add"
                        // };
                        // var msgMemberList =[];
                        // this.copyUsersList.forEach(item => { //抄送人
                        //     var obj = {
                        //     VALUE_TYPE_: "user",
                        //     USER_UID_: item.id
                        //     }
                        //     msgMemberList.push(obj);
                        // });
                        // this.util.saveMsg(mainData,msgMemberList);

                        var msgTitle ="["+projName+"]"+mainData.TYPE_+"通知";
                        var description = this.userName+"有一条"+mainData.TYPE_+"已经抄送给您，点击查看";
                        var ids  = this.copyUsersList.map(obj=>obj.id);
                        this.util.sendMessage(ids.join(","),msgTitle,description,res.data.id,mainData.TYPE_,"/report/add");

                    }         
                    if(mainData.APPROVER_){//给审核人发消息
                        this.util.sendMessage(mainData.APPROVER_,"["+projName+"]项目月报审核通知","您有一条项目月报审核通知，请查看",res.data.id,"月报","/report/add");
                    }
                    if(this.passUsersList.length>0){
                        var msgTitle ="["+projName+"]"+mainData.TYPE_+"传阅通知";
                        var description = this.userName+"有一条"+mainData.TYPE_+"已经传阅给您，点击查看";
                        var ids  = this.passUsersList.map(obj=>obj.id);
                        this.util.sendMessage(ids.join(","),msgTitle,description,res.data.id,mainData.TYPE_,"/report/add");
                    }
                    this.changeIndex(this.activePrveStr)
                    this.util.success('保存成功');
                }else{
                    this.util.error(res.errorMsg)
                }
            });
        },
        deleteProj(){
            console.log("deleteObj====",this.deleteObj);
            let formKey = this.deleteObj.TYPE_=='月报'? this.monthlyFromKey:this.weeklyFromKey;
            this.util.restDelete("/api_v1/business/project/report/"+this.deleteObj.obj.id,null,(res)=>{
                if(res.status==200){
                    this.util.success('删除成功');
                    this.deleteObj={dialogVisible:false};
                    this.changeIndex('工作汇报')
                }else{
                    this.util.error(res.errorMsg)
                }
            });

        },
        deleteNews(node){
            this.deleteObj={dialogVisible:true,deleteMsg:'删除新闻',obj:node};
        },
        addMember(userList,type){
            this.$refs.selectMemberFun.reset(userList);
            this.selectMemberModels.selectList=[];
            this.selectMemberModels.isShow=true
            this.selectMemberModels.type = type;
        },
        callBack3(){
            if(this.activeStr=='添加汇报'){
                if(this.selectMemberModels.type == 0) {//审核人
                    this.addReportObj.checkMemberList=this.selectMemberModels.selectList;
                }else if(this.selectMemberModels.type == "copy") {
                    this.copyUsersList=this.selectMemberModels.selectList;
                }else{
                    this.passUsersList=this.selectMemberModels.selectList;
                }

            }else if(this.activeStr=='添加日志'){
                if(this.selectMemberModels.type == "copy") {
                    this.copyUsersList=this.selectMemberModels.selectList;
                }else{
                    this.passUsersList=this.selectMemberModels.selectList;
                }
            }
            this.$forceUpdate()
        },
        deleteMember(index,userList){
            userList.splice(index,1);
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
            }else if(this.activeStr=='添加日志'){
              if(this.isCreateEdit){
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
            }else if(this.activeStr=='添加日志'){
                this.uploadConfig.filesList.forEach(item=>{
                    item.isNewFlag=true;
                });
              if(this.NotifierObj.fileList){
                this.NotifierObj.fileList = this.NotifierObj.fileList.concat(this.uploadConfig.filesList)
              }else{
                this.NotifierObj.fileList=this.uploadConfig.filesList
              }
            }
        },
        cancelLoading(){
            this.isUpLoadingShow=false
        },
        upLoadIngFill(){
            this.isUpLoadingShow=true
        },
        changeReport(type){
            this.searchDate=[];
            this.searchValue="";
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
                    search:this.searchValue,
                    startDate:this.searchDate&&this.searchDate[0]? this.searchDate[0]:"",
                    endDate:this.searchDate&&this.searchDate[1]? this.searchDate[1]:"",
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
            }else if(str == '工作汇报'){
                let params={
                    projUid:this.$store.state.selectProjectObj.id,
                    pageSize:this.workPageSize,
                    pageIndex:this.workPageIndex,
                    dataType:this.dataType,
                    type:this.type == '' ? '周报' : this.type,
                    search:this.searchValue,
                    startDate:this.searchDate&&this.searchDate[0]? this.searchDate[0]:"",
                    endDate:this.searchDate&&this.searchDate[1]? this.searchDate[1]:"",
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
            }
        },
        changediary(str){
            this.activediaryStr=str;
            
            this.changeIndex('施工日志');
        }
        
        
        
       
    }
}
</script>

<style scoped lang="scss">
.handel-icon{
    img{
        padding: 0px 5px;
        width: 18px;
        cursor: pointer;
    }
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
        height: 95%;
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
.elect-boxs .el-date-editor .el-range-separator {
    color: #44d2ff;
}
.elect-boxs .el-range-editor .el-range-input{
    padding-top: 4px;
    padding-bottom: 4px;
}
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
