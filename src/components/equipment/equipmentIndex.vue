<template>
  <div class="equipmentIndex">
    <div class="tabs-box">
      <div class="tabs">
        <span class="active" >设备管理</span>
      </div>
    </div>
    <div class="conter clear ">
      <div class="conter_left ">
          <div class="conter_left_title clear">
            <div class="title_left">
              <h4>目录</h4>
            </div>
            <div class="title_right">
              <button @click="open3" v-if="sessionUtil.isAllowBtn('gc6:btn_add_catalog')">添加</button>
              <button @click="open2"  v-if="sessionUtil.isAllowBtn('gc6:btn_delete_catalog')">删除</button>
            </div>
          </div>
          <div class="aside-box">
            <asideItems v-for="(item, index) in models"  :key="index" :models="item" :level="0" ></asideItems>
          </div>
          <i class="box-style-top-left"></i>
          <i class="box-style-top-right"></i>
          <i class="box-style-bottom-left"></i>
          <i class="box-style-bottom-right"></i>
      </div>
      <div class="context-r">
        <div style="height:50%;padding-bottom: 10px;box-sizing: border-box;" :style="{height:sessionUtil.isAllowBtn('gc6:equipment_view')?'50%':'100%'}">
          <div class="conter_right" style="width: 100%;height: 100%;box-sizing: border-box;padding: 50px 10px 42px ">
            <div style="width: 100%;position: relative;">
              <div class="conter_right_header" style="width: 100%;position: absolute;top:-40px;left: 0;">
                <div class="con_left">
                  <span @click="changeType(0)" :class="{active:createType==0}">全部</span>
                  <span @click="changeType(1)" :class="{active:createType==1}">进场</span>
                  <span @click="changeType(2)" :class="{active:createType==2}">退场</span>
                </div>
                <div class="con_right">
                  <div class="con_right_on3">
                    <span class="btn_search" @click="openAdd" v-if="sessionUtil.isAllowBtn('gc6:btn_add')">添加</span>
                    <span class="btn_search" @click="openone" v-if="sessionUtil.isAllowBtn('gc6:btn_delete')">删除</span>
                    <!--<span class="btn_search">导出</span>-->
                  </div>
                  <div class="con_right_on1">
              <span class="serach">
                <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="search"></el-input>
              </span>
                    <span class="btn_search" @click="searchType" style="position: relative;left:-5px">搜索</span>
                  </div>
                  <div class="con_right_on2">
                    <span>状态</span>
                    <span>
                      <el-select v-model="status" @change="changeStatus" placeholder="请选择" size="mini" class="select-ele">
                        <el-option v-for="item in deviceArr"  :key="item.id" :label="item.addressName" :value="item.id">
                        </el-option>
                      </el-select>
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="tab" style="width: 100%;height: 100%;box-sizing: border-box;" ref="tablebox">
              <el-table :data="tableData" :height="tableHeightNum" class="highlight-current-row"
                        border highlight-current-row @cell-click="handleCurrentclick"
                        @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column  label="操作"  width="100" v-if="sessionUtil.isAllowBtn('gc6:btn_edit')||sessionUtil.isAllowBtn('gc6:btn_delete')||sessionUtil.isAllowBtn('gc6:QR_btn')">
                  <template slot-scope="scope" class="operation">
                    <span @click.stop="edit(scope.$index, tableData)" v-if="sessionUtil.isAllowBtn('gc6:btn_edit')"><img src="../../assets/indexImg/edit.png" width="17px" height="17px" alt=""></span>
                    <span @click.stop="remove(scope.$index, tableData)" v-if="sessionUtil.isAllowBtn('gc6:btn_delete')"><img src="../../assets/indexImg/del.png" width="17px" height="17px" alt=""></span>
                    <span @click="QRcode(scope.row)" v-if="sessionUtil.isAllowBtn('gc6:QR_btn')"><img src="../../assets/indexImg/erma.png" width="17px" height="17px" alt=""></span>
                  </template>
                </el-table-column>
                <el-table-column prop="site" label="在场" >
                </el-table-column>
                <el-table-column prop="status" label="状态" >
                </el-table-column>
                <el-table-column prop="code" label="设备编码" >
                </el-table-column>
                <el-table-column prop="name" label="设备名称" >
                </el-table-column>
                <el-table-column prop="specification" label="型号规格"  >
                </el-table-column>
                <el-table-column prop="produceFactory" label="生产厂家" >
                </el-table-column>
                <el-table-column prop="inSiteDate" width="120" label="入场日期" >
                </el-table-column>
                <el-table-column prop="outSiteDate" width="120" label="退场日期" >
                </el-table-column>
                <el-table-column prop="installationUnit" label="安装单位" >
                </el-table-column>
                <el-table-column prop="installPosition" label="安装位置" >
                </el-table-column>
                <el-table-column prop="principal" label="负责人" >
                </el-table-column>
              </el-table>
            </div>
            <div class="block" style="position:absolute;bottom: 10px;right: 0;">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="prev, pager, next, jumper"
                :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
        <div class="conter_bot" style="position: relative;width:100%;box-sizing: border-box" v-if="sessionUtil.isAllowBtn('gc6:equipment_view')">
          <div style="height:100%;width:100%;box-sizing: border-box;padding: 50px 10px 42px;">
            <div style="width: 100%;position: relative;">
              <div class="conter_right_header" style="width: 100%;position: absolute;top:-40px;left: 0;">
                <div class="con_left">
                  <span @click="changeShow(0)" :class="{active:createShow==0}">使用时长</span>
                  <span @click="changeShow(1)" :class="{active:createShow==1}">维护保养</span>
                  <span @click="changeShow(2)" :class="{active:createShow==2}">维修</span>
                </div>
                <div class="con_right">
                  <div class="con_right_on3">
                    <span class="btn_search" @click="employopen" v-if="sessionUtil.isAllowBtn('gc6:btn_add_record')">添加</span>
                    <span class="btn_search" @click="delone"  v-if="sessionUtil.isAllowBtn('gc6:btn_delete_record')">删除</span>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="createShow==0" >
                <div class="tab"  ref="tablebox1" style="width: 100%;height: 100%;box-sizing: border-box;">
                  <el-table :data="tableDatas" :height="tableHeightNum" class="highlight-current-row" border @selection-change="handleSelectionChange1">
                    <el-table-column type="selection" width="55">
                    </el-table-column>
                    <el-table-column  label="操作"  width="100">
                      <template slot-scope="scope" class="operation" v-if="sessionUtil.isAllowBtn('gc6:btn_edit_record')||sessionUtil.isAllowBtn('gc6:btn_delete_record')">
                        <span @click.stop="edit1(scope.$index, tableDatas)"  v-if="sessionUtil.isAllowBtn('gc6:btn_edit_record')"><img src="../../assets/administrationIcon/edit1.png" width="17px" height="17px" alt=""></span>
                        <span @click.stop="remove1(scope.$index, tableDatas)"  v-if="sessionUtil.isAllowBtn('gc6:btn_delete_record')"><img src="../../assets/indexImg/del.png" width="17px" height="17px" alt=""></span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="date" label="日期" >
                    </el-table-column>
                    <el-table-column prop="hour" label="使用时长(小时)" >
                    </el-table-column>
                    <el-table-column prop="createUser" label="记录人" >
                    </el-table-column>
                    <el-table-column prop="description" label="描述" >
                    </el-table-column>
                  </el-table>
                </div>
                <div class="block" style="position:absolute;bottom: 10px;right: 0;">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange0"
                    :current-page.sync="currentPage0"
                    :page-size="pageSize0"
                    layout="prev, pager, next, jumper"
                    :total="total0">
                  </el-pagination>
                </div>
            </div>
            <div v-if="createShow==1">
              <div class="tab" ref="tablebox1" style="width: 100%;height: 100%;box-sizing: border-box;">
                <el-table :data="tableDatas" :height="tableHeightNum" class="highlight-current-row" border @selection-change="handleSelectionChange1">
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column  label="操作"  width="100">
                    <template slot-scope="scope" class="operation"  v-if="sessionUtil.isAllowBtn('gc6:btn_edit_record')||sessionUtil.isAllowBtn('gc6:btn_delete_record')">
                      <span @click.stop="edit1(scope.$index, tableDatas)" v-if="sessionUtil.isAllowBtn('gc6:btn_edit_record')"><img src="../../assets/administrationIcon/edit1.png" width="17px" height="17px" alt=""></span>
                      <span @click.stop="remove1(scope.$index, tableDatas)" v-if="sessionUtil.isAllowBtn('gc6:btn_delete_record')"><img src="../../assets/indexImg/del.png" width="17px" height="17px" alt=""></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="日期" >
                  </el-table-column>
                  <el-table-column prop="maintainType" label="维护项目" >
                  </el-table-column>
                  <el-table-column prop="description" label="描述" >
                  </el-table-column>
                  <el-table-column prop="recorder" label="维护人" >
                  </el-table-column>
                  <el-table-column prop="createUser" label="记录人" >
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" >
                  </el-table-column>
                </el-table>
              </div>
              <div class="block" style="position:absolute;bottom: 10px;right: 0;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currentPage1"
                  :page-size="pageSize1"
                  layout="prev, pager, next, jumper"
                  :total="total1">
                </el-pagination>
              </div>
            </div>
            <div v-if="createShow==2">
              <div class="tab" ref="tablebox1" style="width: 100%;height: 100%;box-sizing: border-box;">
                <el-table :data="tableDatas" :height="tableHeightNum" class="highlight-current-row" border @selection-change="handleSelectionChange1">
                  <el-table-column type="selection" width="55">
                  </el-table-column>
                  <el-table-column  label="操作"  width="100">
                    <template slot-scope="scope" class="operation"  v-if="sessionUtil.isAllowBtn('gc6:btn_edit_record')||sessionUtil.isAllowBtn('gc6:btn_delete_record')">
                      <span @click.stop="edit1(scope.$index, tableDatas)" v-if="sessionUtil.isAllowBtn('gc6:btn_edit_record')"><img src="../../assets/administrationIcon/edit1.png" width="17px" height="17px" alt=""></span>
                      <span @click.stop="remove1(scope.$index, tableDatas)" v-if="sessionUtil.isAllowBtn('gc6:btn_delete_record')"><img src="../../assets/indexImg/del.png" width="17px" height="17px" alt=""></span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="date" label="日期" >
                  </el-table-column>
                  <el-table-column prop="maintainType" label="维护项目" >
                  </el-table-column>
                  <el-table-column prop="description" label="描述" >
                  </el-table-column>
                  <el-table-column prop="recorder" label="维修人" >
                  </el-table-column>
                  <el-table-column prop="createUser" label="记录人" >
                  </el-table-column>
                  <el-table-column prop="remark" label="备注" >
                  </el-table-column>
                </el-table>
              </div>
              <div class="block" style="position:absolute;bottom: 10px;right: 0;">
                <el-pagination
                  @size-change="handleSizeChange"
                  @current-change="handleCurrentChange2"
                  :current-page.sync="currentPage2"
                  :page-size="pageSize2"
                  layout="prev, pager, next, jumper"
                  :total="total2">
                </el-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

<!--//使用时长/维修保养/维修新增-->
    <el-dialog :title="createShow==0?'使用时长':(createShow==1?'维护保养':'维修')" class="Use" :visible.sync="dialogFormVisible1">
      <el-form :model="form1">
        <el-row :gutter="0">
          <el-col :span="24">
            <el-form-item label="设备名称" v-if="createShow!=0" :label-width="formLabelWidth">
              <el-input disabled="disabled" v-model="form1.name"  ></el-input>
            </el-form-item>
            <el-form-item label="规格型号" v-if="createShow!=0" :label-width="formLabelWidth">
              <el-input disabled="disabled" v-model="form1.specification"  ></el-input>
            </el-form-item>
            <div class="contersion" v-if="createShow!=0">
              <el-form-item label="设备状态"  :label-width="formLabelWidth">
                <div style="display: flex;">
                  <div><input disabled v-model="form1.status" name="radio" type="radio" value="1"/><label>正常</label></div>
                  <div><input disabled v-model="form1.status" name="radio" type="radio"  value="2"/><label>异常</label></div>
                  <div><input disabled v-model="form1.status" name="radio" type="radio" value="3"/><label>维护</label></div>
                </div>

                <!--<el-radio v-model="form1.status" @change="changeradio" label="1">正常</el-radio>-->
                <!--<el-radio v-model="form1.status" @change="changeradio" label="2">异常</el-radio>-->
                <!--<el-radio v-model="form1.status" @change="changeradio" label="3">维护</el-radio>-->
              </el-form-item>
            </div>
            <div class="dates" >
              <el-form-item label="日期" :label-width="formLabelWidth">
                <el-date-picker v-model="form1.date" type="date" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </div>

            <el-form-item label="维护项目" v-if="createShow!=0" :label-width="formLabelWidth">
              <el-input v-model="form1.maintainType"  :maxlength="199"></el-input>
            </el-form-item>
            <el-form-item :label="createShow==1?'维护人':'维修人'" v-if="createShow!=0" :label-width="formLabelWidth">
              <el-input v-model="form1.recorder"  :maxlength="199"></el-input>
            </el-form-item>


            <el-form-item label="小时" v-if="createShow==0" :label-width="formLabelWidth">
              <el-input v-model="form1.hour"  ></el-input>
            </el-form-item>
            <el-form-item label="分钟" v-if="createShow==0" :label-width="formLabelWidth">
              <el-input v-model="form1.minute"  ></el-input>
            </el-form-item>
            <el-form-item label="描述"  :label-width="formLabelWidth">
              <el-input v-model="form1.description" :maxlength="199" ></el-input>
            </el-form-item>
            <el-form-item label="备注" v-if="createShow!=0" :label-width="formLabelWidth">
              <el-input v-model="form1.remark"  :maxlength="199"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="employclose">关闭</el-button>
        <el-button type="primary" @click="employSub">保存</el-button>
      </div>
    </el-dialog>




<!--//设备新增-->
    <el-dialog title="设备信息" id="sss" class="equipments" :visible.sync="dialogFormVisible">
      <div style="height:370px;width:870px;">
        <!--<el-form :model="form">-->
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="select-msg-box" >
              <span style="float:left" class="must">设备名称</span>&nbsp;&nbsp;
              <el-input v-model="form.NAME_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <div class="select-msg-box" >
              <span style="float:left" class="must">品牌</span>&nbsp;&nbsp;
              <el-input v-model="form.BRAND_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <div class="select-msg-box" >
              <span style="float:left" class="must">负责人姓名</span>&nbsp;&nbsp;
              <el-input v-model="form.PRINCIPAL_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <div class="select-msg-box" >
              <span style="float:left" class="must">验收人姓名</span>&nbsp;&nbsp;
              <el-input v-model="form.ACCEPTANCE_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
              <!--<el-form-item label="设备名称" :label-width="formLabelWidth">-->
                <!--<el-input v-model="form.NAME_"></el-input>-->
              <!--</el-form-item>-->

            <!--<el-form-item label="品牌" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.BRAND_"></el-input>-->
            <!--</el-form-item>-->

              <!--<el-form-item label="负责人姓名" :label-width="formLabelWidth">-->
                <!--<el-input v-model="form.PRINCIPAL_"  ></el-input>-->
              <!--</el-form-item>-->
              <!--<el-form-item label="验收人姓名" :label-width="formLabelWidth">-->
                <!--<el-input v-model="form.ACCEPTANCE_"  ></el-input>-->
              <!--</el-form-item>-->
          </el-col>
          <el-col :span="8">
            <div class="select-msg-box" >
              <span style="float:left" class="must">设备编号</span>&nbsp;&nbsp;
              <el-input v-model="form.CODE_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <div class="select-msg-box" >
              <span style="float:left" class="must">生产厂家</span>&nbsp;&nbsp;
              <el-input v-model="form.PRODUCE_FACTORY_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <div class="select-msg-box" >
              <span style="float:left" class="must">负责人电话</span>&nbsp;&nbsp;
              <el-input v-model="form.PRINCIPAL_PHONE_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <div class="select-msg-box" >
              <span style="float:left" class="must">验收人电话</span>&nbsp;&nbsp;
              <el-input v-model="form.ACCEPTANCE_PHONE_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <!--<el-form-item label="设备编号" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.CODE_"  ></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="生产厂家" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.PRODUCE_FACTORY_"  ></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="负责人电话" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.PRINCIPAL_PHONE_"  ></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="验收人电话" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.ACCEPTANCE_PHONE_"  ></el-input>-->
            <!--</el-form-item>-->
          </el-col>
          <el-col :span="8">
            <div class="select-msg-box" >
              <span style="float:left" class="must">型号规格</span>&nbsp;&nbsp;
              <el-input v-model="form.SPECIFICATION_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <div class="select-msg-box" >
              <span style="float:left" class="must">安装单位</span>&nbsp;&nbsp;
              <el-input v-model="form.INSTALLATION_UNIT_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <div class="select-msg-box" >
              <span style="float:left" class="must">安装位置</span>&nbsp;&nbsp;
              <el-input v-model="form.INSTALL_POSITION_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <div class="select-msg-box" >
              <span style="float:left" class="must">备注</span>&nbsp;&nbsp;
              <el-input v-model="form.REMARK_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <!--<el-form-item label="型号规格" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.SPECIFICATION_"></el-input>-->
            <!--</el-form-item>-->

            <!--<el-form-item label="安装单位" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.INSTALLATION_UNIT_"  ></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="安装位置" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.INSTALL_POSITION_"  ></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="备注" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.REMARK_"  ></el-input>-->
            <!--</el-form-item>-->
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="select-msg-box" >
              <span style="float:left" class="must">进场日期</span>&nbsp;&nbsp;
              <el-date-picker @blur="changtime(form.IN_SITE_DATE_)" style="width:180px;" size="mini" class="select-msg-ele item_content" :clearable="false" :editable="true" v-model="form.IN_SITE_DATE_" type="date" placeholder="选择日期"></el-date-picker>
            </div>
            <!--<el-form-item label="进场日期" :label-width="formLabelWidth">-->
              <!--<el-date-picker @blur="changtime(form.IN_SITE_DATE_)"  :clearable="false" :editable="true" v-model="form.IN_SITE_DATE_" type="date" placeholder="选择日期"></el-date-picker>-->
            <!--</el-form-item>-->
          </el-col>
          <el-col :span="8">
            <div class="select-msg-box" >
              <span style="float:left" class="must">退场日期</span>&nbsp;&nbsp;
              <el-date-picker @blur="changtime(form.OUT_SITE_DATE_)" style="width:180px;" size="mini" class="select-msg-ele item_content" :clearable="false" :editable="true" v-model="form.OUT_SITE_DATE_" type="date" placeholder="选择日期"></el-date-picker>
            </div>
            <!--<el-form-item label="退场日期" :label-width="formLabelWidth">-->
              <!--<el-date-picker @blur="changtimes(form.OUT_SITE_DATE_)" :clearable="false" :editable="true" v-model="form.OUT_SITE_DATE_"  type="date" placeholder="选择日期"></el-date-picker>-->
            <!--</el-form-item>-->
          </el-col>
          <el-col :span="8">
            <div class="select-msg-box" >
              <span style="float:left" class="must">地图选点</span>&nbsp;&nbsp;
              <el-input v-model="form.ADDRESS_" style="width:180px;" size="mini" class="select-msg-ele item_content"  placeholder="请选择" ></el-input>
            </div>
            <!--<el-form-item label="地图选点" :label-width="formLabelWidth">-->
              <!--<el-input v-model="form.ADDRESS_"  ></el-input>-->
            <!--</el-form-item>-->
          </el-col>

          <div style="position:absolute;right:13px;top:22px;">
                <img @click="addressObj.addressVisible=true" style="height:35px;margin-left:7px" src="../../assets/location.png" alt="">
              </div>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="12">
            <div class="contersion">

              <div class="select-msg-box" >
                <span style="float:left" class="must">类型</span>&nbsp;&nbsp;
                <div style="display: flex;width:110px;float:left;">
                  <div  @click="changesite(1)"><input v-model="form.SITE_" name="radio1" type="radio" value="1"/><label>进场</label></div>
                  <div @click="changesite(2)"><input  v-model="form.SITE_" name="radio1" type="radio"  value="2"/><label>退场</label></div>
                </div>

              </div>
              <!--<el-form-item label="类型" :label-width="formLabelWidth">-->

                <!--<div style="display: flex;">-->
                  <!--<div  @click="changesite(1)"><input v-model="form.SITE_" name="radio1" type="radio" value="1"/><label>进场</label></div>-->
                  <!--<div @click="changesite(2)"><input  v-model="form.SITE_" name="radio1" type="radio"  value="2"/><label>退场</label></div>-->
                <!--</div>-->

                <!--&lt;!&ndash;<el-radio v-model="form.SITE_" label="1">进场</el-radio>&ndash;&gt;-->
                <!--&lt;!&ndash;<el-radio v-model="form.SITE_" label="2">退场</el-radio>&ndash;&gt;-->

              <!--</el-form-item>-->
            </div>
          </el-col>
          <el-col :span="12">
            <div class="contersion contersion1">

              <div class="select-msg-box" >
                <span style="float:left" class="must">设备状态</span>&nbsp;&nbsp;
                <div style="display: flex;width:200px;float:left;">
                  <div  @click="changebtn(1)"><input v-model="form.STATUS_" name="radio" type="radio" value="1"/><label>正常</label></div>
                  <div @click="changebtn(2)"><input  v-model="form.STATUS_" name="radio" type="radio"  value="2"/><label>异常</label></div>
                  <div @click="changebtn(3)"><input  v-model="form.STATUS_" name="radio" type="radio" value="3"/><label>维护</label></div>
                </div>
              </div>
              <!--<el-form-item label="设备状态" :label-width="formLabelWidth">-->

                <!--<div style="display: flex;">-->
                  <!--<div  @click="changebtn(1)"><input v-model="form.STATUS_" name="radio" type="radio" value="1"/><label>正常</label></div>-->
                  <!--<div @click="changebtn(2)"><input  v-model="form.STATUS_" name="radio" type="radio"  value="2"/><label>异常</label></div>-->
                  <!--<div @click="changebtn(3)"><input  v-model="form.STATUS_" name="radio" type="radio" value="3"/><label>维护</label></div>-->
                <!--</div>-->
              <!--</el-form-item>-->
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="0">
          <el-col :span="24">

            <div class="select-msg-box" >
              <span style="float:left" class="must">上传图片</span>&nbsp;&nbsp;
              <div style="width:600px;float:left;">
                <uploading  :config="uploadConfig"  ref="seeLoadFile"></uploading>
              </div>
            </div>
            <!--<el-form-item label="上传图片" :label-width="formLabelWidth">-->
              <!---->
            <!--</el-form-item>-->
          </el-col>
        </el-row>
        <!--</el-form>-->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="btnsub">确 定</el-button>
      </div>
    </el-dialog>


    <div v-if="isQRcodeShow">
      <div  class="add-part-box" style="z-index:98"  @click.stop.prevent="QRcodeCancel()"></div>
      <div class="add-part QR-code" style="width:300px;height:376px;z-index:99">
        <span class="el-icon-close" style="position: absolute;top:0;right:0;" @click.stop.prevent="QRcodeCancel()"></span>
        <p style="height:60px;width:100%;text-align: center;line-height: 60px;font-size: 28px;"><i></i>筑筑<s @click.stop.prevent="QRcodeCancel()"></s></p>
        <div class="QR-code-content">
          <div class="QR-code-content-title" style="margin:0 auto 20px;width:220px;background: #fff;height:30px;line-height:30px;font-size:17px;border-radius:15px;">{{$store.state.selectProjectObj.proName}}</div>
          <div class="QR-code-img" style="background: #fff;border-radius: 15px;margin:0 auto;width:140px;height:140px;border-radius:15px;padding:5px;box-sizing:border-box">
            <img :src="QRcodeObj.url" width="100%" height="100%" alt="">
          </div>
          <div class="QR-code-img" style="background:transparent;color:#fff;margin-top: 20px;">设备名称：{{QRcodeObj.name}}</div>
        </div>
        <div style="text-align:right;padding:5px 10px 0 0;box-sizing:border-box;">
          <!--<span>{{QRcodeObj.createUserName}}</span>-->
        </div>
      </div>
    </div>

    <!-- <transition name="fade"> -->
				<ChooseAddress  v-show="addressObj.addressVisible" ref="chooseAddress" :address="addressObj" @chooseAddress="chooseAddress($event)"></ChooseAddress>
		<!-- </transition> -->
  </div>
</template>

<script>
  import asideItems from '@/components/common/asideItem.vue'
  import uploading from '@/components/common/uploading.vue'
  import ChooseAddress from '@/components/common/ChooseAddress.vue'
  export default {
    data(){
      return{
        models:[],
        addressObj:{addressVisible: false},
        deviceArr: [
          {
            addressName: '正常',
            id: '1'
          },
          {
            addressName: '异常',
            id: '2'
          },
          {
            addressName: '维护',
            id: '3'
          },
        ],
        isQRcodeShow:false,
        search:'',
        status:'',
        tableData:[],
        tableDatas:[],
        createType:0,
        createShow:0,
        dialogFormVisible: false,
        dialogFormVisible1: false,
        uploadConfig: {
          limit: 2,//限制附件上传个数
          limitSize: 52428800,//50mb单个附件上传大小
          readOnly: false,//是否只读
          multiple: false,//是否允许多选
          xtype: 'device_'+this.deviceType,//同一个表单区别多个附件上传块
          accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP',//允许上传文件类型
          acceptMsg: '只能传图片',//提示信息
        },
        form: {
          projUid:'',
          // OUT_SITE_DATE_:''
        },
        tableHeightNum:0,
        tableHeightNum1:0,
        form1:{},
        formLabelWidth: '90px',
        currentPage:1,
        currentPage0:1,
        currentPage1:1,
        currentPage2:1,
        parentUid:'',
        directoryName:'',
        sort:'',
        delid:'',
        Selection:false,    //判断是否选中要操作的目录
        pageIndex:1,
        pageSize:10,
        total:0,
        site:'',
        editType:'',
        editType1:'',
        pageIndex0:1,
        pageSize0:10,
        total0:0,
        total1:0,
        total2:0,
        deviceUId:'',
        pageSize1:10,
        pageIndex1:1,
        pageSize2:10,
        pageIndex2:1,
        obj:{},
        delAllId:'',
        delAllId1:'',
        QRcodeObj:{}
      }
    },
    created() {
      this.$bus.on('handelDeparts', this.handelDeparts);
      this.$store.state.selectProjectObj =JSON.parse(this.cookieUtil.get('projectNode'));
      this.getCatalogdata()
    },
    watch:{
      '$store.state.selectProjectObj.id':function(val,oldVal){
        this.getCatalogdata()
      },
      'form.NAME_':()=>{
        console.log('2222')
      }
    },

    beforeDestroy(){
      this.$bus.off('handelDeparts', this.handelDeparts);
    },
    activated(){

    },
    mounted(){
      this.$nextTick(()=>{
        this.tableHeightNum=this.$refs.tablebox.offsetHeight
        this.tableHeightNum1=this.$refs.tablebox1.offsetHeight

      })
    },

    methods:{
      clear(val){

      },
      chooseAddress(data){//选择项目地址回调
        var location =  data.addressLocation;
        this.form.ADDR_LOCATION_ = location;
        this.form.ADDRESS_ = data.address;
        this.form.ADDR_PROVINCE_ = data.province;
        this.form.ADDR_CITY_ = data.city;
        this.form.ADDR_COUNTY_ = data.county;

      },
      changtime(val){
        console.log(val)
        this.form.IN_SITE_DATE_=val;
        this.$forceUpdate();
      },
      changtimes(val){
        console.log(val)
        this.form.OUT_SITE_DATE_=val;
        this.$forceUpdate();
      },
      changetims(data){
        console.log("123"+data)
      },
      changebtn(val){
       console.log(val)
        this.form.STATUS_=val;
       this.$forceUpdate();
      },
      changesite(val){
        this.form.SITE_=val
        this.$forceUpdate();
      },
      QRcode(node){
        this.isQRcodeShow=true;
        this.QRcodeObj=node;
        // this.QRcodeObj.url=encodeURIComponent(this.util.getBaseUrl() + '/api_v1/files/'+this.QRcodeObj.fileId+'/download?access_token='+this.sessionUtil.getAccessToken())
        this.QRcodeObj.url=this.util.getBaseUrl()+"/api_v1/qr?content=http%3A%2F%2Fqy.zhuzhu.biz%2Fgdb%2Fstatic%2Fwechat%2Findex.html%23%2Fdevice%2Fdetail%3Fid="+node.id+"%26projUid="+this.$store.state.selectProjectObj.id+"&access_token="+this.sessionUtil.getAccessToken();

      },
      QRcodeCancel(){
          this.isQRcodeShow=false;
          this.QRcodeObj={};
      },
      getCatalogdata(){   //目录查询
        this.models=[];
        let params={
          pageIndex:1,
          pageSize:10,
          projUid:this.$store.state.selectProjectObj.id
        };
        this.util.restGet('/api_v1/modules/device_manage/directory',params, (res) => {
          if(res.status==200) {
            if(res.data!=undefined){
              this.models = res.data.data;
            }else{
              this.models=[]
            }
          }else{
            this.util.error(res.msg)
          }
        });
      },
      addCatalog(){   //目录新增
        let parentUid=this.parentUid;
        console.log(parentUid)
        if(parentUid==''||parentUid==undefined){
          parentUid='root'
        }
        let params={
          projUid: this.$store.state.selectProjectObj.id,
          parentDirectoryId: parentUid,
          directoryName:this.directoryName ,
          sort: this.sort+1
        };
        this.util.restPost('/api_v1/modules/device_manage/directory',params, (res) => {
          if(res.status==200){
            this.util.successToast('添加成功');
            this.getCatalogdata();
          }else{
            this.util.error(res.msg)
          }
        });
      },
      delCatalog(){    //目录删除
        if(this.delid!=''){
          this.util.restDelete('/api_v1/modules/device_manage/directory/'+this.delid,null, (res) => {
            if(res.status==200){
              this.util.successToast('删除成功');
              this.parentUid='';
              this.getCatalogdata();
            }
          });
        }else{
          this.util.failueToast('请选择需要删除的目录');
        }
      },
      getEquipmentData(){   //设备查询
        let params={
          pageSize:this.pageSize,
          directoryUid:this.delid,
          // directoryUid:'0da1a0db48a94105a94ac793e965e0c2',  //测试
          pageIndex:this.pageIndex,
          site:this.site,
          status:this.status,
          search:this.search,
          projUid:this.$store.state.selectProjectObj.id
          // projUid:'cfa27678e0164beea37027f1173ba99d'  //测试
        };
        this.util.restGet('/api_v1/modules/device_manage/device',params, (res) => {


          if(res.status==200) {
            if(res.data!=undefined){
              for(let i=0;i<res.data.length;i++){
                if(res.data[i].site==1){
                  res.data[i].site='在场'
                }else{
                  res.data[i].site='退场'
                }
                if(res.data[i].status==1){
                  res.data[i].status='正常'
                }else if(res.data[i].status==2){
                  res.data[i].status='异常'
                }else{
                  res.data[i].status='维护'
                }
              }
              this.tableData=res.data;
              this.total=res.totalCount;
            }else{
              this.tableData=[]
            }
          }else{
            this.util.error(res.msg)
          }
        });
      },
      searchType(){ //搜索
        this.getEquipmentData();
      },
      changeStatus(){   //状态搜索
        this.getEquipmentData();
      },
      delEquipment(id){    //设备列表单个单个删除
        this.util.restDelete('/api_v1/modules/device_manage/device/'+id,null,(res)=>{
          if(res.status==200){
            this.util.successToast('删除成功');
            this.getEquipmentData();
          }
        })
      },
      delEquipmentAll(){
        if(this.delAllId!=''){
          this.util.restDelete('/api_v1/modules/device_manage/device?ids='+this.delAllId,null,(res)=>{
            if(res.status==200){
              this.util.successToast('删除成功');
              this.getEquipmentData();
            }
          })
        }else{
          this.util.failueToast('请选择需要删除的设备');
        }
      },
      delEmployAll(){
        if(this.delAllId1!=''){
          // let params={ids:this.delAllId1};
          this.util.restDelete('/api_v1/modules/device_manage/protect?ids='+this.delAllId1,null,(res)=>{
            if(res.status==200){
              this.util.successToast('删除成功');
              this.getEmployData();
            }
          })
        }else{
          this.util.failueToast('请选择需要删除的项');
        }
      },
      handelDeparts(data){
        // console.log('data');
        console.log(data);
        // this.Selection=true;
        this.deviceUId='';
        this.delid=data.id;
        this.parentUid=data.id;
//      this.sort=datarestDelete
        this.getEquipmentData();
      },
      checkFormCode() {
        let params = {
          code: this.form.CODE_,
          projUid: this.$store.state.selectProjectObj.id
        }
        this.util.restGet("/api_v1/modules/device_manage/device/queryDeviceInfoByCode",params,(res)=>{
          if(!res.data) {
            this.util.error('该设备编号已经存在，不可以保存')
            return false;
          }else{
          	  
        this.form.PROJ_UID_=this.$store.state.selectProjectObj.id;
        this.form.DIRECTORY_UID_=this.delid;
          if(this.form.IN_SITE_DATE_==undefined||this.form.IN_SITE_DATE_==''){
            this.form.IN_SITE_DATE_=''
          }else{
            this.form.IN_SITE_DATE_=new Date(this.form.IN_SITE_DATE_).format('yyyy-MM-dd');
          }
          console.log(this.form.OUT_SITE_DATE_)
        if(this.form.OUT_SITE_DATE_==undefined||this.form.OUT_SITE_DATE_==''){
          this.form.OUT_SITE_DATE_=''
        }else{
          this.form.OUT_SITE_DATE_=new Date(this.form.OUT_SITE_DATE_).format('yyyy-MM-dd');
        }
          this.form.sort='0';

        var filesData = new Array();
        for (var i=0;i< this.uploadConfig.filesList.length;i++) {
          var file = this.uploadConfig.filesList[i];
          filesData.push(file);
        }
        var params = {mainFormData:JSON.stringify(this.form),sqlTableName:"DM_DEVICE",filesData: JSON.stringify(filesData), deleteFilesData: JSON.stringify(this.uploadConfig.deleteFilesList),ifSaveWorkflow:false};
        if(this.validUtil.isNotEmpty(this.form.id)){
          params['id']=this.form.id;
          params['businessKey']=this.form.id;
        }
        this.util.restPost("/api_v1/form/business",params,(res)=>{
          if(res.status==200){
            this.util.success('保存成功');
            this.dialogFormVisible=false;
            this.getEquipmentData();
          }else{
            this.util.error(res.msg)
          }
        });
          }
        });
      },
      btnsub(){  //设备新增//编辑
        
        if(this.form.NAME_==''||this.form.NAME_==undefined){
          this.util.failueToast('请填写设备名称');
          return false;
        }
        if(this.form.CODE_==''||this.form.CODE_==undefined){
          this.util.failueToast('请填写设备编号');
          return false;
        }
       
        if(this.form.PRINCIPAL_==''||this.form.PRINCIPAL_==undefined){
          this.util.failueToast('请填写设备负责人');
          return false;
        }
        if(this.form.STATUS_==''||this.form.STATUS_==undefined){
          this.util.failueToast('请填写状态');
          return false;
        }
        if(this.form.SITE_==''||this.form.SITE_==undefined){
          this.util.failueToast('请填写类型');
          return false;
        }
        this.checkFormCode()
      

      },
      getEmployData(){  //使用时长查询//维修护养//维修查询
        if(this.createShow==0){
          let params={
            projUid:this.$store.state.selectProjectObj.id,
            deviceUId: this.deviceUId,
            protectType: "duration",
            pageIndex: this.pageIndex0,
            pageSize:this.pageSize0,
          };
          this.util.restGet('/api_v1/modules/device_manage/protect',params, (res) => {
            console.log(res.data);
            if(res.status==200) {
              if(res.data!=undefined){
                this.tableDatas=res.data.data;
                this.total0=res.totalCount
              }else{
                this.tableDatas=[]
              }
            }else{
              this.util.error(res.msg)
            }
          });
        }else if(this.createShow==1){
          let params={
            projUid:this.$store.state.selectProjectObj.id,
            deviceUId: this.deviceUId,
            protectType: "maintain",
            pageIndex: this.pageIndex1,
            pageSize:this.pageSize1,
          };
          this.util.restGet('/api_v1/modules/device_manage/protect',params, (res) => {
            if(res.status==200) {
              if(res.data!=undefined){
                this.tableDatas=res.data.data;
                this.total1=res.totalCount
              }else{
                this.tableDatas=[]
              }
            }else{
              this.util.error(res.msg)
            }
          });
        }else{
          let params={
            projUid:this.$store.state.selectProjectObj.id,
            deviceUId: this.deviceUId,
            protectType: "repair",
            pageIndex: this.pageIndex2,
            pageSize:this.pageSize2,
          };
          this.util.restGet('/api_v1/modules/device_manage/protect',params, (res) => {
            if(res.status==200) {
              if(res.data!=undefined){
                this.tableDatas=res.data.data;
                this.total2=res.totalCount
              }else{
                this.tableDatas=[]
              }
            }else{
              this.util.error(res.msg)
            }
          });
        }
      },
      employSub(){  //时长，保养，维修新增，编辑
        this.form1.projUid=this.$store.state.selectProjectObj.id;
        this.form1.deviceUId=this.deviceUId;

        if(this.createShow==0){
          if(this.form1.date==''||this.form1.date==undefined){
            this.util.failueToast('请选择日期');
            return false;
          }
          if(this.form1.hour==''||this.form1.hour==undefined){
            this.util.failueToast('请填写小时');
            return false;
          }
          if(this.form1.minute==''||this.form1.minute==undefined){
            this.util.failueToast('请填写分钟');
            return false;
          }

          let reg = /^\+?[1-9][0-9]*$/;
          if(!reg.test(this.form1.minute)){
            this.util.failueToast('请填写正确的分钟,只能输入整数');
            return false;
          }
          if(!reg.test(this.form1.hour)){
            this.util.failueToast('请填写正确的小时，只能输入整数');
            return false;
          }
          this.form1.date=new Date(this.form1.date).format('yyyy-MM-dd');
          if(this.editType1=='add'){
            this.form1.protectType='duration';

            // this.form1.recorder=this.sessionUtil.getUserName();
            // this.form1.recorderUid=this.sessionUtil.getUserId();
            this.form1.sort='0'
            let params=this.form1;
            this.util.restPost('/api_v1/modules/device_manage/protect',params,(res)=>{
              if(res.status==200){
                this.util.successToast('新增成功');
                this.dialogFormVisible1=false;
                this.getEmployData();
              }
            })
          }else{
            let params=this.form1;
            this.util.restPut('/api_v1/modules/device_manage/protect/'+this.form1.id,params,(res)=>{
              if(res.status==200){
                this.util.successToast('编辑成功');
                this.dialogFormVisible1=false;
                this.getEmployData();
              }
            })
          }
        }else if(this.createShow==1){
          if(this.form1.date==''||this.form1.date==undefined){
            this.util.failueToast('请选择日期');
            return false;
          }
          this.form1.date=new Date(this.form1.date).format('yyyy-MM-dd');
          if(this.editType1=='add') {
            this.form1.protectType = 'maintain';
            // this.form1.recorder=this.sessionUtil.getUserName();
            // this.form1.recorderUid=this.sessionUtil.getUserId();
            this.form1.sort='0'
            let params = this.form1;
            this.util.restPost('/api_v1/modules/device_manage/protect', params, (res) => {
              if (res.status == 200) {
                this.util.successToast('新增成功');
                this.dialogFormVisible1 = false;
                this.getEmployData();
                this.getEquipmentData();
              }
            })
          }else{
            let params=this.form1;
            this.util.restPut('/api_v1/modules/device_manage/protect/'+this.form1.id,params,(res)=>{
              if(res.status==200){
                this.util.successToast('编辑成功');
                this.dialogFormVisible1=false;
                this.getEmployData();
                this.getEquipmentData();
              }
            })
          }
        }else if(this.createShow==2){
          if(this.form1.date==''||this.form1.date==undefined){
            this.util.failueToast('请选择日期');
            return false;
          }
          this.form1.date=new Date(this.form1.date).format('yyyy-MM-dd');
          if(this.editType1=='add') {
            this.form1.protectType = 'repair';
            // this.form1.recorder=this.sessionUtil.getUserName();
            // this.form1.recorderUid=this.sessionUtil.getUserId();
            this.form1.sort='0'
            let params = this.form1;
            this.util.restPost('/api_v1/modules/device_manage/protect', params, (res) => {
              if (res.status == 200) {
                this.util.successToast('新增成功');
                this.dialogFormVisible1 = false;
                this.getEmployData();
                this.getEquipmentData();
              }
            })
          }else{
            let params=this.form1;
            this.util.restPut('/api_v1/modules/device_manage/protect/'+this.form1.id,params,(res)=>{
              if(res.status==200){
                this.util.successToast('编辑成功');
                this.dialogFormVisible1=false;
                this.getEmployData();
                this.getEquipmentData();
              }
            })
          }
        }


      },
      delemploy(id){   //时长，维修删除
        this.util.restDelete('/api_v1/modules/device_manage/protect/'+id,null,(res)=>{
          if(res.status==200){
            this.util.successToast('删除成功');
            this.getEmployData();
          }
        })
      },
      changeradio(num){
        this.form1.status=num;
       this.$forceUpdate();
      },
      close(){
        this.dialogFormVisible=false;
      },
      openAdd(){
        if(this.delid!=''){
          this.form={};
          this.editType='add'
          this.dialogFormVisible=true;
          this.form.IN_SITE_DATE_=new Date().format('yyyy-MM-dd');
          this.$nextTick(()=>{
            this.$refs.seeLoadFile.clearArr()
          })
        }else{
          this.util.failueToast('请先选择目录');
        }
      },
      employopen(){
        if(this.deviceUId!=''){
          this.form1={};
          this.editType1='add';

          if(this.createShow!=0){
            this.form1.status=this.obj.status == '正常' ? 1 : this.obj.status == '异常' ? 2 : 3;
            this.form1.specification=this.obj.specification;
            this.form1.name=this.obj.name;
            if(this.obj.status){
              this.changeradio(this.form1.status)
            }
            this.$forceUpdate()
          }
          this.dialogFormVisible1=true;
        }else{
          this.util.failueToast('请先选择设备');
        }
      },
      employclose(){
        this.dialogFormVisible1=false;
      },
      handleSelectionChange(val){
        this.delAllId='';
        if(val.length>0){
          for(let i=0;i<val.length;i++){
            this.delAllId+=val[i].id+','
          }
          this.delAllId=this.delAllId.slice(0,this.delAllId.length-1);
        }
        console.log(this.delAllId)
      },
      handleSelectionChange1(val){
        this.delAllId1='';
        if(val.length>0){
          for(let i=0;i<val.length;i++){
            this.delAllId1+=val[i].id+','
          }
          this.delAllId1=this.delAllId1.slice(0,this.delAllId1.length-1);
        }
        console.log(this.delAllId1)
      },
      handleCurrentclick(val){
        this.obj.name=val.name;
        this.obj.specification=val.specification;
        this.obj.status=val.status;
        this.deviceUId=val.id;
        this.createShow=0;
        this.getEmployData();
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        this.pageIndex=val;
        this.getEquipmentData();
      },
      handleCurrentChange0(val) {
        this.pageIndex0=val;
        this.getEmployData();
      },
      handleCurrentChange1(val) {
        this.pageIndex1=val;
        this.getEmployData();
      },
      handleCurrentChange2(val) {
        this.pageIndex2=val;
        this.getEmployData();
      },
      remove(index, rows){
        let id=rows[index].id;
        this.openall(id);

      },
      remove1(index, rows){
        let id=rows[index].id;
        this.delall(id)

      },
      edit(index, rows){
        this.form={}
        this.dialogFormVisible=true;
        this.uploadConfig.filesList=[];
        this.$nextTick(()=> {
          this.$refs.seeLoadFile.clearArr();
        });
        this.getFiledata(rows[index].id);
      },
      getFiledata(id){
        this.util.restGet('/api_v1/modules/device_manage/device/'+id,null,(res)=>{
          if(res.status==200){
            this.form.NAME_=res.data.name;
            this.form.CODE_=res.data.code;
            this.form.SPECIFICATION_=res.data.specification;
            this.form.PRODUCE_FACTORY_=res.data.produceFactory;
            this.form.INSTALLATION_UNIT_=res.data.installationUnit;
            this.form.IN_SITE_DATE_=res.data.inSiteDate;
            this.form.OUT_SITE_DATE_=res.data.outSiteDate;
            this.form.INSTALL_POSITION_=res.data.installPosition;
            this.form.BRAND_=res.data.brand;
            this.form.PRINCIPAL_=res.data.principal;
            this.form.PRINCIPAL_PHONE_=res.data.principalPhone;
            this.form.ACCEPTANCE_=res.data.acceptance;
            this.form.ACCEPTANCE_PHONE_=res.data.acceptancePhone;
            this.form.SITE_=res.data.site;
            console.log(res.data.status)
            this.form.STATUS_=res.data.status;
            this.form.REMARK_=res.data.remark;
            this.form.ADDRESS_=res.data.address;
            this.form.COMPANY_=res.data.company;
            this.form.SUB_COMPANY_=res.data.subCompany;
            this.form.SORT_=res.data.sort;
            this.form.id=res.data.id;
            this.$nextTick(()=>{
              this.$refs.seeLoadFile.loadData(res.data.id)
            })
            this.$forceUpdate();
          }
        })
      },
      edit1(index, rows){
        console.log(rows[index])
        this.form1={};
        this.form1=rows[index];
        delete this.form1.updateTime;
        delete this.form1.createTime;
        this.editType1='edit';
        this.dialogFormVisible1=true;
        if(this.createShow!=0){
          if(this.obj.status=='正常'){
            this.obj.status=1
          }else if(this.obj.status=='异常'){
            this.obj.status=2
          }else{
            this.obj.status=3
          }
          this.form1.name=this.obj.name;
          this.form1.status=this.obj.status;
          this.form1.specification=this.obj.specification;
          console.log(this.form1.status);
        }
      },
      changeType(num){
        this.createType=num;
        if(this.createType==1){
           this.site=1
          this.getEquipmentData();
        }else if(this.createType==2){
          this.site=2
          this.getEquipmentData();
        }else{
          this.site=''
          this.getEquipmentData();
        }
      },
      changeShow(num){
        this.createShow=num;
        this.getEmployData();
      },
      delone(){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delEmployAll();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      delall(id){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delemploy(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      openone(){
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delEquipmentAll();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      openall(id) {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delEquipment(id);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      open2() {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.delCatalog();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
      },
      open3() {
        // if(this.Selection==true){
          this.$prompt('目录名称', '目录', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
          }).then(({ value }) => {
            if(value==undefined||value==''){
              this.util.failueToast('目录名称不能为空');
              return false
            }
            this.directoryName=value;
            this.addCatalog();
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消新增'
            });
          });
      },
    },
    components:{
      asideItems,uploading,ChooseAddress
    }
  }
</script>

<style scoped>
  .context-r{
    height:100%;
    overflow: hidden;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .QR-code-img {
    /*background: #5c9ad4;*/
  }
  .QR-code-content{
    background: #5c9ad4;
    height:284px;
    width:100%;
    padding-top: 30px;
    box-sizing: border-box;
  }
  .conter_right{
    float: right;
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    width:100%;
    box-sizing: border-box;
    padding:10px 0 10px 14px;
    position: relative;
    overflow: auto;
   height: 100%;
  }
  .conter_right_header{
    overflow: hidden;
  }
  .add-part{
    padding:0;
  }
  .conter_bot{
    float: right;
    box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
    width:100%;
    box-sizing: border-box;
    padding:10px 0 10px 14px;
    position: relative;
    min-height: 50%;
    overflow: auto;
  }
  .operation span{
    display: inline-block;
    margin:2px;
  }
.equipmentIndex{
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 0 10px ;
  color: #44D2FF;
  font-size: 14px;
  padding-top: 46px;
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
.tabs{
  width: 100%;
  height: 36px;
  border: 1px solid #44D2FF ;
  box-sizing: border-box;
  padding: 0 10px;
  text-align: center;
}
.tabs>span{
  width: 78px;
  float: left;
  height: 26px;
  line-height: 26px;
  margin-top: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 12px;
  color:#fff;
}
.tabs>.active{
  background: url(../../assets/indexImg/select.png) no-repeat  top center;
}
.active{
  background: url(../../assets/indexImg/select.png) no-repeat  top center;
}
.conter{
  height:100%;
  box-sizing: border-box;
  overflow: auto;
}
.conter_left{
  float: left;
  width:300px;
  box-shadow:inset 0 0 15px 0 rgba(68,210,255,1);
  padding:13px 0 13px 14px;
  position: relative;
  box-sizing: border-box;
  min-height: 100%;
}
  .QR-code p i{
    display: inline-block;
    width: 32px;
    height: 32px;
    background: url(../../assets/indexImg/Bitmap.png) no-repeat center;
    vertical-align: sub;
    margin-right: 3px;
    border-radius: 50%;
    background-size: 100%;
  }
.clear::after{
  content:"";
  height:0;
  line-height: 0;
  display: block;
  visibility: hidden;
  clear: both;
}
.title_left{
  float: left;
}
.must{
  width:70px;
}
.title_left h4{
  margin-bottom: 0;
}
.title_right{
  float: right;
}
.title_right button{
  padding:4px 10px;
}
.conter_left_title{
  margin-bottom: 14px;
  padding-right: 14px;
}
.aside-box {
  text-align: left;
}
.conter_right_title h4{
  margin-bottom: 0;
}
.con_left{
  float: left;
}
.con_right{
  float: right;
}
.con_left span{
  width: 78px;
  float: left;
  height: 26px;
  line-height: 26px;
  margin-top: 4px;
  cursor: pointer;
  margin-bottom: 10px;
  margin-right: 12px;
  color:#fff;
}
.con_right{
  padding-top: 5px;
}
.con_right_on1{
  float: right;
  margin-left: 20px;
}
.con_right_on2{
  float: right;
}
.con_right_on3{
  float: right;
  margin-left: 20px;
  box-sizing: border-box;
}
.con_right_on3 span{
  display: inline-block;
  margin-right:6px;
}
  .btn_search{
    height:26px;
    width:48px;
    text-align: center;
    line-height: 26px;
    font-size: 14px;
    color:rgba(255,253,244,1);
    background: rgba(68,210,255,0.2);
    display: inline-block;
  }
  .tab{
    padding:0 9px;
    box-sizing: border-box;
  }

</style>
<style>
 .equipmentIndex .con_right_on2 .el-select{
    background-color: rgba(255,255,255,0.2);
    width:100px;
  }
 .equipmentIndex .con_right_on2 .el-input--mini .el-input__inner{
   height:26px;
 }
 .equipmentIndex .con_right_on1  .el-input{
    width:150px;
    height:24px;
    border:1px solid rgba(68,210,255,1);
  }
 .equipmentIndex .con_right_on1  .el-input__icon{
    line-height: 29px;
  }
 .equipmentIndex .tab .el-table td,.equipmentIndex .el-table th.is-leaf{
   text-align: center;
   background: rgba(68,210,255,0.2);
 }
 .equipmentIndex .el-form-item__content{
   border:1px solid rgba(212,212,212,1);
   background: rgba(244,244,244,1);

 }
 .equipmentIndex .el-form-item__label{
   text-align: left;
 }
 .equipmentIndex .bg .el-input__inner{
   color:rgba(51,51,51,1);
 }
 .equipmentIndex .serach  .el-input__inner{
   color:#fff !important;
 }
 .equipmentIndex .el-form-item__content,.equipmentIndex .el-form-item__label{
   line-height: 38px;
   background: #fff;

 }
 .equipmentIndex .el-form-item{
   margin-bottom: 6px;
 }
 .equipmentIndex .contersion .el-form-item__content{
    border:none;
    background:transparent;
    text-align: left;
  }
 .equipmentIndex .contersion1  .el-form-item__label{
    text-align: center;
  }
 .equipmentIndex .dates .el-date-editor.el-input{
    width:100%;
  }
 .equipmentIndex .Use .el-dialog{
    width:30%;
  }
 .equipmentIndex .el-pagination{
    text-align: right;
  }
 .equipmentIndex .el-pagination__total{
    color:#fff;
  }
 .block .el-pagination .el-select .el-input .el-input__inner{
   color:#fff;
 }
 .block .el-pagination button,.block .el-pagination span:not([class*=suffix]){
   color:#fff;
 }
 .block .el-pagination__editor.el-input .el-input__inner{
   color:#fff;
 }
  .block .el-icon el-icon-arrow-left{
    color:#000;
  }
  .block .el-pagination .btn-next .el-icon,.block .el-pagination .btn-prev .el-icon{
    color:#000;
  }
  #sss  .el-input__inner{
    color:#000 !important;
  }
 #sss .el-dialog__body{
   padding:0 15px;
 }
  .Use .el-input__inner{
    color:#000 !important;
  }
 .equipmentIndex .el-table td,.equipmentIndex .el-table th{
   padding:3px 0;
 }
 /*.equipmentIndex .el-date-editor.el-input,.equipmentIndex .el-date-editor.el-input__inner{*/
   /*width:100% !important;*/
 /*}*/
 .equipmentIndex .el-dialog{
   width:900px;
 }
</style>
