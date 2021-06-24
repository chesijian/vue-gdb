<template>
  <div>
      <div class="proj-box" v-if="activeStr=='项目'" style="padding-top: 46px;">
        <div style="width:100%;height:100%;overflow-x:hidden;overflow-y:auto">
          <div class="tabs-box">
              <div class="tabs">
                  <span class="tabsspan" @click="changeStatus('',1)">全部</span>
                  <span class="tabsspan"  v-for="(item, index) in options.classifyList"   :key="index" :class="{actives : item.name  == buildingStr}" @click="changeStatus(item.name,index)">{{item.name}}</span>
                  <div style="float:right;display: flex;align-items: center;margin-top: 5px;" >
                    <div style="margin-right:15px" class="search-box">
                        <input type="text" v-model="searchValue" @keyup.enter="loadData">
                        <i></i>
                        <button class="theme-btn" @click="loadData">搜索</button>
                    </div>
                    <button class="theme-btn" v-if="sessionUtil.isAllowAdd('t_project')"  @click="addProj">添加</button>
                  </div>
              </div>
              
          </div>
          <div class="proj-list" v-for="(item, index) in boxList" :key="index"  @click.stop.prevent="changeVideo(item,index)">
              <div  class="box-style box-style1" style="height:100%">
                  <div>
                    <h4>
                        <span class="proj_name">{{item.proName}}</span>
                        <div style="float:right">
                            <button @click.stop="showProjectChart(item)">项目主页</button>
                            <button @click.stop.prevent="EditShow(item)"  v-if="sessionUtil.isAllowEdit('t_project')" >设置</button>
                            <button @click.stop.prevent="dialogShow(item)"  v-if="sessionUtil.isAllowDelete('t_project')" >删除</button>
                        </div>
                    </h4>
                      <img v-if="item.projectLogo" :src="item.projectLogo? util.getBaseUrl() + '/api_v1/files/'+item.projectLogo+'/look?ifThumb=true&access_token='+sessionUtil.getAccessToken():defaultLogo" width="100%" height="233px" alt="">
                      <i v-if="!item.projectLogo" class="no-img" style="width:100%;height:233px"></i>
                  </div>
                  <i class="box-style-top-left"></i>
                  <i class="box-style-top-right"></i>
                  <i class="box-style-bottom-left"></i>
                  <i class="box-style-bottom-right"></i>
              </div>
          </div>

        </div>
        <div style="text-align: right;color:#000">
            <el-pagination @current-change="changePageNum($event)"
              :current-page.sync="pageIndex" :page-sizes="[12, 25, 50, 100]"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="totalCount">
            </el-pagination>
          </div>
      </div>
      <div class="proj-box" style="padding-top:0" v-if="activeStr=='设置'">
        <div class="box-style" style="height:100%">
          <div class="set-box theme-from" style="position:relative;padding-top:45px;">
            <div class="set-top">
              <button class="theme-btn" @click="back()">返回上一级</button>
              <button class="theme-btn" @click="saveData()">保存</button>
              <button class="theme-btn" @click="quoteProject">引用项目立项</button>
            </div>
            <div style="overflow-y:auto;height:100%;width:100%;box-sizing: border-box;padding-right: 6px;">
              <div class="set-form">
                <h4>项目信息</h4>
                <div class="set-form-box-left">
                  <div class="form-item-box">
                    <div class="form-label">项目名称 <span class="required">*</span></div>
                    <div class="form-input">
                      <el-input v-model="mainData.XMMC_"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">开工日期</div>
                    <div class="form-input" style="padding:0">
                      <el-date-picker
                        v-model="mainData.START_DATE_"
                        format='yyyy-MM-dd'
                        value-format='yyyy-MM-dd'
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">负责人</div>
                    <div class="form-input" style="border: 1px solid #dcdfe6;">
                      <span style="display:block;height:100%" @click="selectLinkman">{{linkMan.userName}}</span>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">建设单位名称</div>
                    <div class="form-input">
                      <el-input v-model="mainData.BUILD_CORP_NAME_"></el-input>
                    </div>
                  </div>
                    <div class="form-item-box">
                    <div class="form-label">施工许可证编号</div>
                    <div class="form-input">
                      <el-input v-model="mainData.BUILDER_LICENSES_"></el-input>
                    </div>
                  </div>

                  <div class="form-item-box">
                    <div class="form-label">项目状态</div>
                    <div class="form-input">
                      <el-select v-model="mainData.STATUS_" placeholder="请选择">
                        <el-option v-for="(item,index) in options.StatusList"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">建筑面积(m2)</div>
                    <div class="form-input">
                      <el-input v-model="mainData.COVERED_AREA_"  type="number"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">建设规模</div>
                    <div class="form-input">
                      <el-select v-model="mainData.SCALE_" placeholder="请选择">
                        <el-option  v-for="(item, index) in options.scaleList"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">项目简介</div>
                    <div class="form-input">
                      <el-input v-model="mainData.CONTENT_"  type="text"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">设计</div>
                    <div class="form-input">
                      <el-input v-model="mainData.DESIGN_"  type="text"></el-input>
                    </div>
                  </div>
                </div>
                <div class="set-form-box-center">
                <div class="form-item-box">
                    <div class="form-label">项目编号</div>
                    <div class="form-input">
                      <el-input v-model="mainData.XMBH_"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">竣工日期</div>
                    <div class="form-input" style="padding:0">
                        <el-date-picker
                          v-model="mainData.END_DATE_"
                          format='yyyy-MM-dd'
                          value-format='yyyy-MM-dd'
                          type="date"
                          placeholder="选择日期">
                      </el-date-picker>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">联系人电话</div>
                    <div class="form-input" style="padding:0">
                    <el-input v-model="linkMan.mobileNo" type="number"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">建设单位统一信用代码</div>
                    <div class="form-input" style="padding:0">
                    <el-input v-model="mainData.BUILD_CORP_CODE_" type="text" ></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">用地许可证编号</div>
                    <div class="form-input">
                      <el-input v-model="mainData.LAND_LICENCE_"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">项目类型<span class="required">*</span></div>
                    <div class="form-input">
                      <el-select v-model="mainData.CLASSIFY_" placeholder="请选择">
                        <el-option
                          v-for="(item, index) in options.classifyList"
                          :key="index"
                          :label="item.name"
                          :value="item.name">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">总投资(万)</div>
                    <div class="form-input">
                      <el-input v-model="mainData.INVESTMENT_"  type="number"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">立项级别</div>
                    <div class="form-input">
                      <el-select v-model="mainData.RANK_" placeholder="请选择">
                        <el-option
                          v-for="(item, index) in options.levelList"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">工程用途</div>
                    <div class="form-input">
                      <el-input v-model="mainData.USE_"  ></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">成本</div>
                    <div class="form-input">
                      <el-input v-model="mainData.COST_"  ></el-input>
                    </div>
                  </div>
                </div>
                <div class="set-form-box-right" >
                  <div  style="margin-bottom:20px;" class="form-item-box" >
                    <div class="form-label">项目头像</div>
                    <div class="form-input" style="border:0;height:154px;padding-left:0;text-align:center;">
                      <div style="background:#F4F4F4;height:154px;width:154px;position:relative;overflow:hidden;" @mouseover="overShow=true"  @mouseleave="overShow=false"  @click="isUpLoadingShow=true;;">
                        <img style="height:154px;width:100%;"
                        v-if="fillObj&&fillObj.id&&islinshi"
                        :src="util.getBaseUrl() + '/api_v1/files/temp/'+fillObj.id+'/look?access_token='+sessionUtil.getAccessToken()"
                          alt="">
                        <img style="height:154px;width:100%;"
                        v-if="fillObj&&fillObj.id&&!islinshi"
                        :src="util.getBaseUrl() + '/api_v1/files/'+fillObj.id+'/look?access_token='+sessionUtil.getAccessToken()"
                          alt="">
                        <div style="height:154px;width:100%;position:absolute;left:0;top:0;background:rgba(0,0,0,0.5)" v-if="fillObj&&fillObj.id&&overShow" >
                          <img style="height:100px;margin-top:27px" src="../../assets/indexImg/reupdata.png" alt="">
                        </div>
                        <img style="height:100px;margin-top:27px" v-if="!fillObj.id||fillObj.id==''" src="../../assets/indexImg/updata.png" alt="">
                      </div>
                    </div>
                  </div>

                  <div class="form-item-box">
                    <div class="form-label">规划许可证编号</div>
                    <div class="form-input">
                      <el-input v-model="mainData.PROGRAMME_LICENCE_"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">建设性质</div>
                    <div class="form-input">
                      <el-select v-model="mainData.CONSTRUCTION_" placeholder="请选择">
                        <el-option
                          v-for="(item,index) in options.natureList" :key="index" :label="item" :value="item">
                        </el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">工程类型</div>
                    <div class="form-input">
                      <el-select v-model="mainData.TAGS_" placeholder="请选择">
                        <el-option label="房屋建设工程" value="房屋建设工程"></el-option>
                        <el-option label="市政公用工程" value="市政公用工程"></el-option>
                        <el-option label="机电安装工程" value="机电安装工程"></el-option>
                        <el-option label="铁路工程" value="铁路工程"></el-option>
                      </el-select>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">立项文号</div>
                    <div class="form-input">
                      <el-input v-model="mainData.REFERENCE_"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">总承包单位</div>
                    <div class="form-input">
                      <el-input v-model="mainData.OWNER_" type="text"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">总长度(米)</div>
                    <div class="form-input">
                      <el-input v-model="mainData.LENGTH_" type="number"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box">
                    <div class="form-label">采购</div>
                    <div class="form-input">
                      <el-input v-model="mainData.PURCHASE_" type="number"></el-input>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style="width:100%;float:left;">
                <div class="form-item-box" v-if="mainData.CLASSIFY_=='租赁'" style="width:69%;float:left;padding-right: 43px;">
                  <div class="form-label">改造内容</div>
                  <div class="form-input">
                    <el-input v-model="mainData.RETROFIT_CONTENT_"></el-input>
                  </div>
                </div>
                <template v-else>
                  <div class="form-item-box" style="width:31%;float:left;">
                    <div class="form-label">需求组织</div>
                    <div class="form-input" >
                      <el-input v-model="mainData.DEMAND_ORGANIZATION_"></el-input>
                    </div>
                  </div>
                  <div class="form-item-box" style="width:32%;float:left;margin-left: 45px;margin-right: 38px;">
                    <div class="form-label">业务需求接口人</div>
                    <div class="form-input" >
                      <el-input v-model="mainData.BUSINESS_REQUIREMENTS_"></el-input>
                    </div>
                  </div>
                </template>
                <div class="form-item-box" style="width:31%;float:left;">
                  <div class="form-label">片区</div>
                  <div class="form-input">
                    <el-select v-model="mainData.DISTRICT_" placeholder="请选择">
                        <el-option label="华东" value="华东"></el-option>
                        <el-option label="华南" value="华南"></el-option>
                        <el-option label="华西" value="华西"></el-option>
                        <el-option label="华北" value="华北"></el-option>
                      </el-select>
                  </div>
                </div>
              </div>
              

              <div class="form-item-box" style="width:69%;float:left;">
                <div class="form-label">省份</div>
                <div class="form-input" style="width:85px;margin-right:20px;">
                  <el-input v-model="mainData.ADDR_PROVINCE_"></el-input>
                  <!-- <el-select v-model="mainData.ADDR_PROVINCE_" placeholder="省" :disabled="true" @change="getCityList()" >
                    <el-option label="---请选择---" value=""></el-option>
                    <el-option v-for="(opt, index) in provinceList"  :key="index" :label="opt.name" :value="opt.id"></el-option>
                  </el-select> -->
                </div>
                <div class="form-input" style="margin-right:20px;width:85px">
                  <el-input v-model="mainData.ADDR_CITY_"></el-input>
                <!-- <el-select v-model="mainData.ADDR_CITY_" placeholder="市" :disabled="true" @change="getCountyList()">
                  <el-option label="---请选择---" value=""></el-option>
                  <el-option v-for="(opt, index) in cityList"  :key="index" :label="opt.name" :value="opt.id"></el-option>
                </el-select> -->
                </div>
                <div class="form-input" style="margin-right:20px;width:90px">
                  <el-input v-model="mainData.ADDR_COUNTY_"></el-input>
                  <!-- <el-select v-model="mainData.ADDR_COUNTY_" placeholder="县" :disabled="true" @change="$forceUpdate()">
                    <el-option label="---请选择---" value=""></el-option>
                    <el-option v-for="(opt, index) in countyList"  :key="index" :label="opt.name" :value="opt.id"></el-option>
                  </el-select> -->
                </div>
                <div class="form-input" style="width:490px;">
                  <el-input v-model="mainData.ADDR_NAME_"></el-input>
                </div>
              </div>
              <div class="form-item-box" style="width:31%;float:left;padding-right:50px">
                <div class="form-label" style="padding-left:20px;">地图选点</div>
                <div class="form-input" >
                  <el-input v-model="mainData.ADDR_LOCATION_"></el-input>
                </div>
                <div style="position:absolute;right:0;top:0;">
                  <img @click="addressObj.addressVisible=true" style="height:39px;margin-left:7px" src="../../assets/location.png" alt="">
                </div>

              </div>
              <div class="form-item-box" style="width:31%;float:left;">
                <div class="form-label">预估变更金额</div>
                <div class="form-input" >
                  <el-input v-model="mainData.CHANGE_AMOUNT_"></el-input>
                </div>
              </div>
              <div class="form-item-box" style="width:32%;float:left;margin-left: 45px;">
                <div class="form-label">审定后变更金额</div>
                <div class="form-input" >
                  <el-input v-model="mainData.AMOUNT_AFTER_APPROVAL_"></el-input>
                </div>
              </div>
              <div class="form-item-box" style="width:33%;float:left;">
                <div class="form-label" style="text-align: center;">备注</div>
                <div class="form-input" >
                  <el-input v-model="mainData.REMARK_"></el-input>
                </div>
              </div>
              
              <div style="float:left;width:100%;" class="theme-table">
                <div>
                  <div class="tabs" style="border:0 none;padding:0;">
                    <span :class="{active:tableKind==0}" @click="tableKind=0">项目成员</span>
                    <span :class="{active:tableKind==1}" @click="tableKind=1">参建单位</span>
                    <span :class="{active:tableKind==2}" @click="tableKind=2">施工许可证</span>
                    <div style="float:right;">
                      <button class="theme-btn" @click="addTableItem()">添加</button>
                      <button class="theme-btn theme-delete" @click="dialogShow()">删除</button>
                    </div>
                  </div>
                </div>
                <el-table  :data="tableData" v-if="tableKind==0" border @selection-change="handleSelectionChange">
                  <el-table-column  label="选择" width="60" type="selection">
                </el-table-column>
                <el-table-column  label="操作" width="60">
                  <template slot-scope="scope" class="operation">
                    <span @click="dialogShow(scope.row)"><img src="../../assets/indexImg/del.png" width="18" alt=""></span>
                  </template>
                </el-table-column>
                <el-table-column  label="姓名" width="200">
                  <template  slot-scope="scope">
                    <div>
                      <span>{{scope.row.userName}}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="检查角色" >
                  <template  slot-scope="scope">
                    <div>
                      <el-select style="width: 100%;" v-model="scope.row.checkRole" multiple placeholder="请选择">
                        <el-option v-for="(item,index) in checkRoleLst" :key="index" :label="item.name" :value="item.value"></el-option>

                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="职位" width="200" >
                  <template  slot-scope="scope">
                    <div>
                      <el-select v-model="scope.row.position" placeholder="请选择">
                        <el-option v-for="(item,index) in projRoleLst" :key="index" :label="item.name" :value="item.name"></el-option>
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                </el-table>
                <el-table  :data="tableDatas" v-show="tableKind==1" border @selection-change="handleSelectionChange">
                  <el-table-column  label="选择" width="60" type="selection">
                </el-table-column>
                <el-table-column  label="操作" width="60">
                  <template slot-scope="scope" class="operation">
                    <span @click="dialogShow(scope.row)"><img src="../../assets/indexImg/del.png" width="18" alt=""></span>
                  </template>
                </el-table-column>
                <el-table-column  label="参建单位名称" >
                  <template  slot-scope="scope">
                    <div>
                      <el-input v-model="scope.row.UNIT_NAME_"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="信用代码" >
                  <template  slot-scope="scope">
                    <div>
                      <el-input v-model="scope.row.CREDIT_CODE_"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="银行代码">
                  <template  slot-scope="scope">
                    <div>
                      <el-input v-model="scope.row.BANK_CODE_"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="银行支行名称" >
                  <template  slot-scope="scope">
                    <div>
                      <el-input v-model="scope.row.BANK_NAME_"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="银行卡号" >
                  <template  slot-scope="scope">
                    <div>
                      <el-input v-model="scope.row.BANK_NUMBER_"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="银行联号" >
                  <template  slot-scope="scope">
                    <div>
                      <el-input v-model="scope.row.BANK_LINKNUMBER_"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="进场时间" >
                  <template  slot-scope="scope">
                    <div class="date-picker">
                      <el-date-picker
                        v-model="scope.row.ENTRY_TIME_"
                        format='yyyy-MM-dd'
                        value-format='yyyy-MM-dd'
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="退场时间" >
                  <template  slot-scope="scope">
                    <div  class="date-picker">
                      <el-date-picker
                        v-model="scope.row.EXIT_TIME_"
                        format='yyyy-MM-dd'
                        value-format='yyyy-MM-dd'
                        type="date"
                        placeholder="选择日期">
                      </el-date-picker>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="单位类型" width="260" >
                  <template  slot-scope="scope">
                    <div>
                      <el-select v-model="scope.row.UNIT_TYPE_" placeholder="请选择">
                        <el-option label="施工单位" value="施工单位"></el-option>
                        <el-option label="建设单位" value="建设单位"></el-option>
                        <el-option label="监理单位" value="监理单位"></el-option>
                        <el-option label="设计单位" value="设计单位"></el-option>
                        <el-option label="专业分包" value="专业分包"></el-option>
                        <el-option label="设备分包" value="设备分包"></el-option>
                        <el-option label="材料分包" value="材料分包"></el-option>
                        <el-option label="后勤服务" value="后勤服务"></el-option>
                        <el-option label="特殊设备" value="特殊设备"></el-option>
                        <el-option label="劳务分包" value="劳务分包"></el-option>
                        <el-option label="勘察单位" value="勘察单位"></el-option>
                        <el-option label="管理单位" value="管理单位"></el-option>
                        <el-option label="其他" value="其他"></el-option>
                      </el-select>
                    </div>
                  </template>
                </el-table-column>
                </el-table>

                <el-table  :data="childProjList" v-show="tableKind==2" border @selection-change="handleSelectionChange">
                  <el-table-column  label="选择" width="60" type="selection">
                </el-table-column>
                <el-table-column  label="操作" width="60">
                  <template slot-scope="scope" class="operation">
                    <span @click="dialogShow(scope.row)"><img src="../../assets/indexImg/del.png" width="18" alt=""></span>
                  </template>
                </el-table-column>
                <el-table-column  label="工程名称" >
                  <template  slot-scope="scope">
                    <div>
                      <el-input v-model="scope.row.PRJ_NAME_"></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column  label="施工许可证编号">
                  <template  slot-scope="scope">
                    <div>
                      <el-input v-model="scope.row.BUILDER_LICENSE_NUM_"></el-input>
                    </div>
                  </template>
                </el-table-column>

                </el-table>
              </div>
            </div>
          </div>
          <i class="box-style-top-left"></i>
          <i class="box-style-top-right"></i>
          <i class="box-style-bottom-left"></i>
          <i class="box-style-bottom-right"></i>
        </div>
      </div>

      <el-dialog title="项目立项" :visible.sync="showSetUpProj">
            <div class="dialog" v-loading="loadingProj">
                <div class="dialog-box">
                    <el-table :data="setUpProjects"  style="height: 330px;" border highlight-current-row @current-change="handleSelectChange">
                      <el-table-column  label="项目名称" >
                        <template  slot-scope="scope">
                          <el-popover placement="left"
                                    width="200" trigger="hover"
                                    :content="scope.row.PROJ_NAME_">
                                    <div slot="reference">
                                        <span class="edit-val">{{ scope.row.PROJ_NAME_ }}</span>
                                    </div>
                                </el-popover>
                          <!-- <span class="edit-val">{{scope.row.PROJ_NAME_}}</span> -->
                        </template>
                      </el-table-column>
                      <el-table-column  label="项目代码" >
                        <template  slot-scope="scope">
                          <span class="edit-val">{{scope.row.PROJ_CODE_}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="项目类型">
                        <template  slot-scope="scope">
                          <span class="edit-val">{{scope.row.PROJ_TYPE_}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="创建时间">
                        <template  slot-scope="scope">
                          <span class="edit-val">{{scope.row.CREATE_TIME_}}</span>
                        </template>
                      </el-table-column>
                      <el-table-column label="创建人">
                        <template  slot-scope="scope">
                          <span class="edit-val">{{scope.row.CREATE_USER_}}</span>
                        </template>
                      </el-table-column>
                  </el-table>
                </div>
                <div class="dialog-footer">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                      :current-page="projPageIndex"
                      :page-sizes="[10,20, 30, 50, 100]"
                      :page-size="projPageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="projTotalCount">
                  </el-pagination>
                    <div style="text-align: right;padding: 10px 0px;">
                        <el-button size="mini" @click="showSetUpProj=false">取消</el-button>
                        <el-button type="primary" size="mini" @click="confirmSelect">确定</el-button>
                    </div>
                </div>
            </div>
            
        </el-dialog>

    <selectMember ref="selectMemberFun" :selectMemberModels='selectMemberModels'></selectMember>
    <transition name="fade">
			<ChooseAddress v-show="addressObj.addressVisible" ref="chooseAddress" :address="addressObj" @chooseAddress="chooseAddress($event)"></ChooseAddress>
		</transition>

    <el-dialog :title="deleteObj.deleteMsg" :visible.sync="deleteObj.dialogVisible" width="30%">
      <p>你确定要删除吗？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deleteObj.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteProj()">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="isUpLoadingShow">
      <div  class="add-part-box" style="z-index:98" @click.stop.prevent="isUpLoadingShow=false" ></div>
        <div class="add-part" style="height:234px;z-index:99">
          <p style="margin-bottom:10px;">添加文件</p>
          <uploading v-model="uploadingName"   :config="uploadConfig" ref="uploading" ></uploading>
          <div style="float:right;padding-top:10px;position:absolute;bottom:20px;right: 20px;">
              <button style="margin-right:20px;" @click.stop.prevent="isUpLoadingShow=false">关闭</button>
              <button @click.stop.prevent="saveFill">保存</button>
          </div>
        </div>
    </div>

  </div>
</template>

<script>
import { getDataByApi } from '@/api/api'
import selectMember from '@/components/common/selectMember.vue'
import uploading from '@/common/upload/upload.vue'
import ChooseAddress from '@/components/common/ChooseAddress.vue'
import { mapMutations } from 'vuex'
export default {
  name: 'index',
  components:{uploading,selectMember,ChooseAddress},
  data () {
    return {
      searchValue:"",
      loadingProj:false,//正在加载项目立项
      showSetUpProj:false,
      pageIndex:1,
      pageSize:12,
      totalCount:0,
      projPageIndex:1,
      projPageSize:10,
      projTotalCount:0,
      selectMemberModels:{
          isShow:false,
          selectList:[],
          callBack:this.callBack,
          radioSelectFlags:false,
      },
		  addressObj:{addressVisible: false},
      deleteObj:{dialogVisible:false,deleteMsg:''},
      provinceList:[],
      cityList:[],
      countyList:[],
      linkMan:{},
      selectShow:false,
      tableKind:0,
      options:{
        StatusList:['在建','筹备','竣工','停工'],
        classifyList:[],
        natureList:['新建','改建','扩建'],
        scaleList:['大型','中型','小型'],
        levelList:['部级','省级','地市级','区县级'],
      },
      projRoleLst:[],  //项目角色
      mainData:{},
      value1:'',
      editType:0,
      tableDatas:[],
      tableData:[],
      childProjList:[],
      uploadConfig:{
          limit: 1,
          limitSize: 1048578,
          readOnly: false,
          xtype: "test",
          tips: '最佳分辨率1000*800',
          accept: ".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF",
      },
      uploadingName:'',
      something:'',
      addPageShow:'',
      activeStr:'',
      date:'',
      buildingStr:'',
      boxList:[],
      selectNode:{},
      delTableArr:[],
      flag:true,
      overShow:false,
      isUpLoadingShow:false,
      islinshi:false,
      fillObj:{},
      simulation:0,
      logoId: '',
      selectProj: '',
      setUpProjects:[],
      checkRoleLst:[] //检查角色列表
    }
  },
  computed:{
      defaultLogo:function(){
        return this.$store.state.defaultLogo
      }
  },
  mounted(){
    // if(this.sessionUtil.isAllowMenu('0201')||this.sessionUtil.isAllowBtn('proj:view')){
    //   this.activeStr='项目';
    // }else{
    //   this.activeStr='';
    //   this.util.error('您暂时没有权限浏览项目，请联系管理员！')
    // }
    this.activeStr='项目';
    // this.getDict();//获取数据字典
    this.loadData()
    
  },
  watch: {
    $route(newVal) {
      if(newVal.path == '/proj') {
        this.activeStr='项目';
      }
    }
  },
  methods:{
    ...mapMutations([
      'setFormConfig'
    ]),
    //查看项目主页
    showProjectChart(item){
      this.$router.push({path:"/projLargeIndex/projLargeScreen",query:{projUid:item.id}});
    },
    //引用项目立项
    quoteProject(){
      this.showSetUpProj=true;
      this.loadSetProject()
    },
    //获取项目立项数据
    loadSetProject(){
      let params={
        pageIndex:this.projPageIndex,
        pageSize:this.projPageSize
      }
      this.loadingProj=true;
      getDataByApi("api-getSetUpProjects",params).then(res => {
          this.loadingProj=false;
          this.projTotalCount = res.totalCount;
          this.setUpProjects=res.data;
      });
    },
    handleSelectChange(value){
      this.selectedProject = value;
    },
    confirmSelect(){
      this.mainData.XMMC_ = this.selectedProject.PROJ_NAME_;
      this.mainData.XMBH_ = this.selectedProject.PROJ_CODE_;
      this.mainData.CLASSIFY_ = this.selectedProject.PROJ_TYPE_;
      this.mainData.COVERED_AREA_ = this.selectedProject.COVERED_AREA_;
      this.mainData.DEMAND_ORGANIZATION_ = this.selectedProject.DEMAND_ORGANIZATION_;
      this.mainData.DESIGN_ = this.selectedProject.DESIGN_;
      this.mainData.COSTING_ = this.selectedProject.COSTING_;
      this.mainData.PURCHASE_ = this.selectedProject.PURCHASE_;
      this.mainData.BUSINESS_REQUIREMENTS_ = this.selectedProject.BUSINESS_REQUIREMENTS_;
      this.mainData.PROJECT_ID_ = this.selectedProject.ID_;
      this.linkMan.userName = this.selectedProject.PM_;
      this.showSetUpProj=false;
    },
    handleCurrentChange(value){
      this.projPageIndex=value;
      this.loadSetProject()
    },
    handleSizeChange(){
      let url = this.util.getBaseUrl() + '/api_v1/modules/log/content/all?access_token=' + this.sessionUtil.getAccessToken()
      window.open(url)
    },
    getDict() {//
      this.util.restGet('/api_v1/dic/20190621/items',null, (res)=> {//项目类型
        if(res.status==200){
          this.options.classifyList=res.data
          let currentType = window.localStorage.getItem("currentType");
          let pageIndex = window.sessionStorage.getItem("pageIndex");
          let pageSize = window.sessionStorage.getItem("pageSize");
          this.pageIndex=pageIndex? parseInt(pageIndex):1;
          this.pageSize=pageSize? parseInt(pageSize):12;
          if(currentType){
            this.buildingStr=currentType;
          }else{
            this.buildingStr= this.options.classifyList[0].name
          }
         this.$forceUpdate()
         this.loadData()
        }else{
          this.util.error(res.errorMsg)
        }
  			 
  		})

      this.util.restGet('/api_v1/dic/SYS_PROJECT_ROLE/items',null, (res)=> {//检查角色列表
  			 this.checkRoleLst=res.data
  		});
      this.util.restGet('/api_v1/dic/SYS_PROJECT_POSITION/items',null, (res)=> {//成员职位
  			 this.projRoleLst=res.data
  		});
    },
    saveFill(){
      if(this.uploadConfig.filesList[0]){
        this.isUpLoadingShow=false;
        this.overShow=false;
        this.fillObj=this.uploadConfig.filesList[0]
      }else{
        this.util.error('请上传文件')
      }
    },
    chooseAddress(data){//选择项目地址回调
      var location =  data.addressLocation;
      this.mainData.ADDR_LOCATION_ = location;
      this.mainData.ADDR_NAME_ = data.address;
      this.mainData.ADDR_PROVINCE_ = data.province;
      this.mainData.ADDR_CITY_ = data.city;
      this.mainData.ADDR_COUNTY_ = data.county;
      // console.log("data=====",data);
      // this.$forceUpdate();
    },
    callBack(data){//选人回调
        if(this.selectMemberModels.radioSelectFlags){
          this.linkMan=this.selectMemberModels.selectList[0]

          // this.$refs.selectMemberFun.reset();
        }else{
          var newUser = data.filter(item=>{
            return this.tableData.findIndex(obj=>obj.id===item.id)==-1;
          });
          this.tableData=this.tableData.concat(newUser);
          return;
          var ids = this.selectMemberModels.selectList.map(item=> item.id);
           this.util.restGet('/api_v1/business/project/getPositionByUserIds',{ids:ids.join(",")}, (res)=> {
              if(res.status == 200){
                if(res.data&&res.data.length>0){
                  var arr1=this.tableData
                  arr1=arr1.concat(res.data);
                  var arr=[]
                  for (let i = 0; i < arr1.length; i++) {
                    if(arr.length>0){
                      var o={}
                        o = arr.find((item)=>{
                          if(item.id==arr1[i].id){
                            return item
                          }
                      })
                      if(!o||!o.id){
                        arr.push(arr1[i])
                      }
                    }else{
                      arr.push(arr1[i])
                    }
                  }
                  this.tableData=arr
                }
                this.$refs.selectMemberFun.reset();
              }else{
                this.util.error(res.errorMsg)
              }
            });
        }
      },
      selectLinkman(){
        this.selectMemberModels.isShow=true;
        this.selectMemberModels.selectList=[];
        this.$refs.selectMemberFun.reset();
        this.selectMemberModels.radioSelectFlags=true;
      },
      addTableItem(){
        if(this.tableKind==0){
          var userList = this.tableData? this.tableData:[];
          this.$refs.selectMemberFun.reset();
          this.selectMemberModels.isShow=true;
          this.selectMemberModels.selectList=this.tableData
          this.selectMemberModels.radioSelectFlags=false;
        }else if(this.tableKind==1){
          // this.tableDatas=this.tableDatas;
          let obj={simulation:this.simulation};
          this.tableDatas.push(obj)
          this.simulation=this.simulation+1
        }else if(this.tableKind==2){
          let obj ={PRJ_NAME_:"",BUILDER_LICENSE_NUM_:""};
          this.childProjList.push(obj);
        }
      },
      handleSelectionChange(val){
        this.delTableArr=val
      },
      saveData(){
        if(this.logoId!=''&&this.uploadConfig.filesList&&this.uploadConfig.filesList[0]&&this.logoId!=this.uploadConfig.filesList[0].id){
           this.util.restDelete("/api_v1/business/project/deleteProjHeadPortrait?fileId="+this.uploadConfig.filesList[0].id+'&projUid='+this.mainData.id,null,(res)=>{
            if(res.status==200){
            	this.$store.commit("projectName",this.buildingStr)
            this.saveDatas()
          }else{
            this.util.error(res.errorMsg)
          }
        });
        }else{
          this.saveDatas()
        }
      },
      saveDatas(){
        if(!this.validUtil.isNotEmpty(this.mainData.XMMC_)){
          this.util.error('请输入项目名称')
          return false;
        }
        if(!this.validUtil.isNotEmpty(this.mainData.CLASSIFY_)){
          this.util.error('请选择项目类型')
          return false;
        }
        // 添加项目编号必填判断
        // if(!this.validUtil.isNotEmpty(this.mainData.XMBH_)){
        //   this.util.error('请输入项目编号')
        //   return false;
        // }
        if(this.tableDatas){
            // 先过滤掉未输入参建单位名称
            this.tableDatas = this.tableDatas.filter(item=>{
              return item.UNIT_NAME_ != '' && item.UNIT_NAME_ != undefined
            })
            for (var i = 0; i < this.tableDatas.length; i++) {
                if(this.tableDatas[i].ID_){
                  this.tableDatas[i].PUSH_STATUS_ = 1
                } else {
                  this.tableDatas[i].PUSH_STATUS_ = 0
                }
               /* if(this.tableDatas[i].CREDIT_CODE_ == '' || this.tableDatas[i].CREDIT_CODE_ == undefined){
                  this.util.error('请输入信用代码')
                  return false;
                }*/
                // 取消多余必填判断
                // if(this.tableDatas[i].BANK_CODE_ == '' || this.tableDatas[i].BANK_CODE_ == undefined){
                //   this.util.error('请输入银行代码')
                //   return false;
                // }
                //   if(this.tableDatas[i].BANK_NAME_ == '' || this.tableDatas[i].BANK_NAME_ == undefined){
                //   this.util.error('请输入银行支行名称')
                //   return false;
                // }
                // if(this.tableDatas[i].UNIT_TYPE_ == '' || this.tableDatas[i].UNIT_TYPE_ == undefined){
                //   this.util.error('请输入单位类型')
                //   return false;
                // }
            }
        }
        if(this.childProjList){
            // 先过滤掉未输入工程名称的数据
            this.childProjList = this.childProjList.filter(item=>{
              return item.PRJ_NAME_ != '' && item.PRJ_NAME_ != undefined
            })
        }
        // 取消多余必填判断
        // if(this.childProjList){
        //     for(var i = 0;i<this.childProjList.length;i++){
        //       if(this.childProjList[i].PRJ_NAME_ == '' || this.childProjList[i].PRJ_NAME_ == undefined){
        //         this.util.error('请输入工程名称')
        //         return false;
        //       }
        //       if(this.childProjList[i].BUILDER_LICENSE_NUM_ == '' || this.childProjList[i].BUILDER_LICENSE_NUM_ == undefined){
        //         this.util.error('请输入施工许可证编号')
        //         return false;
        //       }
        //     }
        // }
        var filesData=this.uploadConfig.filesList;
        var memberData=[];
        var subFormList=[];
        if(this.tableData&&this.tableData.length>0){
          for (let i = 0; i < this.tableData.length; i++) {
            let o={}
            o.USER_NAME_ = this.tableData[i].userName;
            o.USER_UID_ = this.tableData[i].id;
            o.POSITION_ = this.tableData[i].position;
            o.ROLE_ID_ = this.tableData[i].checkRole.join(",");
            memberData.push(o)
          }
        }



        var subFormObj={subFormForeignKey:"PRO_UID_",subFormTable:"WX_PRO_MEMBER",data:JSON.stringify(memberData)};
        var subFormObj1={subFormForeignKey:"PROJ_UID_",subFormTable:"T_UNIT",data:JSON.stringify(this.tableDatas)};
        var subFormObj2={subFormForeignKey:"PARENT_UID_",subFormTable:"T_PROJ_CHILD",data:JSON.stringify(this.childProjList)};
        subFormList.push(subFormObj)
        subFormList.push(subFormObj1)
        subFormList.push(subFormObj2)
        this.mainData.PRINCIPAL_NAME_=this.linkMan.userName
        this.mainData.PRINCIPAL_ID_=this.linkMan.id
        this.mainData.LINKMAN_PHONE_=this.linkMan.mobileNo
        if(!this.validUtil.isNotEmpty(this.mainData.id)){//新增
            this.mainData.PUSH_STATUS_=0;
        }
        if(this.validUtil.isNotEmpty(this.mainData.id)&&this.mainData.pushStatus==1){//新增
            this.mainData.PUSH_STATUS_=0;
        }
        this.util.mask("正在保存..");
        var params = {mainFormData:JSON.stringify(this.mainData),sqlTableName:"WX_PROJECT",subFormData:JSON.stringify(subFormList),filesData: JSON.stringify(filesData),ifSaveWorkflow:false};
        if(!this.validUtil.isNotEmpty(this.mainData.XMBH_)){
          params['formKey']='t_project';
        }
        if(this.validUtil.isNotEmpty(this.mainData.id)){
            params['id']=this.mainData.id;
            params['businessKey']=this.mainData.id;
          delete this.mainData.id;
        }
        this.util.restPost("/api_v1/form/business",params,(res)=>{
          if(res.status==200){
            this.util.success('保存成功');
            this.loadData();
            this.back()
          }else{
            this.util.error(res.errorMsg)
          }
          this.util.unmask();
        });
      },
      back(){
        this.mainData={}
        this.activeStr=this.addPageShow;
        this.addPageShow='';
      },
      addProj(){//添加项目
        this.fillObj={};
        this.islinshi=true;
        this.logoId='';
        this.editType=0
        this.addPageShow=this.activeStr;
        this.mainData={
           STATUS_:'在建'
        };
        this.uploadConfig.filesList=[];
        this.linkMan={};
        this.tableData=[];
        this.tableDatas=[];
        this.childProjList=[];
        this.activeStr='设置';

      },
      EditShow(node){
        this.uploadConfig.filesList=[];
        var params={
          id:node.id
        };
        this.util.restGet("/api_v1/business/project/getProjectById",params,(res)=>{
          if(res.status==200){
            if(res.data){
              this.linkMan={
                id:res.data.PRINCIPAL_ID_,
                userName:res.data.PRINCIPAL_NAME_,
                mobileNo:res.data.LINKMAN_PHONE_
              }

              this.tableDatas=res.data.unit==undefined? []:res.data.unit;
              var memberList =res.data.member==undefined? []:res.data.member;
              memberList.forEach(item=>{
                item.checkRole=item.roleIds? item.roleIds.split(","):[];
              });
              this.tableData= memberList;
              this.childProjList=res.data.childProj==undefined? []:res.data.childProj;
              this.editType=1
              this.addPageShow=this.activeStr;
              this.activeStr='设置'
              delete res.data.linkManName
              this.fillObj.id=res.data.projectLogo
              this.islinshi=false;
              this.mainData=res.data
              if(res.data.RANK_ == 90){
              	  this.mainData.RANK_ = "部级"
              }
              if(res.data.RANK_ == 91){
              	  this.mainData.RANK_ = "省级"
              }
              if(res.data.RANK_ == 92){
              	  this.mainData.RANK_ = "地市级"
              }
              if(res.data.RANK_ == 93){
              	  this.mainData.RANK_ = "区县级"
              }
              if(res.data.RANK_ == 94){
              	  this.mainData.RANK_ = "国家级"
              }
              if(res.data.RANK_ == 95){
              	  this.mainData.RANK_ = "其他"
              }


              if(res.data.CONSTRUCTION_ == 99){
              	  this.mainData.CONSTRUCTION_ = "新建"
              }
              if(res.data.CONSTRUCTION_ == 100){
              	  this.mainData.CONSTRUCTION_ = "改建"
              }
              if(res.data.CONSTRUCTION_ == 101){
              	  this.mainData.CONSTRUCTION_ = "扩建"
              }
              if(res.data.CONSTRUCTION_ == 102){
              	  this.mainData.CONSTRUCTION_ = "恢复"
              }
              if(res.data.CONSTRUCTION_ == 103){
              	  this.mainData.CONSTRUCTION_ = "迁移"
              }
              if(res.data.CONSTRUCTION_ == 104){
              	  this.mainData.CONSTRUCTION_ = "拆除"
              }
              if(res.data.CONSTRUCTION_ == 205){
              	  this.mainData.CONSTRUCTION_ = "其他"
              }


              this.logoId=res.data.projectLogo;
            }else{
              this.addProj()
            }

          }else{
            this.util.error(res.errorMsg)
          }
          this.util.unmask();
        });

      },
      changeStatus(str,index){
        this.pageIndex =1;
        this.buildingStr=str;
        this.$forceUpdate()
        this.loadData()
      },
      changeVideo(node,num){
          window.localStorage.setItem("currentType", this.buildingStr);
          window.sessionStorage.setItem("pageIndex",this.pageIndex);
          window.sessionStorage.setItem("pageSize",this.pageSize);
        	this.$store.commit("projectName",this.buildingStr)
          this.cookieUtil.set('projectNode',JSON.stringify(node))

          let projInfo = {
            PROJ_CODE_: node.proNum,
            PROJ_ID_: node.id,
            PROJ_ID_LABEL_: node.proName,
            PROJ_NAME_: node.proName,
            PROJ_UID_: node.id,
            PROJ_UID_LABEL_: node.proName
          }
          this.setFormConfig({formKey:'_session_proj' + this.sessionUtil.getUser().id, data:projInfo})
          window.localStorage.setItem('_session_proj' + this.sessionUtil.getUser().id, JSON.stringify(projInfo))
          this.cookieUtil.set('sessionProj', projInfo)
          this.$store.state.selectProjectObj=node
          this.$router.push({ path: '/page/proj' });
      },
      dialogShow(node){
          if(this.activeStr=='项目'){
            this.selectNode=node
            if(this.sessionUtil.isCompanyAdmin()||this.selectNode.createUser==this.sessionUtil.getUserUid()){
              this.deleteObj={dialogVisible:true,deleteMsg:'删除项目'};
            }else{
                this.util.error('您没有权限删除该项目，请咨询管理员')
            }
          }else if(this.activeStr=='设置'){

            if(node){
              this.delTableArr[0]=node
            }
            if(this.tableKind==0){
              if(this.delTableArr.length==0){
                this.util.error('请选择要删除的成员')
                return
              }
              this.deleteObj={dialogVisible:true,deleteMsg:'删除成员'};
            }else if(this.tableKind==1){
              if(this.delTableArr.length==0){
                this.util.error('请选择要删除的参建单位')
                return
              }
              this.deleteObj={dialogVisible:true,deleteMsg:'删除参建单位'};
            }else{
            	 if(this.delTableArr.length==0){
                this.util.error('请选择要删除的工程名称')
                return
              }
              this.deleteObj={dialogVisible:true,deleteMsg:'删除工程名称'};
            }
          }
        },
        deleteProj(){
          if(this.activeStr=='项目'){
             this.util.restPut('/api_v1/business/project/deleteProject/'+this.selectNode.id,null,(res)=>{
                if(res.status==200){
                  this.loadData();
                  this.util.success('删除成功')
                  this.deleteObj.dialogVisible=false
                }else{
                    this.util.error(res.errorMsg)
                }
            })
          }else if(this.activeStr=='设置'){
            if(this.tableKind==0){
              for (let i = 0; i < this.tableData.length; i++) {
                this.delTableArr.find((item)=>{
                  if(this.tableData[i].id == item.id){
                    this.tableData.splice(i,1)
                  }
                })
              }

            }else{
            	if(this.tableKind==1){
            		   for (let i = 0; i < this.tableDatas.length; i++) {
                this.delTableArr.find((item)=>{
                  if(this.tableDatas[i].ID_ == item.ID_){
                    this.tableDatas.splice(i,1)
                  }
                })
              }
            	}
            	if(this.tableKind==2){
            		   for (let i = 0; i < this.childProjList.length; i++) {
                this.delTableArr.find((item)=>{
                  if(this.childProjList[i].simulation == item.simulation){
                    this.childProjList.splice(i,1)
                  }
                })
              }
            	}



            }
             this.deleteObj.dialogVisible=false
          }

        },
        changePageNum(value){
          this.pageIndex=value;
          this.loadData("more");
        },
        loadData(type){
          
          let params={
              search:this.searchValue,
              projStatus:this.buildingStr,
              pageSize:this.pageSize,
              pageIndex:this.pageIndex,
          }
          this.util.restGet('/api_v1/business/project/searchProjectList',params,(res)=>{
                if(res.status==200){
                  this.totalCount=res.totalCount;
                  if(res.data){
                    this.boxList=res.data
                  }else{
                    this.boxList=[]
                  }
                }else{
                    this.util.error(res.errorMsg)
                }
            })
      },
      loginOut(){
        this.cookieUtil.clearSession();
        this.cookieUtil.clearAll();
        // 清除window.cache_session
				this.sessionUtil.removeSession();
        this.$router.push({ path: '/login' });
        this.$store.commit('resetState')
        // window.location.reload()
        // this.$store.commit('clearAuth')
        // this.$store.dispatch('clearAuth')
        // this.$router.push({ path: '/login' });
      },
  }
}
</script>

<style scoped lang="scss">
.dialog{
    margin: -30px 0px;
    &-box{
        height: 360px;
        /deep/ .el-table thead {
            color: #303133;
        }
        
        .edit-val{
          color: #303133;
        }
    }
    &-footer{
      /deep/ .el-input__inner{
        color: #303133;
      }
    }
}
.modal{
  &-mask{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 8;
    background: rgba(0,0,0,.3);
  }
  &-boxs{
    width:800px;
    height:600px;
    z-index: 10;
    transform: translate(-50%, -50%);
    position: fixed;
    left: 50%;
    top: 50%;
    background: #fff;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    padding: 10px 15px;
    display: flex;
    flex-flow: column;
    box-sizing: border-box;
    h4{
      color: #333;
    }
    /deep/ .el-table thead {
        color: #303133;
    }
    /deep/ .el-input__inner{
      color: #303133;
    }
    .edit-val{
      color: #303133;
    }
  }
}

.proj_name {
    max-width: 58%;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    float: left;
}

.tabs-box{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    padding: 0 10px;
    box-sizing: border-box;
}
.actives{
  background: url(../../assets/indexImg/select.png) no-repeat  top center;
  background-size: 100px 27px !important;
}

.top{
  height: 50px;
  overflow: hidden;
  color: #000;
}
.select-proj{
  float: left;
  width: 110px;
  height: 32px;
  margin:10px;
  padding-left:2px;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
  background-image: linear-gradient(left, rgba(20,60,121,0.90) 0%, rgba(3,31,60,0.40) 99%);
}
.select-proj::before{
    position: absolute;
    content: '';
    height: 100%;
    width: 2px;
    background: #44D2FF;
    left: 0px;
    top: 0;
}


// span{
//     color: #fff;
// }
.tabsspan{
	width: 100px !important;
}


a,a:active{
  color: #fff;
  text-decoration: none;
}
.proj-list{
  width:33.33%;padding-right:10px;float:left;box-sizing:border-box;height: 299px;
}
.proj-list:nth-child(3n+1){
  padding-right: 0;
}
.set-top{
  text-align: left;
  position: absolute;
  top: 10px;
  left: 10px;
}

.set-form>div{
  width:33.33333333%;float:left;
  box-sizing: border-box;
}
.set-form-box-left{
   padding-right:27px;
}
.set-form-box-center{
  float:left;padding:0 13.5px;
}
.set-form-box-right{
  padding-left:27px;
}

.form-item-box{
  // overflow: hidden;
  position: relative;
  padding-left: 150px;
  box-sizing: border-box;
  width: 100%;
  float: left;
  margin-bottom: 20px;
}
.form-item-box>div{
  float: left;
  text-align: left;
  height: 38px;
  line-height: 38px;
}
.form-label{
  width: 150px;
  position: absolute;
  top: 0;
  left: 0;
}
.form-item-box>.form-input{
  // border: 1px solid #ccc;
  width: 100%;
  // padding-left: 10px;
  box-sizing: border-box;
  line-height: 36px;
}
.form-input>div{
  width: 100%;
}
.required{
  color: red;
}
.select-show{
  position: absolute;
  right: 0px;
  top:38px;
  background: #fff;
  z-index: 999;
  font-size: 14px;
  color: #333;
  overflow: hidden;
  transition: all 0.5s;
}
.select-show>div{
  width: 180px;
  height: 60px;
  padding:0 14px;
  box-sizing: border-box;
  text-align:left;
}
.select-show>div:hover{
  background: #e7e7e7;
}
.select-show>div:first-child:hover{
  background: #fff;
}

.date-picker >>> .el-input__icon {
    line-height: 20px;
}
</style>
<style>
.form-input .el-input--prefix .el-input__inner{
  padding-left: 10px;
}
.form-input .el-input__prefix{
  left: auto;
  right:0px;
  top: -3px;
}
.form-input .el-input.is-disabled .el-input__inner{
  background:transparent;
}
</style>
